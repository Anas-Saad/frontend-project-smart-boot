import express from 'express';
import Bot from '../models/Bot.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user analytics dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get user's bots analytics
    const bots = await Bot.find({ userId: req.userId });
    const botAnalytics = bots.reduce((acc, bot) => {
      acc.messagesHandled += bot.analytics.messagesHandled;
      acc.commentsModerated += bot.analytics.commentsModerated;
      acc.productsRecommended += bot.analytics.productsRecommended;
      acc.conversionsGenerated += bot.analytics.conversionsGenerated;
      return acc;
    }, {
      messagesHandled: 0,
      commentsModerated: 0,
      productsRecommended: 0,
      conversionsGenerated: 0
    });

    // Get orders analytics
    const orders = await Order.find({
      userId: req.userId,
      createdAt: { $gte: startDate }
    });

    const orderAnalytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.pricing.total, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.pricing.total, 0) / orders.length : 0,
      conversionRate: botAnalytics.messagesHandled > 0 ? (orders.length / botAnalytics.messagesHandled * 100).toFixed(2) : 0
    };

    // Get products analytics
    const products = await Product.find({ userId: req.userId });
    const productAnalytics = products.reduce((acc, product) => {
      acc.totalViews += product.analytics.views;
      acc.totalRecommendations += product.analytics.recommendations;
      acc.totalPurchases += product.analytics.purchases;
      acc.totalRevenue += product.analytics.revenue;
      return acc;
    }, {
      totalViews: 0,
      totalRecommendations: 0,
      totalPurchases: 0,
      totalRevenue: 0
    });

    // Daily breakdown for charts
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayOrders = orders.filter(order => 
        order.createdAt >= dayStart && order.createdAt <= dayEnd
      );
      
      dailyStats.push({
        date: dayStart.toISOString().split('T')[0],
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.pricing.total, 0),
        messages: Math.floor(Math.random() * 50) + 10 // Mock data - would come from bot logs
      });
    }

    res.json({
      period,
      bots: {
        count: bots.length,
        active: bots.filter(bot => bot.isActive).length,
        analytics: botAnalytics
      },
      orders: orderAnalytics,
      products: {
        count: products.length,
        analytics: productAnalytics
      },
      dailyStats
    });

  } catch (error) {
    console.error('Get analytics dashboard error:', error);
    res.status(500).json({
      error: 'Failed to get analytics',
      errorAr: 'فشل في جلب التحليلات'
    });
  }
});

// Get bot performance analytics
router.get('/bots/:id/performance', authMiddleware, async (req, res) => {
  try {
    const bot = await Bot.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!bot) {
      return res.status(404).json({
        error: 'Bot not found',
        errorAr: 'الروبوت غير موجود'
      });
    }

    const performance = bot.getPerformanceMetrics();
    
    // Get conversation sentiment analysis (mock data)
    const sentimentAnalysis = {
      positive: 65,
      neutral: 25,
      negative: 10
    };

    // Get response time trends (mock data)
    const responseTimeTrends = [
      { hour: '00:00', avgTime: 2.1 },
      { hour: '06:00', avgTime: 1.8 },
      { hour: '12:00', avgTime: 2.5 },
      { hour: '18:00', avgTime: 3.2 }
    ];

    res.json({
      bot: {
        id: bot._id,
        name: bot.nameAr,
        isActive: bot.isActive
      },
      performance,
      sentimentAnalysis,
      responseTimeTrends,
      recentConversations: bot.learningData.conversationHistory.slice(-10)
    });

  } catch (error) {
    console.error('Get bot performance error:', error);
    res.status(500).json({
      error: 'Failed to get bot performance',
      errorAr: 'فشل في جلب أداء الروبوت'
    });
  }
});

// Get product performance analytics
router.get('/products/performance', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.userId })
      .sort({ 'analytics.revenue': -1 })
      .limit(10);

    const topProducts = products.map(product => ({
      id: product._id,
      name: product.nameAr,
      category: product.categoryAr,
      analytics: product.analytics,
      conversionRate: product.analytics.views > 0 
        ? (product.analytics.purchases / product.analytics.views * 100).toFixed(2)
        : 0,
      recommendationRate: product.analytics.views > 0
        ? (product.analytics.recommendations / product.analytics.views * 100).toFixed(2)
        : 0
    }));

    // Category performance
    const categoryPerformance = await Product.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: '$category',
          totalRevenue: { $sum: '$analytics.revenue' },
          totalViews: { $sum: '$analytics.views' },
          totalPurchases: { $sum: '$analytics.purchases' },
          productCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      topProducts,
      categoryPerformance
    });

  } catch (error) {
    console.error('Get product performance error:', error);
    res.status(500).json({
      error: 'Failed to get product performance',
      errorAr: 'فشل في جلب أداء المنتجات'
    });
  }
});

// Get real-time metrics
router.get('/realtime', authMiddleware, async (req, res) => {
  try {
    // Get real-time data (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [recentOrders, activeBots] = await Promise.all([
      Order.find({
        userId: req.userId,
        createdAt: { $gte: last24Hours }
      }).sort({ createdAt: -1 }).limit(5),
      
      Bot.find({
        userId: req.userId,
        isActive: true
      })
    ]);

    // Mock real-time data
    const realTimeMetrics = {
      activeVisitors: Math.floor(Math.random() * 50) + 10,
      messagesPerMinute: Math.floor(Math.random() * 10) + 2,
      responseTime: (Math.random() * 3 + 1).toFixed(1),
      conversionRate: (Math.random() * 5 + 10).toFixed(1)
    };

    res.json({
      metrics: realTimeMetrics,
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer.name,
        total: order.pricing.total,
        status: order.status,
        createdAt: order.createdAt
      })),
      activeBots: activeBots.map(bot => ({
        id: bot._id,
        name: bot.nameAr,
        messagesHandled: bot.analytics.messagesHandled,
        lastActivity: new Date() // Mock last activity
      }))
    });

  } catch (error) {
    console.error('Get real-time metrics error:', error);
    res.status(500).json({
      error: 'Failed to get real-time metrics',
      errorAr: 'فشل في جلب المقاييس المباشرة'
    });
  }
});

export default router;