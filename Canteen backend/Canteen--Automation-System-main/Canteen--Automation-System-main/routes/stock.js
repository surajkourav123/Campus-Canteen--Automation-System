const express = require('express');
const pool = require('../db.js');

const router = express.Router();

// Get all stock items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, item_name, quantity, updated_at FROM stock ORDER BY item_name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

// Get single stock item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, item_name, quantity FROM stock WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stock item:', error);
    res.status(500).json({ error: 'Failed to fetch stock item' });
  }
});

// Add new stock item
router.post('/', async (req, res) => {
  try {
    const { item_name, quantity } = req.body;
    
    if (!item_name || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO stock (item_name, quantity) VALUES ($1, $2) RETURNING *',
      [item_name, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating stock item:', error);
    res.status(500).json({ error: 'Failed to create stock item' });
  }
});

// Update stock quantity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, item_name } = req.body;

    const result = await pool.query(
      `UPDATE stock SET 
        item_name = COALESCE($1, item_name),
        quantity = COALESCE($2, quantity),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *`,
      [item_name, quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// Increment stock
router.patch('/:id/increment', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const result = await pool.query(
      'UPDATE stock SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error incrementing stock:', error);
    res.status(500).json({ error: 'Failed to increment stock' });
  }
});

// Decrement stock
router.patch('/:id/decrement', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const result = await pool.query(
      'UPDATE stock SET quantity = GREATEST(0, quantity - $1), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error decrementing stock:', error);
    res.status(500).json({ error: 'Failed to decrement stock' });
  }
});

// Delete stock item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM stock WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Stock item not found' });
    }
    res.json({ message: 'Stock item deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock item:', error);
    res.status(500).json({ error: 'Failed to delete stock item' });
  }
});

module.exports = router;
