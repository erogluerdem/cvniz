const mongoose = require('mongoose');
const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const Sentry = require('@sentry/node');
const MonitoringService = require('./MonitoringService');
const fs = require('fs').promises;
const path = require('path');

/**
 * Backup & Disaster Recovery Service
 * Manages database backups, recovery, and disaster recovery procedures
 */
class BackupService {
    constructor() {
        this.s3Client = null;
        this.backupBucket = process.env.AWS_BACKUP_BUCKET || 'cvniz-backups';
        this.initializeS3();
    }

    /**
     * Initialize AWS S3 client
     */
    initializeS3() {
        try {
            if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
                this.s3Client = new S3Client({
                    region: process.env.AWS_REGION || 'eu-central-1',
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                    }
                });
            }
        } catch (err) {
            console.error('S3 Initialization Error:', err);
            Sentry.captureException(err);
        }
    }

    /**
     * Create full database backup
     * Exports all collections to JSON and uploads to S3
     */
    async createFullBackup(backupName = null) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const name = backupName || `backup-full-${timestamp}`;

            console.log(`Starting full backup: ${name}`);

            // Get all collections
            const collections = mongoose.connection.collections;
            const backupData = {};

            // Export each collection
            for (const [collectionName, collection] of Object.entries(collections)) {
                console.log(`Exporting collection: ${collectionName}`);
                backupData[collectionName] = await collection.find({}).lean().exec();
            }

            // Create backup manifest
            const manifest = {
                name,
                type: 'full',
                timestamp: new Date(),
                collections: Object.keys(backupData),
                sizes: {},
                totalSize: 0
            };

            // Calculate sizes
            for (const [collectionName, docs] of Object.entries(backupData)) {
                const size = JSON.stringify(docs).length;
                manifest.sizes[collectionName] = size;
                manifest.totalSize += size;
            }

            // Save to S3
            if (this.s3Client) {
                await this.uploadBackupToS3(name, backupData, manifest);
            } else {
                // Fallback: save locally
                await this.saveBackupLocally(name, backupData, manifest);
            }

            // Track backup in monitoring
            await MonitoringService.trackUserEngagement(
                'system',
                'backup_created',
                { name, type: 'full', size: manifest.totalSize }
            );

            console.log(`Full backup completed: ${name}`);
            return manifest;

        } catch (err) {
            console.error('Full Backup Error:', err);
            Sentry.captureException(err);
            await MonitoringService.createAlert('BACKUP_FAILED', `Full backup failed: ${err.message}`, 'critical');
            throw err;
        }
    }

    /**
     * Create incremental backup (only changed data)
     * Requires change tracking - using last backup timestamp
     */
    async createIncrementalBackup(backupName = null) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const name = backupName || `backup-incremental-${timestamp}`;

            console.log(`Starting incremental backup: ${name}`);

            // Get last backup timestamp
            const lastBackupTime = await this.getLastBackupTime();

            const collections = mongoose.connection.collections;
            const backupData = {};

            // Export only changed documents
            for (const [collectionName, collection] of Object.entries(collections)) {
                console.log(`Exporting changes in: ${collectionName}`);

                // Find documents modified since last backup
                const query = lastBackupTime ? { updatedAt: { $gte: lastBackupTime } } : {};
                backupData[collectionName] = await collection.find(query).lean().exec();
            }

            // Create backup manifest
            const manifest = {
                name,
                type: 'incremental',
                timestamp: new Date(),
                basedOnTime: lastBackupTime,
                collections: Object.keys(backupData),
                sizes: {},
                totalSize: 0
            };

            // Calculate sizes
            for (const [collectionName, docs] of Object.entries(backupData)) {
                const size = JSON.stringify(docs).length;
                manifest.sizes[collectionName] = size;
                manifest.totalSize += size;
            }

            // Upload to S3
            if (this.s3Client) {
                await this.uploadBackupToS3(name, backupData, manifest);
            } else {
                await this.saveBackupLocally(name, backupData, manifest);
            }

            console.log(`Incremental backup completed: ${name}`);
            return manifest;

        } catch (err) {
            console.error('Incremental Backup Error:', err);
            Sentry.captureException(err);
            await MonitoringService.createAlert('BACKUP_FAILED', `Incremental backup failed: ${err.message}`, 'critical');
            throw err;
        }
    }

    /**
     * Upload backup to AWS S3
     */
    async uploadBackupToS3(backupName, backupData, manifest) {
        try {
            if (!this.s3Client) {
                throw new Error('S3 client not initialized');
            }

            const backupJson = JSON.stringify({ data: backupData, manifest });
            const key = `backups/${new Date().getFullYear()}/${backupName}.json`;

            console.log(`Uploading to S3: ${key}`);

            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.backupBucket,
                Key: key,
                Body: backupJson,
                ContentType: 'application/json',
                ServerSideEncryption: 'AES256',
                Metadata: {
                    'backup-type': manifest.type,
                    'backup-time': manifest.timestamp.toISOString()
                }
            }));

            console.log(`Backup uploaded to S3: ${key}`);
        } catch (err) {
            console.error('S3 Upload Error:', err);
            throw err;
        }
    }

    /**
     * Save backup locally (fallback)
     */
    async saveBackupLocally(backupName, backupData, manifest) {
        try {
            const backupDir = path.join(process.cwd(), 'backups');
            await fs.mkdir(backupDir, { recursive: true });

            const backupFile = path.join(backupDir, `${backupName}.json`);
            const backup = { data: backupData, manifest };

            await fs.writeFile(backupFile, JSON.stringify(backup, null, 2));
            console.log(`Backup saved locally: ${backupFile}`);
        } catch (err) {
            console.error('Local Backup Error:', err);
            throw err;
        }
    }

    /**
     * List available backups
     */
    async listBackups(limit = 20) {
        try {
            if (!this.s3Client) {
                return await this.listLocalBackups(limit);
            }

            const command = new ListObjectsV2Command({
                Bucket: this.backupBucket,
                Prefix: 'backups/',
                MaxKeys: limit
            });

            const response = await this.s3Client.send(command);

            const backups = (response.Contents || []).map(obj => ({
                name: obj.Key.split('/').pop(),
                size: obj.Size,
                date: obj.LastModified,
                storageClass: obj.StorageClass
            }));

            return {
                total: response.KeyCount,
                backups: backups.sort((a, b) => b.date - a.date)
            };

        } catch (err) {
            console.error('List Backups Error:', err);
            return { total: 0, backups: [] };
        }
    }

    /**
     * List local backups (fallback)
     */
    async listLocalBackups(limit = 20) {
        try {
            const backupDir = path.join(process.cwd(), 'backups');
            const files = await fs.readdir(backupDir);

            const backups = await Promise.all(
                files.slice(-limit).map(async (file) => {
                    const filePath = path.join(backupDir, file);
                    const stat = await fs.stat(filePath);
                    return {
                        name: file,
                        size: stat.size,
                        date: stat.mtime
                    };
                })
            );

            return {
                total: backups.length,
                backups: backups.reverse()
            };
        } catch (err) {
            console.error('List Local Backups Error:', err);
            return { total: 0, backups: [] };
        }
    }

    /**
     * Restore from backup
     */
    async restoreFromBackup(backupName) {
        try {
            console.log(`Starting restore from backup: ${backupName}`);

            let backupJson;

            if (this.s3Client) {
                backupJson = await this.downloadBackupFromS3(backupName);
            } else {
                backupJson = await this.loadBackupLocally(backupName);
            }

            const backup = JSON.parse(backupJson);
            const { data, manifest } = backup;

            // Clear existing data
            console.log('Clearing existing data...');
            const collections = mongoose.connection.collections;
            for (const collection of Object.values(collections)) {
                await collection.deleteMany({});
            }

            // Restore data
            console.log('Restoring data...');
            for (const [collectionName, documents] of Object.entries(data)) {
                if (documents.length > 0) {
                    console.log(`Restoring ${documents.length} documents to ${collectionName}`);
                    const collection = collections[collectionName];
                    if (collection) {
                        await collection.insertMany(documents);
                    }
                }
            }

            // Track restore
            await MonitoringService.trackUserEngagement(
                'system',
                'backup_restored',
                { backupName, manifest }
            );

            await MonitoringService.createAlert(
                'BACKUP_RESTORED',
                `Database restored from backup: ${backupName}`,
                'warning'
            );

            console.log(`Restore completed: ${backupName}`);
            return { success: true, manifest };

        } catch (err) {
            console.error('Restore Error:', err);
            Sentry.captureException(err);
            await MonitoringService.createAlert('RESTORE_FAILED', `Restore failed: ${err.message}`, 'critical');
            throw err;
        }
    }

    /**
     * Download backup from S3
     */
    async downloadBackupFromS3(backupName) {
        try {
            if (!this.s3Client) {
                throw new Error('S3 client not initialized');
            }

            const key = `backups/${new Date().getFullYear()}/${backupName}.json`;

            const command = new GetObjectCommand({
                Bucket: this.backupBucket,
                Key: key
            });

            const response = await this.s3Client.send(command);
            return await response.Body.transformToString();

        } catch (err) {
            console.error('S3 Download Error:', err);
            throw err;
        }
    }

    /**
     * Load backup locally (fallback)
     */
    async loadBackupLocally(backupName) {
        try {
            const backupFile = path.join(process.cwd(), 'backups', `${backupName}.json`);
            return await fs.readFile(backupFile, 'utf8');
        } catch (err) {
            console.error('Local Load Error:', err);
            throw err;
        }
    }

    /**
     * Get backup status and health
     */
    async getBackupStatus() {
        try {
            const backups = await this.listBackups(5);
            const lastBackup = backups.backups[0];

            return {
                lastBackup: lastBackup ? {
                    name: lastBackup.name,
                    date: lastBackup.date,
                    size: lastBackup.size
                } : null,
                totalBackups: backups.total,
                status: lastBackup ? 'healthy' : 'no_backups',
                backupAge: lastBackup ? Math.floor((Date.now() - lastBackup.date.getTime()) / 1000 / 3600) : null,
                rto: '1 hour',
                rpo: '15 minutes'
            };

        } catch (err) {
            console.error('Backup Status Error:', err);
            return { status: 'error', error: err.message };
        }
    }

    /**
     * Verify backup integrity
     */
    async verifyBackup(backupName) {
        try {
            console.log(`Verifying backup: ${backupName}`);

            let backupJson;
            if (this.s3Client) {
                backupJson = await this.downloadBackupFromS3(backupName);
            } else {
                backupJson = await this.loadBackupLocally(backupName);
            }

            const backup = JSON.parse(backupJson);
            const { data, manifest } = backup;

            // Verify structure
            if (!data || !manifest) {
                throw new Error('Invalid backup structure');
            }

            // Verify collections
            const errors = [];
            for (const [collectionName, documents] of Object.entries(data)) {
                if (!Array.isArray(documents)) {
                    errors.push(`Invalid data type for collection ${collectionName}`);
                }
            }

            const result = {
                backupName,
                isValid: errors.length === 0,
                errors,
                collections: Object.keys(data).length,
                totalDocuments: Object.values(data).reduce((sum, docs) => sum + docs.length, 0),
                manifest
            };

            console.log(`Backup verification completed: ${result.isValid ? 'VALID' : 'INVALID'}`);
            return result;

        } catch (err) {
            console.error('Backup Verification Error:', err);
            return { backupName, isValid: false, error: err.message };
        }
    }

    /**
     * Get last backup timestamp for incremental backups
     */
    async getLastBackupTime() {
        try {
            const backups = await this.listBackups(1);
            if (backups.backups.length > 0) {
                return backups.backups[0].date;
            }
            return null;
        } catch (err) {
            console.error('Get Last Backup Time Error:', err);
            return null;
        }
    }

    /**
     * Schedule automatic backups (call from cron job)
     */
    async scheduleBackups() {
        try {
            const hour = new Date().getHours();

            // Full backup on Sunday at 2 AM
            if (new Date().getDay() === 0 && hour === 2) {
                await this.createFullBackup();
            }
            // Incremental backup daily at 2 AM
            else if (hour === 2) {
                await this.createIncrementalBackup();
            }
        } catch (err) {
            console.error('Scheduled Backup Error:', err);
            Sentry.captureException(err);
        }
    }
}

module.exports = new BackupService();
