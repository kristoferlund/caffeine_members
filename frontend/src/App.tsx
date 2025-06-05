import React, { useState, useEffect } from 'react';
import MemberRegistrationForm from './components/MemberRegistrationForm';
import MemberList from './components/MemberList';
import MemberDetail from './components/MemberDetail';
import Dashboard from './components/Dashboard';
import EventManager from './components/EventManager';
import CommunicationCenter from './components/CommunicationCenter';
import DataManager from './components/DataManager';
import AdminPanel from './components/AdminPanel';
import Toast from './components/Toast';
import ExplosionEffect from './components/ExplosionEffect';
import SeedDataButton from './components/SeedDataButton';
import Screensaver from './components/Screensaver';
import SoundManager from './components/SoundManager';
import type { Member } from './backend';

type ViewType = 'main' | 'dashboard' | 'events' | 'communication' | 'data' | 'admin';

export default function App() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showExplosion, setShowExplosion] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [userRole, setUserRole] = useState<'admin' | 'moderator' | 'member'>('admin'); // Default to admin for demo
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  const [secretMode, setSecretMode] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleMemberSelect = (member: Member) => {
    setShowExplosion(true);
    setTimeout(() => {
      setSelectedMember(member);
      setShowExplosion(false);
    }, 1000);
  };

  const handleBackToList = () => {
    setShowExplosion(true);
    setTimeout(() => {
      setSelectedMember(null);
      setShowExplosion(false);
    }, 1000);
  };

  const handleViewChange = (view: ViewType) => {
    setShowExplosion(true);
    setTimeout(() => {
      setCurrentView(view);
      setSelectedMember(null);
      setShowExplosion(false);
    }, 1000);
  };

  // Konami code detection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    const newCode = [...konamiCode, e.code];
    
    if (newCode.length > konamiSequence.length) {
      newCode.shift();
    }
    
    setKonamiCode(newCode);
    
    if (newCode.length === konamiSequence.length && 
        newCode.every((key, index) => key === konamiSequence[index])) {
      setSecretMode(!secretMode);
      showToast('🎉 Secret mode activated! Retro sounds enabled!', 'success');
      setKonamiCode([]);
    }
  };

  // Activity tracking for screensaver
  const handleActivity = () => {
    setLastActivity(Date.now());
    if (showScreensaver) {
      setShowScreensaver(false);
    }
  };

  // Check for inactivity
  useEffect(() => {
    const checkInactivity = () => {
      if (Date.now() - lastActivity > 60000) { // 1 minute of inactivity
        setShowScreensaver(true);
      }
    };

    const interval = setInterval(checkInactivity, 5000);
    return () => clearInterval(interval);
  }, [lastActivity]);

  if (showScreensaver) {
    return <Screensaver onActivity={handleActivity} />;
  }

  if (selectedMember) {
    return (
      <div 
        className={`min-h-screen ${secretMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-win95-desktop'} bg-win95-pattern`}
        onMouseMove={handleActivity}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <MemberDetail member={selectedMember} onBack={handleBackToList} secretMode={secretMode} />
          
          {/* Footer */}
          <footer className="text-center mt-8">
            <div className="win95-window bg-win95-gray border-win95-raised p-3">
              <p className="text-xs text-black font-mono">
                © 2025. Built with ❤️ using{' '}
                <a 
                  href="https://caffeine.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-win95-blue underline hover:no-underline"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </footer>
        </div>

        {/* Explosion Effect */}
        {showExplosion && <ExplosionEffect />}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Sound Manager */}
        {secretMode && <SoundManager />}
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onMemberSelect={handleMemberSelect} secretMode={secretMode} />;
      case 'events':
        return <EventManager secretMode={secretMode} />;
      case 'communication':
        return <CommunicationCenter secretMode={secretMode} />;
      case 'data':
        return <DataManager onSuccess={showToast} onError={showToast} secretMode={secretMode} />;
      case 'admin':
        return <AdminPanel userRole={userRole} onRoleChange={setUserRole} secretMode={secretMode} />;
      default:
        return (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Registration Form */}
            <div className="win95-window bg-win95-gray border-win95-raised p-4">
              <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
                <div className="win95-title-buttons flex space-x-1 mr-3">
                  <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
                  <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
                  <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
                </div>
                <span className="font-bold text-xs">📝 Register New Member</span>
              </div>
              <MemberRegistrationForm onSuccess={showToast} onError={showToast} secretMode={secretMode} />
              
              {/* Seed Data Button */}
              <div className="mt-4 pt-4 border-t border-gray-400">
                <SeedDataButton onSuccess={showToast} onError={showToast} />
              </div>
            </div>

            {/* Member List */}
            <div className="win95-window bg-win95-gray border-win95-raised p-4">
              <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
                <div className="win95-title-buttons flex space-x-1 mr-3">
                  <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
                  <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
                  <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
                </div>
                <span className="font-bold text-xs">👥 Member Directory</span>
              </div>
              <MemberList onMemberSelect={handleMemberSelect} secretMode={secretMode} />
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`min-h-screen ${secretMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-win95-desktop'} bg-win95-pattern`}
      onMouseMove={handleActivity}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="win95-window bg-win95-gray border-win95-raised p-6 mb-6">
            <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
              <div className="win95-title-buttons flex space-x-1 mr-3">
                <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
                <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
                <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
              </div>
              <span className="font-bold text-sm">Association Member Management v2.0 {secretMode && '🎮'}</span>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              Association Member Management {secretMode && '✨'}
            </h1>
            <p className="text-sm text-black">
              Complete membership solution with advanced features and retro charm.
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="win95-window bg-win95-gray border-win95-raised p-4 mb-6">
          <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-3">
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-xs">🧭 Navigation Menu</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              onClick={() => handleViewChange('main')}
              className={`win95-button px-3 py-2 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                currentView === 'main' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleViewChange('dashboard')}
              className={`win95-button px-3 py-2 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                currentView === 'dashboard' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => handleViewChange('events')}
              className={`win95-button px-3 py-2 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                currentView === 'events' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
              }`}
            >
              📅 Events
            </button>
            <button
              onClick={() => handleViewChange('communication')}
              className={`win95-button px-3 py-2 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                currentView === 'communication' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
              }`}
            >
              📢 Messages
            </button>
            <button
              onClick={() => handleViewChange('data')}
              className={`win95-button px-3 py-2 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                currentView === 'data' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
              }`}
            >
              💾 Data
            </button>
            {userRole === 'admin' && (
              <button
                onClick={() => handleViewChange('admin')}
                className={`win95-button px-3 py-2 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                  currentView === 'admin' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
                }`}
              >
                ⚙️ Admin
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {renderCurrentView()}

        {/* Footer */}
        <footer className="text-center">
          <div className="win95-window bg-win95-gray border-win95-raised p-3">
            <p className="text-xs text-black font-mono">
              © 2025. Built with ❤️ using{' '}
              <a 
                href="https://caffeine.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-win95-blue underline hover:no-underline"
              >
                caffeine.ai
              </a>
              {secretMode && ' | 🎮 Secret Mode Active! | Try the Konami Code: ↑↑↓↓←→←→BA'}
            </p>
          </div>
        </footer>
      </div>

      {/* Explosion Effect */}
      {showExplosion && <ExplosionEffect />}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sound Manager */}
      {secretMode && <SoundManager />}
    </div>
  );
}
