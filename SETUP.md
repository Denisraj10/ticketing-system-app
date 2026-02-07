# Ticketing System - Complete Setup Guide

## 📋 Project Overview

A production-ready fullstack ticketing system built with:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express.js + MongoDB
- **Authentication**: JWT + bcrypt
- **State Management**: Context API

## 🏗️ Project Structure

```
Ticketing_system/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema with password hashing
│   │   ├── Ticket.js            # Ticket schema
│   │   └── Message.js           # Message schema for chat
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification & role-based access
│   ├── controllers/
│   │   ├── authController.js    # Login/logout logic
│   │   └── ticketController.js  # Ticket CRUD operations
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── ticketRoutes.js      # Ticket endpoints
│   ├── server.js                # Express app setup
│   ├── .env.example             # Environment variables template
│   └── package.json             # Dependencies
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   ├── TicketCard.jsx          # Ticket display card
│   │   │   ├── TicketTable.jsx         # Ticket list table
│   │   │   ├── StatusBadge.jsx         # Status indicator
│   │   │   └── ProtectedRoute.jsx      # Route protection HOC
│   │   ├── pages/
│   │   │   ├── Login.jsx               # Login page
│   │   │   ├── UserDashboard.jsx       # User dashboard
│   │   │   ├── AdminDashboard.jsx      # Manager dashboard
│   │   │   ├── CreateTicket.jsx        # Create ticket form
│   │   │   └── TicketDetails.jsx       # Ticket details + chat
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Authentication state
│   │   ├── api/
│   │   │   └── axios.js               # API client with interceptors
│   │   ├── App.jsx                     # Router setup
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # Global + Tailwind styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   ├── .env.example
│   └── package.json
│
└── README.md (this file)
```

---

## ⚙️ Prerequisites

