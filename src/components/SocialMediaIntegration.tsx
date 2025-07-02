import React, { useState } from 'react';
import { Facebook, Instagram, Plus, Settings, Activity, Users, MessageSquare, MessageCircle } from 'lucide-react';
import { User, FacebookPage } from '../types';

interface SocialMediaIntegrationProps {
  user: User;
}

export const SocialMediaIntegration: React.FC<SocialMediaIntegrationProps> = ({ user }) => {
  const [connectedPages, setConnectedPages] = useState<FacebookPage[]>(user.connectedPages);
  const [showAddPage, setShowAddPage] = useState(false);

  const platforms = [
    {
      name: 'Facebook',
      nameAr: 'فيسبوك',
      icon: Facebook,
      color: 'bg-blue-600',
      connected: connectedPages.length > 0,
      pages: connectedPages.filter(page => page.name.includes('Facebook') || true),
    },
    {
      name: 'Instagram',
      nameAr: 'انستغرام',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-600 to-pink-600',
      connected: false,
      pages: [],
    },
    {
      name: 'WhatsApp',
      nameAr: 'واتساب',
      icon: MessageCircle,
      color: 'bg-green-600',
      connected: false,
      pages: [],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">وسائل التواصل الاجتماعي</h2>
          <p className="text-gray-600 mt-1">ربط وإدارة حسابات وسائل التواصل الاجتماعي</p>
        </div>
        <button
          onClick={() => setShowAddPage(true)}
          className="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>ربط حساب جديد</span>
        </button>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`p-3 rounded-xl ${platform.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{platform.nameAr}</h3>
                    <p className="text-sm text-gray-600">
                      {platform.connected ? `${platform.pages.length} صفحة متصلة` : 'غير متصل'}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>

              {platform.connected ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{platform.pages.length}</p>
                      <p className="text-xs text-gray-600">صفحات</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">1.2K</p>
                      <p className="text-xs text-gray-600">رسائل</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">450</p>
                      <p className="text-xs text-gray-600">تعليقات</p>
                    </div>
                  </div>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors">
                    إدارة الصفحات
                  </button>
                </div>
              ) : (
                <button className={`w-full text-white py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${platform.color}`}>
                  ربط {platform.nameAr}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Connected Pages */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-6">الصفحات المتصلة</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {connectedPages.map((page) => (
            <div key={page.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">{page.name}</h4>
                  <p className="text-sm text-gray-600">{page.category}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {page.followers.toLocaleString()} متابع
                  </p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <div className={`w-3 h-3 rounded-full ${page.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">245</p>
                  <p className="text-xs text-gray-600">رسائل</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-1">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">89</p>
                  <p className="text-xs text-gray-600">تعليقات</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-1">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">12</p>
                  <p className="text-xs text-gray-600">طلبات</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600">حالة الروبوت:</span>
                <span className={`text-sm font-medium ${page.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {page.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Page Modal */}
      {showAddPage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">ربط حساب وسائل التواصل</h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center space-x-3 space-x-reverse bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors">
                <Facebook className="w-5 h-5" />
                <span>ربط صفحة فيسبوك</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-3 space-x-reverse bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:opacity-90 transition-opacity">
                <Instagram className="w-5 h-5" />
                <span>ربط حساب انستغرام</span>
              </button>

              <button className="w-full flex items-center justify-center space-x-3 space-x-reverse bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>ربط واتساب بزنس</span>
              </button>
            </div>

            <div className="flex items-center justify-end space-x-4 space-x-reverse mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddPage(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};