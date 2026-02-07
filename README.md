# Ticketing System - README

## Overview

A production-ready **Ticketing Management System** built with modern fullstack technologies. Manage support tickets with role-based access (Users & Managers), real-time status updates, and built-in messaging system.

## ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based login with auto-registration
- 👥 **Role-Based Access** - Users & Managers with different permissions
- 🎫 **Ticket Management** - Create, view, update, and delete tickets
- 💬 **Built-in Chat** - Message system for ticket discussions
- 📊 **Dashboard** - Real-time statistics and filtering
- 🎨 **SaaS Dashboard Design** - Clean, modern UI with Tailwind CSS
- 📱 **Responsive** - Works seamlessly on all devices
- ⚡ **Fast** - Vite + React for lightning-fast performance

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| HTTP Client | Axios |
| State | Context API |

## 📋 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (Cloud Atlas or local)

### Quick Setup

1. **Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

2. **Frontend**
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Test Credentials
- **Manager**: denisraj@gmail.com / Lax1204
- **User**: Create any new account

## 📁 Project Structure

```
Ticketing_system/
├── server/
│   ├── config/db.js
│   ├── models/ (User, Ticket, Message)
│   ├── controllers/ (auth, ticket)
│   ├── routes/ (auth, ticket)
│   ├── middleware/ (authMiddleware)
│   └── server.js
├── client/
│   └── src/
│       ├── components/ (Navbar, TicketCard, etc.)
│       ├── pages/ (Login, Dashboard, etc.)
│       ├── context/ (AuthContext)
│       ├── api/ (axios config)
│       └── App.jsx
└── SETUP.md (Complete documentation)
```

## 🔐 Security

✅ Password hashing with bcrypt  
✅ JWT token authentication  
✅ Role-based access control  
✅ Protected routes  
✅ CORS enabled  
✅ Input validation  
✅ Error handling  

## 📖 Full Documentation

See [SETUP.md](./SETUP.md) for:
- ✅ Detailed setup instructions
- ✅ API documentation
- ✅ Environment variables
- ✅ Deployment guides
- ✅ Production checklist
- ✅ Troubleshooting
- ✅ Scaling suggestions

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login/Register user
- `GET /api/auth/me` - Get current user

### Tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - List tickets
- `GET /api/tickets/:id` - Get ticket details
- `PATCH /api/tickets/:id/status` - Update status (Manager)
- `DELETE /api/tickets/:id` - Delete ticket (Manager)
- `GET /api/tickets/count` - Get statistics
- `POST /api/tickets/:id/messages` - Add message

## 🎯 User Roles

### User
- Create and manage own tickets
- View only their tickets
- Add messages to tickets
- Filter by status

### Manager
- View all tickets
- Search across all tickets
- Change ticket status
- Delete tickets
- View system-wide statistics

## 🚀 Deployment

### Backend
- Ready for Heroku, Railway, or any Node.js hosting
- Uses environment variables for configuration
- MongoDB Atlas compatible

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static host
- Automatic client-side routing

## 📝 Scripts

### Backend
```bash
npm run dev    # Development with hot reload
npm start      # Production
```

### Frontend
```bash
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
```

## 🎨 UI/UX Features

- Clean SaaS-style dashboard
- Soft shadows and rounded corners (rounded-xl)
- Status color coding (Open=Yellow, Closed=Green, On Hold=Red)
- Real-time search and filtering
- Responsive grid layouts
- Loading states
- Error handling

## 📊 Performance

- ⚡ Vite for ultra-fast builds
- 🎯 React 18 with automatic batching
- 💾 Mongoose indexes on common queries
- 📦 Code splitting ready
- 🚀 Optimized for production

## 🔧 Maintenance

- Monitor error logs
- Database backups (MongoDB Atlas automated)
- Update dependencies regularly
- Monitor API performance
- Track user activity

## ❓ FAQ

**Q: Can users create their own accounts?**  
A: Yes, new users are auto-registered with "user" role.

**Q: How is password security handled?**  
A: Passwords are hashed with bcrypt (10 salt rounds) before storage.

**Q: Can managers see all tickets?**  
A: Yes, managers can view, search, filter, and delete all tickets.

**Q: Is the system mobile-friendly?**  
A: Yes, fully responsive with TailwindCSS.

**Q: Can I customize the login logic?**  
A: Yes, edit the special credentials in `server/controllers/authController.js`

## 📧 Support

For issues or questions, check [SETUP.md](./SETUP.md#-troubleshooting) for troubleshooting.

---

**Built with ❤️ for scalable ticketing systems**

**Status**: ✅ Production-Ready | **Version**: 1.0.0 | **License**: MIT
