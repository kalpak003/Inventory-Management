const db = require('../config/db'); // Database connection

const transactionController = {
    // Fetch all transactions
    getTransactions: (req, res) => {
        db.query('SELECT * FROM transactions', (err, results) => {
            if (err) {
                console.error('Error fetching transactions:', err);
                return res.status(500).json({ message: 'Error fetching transactions' });
            }
            res.json(results);
        });
    },

    // Add a new transaction (BUY or SELL)
    addTransaction: (req, res) => {
        const {
            product_id, productname, category, producttype, modelno, price, transdate,
            availableqty, instockdate, instockqty, dispatchdate, dispatchqty, netstock,
            buyername, sellername, orderid, transaction_type
        } = req.body;

        if (!product_id || !productname || !category || !producttype || !modelno || !price || !orderid || !transaction_type) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        // Convert values to proper data types
        const parsedPrice = parseFloat(price);
        const parsedAvailableQty = parseInt(availableqty, 10);
        const parsedInStockQty = instockqty ? parseInt(instockqty, 10) : 0;
        const parsedDispatchQty = dispatchqty ? parseInt(dispatchqty, 10) : 0;
        let parsedNetStock = parseInt(netstock, 10);
        const parsedSellTotalPrice = parsedDispatchQty * parsedPrice || 0;

        if (isNaN(parsedPrice) || isNaN(parsedAvailableQty) || isNaN(parsedNetStock)) {
            return res.status(400).json({ message: 'Invalid numeric values' });
        }

        // Fetch current stock of the product
        db.query('SELECT quantity FROM products WHERE id = ?', [product_id], (err, results) => {
            if (err) {
                console.error('Error fetching product stock:', err);
                return res.status(500).json({ message: 'Error fetching product stock' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            let currentStock = results[0].quantity;

            if (transaction_type === 'BUY') {
                parsedNetStock = currentStock + parsedInStockQty;

                // Update product stock
                db.query('UPDATE products SET quantity = ? WHERE id = ?', [parsedNetStock, product_id], (err) => {
                    if (err) {
                        console.error('Error updating stock:', err);
                        return res.status(500).json({ message: 'Error updating stock' });
                    }

                    // Insert transaction record
                    insertTransaction();
                });

            } else if (transaction_type === 'SELL') {
                if (currentStock < parsedDispatchQty) {
                    return res.status(400).json({ message: 'Not enough stock available' });
                }

                parsedNetStock = currentStock - parsedDispatchQty;

                // Update product stock
                db.query('UPDATE products SET quantity = ? WHERE id = ?', [parsedNetStock, product_id], (err) => {
                    if (err) {
                        console.error('Error updating stock:', err);
                        return res.status(500).json({ message: 'Error updating stock' });
                    }

                    // Insert transaction record
                    insertTransaction();
                });

            } else {
                return res.status(400).json({ message: 'Invalid transaction type' });
            }
        });

        function insertTransaction() {
            const query = `INSERT INTO transactions 
                           (productname, buyername, category, producttype, modelno, price, transdate, 
                            availableqty, instockdate, instockqty, dispatchdate, dispatchqty, netstock, 
                            sellername, orderid, selltotalprice, transaction_type) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                productname, buyername, category, producttype, modelno, parsedPrice, transdate,
                parsedAvailableQty, instockdate, parsedInStockQty, dispatchdate, parsedDispatchQty, parsedNetStock,
                sellername, orderid, parsedSellTotalPrice, transaction_type
            ];

            db.query(query, values, (err, results) => {
                if (err) {
                    console.error('Error adding transaction:', err);
                    return res.status(500).json({ message: 'Error adding transaction' });
                }
                res.status(201).json({ id: results.insertId, productname, transaction_type, netstock: parsedNetStock });
            });
        }
    },

    // Delete a transaction
    deleteTransaction: (req, res) => {
        const { id } = req.params;

        db.query('DELETE FROM transactions WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error deleting transaction:', err);
                return res.status(500).json({ message: 'Error deleting transaction' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.json({ message: 'Transaction deleted successfully' });
        });
    }
};

module.exports = transactionController;
