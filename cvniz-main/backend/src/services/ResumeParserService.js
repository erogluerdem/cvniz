/**
 * Resume Parser Service
 * Extract data from PDF/Word files using AI
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const Sentry = require('@sentry/node');
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middleware/auth');
const { recordEvent } = require('../utils/logger');

// Multer Configuration
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf' && ext !== '.docx' && ext !== '.doc' && ext !== '.txt') {
            return cb(new Error('Sadece PDF, DOCX ve TXT dosyaları desteklenir.'));
        }
        cb(null, true);
    }
});

/**
 * Resume Parser Service Class
 */
class ResumeParserService {
    /**
     * Parse resume file (PDF, Word or TXT)
     * @param {string} filePath - Path to the uploaded file
     * @param {string} userId - ID of the user
     */
    static async parseResume(filePath, userId) {
        try {
            // 1. Extract raw text from file
            const fileContent = await ResumeParserService.extractText(filePath);

            // 2. Parse extracted text using AI
            const parsedData = await ResumeParserService.parseText(fileContent);

            // 3. Log the event
            recordEvent('resume_parsed', {
                userId,
                fileName: path.basename(filePath),
                confidence: parsedData.confidence
            });

            // 4. Cleanup: Delete temporary file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            return {
                success: true,
                data: parsedData
            };

        } catch (error) {
            // Cleanup on error too
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            Sentry.captureException(error, { tags: { feature: 'resume_parser' } });
            throw error;
        }
    }

    /**
     * Extract text based on file extension
     */
    static async extractText(filePath) {
        const ext = filePath.split('.').pop().toLowerCase();

        if (ext === 'pdf') {
            return await ResumeParserService.extractFromPDF(filePath);
        } else if (ext === 'docx') {
            return await ResumeParserService.extractFromDOCX(filePath);
        } else if (ext === 'txt') {
            return fs.readFileSync(filePath, 'utf-8');
        } else if (ext === 'doc') {
            throw new Error('Eski .doc formatı desteklenmiyor. Lütfen .docx olarak kaydedin.');
        } else {
            throw new Error('Desteklenmeyen dosya formatı.');
        }
    }

    /**
     * Extract text from PDF
     */
    static async extractFromPDF(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            throw new Error(`PDF okuma hatası: ${error.message}`);
        }
    }

    /**
     * Extract text from DOCX
     */
    static async extractFromDOCX(filePath) {
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } catch (error) {
            throw new Error(`Word (DOCX) okuma hatası: ${error.message}`);
        }
    }

    /**
     * Call AI Service to transform text into structured JSON
     */
    static async parseText(text) {
        try {
            const { AIService } = require('./AIService');
            const aiService = new AIService();

            const parsed = await aiService.parseResume(text);

            if (parsed.error === 'AI_NOT_CONFIGURED') {
                throw new Error('Yapay zeka servisi yapılandırılmamış. Lütfen yönetici panelinden API anahtarını kontrol edin.');
            }

            if (!parsed || parsed.error) {
                throw new Error('CV ayrıştırılamadı. Lütfen metnin okunabilirliğini kontrol edin.');
            }

            return parsed;
        } catch (error) {
            console.error('AI Parse Error:', error);
            throw error;
        }
    }
}

/**
 * API Routes
 */

// POST /api/resume-parser/upload
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Dosya yüklenemedi.' });
        }

        const userId = req.user?.id || req.user?._id;
        const result = await ResumeParserService.parseResume(
            req.file.path,
            userId
        );

        res.json(result);
    } catch (error) {
        console.error('Parse Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    router,
    ResumeParserService
};
