const cron = require('node-cron');
const CacheService = require('./CacheService');

/**
 * Scheduler Service
 * Handles automated background tasks like cache clearing and backups.
 */
class SchedulerService {
    constructor() {
        this.tasks = [];
    }

    /**
     * Initialize all scheduled tasks
     */
    init() {
        console.log('⏰ Scheduler Service başlatılıyor...');

        // Schedule: Every day at 00:00 (Midnight)
        // Cron pattern: minute hour day-of-month month day-of-week
        const dailyCacheClear = cron.schedule('0 0 * * *', async () => {
            console.log('📅 [Cron] Günlük cache temizliği başlatılıyor...');
            try {
                await CacheService.flush();
                console.log('✅ [Cron] Günlük cache başarıyla temizlendi');
            } catch (error) {
                console.error('❌ [Cron] Günlük cache temizleme hatası:', error.message);
            }
        });

        this.tasks.push({
            name: 'Daily Cache Flush',
            schedule: '0 0 * * *',
            task: dailyCacheClear
        });

        console.log('✅ Scheduler Service hazır. Aktif görevler:', this.tasks.length);
    }

    /**
     * Stop all scheduled tasks
     */
    stopAll() {
        this.tasks.forEach(t => t.task.stop());
        console.log('🛑 Scheduler Service durduruldu.');
    }
}

module.exports = new SchedulerService();
