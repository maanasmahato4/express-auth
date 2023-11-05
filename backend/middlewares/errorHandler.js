const {LogEvent} = require("../utils");
const ErrorHandler = (err, req, res, next) => {
    const message = `${req.method}\t${req.url}\t${err.error}`;
    LogEvent(message, 'errosLogs.logs');
    res.status(err.status).json({error: err.message});
}

module.exports = {ErrorHandler};