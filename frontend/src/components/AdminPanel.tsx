import { useState } from 'react';
import { useMembers } from '../hooks/useQueries';

interface AdminPanelProps {
  userRole: 'admin' | 'moderator' | 'member';
  onRoleChange: (role: 'admin' | 'moderator' | 'member') => void;
  secretMode?: boolean;
}

interface SystemLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  level: 'info' | 'warning' | 'error';
}

interface SystemSetting {
  key: string;
  label: string;
  value: string | boolean | number;
  type: 'text' | 'boolean' | 'number' | 'select';
  options?: string[];
}

export default function AdminPanel({ userRole, onRoleChange, secretMode }: AdminPanelProps) {
  const { data: members } = useMembers();
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'logs' | 'security'>('users');

  const [systemLogs] = useState<SystemLog[]>([
    {
      id: '1',
      timestamp: '2025-06-05 14:30:22',
      action: 'Member Registration',
      user: 'System',
      details: 'New member john.doe@example.com registered successfully',
      level: 'info'
    },
    {
      id: '2',
      timestamp: '2025-06-05 14:25:15',
      action: 'Data Export',
      user: 'admin@association.org',
      details: 'Member data exported as CSV (150 records)',
      level: 'info'
    },
    {
      id: '3',
      timestamp: '2025-06-05 14:20:08',
      action: 'Login Attempt',
      user: 'unknown@suspicious.com',
      details: 'Failed login attempt from IP 192.168.1.100',
      level: 'warning'
    },
    {
      id: '4',
      timestamp: '2025-06-05 14:15:33',
      action: 'System Backup',
      user: 'System',
      details: 'Automated daily backup completed successfully',
      level: 'info'
    },
    {
      id: '5',
      timestamp: '2025-06-05 14:10:45',
      action: 'Permission Change',
      user: 'admin@association.org',
      details: 'User role changed from member to moderator',
      level: 'warning'
    }
  ]);

  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([
    { key: 'siteName', label: 'Association Name', value: 'Local Community Association', type: 'text' },
    { key: 'maxMembers', label: 'Maximum Members', value: 1000, type: 'number' },
    { key: 'enableRegistration', label: 'Enable Public Registration', value: true, type: 'boolean' },
    { key: 'emailNotifications', label: 'Email Notifications', value: true, type: 'boolean' },
    { key: 'sessionTimeout', label: 'Session Timeout (minutes)', value: 30, type: 'number' },
    { key: 'theme', label: 'Default Theme', value: 'windows95', type: 'select', options: ['windows95', 'modern', 'dark'] },
    { key: 'backupFrequency', label: 'Backup Frequency', value: 'daily', type: 'select', options: ['hourly', 'daily', 'weekly'] },
    { key: 'debugMode', label: 'Debug Mode', value: false, type: 'boolean' }
  ]);

  const updateSetting = (key: string, value: string | boolean | number) => {
    setSystemSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const getLogLevelColor = (level: SystemLog['level']) => {
    switch (level) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLogLevelIcon = (level: SystemLog['level']) => {
    switch (level) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📝';
    }
  };

  const renderUsersTab = () => (
    <div className="space-y-4">
      {/* Role Management */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">👤 User Role Management</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-black">Current Role:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => onRoleChange('admin')}
                className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                  userRole === 'admin' ? 'bg-red-500 text-white' : 'bg-win95-gray text-black'
                }`}
              >
                🔴 Admin
              </button>
              <button
                onClick={() => onRoleChange('moderator')}
                className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                  userRole === 'moderator' ? 'bg-yellow-500 text-white' : 'bg-win95-gray text-black'
                }`}
              >
                🟡 Moderator
              </button>
              <button
                onClick={() => onRoleChange('member')}
                className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                  userRole === 'member' ? 'bg-green-500 text-white' : 'bg-win95-gray text-black'
                }`}
              >
                🟢 Member
              </button>
            </div>
          </div>

          <div className="win95-window bg-win95-gray border-win95-raised p-3">
            <h4 className="font-bold text-xs font-mono text-black mb-2">Role Permissions:</h4>
            <div className="space-y-1 text-xs font-mono text-black">
              {userRole === 'admin' && (
                <>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Full system access and configuration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>User management and role assignment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Data import/export and backup operations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>System logs and security monitoring</span>
                  </div>
                </>
              )}
              {userRole === 'moderator' && (
                <>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Member management and communication</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Event creation and management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>System configuration (Admin only)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>User role management (Admin only)</span>
                  </div>
                </>
              )}
              {userRole === 'member' && (
                <>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>View member directory</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>RSVP to events</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>Administrative functions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>System management</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Member Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="win95-window bg-white border-win95-sunken p-3 text-center">
          <div className={`text-2xl font-bold ${secretMode ? 'text-purple-600' : 'text-win95-blue'} font-mono`}>
            {members?.length || 0}
          </div>
          <div className="text-xs font-mono text-black">Total Users</div>
        </div>
        <div className="win95-window bg-white border-win95-sunken p-3 text-center">
          <div className={`text-2xl font-bold ${secretMode ? 'text-green-400' : 'text-green-600'} font-mono`}>
            {Math.floor((members?.length || 0) * 0.85)}
          </div>
          <div className="text-xs font-mono text-black">Active Users</div>
        </div>
        <div className="win95-window bg-white border-win95-sunken p-3 text-center">
          <div className={`text-2xl font-bold ${secretMode ? 'text-red-400' : 'text-red-600'} font-mono`}>
            1
          </div>
          <div className="text-xs font-mono text-black">Admins</div>
        </div>
        <div className="win95-window bg-white border-win95-sunken p-3 text-center">
          <div className={`text-2xl font-bold ${secretMode ? 'text-yellow-400' : 'text-yellow-600'} font-mono`}>
            2
          </div>
          <div className="text-xs font-mono text-black">Moderators</div>
        </div>
      </div>

      {/* Recent Member Activity */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">📊 Recent Member Activity</h3>
        <div className="space-y-2">
          {members?.slice(-5).reverse().map((member, _index) => (
            <div key={member.email} className="flex items-center justify-between p-2 bg-win95-gray border-win95-raised">
              <div className="flex items-center space-x-3">
                <span className="text-sm">👤</span>
                <div>
                  <span className="text-sm font-mono text-black">{member.name} {member.surname}</span>
                  <div className="text-xs font-mono text-gray-600">{member.email}</div>
                </div>
              </div>
              <div className="text-xs font-mono text-black">
                {new Date(Number(member.createdDate) / 1000000).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4">
      {/* System Configuration */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">⚙️ System Configuration</h3>
        
        <div className="space-y-4">
          {systemSettings.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <label className="text-sm font-mono text-black">{setting.label}:</label>
              <div className="w-48">
                {setting.type === 'text' && (
                  <input
                    type="text"
                    value={setting.value as string}
                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                    className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
                  />
                )}
                {setting.type === 'number' && (
                  <input
                    type="number"
                    value={setting.value as number}
                    onChange={(e) => updateSetting(setting.key, parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
                  />
                )}
                {setting.type === 'boolean' && (
                  <button
                    onClick={() => updateSetting(setting.key, !setting.value)}
                    className={`w-full win95-button px-2 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                      setting.value ? 'bg-green-500 text-white' : 'bg-win95-gray text-black'
                    }`}
                  >
                    {setting.value ? 'Enabled' : 'Disabled'}
                  </button>
                )}
                {setting.type === 'select' && (
                  <select
                    value={setting.value as string}
                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                    className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
                  >
                    {setting.options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-400">
          <button className="win95-button bg-green-500 text-white px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-green-600 active:border-win95-sunken mr-2">
            💾 Save Settings
          </button>
          <button className="win95-button bg-win95-gray text-black px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken">
            🔄 Reset to Defaults
          </button>
        </div>
      </div>

      {/* Performance Monitoring */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">📈 System Performance</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-green-400' : 'text-green-600'} font-mono`}>
              98%
            </div>
            <div className="text-xs font-mono text-black">Uptime</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-blue-400' : 'text-blue-600'} font-mono`}>
              45ms
            </div>
            <div className="text-xs font-mono text-black">Response Time</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-purple-400' : 'text-purple-600'} font-mono`}>
              2.1GB
            </div>
            <div className="text-xs font-mono text-black">Storage Used</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-orange-400' : 'text-orange-600'} font-mono`}>
              156
            </div>
            <div className="text-xs font-mono text-black">Daily Requests</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="space-y-4">
      {/* System Logs */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">📋 System Activity Logs</h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto win95-scrollbar">
          {systemLogs.map((log) => (
            <div key={log.id} className="win95-window bg-win95-gray border-win95-raised p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getLogLevelIcon(log.level)}</span>
                  <div className={`px-2 py-1 text-xs font-bold font-mono text-white rounded ${getLogLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </div>
                  <span className="font-bold text-sm font-mono text-black">{log.action}</span>
                </div>
                <span className="text-xs font-mono text-gray-600">{log.timestamp}</span>
              </div>
              
              <div className="text-sm font-mono text-black mb-1">
                <strong>User:</strong> {log.user}
              </div>
              <div className="text-sm font-mono text-black">
                <strong>Details:</strong> {log.details}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Filters */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">🔍 Log Filters</h3>
        
        <div className="flex space-x-2">
          <button className="win95-button bg-blue-500 text-white px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-blue-600 active:border-win95-sunken">
            ℹ️ Info
          </button>
          <button className="win95-button bg-yellow-500 text-white px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-yellow-600 active:border-win95-sunken">
            ⚠️ Warnings
          </button>
          <button className="win95-button bg-red-500 text-white px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-red-600 active:border-win95-sunken">
            ❌ Errors
          </button>
          <button className="win95-button bg-win95-gray text-black px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken">
            🔄 Refresh
          </button>
          <button className="win95-button bg-win95-gray text-black px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken">
            📤 Export Logs
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-4">
      {/* Security Status */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">🔒 Security Status</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-green-400' : 'text-green-600'} font-mono`}>
              ✅
            </div>
            <div className="text-xs font-mono text-black">SSL Certificate</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-green-400' : 'text-green-600'} font-mono`}>
              ✅
            </div>
            <div className="text-xs font-mono text-black">Firewall Active</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-yellow-400' : 'text-yellow-600'} font-mono`}>
              ⚠️
            </div>
            <div className="text-xs font-mono text-black">Failed Logins</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-blue-400' : 'text-blue-600'} font-mono`}>
              🔄
            </div>
            <div className="text-xs font-mono text-black">Auto Backup</div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">🛡️ Security Configuration</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-black">Two-Factor Authentication:</span>
            <button className="win95-button bg-green-500 text-white px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-green-600 active:border-win95-sunken">
              Enabled
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-black">Password Complexity:</span>
            <select className="px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-black">Session Timeout:</span>
            <input
              type="number"
              value={30}
              className="w-20 px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-black">IP Whitelist:</span>
            <button className="win95-button bg-win95-gray text-black px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken">
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">🚨 Recent Security Events</h3>
        
        <div className="space-y-2">
          <div className="win95-window bg-yellow-100 border-win95-raised p-2">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span className="text-sm font-mono text-black">3 failed login attempts from IP 192.168.1.100</span>
            </div>
            <div className="text-xs font-mono text-gray-600 mt-1">2025-06-05 14:20:08</div>
          </div>
          
          <div className="win95-window bg-green-100 border-win95-raised p-2">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span className="text-sm font-mono text-black">SSL certificate renewed successfully</span>
            </div>
            <div className="text-xs font-mono text-gray-600 mt-1">2025-06-05 12:00:00</div>
          </div>
          
          <div className="win95-window bg-blue-100 border-win95-raised p-2">
            <div className="flex items-center space-x-2">
              <span>ℹ️</span>
              <span className="text-sm font-mono text-black">Security scan completed - no threats detected</span>
            </div>
            <div className="text-xs font-mono text-gray-600 mt-1">2025-06-05 10:30:15</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (userRole !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-red-600 text-white px-3 py-2 mb-4 flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-3">
              <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
              <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
              <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-sm">🚫 Access Denied</span>
          </div>

          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-black font-mono mb-2">Administrator Access Required</h2>
            <p className="text-sm text-black font-mono mb-4">
              You need administrator privileges to access this panel.
            </p>
            <p className="text-xs text-black font-mono">
              Current role: <strong>{userRole}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="win95-title-bar bg-red-600 text-white px-3 py-2 mb-4 flex items-center">
          <div className="win95-title-buttons flex space-x-1 mr-3">
            <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
            <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
            <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
          </div>
          <span className="font-bold text-sm">⚙️ Administrator Panel</span>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-black font-mono mb-2">System Administration {secretMode && '🎮'}</h2>
          <p className="text-sm text-black font-mono">
            Advanced system management and configuration with retro administrative tools.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'users' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            👤 Users
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'settings' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'logs' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            📋 Logs
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'security' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            🔒 Security
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
            {activeTab === 'users' && '👤 User Management'}
            {activeTab === 'settings' && '⚙️ System Settings'}
            {activeTab === 'logs' && '📋 System Logs'}
            {activeTab === 'security' && '🔒 Security Center'}
          </span>
        </div>

        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'settings' && renderSettingsTab()}
        {activeTab === 'logs' && renderLogsTab()}
        {activeTab === 'security' && renderSecurityTab()}
      </div>
    </div>
  );
}
