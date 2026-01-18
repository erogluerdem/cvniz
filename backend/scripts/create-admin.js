// Create Admin User Script
// Run with: node scripts/create-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    role: { type: String, default: 'user' },
    isPremium: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@CVniz.com' });

        if (existingAdmin) {
            // Update to admin role
            existingAdmin.role = 'admin';
            existingAdmin.isPremium = true;
            existingAdmin.password = await bcrypt.hash('admin123', 12);
            await existingAdmin.save();
            console.log('✅ Admin kullanıcı güncellendi');
        } else {
            // Create new admin
            const hashedPassword = await bcrypt.hash('admin123', 12);
            await User.create({
                email: 'admin@CVniz.com',
                password: hashedPassword,
                name: 'Admin',
                role: 'admin',
                isPremium: true
            });
            console.log('✅ Admin kullanıcı oluşturuldu');
        }

        console.log('\n📧 E-posta: admin@CVniz.com');
        console.log('🔑 Şifre: admin123');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Hata:', error.message);
        process.exit(1);
    }
}

createAdmin();

