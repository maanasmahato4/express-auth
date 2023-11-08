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
    }
});

VerifySchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 }); // expires the document after 5 minutes

const VerificationCodeModel = mongoose.model("verification-codes", VerifySchema);
module.exports = { VerificationCodeModel };