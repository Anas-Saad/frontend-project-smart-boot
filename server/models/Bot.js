import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
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
  persona: {
    type: String,
    enum: ['doctor', 'engineer', 'shop_assistant', 'general', 'custom'],
    default: 'general'
  },
  customPersona: String,
  customPersonaAr: String,
  isActive: {
    type: Boolean,
    default: true
  },
  responseSettings: {
    autoReply: {
      type: Boolean,
      default: true
    },
    moderateComments: {
      type: Boolean,
      default: true
    },
    recommendProducts: {
      type: Boolean,
      default: true
    },
    responseDelay: {
      type: Number,
      default: 2,
      min: 0,
      max: 60
    },
    language: {
      type: String,
      enum: ['ar', 'en', 'both'],
      default: 'ar'
    },
    workingHours: {
      enabled: {
        type: Boolean,
        default: false
      },
      schedule: {
        type: Map,
        of: {
          start: String,
          end: String,
          enabled: Boolean
        }
      }
    }
  },
  analytics: {
    messagesHandled: {
      type: Number,
      default: 0
    },
    commentsModerated: {
      type: Number,
      default: 0
    },
    productsRecommended: {
      type: Number,
      default: 0
    },
    conversionsGenerated: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    },
    satisfactionScore: {
      type: Number,
      default: 0
    }
  },
  learningData: {
    businessContext: String,
    commonQuestions: [String],
    productKnowledge: [String],
    customerPreferences: [mongoose.Schema.Types.Mixed],
    conversationHistory: [{
      message: String,
      response: String,
      timestamp: Date,
      feedback: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      }
    }]
  },
  mlModel: {
    modelId: String,
    version: String,
    accuracy: {
      type: Number,
      default: 0.75
    },
    lastTrained: Date,
    trainingData: [mongoose.Schema.Types.Mixed]
  },
  integrations: {
    facebook: {
      enabled: Boolean,
      pageIds: [String],
      webhookVerified: Boolean
    },
    instagram: {
      enabled: Boolean,
      accountId: String,
      webhookVerified: Boolean
    },
    whatsapp: {
      enabled: Boolean,
      phoneNumber: String,
      businessAccountId: String
    }
  }
}, {
  timestamps: true
});

// Indexes
botSchema.index({ userId: 1 });
botSchema.index({ isActive: 1 });
botSchema.index({ persona: 1 });
botSchema.index({ 'responseSettings.language': 1 });

// Method to update analytics
botSchema.methods.updateAnalytics = function(type, value = 1) {
  const validTypes = ['messagesHandled', 'commentsModerated', 'productsRecommended', 'conversionsGenerated'];
  
  if (validTypes.includes(type)) {
    this.analytics[type] += value;
    return this.save();
  }
  
  throw new Error('Invalid analytics type');
};

// Method to add conversation to learning data
botSchema.methods.addConversation = function(message, response, feedback = 'neutral') {
  this.learningData.conversationHistory.push({
    message,
    response,
    timestamp: new Date(),
    feedback
  });
  
  // Keep only last 1000 conversations
  if (this.learningData.conversationHistory.length > 1000) {
    this.learningData.conversationHistory = this.learningData.conversationHistory.slice(-1000);
  }
  
  return this.save();
};

// Method to get bot performance metrics
botSchema.methods.getPerformanceMetrics = function() {
  const { analytics } = this;
  
  return {
    totalInteractions: analytics.messagesHandled + analytics.commentsModerated,
    conversionRate: analytics.messagesHandled > 0 
      ? (analytics.conversionsGenerated / analytics.messagesHandled * 100).toFixed(2)
      : 0,
    averageResponseTime: analytics.averageResponseTime,
    satisfactionScore: analytics.satisfactionScore,
    productRecommendationRate: analytics.messagesHandled > 0
      ? (analytics.productsRecommended / analytics.messagesHandled * 100).toFixed(2)
      : 0
  };
};

export default mongoose.model('Bot', botSchema);