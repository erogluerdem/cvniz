const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, adminOnly } = require('../middleware/auth');
const Media = require('../models/Media');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   GET /api/media
// @desc    Get all media files
// @access  Private/Admin
router.get('/', authenticate, adminOnly, async (req, res) => {
    try {
        const media = await Media.find().sort({ createdAt: -1 });
        res.json({ success: true, media });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/media/upload
// @desc    Upload a file
// @access  Private/Admin
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const category = req.file.mimetype.startsWith('image/') ? 'image' :
            req.file.mimetype.includes('pdf') ? 'document' : 'other';

        const media = new Media({
            name: req.file.filename,
            originalName: req.file.originalname,
            path: `/uploads/${req.file.filename}`,
            mimetype: req.file.mimetype,
            size: req.file.size,
            category: category,
            uploadedBy: req.user.id
        });

        await media.save();

        res.status(201).json({ success: true, media });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/media/:id
// @desc    Delete a file
// @access  Private/Admin
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        // Delete from filesystem
        const filePath = path.join(__dirname, '../../', media.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Media.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
