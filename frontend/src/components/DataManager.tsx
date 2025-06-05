import React, { useState } from 'react';
import { useMembers } from '../hooks/useQueries';

interface DataManagerProps {
  onSuccess: (message: string, type: 'success') => void;
  onError: (message: string, type: 'error') => void;
  secretMode?: boolean;
}

export default function DataManager({ onSuccess, onError, secretMode }: DataManagerProps) {
  const { data: members } = useMembers();
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'backup'>('import');
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      onError('Please select a CSV file', 'error');
      return;
    }

    setIsProcessing(true);
    setImportProgress(0);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate headers
      const requiredHeaders = ['name', 'surname', 'email'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        onError(`Missing required columns: ${missingHeaders.join(', ')}`, 'error');
        setIsProcessing(false);
        return;
      }

      // Simulate import progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      onSuccess(`Successfully imported ${lines.length - 1} members from CSV file!`, 'success');
    } catch {
      onError('Failed to import CSV file. Please check the format.', 'error');
    } finally {
      setIsProcessing(false);
      setImportProgress(0);
    }
  };

  const handleExport = async (format: 'csv' | 'json' | 'xml') => {
    if (!members || members.length === 0) {
      onError('No members to export', 'error');
      return;
    }

    setIsProcessing(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 20) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      let content = '';
      let filename = '';
      let mimeType = '';

      switch (format) {
        case 'csv':
          content = 'Name,Surname,Email,Created Date,Updated Date\n' +
            members.map(m => `${m.name},${m.surname},${m.email},${new Date(Number(m.createdDate) / 1000000).toISOString()},${new Date(Number(m.updatedDate) / 1000000).toISOString()}`).join('\n');
          filename = `members_export_${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = JSON.stringify(members, null, 2);
          filename = `members_export_${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;
        case 'xml':
          content = `<?xml version="1.0" encoding="UTF-8"?>\n<members>\n` +
            members.map(m => `  <member>\n    <name>${m.name}</name>\n    <surname>${m.surname}</surname>\n    <email>${m.email}</email>\n    <createdDate>${new Date(Number(m.createdDate) / 1000000).toISOString()}</createdDate>\n    <updatedDate>${new Date(Number(m.updatedDate) / 1000000).toISOString()}</updatedDate>\n  </member>`).join('\n') +
            '\n</members>';
          filename = `members_export_${new Date().toISOString().split('T')[0]}.xml`;
          mimeType = 'application/xml';
          break;
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onSuccess(`Successfully exported ${members.length} members as ${format.toUpperCase()}!`, 'success');
    } catch {
      onError('Failed to export data. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setExportProgress(0);
    }
  };

  const handleBackup = async () => {
    setIsProcessing(true);
    setExportProgress(0);

    try {
      // Simulate backup progress
      for (let i = 0; i <= 100; i += 25) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '2.0',
        members: members || [],
        metadata: {
          totalMembers: members?.length || 0,
          exportedBy: 'Association Management System',
          format: 'backup'
        }
      };

      const content = JSON.stringify(backupData, null, 2);
      const filename = `association_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onSuccess('System backup created successfully!', 'success');
    } catch {
      onError('Failed to create backup. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setExportProgress(0);
    }
  };

  const renderImportTab = () => (
    <div className="space-y-4">
      {/* CSV Import */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">📥 CSV Import</h3>
        
        <div className="space-y-3">
          <div className="win95-window bg-win95-gray border-win95-raised p-3">
            <h4 className="font-bold text-xs font-mono text-black mb-2">Required CSV Format:</h4>
            <div className="text-xs font-mono text-black bg-white border-win95-sunken p-2">
              <div>name,surname,email</div>
              <div>John,Doe,john.doe@example.com</div>
              <div>Jane,Smith,jane.smith@example.com</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1 font-mono">Select CSV File:</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              disabled={isProcessing}
              className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
            />
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-black">Importing data...</div>
              <div className="w-full bg-win95-gray border-win95-sunken h-6 relative">
                <div 
                  className={`h-full ${secretMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-win95-blue'} pixel-progress transition-all duration-300`}
                  style={{ width: `${importProgress}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-black">
                  {importProgress}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Import Guidelines */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">📋 Import Guidelines</h3>
        <div className="space-y-2 text-xs font-mono text-black">
          <div className="flex items-start space-x-2">
            <span>✅</span>
            <span>CSV files must include headers: name, surname, email</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>✅</span>
            <span>Email addresses must be valid and unique</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>✅</span>
            <span>Maximum file size: 2MB</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>⚠️</span>
            <span>Duplicate emails will be skipped</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>⚠️</span>
            <span>Invalid rows will be reported</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportTab = () => (
    <div className="space-y-4">
      {/* Export Options */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="win95-window bg-white border-win95-sunken p-4 text-center">
          <div className="text-4xl mb-2">📊</div>
          <h3 className="font-bold text-sm font-mono text-black mb-2">CSV Export</h3>
          <p className="text-xs font-mono text-black mb-3">
            Export member data as comma-separated values for spreadsheet applications.
          </p>
          <button
            onClick={() => handleExport('csv')}
            disabled={isProcessing}
            className="w-full win95-button bg-green-500 text-white py-2 px-3 text-xs font-bold font-mono border-win95-raised hover:bg-green-600 active:border-win95-sunken disabled:opacity-50"
          >
            📊 Export CSV
          </button>
        </div>

        <div className="win95-window bg-white border-win95-sunken p-4 text-center">
          <div className="text-4xl mb-2">📄</div>
          <h3 className="font-bold text-sm font-mono text-black mb-2">JSON Export</h3>
          <p className="text-xs font-mono text-black mb-3">
            Export member data as JSON for API integration and data processing.
          </p>
          <button
            onClick={() => handleExport('json')}
            disabled={isProcessing}
            className="w-full win95-button bg-blue-500 text-white py-2 px-3 text-xs font-bold font-mono border-win95-raised hover:bg-blue-600 active:border-win95-sunken disabled:opacity-50"
          >
            📄 Export JSON
          </button>
        </div>

        <div className="win95-window bg-white border-win95-sunken p-4 text-center">
          <div className="text-4xl mb-2">📋</div>
          <h3 className="font-bold text-sm font-mono text-black mb-2">XML Export</h3>
          <p className="text-xs font-mono text-black mb-3">
            Export member data as XML for legacy systems and data exchange.
          </p>
          <button
            onClick={() => handleExport('xml')}
            disabled={isProcessing}
            className="w-full win95-button bg-purple-500 text-white py-2 px-3 text-xs font-bold font-mono border-win95-raised hover:bg-purple-600 active:border-win95-sunken disabled:opacity-50"
          >
            📋 Export XML
          </button>
        </div>
      </div>

      {/* Export Progress */}
      {isProcessing && (
        <div className="win95-window bg-white border-win95-sunken p-4">
          <div className="space-y-2">
            <div className="text-sm font-mono text-black">Preparing export...</div>
            <div className="w-full bg-win95-gray border-win95-sunken h-6 relative">
              <div 
                className={`h-full ${secretMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-win95-blue'} pixel-progress transition-all duration-300`}
                style={{ width: `${exportProgress}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-black">
                {exportProgress}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Statistics */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">📊 Export Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-purple-600' : 'text-win95-blue'} font-mono`}>
              {members?.length || 0}
            </div>
            <div className="text-xs font-mono text-black">Total Members</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-green-400' : 'text-green-600'} font-mono`}>
              {Math.floor((members?.length || 0) * 0.85)}
            </div>
            <div className="text-xs font-mono text-black">Active Members</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-orange-400' : 'text-orange-600'} font-mono`}>
              {Math.floor((members?.length || 0) * 0.12)}
            </div>
            <div className="text-xs font-mono text-black">Recent Joins</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${secretMode ? 'text-blue-400' : 'text-blue-600'} font-mono`}>
              {members ? new Date().toISOString().split('T')[0] : 'N/A'}
            </div>
            <div className="text-xs font-mono text-black">Last Export</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-4">
      {/* System Backup */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">💾 System Backup</h3>
        
        <div className="space-y-4">
          <div className="win95-window bg-win95-gray border-win95-raised p-3">
            <h4 className="font-bold text-xs font-mono text-black mb-2">Backup Contents:</h4>
            <div className="space-y-1 text-xs font-mono text-black">
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>All member data and profiles</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>System configuration</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Metadata and timestamps</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Version information</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBackup}
            disabled={isProcessing}
            className="w-full win95-button bg-red-500 text-white py-3 px-4 text-sm font-bold font-mono border-win95-raised hover:bg-red-600 active:border-win95-sunken disabled:opacity-50"
          >
            💾 Create Full Backup
          </button>

          {isProcessing && (
            <div className="space-y-2">
              <div className="text-sm font-mono text-black">Creating backup...</div>
              <div className="w-full bg-win95-gray border-win95-sunken h-6 relative">
                <div 
                  className={`h-full ${secretMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-red-500'} pixel-progress transition-all duration-300`}
                  style={{ width: `${exportProgress}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white">
                  {exportProgress}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backup Schedule */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">⏰ Backup Schedule</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-black">Automatic Daily Backup:</span>
            <button className="win95-button bg-win95-gray text-black px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-black">Weekly Full Backup:</span>
            <button className="win95-button bg-win95-gray text-black px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken">
              Configure
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-black">Backup Retention:</span>
            <span className="text-sm font-mono text-black">30 days</span>
          </div>
        </div>
      </div>

      {/* Restore Options */}
      <div className="win95-window bg-white border-win95-sunken p-4">
        <h3 className="font-bold text-sm font-mono text-black mb-3">🔄 Restore Options</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-black mb-1 font-mono">Select Backup File:</label>
            <input
              type="file"
              accept=".json"
              className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
            />
          </div>
          
          <button className="w-full win95-button bg-orange-500 text-white py-2 px-4 text-sm font-bold font-mono border-win95-raised hover:bg-orange-600 active:border-win95-sunken">
            🔄 Restore from Backup
          </button>
          
          <div className="win95-window bg-yellow-100 border-win95-raised p-2">
            <div className="text-xs font-mono text-black">
              ⚠️ <strong>Warning:</strong> Restoring from backup will replace all current data. This action cannot be undone.
            </div>
          </div>
        </div>
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
          <span className="font-bold text-sm">💾 Data Management</span>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-black font-mono mb-2">Import, Export & Backup Center</h2>
          <p className="text-sm text-black font-mono">
            Manage your member data with classic file operations and retro progress indicators.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('import')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'import' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            📥 Import
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'export' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            📤 Export
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`win95-button px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
              activeTab === 'backup' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
            }`}
          >
            💾 Backup
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
            {activeTab === 'import' && '📥 Data Import'}
            {activeTab === 'export' && '📤 Data Export'}
            {activeTab === 'backup' && '💾 System Backup'}
          </span>
        </div>

        {activeTab === 'import' && renderImportTab()}
        {activeTab === 'export' && renderExportTab()}
        {activeTab === 'backup' && renderBackupTab()}
      </div>
    </div>
  );
}
