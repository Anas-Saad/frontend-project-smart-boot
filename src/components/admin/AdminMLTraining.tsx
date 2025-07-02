import React, { useState } from 'react';
import { 
  Brain, 
  Database, 
  Upload, 
  Download, 
  Settings, 
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  FileText,
  Globe,
  MessageSquare,
  Zap,
  Eye,
  BarChart3,
  Users,
  TrendingUp
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

interface AdminMLTrainingProps {
  admin: AdminUser;
}

interface TrainingDataset {
  id: string;
  name: string;
  nameAr: string;
  type: 'iraqi_dialect' | 'business_terms' | 'medical_terms' | 'general_arabic' | 'customer_interactions';
  description: string;
  descriptionAr: string;
  recordsCount: number;
  lastUpdated: Date;
  isActive: boolean;
  accuracy: number;
  trainingProgress: number;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  sources: string[];
}

interface TrainingSession {
  id: string;
  datasetId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  accuracy: number;
  loss: number;
  epochs: number;
  batchSize: number;
  learningRate: number;
}

export const AdminMLTraining: React.FC<AdminMLTrainingProps> = ({ admin }) => {
  const [datasets, setDatasets] = useState<TrainingDataset[]>([
    {
      id: '1',
      name: 'Iraqi Dialect Dataset',
      nameAr: 'مجموعة بيانات اللهجة العراقية',
      type: 'iraqi_dialect',
      description: 'Comprehensive Iraqi dialect terms and expressions for natural conversation',
      descriptionAr: 'مجموعة شاملة من مصطلحات وتعابير اللهجة العراقية للمحادثة الطبيعية',
      recordsCount: 25420,
      lastUpdated: new Date('2024-01-15'),
      isActive: true,
      accuracy: 0.94,
      trainingProgress: 100,
      dataQuality: 'excellent',
      sources: ['Social Media', 'Customer Conversations', 'Manual Input'],
    },
    {
      id: '2',
      name: 'Business Terms Dataset',
      nameAr: 'مجموعة بيانات المصطلحات التجارية',
      type: 'business_terms',
      description: 'Business and commercial terminology in Arabic with context',
      descriptionAr: 'المصطلحات التجارية والتسويقية باللغة العربية مع السياق',
      recordsCount: 18930,
      lastUpdated: new Date('2024-01-10'),
      isActive: true,
      accuracy: 0.91,
      trainingProgress: 100,
      dataQuality: 'good',
      sources: ['Business Documents', 'E-commerce Sites', 'Expert Input'],
    },
    {
      id: '3',
      name: 'Customer Interactions Dataset',
      nameAr: 'مجموعة بيانات تفاعلات العملاء',
      type: 'customer_interactions',
      description: 'Real customer conversations and support interactions',
      descriptionAr: 'محادثات العملاء الحقيقية وتفاعلات الدعم',
      recordsCount: 45670,
      lastUpdated: new Date('2024-01-18'),
      isActive: true,
      accuracy: 0.89,
      trainingProgress: 75,
      dataQuality: 'excellent',
      sources: ['Live Chat', 'Social Media', 'Email Support'],
    },
  ]);

  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([
    {
      id: 'session-1',
      datasetId: '3',
      startTime: new Date('2024-01-18T10:00:00'),
      status: 'running',
      progress: 75,
      accuracy: 0.89,
      loss: 0.23,
      epochs: 50,
      batchSize: 32,
      learningRate: 0.001,
    },
    {
      id: 'session-2',
      datasetId: '1',
      startTime: new Date('2024-01-15T14:30:00'),
      endTime: new Date('2024-01-15T18:45:00'),
      status: 'completed',
      progress: 100,
      accuracy: 0.94,
      loss: 0.12,
      epochs: 100,
      batchSize: 64,
      learningRate: 0.0005,
    },
  ]);

  const [selectedDataset, setSelectedDataset] = useState<TrainingDataset | null>(null);
  const [showDatasetDetails, setShowDatasetDetails] = useState(false);
  const [showTrainingConfig, setShowTrainingConfig] = useState(false);

  const datasetTypes = [
    { value: 'iraqi_dialect', label: 'Iraqi Dialect', labelAr: 'اللهجة العراقية', icon: Globe, color: 'text-green-600' },
    { value: 'business_terms', label: 'Business Terms', labelAr: 'مصطلحات تجارية', icon: Zap, color: 'text-blue-600' },
    { value: 'medical_terms', label: 'Medical Terms', labelAr: 'مصطلحات طبية', icon: MessageSquare, color: 'text-red-600' },
    { value: 'general_arabic', label: 'General Arabic', labelAr: 'عربي عام', icon: FileText, color: 'text-purple-600' },
    { value: 'customer_interactions', label: 'Customer Interactions', labelAr: 'تفاعلات العملاء', icon: Users, color: 'text-orange-600' },
  ];

  const getTypeInfo = (type: string) => {
    return datasetTypes.find(t => t.value === type) || datasetTypes[0];
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startTraining = (datasetId: string) => {
    setShowTrainingConfig(true);
    setSelectedDataset(datasets.find(d => d.id === datasetId) || null);
  };

  const viewDatasetDetails = (dataset: TrainingDataset) => {
    setSelectedDataset(dataset);
    setShowDatasetDetails(true);
  };

  const totalRecords = datasets.reduce((sum, dataset) => sum + dataset.recordsCount, 0);
  const averageAccuracy = datasets.reduce((sum, dataset) => sum + dataset.accuracy, 0) / datasets.length;
  const activeDatasets = datasets.filter(dataset => dataset.isActive).length;
  const runningTraining = trainingSessions.filter(session => session.status === 'running').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تدريب الذكاء الاصطناعي - إدارة متقدمة</h2>
          <p className="text-gray-600 mt-1">إدارة وتدريب مجموعات البيانات للذكاء الاصطناعي مع تحليلات مفصلة</p>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button className="flex items-center space-x-2 space-x-reverse bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span>رفع بيانات جديدة</span>
          </button>
          <button className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>تصدير النماذج</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي السجلات</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalRecords.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+2.5K هذا الأسبوع</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500">
              <Database className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مجموعات البيانات النشطة</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{activeDatasets}</p>
              <p className="text-sm text-gray-500 mt-1">من {datasets.length} إجمالي</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط الدقة</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{Math.round(averageAccuracy * 100)}%</p>
              <p className="text-sm text-purple-600 mt-1">+3% تحسن</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">جلسات التدريب النشطة</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{runningTraining}</p>
              <p className="text-sm text-gray-500 mt-1">جاري التدريب</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Training Sessions */}
      {trainingSessions.filter(s => s.status === 'running').length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 text-blue-600 ml-2 animate-spin" />
            جلسات التدريب النشطة
          </h3>
          <div className="space-y-4">
            {trainingSessions.filter(s => s.status === 'running').map((session) => {
              const dataset = datasets.find(d => d.id === session.datasetId);
              return (
                <div key={session.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{dataset?.nameAr}</h4>
                      <p className="text-sm text-gray-600">بدأ في: {session.startTime.toLocaleString('ar')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                      جاري التدريب
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{session.progress}%</p>
                      <p className="text-xs text-gray-600">التقدم</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{(session.accuracy * 100).toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">الدقة</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-600">{session.loss.toFixed(3)}</p>
                      <p className="text-xs text-gray-600">الخطأ</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">{session.epochs}</p>
                      <p className="text-xs text-gray-600">العصور</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${session.progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {datasets.map((dataset) => {
          const typeInfo = getTypeInfo(dataset.type);
          const TypeIcon = typeInfo.icon;

          return (
            <div key={dataset.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`p-3 rounded-xl bg-gray-100`}>
                    <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dataset.nameAr}</h3>
                    <p className="text-sm text-gray-500">{dataset.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(dataset.dataQuality)}`}>
                    {dataset.dataQuality === 'excellent' && 'ممتاز'}
                    {dataset.dataQuality === 'good' && 'جيد'}
                    {dataset.dataQuality === 'fair' && 'مقبول'}
                    {dataset.dataQuality === 'poor' && 'ضعيف'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataset.isActive}
                      onChange={() => {
                        setDatasets(datasets.map(d => 
                          d.id === dataset.id ? { ...d, isActive: !d.isActive } : d
                        ));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{dataset.descriptionAr}</p>

              {/* Dataset Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{dataset.recordsCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">سجل</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{Math.round(dataset.accuracy * 100)}%</p>
                  <p className="text-xs text-gray-600">دقة</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{dataset.trainingProgress}%</p>
                  <p className="text-xs text-gray-600">مدرب</p>
                </div>
              </div>

              {/* Data Sources */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2">مصادر البيانات:</p>
                <div className="flex flex-wrap gap-1">
                  {dataset.sources.map((source, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {source}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => startTraining(dataset.id)}
                  className="flex-1 flex items-center justify-center space-x-2 space-x-reverse bg-blue-600 text-white py-2 px-3 rounded-xl hover:bg-blue-700 transition-colors text-sm"
                >
                  <Play className="w-4 h-4" />
                  <span>تدريب</span>
                </button>
                <button
                  onClick={() => viewDatasetDetails(dataset)}
                  className="px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dataset Details Modal */}
      {showDatasetDetails && selectedDataset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{selectedDataset.nameAr}</h3>
              <button
                onClick={() => setShowDatasetDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dataset Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">معلومات المجموعة</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">النوع:</span>
                    <span className="mr-2 font-medium">{getTypeInfo(selectedDataset.type).labelAr}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">عدد السجلات:</span>
                    <span className="mr-2 font-medium">{selectedDataset.recordsCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">جودة البيانات:</span>
                    <span className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(selectedDataset.dataQuality)}`}>
                      {selectedDataset.dataQuality === 'excellent' && 'ممتاز'}
                      {selectedDataset.dataQuality === 'good' && 'جيد'}
                      {selectedDataset.dataQuality === 'fair' && 'مقبول'}
                      {selectedDataset.dataQuality === 'poor' && 'ضعيف'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">آخر تحديث:</span>
                    <span className="mr-2 font-medium">{selectedDataset.lastUpdated.toLocaleDateString('ar')}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">مقاييس الأداء</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">دقة النموذج</span>
                      <span className="font-medium">{Math.round(selectedDataset.accuracy * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${selectedDataset.accuracy * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">تقدم التدريب</span>
                      <span className="font-medium">{selectedDataset.trainingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${selectedDataset.trainingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">مصادر البيانات</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedDataset.sources.map((source, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-medium text-gray-900">{source}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.floor(selectedDataset.recordsCount / selectedDataset.sources.length).toLocaleString()} سجل تقريباً
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Data Preview */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">عينة من البيانات</h4>
              <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                <div className="space-y-3">
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-sm font-medium text-gray-900">المدخل: "شلونك؟ شكو ماكو؟"</p>
                    <p className="text-sm text-gray-600">المخرج: "أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟"</p>
                    <p className="text-xs text-gray-500">السياق: تحية عراقية تقليدية</p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-sm font-medium text-gray-900">المدخل: "أريد أشتري شيء"</p>
                    <p className="text-sm text-gray-600">المخرج: "بالطبع! ما نوع المنتج الذي تبحث عنه؟"</p>
                    <p className="text-xs text-gray-500">السياق: استفسار شراء عام</p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-sm font-medium text-gray-900">المدخل: "كم السعر؟"</p>
                    <p className="text-sm text-gray-600">المخرج: "يمكنني مساعدتك في معرفة الأسعار. أي منتج تقصد تحديداً؟"</p>
                    <p className="text-xs text-gray-500">السياق: استفسار عن الأسعار</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Guidelines */}
      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 ml-2" />
          إرشادات تدريب الذكاء الاصطناعي المتقدمة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">جودة البيانات:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• تأكد من تنوع البيانات وشمولها لجميع السيناريوهات</li>
              <li>• راجع البيانات يدوياً للتأكد من صحة التصنيف</li>
              <li>• أضف السياق للمحادثات لتحسين فهم النموذج</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">تحسين الأداء:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• استخدم بيانات حقيقية من تفاعلات العملاء</li>
              <li>• قم بتدريب النماذج بانتظام مع البيانات الجديدة</li>
              <li>• راقب مقاييس الأداء وأعد التدريب عند الحاجة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};