const request = require('supertest');
require('dotenv').config(); // Load env vars
const app = require('../src/server');
const mongoose = require('mongoose');
const Translation = require('../src/models/Translation');
const { generateToken } = require('../src/utils/auth'); // Assuming this exists, or we mock auth

// Mock auth middleware to bypass real authentication for tests if possible
// Or we can create a temporary admin user.
// For now, let's assume we can mock or use a test user.

describe('Translation API', () => {

    beforeAll(async () => {
        await Translation.deleteMany({ key: /^test\./ });
    });

    afterAll(async () => {
        await Translation.deleteMany({ key: /^test\./ });
        await mongoose.connection.close();
    });

    it('should get public translations', async () => {
        // Create a test translation directly in DB
        await Translation.create({
            locale: 'tr',
            key: 'test.hello',
            value: 'Merhaba'
        });

        const res = await request(app).get('/api/translations/tr');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('test.hello', 'Merhaba');
    });

    // We skip Admin create/delete tests for now as they require valid Auth Tokens
    // and we haven't set up the test environment authentication yet.
    // Ideally, we'd create a utility to get a valid test admin token.
});
