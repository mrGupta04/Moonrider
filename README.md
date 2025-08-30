# Moonride Dashboard - MERN Stack Project


A modern, responsive dashboard application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, data visualization, and profile management.

---
![Moonride Dashboard Screenshot](https://github.com/mrGupta04/Moonrider/blob/main/images/1.png?raw=true)
![Moonride Dashboard Screenshot](https://github.com/mrGupta04/Moonrider/blob/main/images/2.png?raw=true)
![Moonride Dashboard Screenshot](https://github.com/mrGupta04/Moonrider/blob/main/images/3.png?raw=true)
![Moonride Dashboard Screenshot](https://github.com/mrGupta04/Moonrider/blob/main/images/4.png?raw=true)

## 🌟 Features

### 🔐 Authentication System

* Local Authentication - Email/password registration and login
* OAuth Integration - Google and GitHub social login
* JWT Token Management - Secure authentication with refresh tokens
* Protected Routes - Automatic redirect for unauthenticated users
* Session Management - Persistent login state

### 📊 Dashboard Features

* Interactive Statistics - Revenue, transactions, user metrics
* Data Visualization - Charts and graphs for analytics
* User Management - Profile editing and social links
* Responsive Design - Mobile-friendly interface
* Real-time Updates - Dynamic data presentation

### 🛠 Technical Features

* TypeScript - Full type safety throughout the application
* Tailwind CSS - Modern utility-first styling
* RESTful API - Clean and structured backend API
* MongoDB Atlas - Cloud database integration
* Modern React - Hooks, Context API, and functional components
* Passport.js - Comprehensive authentication strategies

---

## 🚀 Quick Start

### Prerequisites

* Node.js (v18 or higher)
* MongoDB Atlas account or local MongoDB installation
* npm or yarn package manager
* Git

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/moonride-dashboard.git
cd moonride-dashboard
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Environment Setup

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moonride?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
FRONTEND_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Session secret
SESSION_SECRET=your_session_secret_here_change_in_production
```

### Set up OAuth Applications

* Google OAuth: Create OAuth credentials in Google Cloud Console
* GitHub OAuth: Create a new OAuth App in GitHub Developer Settings

### Start the Development Servers

Backend:

```bash
cd backend
npm run dev
```

Server: [http://localhost:5000](http://localhost:5000)

Frontend:

```bash
cd frontend
npm start
```

Application: [http://localhost:3000](http://localhost:5173)

---

## 📁 Project Structure

```
moonride-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── types/
    │   ├── App.tsx
    │   └── index.tsx
    ├── public/
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

## 🔧 Development Scripts

### Backend

```bash
npm run dev      # Development server
npm run build    # Build TypeScript
npm start        # Start production server
npm test         # Run tests
npm run lint     # Linting
```

### Frontend

```bash
npm start        # Development server
npm run build    # Build production app
npm test         # Run tests
npm run lint     # Linting
```


## 🛡 Security Features

* JWT Authentication
* Password Hashing (bcryptjs)
* CORS Protection
* Input Validation
* Rate Limiting
* Helmet.js
* Environment Variables
* XSS & CSRF Protection

---

## 📱 Responsive Design

* Desktop (1200px+) - Full sidebar navigation, detailed charts
* Tablets (768px–1199px) - Collapsible sidebar, adaptive layouts
* Mobile (<768px) - Hamburger menu, stacked components



**MongoDB Atlas:** Create cluster, whitelist IP, and update `MONGODB_URI`.

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

Includes unit, integration, component, and E2E tests.

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

 
## 🙏 Acknowledgments

* React Team
* Tailwind CSS
* MongoDB
* Express.js
* Passport.js
* All Contributors

---

## 🔄 Version History

* v1.0.0 - Initial release with core functionality
* v1.1.0 - Advanced data visualization, real-time updates, enhanced mobile experience, theme customization
