import React from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, ShoppingBag, Target } from 'lucide-react';
import { User } from '../types';

interface AnalyticsProps {
  user: User;
}

export const Analytics: React.FC<AnalyticsProps> = ({ user }) => {
  const metrics = [
    {
      label: 'Total Messages Handled',
      value: '2,847',
      change: '+23.5%',
      icon: MessageSquare,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      label: 'Products Recommended',
      value: '1,234',
      change: '+18.2%',
      icon: ShoppingBag,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      label: 'Conversion Rate',
      value: '12.8%',
      change: '+5.4%',
      icon: Target,
      color: 'bg-purple-500',
      trend: 'up'
    },
    {
      label: 'Customer Engagement',
      value: '89.2%',
      change: '+12.1%',
      icon: Users,
      color: 'bg-orange-500',
      trend: 'up'
    },
  ];

  const weeklyData = [
    { day: 'Mon', messages: 45, orders: 8, revenue: 420 },
    { day: 'Tue', messages: 52, orders: 12, revenue: 680 },
    { day: 'Wed', messages: 38, orders: 6, revenue: 320 },
    { day: 'Thu', messages: 61, orders: 15, revenue: 890 },
    { day: 'Fri', messages: 55, orders: 11, revenue: 620 },
    { day: 'Sat', messages: 48, orders: 9, revenue: 540 },
    { day: 'Sun', messages: 42, orders: 7, revenue: 380 },
  ];

  const topProducts = [
    { name: 'Premium Health Supplements', sold: 45, revenue: 2247.55 },
    { name: 'Smart Fitness Tracker', sold: 23, revenue: 4599.77 },
    { name: 'Organic Skincare Set', sold: 34, revenue: 2719.66 },
    { name: 'Professional Chef Knife', sold: 18, revenue: 2339.82 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600 mt-1">Track your AI bot performance and business metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600 mt-1">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Performance</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {weeklyData.map((data, index) => (
              <div key={data.day} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{data.day}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{data.messages} messages</p>
                    <p className="text-sm text-gray-600">{data.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${data.revenue}</p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(data.revenue / 1000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sold} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bot Performance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Bot Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-blue-600">95.2%</p>
            <p className="text-sm text-blue-600 font-medium">Response Rate</p>
            <p className="text-xs text-gray-600 mt-1">Messages answered automatically</p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-600">2.3s</p>
            <p className="text-sm text-green-600 font-medium">Avg Response Time</p>
            <p className="text-xs text-gray-600 mt-1">Average time to respond</p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-purple-600">87.5%</p>
            <p className="text-sm text-purple-600 font-medium">Satisfaction Rate</p>
            <p className="text-xs text-gray-600 mt-1">Customer satisfaction score</p>
          </div>
        </div>
      </div>
    </div>
  );
};