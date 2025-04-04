const db = require('../config/db'); // Database connection

const transactionController = {
    // Fetch all transactions
    getTransactions: async (req, res) => {
        try {
            const [results] = await db.query('SELECT * FROM transactions');
            res.json(results);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            res.status(500).json({ message: 'Error fetching transactions' });
        }
    },

    // Get transactions by username (works with both params and body)
getTransactionsByUsername: async (req, res) => {
    try {
        // Try to get username from params first, then body
        const username = req.params.username || req.body.username;
        
        if (!username) {
            return res.status(400).json({ 
                message: 'Username is required as a parameter or in the request body' 
            });
        }

        const query = `
            SELECT * FROM transactions 
            WHERE (buyername = ? OR sellername = ?)
            AND (buyername IS NOT NULL OR sellername IS NOT NULL)
            ORDER BY transdate DESC
        `;
        
        const [results] = await db.query(query, [username, username]);
        
        if (results.length === 0) {
            return res.status(404).json({ 
                message: `No transactions found for user: ${username}`,
                searchedUsername: username,
                suggestions: [
                    'Check if the username exists in either buyername or sellername columns',
                    'Verify there are no trailing spaces in the username',
                    'The user may not have any transactions yet'
                ]
            });
        }
        
        res.json({
            username: username,
            count: results.length,
            transactions: results
        });
        
    } catch (err) {
        console.error('Error fetching user transactions:', err);
        res.status(500).json({ 
            message: 'Error fetching user transactions',
            error: err.message 
        });
    }
},

addTransaction: async (req, res) => {
    const {
        product_id, productname, category, producttype, modelno, price, transdate,
        instockdate, instockqty, dispatchdate, dispatchqty,
        orderid, transaction_type, username
    } = req.body;

    if (!product_id || !productname || !category || !producttype || !modelno || !price || !orderid || !transaction_type || !username) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const parsedPrice = parseFloat(price);
    const parsedInStockQty = instockqty ? parseInt(instockqty, 10) : 0;
    const parsedDispatchQty = dispatchqty ? parseInt(dispatchqty, 10) : 0;

    try {
        const [[product]] = await db.query('SELECT quantity FROM products WHERE id = ?', [product_id]);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let currentStock = product.quantity;
        let netstock = currentStock;
        let buyername = null;
        let sellername = null;

        if (transaction_type === 'BUY') {
            netstock = currentStock + parsedInStockQty;
            buyername = username;
        } else if (transaction_type === 'SELL') {
            if (currentStock < parsedDispatchQty) {
                return res.status(400).json({ message: 'Not enough stock available for sale' });
            }
            netstock = currentStock - parsedDispatchQty;
            sellername = username;
        } else {
            return res.status(400).json({ message: 'Invalid transaction type' });
        }

        // Update product stock
        await db.query('UPDATE products SET quantity = ? WHERE id = ?', [netstock, product_id]);

        // Insert transaction
        const query = `INSERT INTO transactions 
                       (productname, buyername, category, producttype, modelno, price, transdate, 
                        instockdate, instockqty, dispatchdate, dispatchqty, netstock, 
                        sellername, orderid, selltotalprice, transaction_type) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            productname, buyername, category, producttype, modelno, parsedPrice, transdate,
            instockdate, parsedInStockQty, dispatchdate, parsedDispatchQty, netstock,
            sellername, orderid, parsedDispatchQty * parsedPrice, transaction_type
        ];

        const [result] = await db.query(query, values);

        res.status(201).json({
            message: 'Transaction recorded successfully',
            id: result.insertId,
            productname,
            transaction_type,
            netstock
        });

    } catch (err) {
        console.error('Error handling transaction:', err);
        res.status(500).json({ message: 'Transaction failed', error: err.message });
    }
},


};

module.exports = transactionController;