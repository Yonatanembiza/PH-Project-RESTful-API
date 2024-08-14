const verifyTokenPromise = require('./verifyTokenPromise');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    if (!authHeader) {
        return res.status(401).json({ error: "Signup or login first to get access" });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Signup or login first to get access" });
    }

    verifyTokenPromise(token, process.env.SECRET_KEY)
        .then((decoded) => {
            req.userId = decoded.userId;
            next();
        })
        .catch((err) => {
            console.error('Token verification error:', err);
            res.status(500).json({ error: "Failed to authenticate token" });
        });
};

module.exports = verifyToken;
