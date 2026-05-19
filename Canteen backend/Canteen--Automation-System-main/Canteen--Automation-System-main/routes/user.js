const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db.js');

const router = express.Router();

// Users Order History
router.post('/order-history', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'test'
    );

    const result = await pool.query(
      `
      SELECT 
        order_id,
        order_items,
        status,
        total_amount,
        created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [decoded.id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Order history error:', error);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

// Create new order
router.post('/order', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { items, subtotal, tax, total, token } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'test'
    );
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Generate unique order ID
    const orderId = 'ORD-' + Date.now();

    // Insert order
    const orderResult = await client.query(`
      INSERT INTO orders (order_id, user_id, order_items, status, payment_status, total_amount, tax_amount, subtotal_amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [orderId, decoded.id, JSON.stringify(items), 'Pending', 'Pending', total, tax, subtotal]);
    
    await client.query('COMMIT');
    res.status(201).json(orderResult.rows[0]);  

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});



module.exports = router;
