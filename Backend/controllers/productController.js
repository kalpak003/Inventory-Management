const db = require("../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Middleware to verify token and role
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token after "Bearer"
    
    if (!token) return res.status(403).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ message: "Invalid token." });
    }
};

const ProductController = {
    // ✅ Get all products
    getProducts: [verifyToken, async (req, res) => {
        try {
            const [results] = await db.query("SELECT * FROM products");
            res.json(results);
        } catch (err) {
            console.error("Error fetching products:", err.sqlMessage);
            res.status(500).json({ message: "Error fetching products" });
        }
    }],

    // ✅ Add a new product (Admin only)
    addProduct: [verifyToken, async (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { productname, category, producttype, modelno, description, image, unit, price, status, quantity } = req.body;

        if (!productname || !price || !quantity) {
            return res.status(400).json({ message: "Product name, price, and quantity are required" });
        }

        try {
            const [results] = await db.query(
                `INSERT INTO products (productname, category, producttype, modelno, description, image, unit, price, status, quantity) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [productname, category, producttype, modelno, description, image, unit, price, status || "available", quantity]
            );
            res.status(201).json({ id: results.insertId, productname });
        } catch (err) {
            console.error("Error adding product:", err.sqlMessage);
            res.status(500).json({ message: "Error adding product" });
        }
    }],

    // ✅ Update an existing product (Admin only)
    updateProduct: [verifyToken, async (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        const { productname, category, producttype, modelno, description, image, unit, price, status, quantity } = req.body;

        if (!productname || !price || !quantity) {
            return res.status(400).json({ message: "Product name, price, and quantity are required" });
        }

        try {
            const [results] = await db.query(
                `UPDATE products SET productname = ?, category = ?, producttype = ?, modelno = ?, 
                 description = ?, image = ?, unit = ?, price = ?, status = ?, quantity = ? WHERE id = ?`,
                [productname, category, producttype, modelno, description, image, unit, price, status, quantity, id]
            );

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json({ message: "Product updated successfully" });
        } catch (err) {
            console.error("Error updating product:", err.sqlMessage);
            res.status(500).json({ message: "Error updating product" });
        }
    }],

    // ✅ Delete a product (Admin only)
    deleteProduct: [verifyToken, async (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;

        try {
            const [results] = await db.query("DELETE FROM products WHERE id = ?", [id]);

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json({ message: "Product deleted successfully" });
        } catch (err) {
            console.error("Error deleting product:", err.sqlMessage);
            res.status(500).json({ message: "Error deleting product" });
        }
    }],

    getProductById: [verifyToken, async (req, res) => {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        try {
            // Fetch product details by ID
            const [results] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

            if (results.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json(results[0]);
        } catch (err) {
            console.error("Error fetching product by ID:", err.sqlMessage);
            res.status(500).json({ message: "Error fetching product details" });
        }
    }]
};

module.exports = ProductController;
