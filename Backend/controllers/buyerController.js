const db = require('../config/db'); // Adjust the path to your database config

const BuyerController = {
    // Fetch all buyers
    getBuyers: async (req, res) => {
        try {
            const [results] = await db.execute('SELECT * FROM buyers');
            res.status(200).json(results);  // Status 200 for successful fetch
        } catch (err) {
            console.error('Error fetching buyers:', err);
            res.status(500).json({ message: 'Error fetching buyers', error: err.message });
        }
    },

    // Add a new buyer
    addBuyer: async (req, res) => {
        const { company_name, concernedperson, address, contact, email, gstno } = req.body;

        // Ensure all fields are provided
        if (!company_name || !concernedperson || !address || !contact || !email || !gstno) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // Insert data into the database
            const [results] = await db.execute(
                'INSERT INTO buyers (company_name, concernedperson, address, contact, email, gstno) VALUES (?, ?, ?, ?, ?, ?)', 
                [company_name, concernedperson, address, contact, email, gstno]
            );
            res.status(201).json({ id: results.insertId, company_name }); // Status 201 for successful creation
        } catch (err) {
            console.error('Error adding buyer:', err);
            res.status(500).json({ message: 'Error adding buyer', error: err.message });
        }
    },

    // Update buyer information
    updateBuyer: async (req, res) => {
        const { id } = req.params;
        const { company_name, concernedperson, address, contact, email, gstno } = req.body;

        // Ensure all fields are provided
        if (!company_name || !concernedperson || !address || !contact || !email || !gstno) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // Update the buyer's information
            const [results] = await db.execute(
                'UPDATE buyers SET company_name = ?, concernedperson = ?, address = ?, contact = ?, email = ?, gstno = ? WHERE id = ?', 
                [company_name, concernedperson, address, contact, email, gstno, id]
            );

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Buyer not found' });
            }
            res.status(200).json({ message: 'Buyer updated successfully' });
        } catch (err) {
            console.error('Error updating buyer:', err);
            res.status(500).json({ message: 'Error updating buyer', error: err.message });
        }
    },

    // Delete a buyer
    deleteBuyer: async (req, res) => {
        const { id } = req.params;

        try {
            const [results] = await db.execute('DELETE FROM buyers WHERE id = ?', [id]);

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Buyer not found' });
            }

            res.status(200).json({ message: 'Buyer deleted successfully' });
        } catch (err) {
            console.error('Error deleting buyer:', err);
            res.status(500).json({ message: 'Error deleting buyer', error: err.message });
        }
    }
};

module.exports = BuyerController;
