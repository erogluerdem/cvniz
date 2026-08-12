const mongoose = require('mongoose');

const adminRoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'indigo'
    },
    permissions: [{
        type: String
    }],
    usersCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AdminRole', adminRoleSchema);
