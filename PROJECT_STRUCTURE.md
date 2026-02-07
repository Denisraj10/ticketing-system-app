# Project Structure - Complete File Listing

## Backend Structure

### `server/package.json`
```json
{
  "name": "ticketing-system-server",
  "version": "1.0.0",
  "description": "Backend for ticketing system",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.1.2",
    "mongoose": "^8.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### `server/server.js`
Main Express application with routes and middleware

### `server/config/db.js`
MongoDB connection setup with error handling

### `server/models/User.js`
- Fields: name, email, password (hashed), role, createdAt
- Methods: comparePassword()
- Pre-save: Auto-hash passwords with bcrypt

### `server/models/Ticket.js`
- Fields: ticketName, description, contactName, email, phone, status, attachments, createdBy, assignedTo, dueDate, messages, createdAt
- Indexes: createdBy + status, assignedTo, createdAt

### `server/models/Message.js`
- Fields: sender, text, attachments, timestamp
- Used for ticket chat system

### `server/middleware/authMiddleware.js`
- `authMiddleware`: Verifies JWT tokens
- `roleMiddleware(roles)`: Checks user role permissions

### `server/controllers/authController.js`
- `login()`: Handles login/auto-registration with special manager logic
- `logout()`: Session cleanup
- `getCurrentUser()`: Fetch authenticated user

### `server/controllers/ticketController.js`
- `createTicket()`: Create new ticket
- `getTickets()`: List tickets with filters
- `getTicketById()`: Get single ticket
- `updateTicketStatus()`: Change status (manager only)
- `deleteTicket()`: Remove ticket (manager only)
- `getTicketStats()`: Statistics summary
- `assignTicket()`: Assign to manager (manager only)
- `addMessage()`: Add message to ticket

### `server/routes/authRoutes.js`
- `POST /api/auth/login`
- `GET /api/auth/logout`
- `GET /api/auth/me`

### `server/routes/ticketRoutes.js`
- `POST /api/tickets`
- `GET /api/tickets`
- `GET /api/tickets/:id`
- `PATCH /api/tickets/:id/status`
- `DELETE /api/tickets/:id`
- `GET /api/tickets/count`
- `POST /api/tickets/:id/messages`

### `server/.env.example`
Template for environment variables

---

## Frontend Structure

### `client/package.json`
React + Vite configuration with dependencies

### `client/index.html`
HTML entry point with root div

### `client/vite.config.js`
Vite build configuration

### `client/tailwind.config.js`
Tailwind CSS theme configuration

### `client/postcss.config.cjs`
PostCSS setup for Tailwind

### `client/.env.example`
Frontend environment variables

### `client/src/main.jsx`
React app entry point with ReactDOM render

### `client/src/App.jsx`
Main component with React Router setup and protected routes

### `client/src/index.css`
Global styles + Tailwind directives + custom animations

### Components (`client/src/components/`)

#### `Navbar.jsx`
- Navigation bar with user info
- Logout button
- User avatar with role display

#### `StatusBadge.jsx`
- Status indicator component
- Color-coded: Open (yellow), Closed (green), On Hold (red)

#### `ProtectedRoute.jsx`
- HOC for route protection
- Checks authentication and role
- Shows loading spinner

#### `TicketCard.jsx`
- Ticket display card component
- Shows ticket info, status, due date
- Calculates days remaining
- Clickable for details

#### `TicketTable.jsx`
- Ticket list in table format
- Manager can change status inline
- Delete button for managers
- Sortable columns

### Pages (`client/src/pages/`)

#### `Login.jsx`
- Login/registration form
- Email & password fields
- Name field for new users
- Test credentials display
- Auto-redirect based on role

#### `UserDashboard.jsx`
- User's dashboard view
- Ticket statistics cards
- Create ticket button
- Ticket grid with filtering
- Status filter buttons

#### `AdminDashboard.jsx`
- Manager's dashboard view
- All system statistics
- Search bar for tickets
- Status filter
- Table view of tickets
- Status change dropdown
- Delete button for each ticket

#### `CreateTicket.jsx`
- Form to create new ticket
- Fields: Title, Description, Contact, Email, Phone, Due Date
- Form validation
- Submit to backend
- Redirect to dashboard on success

#### `TicketDetails.jsx`
- View single ticket details
- Contact information
- Full description
- Message history
- Add message form
- Manager can change status from sidebar
- Creator and assignee info

### Context (`client/src/context/`)

#### `AuthContext.jsx`
- Global authentication state
- `login()`: Handle login flow
- `logout()`: Clear auth
- `useAuth()`: Custom hook for consuming context
- Token stored in localStorage

### API (`client/src/api/`)

#### `axios.js`
- Axios instance with base URL
- Request interceptor: Add JWT token to headers
- Response interceptor: Handle 401 errors
- Auto-redirect to login on token expiration

---

## Root Level Files

### `README.md`
Quick overview and feature list

### `SETUP.md`
Comprehensive setup guide with:
- Project structure breakdown
- Prerequisites
- Step-by-step setup (backend & frontend)
- Authentication flow
- Complete API documentation
- UI features breakdown
- Security features
- Environment variables
- Database configuration
- Testing guidelines
- Production deployment
- Scaling suggestions
- Troubleshooting
- Technologies used
- Production checklist

---

## File Statistics

- **Backend**: 8 files + dependencies
- **Frontend**: 19 files + dependencies
- **Configuration**: 4 files
- **Documentation**: 2 files

**Total**: 33+ production-ready files

---

## Key Features by File

| File | Features |
|------|----------|
| authMiddleware.js | JWT verification, role-based access |
| authController.js | Auto-registration, special manager logic |
| ticketController.js | Full CRUD operations, statistics |
| AuthContext.jsx | Global auth state, localStorage persistence |
| ProtectedRoute.jsx | Route protection with role checking |
| Login.jsx | Dynamic role assignment |
| UserDashboard.jsx | Personal ticket management |
| AdminDashboard.jsx | System-wide ticket management |
| TicketDetails.jsx | Chat system, status updates |

---

## Environment Setup Summary

### Backend .env
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=strong_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend .env
```
VITE_API_URL=http://localhost:5000/api
```

---

## Installation & Running

### Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm run dev
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
# Client runs on http://localhost:5173
```

---

**All files are production-ready and fully documented! 🚀**
