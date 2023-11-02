const {LogEvent} = require("../utils");

const Logger = (req, res, next) => {
    const message = `${req.method}\t ${req.url}`;
    try {
        LogEvent(message, 'logRequets.logs');
    } catch (error) {
        return next(error);
    }
    next();
}

module.exports = {Logger};