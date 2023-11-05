const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const { v4: uuid } = require("uuid");

const LogEvent = async (message, fileName) => {
    let currentDate = new Date();
    let formattedDateTime = currentDate.toLocaleString();
    const Message = `${formattedDateTime}\t${uuid()}\t${message}\n`;
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