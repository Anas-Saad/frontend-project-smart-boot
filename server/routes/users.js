import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
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
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      errorAr: 'فشل في جلب الملف الشخصي'
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('language').optional().isIn(['ar', 'en']),
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

    const allowedUpdates = ['name', 'avatar', 'language', 'businessProfile'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -twoFactorAuth.secret');

    res.json({
      message: 'Profile updated successfully',
      messageAr: 'تم تحديث الملف الشخصي بنجاح',
      user,
      profileCompletion: user.getProfileCompletionScore()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      errorAr: 'فشل في تحديث الملف الشخصي'
    });
  }
});

// Create/Update business profile
router.post('/business-profile', authMiddleware, [
  body('businessName').notEmpty().withMessage('Business name is required'),
  body('businessNameAr').notEmpty().withMessage('Arabic business name is required'),
  body('businessType').notEmpty().withMessage('Business type is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
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

    const user = await User.findByIdAndUpdate(
      req.userId,
      { businessProfile: req.body },
      { new: true, runValidators: true }
    ).select('-password -twoFactorAuth.secret');

    // Emit real-time update
    req.io.to(`user-${req.userId}`).emit('profile-updated', {
      type: 'business-profile',
      user,
      profileCompletion: user.getProfileCompletionScore()
    });

    res.json({
      message: 'Business profile created successfully',
      messageAr: 'تم إنشاء ملف العمل بنجاح',
      user,
      profileCompletion: user.getProfileCompletionScore()
    });

  } catch (error) {
    console.error('Business profile error:', error);
    res.status(500).json({
      error: 'Failed to create business profile',
      errorAr: 'فشل في إنشاء ملف العمل'
    });
  }
});

// Connect social media page
router.post('/connect-page', authMiddleware, [
  body('platform').isIn(['facebook', 'instagram', 'tiktok']),
  body('pageId').notEmpty(),
  body('accessToken').notEmpty(),
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

    const { platform, pageId, accessToken, pageName, category, followers } = req.body;

    const user = await User.findById(req.userId);
    
    // Check if page already connected
    const existingPage = user.connectedPages.find(page => page.id === pageId);
    if (existingPage) {
      return res.status(400).json({
        error: 'Page already connected',
        errorAr: 'الصفحة متصلة بالفعل'
      });
    }

    // Add new page
    user.connectedPages.push({
      id: pageId,
      name: pageName,
      category,
      followers: followers || 0,
      isActive: true,
      accessToken,
      platform
    });

    await user.save();

    res.json({
      message: 'Page connected successfully',
      messageAr: 'تم ربط الصفحة بنجاح',
      connectedPages: user.connectedPages
    });

  } catch (error) {
    console.error('Connect page error:', error);
    res.status(500).json({
      error: 'Failed to connect page',
      errorAr: 'فشل في ربط الصفحة'
    });
  }
});

export default router;