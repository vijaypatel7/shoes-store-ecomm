# 👟 SoleStore — Full-Stack E-Commerce Platform

A modern, full-featured sneaker e-commerce platform built with React, Node.js,
Express, and MongoDB.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🛍️ Customer
- Browse & search products with advanced filters
  (brand, size, color, price range, rating)
- Product quick view modal with image gallery & zoom
- Fully responsive mobile-first design
- Add to cart / wishlist with real-time updates
- Order tracking & history
- User profile management

### 🔐 Authentication
- JWT-based authentication (access + refresh tokens)
- Protected routes for customers and admins
- Demo accounts for instant preview

### 🔧 Admin Panel
- **Dashboard** — Real-time stats, revenue charts, low stock alerts
- **Analytics** — Revenue trends, order volumes, category breakdown,
  user growth (Recharts)
- **Product Manager** — Full CRUD with image upload, size/color variants,
  discount management
- **Order Manager** — View, filter, export, and update order statuses

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Routing** | React Router v6 |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Notifications** | React Hot Toast |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (access + refresh tokens) |
| **File Upload** | Multer + Cloudinary |
| **Payments** | Razorpay | Integrate PayU or Cashfree for Address saving and direct chckoout.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/solestore.git
cd solestore
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see Environment Variables section)
npm run dev
```

The backend server starts on **http://localhost:5001**

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5001/api
npm run dev
```

The frontend starts on **http://localhost:5173**

### 4. Seed the Database (Optional)

```bash
cd backend
npm run seed
```

This creates sample products, users, and orders for testing.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/solestore

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=razorpay_key_id
RAZORPAY_KEY_SECRET=razorpay_key_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 📡 API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/api/auth/me` | Get current user |

### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products (with filters) |
| `GET` | `/api/products/:id` | Get single product |
| `GET` | `/api/products/:id/reviews` | Get product reviews |
| `POST` | `/api/products/:id/reviews` | Add a review (auth) |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | Get user orders (auth) |
| `GET` | `/api/orders/:id` | Get order by ID (auth) |
| `POST` | `/api/orders` | Create new order (auth) |

### Cart & Wishlist

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cart` | Get cart (auth) |
| `POST` | `/api/cart` | Add item to cart (auth) |
| `PUT` | `/api/cart/:itemId` | Update cart item (auth) |
| `DELETE` | `/api/cart/:itemId` | Remove cart item (auth) |
| `GET` | `/api/wishlist` | Get wishlist (auth) |
| `POST` | `/api/wishlist/:productId` | Add to wishlist (auth) |
| `DELETE` | `/api/wishlist/:productId` | Remove from wishlist (auth) |

### Admin (🔑 Admin only)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard statistics |
| `GET` | `/api/admin/analytics/summary` | Analytics summary |
| `GET` | `/api/admin/analytics/charts` | Analytics chart data |
| `GET` | `/api/admin/orders` | All orders (paginated) |
| `PATCH` | `/api/admin/orders/:id/status` | Update order status |
| `GET` | `/api/admin/orders/export` | Export orders as CSV |
| `GET` | `/api/admin/products` | All products (admin) |
| `POST` | `/api/admin/products` | Create product |
| `PUT` | `/api/admin/products/:id` | Update product |
| `DELETE` | `/api/admin/products/:id` | Delete product |
| `GET` | `/api/admin/revenue` | Revenue chart data |

---

## 🌐 Deployment

### Frontend — Vercel

```bash
cd frontend
npm run build
```

### Backend — Railway / Render

1. Create a new service on [Railway](https://railway.app) or [Render](https://render.com)
2. Connect your GitHub repo
3. Set **Start Command**: `node server.js`
4. Add all environment variables from `backend/.env`
5. Set `NODE_ENV=production`

### MongoDB — Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist your deployment IP (`0.0.0.0/0` for Railway/Render)
3. Copy the connection string to `MONGODB_URI`

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

Built with ❤️ by **Vijay Patel**
---

<p align="center">
  <strong>⭐ Star this repo if you found it helpful!</strong>
</p>
