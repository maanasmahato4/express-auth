const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const { v4: uuid } = require("uuid");

const LogEvent = async (message, fileName) => {
    const date = Date.now();
    const Message = `${date}\t${uuid()}\t${message}`;
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromise.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromise.appendFile(path.join(__dirname, '..', 'logs', fileName), Message);
    } catch (error) {
       throw error;
    }
}

module.exports = {LogEvent};