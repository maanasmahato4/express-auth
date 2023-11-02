const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        enum: ['user', 'mod', 'admin'],
        default: ['user']
    },
    imageUrl: {
        required: true,
        type: String
    }

}, { timestamps: true });

const User = mongoose.model('auth-users', UserSchema);

module.exports = {User}