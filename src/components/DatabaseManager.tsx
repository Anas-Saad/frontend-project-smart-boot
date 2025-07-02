import React, { useState } from 'react';
import { Database, Server, Shield, Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react';
import { User } from '../types';

interface DatabaseManagerProps {
  user: User;
}

export const DatabaseManager: React.FC<DatabaseManagerProps> = ({ user }) => {
  const [backupStatus, setBackupStatus] = useState<'idle' | 'backing-up' | 'complete'>('idle');
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'restoring' | 'complete'>('idle');

  const databaseStats = {
    totalRecords: 15420,
    users: 1250,
    products: 340,
    orders: 2890,
    conversations: 8940,
    aiModels: 3,
    lastBackup: new Date('2024-01-15T10:30:00'),
    storageUsed: '2.4 GB',
    storageLimit: '10 GB',
  };

  const handleBackup = async () => {
    setBackupStatus('backing-up');
    // محاكاة عملية النسخ الاحتياطي
    setTimeout(() => {
      setBackupStatus('complete');
      setTimeout(() => setBackupStatus('idle'), 3000);
    }, 3000);
  };

  const handleRestore = async () => {
    setRestoreStatus('restoring');
    // محاكاة عملية الاستعادة
    setTimeout(() => {
      setRestoreStatus('complete');
      setTimeout(() => setRestoreStatus('idle'), 3000);
    }, 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">إدارة قاعدة البيانات</h2>
        <p className="text-gray-600 mt-1">مراقبة وإدارة بيانات النظام</p>
      </div>

      {/* Database Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">حالة قاعدة البيانات</h3>
            <p className="text-sm text-gray-600">MongoDB Atlas - الخادم السحابي</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{databaseStats.totalRecords.toLocaleString()}</p>
            <p className="text-sm text-gray-600">إجمالي السجلات</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{databaseStats.users.toLocaleString()}</p>
            <p className="text-sm text-gray-600">المستخدمين</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{databaseStats.products}</p>
            <p className="text-sm text-gray-600">المنتجات</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{databaseStats.orders.toLocaleString()}</p>
            <p className="text-sm text-gray-600">الطلبات</p>
          </div>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Server className="w-5 h-5 ml-2" />
          استخدام التخزين
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">المساحة المستخدمة:</span>
            <span className="font-medium text-gray-900">{databaseStats.storageUsed} من {databaseStats.storageLimit}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              style={{ width: '24%' }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">450 MB</p>
              <p className="text-sm text-gray-600">المحادثات</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">890 MB</p>
              <p className="text-sm text-gray-600">نماذج الذكاء الاصطناعي</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">320 MB</p>
              <p className="text-sm text-gray-600">الصور والملفات</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">740 MB</p>
              <p className="text-sm text-gray-600">بيانات أخرى</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Download className="w-5 h-5 ml-2" />
            النسخ الاحتياطي
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">آخر نسخة احتياطية:</span>
              <span className="text-sm text-gray-500">{databaseStats.lastBackup.toLocaleDateString('ar')}</span>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-800 mb-2">النسخ الاحتياطي التلقائي مفعل</p>
              <p className="text-xs text-blue-600">يتم إنشاء نسخة احتياطية كل 24 ساعة</p>
            </div>
            
            <button
              onClick={handleBackup}
              disabled={backupStatus !== 'idle'}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                backupStatus === 'idle'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                  : backupStatus === 'backing-up'
                  ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {backupStatus === 'idle' && <Download className="w-4 h-4" />}
              {backupStatus === 'backing-up' && <RefreshCw className="w-4 h-4 animate-spin" />}
              {backupStatus === 'complete' && <Shield className="w-4 h-4" />}
              <span>
                {backupStatus === 'idle' && 'إنشاء نسخة احتياطية'}
                {backupStatus === 'backing-up' && 'جاري الإنشاء...'}
                {backupStatus === 'complete' && 'تم بنجاح!'}
              </span>
            </button>
          </div>
        </div>

        {/* Restore */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="w-5 h-5 ml-2" />
            استعادة البيانات
          </h3>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">تحذير!</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    استعادة البيانات ستحذف جميع البيانات الحالية
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">اختر ملف النسخة الاحتياطية</label>
              <input
                type="file"
                accept=".backup,.json"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            
            <button
              onClick={handleRestore}
              disabled={restoreStatus !== 'idle'}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                restoreStatus === 'idle'
                  ? 'bg-orange-600 text-white hover:bg-orange-700 transform hover:scale-105'
                  : restoreStatus === 'restoring'
                  ? 'bg-orange-100 text-orange-600 cursor-not-allowed'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {restoreStatus === 'idle' && <Upload className="w-4 h-4" />}
              {restoreStatus === 'restoring' && <RefreshCw className="w-4 h-4 animate-spin" />}
              {restoreStatus === 'complete' && <Shield className="w-4 h-4" />}
              <span>
                {restoreStatus === 'idle' && 'استعادة البيانات'}
                {restoreStatus === 'restoring' && 'جاري الاستعادة...'}
                {restoreStatus === 'complete' && 'تم بنجاح!'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Database Tables */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">جداول قاعدة البيانات</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم الجدول</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">عدد السجلات</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحجم</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">آخر تحديث</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">users</td>
                <td className="px-4 py-4 text-sm text-gray-500">{databaseStats.users.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-500">45 MB</td>
                <td className="px-4 py-4 text-sm text-gray-500">منذ ساعتين</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">products</td>
                <td className="px-4 py-4 text-sm text-gray-500">{databaseStats.products}</td>
                <td className="px-4 py-4 text-sm text-gray-500">12 MB</td>
                <td className="px-4 py-4 text-sm text-gray-500">منذ 30 دقيقة</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">orders</td>
                <td className="px-4 py-4 text-sm text-gray-500">{databaseStats.orders.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-500">78 MB</td>
                <td className="px-4 py-4 text-sm text-gray-500">منذ 5 دقائق</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">conversations</td>
                <td className="px-4 py-4 text-sm text-gray-500">{databaseStats.conversations.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-500">450 MB</td>
                <td className="px-4 py-4 text-sm text-gray-500">منذ دقيقة</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">ai_models</td>
                <td className="px-4 py-4 text-sm text-gray-500">{databaseStats.aiModels}</td>
                <td className="px-4 py-4 text-sm text-gray-500">890 MB</td>
                <td className="px-4 py-4 text-sm text-gray-500">منذ ساعة</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};