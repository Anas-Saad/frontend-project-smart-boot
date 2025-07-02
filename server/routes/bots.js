import express from 'express';
import { body, validationResult } from 'express-validator';
import Bot from '../models/Bot.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all user bots
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bots = await Bot.find({ userId: req.userId });
    
    res.json({
      bots,
      count: bots.length
    });

  } catch (error) {
    console.error('Get bots error:', error);
    res.status(500).json({
      error: 'Failed to get bots',
      errorAr: 'فشل في جلب الروبوتات'
    });
  }
});

// Create new bot
router.post('/', authMiddleware, [
  body('name').notEmpty().withMessage('Bot name is required'),
  body('nameAr').notEmpty().withMessage('Arabic bot name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('persona').isIn(['doctor', 'engineer', 'shop_assistant', 'general', 'custom']),
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

    const bot = new Bot({
      ...req.body,
      userId: req.userId
    });

    await bot.save();

    // Emit real-time update
    req.io.to(`user-${req.userId}`).emit('bot-created', bot);

    res.status(201).json({
      message: 'Bot created successfully',
      messageAr: 'تم إنشاء الروبوت بنجاح',
      bot
    });

  } catch (error) {
    console.error('Create bot error:', error);
    res.status(500).json({
      error: 'Failed to create bot',
      errorAr: 'فشل في إنشاء الروبوت'
    });
  }
});

// Update bot
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const bot = await Bot.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!bot) {
      return res.status(404).json({
        error: 'Bot not found',
        errorAr: 'الروبوت غير موجود'
      });
    }

    // Emit real-time update
    req.io.to(`user-${req.userId}`).emit('bot-updated', bot);

    res.json({
      message: 'Bot updated successfully',
      messageAr: 'تم تحديث الروبوت بنجاح',
      bot
    });

  } catch (error) {
    console.error('Update bot error:', error);
    res.status(500).json({
      error: 'Failed to update bot',
      errorAr: 'فشل في تحديث الروبوت'
    });
  }
});

// Get bot analytics
router.get('/:id/analytics', authMiddleware, async (req, res) => {
  try {
    const bot = await Bot.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!bot) {
      return res.status(404).json({
        error: 'Bot not found',
        errorAr: 'الروبوت غير موجود'
      });
    }

    const metrics = bot.getPerformanceMetrics();

    res.json({
      analytics: bot.analytics,
      metrics,
      conversationHistory: bot.learningData.conversationHistory.slice(-50) // Last 50 conversations
    });

  } catch (error) {
    console.error('Get bot analytics error:', error);
    res.status(500).json({
      error: 'Failed to get analytics',
      errorAr: 'فشل في جلب التحليلات'
    });
  }
});

// Train bot with conversation
router.post('/:id/train', authMiddleware, [
  body('message').notEmpty(),
  body('response').notEmpty(),
  body('feedback').optional().isIn(['positive', 'negative', 'neutral']),
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

    const { message, response, feedback = 'neutral' } = req.body;
    
    const bot = await Bot.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!bot) {
      return res.status(404).json({
        error: 'Bot not found',
        errorAr: 'الروبوت غير موجود'
      });
    }

    await bot.addConversation(message, response, feedback);

    res.json({
      message: 'Training data added successfully',
      messageAr: 'تم إضافة بيانات التدريب بنجاح'
    });

  } catch (error) {
    console.error('Train bot error:', error);
    res.status(500).json({
      error: 'Failed to train bot',
      errorAr: 'فشل في تدريب الروبوت'
    });
  }
});

export default router;