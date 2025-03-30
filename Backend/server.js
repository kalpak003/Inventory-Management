const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Logs HTTP requests

const authRoutes = require('./routes/authRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Built-in JSON parser
app.use(express.urlencoded({ extended: true })); // For form data
app.use(morgan('dev')); // Log requests

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Inventory Management System API');
});

// Use Routes
app.use('/api/login', authRoutes);
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
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('❌ Error starting server:', err.message);
});
