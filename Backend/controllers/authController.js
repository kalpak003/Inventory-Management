const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

            if (users.length === 0) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const user = users[0];

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Generate JWT with role
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ token, role: user.role });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },
};

module.exports = authController;
