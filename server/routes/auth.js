import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateTwoFactorSecret, verifyTwoFactorToken } from '../utils/twoFactor.js';
import { sendEmail } from '../utils/email.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        errorAr: 'فشل في التحقق من البيانات',
        details: errors.array()
      });
    }

    const { name, email, password, language = 'ar' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        errorAr: 'المستخدم موجود بالفعل'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      language,
      socialAuth: { provider: 'local' }
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      messageAr: 'تم تسجيل المستخدم بنجاح',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      errorAr: 'فشل في التسجيل'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        errorAr: 'فشل في التحقق من البيانات',
        details: errors.array()
      });
    }

    const { email, password, twoFactorCode } = req.body;

    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        errorAr: 'بيانات الدخول غير صحيحة'
      });
    }

    // Check if account is locked
    if (user.isAccountLocked) {
      return res.status(423).json({
        error: 'Account is temporarily locked',
        errorAr: 'الحساب مقفل مؤقتاً'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        error: 'Invalid credentials',
        errorAr: 'بيانات الدخول غير صحيحة'
      });
    }

    // Check 2FA if enabled
    if (user.twoFactorAuth.enabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          requiresTwoFactor: true,
          message: 'Two-factor authentication required',
          messageAr: 'مطلوب رمز التحقق الثنائي'
        });
      }

      const isValidToken = verifyTwoFactorToken(user.twoFactorAuth.secret, twoFactorCode);
      if (!isValidToken) {
        return res.status(401).json({
          error: 'Invalid two-factor code',
          errorAr: 'رمز التحقق الثنائي غير صحيح'
        });
      }
    }

    // Reset login attempts and update last login
    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.twoFactorAuth.secret;

    res.json({
      message: 'Login successful',
      messageAr: 'تم تسجيل الدخول بنجاح',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      errorAr: 'فشل في تسجيل الدخول'
    });
  }
});

// Social Auth (Facebook/Google)
router.post('/social', [
  body('provider').isIn(['facebook', 'google']).withMessage('Invalid provider'),
  body('accessToken').notEmpty().withMessage('Access token is required'),
  body('profile').isObject().withMessage('Profile data is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        errorAr: 'فشل في التحقق من البيانات',
        details: errors.array()
      });
    }

    const { provider, accessToken, profile } = req.body;

    // Check if user exists with this social account
    let user = await User.findOne({
      $or: [
        { 'socialAuth.providerId': profile.id },
        { email: profile.email }
      ]
    });

    if (user) {
      // Update existing user
      user.socialAuth.provider = provider;
      user.socialAuth.providerId = profile.id;
      user.socialAuth.accessToken = accessToken;
      user.lastLogin = new Date();
      
      if (!user.avatar && profile.picture) {
        user.avatar = profile.picture;
      }
    } else {
      // Create new user
      user = new User({
        name: profile.name,
        email: profile.email,
        avatar: profile.picture || '',
        socialAuth: {
          provider,
          providerId: profile.id,
          accessToken
        },
        emailVerified: true,
        lastLogin: new Date()
      });
    }

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.socialAuth.accessToken;

    res.json({
      message: 'Social authentication successful',
      messageAr: 'تم تسجيل الدخول بنجاح',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Social auth error:', error);
    res.status(500).json({
      error: 'Social authentication failed',
      errorAr: 'فشل في تسجيل الدخول'
    });
  }
});

// Enable 2FA
router.post('/enable-2fa', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        errorAr: 'المستخدم غير موجود'
      });
    }

    const secret = generateTwoFactorSecret(user.email);
    
    user.twoFactorAuth.secret = secret.base32;
    await user.save();

    res.json({
      message: '2FA setup initiated',
      messageAr: 'تم بدء إعداد التحقق الثنائي',
      qrCode: secret.qr_code_ascii,
      secret: secret.base32
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({
      error: '2FA setup failed',
      errorAr: 'فشل في إعداد التحقق الثنائي'
    });
  }
});

// Verify and activate 2FA
router.post('/verify-2fa', authMiddleware, [
  body('token').isLength({ min: 6, max: 6 }).withMessage('Invalid token format'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        errorAr: 'فشل في التحقق من البيانات',
        details: errors.array()
      });
    }

    const { token } = req.body;
    const user = await User.findById(req.userId);

    if (!user || !user.twoFactorAuth.secret) {
      return res.status(400).json({
        error: '2FA not set up',
        errorAr: 'التحقق الثنائي غير مُعد'
      });
    }

    const isValid = verifyTwoFactorToken(user.twoFactorAuth.secret, token);
    if (!isValid) {
      return res.status(400).json({
        error: 'Invalid token',
        errorAr: 'رمز غير صحيح'
      });
    }

    user.twoFactorAuth.enabled = true;
    await user.save();

    res.json({
      message: '2FA enabled successfully',
      messageAr: 'تم تفعيل التحقق الثنائي بنجاح'
    });

  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({
      error: '2FA verification failed',
      errorAr: 'فشل في التحقق من الرمز'
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -twoFactorAuth.secret');
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        errorAr: 'المستخدم غير موجود'
      });
    }

    res.json({
      user,
      profileCompletion: user.getProfileCompletionScore()
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user data',
      errorAr: 'فشل في جلب بيانات المستخدم'
    });
  }
});

// Logout (client-side token removal, but we can log it)
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Log logout event (optional)
    console.log(`User ${req.userId} logged out at ${new Date()}`);
    
    res.json({
      message: 'Logged out successfully',
      messageAr: 'تم تسجيل الخروج بنجاح'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      errorAr: 'فشل في تسجيل الخروج'
    });
  }
});

export default router;