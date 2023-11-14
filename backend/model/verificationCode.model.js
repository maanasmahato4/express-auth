const mongoose = require("mongoose");

const VerifySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: Number,
        required: true
    },
    verificationType: {
        type: String,
        enum: ['register', 'forgot'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60 // expires after 5 minutes
    }
});

const VerificationCodeModel = mongoose.model("verification-codes", VerifySchema);
module.exports = { VerificationCodeModel };
