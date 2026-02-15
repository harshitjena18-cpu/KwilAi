# Kwil AI Backend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### **Step 1: Install Dependencies**
```bash
cd backend
npm install
```

### **Step 2: Set Up Environment**
```bash
# Copy environment template
cp .env.example .env
```

**Edit `.env` file with your MongoDB credentials:**
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/kwil-ai
JWT_SECRET=your-random-secret-key-min-32-characters
```

### **Step 3: Start Server**
```bash
npm run dev
```

**You should see:**
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🍽️  Kwil AI Backend Server Started                 ║
║                                                       ║
║   Environment: DEVELOPMENT                            ║
║   Port:        5000                                   ║
║   Database:    Connected ✓                            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

---

## 🧪 Test the API

### **1. Health Check**
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Kwil AI API is running",
  "environment": "development"
}
```

### **2. Register a User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "dietType": ["vegan"],
    "budget": 300
  }'
```

**Save the `token` from the response!**

### **3. Get User Profile**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/users/profile` | Get full profile | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| PUT | `/api/users/preferences` | Update diet preferences | ✅ |
| PUT | `/api/users/password` | Change password | ✅ |
| GET | `/api/users/stats` | Get user statistics | ✅ |

---

## 🔑 Authentication

**All protected endpoints require a JWT token in the Authorization header:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get a token:**
1. Register: `POST /api/auth/register`
2. Or Login: `POST /api/auth/login`
3. Copy the `token` from response
4. Use it in subsequent requests

---

## 🗄️ MongoDB Setup (Atlas)

### **Option 1: MongoDB Atlas (Cloud - Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database password
7. Paste in `.env` as `MONGODB_URI`

**Example:**
```
MONGODB_URI=mongodb+srv://kwiluser:mypassword123@cluster0.abc123.mongodb.net/kwil-ai?retryWrites=true&w=majority
```

### **Option 2: Local MongoDB**

```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
# or download from mongodb.com

# Start MongoDB
brew services start mongodb-community

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/kwil-ai
```

---

## 🔐 Generate JWT Secret

**Strong random secret (recommended):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output example:**
```
9af2e1c3b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1
```

Copy this to `.env` as `JWT_SECRET`.

---

## 🐛 Troubleshooting

### **MongoDB Connection Error**
```
❌ MongoDB connection failed: MongoServerError: bad auth
```

**Solution:**
- Check username/password in connection string
- Ensure IP is whitelisted in MongoDB Atlas (Network Access)
- Allow access from anywhere: `0.0.0.0/0` (for development)

### **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Change PORT in .env
PORT=3000

# Or kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

### **JWT Secret Missing**
```
Error: JWT_SECRET is not defined
```

**Solution:**
- Ensure `.env` file exists
- Add `JWT_SECRET=your-secret-key`
- Restart server

---

## 📦 Package Scripts

```bash
npm start       # Start server (production)
npm run dev     # Start with nodemon (auto-reload)
```

---

## 🧪 Test with Postman

### **Import Collection**

1. Open Postman
2. Create new collection: "Kwil AI"
3. Add requests for each endpoint
4. Set environment variable:
   - `BASE_URL` = `http://localhost:5000`
   - `TOKEN` = (paste after login)

### **Example Request in Postman**

**Register User:**
- Method: `POST`
- URL: `{{BASE_URL}}/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123"
}
```

**Get Profile:**
- Method: `GET`
- URL: `{{BASE_URL}}/api/users/profile`
- Headers: `Authorization: Bearer {{TOKEN}}`

---

## 🎯 Next Steps

1. ✅ **Backend is ready!**
2. Connect frontend to backend
3. Test all API endpoints
4. Add more features (recipes, AI, etc.)

---

## 📞 Need Help?

- Check `/backend/README.md` for full documentation
- Review error logs in console
- Test endpoints one by one

**Happy Coding! 🚀**
