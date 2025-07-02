import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Bell,
  Users,
  TrendingUp,
  Activity,
  Database,
  Building,
  RefreshCw,
  LogOut,
  X,
  CheckCircle,
  Crown,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { User, AIBot, Product, Order, Notification, BusinessProfile } from '../types';
import { ProductManagement } from './ProductManagement';
import { OrderTracking } from './OrderTracking';
import { Analytics } from './Analytics';
import { SocialMediaIntegration } from './SocialMediaIntegration';
import { BusinessSetup } from './BusinessSetup';
import { DatabaseManager } from './DatabaseManager';
import { UpdateManager } from './UpdateManager';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [showBusinessSetup, setShowBusinessSetup] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(!businessProfile);
  const [showTrialWarning, setShowTrialWarning] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  // حساب الأيام المتبقية في التجربة
  useEffect(() => {
    if (user.subscription === 'trial' && user.trialEndsAt) {
      const now = new Date();
      const trialEnd = new Date(user.trialEndsAt);
      const diffTime = trialEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, diffDays));
      
      if (diffDays <= 3) {
        setShowTrialWarning(true);
      }
    }
  }, [user.subscription, user.trialEndsAt]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'New Order',
      titleAr: 'طلب جديد',
      message: 'Order #1234 received from Facebook',
      messageAr: 'تم استلام الطلب #1234 من فيسبوك',
      isRead: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'comment',
      title: 'Comment Moderated',
      titleAr: 'تم حذف تعليق',
      message: 'Inappropriate comment removed from post',
      messageAr: 'تم حذف تعليق غير مناسب من المنشور',
      isRead: false,
      createdAt: new Date(),
    },
  ]);

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', labelEn: 'Overview', icon: BarChart3 },
    { id: 'business', label: 'إعداد العمل', labelEn: 'Business Setup', icon: Building },
    { id: 'products', label: 'المنتجات', labelEn: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'الطلبات', labelEn: 'Orders', icon: MessageSquare },
    { id: 'social', label: 'وسائل التواصل', labelEn: 'Social Media', icon: Users },
    { id: 'database', label: 'قاعدة البيانات', labelEn: 'Database', icon: Database },
    { id: 'updates', label: 'التحديثات', labelEn: 'Updates', icon: RefreshCw },
    { id: 'analytics', label: 'التحليلات', labelEn: 'Analytics', icon: TrendingUp },
  ];

  const stats = [
    { label: 'الروبوت الذكي', labelEn: 'AI Bot', value: '1', change: 'نشط', icon: Bot, color: 'bg-blue-600' },
    { label: 'المنتجات', labelEn: 'Products', value: '24', change: '+8%', icon: ShoppingBag, color: 'bg-slate-600' },
    { label: 'طلبات اليوم', labelEn: 'Orders Today', value: '12', change: '+24%', icon: MessageSquare, color: 'bg-red-600' },
    { label: 'الإيرادات', labelEn: 'Revenue', value: '$2,847', change: '+18%', icon: TrendingUp, color: 'bg-blue-700' },
  ];

  const handleBusinessSetupComplete = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    setShowBusinessSetup(false);
    setShowWelcomeMessage(false);
    console.log('Business profile saved:', profile);
  };

  const handleSetupBusiness = () => {
    setShowBusinessSetup(true);
    setShowWelcomeMessage(false);
  };

  const handleUpgradeSubscription = () => {
    alert('سيتم توجيهك لصفحة الدفع لترقية الاشتراك');
  };

  if (showBusinessSetup) {
    return <BusinessSetup user={user} onComplete={handleBusinessSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900" dir="rtl">
      {/* Trial Warning */}
      {showTrialWarning && user.subscription === 'trial' && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 text-center relative">
          <div className="flex items-center justify-center space-x-2 space-x-reverse">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              {daysLeft > 0 
                ? `تنتهي فترة التجربة المجانية خلال ${daysLeft} أيام` 
                : 'انتهت فترة التجربة المجانية'
              }
            </span>
            <button
              onClick={handleUpgradeSubscription}
              className="bg-white text-orange-600 px-4 py-1 rounded-lg font-medium hover:bg-gray-100 transition-colors mr-4"
            >
              ترقية الاشتراك الآن
            </button>
          </div>
          <button
            onClick={() => setShowTrialWarning(false)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Welcome Message */}
      {showWelcomeMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 max-w-lg w-full">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-200 mb-4">مرحباً بك في QLINE!</h3>
              <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 space-x-reverse text-green-300">
                  <Crown className="w-5 h-5" />
                  <span className="font-medium">فترة تجربة مجانية لمدة 14 يوم</span>
                </div>
                <p className="text-green-400 text-sm mt-2">
                  استمتع بجميع الميزات مجاناً لمدة أسبوعين
                </p>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                يُرجى إعداد ملف العمل لتحسين جودة الردود وتخصيص الروبوت الذكي حسب طبيعة عملك
              </p>
              <div className="flex space-x-3 space-x-reverse">
                <button
                  onClick={handleSetupBusiness}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  إعداد ملف العمل
                </button>
                <button
                  onClick={() => setShowWelcomeMessage(false)}
                  className="px-4 py-3 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-3 space-x-reverse">
                <img 
                  src="/qline.png" 
                  alt="QLINE Logo" 
                  className="h-8 w-auto"
                />
                <div>
                  <p className="text-xs text-gray-400">منصة الذكاء الاصطناعي للتسويق</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Subscription Status */}
              <div className="flex items-center space-x-2 space-x-reverse">
                {user.subscription === 'trial' ? (
                  <div className="flex items-center space-x-2 space-x-reverse bg-orange-900/30 text-orange-300 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">تجربة مجانية - {daysLeft} أيام</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 space-x-reverse bg-green-900/30 text-green-300 px-3 py-1 rounded-lg">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm capitalize">{user.subscription}</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors" />
                {notifications.some(n => !n.isRead) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-slate-600 shadow-sm"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-200">{user.name}</p>
                  <p className="text-gray-400 capitalize">
                    {user.subscription === 'trial' ? 'تجربة مجانية' : user.subscription}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-700/50 mb-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 space-x-reverse px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap min-w-fit ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/20'
                      : 'text-gray-400 hover:text-blue-400 hover:bg-slate-700/30'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-700/50 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-400 truncate">{stat.label}</p>
                        <p className="text-2xl lg:text-3xl font-bold text-gray-200 mt-1">{stat.value}</p>
                        <p className="text-sm text-emerald-400 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.color} flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-700/50">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">الإشعارات الأخيرة</h3>
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 space-x-reverse p-3 rounded-xl hover:bg-slate-700/30 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.isRead ? 'bg-gray-500' : 'bg-blue-400'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-200 truncate">{notification.titleAr}</p>
                        <p className="text-sm text-gray-400 line-clamp-2">{notification.messageAr}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.createdAt.toLocaleTimeString('ar')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-700/50">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">الصفحات المتصلة</h3>
                <div className="space-y-4">
                  {user.connectedPages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-700/30">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-200 truncate">{page.name}</p>
                        <p className="text-sm text-gray-400">{page.followers.toLocaleString()} متابع</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${page.isActive ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Bot Status Card */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-700/50">
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                <Bot className="w-5 h-5 text-blue-400 ml-2" />
                حالة الروبوت الذكي
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-bold text-green-400">نشط</p>
                  <p className="text-sm text-gray-400">الروبوت يعمل بشكل طبيعي</p>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-bold text-blue-400">234</p>
                  <p className="text-sm text-gray-400">رسالة تم التعامل معها</p>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-bold text-purple-400">67</p>
                  <p className="text-sm text-gray-400">توصية منتج</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'business' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-700/50">
            {businessProfile ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-200">معلومات العمل</h2>
                  <button
                    onClick={() => setShowBusinessSetup(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    تعديل
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-200 mb-2">اسم العمل</h3>
                    <p className="text-gray-400">{businessProfile.businessNameAr}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200 mb-2">نوع العمل</h3>
                    <p className="text-gray-400">{businessProfile.businessType}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-200 mb-2">الوصف</h3>
                    <p className="text-gray-400">{businessProfile.descriptionAr}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-blue-600 to-red-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-4">لم يتم إعداد ملف العمل بعد</h3>
                <p className="text-gray-400 mb-6">قم بإعداد ملف العمل لتحسين جودة الردود وتخصيص الروبوت الذكي</p>
                <button
                  onClick={() => setShowBusinessSetup(true)}
                  className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  إعداد ملف العمل الآن
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && <ProductManagement user={user} />}
        {activeTab === 'orders' && <OrderTracking user={user} />}
        {activeTab === 'social' && <SocialMediaIntegration user={user} />}
        {activeTab === 'database' && <DatabaseManager user={user} />}
        {activeTab === 'updates' && <UpdateManager user={user} />}
        {activeTab === 'analytics' && <Analytics user={user} />}
      </div>
    </div>
  );
};