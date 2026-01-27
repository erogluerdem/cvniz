const request = require('supertest');
require('dotenv').config(); // Load env vars
const app = require('../src/server');
const mongoose = require('mongoose');

describe('Health Check', () => {
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return 200 OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });
});
