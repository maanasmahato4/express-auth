const mongoose = require("mongoose");

const DatabaseConnection = async () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('database connected');
    }
    );
}

module.exports = { DatabaseConnection };