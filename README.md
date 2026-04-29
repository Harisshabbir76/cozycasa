# Resi D' Elite - Real Estate Property Booking Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MongoDB-green)](https://nodejs.org)
[![Frontend](https://img.shields.io/badge/Frontend-React-red)](https://reactjs.org)

Resi D' Elite is a full-stack web application for booking real estate properties. Built with the MERN stack (MongoDB, Express, React, Node.js), it allows users to browse properties, make bookings, handle payments via Stripe, and provides an admin dashboard for property management.

## ✨ Features

- **User Authentication**: Register, login, forgot password (JWT-based).
- **Property Management**: Search, view details, map integration (Leaflet), image uploads.
- **Bookings & Payments**: Checkout with Stripe, booking confirmation, review system.
- **Admin Dashboard**: Add/edit/delete properties & types, view bookings & messages, overview stats.
- **Additional**: FAQs, contact form, responsive design, slug generation, email notifications.
- **Todo Features**: Hero search, modal plans, messages tabs, city features (see [TODOs](TODO.md)).

## 🛠 Tech Stack

| Category       | Technologies |
|----------------|--------------|
| **Backend**    | Node.js, Express, Mongoose (MongoDB), JWT, bcrypt, Multer, Stripe, Nodemailer |
| **Frontend**   | React, React Router, Axios, Stripe Elements, React Leaflet, React Datepicker, React Dropzone, React Icons |
| **Database**   | MongoDB |
| **Other**      | CORS, dotenv, Nodemon (dev) |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Stripe account (test keys)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/booking_web.git
   cd booking_web
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Create .env with DB_URI, JWT_SECRET, STRIPE_KEY, etc.
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
   App runs on `http://localhost:3000`.

4. **Environment Variables** (backend/.env)
   ```
   DB_URI=mongodb://localhost:27017/cozycasa
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

## 📋 API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/api/auth/register`  | User registration       |
| POST   | `/api/auth/login`     | User login              |
| GET    | `/api/properties`     | List properties         |
| POST   | `/api/properties`     | Add property (admin)    |
| GET    | `/api/bookings`       | User bookings           |

See backend/routes for full list.

## 🖼 Screenshots

<!-- Add screenshots here: Home page, Property detail, Admin dashboard -->

## 📂 Project Structure

```
booking_web/
├── backend/          # Express API server
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js
├── frontend/         # React app
│   ├── src/pages/    # Pages & components
│   └── src/context/  # Auth context
└── README.md
```

## 🤝 Contributing

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

See TODO files for pending tasks.

## 📄 License

ISC License. See [LICENSE](LICENSE) (create if needed).

## 🙌 Acknowledgments

- Built with love for real estate booking solutions.
- Icons from React Icons.
- Maps powered by Leaflet.

---

⭐ Star this repo if you find it useful!

