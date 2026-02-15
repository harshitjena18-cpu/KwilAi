# 📸 Ingredient Detection System - Complete Guide

## Overview

The Kwil AI Ingredient Detection System uses **Google Cloud Vision API** to automatically identify food items from photos and store them in your pantry for recipe recommendations.

---

## 🏗️ Architecture

```
Mobile Camera
      ↓
 Capture Image (Base64)
      ↓
  Frontend Upload
      ↓
Express Backend API
      ↓
Google Vision API
      ↓
  Food Detection
      ↓
MongoDB Pantry Storage
      ↓
Recipe Recommendations
```

---

## 📦 Components Created

### Backend:
1. ✅ **Pantry Model** (`/src/models/Pantry.js`) - MongoDB schema
2. ✅ **Vision Service** (`/src/services/visionService.js`) - Google Vision API integration
3. ✅ **Pantry Controller** (`/src/controllers/pantryController.js`) - Business logic
4. ✅ **Pantry Routes** (`/src/routes/pantryRoutes.js`) - API endpoints

### Frontend:
5. ✅ **Pantry Service** (`/src/services/pantryService.ts`) - API client
6. ✅ **Camera Utilities** (`/src/utils/camera.ts`) - Camera access & capture
7. ✅ **API Config** (`/src/config/api.ts`) - Endpoint configuration
8. ✅ **Axios Instance** (`/src/utils/axios.ts`) - HTTP client with auth

---

## 🔑 Setup Instructions

### Step 1: Get Google Vision API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Cloud Vision API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **API Key**
6. Copy the API key

### Step 2: Configure Backend

Add to `/backend/.env`:

```env
# Google Vision API
GOOGLE_VISION_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Start Backend

```bash
cd backend
npm install
npm run dev
```

Server will start on `http://localhost:5000`

---

## 📡 API Endpoints

### **1. Scan Ingredient (Detection Only)**
```http
POST /api/pantry/scan
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Detected 4 ingredient(s)",
  "detectedItems": [
    {
      "name": "Tomato",
      "confidence": 95
    },
    {
      "name": "Spinach",
      "confidence": 89
    },
    {
      "name": "Carrot",
      "confidence": 92
    }
  ]
}
```

---

### **2. Scan and Add to Pantry**
```http
POST /api/pantry/scan-and-add
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Detected and added 3 ingredient(s) to pantry",
  "detectedItems": [
    { "name": "Tomato", "confidence": 95 },
    { "name": "Spinach", "confidence": 89 },
    { "name": "Carrot", "confidence": 92 }
  ],
  "addedIngredients": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "ingredientName": "tomato",
      "quantity": { "value": null, "unit": null },
      "detectedAt": "2024-02-15T10:30:00.000Z",
      "expiryDate": "2024-02-20T10:30:00.000Z",
      "category": "vegetable",
      "detectionConfidence": 95,
      "isConsumed": false,
      "createdAt": "2024-02-15T10:30:00.000Z",
      "updatedAt": "2024-02-15T10:30:00.000Z"
    }
  ]
}
```

---

### **3. Add Single Ingredient**
```http
POST /api/pantry
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "ingredientName": "Tomato",
  "quantity": { "value": 500, "unit": "g" },
  "expiryDate": "2024-02-20T00:00:00.000Z",
  "category": "vegetable",
  "notes": "Fresh from market"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Ingredient added to pantry",
  "ingredient": { /* Full pantry item */ }
}
```

---

### **4. Get All Pantry Ingredients**
```http
GET /api/pantry?includeConsumed=false
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 12,
  "ingredients": [
    {
      "_id": "...",
      "ingredientName": "tomato",
      "quantity": { "value": 500, "unit": "g" },
      "category": "vegetable",
      "expiryDate": "2024-02-20T00:00:00.000Z",
      "isExpired": false,
      "daysUntilExpiry": 5,
      "detectionConfidence": 95
    }
  ]
}
```

---

### **5. Get Ingredients Expiring Soon**
```http
GET /api/pantry/expiring-soon?days=3
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "ingredients": [
    {
      "ingredientName": "milk",
      "expiryDate": "2024-02-17T00:00:00.000Z",
      "daysUntilExpiry": 2
    }
  ]
}
```

