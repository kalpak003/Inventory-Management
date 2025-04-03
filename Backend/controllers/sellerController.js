const db = require("../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Middleware to verify token and role
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
};

const SellerController = {
    // ✅ Get all sellers (Accessible to all authenticated users)
    getSellers: [verifyToken, async (req, res) => {
        try {
            const [results] = await db.query("SELECT * FROM sellers");
            res.json(results);
        } catch (err) {
            console.error("Error fetching sellers:", err);
            res.status(500).json({ message: "Error fetching sellers" });
        }
    }],

    // ✅ Add a new seller (Admin only)
    addSeller: [verifyToken, async (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { companyname, concernedperson, address, contact, email, gstno } = req.body;

        if (!companyname || !concernedperson || !address || !contact || !email || !gstno) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            // Check if the email already exists
            const [existingSellers] = await db.query("SELECT * FROM sellers WHERE email = ?", [email]);

            if (existingSellers.length > 0) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Insert the new seller
            const [result] = await db.query(
                "INSERT INTO sellers (companyname, concernedperson, address, contact, email, gstno) VALUES (?, ?, ?, ?, ?, ?)", 
                [companyname, concernedperson, address, contact, email, gstno]
            );

            res.status(201).json({ id: result.insertId, companyname });

        } catch (err) {
            console.error("Error adding seller:", err);
            res.status(500).json({ message: "Error adding seller" });
        }
    }],

    // ✅ Update an existing seller (Admin only)
    updateSeller: [verifyToken, async (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        const { companyname, contact, email } = req.body;

        if (!companyname || !contact || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const [result] = await db.query(
                "UPDATE sellers SET companyname = ?, contact = ?, email = ? WHERE id = ?", 
                [companyname, contact, email, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Seller not found" });
            }

            res.json({ message: "Seller updated successfully" });

        } catch (err) {
            console.error("Error updating seller:", err);
            res.status(500).json({ message: "Error updating seller" });
        }
    }],

    // ✅ Delete a seller (Admin only)
    deleteSeller: [verifyToken, async (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;

        try {
            const [result] = await db.query("DELETE FROM sellers WHERE id = ?", [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Seller not found" });
            }

            res.json({ message: "Seller deleted successfully" });

        } catch (err) {
            console.error("Error deleting seller:", err);
            res.status(500).json({ message: "Error deleting seller" });
        }
    }],

    getSellerById: [verifyToken, async (req, res) => {
        console.log("Requested Seller ID:", req.params.id); // Debugging Line
        const { id } = req.params;
    
        try {
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid ID format" });
            }
    
            const [results] = await db.query("SELECT * FROM sellers WHERE id = ? LIMIT 1", [id]);
    
            if (results.length === 0) {
                return res.status(404).json({ message: "Seller not found" });
            }
    
            res.status(200).json(results[0]);
        } catch (err) {
            console.error("Error fetching seller by ID:", err);
            res.status(500).json({ message: "Error fetching seller by ID", error: err.message });
        }
    }]
}    

module.exports = SellerController;
