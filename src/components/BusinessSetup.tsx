import React, { useState } from 'react';
import { Building, MapPin, Globe, Phone, Clock, Target, Lightbulb, Save, Languages } from 'lucide-react';
import { User, BusinessProfile } from '../types';

interface BusinessSetupProps {
  user: User;
  onComplete: (profile: BusinessProfile) => void;
}

export const BusinessSetup: React.FC<BusinessSetupProps> = ({ user, onComplete }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en'>('ar');
  const [profile, setProfile] = useState<Partial<BusinessProfile>>({
    userId: user.id,
    businessName: '',
    businessNameAr: '',
    businessType: '',
    description: '',
    descriptionAr: '',
    website: '',
    location: '',
    locationAr: '',
    phone: '',
    specialties: [],
    specialtiesAr: [],
    targetAudience: '',
    targetAudienceAr: '',
    businessGoals: [],
    businessGoalsAr: [],
    workingHours: {
      sunday: { open: '09:00', close: '17:00', isOpen: true },
      monday: { open: '09:00', close: '17:00', isOpen: true },
      tuesday: { open: '09:00', close: '17:00', isOpen: true },
      wednesday: { open: '09:00', close: '17:00', isOpen: true },
      thursday: { open: '09:00', close: '17:00', isOpen: true },
      friday: { open: '09:00', close: '17:00', isOpen: false },
      saturday: { open: '09:00', close: '17:00', isOpen: false },
    },
  });

  const businessTypes = [
    { value: 'medical', label: 'Medical Clinic', labelAr: 'عيادة طبية' },
    { value: 'engineering', label: 'Engineering Services', labelAr: 'خدمات هندسية' },
    { value: 'retail', label: 'Retail Store', labelAr: 'متجر تجزئة' },
    { value: 'restaurant', label: 'Restaurant', labelAr: 'مطعم' },
    { value: 'beauty', label: 'Beauty Salon', labelAr: 'صالون تجميل' },
    { value: 'education', label: 'Educational Services', labelAr: 'خدمات تعليمية' },
    { value: 'technology', label: 'Technology Services', labelAr: 'خدمات تقنية' },
    { value: 'other', label: 'Other', labelAr: 'أخرى' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile as BusinessProfile);
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'ar' ? 'en' : 'ar');
  };

  const isArabic = currentLanguage === 'ar';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 py-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-700/50 p-8">
          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-600/30 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-red-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-200 mb-2">
              {isArabic ? 'إعداد ملف العمل' : 'Business Profile Setup'}
            </h1>
            <p className="text-gray-400">
              {isArabic 
                ? 'أخبرنا عن عملك لنساعدك في إنشاء روبوت ذكي مخصص'
                : 'Tell us about your business to help create a customized AI bot'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* معلومات العمل الأساسية */}
            <div className="bg-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
                <Building className={`w-5 h-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                {isArabic ? 'معلومات العمل الأساسية' : 'Basic Business Information'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'اسم العمل' : 'Business Name'}
                  </label>
                  <input
                    type="text"
                    value={isArabic ? (profile.businessNameAr || '') : (profile.businessName || '')}
                    onChange={(e) => setProfile({
                      ...profile, 
                      [isArabic ? 'businessNameAr' : 'businessName']: e.target.value
                    })}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder={isArabic ? 'مثال: عيادة الدكتور أحمد' : 'Example: Dr. Ahmed Clinic'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'نوع العمل' : 'Business Type'}
                  </label>
                  <select
                    value={profile.businessType || ''}
                    onChange={(e) => setProfile({...profile, businessType: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">
                      {isArabic ? 'اختر نوع العمل' : 'Select Business Type'}
                    </option>
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {isArabic ? type.labelAr : type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'الموقع الإلكتروني' : 'Website'}
                  </label>
                  <input
                    type="url"
                    value={profile.website || ''}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="+964 XXX XXX XXXX"
                    required
                  />
                </div>
              </div>
            </div>

            {/* الوصف والتخصص */}
            <div className="bg-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
                <Lightbulb className={`w-5 h-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                {isArabic ? 'وصف العمل والتخصص' : 'Business Description & Specialties'}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'وصف العمل' : 'Business Description'}
                  </label>
                  <textarea
                    value={isArabic ? (profile.descriptionAr || '') : (profile.description || '')}
                    onChange={(e) => setProfile({
                      ...profile, 
                      [isArabic ? 'descriptionAr' : 'description']: e.target.value
                    })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder={isArabic 
                      ? 'اكتب وصفاً مفصلاً عن عملك وخدماتك...'
                      : 'Write a detailed description of your business and services...'
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'التخصصات (مفصولة بفاصلة)' : 'Specialties (comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={isArabic 
                      ? (profile.specialtiesAr?.join(', ') || '')
                      : (profile.specialties?.join(', ') || '')
                    }
                    onChange={(e) => setProfile({
                      ...profile, 
                      [isArabic ? 'specialtiesAr' : 'specialties']: e.target.value.split(', ')
                    })}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder={isArabic 
                      ? 'مثال: طب الأسنان, تجميل الأسنان, جراحة الفم'
                      : 'Example: Dentistry, Cosmetic Dentistry, Oral Surgery'
                    }
                  />
                </div>
              </div>
            </div>

            {/* معلومات الاتصال والموقع */}
            <div className="bg-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
                <MapPin className={`w-5 h-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                {isArabic ? 'معلومات الاتصال والموقع' : 'Contact & Location Information'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'الموقع' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={isArabic ? (profile.locationAr || '') : (profile.location || '')}
                    onChange={(e) => setProfile({
                      ...profile, 
                      [isArabic ? 'locationAr' : 'location']: e.target.value
                    })}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder={isArabic ? 'مثال: بغداد، الكرادة' : 'Example: Baghdad, Karrada'}
                    required
                  />
                </div>
              </div>
            </div>

            {/* الجمهور المستهدف والأهداف */}
            <div className="bg-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
                <Target className={`w-5 h-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                {isArabic ? 'الجمهور المستهدف والأهداف' : 'Target Audience & Goals'}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'الجمهور المستهدف' : 'Target Audience'}
                  </label>
                  <textarea
                    value={isArabic ? (profile.targetAudienceAr || '') : (profile.targetAudience || '')}
                    onChange={(e) => setProfile({
                      ...profile, 
                      [isArabic ? 'targetAudienceAr' : 'targetAudience']: e.target.value
                    })}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder={isArabic 
                      ? 'مثال: الأشخاص الذين يعانون من مشاكل الأسنان، الأعمار 25-55...'
                      : 'Example: People with dental problems, ages 25-55...'
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isArabic ? 'أهداف العمل (مفصولة بفاصلة)' : 'Business Goals (comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={isArabic 
                      ? (profile.businessGoalsAr?.join(', ') || '')
                      : (profile.businessGoals?.join(', ') || '')
                    }
                    onChange={(e) => setProfile({
                      ...profile, 
                      [isArabic ? 'businessGoalsAr' : 'businessGoals']: e.target.value.split(', ')
                    })}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder={isArabic 
                      ? 'مثال: زيادة المرضى, تحسين الخدمة, توسيع العيادة'
                      : 'Example: Increase patients, improve service, expand clinic'
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-red-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Save className="w-5 h-5" />
                <span>
                  {isArabic ? 'حفظ وإنشاء الروبوت الذكي' : 'Save & Create AI Bot'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};