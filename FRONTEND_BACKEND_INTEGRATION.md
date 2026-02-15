# Frontend ↔ Backend Integration Guide

## 🔌 Connecting Kwil AI Frontend to Backend

This guide shows how to integrate the React frontend with the Node.js backend.

---

## 🎯 Overview

**Architecture:**
```
React Frontend (Port 5173)
         ↓
    API Calls (HTTP)
         ↓
Express Backend (Port 5000)
         ↓
   MongoDB Database
```

---

## 📦 Step 1: Install Axios in Frontend

```bash
cd /  # Root of your project (where frontend is)
npm install axios
```

---

## 🔧 Step 2: Create API Configuration

Create `/src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  API_PATH: '/api',
  TIMEOUT: 10000, // 10 seconds
};

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  GET_ME: '/auth/me',
  CHECK_AUTH: '/auth/check',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User
  GET_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  UPDATE_PREFERENCES: '/users/preferences',
  UPDATE_NOTIFICATIONS: '/users/notifications',
  CHANGE_PASSWORD: '/users/password',
  GET_STATS: '/users/stats',
  
  // Recipes
  SAVED_RECIPES: '/users/recipes/saved',
  SAVE_RECIPE: (id: string) => `/users/recipes/${id}/save`,
  UNSAVE_RECIPE: (id: string) => `/users/recipes/${id}/unsave`,
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PATH}${endpoint}`;
};
```

---

## 🛠️ Step 3: Create Axios Instance

Create `/src/utils/axios.ts`:

```typescript
import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_PATH}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kwil_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('kwil_auth_token');
      localStorage.removeItem('kwil_user');
      localStorage.removeItem('kwil_onboarding_complete');
      window.location.href = '/auth';
    }
    
    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 📡 Step 4: Create API Services

### **Auth Service**
Create `/src/services/authService.ts`:

```typescript
import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  dietType?: string[];
  cuisinePreference?: string[];
  healthGoal?: string[];
  budget?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    dietType: string[];
    cuisinePreference: string[];
    healthGoal: string[];
    budget: number;
    subscriptionPlan: string;
    createdAt: string;
  };
}

const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(API_ENDPOINTS.REGISTER, data);
    
    if (response.data.token) {
      localStorage.setItem('kwil_auth_token', response.data.token);
      localStorage.setItem('kwil_user', JSON.stringify(response.data.user));
      localStorage.setItem('kwil_onboarding_complete', 'true');
    }
    
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(API_ENDPOINTS.LOGIN, data);
    
    if (response.data.token) {
      localStorage.setItem('kwil_auth_token', response.data.token);
      localStorage.setItem('kwil_user', JSON.stringify(response.data.user));
      localStorage.setItem('kwil_onboarding_complete', 'true');
    }
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await axios.post(API_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem('kwil_auth_token');
      localStorage.removeItem('kwil_user');
      localStorage.removeItem('kwil_onboarding_complete');
    }
  },

  /**
   * Get current user
   */
  getMe: async () => {
    const response = await axios.get(API_ENDPOINTS.GET_ME);
    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  checkAuth: async () => {
    const response = await axios.get(API_ENDPOINTS.CHECK_AUTH);
    return response.data;
  },

  /**
   * Refresh auth token
   */
  refreshToken: async () => {
    const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN);
    if (response.data.token) {
      localStorage.setItem('kwil_auth_token', response.data.token);
    }
    return response.data;
  },
};

export default authService;
```

### **User Service**
Create `/src/services/userService.ts`:

```typescript
import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  profileImage?: string;
  measurementUnit?: 'metric' | 'imperial';
  language?: string;
}

export interface UpdatePreferencesData {
  dietType?: string[];
  cuisinePreference?: string[];
  healthGoal?: string[];
  budget?: number;
}

const userService = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    const response = await axios.get(API_ENDPOINTS.GET_PROFILE);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData) => {
    const response = await axios.put(API_ENDPOINTS.UPDATE_PROFILE, data);
    
    // Update local storage
    if (response.data.user) {
      localStorage.setItem('kwil_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (data: UpdatePreferencesData) => {
    const response = await axios.put(API_ENDPOINTS.UPDATE_PREFERENCES, data);
    
    // Update local storage
    if (response.data.user) {
      localStorage.setItem('kwil_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Update notification settings
   */
  updateNotifications: async (data: {
    email?: boolean;
    push?: boolean;
    mealReminders?: boolean;
  }) => {
    const response = await axios.put(API_ENDPOINTS.UPDATE_NOTIFICATIONS, data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await axios.put(API_ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  },

  /**
   * Get user statistics
   */
  getStats: async () => {
    const response = await axios.get(API_ENDPOINTS.GET_STATS);
    return response.data;
  },

  /**
   * Get saved recipes
   */
  getSavedRecipes: async () => {
    const response = await axios.get(API_ENDPOINTS.SAVED_RECIPES);
    return response.data;
  },

  /**
   * Save a recipe
   */
  saveRecipe: async (recipeId: string) => {
    const response = await axios.post(API_ENDPOINTS.SAVE_RECIPE(recipeId));
    return response.data;
  },

  /**
   * Unsave a recipe
   */
  unsaveRecipe: async (recipeId: string) => {
    const response = await axios.delete(API_ENDPOINTS.UNSAVE_RECIPE(recipeId));
    return response.data;
  },
};

export default userService;
```

