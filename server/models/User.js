import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.socialAuth.provider;
    },
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  age: Number,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  socialAuth: {
    provider: {
      type: String,
      enum: ['facebook', 'google', 'local'],
      default: 'local'
    },
    providerId: String,
    accessToken: String
  },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  businessProfile: {
    businessName: String,
    businessNameAr: String,
    businessType: String,
    description: String,
    descriptionAr: String,
    website: String,
    location: String,
    locationAr: String,
    phone: String,
    workingHours: {
      type: Map,
      of: {
        open: String,
        close: String,
        isOpen: Boolean
      }
    },
    specialties: [String],
    specialtiesAr: [String],
    targetAudience: String,
    targetAudienceAr: String,
    businessGoals: [String],
    businessGoalsAr: [String]
  },
  connectedPages: [{
    id: String,
    name: String,
    category: String,
    followers: Number,
    isActive: Boolean,
    accessToken: String,
    platform: {
      type: String,
      enum: ['facebook', 'instagram', 'tiktok'],
      default: 'facebook'
    }
  }],
  language: {
    type: String,
    enum: ['ar', 'en'],
    default: 'ar'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockUntil: Date,
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false
    },
    secret: String,
    backupCodes: [String]
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'socialAuth.providerId': 1 });
userSchema.index({ subscription: 1 });
userSchema.index({ isActive: 1 });

// Virtual for account lock status
userSchema.virtual('isAccountLocked').get(function() {
  return !!(this.isLocked && this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      isLocked: true,
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1, isLocked: 1 }
  });
};

// Method to generate business profile completion score
userSchema.methods.getProfileCompletionScore = function() {
  if (!this.businessProfile) return 0;
  
  const fields = [
    'businessName', 'businessType', 'description', 'phone', 
    'location', 'targetAudience', 'businessGoals'
  ];
  
  const completedFields = fields.filter(field => 
    this.businessProfile[field] && this.businessProfile[field].length > 0
  );
  
  return Math.round((completedFields.length / fields.length) * 100);
};

export default mongoose.model('User', userSchema);