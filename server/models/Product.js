import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameAr: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionAr: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'IQD', 'AED', 'SAR']
  },
  images: [{
    url: String,
    alt: String,
    altAr: String,
    isPrimary: Boolean
  }],
  category: {
    type: String,
    required: true
  },
  categoryAr: {
    type: String,
    required: true
  },
  subcategory: String,
  subcategoryAr: String,
  tags: [String],
  tagsAr: [String],
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  inventory: {
    inStock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    trackInventory: {
      type: Boolean,
      default: false
    }
  },
  pricing: {
    originalPrice: Number,
    salePrice: Number,
    isOnSale: {
      type: Boolean,
      default: false
    },
    saleStartDate: Date,
    saleEndDate: Date
  },
  specifications: [{
    name: String,
    nameAr: String,
    value: String,
    valueAr: String
  }],
  variants: [{
    name: String,
    nameAr: String,
    options: [{
      value: String,
      valueAr: String,
      priceModifier: {
        type: Number,
        default: 0
      },
      sku: String,
      inventory: {
        quantity: Number,
        inStock: Boolean
      }
    }]
  }],
  seo: {
    metaTitle: String,
    metaTitleAr: String,
    metaDescription: String,
    metaDescriptionAr: String,
    keywords: [String],
    keywordsAr: [String]
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    recommendations: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  aiRecommendations: {
    similarProducts: [mongoose.Schema.Types.ObjectId],
    targetAudience: [String],
    bestSellingWith: [mongoose.Schema.Types.ObjectId],
    seasonality: String,
    recommendationScore: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  lastModified: Date
}, {
  timestamps: true
});

// Indexes
productSchema.index({ userId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ 'pricing.isOnSale': 1 });
productSchema.index({ 'inventory.inStock': 1 });
productSchema.index({ name: 'text', nameAr: 'text', description: 'text', descriptionAr: 'text' });

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function() {
  if (this.pricing.isOnSale && this.pricing.salePrice) {
    const now = new Date();
    const saleStart = this.pricing.saleStartDate;
    const saleEnd = this.pricing.saleEndDate;
    
    if ((!saleStart || now >= saleStart) && (!saleEnd || now <= saleEnd)) {
      return this.pricing.salePrice;
    }
  }
  
  return this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.pricing.isOnSale && this.pricing.salePrice && this.pricing.originalPrice) {
    return Math.round(((this.pricing.originalPrice - this.pricing.salePrice) / this.pricing.originalPrice) * 100);
  }
  return 0;
});

// Method to update analytics
productSchema.methods.updateAnalytics = function(type, value = 1) {
  const validTypes = ['views', 'recommendations', 'purchases'];
  
  if (validTypes.includes(type)) {
    this.analytics[type] += value;
    
    if (type === 'purchases') {
      this.analytics.revenue += this.effectivePrice * value;
    }
    
    // Update conversion rate
    if (this.analytics.views > 0) {
      this.analytics.conversionRate = (this.analytics.purchases / this.analytics.views * 100);
    }
    
    return this.save();
  }
  
  throw new Error('Invalid analytics type');
};

// Method to check if product is low in stock
productSchema.methods.isLowStock = function() {
  if (!this.inventory.trackInventory) return false;
  return this.inventory.quantity <= this.inventory.lowStockThreshold;
};

// Method to update inventory
productSchema.methods.updateInventory = function(quantity, operation = 'subtract') {
  if (!this.inventory.trackInventory) return this;
  
  if (operation === 'subtract') {
    this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
  } else if (operation === 'add') {
    this.inventory.quantity += quantity;
  }
  
  this.inventory.inStock = this.inventory.quantity > 0;
  
  return this.save();
};

// Pre-save middleware
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('description')) {
    this.lastModified = new Date();
  }
  
  if (this.isNew && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

export default mongoose.model('Product', productSchema);