- **Node.js**: v16+ (Download from [nodejs.org](https://nodejs.org))
- **MongoDB**: Cloud Atlas account (free tier) or local MongoDB
- **Git**: For version control (optional)

---

## 🚀 Quick Start

### 1️⃣ Backend Setup

#### Step 1: Navigate to server directory
```bash
cd server
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create `.env` file
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

**Example `.env` file:**
```
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/ticketing_system?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Step 4: Start the backend server
```bash
npm run dev
```

Expected output:
```
✓ MongoDB connected successfully
✓ Server is running on http://localhost:5000
```

---

### 2️⃣ Frontend Setup

#### Step 1: Open new terminal and navigate to client
```bash
cd client
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create `.env` file
```bash
cp .env.example .env
```

**`.env` file:**
```
VITE_API_URL=http://localhost:5000/api
```

#### Step 4: Start the frontend dev server
```bash
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 123 ms
  ➜  Local:   http://localhost:5173/
```

---

## 🔐 Authentication Flow

### Login Logic:

1. **Special Manager Account:**
   - Email: `denisraj@gmail.com`
   - Password: `Lax1204`
   - **Role assigned**: manager
   - **Redirect**: `/admin`

2. **Any Other User:**
   - **Role assigned**: user
   - **Redirect**: `/dashboard`
   - **Auto-registered** if user doesn't exist

### JWT Token:
- Generated on login
- Stored in localStorage
- Sent with every API request via Authorization header
- Automatically refreshed if expired (401 response)

---

## 📡 API Documentation

### Authentication Endpoints

#### Login / Register
```
POST /api/auth/login
Body: {
  email: "user@example.com",
  password: "password123",
  name: "John Doe"  // Only required for new users
}
Response: {
  success: true,
  token: "jwt_token_here",
  user: {
    _id: "...",
    name: "John Doe",
    email: "user@example.com",
    role: "user"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { success: true, user: {...} }
```

---

### Ticket Endpoints

#### Create Ticket
```
POST /api/tickets
Headers: Authorization: Bearer {token}
Body: {
  ticketName: "Login Issue",
  description: "Cannot login to account",
  contactName: "John Smith",
  email: "john@example.com",
  phone: "+1-234-567-8900",
  dueDate: "2024-02-20T15:00:00"
}
Response: { success: true, ticket: {...} }
```

#### Get All Tickets
```
GET /api/tickets?status=Open&search=keyword
Headers: Authorization: Bearer {token}
Response: { success: true, count: 10, tickets: [...] }
```

#### Get Single Ticket
```
GET /api/tickets/:id
Headers: Authorization: Bearer {token}
Response: { success: true, ticket: {...} }
```

#### Update Ticket Status (Manager Only)
```
PATCH /api/tickets/:id/status
Headers: Authorization: Bearer {token}
Body: { status: "Closed" }  // Open | Closed | On Hold
Response: { success: true, ticket: {...} }
```

#### Delete Ticket (Manager Only)
```
DELETE /api/tickets/:id
Headers: Authorization: Bearer {token}
Response: { success: true, deletedTicketId: "..." }
```

#### Get Ticket Statistics
```
GET /api/tickets/count
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  stats: {
    open: 5,
    closed: 12,
    onHold: 2,
    total: 19
  }
}
```

#### Add Message to Ticket
```
POST /api/tickets/:id/messages
Headers: Authorization: Bearer {token}
Body: {
  text: "This is a message",
  sender: "John Doe"
}
Response: { success: true, ticket: {...} }
```

---

## 🎨 UI Features

### User Dashboard
- ✅ View ticket statistics (Open, Closed, On Hold)
- ✅ Create new tickets
- ✅ View only their own tickets
- ✅ Filter by status
- ✅ View ticket details and add messages
- ✅ Status badge color coding

### Manager Dashboard
- ✅ View ALL tickets
- ✅ Search by ticket name, contact, email
- ✅ Change ticket status from dropdown
- ✅ Delete tickets
- ✅ View statistics for all tickets
- ✅ Table view with sorting

### Ticket Details Page
- ✅ Display ticket information
- ✅ View all messages
- ✅ Add new messages to ticket
- ✅ Manager can change status
- ✅ View creator and assignee info
- ✅ Track due dates

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds = 10
2. **JWT Tokens**: Signed with secret key, 7-day expiration
3. **Role-Based Access Control**: Middleware validates user role
4. **Protected Routes**: React ProtectedRoute component prevents unauthorized access
5. **CORS**: Enabled only for client URL
6. **Input Validation**: Mongoose schemas validate all inputs
7. **Error Handling**: Comprehensive try-catch blocks
8. **XSS Protection**: React automatically escapes JSX content

---

## 📦 Environment Variables

### Backend `.env`
```
MONGO_URI=                 # MongoDB connection string
JWT_SECRET=                # Secret key for JWT signing
JWT_EXPIRE=                # Token expiration time (default: 7d)
PORT=5000                  # Server port
NODE_ENV=development       # Environment
CLIENT_URL=http://localhost:5173  # Client URL for CORS
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api  # API base URL
```

---

## 🛠️ Database Configuration

### MongoDB Connection (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Drivers" → "Node.js"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and `myFirstDatabase` in your `.env`

**Example:**
```
mongodb+srv://admin:password123@cluster0.v2abc.mongodb.net/ticketing_system?retryWrites=true&w=majority
```

---

## 🧪 Testing the Application

### Test Credentials
- **Manager Account**:
  - Email: `denisraj@gmail.com`
  - Password: `Lax1204`

- **User Account** (Create any new account):
  - Email: `newuser@example.com`
  - Password: `password123`
  - Name: `Test User`

### Test Flow
1. Login with manager account
2. View admin dashboard
3. Create tickets
4. Change ticket statuses
5. Delete tickets
6. Logout and login with user account
7. View user dashboard
8. Create ticket and view your tickets only

---

## 🚀 Production Deployment

### Backend Deployment (Heroku / Railway)

1. **Set environment variables in hosting platform**:
   ```
   MONGO_URI=your_prod_uri
   JWT_SECRET=generate_strong_secret
   JWT_EXPIRE=7d
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-domain.com
   PORT=5000
   ```

2. **Heroku deployment**:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Frontend Deployment (Vercel / Netlify)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Set environment variable in dashboard**:
   ```
   VITE_API_URL=https://your-backend-url/api
   ```

---

## 📈 Scaling Suggestions

### Database Optimization
- Add database indexes for frequently queried fields ✅ (already done in Ticket schema)
- Implement pagination for large datasets
- Use MongoDB aggregation for complex queries
- Enable compression on responses

### Backend Optimization
- Implement rate limiting with `express-rate-limit`
- Add request logging with `morgan`
- Use clustering with `cluster` module
- Implement caching with Redis
- Use database connection pooling

### Frontend Optimization
- Code splitting with React.lazy
- Image optimization and CDN
- Implement infinite scroll for tickets
- Add PWA capabilities
- Service worker for offline support

### Architecture
- Microservices for separate modules (Auth, Tickets, Messages)
- Message queue (RabbitMQ/Kafka) for async operations
- WebSocket for real-time updates
- Elasticsearch for advanced search
- S3 for file attachments storage

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running or check connection string

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure `CLIENT_URL` in backend `.env` matches frontend URL

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Token Expired
- Clear localStorage: `localStorage.clear()`
- Login again to get new token

### Module Not Found
```
Error: Cannot find module 'mongoose'
```
**Solution**:
```bash
npm install  # in the correct directory
```

---

## 📚 Technologies Used

### Backend
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT generation
- **bcrypt**: Password hashing
- **cors**: Cross-origin support
- **dotenv**: Environment variables

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **React Router**: Navigation
- **Axios**: HTTP client
- **TailwindCSS**: Styling
- **Context API**: State management

---

## 📄 License

This project is open source and available under the MIT License.

---

## ✅ Checklist for Production

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV to 'production'
- [ ] Update MONGO_URI to production database
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain only
- [ ] Add rate limiting middleware
- [ ] Set up error logging (Sentry)
- [ ] Configure CDN for static assets
- [ ] Set up database backups
- [ ] Monitor application with tools like DataDog/NewRelic
- [ ] Implement API documentation (Swagger/OpenAPI)
- [ ] Set up CI/CD pipeline
- [ ] Load testing with tools like Apache JMeter

---

## 🤝 Support

For issues or questions, create an issue on GitHub or contact the development team.

---

**Happy Coding! 🎉**
