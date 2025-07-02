import React, { useState } from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Send,
  Paperclip,
  Filter,
  Search,
  Eye
} from 'lucide-react';
import { AdminUser, SupportTicket, TicketResponse } from '../../types/admin';

interface SupportCenterProps {
  admin: AdminUser;
}

export const SupportCenter: React.FC<SupportCenterProps> = ({ admin }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-001',
      userId: 'user-1',
      userName: 'أحمد محمد',
      userEmail: 'ahmed@example.com',
      title: 'Bot not responding to messages',
      titleAr: 'الروبوت لا يرد على الرسائل',
      description: 'My AI bot stopped responding to Facebook messages since yesterday',
      descriptionAr: 'الروبوت الذكي توقف عن الرد على رسائل فيسبوك منذ أمس',
      category: 'technical',
      priority: 'high',
      status: 'open',
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:30:00'),
      responses: [],
      attachments: [],
    },
    {
      id: 'TKT-002',
      userId: 'user-2',
      userName: 'فاطمة علي',
      userEmail: 'fatima@example.com',
      title: 'Billing issue with subscription',
      titleAr: 'مشكلة في فاتورة الاشتراك',
      description: 'I was charged twice for my monthly subscription',
      descriptionAr: 'تم خصم مبلغ الاشتراك الشهري مرتين',
      category: 'billing',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: admin.id,
      assignedToName: admin.username,
      createdAt: new Date('2024-01-14T15:45:00'),
      updatedAt: new Date('2024-01-15T09:20:00'),
      responses: [
        {
          id: 'resp-1',
          ticketId: 'TKT-002',
          authorId: admin.id,
          authorName: admin.username,
          authorType: 'support',
          message: 'We are investigating this billing issue and will resolve it within 24 hours.',
          messageAr: 'نحن نحقق في مشكلة الفوترة هذه وسنحلها خلال 24 ساعة.',
          createdAt: new Date('2024-01-15T09:20:00'),
          isInternal: false,
        }
      ],
      attachments: [],
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newResponse, setNewResponse] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'جميع التذاكر', count: tickets.length },
    { value: 'open', label: 'مفتوحة', count: tickets.filter(t => t.status === 'open').length },
    { value: 'in_progress', label: 'قيد المعالجة', count: tickets.filter(t => t.status === 'in_progress').length },
    { value: 'resolved', label: 'محلولة', count: tickets.filter(t => t.status === 'resolved').length },
    { value: 'closed', label: 'مغلقة', count: tickets.filter(t => t.status === 'closed').length },
  ];

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'urgent', label: 'عاجل' },
    { value: 'high', label: 'عالي' },
    { value: 'medium', label: 'متوسط' },
    { value: 'low', label: 'منخفض' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'in_progress':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-100 text-orange-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleSendResponse = () => {
    if (!selectedTicket || !newResponse.trim()) return;

    const response: TicketResponse = {
      id: `resp-${Date.now()}`,
      ticketId: selectedTicket.id,
      authorId: admin.id,
      authorName: admin.username,
      authorType: 'support',
      message: newResponse,
      messageAr: newResponse,
      createdAt: new Date(),
      isInternal: false,
    };

    setTickets(tickets.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { 
            ...ticket, 
            responses: [...ticket.responses, response],
            status: 'in_progress',
            assignedTo: admin.id,
            assignedToName: admin.username,
            updatedAt: new Date()
          }
        : ticket
    ));

    setSelectedTicket({
      ...selectedTicket,
      responses: [...selectedTicket.responses, response],
      status: 'in_progress',
      assignedTo: admin.id,
      assignedToName: admin.username,
      updatedAt: new Date()
    });

    setNewResponse('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">مركز الدعم الفني</h2>
        <p className="text-gray-600 mt-1">إدارة تذاكر الدعم والشكاوي</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في التذاكر..."
                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.count})
                    </option>
                  ))}
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  selectedTicket?.id === ticket.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{ticket.titleAr}</h3>
                      <p className="text-sm text-gray-600">{ticket.userName} • {ticket.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'urgent' && 'عاجل'}
                      {ticket.priority === 'high' && 'عالي'}
                      {ticket.priority === 'medium' && 'متوسط'}
                      {ticket.priority === 'low' && 'منخفض'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span>
                        {ticket.status === 'open' && 'مفتوحة'}
                        {ticket.status === 'in_progress' && 'قيد المعالجة'}
                        {ticket.status === 'resolved' && 'محلولة'}
                        {ticket.status === 'closed' && 'مغلقة'}
                      </span>
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.descriptionAr}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>تم الإنشاء: {ticket.createdAt.toLocaleDateString('ar')}</span>
                  {ticket.assignedToName && (
                    <span>مُعيَّن إلى: {ticket.assignedToName}</span>
                  )}
                  <span>{ticket.responses.length} رد</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-fit">
              {/* Ticket Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{selectedTicket.titleAr}</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المستخدم:</span>
                    <span className="font-medium">{selectedTicket.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status === 'open' && 'مفتوحة'}
                      {selectedTicket.status === 'in_progress' && 'قيد المعالجة'}
                      {selectedTicket.status === 'resolved' && 'محلولة'}
                      {selectedTicket.status === 'closed' && 'مغلقة'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الأولوية:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority === 'urgent' && 'عاجل'}
                      {selectedTicket.priority === 'high' && 'عالي'}
                      {selectedTicket.priority === 'medium' && 'متوسط'}
                      {selectedTicket.priority === 'low' && 'منخفض'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Description */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">الوصف:</h4>
                <p className="text-sm text-gray-600">{selectedTicket.descriptionAr}</p>
              </div>

              {/* Responses */}
              <div className="p-6 border-b border-gray-200 max-h-96 overflow-y-auto">
                <h4 className="font-medium text-gray-900 mb-4">الردود ({selectedTicket.responses.length})</h4>
                <div className="space-y-4">
                  {selectedTicket.responses.map((response) => (
                    <div key={response.id} className={`p-3 rounded-lg ${
                      response.authorType === 'support' 
                        ? 'bg-blue-50 border-r-2 border-blue-500' 
                        : 'bg-gray-50 border-r-2 border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {response.authorName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {response.createdAt.toLocaleString('ar')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{response.messageAr}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Form */}
              <div className="p-6">
                <div className="space-y-4">
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="اكتب ردك هنا..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex items-center justify-between">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSendResponse}
                      disabled={!newResponse.trim()}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">اختر تذكرة لعرض التفاصيل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};