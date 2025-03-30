const db = require('../config/db'); // Adjust the path to your database config

const SellerController = {
    getSellers: (req, res) => {
        db.query('SELECT * FROM sellers', (err, results) => {
            if (err) {
                console.error('Error fetching sellers:', err);
                return res.status(500).json({ message: 'Error fetching sellers' });
            }
            res.json(results);
        });
    },

    addSeller: (req, res) => {
        const { companyname, concernedperson, address, contact, email, gstno } = req.body;
    
        console.log('Received request body:', req.body); // Check the received data
    
        if (!companyname || !concernedperson || !address || !contact || !email || !gstno) {
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        // Check if the email already exists
        db.query('SELECT * FROM sellers WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Error checking email:', err);
                return res.status(500).json({ message: 'Error checking email' });
            }
    
            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }
    
            // Proceed with inserting the new seller if the email is unique
            db.query(
                'INSERT IGNORE INTO sellers (companyname, concernedperson, address, contact, email, gstno) VALUES (?, ?, ?, ?, ?, ?)', 
                [companyname, concernedperson, address, contact, email, gstno], 
                (err, results) => {
                    if (err) {
                        console.error('Error adding seller:', err);
                        return res.status(500).json({ message: 'Error adding seller' });
                    }
                    if (results.affectedRows === 0) {
                        return res.status(400).json({ message: 'Email already exists' });
                    }
                    console.log('Seller added:', results);
                    res.status(201).json({ id: results.insertId, companyname });
                }
            );            
        });
    },

    

    updateSeller: (req, res) => {
        const { id } = req.params;
        const { name, contact, email } = req.body;

        if (!name || !contact || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        db.query(
            'UPDATE sellers SET name = ?, contact = ?, email = ? WHERE id = ?', 
            [name, contact, email, id], 
            (err, results) => {
                if (err) {
                    console.error('Error updating seller:', err);
                    return res.status(500).json({ message: 'Error updating seller' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: 'Seller not found' });
                }
                res.json({ message: 'Seller updated successfully' });
            }
        );
    },

    deleteSeller: (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM sellers WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error deleting seller:', err);
                return res.status(500).json({ message: 'Error deleting seller' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Seller not found' });
            }
            res.json({ message: 'Seller deleted successfully' });
        });
    }
};

module.exports = SellerController;