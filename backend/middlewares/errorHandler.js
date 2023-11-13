const { LogEvent } = require("../utils");
const ErrorHandler = (err, req, res, next) => {
    console.log(err);
    const message = `${req.method}\t${req.url}\t${err.error}`;
    LogEvent(message, 'errosLogs.logs');
    res.status(err.status).json({ message: err.message, error: err.error });
}

module.exports = { ErrorHandler };