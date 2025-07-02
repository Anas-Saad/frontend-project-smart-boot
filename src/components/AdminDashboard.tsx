import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  Activity,
  Database,
  Settings,
  LogOut,
  Bell,
  Eye,
  Lock,
  TrendingUp,
  Server,
  UserCheck,
  Languages,
  Brain
} from 'lucide-react';
import { AdminUser, SupportTicket, SecurityLog, SystemAlert, USER_ROLES } from '../types/admin';
import { UserManagement } from './admin/UserManagement';
import { SupportCenter } from './admin/SupportCenter';
import { SecurityMonitor } from './admin/SecurityMonitor';
import { SystemOverview } from './admin/SystemOverview';
import { AdminMLTraining } from './admin/AdminMLTraining';

interface AdminDashboardProps {
  admin: AdminUser;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en'>('ar');
  const [notifications] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'security',
      severity: 'warning',
      title: 'Suspicious Login Attempt',
      titleAr: 'محاولة دخول مشبوهة',
      message: 'Multiple failed login attempts from IP 192.168.1.100',
      messageAr: 'محاولات دخول فاشلة متعددة من العنوان 192.168.1.100',
      isResolved: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'performance',
      severity: 'info',
      title: 'High Server Load',
      titleAr: 'حمولة خادم عالية',
      message: 'Server CPU usage is at 85%',
      messageAr: 'استخدام معالج الخادم وصل إلى 85%',
      isResolved: false,
      createdAt: new Date(),
    },
  ]);

  const isArabic = currentLanguage === 'ar';

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', labelEn: 'Overview', icon: Activity, permission: 'read' },
    { id: 'users', label: 'إدارة المستخدمين', labelEn: 'User Management', icon: Users, permission: 'users' },
    { id: 'support', label: 'مركز الدعم', labelEn: 'Support Center', icon: MessageSquare, permission: 'support' },
    { id: 'ml-training', label: 'تدريب الذكاء الاصطناعي', labelEn: 'ML Training', icon: Brain, permission: 'admin' },
    { id: 'security', label: 'مراقبة الأمان', labelEn: 'Security Monitor', icon: Shield, permission: 'admin' },
    { id: 'system', label: 'النظام', labelEn: 'System', icon: Server, permission: 'admin' },
  ];

  const stats = [
    { 
      label: 'إجمالي المستخدمين', 
      labelEn: 'Total Users',
      value: '2,847', 
      change: '+12%', 
      icon: Users, 
      color: 'bg-blue-600' 
    },
    { 
      label: 'تذاكر الدعم المفتوحة', 
      labelEn: 'Open Support Tickets',
      value: '23', 
      change: '-8%', 
      icon: MessageSquare, 
      color: 'bg-slate-600' 
    },
    { 
      label: 'تنبيهات الأمان', 
      labelEn: 'Security Alerts',
      value: '5', 
      change: '+2', 
      icon: AlertTriangle, 
      color: 'bg-red-600' 
    },
    { 
      label: 'معدل الاستجابة', 
      labelEn: 'Response Rate',
      value: '99.8%', 
      change: '+0.2%', 
      icon: TrendingUp, 
      color: 'bg-blue-700' 
    },
  ];

  const hasPermission = (permission: string) => {
    if (admin.role === 'super_admin') return true;
    
    const userRole = USER_ROLES.find(role => role.id === admin.role);
    if (!userRole) return false;
    
    return userRole.permissions.some(p => 
      p.category === permission || p.actions.includes(permission as any)
    );
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'ar' ? 'en' : 'ar');
  };

  const getRoleDisplayName = (role: string) => {
    const roleData = USER_ROLES.find(r => r.id === role);
    return roleData ? (isArabic ? roleData.nameAr : roleData.name) : role;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className={`flex items-center space-x-4 ${isArabic ? 'space-x-reverse' : ''}`}>
              <div className="flex items-center space-x-3 space-x-reverse">
                <img 
                  src="/qline.png" 
                  alt="QLINE Logo" 
                  className="h-8 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-200">
                    {isArabic ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
                  </h1>
                  <p className="text-xs text-gray-400">
                    {isArabic ? 'مراقبة وإدارة النظام' : 'System Monitoring & Management'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`flex items-center space-x-4 ${isArabic ? 'space-x-reverse' : ''}`}>
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-slate-700/50"
              >
                <Languages className="w-5 h-5" />
                <span className="text-sm">{isArabic ? 'EN' : 'عر'}</span>
              </button>

              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-red-400 transition-colors" />
                {notifications.some(n => !n.isResolved) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              
              <div className={`flex items-center space-x-3 ${isArabic ? 'space-x-reverse' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-blue-700 rounded-full flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-200">{admin.username}</p>
                  <p className="text-gray-400">{getRoleDisplayName(admin.role)}</p>
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
          <div className="flex overflow-x-auto">
            {tabs.filter(tab => hasPermission(tab.permission)).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 ${isArabic ? 'space-x-reverse' : ''} px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-red-400 border-b-2 border-red-400 bg-red-900/20'
                      : 'text-gray-400 hover:text-red-400 hover:bg-slate-700/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{isArabic ? tab.label : tab.labelEn}</span>
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
                      <div>
                        <p className="text-sm font-medium text-gray-400">
                          {isArabic ? stat.label : stat.labelEn}
                        </p>
                        <p className="text-3xl font-bold text-gray-200 mt-1">{stat.value}</p>
                        <p className="text-sm text-emerald-400 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* System Alerts */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-700/50">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                {isArabic ? 'تنبيهات النظام' : 'System Alerts'}
              </h3>
              <div className="space-y-4">
                {notifications.slice(0, 5).map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-xl border-r-4 ${
                    alert.severity === 'critical' ? 'bg-red-900/30 border-red-500' :
                    alert.severity === 'warning' ? 'bg-yellow-900/30 border-yellow-500' :
                    alert.severity === 'error' ? 'bg-red-900/30 border-red-400' :
                    'bg-slate-700/30 border-slate-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-200">
                          {isArabic ? alert.titleAr : alert.title}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {isArabic ? alert.messageAr : alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {alert.createdAt.toLocaleString(isArabic ? 'ar' : 'en')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'critical' ? 'bg-red-900/50 text-red-300' :
                        alert.severity === 'warning' ? 'bg-yellow-900/50 text-yellow-300' :
                        alert.severity === 'error' ? 'bg-red-900/50 text-red-300' :
                        'bg-slate-700/50 text-slate-300'
                      }`}>
                        {isArabic ? (
                          alert.severity === 'critical' ? 'حرج' :
                          alert.severity === 'warning' ? 'تحذير' :
                          alert.severity === 'error' ? 'خطأ' : 'معلومات'
                        ) : (
                          alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && <UserManagement admin={admin} />}
        {activeTab === 'support' && <SupportCenter admin={admin} />}
        {activeTab === 'ml-training' && <AdminMLTraining admin={admin} />}
        {activeTab === 'security' && <SecurityMonitor admin={admin} />}
        {activeTab === 'system' && <SystemOverview admin={admin} />}
      </div>
    </div>
  );
};