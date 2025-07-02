import React from 'react';
import { Facebook, Chrome } from 'lucide-react';

interface AuthButtonProps {
  provider: 'facebook' | 'google';
  onClick: () => void;
  loading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ provider, onClick, loading }) => {
  const config = {
    facebook: {
      icon: Facebook,
      text: 'متابعة مع فيسبوك',
      bgColor: 'bg-blue-700 hover:bg-blue-600 border border-blue-600',
      iconColor: 'text-white'
    },
    google: {
      icon: Chrome,
      text: 'متابعة مع جوجل',
      bgColor: 'bg-slate-200 hover:bg-slate-100 border border-slate-300',
      iconColor: 'text-slate-700'
    }
  };

  const { icon: Icon, text, bgColor, iconColor } = config[provider];

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${bgColor} ${provider === 'google' ? 'text-slate-700' : 'text-white'}`}
    >
      <Icon className={`w-5 h-5 ${iconColor}`} />
      {loading ? 'جاري الاتصال...' : text}
    </button>
  );
};