# Kwil AI Backend API

> **Scalable Node.js + Express backend for Kwil AI - An AI-powered food recipe assistant app**

---

## 🚀 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, Rate Limiting, Express Mongo Sanitize
- **Validation:** Express Validator
- **Password Hashing:** bcryptjs
- **Environment:** dotenv
- **Logging:** Morgan
- **Architecture:** MVC (Model-View-Controller)

---

## 📂 Project Structure

```
/backend/
├── server.js                 # Application entry point
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
│
└── /src/
    ├── /config/
    │   ├── database.js       # MongoDB connection
    │   └── jwt.js            # JWT token utilities
    │
    ├── /models/
    │   └── User.js           # User database model
    │
    ├── /controllers/
    │   ├── authController.js # Authentication logic
    │   └── userController.js # User management logic
    │
    ├── /routes/
    │   ├── authRoutes.js     # Auth endpoints
    │   └── userRoutes.js     # User endpoints
    │
    ├── /middleware/
    │   ├── authMiddleware.js # JWT verification
    │   └── errorHandler.js   # Global error handling
    │
    └── /utils/
        └── validators.js     # Input validation rules
```

---

## 🔧 Installation & Setup

### **1. Prerequisites**
```bash
# Ensure you have Node.js installed
node --version  # Should be 18.0.0 or higher

# Ensure you have MongoDB Atlas account or local MongoDB
```

### **2. Install Dependencies**
```bash
cd backend
npm install
```

### **3. Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual credentials
nano .env
```

**Required Environment Variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kwil-ai
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### **4. Start the Server**

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Server will start at:** `http://localhost:5000`

---

## 🔐 Authentication System

### **Features Implemented**
- ✅ User Registration with email + password
- ✅ User Login with JWT token generation
- ✅ Password hashing using bcryptjs (10 salt rounds)
- ✅ JWT-based authentication middleware
- ✅ Protected routes
- ✅ Token refresh endpoint
- ✅ Profile management
- ✅ Diet preferences storage

### **Security Features**
- ✅ Password strength validation (min 6 chars, uppercase, lowercase, number)
- ✅ Email validation
- ✅ Bcrypt password hashing
- ✅ JWT token expiration (7 days default)
- ✅ HTTP-only cookies option
- ✅ CORS protection
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet.js security headers
- ✅ NoSQL injection protection
- ✅ Input sanitization

---

## 📡 API Endpoints

### **Base URL:** `http://localhost:5000/api`

---

### **Authentication Endpoints**

#### **1. Register User**
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "dietType": ["vegan", "high-protein"],
  "cuisinePreference": ["indian", "italian"],
  "healthGoal": ["weight-management"],
  "budget": 300
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "dietType": ["vegan", "high-protein"],
    "cuisinePreference": ["indian", "italian"],
    "healthGoal": ["weight-management"],
    "budget": 300,
    "subscriptionPlan": "free",
    "createdAt": "2024-02-15T10:30:00.000Z"
  }
}
```

---

#### **2. Login User**
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

---

#### **3. Get Current User** 🔒
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "dietType": ["vegan"],
    "cuisinePreference": ["indian"],
    "healthGoal": ["weight-management"],
    "budget": 300,
    "subscriptionPlan": "free",
    "isSubscriptionActive": true,
    "createdAt": "2024-02-15T10:30:00.000Z"
  }
}
```

---

#### **4. Logout** 🔒
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### **5. Check Authentication** 🔒
```http
GET /api/auth/check
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "subscriptionPlan": "free"
  }
}
```

---

### **User Management Endpoints**

#### **6. Get User Profile** 🔒
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "dietType": ["vegan", "high-protein"],
    "cuisinePreference": ["indian", "italian"],
    "healthGoal": ["weight-management"],
    "budget": 300,
    "subscriptionPlan": "free",
    "profileImage": null,
    "measurementUnit": "metric",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true,
      "mealReminders": false
    }
  }
}
```

---

#### **7. Update Profile** 🔒
```http
PUT /api/users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "profileImage": "https://example.com/image.jpg",
  "measurementUnit": "imperial",
  "language": "hi"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

#### **8. Update Preferences** 🔒
```http
PUT /api/users/preferences
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "dietType": ["keto", "high-protein"],
  "cuisinePreference": ["mexican", "thai"],
  "healthGoal": ["muscle-building"],
  "budget": 500
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "user": { ... }
}
```

---

#### **9. Update Notifications** 🔒
```http
PUT /api/users/notifications
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": true,
  "push": false,
  "mealReminders": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification settings updated successfully",
  "notifications": {
    "email": true,
    "push": false,
    "mealReminders": true
  }
}
```

---

#### **10. Change Password** 🔒
```http
PUT /api/users/password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456",
  "confirmPassword": "NewPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

#### **11. Get User Statistics** 🔒
```http
GET /api/users/stats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalSavedRecipes": 12,
    "totalCookedMeals": 45,
    "memberSince": "2024-02-15T10:30:00.000Z",
    "subscriptionPlan": "free",
    "isSubscriptionActive": true,
    "lastLogin": "2024-02-20T14:22:00.000Z",
    "preferences": {
      "dietType": ["vegan"],
      "cuisinePreference": ["indian"],
      "healthGoal": ["weight-management"],
      "budget": 300
    }
  }
}
```

---

#### **12. Save Recipe** 🔒
```http
POST /api/users/recipes/:recipeId/save
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Recipe saved successfully",
  "savedRecipes": ["507f...", "608a..."]
}
```

---

#### **13. Unsave Recipe** 🔒
```http
DELETE /api/users/recipes/:recipeId/unsave
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Recipe removed from favorites",
  "savedRecipes": ["507f..."]
}
```

---

#### **14. Get Saved Recipes** 🔒
```http
GET /api/users/recipes/saved
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "recipes": [
    {
      "_id": "507f...",
      "title": "Paneer Tikka",
      "image": "...",
      "cookTime": "30 min",
      "difficulty": "medium"
    }
  ]
}
```

---

#### **15. Delete Account** 🔒
```http
DELETE /api/users/account
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

