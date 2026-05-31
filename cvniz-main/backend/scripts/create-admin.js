// Create Admin User Script
// Run with: node scripts/create-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');

        // Check if admin exists (lowercase)
        const existingAdmin = await User.findOne({ email: 'admin@cvniz.com' });

        if (existingAdmin) {
            // Update to admin role
            existingAdmin.role = 'admin';
            existingAdmin.isPremium = true;
            existingAdmin.password = await bcrypt.hash('admin123', 12);
            await existingAdmin.save();
            console.log('✅ Admin kullanıcı güncellendi');
        } else {
            // Create new admin
            await User.create({
                email: 'admin@cvniz.com',
                password: 'admin123',
                name: 'Admin',
                role: 'admin',
                isPremium: true,
                isActive: true
            });
            console.log('✅ Admin kullanıcı oluşturuldu');
        }

        console.log('\n📧 E-posta: admin@cvniz.com');
        console.log('🔑 Şifre: admin123');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Hata:', error.message);
        process.exit(1);
    }
}

createAdmin();

