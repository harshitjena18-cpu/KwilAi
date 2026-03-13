import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  dietType: {
    type: [String],
    enum: [
      'weight-loss',
      'muscle-gain',
      'vegan',
      'vegetarian',
      'keto',
      'paleo',
      'jain',
      'student-diet',
      'balanced',
      'none'
    ],
    default: []
  },
  cuisinePreference: {
    type: [String],
    enum: [
      'indian',
      'chinese',
      'italian',
      'mexican',
      'south-indian',
      'north-indian',
      'thai',
      'japanese',
      'american',
      'mediterranean',
      'continental',
      'fusion'
    ],
    default: []
  },
  healthGoal: {
    type: [String],
    enum: [
      'high-protein',
      'low-carb',
      'low-fat',
      'high-fiber',
      'low-sodium',
      'diabetic-friendly',
      'heart-healthy',
      'weight-management',
      'muscle-building',
      'energy-boost'
    ],
    default: []
  },
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative'],
    max: [10000, 'Budget seems too high'],
    default: 200
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionExpiresAt: {
    type: Date,
    default: null
  },
  profileImage: {
    type: String,
    default: null
  },
  savedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  cookingHistory: [{
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    cookedAt: {
      type: Date,
      default: Date.now
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  measurementUnit: {
    type: String,
    enum: ['metric', 'imperial'],
    default: 'metric'
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'es', 'fr', 'de'],
    default: 'en'
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    mealReminders: {
      type: Boolean,
      default: false
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===========================
// INDEXES
// ===========================

userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// ===========================
// MIDDLEWARE
// ===========================

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ===========================
// METHODS
// ===========================

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get user's subscription status
userSchema.methods.isSubscriptionActive = function() {
  if (this.subscriptionPlan === 'free') return true;
  if (!this.subscriptionExpiresAt) return false;
  return this.subscriptionExpiresAt > new Date();
};

// Check if user can perform premium action
userSchema.methods.hasPremiumAccess = function() {
  return ['premium', 'enterprise'].includes(this.subscriptionPlan) && 
         this.isSubscriptionActive();
};

// ===========================
// VIRTUALS
// ===========================

// Virtual for user's full profile
userSchema.virtual('fullProfile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    dietType: this.dietType,
    cuisinePreference: this.cuisinePreference,
    healthGoal: this.healthGoal,
    budget: this.budget,
    subscriptionPlan: this.subscriptionPlan,
    isSubscriptionActive: this.isSubscriptionActive(),
    profileImage: this.profileImage,
    measurementUnit: this.measurementUnit,
    language: this.language,
    notifications: this.notifications,
    createdAt: this.createdAt
  };
});

// ===========================
// STATIC METHODS
// ===========================

// Find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Get active users count
userSchema.statics.getActiveUsersCount = function() {
  return this.countDocuments({ isActive: true });
};

// Transform lean user document to full profile (replacing virtual for performance)
userSchema.statics.toFullProfile = function(user) {
  if (!user) return null;

  // Replicate isSubscriptionActive logic for lean document
  const isSubscriptionActive = () => {
    if (user.subscriptionPlan === 'free') return true;
    if (!user.subscriptionExpiresAt) return false;
    return new Date(user.subscriptionExpiresAt) > new Date();
  };

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    dietType: user.dietType,
    cuisinePreference: user.cuisinePreference,
    healthGoal: user.healthGoal,
    budget: user.budget,
    subscriptionPlan: user.subscriptionPlan,
    isSubscriptionActive: isSubscriptionActive(),
    profileImage: user.profileImage,
    savedRecipes: user.savedRecipes, // Ensure populated fields are included
    measurementUnit: user.measurementUnit,
    language: user.language,
    notifications: user.notifications,
    createdAt: user.createdAt
  };
};

const User = mongoose.model('User', userSchema);

export default User;
