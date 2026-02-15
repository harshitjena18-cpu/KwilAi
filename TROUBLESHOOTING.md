# 🔧 Troubleshooting Guide

## ✅ Error Fixed: axios Module Not Found

### **Issue:**
```
Failed to resolve import "axios" from "utils/axios.ts". Does the file exist?
```

### **Solution:**
✅ **Installed axios package** in the frontend dependencies

The `axios` package has been added to `/package.json` and is now available for import.

---

## 🚀 Verification Steps

### **1. Check Package Installation**

```bash
# Verify axios is in package.json
cat package.json | grep axios

# Expected output:
# "axios": "^1.13.5"
```

### **2. Restart Development Server**

If you're still seeing errors, restart the dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
# or
pnpm dev
# or
yarn dev
```

### **3. Clear Cache (if needed)**

```bash
# Clear node_modules cache
rm -rf node_modules
rm -rf .vite

# Reinstall
npm install
# or
pnpm install
```

---

## 📋 Complete Setup Checklist

### **Frontend Setup:**

- [x] ✅ axios package installed
- [x] ✅ `/src/utils/axios.ts` exists
- [x] ✅ `/src/config/api.ts` exists
- [x] ✅ `/src/services/recipeService.ts` created
- [x] ✅ TypeScript types defined

### **Backend Setup:**

- [ ] Get API keys from:
  - [ ] Spoonacular: https://spoonacular.com/food-api/console
  - [ ] Edamam (optional): https://developer.edamam.com/
  - [ ] Gemini AI (optional): https://ai.google.dev/

- [ ] Add to `/backend/.env`:
  ```env
  SPOONACULAR_API_KEY=your_key_here
  EDAMAM_APP_ID=your_app_id_here
  EDAMAM_APP_KEY=your_app_key_here
  GEMINI_API_KEY=your_key_here
  ```

- [ ] Install backend dependencies:
  ```bash
  cd backend
  npm install axios
  ```

- [ ] Start backend server:
  ```bash
  cd backend
  npm run dev
  ```

---

## 🧪 Test API Integration

### **Test 1: Health Check**

```bash
curl http://localhost:5000/health
```

**Expected:**
```json
{
  "success": true,
  "message": "Kwil AI API is running"
}
```

### **Test 2: Recipe Suggestions**

```bash
curl "http://localhost:5000/api/recipes/suggestions?ingredients=chicken,rice"
```

**Expected:**
```json
{
  "success": true,
  "count": 10,
  "recipes": [...]
}
```

### **Test 3: Frontend Service**

In your React component:

```typescript
import recipeService from '@/services/recipeService';

// Test
const { recipes } = await recipeService.getSuggestions({
  ingredients: ['chicken', 'rice'],
  limit: 10
});

console.log('Recipes:', recipes);
```

---

## ⚠️ Common Issues & Solutions

### **Issue 1: "CORS Error"**

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Add your frontend URL to backend CORS configuration:

```env
# backend/.env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

### **Issue 2: "401 Unauthorized"**

**Error:**
```json
{ "success": false, "message": "Not authorized" }
```

**Solution:**
Make sure you're authenticated for protected routes:

```typescript
// Login first
const { token } = await authService.login(email, password);
localStorage.setItem('kwil_auth_token', token);

// Then make protected requests
const { recipes } = await recipeService.getSavedRecipes();
```

---

### **Issue 3: "Spoonacular API Error"**

**Error:**
```
Spoonacular API error: Invalid API key
```

**Solution:**
1. Check API key in `/backend/.env`
2. Verify key is correct on Spoonacular dashboard
3. Check you haven't exceeded daily quota (150 requests/day)

---

### **Issue 4: "Module not found"**

**Error:**
```
Cannot find module '@/services/recipeService'
```

**Solution:**
Check your TypeScript path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### **Issue 5: "Network Error"**

**Error:**
```
Network Error
```

