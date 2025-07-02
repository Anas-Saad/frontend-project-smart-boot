import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Code, 
  Palette, 
  Settings,
  Zap,
  Globe
} from 'lucide-react';
import { User } from '../types';

interface UpdateManagerProps {
  user: User;
}

interface Update {
  id: string;
  version: string;
  type: 'feature' | 'bugfix' | 'security' | 'ui';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  releaseDate: Date;
  isInstalled: boolean;
  isRequired: boolean;
  size: string;
}

export const UpdateManager: React.FC<UpdateManagerProps> = ({ user }) => {
  const [updates] = useState<Update[]>([
    {
      id: '1',
      version: '2.1.0',
      type: 'feature',
      title: 'TikTok Integration',
      titleAr: 'دعم تيك توك',
      description: 'Add support for TikTok comments and messages',
      descriptionAr: 'إضافة دعم تعليقات ورسائل تيك توك',
      releaseDate: new Date('2024-01-20'),
      isInstalled: false,
      isRequired: false,
      size: '15 MB'
    },
    {
      id: '2',
      version: '2.0.5',
      type: 'security',
      title: 'Security Patch',
      titleAr: 'تحديث أمني',
      description: 'Important security updates for data protection',
      descriptionAr: 'تحديثات أمنية مهمة لحماية البيانات',
      releaseDate: new Date('2024-01-18'),
      isInstalled: false,
      isRequired: true,
      size: '8 MB'
    },
    {
      id: '3',
      version: '2.0.4',
      type: 'ui',
      title: 'UI Improvements',
      titleAr: 'تحسينات الواجهة',
      description: 'Enhanced user interface and better Arabic support',
      descriptionAr: 'تحسين واجهة المستخدم ودعم أفضل للعربية',
      releaseDate: new Date('2024-01-15'),
      isInstalled: true,
      isRequired: false,
      size: '12 MB'
    }
  ]);

  const [customizations, setCustomizations] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    logo: '',
    companyName: '',
    companyNameAr: '',
    theme: 'light',
    language: 'ar'
  });

  const [installProgress, setInstallProgress] = useState<{[key: string]: number}>({});
  const [isInstalling, setIsInstalling] = useState<{[key: string]: boolean}>({});

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'security':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'ui':
        return <Palette className="w-5 h-5 text-purple-600" />;
      case 'bugfix':
        return <Code className="w-5 h-5 text-green-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-600" />;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'ui':
        return 'bg-purple-100 text-purple-800';
      case 'bugfix':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const installUpdate = async (updateId: string) => {
    setIsInstalling(prev => ({ ...prev, [updateId]: true }));
    setInstallProgress(prev => ({ ...prev, [updateId]: 0 }));

    // محاكاة عملية التثبيت
    const interval = setInterval(() => {
      setInstallProgress(prev => {
        const currentProgress = prev[updateId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsInstalling(prevInstalling => ({ ...prevInstalling, [updateId]: false }));
          return prev;
        }
        return { ...prev, [updateId]: currentProgress + 5 };
      });
    }, 200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">إدارة التحديثات والتخصيص</h2>
        <p className="text-gray-600 mt-1">تحديث النظام وتخصيص المظهر</p>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">حالة النظام</h3>
              <p className="text-sm text-gray-600">الإصدار الحالي: v2.0.4</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">النظام محدث</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">آخر فحص: منذ 5 دقائق</p>
          </div>
        </div>
      </div>

      {/* Available Updates */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-6">التحديثات المتاحة</h3>
        
        <div className="space-y-4">
          {updates.filter(update => !update.isInstalled).map((update) => {
            const isCurrentlyInstalling = isInstalling[update.id];
            const progress = installProgress[update.id] || 0;

            return (
              <div key={update.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getUpdateIcon(update.type)}
                    <div>
                      <h4 className="font-medium text-gray-900">{update.titleAr}</h4>
                      <p className="text-sm text-gray-500">الإصدار {update.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUpdateColor(update.type)}`}>
                      {update.type === 'feature' && 'ميزة جديدة'}
                      {update.type === 'security' && 'أمني'}
                      {update.type === 'ui' && 'واجهة'}
                      {update.type === 'bugfix' && 'إصلاح'}
                    </span>
                    {update.isRequired && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        مطلوب
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{update.descriptionAr}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span>الحجم: {update.size}</span>
                    <span className="mx-2">•</span>
                    <span>تاريخ الإصدار: {update.releaseDate.toLocaleDateString('ar')}</span>
                  </div>

                  {isCurrentlyInstalling ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-blue-600">{progress}%</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => installUpdate(update.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        update.isRequired
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>تثبيت</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customization Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
          <Palette className="w-5 h-5 ml-2" />
          تخصيص المظهر
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اللون الأساسي</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customizations.primaryColor}
                onChange={(e) => setCustomizations({...customizations, primaryColor: e.target.value})}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={customizations.primaryColor}
                onChange={(e) => setCustomizations({...customizations, primaryColor: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اللون الثانوي</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customizations.secondaryColor}
                onChange={(e) => setCustomizations({...customizations, secondaryColor: e.target.value})}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={customizations.secondaryColor}
                onChange={(e) => setCustomizations({...customizations, secondaryColor: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشركة (عربي)</label>
            <input
              type="text"
              value={customizations.companyNameAr}
              onChange={(e) => setCustomizations({...customizations, companyNameAr: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="اسم شركتك"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name (English)</label>
            <input
              type="text"
              value={customizations.companyName}
              onChange={(e) => setCustomizations({...customizations, companyName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Your Company Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الشعار</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المظهر</label>
            <select
              value={customizations.theme}
              onChange={(e) => setCustomizations({...customizations, theme: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="light">فاتح</option>
              <option value="dark">داكن</option>
              <option value="auto">تلقائي</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            <Settings className="w-4 h-4" />
            <span>حفظ التخصيصات</span>
          </button>
        </div>
      </div>

      {/* Update History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">سجل التحديثات</h3>
        
        <div className="space-y-3">
          {updates.filter(update => update.isInstalled).map((update) => (
            <div key={update.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{update.titleAr}</p>
                  <p className="text-sm text-gray-600">الإصدار {update.version}</p>
                </div>
              </div>
              <span className="text-sm text-green-600">مثبت</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};