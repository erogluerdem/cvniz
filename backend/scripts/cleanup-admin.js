require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const result = await User.deleteOne({ email: 'admin@CVniz.com' });
        console.log('Deleted legacy admin:', result.deletedCount);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

cleanup();
