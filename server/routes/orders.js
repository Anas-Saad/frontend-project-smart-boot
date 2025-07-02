import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all user orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, platform, page = 1, limit = 20 } = req.query;
    
    const filter = { userId: req.userId };
    
    if (status) filter.status = status;
    if (platform) filter['source.platform'] = platform;

    const orders = await Order.find(filter)
      .populate('items.productId', 'name nameAr images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Failed to get orders',
      errorAr: 'فشل في جلب الطلبات'
    });
  }
});

// Create new order
router.post('/', authMiddleware, [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('source.platform').isIn(['facebook', 'instagram', 'whatsapp', 'website', 'bot']),
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

    // Calculate order totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of req.body.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          error: `Product ${item.productId} not found`,
          errorAr: `المنتج ${item.productId} غير موجود`
        });
      }

      const itemSubtotal = product.effectivePrice * item.quantity;
      subtotal += itemSubtotal;

      processedItems.push({
        productId: product._id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.effectivePrice,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });

      // Update product analytics
      await product.updateAnalytics('purchases', item.quantity);
      
      // Update inventory if tracked
      if (product.inventory.trackInventory) {
        await product.updateInventory(item.quantity, 'subtract');
      }
    }

    const order = new Order({
      userId: req.userId,
      customer: req.body.customer,
      items: processedItems,
      pricing: {
        subtotal,
        tax: req.body.pricing?.tax || 0,
        shipping: req.body.pricing?.shipping || 0,
        discount: req.body.pricing?.discount || 0,
        total: subtotal + (req.body.pricing?.tax || 0) + (req.body.pricing?.shipping || 0) - (req.body.pricing?.discount || 0),
        currency: req.body.pricing?.currency || 'USD'
      },
      source: req.body.source,
      notes: req.body.notes || {}
    });

    await order.save();

    // Emit real-time updates
    req.io.to(`user-${req.userId}`).emit('new-order', order);
    req.io.to('admin-room').emit('new-order-notification', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.pricing.total,
      customer: order.customer.name,
      userId: req.userId
    });

    res.status(201).json({
      message: 'Order created successfully',
      messageAr: 'تم إنشاء الطلب بنجاح',
      order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: 'Failed to create order',
      errorAr: 'فشل في إنشاء الطلب'
    });
  }
});

// Update order status
router.put('/:id/status', authMiddleware, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
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
    
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        errorAr: 'الطلب غير موجود'
      });
    }

    await order.updateStatus(status, note, req.userId);

    // Emit real-time update
    req.io.to(`user-${req.userId}`).emit('order-updated', order);

    res.json({
      message: 'Order status updated successfully',
      messageAr: 'تم تحديث حالة الطلب بنجاح',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      error: 'Failed to update order status',
      errorAr: 'فشل في تحديث حالة الطلب'
    });
  }
});

export default router;