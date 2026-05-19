# 🍽️ Campus Canteen Automation System

A complete **Full-Stack Campus Canteen Automation System** developed using **Node.js, Express.js, MongoDB, HTML, CSS, and JavaScript**.

This project is designed to automate and simplify canteen operations inside colleges or campuses. It provides separate dashboards and functionalities for students, admin, kitchen staff, and cashiers.

---

# 🚀 Features

## 👨‍🎓 User Features
- User Registration & Login
- Browse Food Menu
- Place Orders
- QR Code Generation
- Order Tracking

## 👨‍💼 Admin Features
- Admin Dashboard
- Manage Food Items
- Manage Orders
- Upload Food Images
- Stock Management
- User Management

## 👨‍🍳 Kitchen Features
- Kitchen Dashboard
- Live Incoming Orders
- Update Food Status

## 💳 Cashier Features
- Billing System
- Payment Management
- Order Verification

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- MongoDB

## Other Tools & Libraries
- Multer
- QR Code Generator
- Express Router
- Node Package Manager (NPM)

---

# 📂 Project Structure

```bash
Campus-Canteen--Automation-System/
│
├── Canteen backend/
│   │
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── stock.js
│   │   ├── upload.js
│   │   └── user.js
│   │
│   ├── public/
│   │   └── uploads/
│   │
│   ├── view/
│   │   ├── admin.html
│   │   ├── cashier.html
│   │   ├── kitchen.html
│   │   ├── menu.html
│   │   ├── register.html
│   │   ├── qr-generator.html
│   │   └── index.html
│   │
│   ├── server.js
│   └── package.json
│
├── Canteen frontend/
│
└── README.md
