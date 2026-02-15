import mongoose from 'mongoose';

const pantrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  ingredientName: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true,
    lowercase: true
  },
  quantity: {
    value: {
      type: Number,
      min: 0,
      default: null
    },
    unit: {
      type: String,
      enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'bunch', 'lb', 'oz', null],
      default: null
    }
  },
  detectedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  expiryDate: {
    type: Date,
    default: null
  },
  category: {
    type: String,
    enum: [
      'vegetable',
      'fruit',
      'meat',
      'dairy',
      'grain',
      'spice',
      'condiment',
      'beverage',
      'snack',
      'other'
    ],
    default: 'other'
  },
  imageUrl: {
    type: String,
    default: null
  },
  detectionConfidence: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  isConsumed: {
    type: Boolean,
    default: false
  },
  consumedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===========================
// INDEXES
// ===========================

pantrySchema.index({ userId: 1, createdAt: -1 });
pantrySchema.index({ userId: 1, isConsumed: 1 });
pantrySchema.index({ userId: 1, ingredientName: 1 });
pantrySchema.index({ expiryDate: 1 });

// ===========================
// VIRTUALS
// ===========================

// Check if ingredient is expired
pantrySchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return this.expiryDate < new Date();
});

// Days until expiry
pantrySchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null;
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// ===========================
// METHODS
// ===========================

// Mark ingredient as consumed
pantrySchema.methods.markAsConsumed = function() {
  this.isConsumed = true;
  this.consumedAt = new Date();
  return this.save();
};

// Update quantity
pantrySchema.methods.updateQuantity = function(value, unit) {
  this.quantity = { value, unit };
  return this.save();
};

// ===========================
// STATIC METHODS
// ===========================

// Get all active (not consumed) ingredients for a user
pantrySchema.statics.getActiveIngredients = function(userId) {
  return this.find({ 
    userId, 
    isConsumed: false 
  }).sort({ createdAt: -1 });
};

// Get ingredients expiring soon (within days)
pantrySchema.statics.getExpiringSoon = function(userId, days = 3) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    userId,
    isConsumed: false,
    expiryDate: {
      $ne: null,
      $lte: futureDate,
      $gte: new Date()
    }
  }).sort({ expiryDate: 1 });
};

// Get expired ingredients
pantrySchema.statics.getExpired = function(userId) {
  return this.find({
    userId,
    isConsumed: false,
    expiryDate: {
      $ne: null,
      $lt: new Date()
    }
  }).sort({ expiryDate: 1 });
};

// Get ingredients by category
pantrySchema.statics.getByCategory = function(userId, category) {
  return this.find({
    userId,
    isConsumed: false,
    category
  }).sort({ createdAt: -1 });
};

// Search ingredients by name
pantrySchema.statics.searchByName = function(userId, searchTerm) {
  return this.find({
    userId,
    isConsumed: false,
    ingredientName: { $regex: searchTerm, $options: 'i' }
  }).sort({ createdAt: -1 });
};

// Get pantry statistics
pantrySchema.statics.getStats = async function(userId) {
  const [totalActive, totalConsumed, expiringSoon, expired] = await Promise.all([
    this.countDocuments({ userId, isConsumed: false }),
    this.countDocuments({ userId, isConsumed: true }),
    this.getExpiringSoon(userId, 3),
    this.getExpired(userId)
  ]);

  return {
    totalActive,
    totalConsumed,
    expiringSoonCount: expiringSoon.length,
    expiredCount: expired.length,
    totalScans: totalActive + totalConsumed
  };
};

const Pantry = mongoose.model('Pantry', pantrySchema);

export default Pantry;
