import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Globe, 
  Activity,
  UserX,
  Ban,
  CheckCircle,
  XCircle,
  MapPin,
  Clock
} from 'lucide-react';
import { AdminUser, SecurityLog } from '../../types/admin';

interface SecurityMonitorProps {
  admin: AdminUser;
}

export const SecurityMonitor: React.FC<SecurityMonitorProps> = ({ admin }) => {
  const [securityLogs] = useState<SecurityLog[]>([
    {
      id: '1',
      userId: 'user-123',
      action: 'Failed Login Attempt',
      actionAr: 'محاولة دخول فاشلة',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Baghdad, Iraq',
      success: false,
      details: { attempts: 5, reason: 'Invalid password' },
      timestamp: new Date('2024-01-15T10:30:00'),
      riskLevel: 'high',
    },
    {
      id: '2',
      userId: 'user-456',
      action: 'Successful Login',
      actionAr: 'دخول ناجح',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      location: 'Dubai, UAE',
      success: true,
      details: { method: '2FA' },
      timestamp: new Date('2024-01-15T09:45:00'),
      riskLevel: 'low',
    },
    {
      id: '3',
      action: 'Suspicious API Request',
      actionAr: 'طلب API مشبوه',
      ipAddress: '203.0.113.0',
      userAgent: 'curl/7.68.0',
      location: 'Unknown',
      success: false,
      details: { endpoint: '/api/users', rate_limit_exceeded: true },
      timestamp: new Date('2024-01-15T08:20:00'),
      riskLevel: 'critical',
    },
    {
      id: '4',
      userId: 'user-789',
      action: 'Data Export',
      actionAr: 'تصدير البيانات',
      ipAddress: '172.16.0.10',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      location: 'London, UK',
      success: true,
      details: { records_count: 150, export_type: 'CSV' },
      timestamp: new Date('2024-01-15T07:15:00'),
      riskLevel: 'medium',
    },
  ]);

  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');

  const timeRanges = [
    { value: '1h', label: 'آخر ساعة' },
    { value: '24h', label: 'آخر 24 ساعة' },
    { value: '7d', label: 'آخر 7 أيام' },
    { value: '30d', label: 'آخر 30 يوم' },
  ];

  const riskLevels = [
    { value: 'all', label: 'جميع المستويات' },
    { value: 'critical', label: 'حرج' },
    { value: 'high', label: 'عالي' },
    { value: 'medium', label: 'متوسط' },
    { value: 'low', label: 'منخفض' },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <XCircle className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Eye className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredLogs = securityLogs.filter(log => {
    const riskMatch = selectedRiskLevel === 'all' || log.riskLevel === selectedRiskLevel;
    // يمكن إضافة فلترة حسب الوقت هنا
    return riskMatch;
  });

  const securityStats = {
    totalEvents: securityLogs.length,
    criticalEvents: securityLogs.filter(log => log.riskLevel === 'critical').length,
    failedLogins: securityLogs.filter(log => !log.success && log.action.includes('Login')).length,
    blockedIPs: 12,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">مراقبة الأمان</h2>
        <p className="text-gray-600 mt-1">مراقبة الأنشطة المشبوهة وسجلات الأمان</p>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الأحداث</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{securityStats.totalEvents}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">أحداث حرجة</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{securityStats.criticalEvents}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">محاولات دخول فاشلة</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{securityStats.failedLogins}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500">
              <UserX className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">عناوين IP محظورة</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{securityStats.blockedIPs}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500">
              <Ban className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الفترة الزمنية</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مستوى المخاطر</label>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {riskLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Security Logs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">سجلات الأمان</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوقت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النشاط</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عنوان IP</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموقع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مستوى المخاطر</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{log.timestamp.toLocaleString('ar')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.actionAr}</div>
                    <div className="text-xs text-gray-500">{log.action}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.userId || 'غير محدد'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-mono text-gray-900">{log.ipAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{log.location || 'غير معروف'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.success ? (
                        <>
                          <CheckCircle className="w-3 h-3 ml-1" />
                          نجح
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 ml-1" />
                          فشل
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(log.riskLevel)}`}>
                      {getRiskIcon(log.riskLevel)}
                      <span className="mr-1">
                        {log.riskLevel === 'critical' && 'حرج'}
                        {log.riskLevel === 'high' && 'عالي'}
                        {log.riskLevel === 'medium' && 'متوسط'}
                        {log.riskLevel === 'low' && 'منخفض'}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">إجراءات الأمان السريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors">
            <Ban className="w-5 h-5" />
            <span>حظر عنوان IP</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors">
            <Lock className="w-5 h-5" />
            <span>قفل حساب مستخدم</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors">
            <Shield className="w-5 h-5" />
            <span>تفعيل وضع الحماية</span>
          </button>
        </div>
      </div>
    </div>
  );
};