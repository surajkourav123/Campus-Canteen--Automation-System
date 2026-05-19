const pool = require('./db.js');

// Initialize Database Schema
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin', 'kitchen', 'cashier')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Menu Items Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        available BOOLEAN DEFAULT true,
        rating DECIMAL(3, 1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        user_id INTEGER,
        order_items JSONB NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Ready', 'Done')),
        payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('Pending', 'Paid', 'Failed')),
        total_amount DECIMAL(10, 2) NOT NULL,
        tax_amount DECIMAL(10, 2),
        subtotal_amount DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Create Stock Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock (
        id SERIAL PRIMARY KEY,
        item_name VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Payments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(20),
        payment_status VARCHAR(20) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Database tables created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Seed Initial Data
async function seedDatabase() {
  const client = await pool.connect();
  try {
    // Check if menu already has items
    const result = await client.query('SELECT COUNT(*) FROM menu_items');
    if (parseInt(result.rows[0].count) > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    // Insert default menu items
    const menuItems = [
      { name: 'Idli Sambar', category: 'breakfast', price: 40, description: 'South Indian favorite, soft idlis with spicy sambar', rating: 4.7 },
      { name: 'Masala Dosa', category: 'breakfast', price: 60, description: 'Crispy dosa stuffed with potato masala', rating: 4.8 },
      { name: 'Paneer Tikka', category: 'snacks', price: 90, description: 'Grilled paneer with spicy flavors', rating: 4.6 },
      { name: 'Chole Bhature', category: 'lunch', price: 80, description: 'Classic North Indian dish', rating: 4.5 },
      { name: 'Cold Coffee', category: 'beverages', price: 45, description: 'Chilled coffee with cream', rating: 4.4 },
      { name: 'Regular Thaali', category: 'lunch', price: 150, description: 'Fresh Food, Happy Mood!', rating: 4.9 }
    ];

    for (const item of menuItems) {
      await client.query(
        'INSERT INTO menu_items (name, category, price, description, rating, available) VALUES ($1, $2, $3, $4, $5, $6)',
        [item.name, item.category, item.price, item.description, item.rating, true]
      );
    }

    // Insert default stock
    const stocks = [
      { item_name: 'Rice', quantity: 10 },
      { item_name: 'Coffee Beans', quantity: 7 },
      { item_name: 'Paneer', quantity: 4 }
    ];

    for (const stock of stocks) {
      await client.query(
        'INSERT INTO stock (item_name, quantity) VALUES ($1, $2)',
        [stock.item_name, stock.quantity]
      );
    }

    console.log('✅ Database seeded with initial data!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { initializeDatabase, seedDatabase };
