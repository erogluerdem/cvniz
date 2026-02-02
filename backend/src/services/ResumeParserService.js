/**
 * Resume Parser Service
 * Extract data from PDF/Word files using OCR and NLP
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');
const CV = require('../models/CV');
const User = require('../models/User');

/**
 * Resume Parser Service Class
 */
class ResumeParserService {
    /**
     * Parse resume file (PDF or Word)
     */
    static async parseResume(filePath, userId) {
        try {
            const fileContent = await ResumeParserService.extractText(filePath);

            // Parse extracted text using NLP
            const parsedData = await ResumeParserService.parseText(fileContent);

            // Save to database
            const cv = await CV.create({
                userId,
                title: parsedData.title,
                personalInfo: parsedData.personalInfo,
                experience: parsedData.experience,
                education: parsedData.education,
                skills: parsedData.skills,
                certifications: parsedData.certifications,
                languages: parsedData.languages,
                projects: parsedData.projects,
                summary: parsedData.summary,
                metadata: {
                    parseMethod: 'ai_parser',
                    confidence: parsedData.confidence,
                    parseTime: new Date()
                }
            });

            recordEvent('resume_parsed', {
                userId,
                cvId: cv._id,
                fileName: filePath,
                confidence: parsedData.confidence
            });

            return {
                success: true,
                cvId: cv._id,
                data: parsedData
            };

        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'resume_parser' } });
            throw error;
        }
    }

    /**
     * Extract text from file
     */
    static async extractText(filePath) {
        try {
            const ext = filePath.split('.').pop().toLowerCase();

            if (ext === 'pdf') {
                return await ResumeParserService.extractFromPDF(filePath);
            } else if (ext === 'docx') {
                return await ResumeParserService.extractFromDOCX(filePath);
            } else if (ext === 'doc') {
                return await ResumeParserService.extractFromDOC(filePath);
            } else {
                throw new Error('Unsupported file format');
            }
        } catch (error) {
            Sentry.captureException(error);
            throw error;
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
            throw new Error(`PDF parsing failed: ${error.message}`);
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
            throw new Error(`DOCX parsing failed: ${error.message}`);
        }
    }

    /**
     * Extract text from DOC (convert to DOCX first)
     */
    static async extractFromDOC(filePath) {
        // Use Aspose or similar API to convert DOC to DOCX
        // For now, throw error
        throw new Error('DOC format not directly supported. Convert to DOCX.');
    }

    /**
     * Parse extracted text using NLP
     */
    static async parseText(text) {
        try {
            const parsed = {
                title: '',
                personalInfo: {
                    fullName: '',
                    email: '',
                    phone: '',
                    location: '',
                    website: '',
                    linkedin: '',
                    github: ''
                },
                experience: [],
                education: [],
                skills: [],
                certifications: [],
                languages: [],
                projects: [],
                summary: '',
                confidence: 0
            };

            // Extract personal info using regex
            const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
            if (emailMatch) { parsed.personalInfo.email = emailMatch[1]; }

            const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
            if (phoneMatch) { parsed.personalInfo.phone = phoneMatch[1]; }

            const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
            if (linkedinMatch) { parsed.personalInfo.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`; }

            // Extract sections
            parsed.summary = ResumeParserService.extractSection(text, 'summary|about|objective');
            parsed.experience = ResumeParserService.extractExperience(text);
            parsed.education = ResumeParserService.extractEducation(text);
            parsed.skills = ResumeParserService.extractSkills(text);
            parsed.languages = ResumeParserService.extractLanguages(text);

            // Calculate confidence based on extracted fields
            let confidence = 0;
            if (parsed.personalInfo.email) { confidence += 0.1; }
            if (parsed.personalInfo.phone) { confidence += 0.1; }
            if (parsed.summary) { confidence += 0.1; }
            if (parsed.experience.length > 0) { confidence += 0.25; }
            if (parsed.education.length > 0) { confidence += 0.25; }
            if (parsed.skills.length > 0) { confidence += 0.1; }

            parsed.confidence = Math.min(confidence, 1);

            return parsed;

        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Extract section from text
     */
    static extractSection(text, keywords) {
        const lines = text.split('\n');
        let inSection = false;
        let content = '';

        for (const line of lines) {
            if (new RegExp(keywords, 'i').test(line)) {
                inSection = true;
                continue;
            }

            if (inSection) {
                // Stop when we hit another section header
                if (/^[A-Z][A-Z\s]+:?$/.test(line.trim())) { break; }
                content += line + ' ';
            }
        }

        return content.trim().substring(0, 500);
    }

    /**
     * Extract experience
     */
    static extractExperience(text) {
        const experience = [];
        const lines = text.split('\n');
        let inExperienceSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (/experience|employment|work history/i.test(line)) {
                inExperienceSection = true;
                continue;
            }

            if (inExperienceSection && /^[A-Z]{2,}/.test(line.trim())) {
                // Job title line
                const job = {
                    title: line.trim(),
                    company: lines[i + 1]?.trim() || '',
                    startDate: '',
                    endDate: '',
                    description: ''
                };

                // Extract dates
                const dateMatch = text.substring(i * 20, i * 20 + 200).match(/(\d{4})\s*-\s*(\d{4}|present)/i);
                if (dateMatch) {
                    job.startDate = dateMatch[1];
                    job.endDate = dateMatch[2];
                }

                experience.push(job);
            }
        }

        return experience;
    }

    /**
     * Extract education
     */
    static extractEducation(text) {
        const education = [];
        const degrees = ['bachelor', 'master', 'phd', 'associate', 'diploma', 'certificate', 'b.s.', 'm.s.', 'b.a.', 'm.a.'];

        const lines = text.split('\n');
        for (const line of lines) {
            if (degrees.some(d => line.toLowerCase().includes(d))) {
                education.push({
                    degree: line.trim(),
                    field: '',
                    school: '',
                    startDate: '',
                    endDate: ''
                });
            }
        }

        return education;
    }

    /**
     * Extract skills
     */
    static extractSkills(text) {
        const skillKeywords = [
            'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
            'react', 'vue', 'angular', 'node.js', 'django', 'flask', 'spring',
            'sql', 'mongodb', 'postgresql', 'aws', 'gcp', 'azure', 'docker', 'kubernetes',
            'git', 'agile', 'scrum', 'machine learning', 'data science', 'ai', 'nlp',
            'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking'
        ];

        const skills = [];
        const textLower = text.toLowerCase();

        for (const skill of skillKeywords) {
            if (textLower.includes(skill)) {
                skills.push(skill);
            }
        }

        return [...new Set(skills)]; // Remove duplicates
    }

    /**
     * Extract languages
     */
    static extractLanguages(text) {
        const languages = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'portuguese', 'russian', 'turkish', 'arabic'];
        const textLower = text.toLowerCase();
        const found = [];

        for (const lang of languages) {
            if (textLower.includes(lang)) {
                found.push({ language: lang, level: 'intermediate' });
            }
        }

        return found;
    }

    /**
     * Improve parsed resume with AI
     */
    static async improveWithAI(parsedData) {
        try {
            // Use ChatbotService to improve content
            const { ChatbotService } = require('./ChatbotService');

            const improvedContent = {
                summary: await ChatbotService.callLLM(
                    `Bunu daha iyi bir profesyonel özet yap: ${parsedData.summary}`,
                    [],
                    'resume'
                ),
                skills: await ChatbotService.callLLM(
                    `Bu beceriler listeyi kategorize ve genişlet: ${parsedData.skills.join(', ')}`,
                    [],
                    'resume'
                )
            };

            return improvedContent;

        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }
}

/**
 * Routes
 */

// POST /api/resume-parser/upload
router.post('/upload', async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await ResumeParserService.parseResume(
            req.file.path,
            req.user._id
        );

        res.json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/resume-parser/preview/:cvId
router.get('/preview/:cvId', async (req, res) => {
    try {
        const cv = await CV.findById(req.params.cvId);

        if (!cv) {
            return res.status(404).json({ error: 'CV not found' });
        }

        res.json({
            title: cv.title,
            personalInfo: cv.personalInfo,
            experience: cv.experience,
            education: cv.education,
            skills: cv.skills,
            confidence: cv.metadata.confidence
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    router,
    ResumeParserService
};
