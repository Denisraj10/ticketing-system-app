# Environment Variables Setup Guide

## 🔧 Backend Configuration

### Create `server/.env`

Copy from `server/.env.example` and configure:

```env
# MongoDB Connection (Required)
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/ticketing_system?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production_at_least_32_chars
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### How to Get MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Drivers" → "Node.js"
5. Copy connection string
6. Replace `<username>`, `<password>`, and `myFirstDatabase`
7. Paste into `MONGO_URI`

**Example Format**:
```
mongodb+srv://admin:mypassword123@cluster0.v2abc.mongodb.net/ticketing_system?retryWrites=true&w=majority
```

### JWT Secret Best Practice

Generate a secure random key:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: 7f2c9e1b4d8a6f3c2e1b9d4a7f2c8e5b1d9c3f6e8a2b4d7f9e1c3a5b7d9f1
```

---

## 🎨 Frontend Configuration

### Create `client/.env`

Copy from `client/.env.example`:

```env
# API Server URL
VITE_API_URL=http://localhost:5000/api
```

### Production Example

```env
# For production deployment
VITE_API_URL=https://your-api-domain.com/api
```

---

## 🚀 Production Environment Variables

### Backend Production `.env`

```env
MONGO_URI=mongodb+srv://prod_user:prod_password@prod-cluster.mongodb.net/ticketing_system_prod?retryWrites=true&w=majority
JWT_SECRET=generate_a_very_strong_random_key_with_32_characters_minimum
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend Production `.env`

```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## ✅ Environment Variables Checklist

### Backend
- [ ] MONGO_URI set correctly
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] PORT configured
- [ ] NODE_ENV set to "production"
- [ ] CLIENT_URL matches frontend domain

### Frontend
- [ ] VITE_API_URL points to backend
- [ ] URL is correct for environment

---

## 🔐 Security Notes

1. **Never commit `.env` files** to Git
2. **Use `.gitignore`** to exclude `.env`
3. **Generate strong JWT secrets** (32+ characters)
4. **Use environment-specific values**
5. **Rotate secrets periodically** in production
6. **Use secrets management** in production (AWS Secrets Manager, Vault, etc.)

---

## 📝 .gitignore Example

```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
dist/

# Logs
logs/
*.log

# OS
.DS_Store
.env.example.backup
```

---

## 🧪 Testing Environment Variables

### Backend

```bash
# Test MongoDB connection
cd server
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI);"

# Test JWT secret
node -e "require('dotenv').config(); console.log('JWT Secret length:', process.env.JWT_SECRET.length);"
```

### Frontend

```bash
cd client
npm run dev
# Check browser console - should show API URL
```

---

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Check `MONGO_URI` is correct and MongoDB is running

### JWT Error
```
Error: secretOrPrivateKey required
```
**Solution**: Ensure `JWT_SECRET` is set in `.env`

### CORS Error
```
Access-Control-Allow-Origin header missing
```
**Solution**: Ensure `CLIENT_URL` in backend matches frontend origin

### Port Already in Use
```
Error: listen EADDRINUSE
```
**Solution**: Change `PORT` in `.env` or kill existing process

---

## 📊 Environment Variables by Layer

| Variable | Backend | Frontend | Required | Format |
|----------|---------|----------|----------|--------|
| MONGO_URI | ✅ | ❌ | Yes | Connection string |
| JWT_SECRET | ✅ | ❌ | Yes | Random string 32+ |
| JWT_EXPIRE | ✅ | ❌ | No | "7d", "24h" |
| PORT | ✅ | ❌ | No | Number |
| NODE_ENV | ✅ | ❌ | No | "development", "production" |
| CLIENT_URL | ✅ | ❌ | Yes | URL |
| VITE_API_URL | ❌ | ✅ | Yes | URL |

---

## 🎯 Quick Reference

### Development Setup
```bash
# Backend .env
MONGO_URI=mongodb+srv://...
JWT_SECRET=dev_secret_key_change_me
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Frontend .env
VITE_API_URL=http://localhost:5000/api
```

### Production Setup
```bash
# Backend .env (use secrets manager in real production)
MONGO_URI=mongodb+srv://prod:***@prod.mongodb.net/db
JWT_SECRET=***generated_secure_key*** (32+ chars)
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com

# Frontend .env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 🔄 Environment Variables in Code

### Backend Usage
```javascript
// config/db.js
const mongoUri = process.env.MONGO_URI;

// middleware/authMiddleware.js
const secret = process.env.JWT_SECRET;

// server.js
const port = process.env.PORT || 5000;
```

### Frontend Usage
```javascript
// api/axios.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 📱 Platform-Specific Deployment

### Heroku
```bash
# Set environment variables
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
```

### Railway
```bash
# Use Railway dashboard to set variables
# Or create railway.json
```

### Vercel (Frontend)
```bash
# Use Vercel dashboard
# Environment Variables → Add VITE_API_URL
```

### AWS
```bash
# Use AWS Systems Manager Parameter Store
# Or AWS Secrets Manager
```

---

## ✨ Pro Tips

1. **Use dotenv-safe** to validate required variables
2. **Log environment** on startup for debugging
3. **Never log sensitive** data in production
4. **Rotate secrets** regularly
5. **Use different values** for each environment
6. **Document all** required variables
7. **Test variables** before deployment
8. **Monitor variable** changes in production

---

**Your environment is ready to configure! 🚀**
