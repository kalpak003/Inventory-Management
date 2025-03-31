const db = require("../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Middleware to verify token and role
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ message: "Access denied. No token provided." });

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
    getSellers: [verifyToken, (req, res) => {
        db.query("SELECT * FROM sellers", (err, results) => {
            if (err) {
                console.error("Error fetching sellers:", err);
                return res.status(500).json({ message: "Error fetching sellers" });
            }
            res.json(results);
        });
    }],

    // ✅ Add a new seller (Admin only)
    addSeller: [verifyToken, (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { companyname, concernedperson, address, contact, email, gstno } = req.body;
    
        console.log("Received request body:", req.body);
    
        if (!companyname || !concernedperson || !address || !contact || !email || !gstno) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        db.query("SELECT * FROM sellers WHERE email = ?", [email], (err, results) => {
            if (err) {
                console.error("Error checking email:", err);
                return res.status(500).json({ message: "Error checking email" });
            }
    
            if (results.length > 0) {
                return res.status(400).json({ message: "Email already exists" });
            }
    
            db.query(
                "INSERT INTO sellers (companyname, concernedperson, address, contact, email, gstno) VALUES (?, ?, ?, ?, ?, ?)", 
                [companyname, concernedperson, address, contact, email, gstno], 
                (err, results) => {
                    if (err) {
                        console.error("Error adding seller:", err);
                        return res.status(500).json({ message: "Error adding seller" });
                    }
                    res.status(201).json({ id: results.insertId, companyname });
                }
            );            
        });
    }],

    // ✅ Update an existing seller (Admin only)
    updateSeller: [verifyToken, (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        const { companyname, contact, email } = req.body;

        if (!companyname || !contact || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        db.query(
            "UPDATE sellers SET companyname = ?, contact = ?, email = ? WHERE id = ?", 
            [companyname, contact, email, id], 
            (err, results) => {
                if (err) {
                    console.error("Error updating seller:", err);
                    return res.status(500).json({ message: "Error updating seller" });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: "Seller not found" });
                }
                res.json({ message: "Seller updated successfully" });
            }
        );
    }],

    // ✅ Delete a seller (Admin only)
    deleteSeller: [verifyToken, (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        db.query("DELETE FROM sellers WHERE id = ?", [id], (err, results) => {
            if (err) {
                console.error("Error deleting seller:", err);
                return res.status(500).json({ message: "Error deleting seller" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Seller not found" });
            }
            res.json({ message: "Seller deleted successfully" });
        });
    }]
};

module.exports = SellerController;
