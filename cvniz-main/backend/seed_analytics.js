const mongoose = require('mongoose');
const CVVisit = require('./src/models/CVVisit');
require('dotenv').config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cvniz-db');
        console.log('Connected to DB');

        // Find a CV ID (any)
        const CV = require('./src/models/CV');
        const cv = await CV.findOne();

        if (!cv) {
            console.log('No CV found to seed analytics for.');
            process.exit(1);
        }

        console.log(`Seeding analytics for CV: ${cv._id}`);

        const visits = [];
        const countries = ['Turkey', 'USA', 'Germany', 'UK', 'France'];
        const cities = ['Istanbul', 'Ankara', 'New York', 'Berlin', 'London', 'Paris'];
        const devices = ['desktop', 'mobile'];

        // Generate last 30 days data
        for (let i = 0; i < 50; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));

            visits.push({
                cvId: cv._id,
                visitorId: 'seed-' + i,
                ip: '127.0.0.1',
                country: countries[Math.floor(Math.random() * countries.length)],
                city: cities[Math.floor(Math.random() * cities.length)],
                deviceType: devices[Math.floor(Math.random() * devices.length)],
                browser: 'Chrome',
                os: 'Windows 10',
                timestamp: date
            });
        }

        await CVVisit.insertMany(visits);
        console.log('✅ 50 visits seeded successfully.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seed();
