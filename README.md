#  Wired - Realtime MERN Chat Application

A modern, high-performance, real-time messaging application built with the **MERN** stack (MongoDB, Express, React, Node.js), **Socket.IO** WebSockets, **JWT** Authentication, and **Tailwind CSS**.

---

## ✨ Features

- 🔐 **Authentication**: User signup, login, logout, and token persistence with JSON Web Tokens (JWT) & bcrypt.
- ⚡ **Realtime Messaging**: Instant 1-on-1 messaging powered by Socket.IO WebSockets.
- 🟢 **Online Presence**: Dynamic online/offline user indicators updating in real-time.
- ✍️ **Typing Indicators**: Live typing notifications when your chat partner is typing.
- 🖼️ **Image Attachments**: Send text messages and image attachments with instant preview overlay.
- 🎨 **Clean & Responsive UI**: Glassmorphism design system using Tailwind CSS, Lucide icons, and toast notifications.
- 📱 **Mobile Friendly**: Adaptive layout with drawer-style contact list for smaller screens.

---

## 📁 Project Structure

```
wired/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── controllers/          # Auth & Message API logic
│   │   ├── middleware/           # JWT auth verification
│   │   ├── models/               # User & Message Mongoose schemas
│   │   ├── routes/               # Express API endpoint definitions
│   │   ├── socket/socket.js      # Socket.IO connection & event handlers
│   │   └── server.js             # HTTP server entrypoint
│   ├── .env                      # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, ChatContainer, Input, Header
│   │   ├── context/              # AuthContext, SocketContext, ChatContext
│   │   ├── pages/                # LoginPage, SignUpPage, ChatPage
│   │   ├── services/api.js       # Axios helper instance
│   │   ├── App.jsx               # Protected Router setup
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── package.json                  # Root scripts
```

---

## 🚀 Quick Start

### 1. Environment Setup
Make sure MongoDB is installed and running locally, or configure your MongoDB Atlas connection URI in `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=made_by_tanish_agrawal_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 2. Install Dependencies
Run from the project root:
```bash
npm run install:all
```

### 3. Run Backend Server
```bash
npm run dev:backend
```
*Backend runs on `http://localhost:5000`*

### 4. Run Frontend Development Client
Open a new terminal tab and run:
```bash
npm run dev:frontend
```
*Frontend runs on `http://localhost:5173`*

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Hot Toast, Socket.io-client
- **Backend**: Node.js, Express.js, MongoDB / Mongoose, Socket.IO, JWT (`jsonwebtoken`), Bcryptjs, Cookie-Parser
