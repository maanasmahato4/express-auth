const bcrypt = require("bcrypt");

const hashValue = async (value) => {
    try {
        return bcrypt.hash(value, 10);
    } catch (error) {
        throw error;
    };
};

const compareValues = async (value, hashedValue) => {
    try {
        return await bcrypt.compare(value, hashedValue);
    } catch (err) {
        throw err;
    };
};

module.exports = { hashValue, compareValues };