export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  age?: number;
  gender?: string;
  provider: 'facebook' | 'google';
  token: string;
  connectedPages: FacebookPage[];
  subscription: 'trial' | 'free' | 'pro' | 'enterprise';
  trialEndsAt?: Date; // تاريخ انتهاء التجربة المجانية
  // إضافات جديدة للتخصص
  businessType: string;
  businessDescription: string;
  website?: string;
  location?: string;
  targetAudience?: string;
  businessGoals?: string[];
  language: 'ar' | 'en';
}

export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  followers: number;
  isActive: boolean;
  accessToken: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  image: string;
  category: string;
  categoryAr: string;
  inStock: boolean;
  tags: string[];
  tagsAr: string[];
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  platform: 'facebook' | 'instagram';
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
}

export interface AIBot {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  persona: 'doctor' | 'engineer' | 'shop_assistant' | 'general' | 'custom';
  customPersona?: string;
  customPersonaAr?: string;
  isActive: boolean;
  responseSettings: {
    autoReply: boolean;
    moderateComments: boolean;
    recommendProducts: boolean;
    responseDelay: number;
    language: 'ar' | 'en' | 'both';
  };
  analytics: {
    messagesHandled: number;
    commentsModerated: number;
    productsRecommended: number;
    conversionsGenerated: number;
  };
  // إعدادات التعلم الآلي
  learningData: {
    businessContext: string;
    commonQuestions: string[];
    productKnowledge: string[];
    customerPreferences: any[];
  };
}

export interface Notification {
  id: string;
  type: 'order' | 'comment' | 'message' | 'system';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  businessNameAr: string;
  businessType: string;
  description: string;
  descriptionAr: string;
  website?: string;
  location: string;
  locationAr: string;
  phone: string;
  workingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  specialties: string[];
  specialtiesAr: string[];
  targetAudience: string;
  targetAudienceAr: string;
  businessGoals: string[];
  businessGoalsAr: string[];
  // بيانات التعلم الآلي
  mlTrainingData: {
    customerInteractions: any[];
    successfulSales: any[];
    commonQuestions: any[];
    productPerformance: any[];
  };
}

export interface MLModel {
  id: string;
  userId: string;
  modelType: 'recommendation' | 'response' | 'moderation';
  trainingData: any[];
  accuracy: number;
  lastTrained: Date;
  isActive: boolean;
  parameters: any;
}