---

### **6. Search Ingredients**
```http
GET /api/pantry/search?q=tomato
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "searchTerm": "tomato",
  "ingredients": [ /* matching items */ ]
}
```

---

### **7. Get Pantry Statistics**
```http
GET /api/pantry/stats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalActive": 12,
    "totalConsumed": 45,
    "expiringSoonCount": 2,
    "expiredCount": 1,
    "totalScans": 57
  }
}
```

---

### **8. Mark as Consumed**
```http
PATCH /api/pantry/:id/consume
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Ingredient marked as consumed",
  "ingredient": {
    "isConsumed": true,
    "consumedAt": "2024-02-15T10:30:00.000Z"
  }
}
```

---

### **9. Update Ingredient**
```http
PUT /api/pantry/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": { "value": 250, "unit": "g" },
  "notes": "Half consumed"
}
```

---

### **10. Delete Ingredient**
```http
DELETE /api/pantry/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Ingredient deleted from pantry"
}
```

---

## 🗄️ Pantry Model Schema

```javascript
{
  userId: ObjectId,           // Reference to User
  ingredientName: String,     // Lowercase ingredient name
  
  quantity: {
    value: Number,            // Amount (e.g., 500)
    unit: String              // Unit (g, kg, ml, l, cup, etc.)
  },
  
  detectedAt: Date,           // When scanned
  expiryDate: Date,           // Estimated/manual expiry
  category: String,           // vegetable, fruit, meat, dairy, etc.
  imageUrl: String,           // Scanned image URL (optional)
  detectionConfidence: Number, // 0-100 from Vision API
  
  isConsumed: Boolean,        // false by default
  consumedAt: Date,           // null until consumed
  notes: String,              // User notes
  
  createdAt: Date,
  updatedAt: Date,
  
  // Virtuals (computed)
  isExpired: Boolean,         // true if past expiry date
  daysUntilExpiry: Number     // days remaining
}
```

---

## 🔧 Vision Service Features

### Food Detection
- Detects labels and objects in images
- Filters for food-related items
- Returns confidence scores (0-100%)
- Supports 100+ food items

### Auto-Categorization
- Vegetables: tomato, potato, onion, carrot, etc.
- Fruits: apple, banana, orange, mango, etc.
- Proteins: chicken, beef, pork, fish, eggs, etc.
- Dairy: milk, cheese, yogurt, butter, etc.
- Grains: rice, wheat, pasta, bread, etc.
- Spices: basil, oregano, turmeric, etc.

### Auto-Expiry Estimation
- Vegetables: 5 days
- Fruits: 7 days
- Meat: 3 days
- Dairy: 7 days
- Grains: 30 days
- Spices: 365 days
- Condiments: 90 days

---

## 🎨 Frontend Usage

### Example: Camera Scan

```typescript
import CameraService, { compressImage } from '../utils/camera';
import pantryService from '../services/pantryService';

const cameraService = new CameraService();

// Start camera
const videoElement = document.getElementById('camera') as HTMLVideoElement;
await cameraService.startCamera(videoElement, { facingMode: 'environment' });

// Capture photo
const base64Image = cameraService.capturePhoto(videoElement);

// Compress image
const compressed = await compressImage(base64Image, 1024, 1024, 0.8);

// Scan and add to pantry
const result = await pantryService.scanAndAdd(compressed);

console.log('Detected:', result.detectedItems);
console.log('Added:', result.addedIngredients);

// Stop camera
cameraService.stopCamera();
```

### Example: Gallery Upload

```typescript
import { fileToBase64, compressImage } from '../utils/camera';
import pantryService from '../services/pantryService';

// Handle file input
const handleFileUpload = async (file: File) => {
  // Convert to base64
  const base64 = await fileToBase64(file);
  
  // Compress
  const compressed = await compressImage(base64);
  
  // Scan
  const result = await pantryService.scanAndAdd(compressed);
  
  console.log('Detected items:', result.detectedItems);
};
```

---

## 🧪 Testing

### Test with cURL

