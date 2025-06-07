// File: backend/middleware/auth.js

const jwt = require('jsonwebtoken'); // Assuming you have 'jsonwebtoken' installed

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied or malformed token' });
        }

        const actualToken = token.replace('Bearer ', '');
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token is invalid' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        res.status(500).json({ message: 'Server error during authentication' });
    }
};

// Correctly define and export the adminOnly middleware
const adminOnly = (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && !req.user.isAdmin)) {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};

module.exports = { authMiddleware, adminOnly }; // Export both middlewares