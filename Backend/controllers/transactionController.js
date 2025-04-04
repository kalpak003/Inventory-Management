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

    // Add a new transaction (BUY or SELL)
    addTransaction: async (req, res) => {
        const { product_id, quantity, transaction_type, username } = req.body;
    
        if (!product_id || !quantity || !transaction_type || !username) {
            return res.status(400).json({ message: 'product_id, quantity, transaction_type, and username are required' });
        }
    
        const parsedQty = parseInt(quantity, 10);
    
        if (isNaN(parsedQty) || parsedQty <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number' });
        }
    
        try {
            // Fetch product info
            const [[product]] = await db.query('SELECT * FROM products WHERE id = ?', [product_id]);
    
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            const {
                productname,
                category,
                producttype,
                modelno,
                price,
                quantity: currentStock
            } = product;
    
            let netstock = currentStock;
            let buyername = null;
            let sellername = null;
            const transdate = new Date();
            const orderid = `ORD-${Date.now()}`;
            const instockdate = transaction_type === 'BUY' ? transdate : null;
            const dispatchdate = transaction_type === 'SELL' ? transdate : null;
            const selltotalprice = parseFloat(price) * parsedQty;
    
            // Calculate stock
            if (transaction_type === 'BUY') {
                netstock = currentStock + parsedQty;
                buyername = username;
            } else if (transaction_type === 'SELL') {
                if (currentStock < parsedQty) {
                    return res.status(400).json({ message: 'Not enough stock available' });
                }
                netstock = currentStock - parsedQty;
                sellername = username;
            } else {
                return res.status(400).json({ message: 'Invalid transaction type. Use BUY or SELL' });
            }
    
            // Update product stock
            await db.query('UPDATE products SET quantity = ? WHERE id = ?', [netstock, product_id]);
    
            // Insert transaction
            const query = `
                INSERT INTO transactions (
                    productname, buyername, category, producttype, modelno, price, transdate,
                    instockdate, instockqty, dispatchdate, dispatchqty, netstock,
                    sellername, orderid, selltotalprice, transaction_type
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
    
            const values = [
                productname, buyername, category, producttype, modelno, price, transdate,
                instockdate, transaction_type === 'BUY' ? parsedQty : 0,
                dispatchdate, transaction_type === 'SELL' ? parsedQty : 0,
                netstock, sellername, orderid, selltotalprice, transaction_type
            ];
    
            const [result] = await db.query(query, values);
    
            res.status(201).json({
                message: 'Transaction completed',
                transaction_id: result.insertId,
                productname,
                transaction_type,
                netstock,
                orderid
            });
    
        } catch (err) {
            console.error('Error during transaction:', err);
            res.status(500).json({ message: 'Transaction failed', error: err.message });
        }
    }
    

};

module.exports = transactionController;