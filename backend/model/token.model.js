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
    }
}, { timestamps: true });

const TokenModel = mongoose.model("user_tokens", TokenSchema);
module.exports = {TokenModel};