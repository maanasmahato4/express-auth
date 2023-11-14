const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    uuid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth-users",
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 24 * 60 * 60 // expires after 24 hours
    }
});

const TokenModel = mongoose.model("user_tokens", TokenSchema);
module.exports = {TokenModel};
