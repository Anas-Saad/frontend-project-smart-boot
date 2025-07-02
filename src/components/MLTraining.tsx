import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Database, Zap, RefreshCw, CheckCircle } from 'lucide-react';
import { User, MLModel, BusinessProfile } from '../types';

interface MLTrainingProps {
  user: User;
  businessProfile: BusinessProfile;
}

export const MLTraining: React.FC<MLTrainingProps> = ({ user, businessProfile }) => {
  const [models, setModels] = useState<MLModel[]>([
    {
      id: '1',
      userId: user.id,
      modelType: 'recommendation',
      trainingData: [],
      accuracy: 0.85,
      lastTrained: new Date(),
      isActive: true,
      parameters: {
        learningRate: 0.01,
        epochs: 100,
        batchSize: 32,
      },
    },
    {
      id: '2',
      userId: user.id,
      modelType: 'response',
      trainingData: [],
      accuracy: 0.92,
      lastTrained: new Date(),
      isActive: true,
      parameters: {
        maxLength: 200,
        temperature: 0.7,
        topP: 0.9,
      },
    },
    {
      id: '3',
      userId: user.id,
      modelType: 'moderation',
      trainingData: [],
      accuracy: 0.88,
      lastTrained: new Date(),
      isActive: true,
      parameters: {
        threshold: 0.8,
        categories: ['spam', 'inappropriate', 'offensive'],
      },
    },
  ]);

  const [trainingProgress, setTrainingProgress] = useState<{[key: string]: number}>({});
  const [isTraining, setIsTraining] = useState<{[key: string]: boolean}>({});

  const modelDescriptions = {
    recommendation: {
      name: 'نموذج التوصيات',
      nameEn: 'Product Recommendation Model',
      description: 'يتعلم من تفاعلات العملاء لاقتراح المنتجات المناسبة',
      descriptionEn: 'Learns from customer interactions to suggest relevant products',
    },
    response: {
      name: 'نموذج الردود',
      nameEn: 'Response Generation Model',
      description: 'يتعلم كيفية الرد على استفسارات العملاء بطريقة طبيعية',
      descriptionEn: 'Learns to respond to customer inquiries naturally',
    },
    moderation: {
      name: 'نموذج المراقبة',
      nameEn: 'Content Moderation Model',
      description: 'يتعلم تحديد التعليقات غير المناسبة وإزالتها',
      descriptionEn: 'Learns to identify and remove inappropriate comments',
    },
  };

  const trainModel = async (modelId: string) => {
    setIsTraining(prev => ({ ...prev, [modelId]: true }));
    setTrainingProgress(prev => ({ ...prev, [modelId]: 0 }));

    // محاكاة عملية التدريب
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        const currentProgress = prev[modelId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsTraining(prevTraining => ({ ...prevTraining, [modelId]: false }));
          
          // تحديث دقة النموذج
          setModels(prevModels => 
            prevModels.map(model => 
              model.id === modelId 
                ? { ...model, accuracy: Math.min(0.98, model.accuracy + 0.02), lastTrained: new Date() }
                : model
            )
          );
          
          return prev;
        }
        return { ...prev, [modelId]: currentProgress + 2 };
      });
    }, 100);
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <TrendingUp className="w-6 h-6" />;
      case 'response':
        return <Brain className="w-6 h-6" />;
      case 'moderation':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Database className="w-6 h-6" />;
    }
  };

  const getModelColor = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'bg-blue-500';
      case 'response':
        return 'bg-green-500';
      case 'moderation':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">تدريب الذكاء الاصطناعي</h2>
        <p className="text-gray-600 mt-1">تطوير وتحسين نماذج الذكاء الاصطناعي لعملك</p>
      </div>

      {/* Training Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">حالة التدريب العامة</h3>
            <p className="text-sm text-gray-600">نماذج الذكاء الاصطناعي المخصصة لـ {businessProfile.businessNameAr}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{models.length}</p>
            <p className="text-sm text-gray-600">النماذج النشطة</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {Math.round(models.reduce((acc, model) => acc + model.accuracy, 0) / models.length * 100)}%
            </p>
            <p className="text-sm text-gray-600">متوسط الدقة</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {businessProfile.mlTrainingData?.customerInteractions?.length || 0}
            </p>
            <p className="text-sm text-gray-600">بيانات التدريب</p>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.map((model) => {
          const modelInfo = modelDescriptions[model.modelType as keyof typeof modelDescriptions];
          const isCurrentlyTraining = isTraining[model.id];
          const progress = trainingProgress[model.id] || 0;

          return (
            <div key={model.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${getModelColor(model.modelType)}`}>
                    {getModelIcon(model.modelType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{modelInfo.name}</h3>
                    <p className="text-sm text-gray-500">{modelInfo.nameEn}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${model.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{modelInfo.description}</p>

              {/* Model Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">الدقة:</span>
                  <span className="font-medium text-gray-900">{Math.round(model.accuracy * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">آخر تدريب:</span>
                  <span className="text-sm text-gray-500">{model.lastTrained.toLocaleDateString('ar')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">بيانات التدريب:</span>
                  <span className="text-sm text-gray-500">{model.trainingData.length} عنصر</span>
                </div>
              </div>

              {/* Training Progress */}
              {isCurrentlyTraining && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-600">جاري التدريب...</span>
                    <span className="text-sm text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => trainModel(model.id)}
                  disabled={isCurrentlyTraining}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                    isCurrentlyTraining
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isCurrentlyTraining ? 'animate-spin' : ''}`} />
                  <span>{isCurrentlyTraining ? 'جاري التدريب' : 'إعادة التدريب'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Training Tips */}
      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Zap className="w-5 h-5 text-yellow-600 ml-2" />
          نصائح لتحسين الأداء
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• كلما زادت التفاعلات مع العملاء، كلما تحسنت دقة النماذج</li>
          <li>• قم بمراجعة الردود التي ينتجها الروبوت وتصحيحها عند الحاجة</li>
          <li>• أضف منتجات جديدة بانتظام لتحسين نموذج التوصيات</li>
          <li>• راقب التعليقات المحذوفة للتأكد من دقة نموذج المراقبة</li>
        </ul>
      </div>
    </div>
  );
};