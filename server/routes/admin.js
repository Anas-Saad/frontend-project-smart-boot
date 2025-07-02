import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Bot from '../models/Bot.js';
import Order from '../models/Order.js';
import MLDataset from '../models/MLDataset.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Admin dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalBots,
      activeBots,
      totalOrders,
      pendingOrders,
      totalDatasets,
      pendingDatasets
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true, lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      Bot.countDocuments(),
      Bot.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      MLDataset.countDocuments(),
      MLDataset.countDocuments({ approvalStatus: 'pending' })
    ]);

    // Calculate revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        growth: '+12%' // This would be calculated from historical data
      },
      bots: {
        total: totalBots,
        active: activeBots
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        revenue: totalRevenue
      },
      datasets: {
        total: totalDatasets,
        pending: pendingDatasets
      }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      error: 'Failed to get admin stats',
      errorAr: 'فشل في جلب إحصائيات الإدارة'
    });
  }
});

// Get all users for admin
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { subscription, isActive, search, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (subscription) filter.subscription = subscription;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -twoFactorAuth.secret')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      errorAr: 'فشل في جلب المستخدمين'
    });
  }
});

// Update user status
router.put('/users/:id/status', authMiddleware, adminMiddleware, [
  body('isActive').isBoolean().withMessage('isActive must be boolean'),
  body('reason').optional().isString(),
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

    const { isActive, reason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password -twoFactorAuth.secret');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        errorAr: 'المستخدم غير موجود'
      });
    }

    // Log admin action
    console.log(`Admin ${req.userId} ${isActive ? 'activated' : 'deactivated'} user ${user._id}. Reason: ${reason || 'No reason provided'}`);

    // Notify user if deactivated
    if (!isActive) {
      req.io.to(`user-${user._id}`).emit('account-suspended', {
        reason: reason || 'Account suspended by administrator'
      });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      messageAr: `تم ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} المستخدم بنجاح`,
      user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      error: 'Failed to update user status',
      errorAr: 'فشل في تحديث حالة المستخدم'
    });
  }
});

// Get system logs
router.get('/logs', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { type, severity, page = 1, limit = 50 } = req.query;
    
    // This would typically come from a logging service or database
    // For now, we'll return mock data
    const logs = [
      {
        id: '1',
        type: 'security',
        severity: 'warning',
        message: 'Multiple failed login attempts',
        messageAr: 'محاولات دخول فاشلة متعددة',
        timestamp: new Date(),
        details: { ip: '192.168.1.100', attempts: 5 }
      },
      {
        id: '2',
        type: 'system',
        severity: 'info',
        message: 'Database backup completed',
        messageAr: 'تم إكمال النسخ الاحتياطي لقاعدة البيانات',
        timestamp: new Date(),
        details: { size: '2.4GB', duration: '15 minutes' }
      }
    ];

    res.json({
      logs,
      pagination: {
        current: page,
        pages: 1,
        total: logs.length
      }
    });

  } catch (error) {
    console.error('Get system logs error:', error);
    res.status(500).json({
      error: 'Failed to get system logs',
      errorAr: 'فشل في جلب سجلات النظام'
    });
  }
});

// System backup
router.post('/backup', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Simulate backup process
    const backupId = `backup_${Date.now()}`;
    
    // Emit backup started event
    req.io.to('admin-room').emit('backup-started', {
      backupId,
      startTime: new Date()
    });

    // Simulate backup with timeout
    setTimeout(() => {
      req.io.to('admin-room').emit('backup-completed', {
        backupId,
        completedTime: new Date(),
        size: '2.4GB',
        location: `/backups/${backupId}.tar.gz`
      });
    }, 10000); // 10 second simulation

    res.json({
      message: 'Backup started successfully',
      messageAr: 'تم بدء النسخ الاحتياطي بنجاح',
      backupId,
      estimatedDuration: '10-15 minutes'
    });

  } catch (error) {
    console.error('System backup error:', error);
    res.status(500).json({
      error: 'Failed to start backup',
      errorAr: 'فشل في بدء النسخ الاحتياطي'
    });
  }
});

export default router;