```bash
# 1. Register/Login to get token
TOKEN="your-jwt-token"

# 2. Test scan (with base64 image)
curl -X POST http://localhost:5000/api/pantry/scan \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
  }'

# 3. Get pantry items
curl -X GET http://localhost:5000/api/pantry \
  -H "Authorization: Bearer $TOKEN"

# 4. Get expiring soon
curl -X GET "http://localhost:5000/api/pantry/expiring-soon?days=3" \
  -H "Authorization: Bearer $TOKEN"

# 5. Get statistics
curl -X GET http://localhost:5000/api/pantry/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Test with Postman

1. Import the `/backend/postman_collection.json`
2. Add environment variable: `TOKEN` with your JWT
3. Create new request:
   - Method: POST
   - URL: `{{BASE_URL}}/api/pantry/scan`
   - Headers: `Authorization: Bearer {{TOKEN}}`
   - Body (raw JSON):
     ```json
     {
       "image": "data:image/jpeg;base64,..."
     }
     ```

---

## 🎯 Google Vision API Details

### Supported Features
- **Label Detection**: General objects/labels
- **Object Localization**: Specific objects with bounding boxes
- **Confidence Scores**: 0-100% accuracy

### Rate Limits (Free Tier)
- 1,000 requests/month free
- $1.50 per 1,000 images after

### Best Practices
1. **Compress images** before sending (max 1024x1024)
2. **Good lighting** for better detection
3. **Clear focus** on ingredients
4. **Close-up shots** work best
5. **Single ingredient** per scan for accuracy

---

## 🐛 Troubleshooting

### Error: "Vision API error: Invalid API key"
**Solution:** Check `GOOGLE_VISION_API_KEY` in `.env`

### Error: "No food items detected"
**Solutions:**
- Ensure good lighting
- Focus on food items
- Try different angle
- Make sure item is in frame

### Error: "Image too large"
**Solution:** Compress image before upload:
```typescript
const compressed = await compressImage(base64, 1024, 1024, 0.8);
```

### Error: "Camera access denied"
**Solution:** Grant camera permission in browser settings

---

## 🚀 Production Deployment

### Environment Variables
```env
GOOGLE_VISION_API_KEY=your-production-api-key
MONGODB_URI=mongodb+srv://production-db
```

### Security Considerations
1. **Rate limiting** - Already implemented (100 req/15min)
2. **Image size limits** - 10MB max (configured in server.js)
3. **Authentication required** - All pantry routes protected
4. **CORS** - Whitelist frontend domain
5. **API key security** - Never expose in frontend

---

## 📊 Feature Roadmap

### Implemented ✅
- [x] Image scanning with Google Vision API
- [x] Food item detection
- [x] Confidence scoring
- [x] Pantry storage
- [x] Auto-categorization
- [x] Auto-expiry estimation
- [x] Search & filtering
- [x] Expiry tracking
- [x] Statistics

### Upcoming 🔜
- [ ] Barcode scanning
- [ ] Nutrition data integration (Edamam API)
- [ ] Recipe suggestions based on pantry
- [ ] Shopping list generation
- [ ] Voice commands for adding items
- [ ] OCR for ingredient labels
- [ ] ML model for better food recognition

---

## 📖 Complete API Reference

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/pantry/scan` | POST | Detect ingredients in image | ✅ |
| `/api/pantry/scan-and-add` | POST | Scan & auto-add to pantry | ✅ |
| `/api/pantry` | POST | Add single ingredient | ✅ |
| `/api/pantry/batch` | POST | Add multiple ingredients | ✅ |
| `/api/pantry` | GET | Get all ingredients | ✅ |
| `/api/pantry/:id` | GET | Get single ingredient | ✅ |
| `/api/pantry/:id` | PUT | Update ingredient | ✅ |
| `/api/pantry/:id` | DELETE | Delete ingredient | ✅ |
| `/api/pantry/:id/consume` | PATCH | Mark as consumed | ✅ |
| `/api/pantry/expiring-soon` | GET | Get expiring items | ✅ |
| `/api/pantry/expired` | GET | Get expired items | ✅ |
| `/api/pantry/search` | GET | Search by name | ✅ |
| `/api/pantry/category/:cat` | GET | Get by category | ✅ |
| `/api/pantry/stats` | GET | Get statistics | ✅ |

---

**🎉 Ingredient Detection System is Complete!**

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** February 15, 2026

