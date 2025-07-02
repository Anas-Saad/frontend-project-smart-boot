import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertTriangle, Smartphone, Languages } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (credentials: { username: string; password: string; twoFactorCode?: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en'>('ar');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isArabic = currentLanguage === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // محاكاة التحقق من بيانات الدخول
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        if (!showTwoFactor) {
          setShowTwoFactor(true);
          setLoading(false);
          return;
        }
        
        if (credentials.twoFactorCode === '123456') {
          onLogin(credentials);
        } else {
          setError(isArabic ? 'رمز التحقق غير صحيح' : 'Invalid verification code');
        }
      } else {
        setError(isArabic ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password');
      }
    } catch (err) {
      setError(isArabic ? 'حدث خطأ في الاتصال' : 'Connection error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 flex items-center justify-center p-4 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Background Security Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8">
          {/* Language Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 bg-slate-700/50 text-gray-300 px-3 py-2 rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span className="text-sm">{isArabic ? 'English' : 'العربية'}</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/qline.png" 
                alt="QLINE Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-200 mb-2">
              {isArabic ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-400">
              {isArabic ? 'دخول آمن للمشرفين فقط' : 'Secure access for administrators only'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-6 flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!showTwoFactor ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'اسم المستخدم' : 'Username'}
                  </label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder={isArabic ? 'أدخل اسم المستخدم' : 'Enter username'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      className={`w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm ${isArabic ? 'pl-12' : 'pr-12'}`}
                      placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isArabic ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className={`block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2 ${isArabic ? 'space-x-reverse' : ''}`}>
                  <Smartphone className="w-4 h-4" />
                  <span>
                    {isArabic ? 'رمز التحقق المرسل لهاتفك' : 'Verification code sent to your phone'}
                  </span>
                </label>
                <input
                  type="text"
                  value={credentials.twoFactorCode}
                  onChange={(e) => setCredentials({...credentials, twoFactorCode: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {isArabic ? 'أدخل الرمز المكون من 6 أرقام' : 'Enter the 6-digit code'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                isArabic ? 'جاري التحقق...' : 'Verifying...'
              ) : showTwoFactor ? (
                isArabic ? 'تأكيد الدخول' : 'Confirm Login'
              ) : (
                isArabic ? 'دخول' : 'Login'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-xl">
            <p className="text-yellow-300 text-xs text-center">
              🔒 {isArabic 
                ? 'جميع عمليات الدخول مسجلة ومراقبة لأغراض الأمان'
                : 'All login attempts are logged and monitored for security purposes'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};