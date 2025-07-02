import express from 'express';
import { body, validationResult } from 'express-validator';
import MLDataset from '../models/MLDataset.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user's ML datasets
router.get('/datasets', authMiddleware, async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    const filter = { 
      $or: [
        { createdBy: req.userId },
        { isPublic: true, approvalStatus: 'approved' }
      ]
    };
    
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const datasets = await MLDataset.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      datasets,
      count: datasets.length
    });

  } catch (error) {
    console.error('Get ML datasets error:', error);
    res.status(500).json({
      error: 'Failed to get datasets',
      errorAr: 'فشل في جلب مجموعات البيانات'
    });
  }
});

// Create new ML dataset
router.post('/datasets', authMiddleware, [
  body('name').notEmpty().withMessage('Dataset name is required'),
  body('nameAr').notEmpty().withMessage('Arabic dataset name is required'),
  body('type').isIn(['iraqi_dialect', 'business_terms', 'medical_terms', 'general_arabic', 'custom']),
  body('data').isArray({ min: 1 }).withMessage('Training data is required'),
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

    const dataset = new MLDataset({
      ...req.body,
      createdBy: req.userId
    });

    await dataset.save();

    res.status(201).json({
      message: 'Dataset created successfully',
      messageAr: 'تم إنشاء مجموعة البيانات بنجاح',
      dataset
    });

  } catch (error) {
    console.error('Create ML dataset error:', error);
    res.status(500).json({
      error: 'Failed to create dataset',
      errorAr: 'فشل في إنشاء مجموعة البيانات'
    });
  }
});

// Train model with dataset
router.post('/datasets/:id/train', authMiddleware, async (req, res) => {
  try {
    const dataset = await MLDataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        error: 'Dataset not found',
        errorAr: 'مجموعة البيانات غير موجودة'
      });
    }

    // Check permissions
    if (dataset.createdBy.toString() !== req.userId && !dataset.isPublic) {
      return res.status(403).json({
        error: 'Access denied',
        errorAr: 'تم رفض الوصول'
      });
    }

    // Simulate training process
    const trainingStartTime = Date.now();
    
    // Emit training started event
    req.io.to(`user-${req.userId}`).emit('training-started', {
      datasetId: dataset._id,
      datasetName: dataset.nameAr
    });

    // Simulate training with timeout
    setTimeout(async () => {
      const trainingDuration = Date.now() - trainingStartTime;
      const accuracy = 0.75 + Math.random() * 0.2; // Random accuracy between 75-95%
      const modelSize = Math.floor(Math.random() * 100) + 50; // Random size 50-150MB

      await dataset.updateTrainingMetrics(accuracy, trainingDuration, modelSize);

      // Emit training completed event
      req.io.to(`user-${req.userId}`).emit('training-completed', {
        datasetId: dataset._id,
        accuracy,
        duration: trainingDuration
      });

    }, 5000); // 5 second simulation

    res.json({
      message: 'Training started successfully',
      messageAr: 'تم بدء التدريب بنجاح',
      estimatedDuration: '5-10 minutes'
    });

  } catch (error) {
    console.error('Train model error:', error);
    res.status(500).json({
      error: 'Failed to start training',
      errorAr: 'فشل في بدء التدريب'
    });
  }
});

// Add feedback to dataset
router.post('/datasets/:id/feedback', authMiddleware, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString(),
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

    const { rating, comment } = req.body;
    
    const dataset = await MLDataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        error: 'Dataset not found',
        errorAr: 'مجموعة البيانات غير موجودة'
      });
    }

    await dataset.addFeedback(req.userId, rating, comment);

    res.json({
      message: 'Feedback added successfully',
      messageAr: 'تم إضافة التقييم بنجاح',
      averageRating: dataset.getAverageRating()
    });

  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      error: 'Failed to add feedback',
      errorAr: 'فشل في إضافة التقييم'
    });
  }
});

// Admin: Get all datasets for approval
router.get('/admin/datasets', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { approvalStatus } = req.query;
    
    const filter = {};
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    const datasets = await MLDataset.find(filter)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      datasets,
      count: datasets.length
    });

  } catch (error) {
    console.error('Get admin datasets error:', error);
    res.status(500).json({
      error: 'Failed to get datasets',
      errorAr: 'فشل في جلب مجموعات البيانات'
    });
  }
});

// Admin: Approve/Reject dataset
router.put('/admin/datasets/:id/approval', authMiddleware, adminMiddleware, [
  body('status').isIn(['approved', 'rejected']).withMessage('Invalid approval status'),
  body('note').optional().isString(),
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

    const { status, note } = req.body;
    
    const dataset = await MLDataset.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: status,
        approvedBy: req.userId,
        approvalNote: note
      },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!dataset) {
      return res.status(404).json({
        error: 'Dataset not found',
        errorAr: 'مجموعة البيانات غير موجودة'
      });
    }

    // Notify dataset creator
    req.io.to(`user-${dataset.createdBy._id}`).emit('dataset-approval', {
      datasetId: dataset._id,
      datasetName: dataset.nameAr,
      status,
      note
    });

    res.json({
      message: `Dataset ${status} successfully`,
      messageAr: `تم ${status === 'approved' ? 'قبول' : 'رفض'} مجموعة البيانات بنجاح`,
      dataset
    });

  } catch (error) {
    console.error('Dataset approval error:', error);
    res.status(500).json({
      error: 'Failed to update approval status',
      errorAr: 'فشل في تحديث حالة الموافقة'
    });
  }
});

export default router;