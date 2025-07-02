import mongoose from 'mongoose';

const mlDatasetSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['iraqi_dialect', 'business_terms', 'medical_terms', 'general_arabic', 'custom'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionAr: {
    type: String,
    required: true
  },
  data: [{
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    },
    context: String,
    confidence: {
      type: Number,
      default: 1.0,
      min: 0,
      max: 1
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  version: {
    type: String,
    default: '1.0.0'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  metrics: {
    recordCount: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0
    },
    lastTrained: Date,
    trainingDuration: Number,
    modelSize: Number
  },
  usage: {
    downloads: {
      type: Number,
      default: 0
    },
    implementations: {
      type: Number,
      default: 0
    },
    feedback: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  tags: [String],
  tagsAr: [String]
}, {
  timestamps: true
});

// Indexes
mlDatasetSchema.index({ type: 1 });
mlDatasetSchema.index({ isActive: 1 });
mlDatasetSchema.index({ isPublic: 1 });
mlDatasetSchema.index({ approvalStatus: 1 });
mlDatasetSchema.index({ createdBy: 1 });
mlDatasetSchema.index({ tags: 1 });
mlDatasetSchema.index({ name: 'text', nameAr: 'text', description: 'text', descriptionAr: 'text' });

// Pre-save middleware to update record count
mlDatasetSchema.pre('save', function(next) {
  if (this.isModified('data')) {
    this.metrics.recordCount = this.data.length;
  }
  next();
});

// Method to add training data
mlDatasetSchema.methods.addTrainingData = function(input, output, context, confidence = 1.0) {
  this.data.push({
    input,
    output,
    context,
    confidence,
    metadata: {
      addedAt: new Date(),
      source: 'manual'
    }
  });
  
  this.metrics.recordCount = this.data.length;
  return this.save();
};

// Method to update metrics after training
mlDatasetSchema.methods.updateTrainingMetrics = function(accuracy, duration, modelSize) {
  this.metrics.accuracy = accuracy;
  this.metrics.lastTrained = new Date();
  this.metrics.trainingDuration = duration;
  this.metrics.modelSize = modelSize;
  
  return this.save();
};

// Method to add feedback
mlDatasetSchema.methods.addFeedback = function(userId, rating, comment) {
  this.usage.feedback.push({
    userId,
    rating,
    comment,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to get average rating
mlDatasetSchema.methods.getAverageRating = function() {
  if (this.usage.feedback.length === 0) return 0;
  
  const totalRating = this.usage.feedback.reduce((sum, feedback) => sum + feedback.rating, 0);
  return (totalRating / this.usage.feedback.length).toFixed(1);
};

export default mongoose.model('MLDataset', mlDatasetSchema);