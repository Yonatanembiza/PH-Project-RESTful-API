require("dotenv").config();
const verifyTokenPromise = require('./verifyTokenPromise');

const sendResponse = function (res, statusCode, message) {
    res.status(statusCode).json({ error: message });
};

const isInvalidToken = function (token) {
    return !token || token === 'null' || token === 'undefined' || token === 'expired';
};
const verifyToken = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const errorMessage = "Signup or login first to get access";

    // Initialize response object
    const response = {
        statusCode: 200,
        message: ""
    };

    // Validate authorization header
    if (!authHeader) {
        response.statusCode = 401;
        response.message = errorMessage;
    } else {
        const token = authHeader.split(' ')[1];
        if (isInvalidToken(token)) {
            response.statusCode = 401;
            response.message = errorMessage;
        } else {
            verifyTokenPromise(token, process.env.SECRET_KEY)
                .then(function (decoded) {
                    req.userId = decoded.userId;
                    next();
                })
                .catch(function (err) {
                    if (err.name === 'TokenExpiredError') {
                        response.statusCode = 401;
                        response.message = errorMessage + " - " + process.env.ERROR_EXPIRED;
                    } else {
                        response.statusCode = 500;
                        response.message = process.env.ERROR_INTERNAL;
                    }
                    if (response.statusCode !== 200) {
                        sendResponse(res, response.statusCode, response.message);
                    }
                });
            return;
        }
    }
    sendResponse(res, response.statusCode, response.message);
};

module.exports = verifyToken;
