import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

interface SystemOverviewProps {
  admin: AdminUser;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ admin }) => {
  const [systemStats] = useState({
    serverStatus: 'online',
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 32,
    networkLatency: 12,
    activeConnections: 1247,
    totalRequests: 89432,
    errorRate: 0.02,
    uptime: '99.98%',
    lastBackup: new Date('2024-01-15T02:00:00'),
  });

  const [services] = useState([
    { name: 'API Server', nameAr: 'خادم API', status: 'running', cpu: 25, memory: 45 },
    { name: 'Database', nameAr: 'قاعدة البيانات', status: 'running', cpu: 15, memory: 78 },
    { name: 'AI Engine', nameAr: 'محرك الذكاء الاصطناعي', status: 'running', cpu: 65, memory: 82 },
    { name: 'File Storage', nameAr: 'تخزين الملفات', status: 'running', cpu: 5, memory: 23 },
    { name: 'Message Queue', nameAr: 'طابور الرسائل', status: 'warning', cpu: 35, memory: 56 },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'stopped':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'stopped':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'bg-red-500';
    if (usage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">نظرة عامة على النظام</h2>
        <p className="text-gray-600 mt-1">مراقبة أداء الخوادم والخدمات</p>
      </div>

      {/* System Health */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">حالة النظام</h3>
              <p className="text-sm text-gray-600">جميع الخدمات تعمل بشكل طبيعي</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">متصل</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">وقت التشغيل: {systemStats.uptime}</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{systemStats.cpuUsage}%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">استخدام المعالج</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getUsageColor(systemStats.cpuUsage)}`}
                style={{ width: `${systemStats.cpuUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{systemStats.memoryUsage}%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">استخدام الذاكرة</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getUsageColor(systemStats.memoryUsage)}`}
                style={{ width: `${systemStats.memoryUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{systemStats.diskUsage}%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">استخدام القرص</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getUsageColor(systemStats.diskUsage)}`}
                style={{ width: `${systemStats.diskUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-orange-500">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{systemStats.networkLatency}ms</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">زمن الاستجابة</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-500"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-6">حالة الخدمات</h3>
        
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {getStatusIcon(service.status)}
                  <span className="mr-1">
                    {service.status === 'running' && 'يعمل'}
                    {service.status === 'warning' && 'تحذير'}
                    {service.status === 'error' && 'خطأ'}
                    {service.status === 'stopped' && 'متوقف'}
                  </span>
                </span>
                <div>
                  <p className="font-medium text-gray-900">{service.nameAr}</p>
                  <p className="text-sm text-gray-500">{service.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500">المعالج</p>
                  <p className="text-sm font-medium text-gray-900">{service.cpu}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">الذاكرة</p>
                  <p className="text-sm font-medium text-gray-900">{service.memory}%</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">إحصائيات الشبكة</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الاتصالات النشطة:</span>
              <span className="font-medium text-gray-900">{systemStats.activeConnections.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي الطلبات:</span>
              <span className="font-medium text-gray-900">{systemStats.totalRequests.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">معدل الأخطاء:</span>
              <span className="font-medium text-green-600">{systemStats.errorRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">النسخ الاحتياطية</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">آخر نسخة احتياطية:</span>
              <span className="font-medium text-gray-900">
                {systemStats.lastBackup.toLocaleDateString('ar')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">حالة النسخ:</span>
              <span className="font-medium text-green-600">مكتملة</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              إنشاء نسخة احتياطية الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};