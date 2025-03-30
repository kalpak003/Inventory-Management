const db = require('../config/db'); // Adjust the path if necessary

const User = {
    findOne: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]); // Return the first user found
        });
    },
    // You can add more methods for creating users, etc.
};

module.exports = User;