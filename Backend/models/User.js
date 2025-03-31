const db = require('../config/db'); // Import your DB config

const User = {
    // Find user by email
    findOne: async (email) => {
        try {
            const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            return results[0]; // Return the user object if found
        } catch (error) {
            console.error(error);
            throw new Error('Database error');
        }
    },

    // Register a new user
    create: async (username, email, password, role) => {
        try {
            const [results] = await db.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, password, role]
            );
            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Database error');
        }
    }
};

module.exports = User;
