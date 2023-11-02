const {LogEvent} = require("../utils");
const ErrorHandler = (err, req, res, next) => {
    const message = `${req.method}\t${req.url}\t${err}`;
    LogEvent(message, 'errosLogs.logs');
}

module.exports = {ErrorHandler};