**Solution:**
1. Check backend is running: `http://localhost:5000/health`
2. Verify API_CONFIG.BASE_URL in `/src/config/api.ts`
3. Check firewall/antivirus isn't blocking connections

---

## 🔍 Debugging Tips

### **1. Enable Detailed Logging**

In `/src/utils/axios.ts`, add request logging:

```typescript
axiosInstance.interceptors.request.use((config) => {
  console.log('🔵 API Request:', {
    url: config.url,
    method: config.method,
    params: config.params,
    data: config.data
  });
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('🟢 API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('🔴 API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);
```

### **2. Check Browser Network Tab**

1. Open DevTools (F12)
2. Go to Network tab
3. Make API request
4. Check request/response details

### **3. Test Backend Directly**

Use curl or Postman to test backend endpoints directly:

```bash
# Test with curl
curl -X GET "http://localhost:5000/api/recipes/suggestions?ingredients=chicken"

# Test with HTTPie
http GET "http://localhost:5000/api/recipes/suggestions?ingredients=chicken"
```

---

## 📊 Environment Variables

### **Frontend (.env)**

Create `/frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### **Backend (.env)**

Check `/backend/.env` has:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/kwil-ai

# JWT
JWT_SECRET=your_secret_key_here

# APIs
SPOONACULAR_API_KEY=your_key_here
EDAMAM_APP_ID=your_app_id_here
EDAMAM_APP_KEY=your_app_key_here
GEMINI_API_KEY=your_key_here
GOOGLE_VISION_API_KEY=your_vision_key_here

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🎯 Quick Fix Commands

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Clear build cache
rm -rf .vite dist

# 3. Restart with clean slate
npm run dev

# 4. Check what's installed
npm list axios

# 5. Force reinstall axios
npm uninstall axios
npm install axios
```

---

## ✅ Verification Checklist

Run through this checklist to ensure everything is working:

### **Frontend:**
- [ ] `npm list axios` shows axios is installed
- [ ] No TypeScript errors in IDE
- [ ] `npm run dev` starts without errors
- [ ] Can import `recipeService` successfully
- [ ] No console errors about missing modules

### **Backend:**
- [ ] `npm start` or `npm run dev` works
- [ ] MongoDB is connected
- [ ] API keys are in `.env`
- [ ] Health endpoint returns 200
- [ ] Recipe endpoint returns data

### **Integration:**
- [ ] Frontend can call backend APIs
- [ ] No CORS errors
- [ ] Authentication works
- [ ] Recipe suggestions return data
- [ ] Saved recipes functionality works

---

## 🆘 Still Having Issues?

### **Check These Files:**

1. **Frontend package.json** - axios should be in dependencies
2. **Backend .env** - all API keys present
3. **API config** - correct BASE_URL
4. **Axios utility** - no import errors
5. **Recipe service** - imports axios correctly

### **Verify Services:**

```bash
# Frontend dev server
lsof -i :5173

# Backend API server
lsof -i :5000

# MongoDB
lsof -i :27017
```

### **Review Logs:**

```bash
# Frontend console (browser DevTools)
# Check for any error messages

# Backend console
# Look for API errors or connection issues

# MongoDB logs
# Ensure database is accepting connections
```

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Frontend starts without errors  
✅ Backend starts and shows "Kwil AI Backend Server Started"  
✅ Recipe API calls return data  
✅ No TypeScript errors  
✅ No CORS errors  
✅ Network tab shows successful API calls  
✅ Recipe suggestions display in UI  

---

## 📞 Additional Resources

- **Spoonacular Docs:** https://spoonacular.com/food-api/docs
- **Edamam Docs:** https://developer.edamam.com/edamam-docs-recipe-api
- **Gemini AI Docs:** https://ai.google.dev/docs
- **Axios Docs:** https://axios-http.com/docs/intro

**Status:** ✅ **FIXED - axios package installed successfully**

**Next Steps:**
1. Restart dev server
2. Add API keys to backend `.env`
3. Test recipe endpoints
4. Start building recipe UI components

---

**Happy Coding! 🚀**
