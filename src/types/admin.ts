export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'support' | 'moderator' | 'customer';
  permissions: Permission[];
  isActive: boolean;
  lastLogin: Date;
  loginAttempts: number;
  isLocked: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  avatar?: string;
}

export interface Permission {
  id: string;
  name: string;
  nameAr: string;
  category: 'users' | 'bots' | 'products' | 'orders' | 'support' | 'system' | 'analytics' | 'security';
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

export interface UserRole {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  permissions: Permission[];
  level: number; // 1 = customer, 2 = moderator, 3 = support, 4 = admin, 5 = super_admin
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  assignedToName?: string;
  createdAt: Date;
  updatedAt: Date;
  responses: TicketResponse[];
  attachments: string[];
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorType: 'user' | 'support';
  message: string;
  messageAr: string;
  createdAt: Date;
  isInternal: boolean;
}

export interface SecurityLog {
  id: string;
  userId?: string;
  action: string;
  actionAr: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  success: boolean;
  details: any;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'error' | 'maintenance';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  isResolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// نظام الصلاحيات المتقدم
export const USER_ROLES: UserRole[] = [
  {
    id: 'customer',
    name: 'Customer',
    nameAr: 'زبون',
    description: 'Regular customer with basic access',
    descriptionAr: 'زبون عادي مع صلاحيات أساسية',
    level: 1,
    permissions: [
      {
        id: 'own_profile',
        name: 'Own Profile Management',
        nameAr: 'إدارة الملف الشخصي',
        category: 'users',
        actions: ['read', 'write']
      },
      {
        id: 'own_bots',
        name: 'Own Bots Management',
        nameAr: 'إدارة الروبوتات الخاصة',
        category: 'bots',
        actions: ['read', 'write']
      },
      {
        id: 'own_products',
        name: 'Own Products Management',
        nameAr: 'إدارة المنتجات الخاصة',
        category: 'products',
        actions: ['read', 'write']
      },
      {
        id: 'own_orders',
        name: 'Own Orders View',
        nameAr: 'عرض الطلبات الخاصة',
        category: 'orders',
        actions: ['read']
      },
      {
        id: 'support_tickets',
        name: 'Support Tickets',
        nameAr: 'تذاكر الدعم',
        category: 'support',
        actions: ['read', 'write']
      }
    ]
  },
  {
    id: 'moderator',
    name: 'Moderator',
    nameAr: 'مشرف',
    description: 'Content moderator with limited admin access',
    descriptionAr: 'مشرف محتوى مع صلاحيات إدارية محدودة',
    level: 2,
    permissions: [
      {
        id: 'content_moderation',
        name: 'Content Moderation',
        nameAr: 'إشراف المحتوى',
        category: 'bots',
        actions: ['read', 'write']
      },
      {
        id: 'user_support',
        name: 'User Support',
        nameAr: 'دعم المستخدمين',
        category: 'support',
        actions: ['read', 'write']
      },
      {
        id: 'basic_analytics',
        name: 'Basic Analytics',
        nameAr: 'تحليلات أساسية',
        category: 'analytics',
        actions: ['read']
      }
    ]
  },
  {
    id: 'support',
    name: 'Support Agent',
    nameAr: 'موظف دعم',
    description: 'Customer support agent',
    descriptionAr: 'موظف دعم العملاء',
    level: 3,
    permissions: [
      {
        id: 'all_support',
        name: 'All Support Functions',
        nameAr: 'جميع وظائف الدعم',
        category: 'support',
        actions: ['read', 'write', 'admin']
      },
      {
        id: 'user_management_limited',
        name: 'Limited User Management',
        nameAr: 'إدارة محدودة للمستخدمين',
        category: 'users',
        actions: ['read', 'write']
      },
      {
        id: 'system_monitoring',
        name: 'System Monitoring',
        nameAr: 'مراقبة النظام',
        category: 'system',
        actions: ['read']
      }
    ]
  },
  {
    id: 'admin',
    name: 'Administrator',
    nameAr: 'مدير',
    description: 'System administrator with full access',
    descriptionAr: 'مدير النظام مع صلاحيات كاملة',
    level: 4,
    permissions: [
      {
        id: 'full_user_management',
        name: 'Full User Management',
        nameAr: 'إدارة كاملة للمستخدمين',
        category: 'users',
        actions: ['read', 'write', 'delete', 'admin']
      },
      {
        id: 'full_system_access',
        name: 'Full System Access',
        nameAr: 'وصول كامل للنظام',
        category: 'system',
        actions: ['read', 'write', 'delete', 'admin']
      },
      {
        id: 'security_management',
        name: 'Security Management',
        nameAr: 'إدارة الأمان',
        category: 'security',
        actions: ['read', 'write', 'admin']
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        nameAr: 'تحليلات متقدمة',
        category: 'analytics',
        actions: ['read', 'write', 'admin']
      }
    ]
  },
  {
    id: 'super_admin',
    name: 'Super Administrator',
    nameAr: 'مدير عام',
    description: 'Super administrator with unlimited access',
    descriptionAr: 'مدير عام مع صلاحيات غير محدودة',
    level: 5,
    permissions: [] // Super admin has all permissions by default
  }
];