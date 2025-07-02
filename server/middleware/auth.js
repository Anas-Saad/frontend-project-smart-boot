import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        errorAr: 'تم رفض الوصول. لم يتم توفير رمز المصادقة.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid token or user not found.',
        errorAr: 'رمز غير صحيح أو المستخدم غير موجود.'
      });
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'Invalid token.',
      errorAr: 'رمز غير صحيح.'
    });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required.',
        errorAr: 'المصادقة مطلوبة.'
      });
    }

    // Check if user has admin role (you can customize this logic)
    const adminRoles = ['admin', 'super_admin'];
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Admin access required.',
        errorAr: 'صلاحيات الإدارة مطلوبة.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      error: 'Authorization check failed.',
      errorAr: 'فشل في التحقق من الصلاحيات.'
    });
  }
};