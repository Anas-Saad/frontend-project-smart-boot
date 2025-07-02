import React, { useState } from 'react';
import { AuthButton } from './components/AuthButton';
import { Dashboard } from './components/Dashboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { User, FacebookPage } from './types';
import { AdminUser } from './types/admin';
import { Activity, Bot, MessageSquare, Sparkles, Zap } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleLogin = async (provider: 'facebook' | 'google') => {
    setLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        name: provider === 'facebook' ? 'John Smith' : 'Sarah Johnson',
        email: provider === 'facebook' ? 'john@example.com' : 'sarah@example.com',
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
        age: 32,
        gender: 'male',
        provider,
        token: 'mock_token_12345',
        connectedPages: [
          {
            id: 'page_1',
            name: 'Tech Solutions Pro',
            category: 'Technology',
            followers: 15420,
            isActive: true,
            accessToken: 'page_token_1',
          },
          {
            id: 'page_2',
            name: 'Health & Wellness Hub',
            category: 'Health',
            followers: 8930,
            isActive: true,
            accessToken: 'page_token_2',
          },
        ],
        subscription: 'trial', // 14 يوم تجريبي
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 يوم من الآن
        businessType: 'technology',
        businessDescription: 'Technology solutions and consulting',
        website: 'https://techsolutions.com',
        location: 'Baghdad, Iraq',
        targetAudience: 'Tech enthusiasts and businesses',
        businessGoals: ['Increase sales', 'Expand customer base'],
        language: 'ar',
      };
      
      setUser(mockUser);
      setLoading(false);
    }, 2000);
  };

  const handleAdminLogin = async (credentials: { username: string; password: string; twoFactorCode?: string }) => {
    // محاكاة تسجيل دخول الأدمن
    const mockAdmin: AdminUser = {
      id: 'admin-1',
      username: credentials.username,
      email: 'admin@socialbot.ai',
      role: 'super_admin',
      permissions: [],
      isActive: true,
      lastLogin: new Date(),
      loginAttempts: 0,
      isLocked: false,
      twoFactorEnabled: true,
      createdAt: new Date(),
    };
    
    setAdmin(mockAdmin);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAdminLogout = () => {
    setAdmin(null);
  };

  // Admin Dashboard
  if (admin) {
    return <AdminDashboard admin={admin} onLogout={handleAdminLogout} />;
  }

  // Admin Login
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  // User Dashboard
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-red-600/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Logo - أكبر حجماً */}
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/qline.png" 
              alt="QLINE Logo" 
              className="h-32 w-auto"
            />
          </div>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            منصة الذكاء الاصطناعي المتطورة لإدارة خدمة العملاء وتحويل التفاعلات إلى مبيعات تلقائياً
          </p>
        </div>

        {/* Authentication */}
        <div className="w-full max-w-md mb-12">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 p-8">
            <h2 className="text-2xl font-bold text-gray-200 text-center mb-8">ابدأ رحلتك الآن</h2>
            
            <div className="space-y-4">
              <AuthButton
                provider="facebook"
                onClick={() => handleLogin('facebook')}
                loading={loading}
              />
              
              <AuthButton
                provider="google"
                onClick={() => handleLogin('google')}
                loading={loading}
              />
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                بالمتابعة، أنت توافق على{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 font-medium underline decoration-blue-500 hover:decoration-blue-400 transition-colors">
                  شروط الخدمة
                </a>{' '}
                و{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 font-medium underline decoration-blue-500 hover:decoration-blue-400 transition-colors">
                  سياسة الخصوصية
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid - تحت الصندوق */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-slate-800/80">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-200 mb-2 text-center">إدارة تلقائية شاملة</h3>
            <p className="text-sm text-gray-400 text-center">مراقبة وإدارة التعليقات والرسائل تلقائياً مع الحفاظ على التواصل المهني.</p>
          </div>
          
          <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-slate-800/80">
            <div className="bg-gradient-to-r from-red-600 to-red-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-200 mb-2 text-center">محرك مبيعات ذكي</h3>
            <p className="text-sm text-gray-400 text-center">توصيات منتجات مدعومة بالذكاء الاصطناعي تحول المحادثات إلى فرص مبيعات حقيقية.</p>
          </div>

          <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-slate-800/80">
            <div className="bg-gradient-to-r from-blue-600 to-slate-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-200 mb-2 text-center">مساعد ذكي متطور</h3>
            <p className="text-sm text-gray-400 text-center">روبوت ذكي قابل للتخصيص حسب طبيعة عملك - من الاستشارات الطبية إلى الدعم التقني.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 QLINE. جميع الحقوق محفوظة.</p>
          <div className="mt-4">
            <a 
              href="/admin-secure-access-portal" 
              onClick={(e) => {
                e.preventDefault();
                setShowAdminLogin(true);
              }}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-800/30"
            >
              🔐 Admin Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;