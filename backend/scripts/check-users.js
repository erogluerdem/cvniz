require('dotenv').config();
const mongoose = require('mongoose');

async function checkAdmin() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
        const users = await User.find({});
        console.log('Total Users:', users.length);

        users.forEach(u => {
            console.log(`- Email: "${u.email}", Role: "${u.role}"`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkAdmin();
