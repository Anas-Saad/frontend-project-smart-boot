import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all user products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, inStock, featured, search, page = 1, limit = 20 } = req.query;
    
    const filter = { userId: req.userId };
    
    if (category) filter.category = category;
    if (inStock !== undefined) filter['inventory.inStock'] = inStock === 'true';
    if (featured !== undefined) filter.isFeatured = featured === 'true';
    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Failed to get products',
      errorAr: 'فشل في جلب المنتجات'
    });
  }
});

// Create new product
router.post('/', authMiddleware, [
  body('name').notEmpty().withMessage('Product name is required'),
  body('nameAr').notEmpty().withMessage('Arabic product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
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

    const product = new Product({
      ...req.body,
      userId: req.userId
    });

    await product.save();

    // Emit real-time update
    req.io.to(`user-${req.userId}`).emit('product-created', product);

    res.status(201).json({
      message: 'Product created successfully',
      messageAr: 'تم إنشاء المنتج بنجاح',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      error: 'Failed to create product',
      errorAr: 'فشل في إنشاء المنتج'
    });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        errorAr: 'المنتج غير موجود'
      });
    }

    res.json({
      message: 'Product updated successfully',
      messageAr: 'تم تحديث المنتج بنجاح',
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      error: 'Failed to update product',
      errorAr: 'فشل في تحديث المنتج'
    });
  }
});

// Get product analytics
router.get('/:id/analytics', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        errorAr: 'المنتج غير موجود'
      });
    }

    res.json({
      analytics: product.analytics,
      effectivePrice: product.effectivePrice,
      discountPercentage: product.discountPercentage,
      isLowStock: product.isLowStock()
    });

  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({
      error: 'Failed to get analytics',
      errorAr: 'فشل في جلب التحليلات'
    });
  }
});

export default router;