## 🗄️ Database Models

### **User Model**

```javascript
{
  name: String,              // User's full name
  email: String,             // Unique email (lowercase)
  password: String,          // Hashed password (bcrypt)
  
  // Preferences
  dietType: [String],        // weight-loss, vegan, keto, etc.
  cuisinePreference: [String], // indian, italian, mexican, etc.
  healthGoal: [String],      // high-protein, low-carb, etc.
  budget: Number,            // Monthly food budget
  
  // Subscription
  subscriptionPlan: String,  // free, basic, premium, enterprise
  subscriptionExpiresAt: Date,
  
  // Profile
  profileImage: String,
  measurementUnit: String,   // metric or imperial
  language: String,          // en, hi, es, etc.
  
  // Relationships
  savedRecipes: [ObjectId],  // Ref: Recipe
  cookingHistory: [{
    recipeId: ObjectId,
    cookedAt: Date,
    rating: Number
  }],
  
  // Settings
  notifications: {
    email: Boolean,
    push: Boolean,
    mealReminders: Boolean
  },
  
  // Status
  isEmailVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Authentication Flow

### **1. Registration Flow**
```
Client → POST /api/auth/register
  ↓
Validate input
  ↓
Check if email exists
  ↓
Hash password (bcrypt)
  ↓
Create user in DB
  ↓
Generate JWT token
  ↓
Return token + user data
```

### **2. Login Flow**
```
Client → POST /api/auth/login
  ↓
Find user by email
  ↓
Compare password (bcrypt)
  ↓
Check if account active
  ↓
Update last login
  ↓
Generate JWT token
  ↓
Return token + user data
```

### **3. Protected Route Access**
```
Client → GET /api/users/profile
         Authorization: Bearer <token>
  ↓
Extract token from header
  ↓
Verify JWT signature
  ↓
Check token expiration
  ↓
Find user by ID from token
  ↓
Check if user active
  ↓
Attach user to req.user
  ↓
Continue to controller
```

---

## 🛡️ Security Best Practices

### **Implemented:**
- ✅ **Password Hashing:** bcrypt with 10 salt rounds
- ✅ **JWT Tokens:** 7-day expiration, HTTP-only cookies
- ✅ **Rate Limiting:** 100 requests per 15 minutes per IP
- ✅ **CORS:** Whitelist allowed origins
- ✅ **Helmet.js:** Security HTTP headers
- ✅ **Input Validation:** Express Validator
- ✅ **NoSQL Injection Prevention:** Express Mongo Sanitize
- ✅ **Error Handling:** No sensitive data in error messages
- ✅ **Environment Variables:** Sensitive data in .env

### **Recommendations for Production:**
- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Implement refresh tokens
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] Account lockout after failed login attempts
- [ ] IP whitelisting for admin routes
- [ ] Regular security audits
- [ ] Use secrets management service (AWS Secrets Manager, HashiCorp Vault)

---

## 🚀 Deployment

### **Environment Variables for Production**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<generate-strong-random-secret>
CLIENT_URL=https://kwilai.com
ALLOWED_ORIGINS=https://kwilai.com,https://www.kwilai.com
```

### **Deployment Platforms**

**1. Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

**2. Render**
- Connect GitHub repository
- Set environment variables in dashboard
- Auto-deploy on push to main branch

**3. AWS EC2**
```bash
# SSH into server
ssh -i key.pem ubuntu@ec2-ip

# Install Node.js, MongoDB, PM2
# Clone repository
# Set environment variables
# Start with PM2
pm2 start server.js --name kwil-api
```

---

## 📊 Testing

### **Manual Testing with Postman**

**1. Import Collection:**
- Use the API endpoints listed above
- Set `BASE_URL` variable to `http://localhost:5000`

**2. Test Flow:**
```
1. Register → Get token
2. Login → Get token
3. Get Profile (use token in Authorization header)
4. Update Preferences
5. Change Password
6. Logout
```

### **Testing Commands**
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

---

## 📝 Error Handling

### **Error Response Format**
```json
{
  "success": false,
  "error": "Error message here",
  "stack": "..." // Only in development mode
}
```

### **Common HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## 🔮 Next Steps

### **Phase 2: Recipe Management**
- [ ] Create Recipe model
- [ ] Recipe CRUD endpoints
- [ ] Recipe search and filtering
- [ ] Integration with Spoonacular API

### **Phase 3: AI Features**
- [ ] Google Gemini AI integration
- [ ] Ingredient detection (Google Vision API)
- [ ] Recipe recommendations
- [ ] Meal planning

### **Phase 4: Advanced Features**
- [ ] Shopping list management
- [ ] Cooking history tracking
- [ ] Social features (sharing, following)
- [ ] Subscription payment (Stripe/Razorpay)

---

## 📞 Support

For questions or issues:
- Check documentation in `/backend/README.md`
- Review API endpoint examples above
- Test with Postman collection

---

**Version:** 1.0.0  
**Last Updated:** February 15, 2026  
**Status:** ✅ Production Ready  
**License:** MIT

---

**Happy Coding! 🚀**
