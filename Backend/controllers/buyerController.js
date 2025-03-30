const db = require('../config/db'); // Adjust the path to your database config

const BuyerController = {
    getBuyers: (req, res) => {
        db.query('SELECT * FROM buyers', (err, results) => {
            if (err) {
                console.error('Error fetching buyers:', err);
                return res.status(500).json({ message: 'Error fetching buyers' });
            }
            res.json(results);
        });
    },

    addBuyer: (req, res) => {
        const { company_name, concernedperson, address, contact, email, gstno } = req.body;
    
        // Ensure all fields are provided
        if (!company_name || !concernedperson || !address || !contact || !email || !gstno) {
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        // Insert data into the database
        db.query(
            'INSERT INTO buyers (company_name, concernedperson, address, contact, email, gstno) VALUES (?, ?, ?, ?, ?, ?)', 
            [company_name, concernedperson, address, contact, email, gstno], 
            (err, results) => {
                if (err) {
                    console.error('Error adding buyer:', err);
                    return res.status(500).json({ message: 'Error adding buyer' });
                }
                res.status(201).json({ id: results.insertId, company_name });
            }
        );
    },
    
    

    updateBuyer: (req, res) => {
        const { id } = req.params;
        const { company_name, concerned_person, address, contact, email, gst_no } = req.body;

        if (!company_name || !concerned_person || !address || !contact || !email || !gst_no) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        db.query(
            'UPDATE buyers SET company_name = ?, concerned_person = ?, address = ?, contact = ?, email = ?, gst_no = ? WHERE id = ?', 
            [company_name, concerned_person, address, contact, email, gst_no, id], 
            (err, results) => {
                if (err) {
                    console.error('Error updating buyer:', err);
                    return res.status(500).json({ message: 'Error updating buyer' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: 'Buyer not found' });
                }
                res.json({ message: 'Buyer updated successfully' });
            }
        );
    },

    deleteBuyer: (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM buyers WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error deleting buyer:', err);
                return res.status(500).json({ message: 'Error deleting buyer' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Buyer not found' });
            }
            res.json({ message: 'Buyer deleted successfully' });
        });
    }
};

module.exports = BuyerController;