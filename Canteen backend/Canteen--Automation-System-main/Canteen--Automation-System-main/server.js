const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { initializeDatabase, seedDatabase } = require('./db-init.js');

const menuRoutes = require('./routes/menu.js');
const ordersRoutes = require('./routes/orders.js');
const stockRoutes = require('./routes/stock.js');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const adminRoutes = require('./routes/admin.js');
const uploadRoutes = require('./routes/upload.js');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendPath = path.join(__dirname, './view');
app.use(express.static(frontendPath));
const publicPath = path.join(__dirname, './public');
app.use(express.static(publicPath));
app.use('/uploads', express.static('public/uploads'));


console.log(`📁 Serving frontend files from: ${frontendPath}`);

app.use('/api', (req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`, {
    query: req.query,
    body: req.body,
  });

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`⬅️  ${res.statusCode} ${req.method} ${req.originalUrl} (${duration}ms)`);
  });
  next();
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date() });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

async function startServer() {
  try {
    console.log('🚀 Initializing database...');
    await initializeDatabase();
    
    console.log('🌱 Seeding database with initial data...');
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║   🍽️  Campus Canteen Automation System - Backend Server   ║
╚════════════════════════════════════════════════════════════╝

✅ Server is running on: http://localhost:${PORT}
📁 Frontend files served from: /frontend
📡 API Base URL: http://localhost:${PORT}/api

📚 Available API Routes:
  ├─ GET    /api/menu               - Get all menu items
  ├─ GET    /api/menu/:id           - Get menu item
  ├─ POST   /api/menu               - Add menu item (Admin)
  ├─ PUT    /api/menu/:id           - Update menu item (Admin)
  ├─ DELETE /api/menu/:id           - Delete menu item (Admin)
  │
  ├─ GET    /api/orders             - Get all orders
  ├─ GET    /api/orders/:id         - Get order
  ├─ POST   /api/orders             - Create order
  ├─ PATCH  /api/orders/:id/ready   - Mark as ready
  ├─ PATCH  /api/orders/:id/paid    - Mark as paid
  ├─ DELETE /api/orders/:id         - Delete order
  │
  ├─ GET    /api/stock              - Get all stock
  ├─ POST   /api/stock              - Add stock item
  ├─ PUT    /api/stock/:id          - Update stock
  ├─ PATCH  /api/stock/:id/increment - Increase quantity
  ├─ PATCH  /api/stock/:id/decrement - Decrease quantity
  │
  ├─ POST   /api/auth/register      - Register user
  ├─ POST   /api/auth/login         - Login user
  ├─ POST   /api/auth/demo-login    - Demo login (no DB)
  └─ GET    /api/auth/me            - Get current user

🌐 Access Application at: http://localhost:${PORT}

Database Configuration:
  Host: ${process.env.DB_HOST || 'localhost'}
  Port: ${process.env.DB_PORT || 5432}
  Database: ${process.env.DB_NAME || 'canteen_db'}

Press Ctrl+C to stop the server.
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
