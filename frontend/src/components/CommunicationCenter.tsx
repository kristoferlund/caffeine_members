import { useState } from 'react';
import { useMembers } from '../hooks/useQueries';

interface Message {
  id: string;
  subject: string;
  content: string;
  recipients: string[];
  sentDate: string;
  status: 'draft' | 'sent' | 'scheduled';
  deliveryCount: number;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'welcome' | 'reminder' | 'announcement' | 'newsletter';
}

interface CommunicationCenterProps {
  secretMode?: boolean;
}

export default function CommunicationCenter({ secretMode }: CommunicationCenterProps) {
  const { data: members } = useMembers();
  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'templates'>('compose');

  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    recipients: 'all' as 'all' | 'active' | 'custom',
    customRecipients: [] as string[],
    scheduleDate: '',
    scheduleTime: ''
  });

  const [messages] = useState<Message[]>([
    {
      id: '1',
      subject: 'Welcome to Our Association!',
      content: 'Dear members, welcome to our community...',
      recipients: ['all'],
      sentDate: '2025-06-01',
      status: 'sent',
      deliveryCount: 45
    },
    {
      id: '2',
      subject: 'Upcoming AGM Reminder',
      content: 'Don\'t forget about our Annual General Meeting...',
      recipients: ['active'],
      sentDate: '2025-06-03',
      status: 'sent',
      deliveryCount: 38
    },
    {
      id: '3',
      subject: 'Summer Event Planning',
      content: 'We\'re planning our summer barbecue...',
      recipients: ['all'],
      sentDate: '',
      status: 'draft',
      deliveryCount: 0
    }
  ]);

  const [templates] = useState<Template[]>([
    {
      id: '1',
      name: 'New Member Welcome',
      subject: 'Welcome to [Association Name]!',
      content: 'Dear [Member Name],\n\nWelcome to our association! We\'re excited to have you join our community...',
      category: 'welcome'
    },
    {
      id: '2',
      name: 'Event Reminder',
      subject: 'Reminder: [Event Name] on [Date]',
      content: 'Dear [Member Name],\n\nThis is a friendly reminder about our upcoming event...',
      category: 'reminder'
    },
    {
      id: '3',
      name: 'Monthly Newsletter',
      subject: '[Month] Newsletter - Association Updates',
      content: 'Dear Members,\n\nHere are the latest updates from our association...',
      category: 'newsletter'
    },
    {
      id: '4',
      name: 'General Announcement',
      subject: 'Important Announcement',
      content: 'Dear Members,\n\nWe have an important announcement to share...',
      category: 'announcement'
    }
  ]);

  const handleSendMessage = () => {
    // Simulate sending message
    console.log('Sending message:', newMessage);
    setNewMessage({
      subject: '',
      content: '',
      recipients: 'all',
      customRecipients: [],
      scheduleDate: '',
      scheduleTime: ''
    });
  };

  const handleUseTemplate = (template: Template) => {
    setNewMessage({
      ...newMessage,
      subject: template.subject,
      content: template.content
    });
    setActiveTab('compose');
  };

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'sent': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: Template['category']) => {
    switch (category) {
      case 'welcome': return '👋';
      case 'reminder': return '⏰';
      case 'announcement': return '📢';
      case 'newsletter': return '📰';
      default: return '📝';
    }
  };

  const renderComposeTab = () => (
    <div className="space-y-4">
      {/* Message Composition */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black mb-1 font-mono">Subject:</label>
            <input
              type="text"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
              className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
              placeholder="Enter message subject"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1 font-mono">Recipients:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setNewMessage({...newMessage, recipients: 'all'})}
                className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                  newMessage.recipients === 'all' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
                }`}
              >
                All Members ({members?.length || 0})
              </button>
              <button
                onClick={() => setNewMessage({...newMessage, recipients: 'active'})}
                className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                  newMessage.recipients === 'active' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
                }`}
              >
                Active Only ({Math.floor((members?.length || 0) * 0.85)})
              </button>
              <button
                onClick={() => setNewMessage({...newMessage, recipients: 'custom'})}
                className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                  newMessage.recipients === 'custom' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
                }`}
              >
                Custom Selection
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1 font-mono">Message Content:</label>
            <textarea
              value={newMessage.content}
              onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
              className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono h-32 resize-none"
              placeholder="Enter your message content here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1 font-mono">Schedule Date (Optional):</label>
              <input
                type="date"
                value={newMessage.scheduleDate}
                onChange={(e) => setNewMessage({...newMessage, scheduleDate: e.target.value})}
                className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black mb-1 font-mono">Schedule Time (Optional):</label>
              <input
                type="time"
                value={newMessage.scheduleTime}
                onChange={(e) => setNewMessage({...newMessage, scheduleTime: e.target.value})}
                className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSendMessage}
              className="win95-button bg-green-500 text-white px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-green-600 active:border-win95-sunken"
            >
              {newMessage.scheduleDate ? '📅 Schedule Message' : '📤 Send Now'}
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className="win95-button bg-win95-gray text-black px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken"
            >
              📝 Use Template
            </button>
            <button
              onClick={() => setNewMessage({subject: '', content: '', recipients: 'all', customRecipients: [], scheduleDate: '', scheduleTime: ''})}
              className="win95-button bg-win95-gray text-black px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="win95-window bg-white border-win95-sunken p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`px-2 py-1 text-xs font-bold font-mono text-white rounded ${getStatusColor(message.status)}`}>
                {message.status.toUpperCase()}
              </div>
              <h3 className="font-bold text-sm font-mono text-black">{message.subject}</h3>
            </div>
            <div className="text-xs font-mono text-gray-600">
              {message.sentDate && new Date(message.sentDate).toLocaleDateString()}
            </div>
          </div>

          <p className="text-sm font-mono text-black mb-3 line-clamp-2">
            {message.content}
          </p>

          <div className="flex items-center justify-between text-xs font-mono text-gray-600">
            <div className="flex items-center space-x-4">
              <span>📧 Recipients: {message.recipients.join(', ')}</span>
              {message.status === 'sent' && (
                <span>✅ Delivered: {message.deliveryCount}</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button className="win95-button bg-win95-gray text-black px-2 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken">
                📋 View Details
              </button>
              {message.status === 'draft' && (
                <button className="win95-button bg-blue-500 text-white px-2 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-blue-600 active:border-win95-sunken">
                  ✏️ Edit
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-black font-mono">Message Templates</h3>
        <button className="win95-button bg-green-500 text-white px-3 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-green-600 active:border-win95-sunken">
          ➕ Create Template
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="win95-window bg-white border-win95-sunken p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                <div>
                  <h4 className="font-bold text-sm font-mono text-black">{template.name}</h4>
                  <span className="text-xs font-mono text-gray-600 capitalize">{template.category}</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs font-bold font-mono text-black mb-1">Subject:</div>
              <div className="text-sm font-mono text-black bg-win95-gray border-win95-sunken p-2">
                {template.subject}
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs font-bold font-mono text-black mb-1">Preview:</div>
              <div className="text-sm font-mono text-black bg-win95-gray border-win95-sunken p-2 h-16 overflow-hidden">
                {template.content.substring(0, 100)}...
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleUseTemplate(template)}
                className="win95-button bg-win95-blue text-white px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-blue-600 active:border-win95-sunken"
              >
                📝 Use Template
              </button>
              <button className="win95-button bg-win95-gray text-black px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken">
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
          <div className="win95-title-buttons flex space-x-1 mr-3">
            <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
            <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
            <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
          </div>
          <span className="font-bold text-sm">📢 Communication Center</span>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-black font-mono mb-2">Member Communication Hub</h2>
          <p className="text-sm text-black font-mono">
            Send announcements, newsletters, and updates to your members with retro messaging style.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('compose')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'compose' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            ✏️ Compose
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'history' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            📋 History
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'templates' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            📝 Templates
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
          <div className="win95-title-buttons flex space-x-1 mr-3">
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
          </div>
          <span className="font-bold text-xs">
            {activeTab === 'compose' && '✏️ Compose Message'}
            {activeTab === 'history' && '📋 Message History'}
            {activeTab === 'templates' && '📝 Message Templates'}
          </span>
        </div>

        {activeTab === 'compose' && renderComposeTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="win95-window bg-white border-win95-sunken p-3 text-center">
          <div className={`text-2xl font-bold ${secretMode ? 'text-purple-600' : 'text-win95-blue'} font-mono`}>
            {messages.filter(m => m.status === 'sent').length}
          </div>
          <div className="text-xs font-mono text-black">Messages Sent</div>
        </div>
        <div className="win95-window bg-white border-win95-sunken p-3 text-center">
          <div className={`text-2xl font-bold ${secretMode ? 'text-green-400' : 'text-green-600'} font-mono`}>
            {messages.reduce((sum, m) => sum + m.deliveryCount, 0)}
          </div>
          <div className="text-xs font-mono text-black">Total Deliveries</div>
        </div>
        <div className="win95-window bg-white border-win95-sunken p-3 text-center">
          <div className={`text-2xl font-bold ${secretMode ? 'text-yellow-400' : 'text-yellow-600'} font-mono`}>
            {messages.filter(m => m.status === 'draft').length}
          </div>
          <div className="text-xs font-mono text-black">Draft Messages</div>
        </div>
        <div className="win95-window bg-white border-win95-sunken p-3 text-center">
          <div className={`text-2xl font-bold ${secretMode ? 'text-blue-400' : 'text-blue-600'} font-mono`}>
            {templates.length}
          </div>
          <div className="text-xs font-mono text-black">Templates</div>
        </div>
      </div>
    </div>
  );
}
