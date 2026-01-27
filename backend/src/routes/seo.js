const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const CV = require('../models/CV');

// @desc    Serve Injected HTML for Public CV
// @route   GET /:publicUrl
// @access  Public
router.get('/:publicUrl', async (req, res) => {
    try {
        const { publicUrl } = req.params;

        // 1. Find the CV
        const cv = await CV.findOne({ 'publicProfile.slug': publicUrl });

        let title = 'CVniz - Profesyonel CV';
        let description = 'AI destekli profesyonel CV oluşturucu.';
        let image = 'https://cvniz.com/og-default.png';
        const url = `https://cvniz.com/cv/${publicUrl}`;

        if (cv && cv.data && cv.data.personalInfo) {
            const { fullName, title: jobTitle, photo, summary } = cv.data.personalInfo;
            if (fullName) title = `${fullName} - ${jobTitle || 'Profesyonel CV'}`;
            if (summary) description = summary.substring(0, 150) + '...';
            if (photo && photo.startsWith('http')) image = photo; // Must be absolute URL
        }

        // 2. Read the index.html from the BUILD folder
        // Assuming backend is at /backend and frontend build is at /web/dist
        const buildPath = path.join(__dirname, '../../../web/dist/index.html');

        // If build doesn't exist (dev mode), fallback or error handled gracefully
        if (!fs.existsSync(buildPath)) {
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta property="og:title" content="${title}">
                    <meta property="og:description" content="${description}">
                    <meta property="og:image" content="${image}">
                    <meta http-equiv="refresh" content="0;url=${process.env.FRONTEND_URL || 'http://localhost:5173'}/cv/${publicUrl}" />
                </head>
                <body>Redirecting...</body>
                </html>
             `);
        }

        let html = fs.readFileSync(buildPath, 'utf8');

        // 3. Inject Metadata
        html = html.replace(/__OG_TITLE__/g, title)
            .replace(/__OG_DESCRIPTION__/g, description)
            .replace(/__OG_IMAGE__/g, image)
            .replace(/__OG_URL__/g, url);

        res.send(html);

    } catch (error) {
        console.error('SEO Error:', error);
        res.status(500).send('CV görüntülenemedi.');
    }
});

module.exports = router;
