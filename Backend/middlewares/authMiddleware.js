const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authorize = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1]; // Extract token

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Convert roles to lowercase for consistency
            if (roles.length && !roles.map(role => role.toLowerCase()).includes(req.user.role.toLowerCase())) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
            }

            next();
        } catch (error) {
            console.error('JWT Error:', error.message);
            return res.status(401).json({ message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
        }
    };
};

module.exports = authorize;
