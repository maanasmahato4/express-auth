const mongoose = require("mongoose");

const VerifySchema = new mongoose.Schema({
    uuid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth-users",
        required: true
    },
    code: {
        type: Number,
        required: true
    }
});

VerifySchema.index({ createdAt: 1 }, {expireAfterSeconds: 5 * 60}); // expires the document after 5 minutes

const VerificationCode = mongoose.model("verification-codes", VerifySchema);
module.exports = { VerificationCode };