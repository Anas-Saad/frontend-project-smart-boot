import React, { useState } from 'react';
import { Bot, Settings, Activity, MessageSquare, Shield, TrendingUp, Crown, Lock } from 'lucide-react';
import { User, AIBot } from '../types';

interface BotManagementProps {
  user: User;
}

export const BotManagement: React.FC<BotManagementProps> = ({ user }) => {
  // المستخدم يمكنه إنشاء بوت واحد فقط
  const [bot, setBot] = useState<AIBot | null>({
    id: '1',
    name: 'Customer Support Bot',
    nameAr: 'مساعد خدمة العملاء',
    description: 'Handles customer inquiries and support requests',
    descriptionAr: 'يتعامل مع استفسارات العملاء وطلبات الدعم',
    persona: 'general',
    customPersona: '',
    customPersonaAr: '',
    isActive: true,
    responseSettings: {
      autoReply: true,
      moderateComments: true,
      recommendProducts: true,
      responseDelay: 2,
      language: 'ar',
    },
    analytics: {
      messagesHandled: 234,
      commentsModerated: 45,
      productsRecommended: 67,
      conversionsGenerated: 12,
    },
    learningData: {
      businessContext: '',
      commonQuestions: [],
      productKnowledge: [],
      customerPreferences: [],
    },
  });

  const [showCreateBot, setShowCreateBot] = useState(false);
  const [selectedBot, setSelectedBot] = useState<AIBot | null>(null);

  const personaOptions = [
    { value: 'general', label: 'مساعد عام', labelEn: 'General Assistant', description: 'ذكي متعدد الاستخدامات لخدمة العملاء العامة' },
    { value: 'doctor', label: 'مساعد طبي', labelEn: 'Medical Assistant', description: 'ذكي متخصص في المجال الطبي والصحي' },
    { value: 'engineer', label: 'خبير تقني', labelEn: 'Technical Expert', description: 'متخصص في الهندسة والدعم التقني' },
    { value: 'shop_assistant', label: 'مساعد مبيعات', labelEn: 'Sales Assistant', description: 'خبير في المنتجات ومتخصص في المبيعات' },
    { value: 'custom', label: 'شخصية مخصصة', labelEn: 'Custom Persona', description: 'حدد شخصية الذكاء الاصطناعي الخاصة بك' },
  ];

  const toggleBot = () => {
    if (bot) {
      setBot({ ...bot, isActive: !bot.isActive });
    }
  };

  const handleCreateBot = () => {
    if (user.subscription === 'trial' || user.subscription === 'pro' || user.subscription === 'enterprise') {
      setShowCreateBot(true);
    }
  };

  const handleUpgrade = () => {
    alert('يرجى ترقية اشتراكك للوصول إلى هذه الميزة');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الروبوت الذكي</h2>
          <p className="text-gray-600 mt-1">تكوين وإدارة مساعدك الذكي</p>
        </div>
        
        {!bot && (
          <button
            onClick={handleCreateBot}
            className="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Bot className="w-5 h-5" />
            <span>إنشاء روبوت ذكي</span>
          </button>
        )}
      </div>

      {/* Subscription Notice */}
      {user.subscription === 'trial' && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 space-x-reverse mb-4">
            <Crown className="w-6 h-6 text-orange-600" />
            <h3 className="font-semibold text-orange-800">فترة تجربة مجانية</h3>
          </div>
          <p className="text-orange-700 mb-4">
            يمكنك إنشاء روبوت ذكي واحد خلال فترة التجربة المجانية. بعد انتهاء التجربة، ستحتاج لاشتراك مدفوع للمتابعة.
          </p>
          <button
            onClick={handleUpgrade}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            عرض خطط الاشتراك
          </button>
        </div>
      )}

      {/* Bot Card */}
      {bot ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`p-3 rounded-xl ${bot.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Bot className={`w-6 h-6 ${bot.isActive ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{bot.nameAr}</h3>
                <p className="text-sm text-gray-600">{bot.descriptionAr}</p>
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {personaOptions.find(p => p.value === bot.persona)?.label || 'مساعد عام'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setSelectedBot(bot)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bot.isActive}
                  onChange={toggleBot}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Bot Analytics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">الرسائل</p>
                <p className="font-semibold text-gray-900">{bot.analytics.messagesHandled}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Shield className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">المراقبة</p>
                <p className="font-semibold text-gray-900">{bot.analytics.commentsModerated}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">التوصيات</p>
                <p className="font-semibold text-gray-900">{bot.analytics.productsRecommended}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Activity className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">التحويلات</p>
                <p className="font-semibold text-gray-900">{bot.analytics.conversionsGenerated}</p>
              </div>
            </div>
          </div>

          {/* Bot Status */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">الحالة:</span>
              <span className={`font-medium ${bot.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {bot.isActive ? 'نشط' : 'غير نشط'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // No Bot Created Yet
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">لم يتم إنشاء روبوت ذكي بعد</h3>
          <p className="text-gray-600 mb-6">
            أنشئ روبوتك الذكي الأول لبدء إدارة خدمة العملاء تلقائياً
          </p>
          <button
            onClick={handleCreateBot}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            إنشاء روبوت ذكي الآن
          </button>
        </div>
      )}

      {/* Create Bot Modal */}
      {showCreateBot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">إنشاء روبوت ذكي جديد</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم الروبوت</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: مساعد خدمة العملاء"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم الروبوت (إنجليزي)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Example: Customer Support Bot"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="اكتب وصفاً لما سيقوم به هذا الروبوت"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شخصية الذكاء الاصطناعي</label>
                <div className="grid grid-cols-1 gap-3">
                  {personaOptions.map((persona) => (
                    <label key={persona.value} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="persona"
                        value={persona.value}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="mr-3">
                        <p className="font-medium text-gray-900">{persona.label}</p>
                        <p className="text-sm text-gray-600">{persona.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateBot(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  إنشاء الروبوت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Limitations Notice */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Lock className="w-5 h-5 text-blue-600 ml-2" />
          قيود الاشتراك
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• يمكن إنشاء روبوت ذكي واحد فقط لكل حساب</li>
          <li>• الروبوت متاح خلال فترة التجربة المجانية (14 يوم)</li>
          <li>• بعد انتهاء التجربة، يتطلب اشتراك مدفوع للمتابعة</li>
          <li>• جميع البيانات والإعدادات محفوظة حتى لو انتهت التجربة</li>
        </ul>
      </div>
    </div>
  );
};