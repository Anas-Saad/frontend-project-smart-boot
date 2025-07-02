import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    socialProfile: {
      platform: {
        type: String,
        enum: ['facebook', 'instagram', 'whatsapp', 'website']
      },
      profileId: String,
      profileUrl: String
    }
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    nameAr: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    variant: {
      name: String,
      value: String,
      priceModifier: Number
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'bank_transfer', 'credit_card', 'paypal', 'stripe']
  },
  shipping: {
    method: String,
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  source: {
    platform: {
      type: String,
      enum: ['facebook', 'instagram', 'whatsapp', 'website', 'bot'],
      required: true
    },
    botId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bot'
    },
    conversationId: String,
    referrer: String
  },
  notes: {
    customer: String,
    internal: String,
    admin: String
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  analytics: {
    conversionTime: Number, // Time from first interaction to order
    touchpoints: [String], // Platforms/channels customer interacted with
    botInteractions: Number,
    humanInteractions: Number
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ 'source.platform': 1 });
orderSchema.index({ 'source.botId': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  
  // Calculate totals
  if (this.isModified('items') || this.isNew) {
    this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    this.pricing.total = this.pricing.subtotal + this.pricing.tax + this.pricing.shipping - this.pricing.discount;
  }
  
  next();
});

// Method to add timeline entry
orderSchema.methods.addTimelineEntry = function(status, note, updatedBy) {
  this.timeline.push({
    status,
    note,
    updatedBy,
    timestamp: new Date()
  });
  
  this.status = status;
  return this.save();
};

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: ['refunded'],
    cancelled: [],
    refunded: []
  };
  
  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${this.status} to ${newStatus}`);
  }
  
  return this.addTimelineEntry(newStatus, note, updatedBy);
};

// Method to calculate order metrics
orderSchema.methods.getMetrics = function() {
  const orderAge = Date.now() - this.createdAt.getTime();
  const daysSinceOrder = Math.floor(orderAge / (1000 * 60 * 60 * 24));
  
  return {
    orderAge: daysSinceOrder,
    itemCount: this.items.length,
    totalQuantity: this.items.reduce((sum, item) => sum + item.quantity, 0),
    averageItemPrice: this.pricing.subtotal / this.items.reduce((sum, item) => sum + item.quantity, 0),
    isHighValue: this.pricing.total > 100, // Configurable threshold
    timelineLength: this.timeline.length
  };
};

export default mongoose.model('Order', orderSchema);