import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Crown, 
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { AdminUser } from '../../types/admin';
import { User } from '../../types';

interface UserManagementProps {
  admin: AdminUser;
}

export const UserManagement: React.FC<UserManagementProps> = ({ admin }) => {
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'أحمد محمد علي',
      email: 'ahmed@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      age: 32,
      gender: 'male',
      provider: 'facebook',
      token: 'token_123',
      connectedPages: [
        {
          id: 'page_1',
          name: 'متجر أحمد للإلكترونيات',
          category: 'Technology',
          followers: 15420,
          isActive: true,
          accessToken: 'page_token_1',
        }
      ],
      subscription: 'pro',
      businessType: 'electronics',
      businessDescription: 'متجر متخصص في بيع الأجهزة الإلكترونية',
      website: 'https://ahmed-electronics.com',
      location: 'بغداد، العراق',
      targetAudience: 'الشباب المهتمين بالتكنولوجيا',
      businessGoals: ['زيادة المبيعات', 'توسيع قاعدة العملاء'],
      language: 'ar',
    },
    {
      id: '2',
      name: 'فاطمة حسن',
      email: 'fatima@example.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      age: 28,
      gender: 'female',
      provider: 'google',
      token: 'token_456',
      connectedPages: [
        {
          id: 'page_2',
          name: 'عيادة د. فاطمة للأسنان',
          category: 'Medical',
          followers: 8930,
          isActive: true,
          accessToken: 'page_token_2',
        }
      ],
      subscription: 'enterprise',
      businessType: 'medical',
      businessDescription: 'عيادة متخصصة في طب وجراحة الأسنان',
      website: 'https://dr-fatima-dental.com',
      location: 'دبي، الإمارات',
      targetAudience: 'جميع الأعمار',
      businessGoals: ['تحسين الخدمة', 'زيادة الحجوزات'],
      language: 'ar',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const subscriptionOptions = [
    { value: 'all', label: 'جميع الاشتراكات' },
    { value: 'free', label: 'مجاني' },
    { value: 'pro', label: 'احترافي' },
    { value: 'enterprise', label: 'مؤسسي' },
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'غير نشط' },
    { value: 'suspended', label: 'معلق' },
  ];

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'free':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionIcon = (subscription: string) => {
    switch (subscription) {
      case 'enterprise':
        return <Crown className="w-4 h-4" />;
      case 'pro':
        return <Shield className="w-4 h-4" />;
      default:
        return <UserCheck className="w-4 h-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubscription = filterSubscription === 'all' || user.subscription === filterSubscription;
    // يمكن إضافة فلترة حسب الحالة هنا
    return matchesSearch && matchesSubscription;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.connectedPages.some(p => p.isActive)).length,
    pro: users.filter(u => u.subscription === 'pro').length,
    enterprise: users.filter(u => u.subscription === 'enterprise').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h2>
          <p className="text-gray-600 mt-1">مراقبة وإدارة حسابات المستخدمين</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>إضافة مستخدم</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{userStats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المستخدمين النشطين</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{userStats.active}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">اشتراك احترافي</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{userStats.pro}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">اشتراك مؤسسي</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{userStats.enterprise}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <select
            value={filterSubscription}
            onChange={(e) => setFilterSubscription(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {subscriptionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نوع العمل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاشتراك</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصفحات المتصلة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموقع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {user.businessType === 'medical' && 'طبي'}
                      {user.businessType === 'electronics' && 'إلكترونيات'}
                      {user.businessType === 'restaurant' && 'مطعم'}
                      {user.businessType === 'retail' && 'تجارة'}
                      {user.businessType === 'other' && 'أخرى'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(user.subscription)}`}>
                      {getSubscriptionIcon(user.subscription)}
                      <span className="mr-1 capitalize">
                        {user.subscription === 'free' && 'مجاني'}
                        {user.subscription === 'pro' && 'احترافي'}
                        {user.subscription === 'enterprise' && 'مؤسسي'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span>{user.connectedPages.length}</span>
                      <div className="flex space-x-1">
                        {user.connectedPages.slice(0, 3).map((page, index) => (
                          <div 
                            key={page.id}
                            className={`w-2 h-2 rounded-full ${page.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.location || 'غير محدد'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};