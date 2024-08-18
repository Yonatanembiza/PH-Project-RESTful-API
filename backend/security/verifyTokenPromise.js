const jwt = require('jsonwebtoken');

const verifyTokenPromise = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                reject(error);
            } else {
                resolve(decoded);
            }
        });
    });
};

module.exports = verifyTokenPromise;
