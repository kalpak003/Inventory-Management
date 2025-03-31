const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const db = require('./config/db'); // Database connection

const authRoutes = require('./routes/authRoutes');
buyerRoutes = require('./routes/buyerRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Function to ensure default admin exists
const ensureAdminExists = async () => {
    try {
        const [rows] = await db.execute("SELECT * FROM users WHERE role = 'admin'");
        
        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await db.execute(
                "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
                ['admin', hashedPassword, 'admin@example.com', 'admin']
            );
        }
    } catch (error) {
        
    }
};

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Inventory Management System API');
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

// Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the Server
app.listen(PORT, async () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    await ensureAdminExists(); // Ensure admin user exists before starting
}).on('error', (err) => {
    console.error('❌ Error starting server:', err.message);
});