---

## 🔄 Step 5: Update Frontend Components

### **Update KwilAuth Component**

Update `/src/app/components/kwil/KwilAuth.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import authService from '../../../services/authService';
// ... other imports

export default function KwilAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      console.log('Login successful:', response);
      
      // Navigate to preferences if first time, otherwise to home
      const hasCompletedPreferences = response.user.dietType?.length > 0;
      navigate(hasCompletedPreferences ? '/app/home' : '/preferences');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of component with updated handleLogin
}
```

### **Update KwilPreferences Component**

Update `/src/app/components/kwil/KwilPreferences.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import userService from '../../../services/userService';
// ... other imports

export default function KwilPreferences() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // ... existing state

  const handleContinue = async () => {
    if (progress < 100) return;

    setIsLoading(true);

    try {
      await userService.updatePreferences({
        dietType: selectedDiets,
        cuisinePreference: selectedCuisines,
        healthGoal: selectedGoals,
        budget: budgetValue,
      });

      console.log('Preferences saved successfully');
      navigate('/app/home');
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      alert(error.response?.data?.message || 'Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of component
}
```

---

## 🔐 Step 6: Create Auth Context (Optional but Recommended)

Create `/src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

interface User {
  _id: string;
  name: string;
  email: string;
  dietType: string[];
  cuisinePreference: string[];
  healthGoal: string[];
  budget: number;
  subscriptionPlan: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('kwil_auth_token');
    const storedUser = localStorage.getItem('kwil_user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await authService.getMe();
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

Wrap your app with AuthProvider in `/src/App.tsx`:

```typescript
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
```

---

## 🌐 Step 7: Environment Variables

Create `.env` in frontend root:

```env
VITE_API_URL=http://localhost:5000
```

For production:
```env
VITE_API_URL=https://your-backend-api.com
```

---

## 🧪 Step 8: Test the Integration

### **1. Start Both Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### **2. Test Registration Flow**

1. Open `http://localhost:5173`
2. Navigate through onboarding
3. Fill in registration form
4. Click "Login" / "Register"
5. Check browser console for success message
6. Check localStorage for `kwil_auth_token`

### **3. Test Login Flow**

1. Use registered credentials
2. Login should succeed
3. Token should be stored
4. Should navigate to home/preferences

### **4. Test Protected Routes**

1. After login, navigate to profile
2. Should see user data from backend
3. Update preferences
4. Changes should persist in database

---

## 🐛 Troubleshooting

### **CORS Error**
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
Ensure backend `.env` has:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### **401 Unauthorized**
```
Error: Request failed with status code 401
```

**Solution:**
- Check if token is being sent in headers
- Verify token is stored in localStorage
- Check token hasn't expired
- Ensure `Authorization: Bearer <token>` format

### **Network Error**
```
Error: Network Error
```

**Solution:**
- Ensure backend is running (`npm run dev` in backend folder)
- Check backend is on port 5000
- Verify `VITE_API_URL` is correct

---

## ✅ Integration Checklist

- [ ] Axios installed in frontend
- [ ] API config created
- [ ] Axios instance created with interceptors
- [ ] Auth service created
- [ ] User service created
- [ ] Frontend components updated to use services
- [ ] Environment variable set (`VITE_API_URL`)
- [ ] Backend CORS configured
- [ ] Both servers running
- [ ] Registration tested and working
- [ ] Login tested and working
- [ ] Protected routes tested
- [ ] Token stored in localStorage
- [ ] User data persisted

---

## 🎯 Final Testing Workflow

```
1. Register new user
   → Frontend sends POST to /api/auth/register
   → Backend creates user in MongoDB
   → Backend returns JWT token
   → Frontend stores token in localStorage
   → User redirected to preferences

2. Update preferences
   → Frontend sends PUT to /api/users/preferences
   → Backend validates JWT token
   → Backend updates user in MongoDB
   → Frontend receives updated user data
   → User redirected to home

3. View profile
   → Frontend sends GET to /api/users/profile
   → Backend validates JWT token
   → Backend returns user data from MongoDB
   → Frontend displays user information

4. Logout
   → Frontend sends POST to /api/auth/logout
   → Backend invalidates token
   → Frontend clears localStorage
   → User redirected to login
```

---

## 🚀 Next Steps

1. ✅ **Authentication is now connected!**
2. Add error handling UI (toast notifications)
3. Implement loading states
4. Add form validation on frontend
5. Connect more features (recipes, scanning, etc.)

---

**🎉 Frontend and Backend are now fully integrated!**

Test the complete authentication flow and you're ready to build more features.
