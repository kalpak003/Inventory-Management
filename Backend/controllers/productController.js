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

const ProductController = {
    // ✅ Get all products (Accessible to all authenticated users)
    getProducts: [verifyToken, (req, res) => {
        db.query("SELECT * FROM products", (err, results) => {
            if (err) {
                console.error("Error fetching products:", err.sqlMessage);
                return res.status(500).json({ message: "Error fetching products" });
            }
            res.json(results);
        });
    }],

    // ✅ Add a new product (Admin only)
    addProduct: [verifyToken, (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { productname, category, producttype, modelno, description, image, unit, price, status, quantity } = req.body;

        if (!productname || !price || !quantity) {
            return res.status(400).json({ message: "Product name, price, and quantity are required" });
        }

        db.query(
            `INSERT INTO products (productname, category, producttype, modelno, description, image, unit, price, status, quantity) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [productname, category, producttype, modelno, description, image, unit, price, status || "available", quantity],
            (err, results) => {
                if (err) {
                    console.error("Error adding product:", err.sqlMessage);
                    return res.status(500).json({ message: "Error adding product" });
                }
                res.status(201).json({ id: results.insertId, productname });
            }
        );
    }],

    // ✅ Update an existing product (Admin only)
    updateProduct: [verifyToken, (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        const { productname, category, producttype, modelno, description, image, unit, price, status, quantity } = req.body;

        if (!productname || !price || !quantity) {
            return res.status(400).json({ message: "Product name, price, and quantity are required" });
        }

        db.query(
            `UPDATE products SET productname = ?, category = ?, producttype = ?, modelno = ?, 
             description = ?, image = ?, unit = ?, price = ?, status = ?, quantity = ? WHERE id = ?`,
            [productname, category, producttype, modelno, description, image, unit, price, status, quantity, id],
            (err, results) => {
                if (err) {
                    console.error("Error updating product:", err.sqlMessage);
                    return res.status(500).json({ message: "Error updating product" });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: "Product not found" });
                }
                res.json({ message: "Product updated successfully" });
            }
        );
    }],

    // ✅ Delete a product (Admin only)
    deleteProduct: [verifyToken, (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        db.query("DELETE FROM products WHERE id = ?", [id], (err, results) => {
            if (err) {
                console.error("Error deleting product:", err.sqlMessage);
                return res.status(500).json({ message: "Error deleting product" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json({ message: "Product deleted successfully" });
        });
    }]
};

module.exports = ProductController;
