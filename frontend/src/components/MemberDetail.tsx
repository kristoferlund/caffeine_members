import type { Member } from '../backend';

interface MemberDetailProps {
  member: Member;
  onBack: () => void;
  secretMode?: boolean;
}

export default function MemberDetail({ member, onBack, secretMode }: MemberDetailProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDateShort = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const memberSince = Math.floor((Date.now() - Number(member.createdDate) / 1000000) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-3">
              <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
              <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
              <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-sm">👤 Member Details</span>
          </div>
          <button
            onClick={onBack}
            className="win95-button bg-win95-gray text-black px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken"
          >
            ← Back to List
          </button>
        </div>

        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-3xl font-bold text-black mb-2 font-mono">
            {member.name} {member.surname}
          </h1>
          <p className="text-lg text-win95-blue font-mono">
            📧 {member.email}
          </p>
        </div>
      </div>

      {/* Member Information Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-3">
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-xs">📋 Basic Information</span>
          </div>

          <div className="space-y-4">
            <div className="win95-window bg-white border-win95-sunken p-3">
              <label className="block text-xs font-bold text-black mb-1 font-mono">First Name:</label>
              <div className="text-sm font-mono text-black">{member.name}</div>
            </div>

            <div className="win95-window bg-white border-win95-sunken p-3">
              <label className="block text-xs font-bold text-black mb-1 font-mono">Last Name:</label>
              <div className="text-sm font-mono text-black">{member.surname}</div>
            </div>

            <div className="win95-window bg-white border-win95-sunken p-3">
              <label className="block text-xs font-bold text-black mb-1 font-mono">Email Address:</label>
              <div className="text-sm font-mono text-win95-blue break-all">{member.email}</div>
            </div>
          </div>
        </div>

        {/* Membership Statistics */}
        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-3">
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-xs">📊 Membership Statistics</span>
          </div>

          <div className="space-y-4">
            <div className="win95-window bg-white border-win95-sunken p-3">
              <label className="block text-xs font-bold text-black mb-1 font-mono">Member Since:</label>
              <div className="text-sm font-mono text-black">{formatDateShort(member.createdDate)}</div>
              <div className="text-xs font-mono text-gray-600 mt-1">
                ({memberSince} days ago)
              </div>
            </div>

            <div className="win95-window bg-white border-win95-sunken p-3">
              <label className="block text-xs font-bold text-black mb-1 font-mono">Registration Date:</label>
              <div className="text-sm font-mono text-black">{formatDate(member.createdDate)}</div>
            </div>

            {member.updatedDate !== member.createdDate && (
              <div className="win95-window bg-white border-win95-sunken p-3">
                <label className="block text-xs font-bold text-black mb-1 font-mono">Last Updated:</label>
                <div className="text-sm font-mono text-black">{formatDate(member.updatedDate)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Status */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
          <div className="win95-title-buttons flex space-x-1 mr-3">
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
          </div>
          <span className="font-bold text-xs">✅ Member Status</span>
        </div>

        <div className="text-center py-6">
          <div className="text-4xl mb-3">{secretMode ? '🎮' : '🎉'}</div>
          <h3 className="text-xl font-bold text-black font-mono mb-2">Active Member</h3>
          <p className="text-sm text-black font-mono">
            This member is in good standing and has been part of our association for {memberSince} days.
            {secretMode && ' 🌟 Secret mode detected!'}
          </p>
          
          <div className="mt-4 flex justify-center space-x-4">
            <div className="win95-window bg-white border-win95-sunken p-2 text-center">
              <div className={`text-lg font-bold ${secretMode ? 'text-purple-600' : 'text-win95-blue'} font-mono`}>
                {memberSince}
              </div>
              <div className="text-xs font-mono text-black">Days</div>
            </div>
            <div className="win95-window bg-white border-win95-sunken p-2 text-center">
              <div className={`text-lg font-bold ${secretMode ? 'text-purple-600' : 'text-win95-blue'} font-mono`}>
                1
              </div>
              <div className="text-xs font-mono text-black">Member</div>
            </div>
            <div className="win95-window bg-white border-win95-sunken p-2 text-center">
              <div className={`text-lg font-bold ${secretMode ? 'text-purple-600' : 'text-win95-blue'} font-mono`}>
                ✓
              </div>
              <div className="text-xs font-mono text-black">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges (Enhanced Feature) */}
      {secretMode && (
        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-purple-600 text-white px-3 py-2 mb-4 flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-3">
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-xs">🏆 Achievement Badges</span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2 animate-bounce">🌟</div>
              <div className="text-xs font-mono text-black">New Member</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 animate-pulse">📧</div>
              <div className="text-xs font-mono text-black">Email Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-xs font-mono text-black">Active Participant</div>
            </div>
            <div className="text-center opacity-50">
              <div className="text-3xl mb-2">🏅</div>
              <div className="text-xs font-mono text-black">Event Attendee</div>
            </div>
            <div className="text-center opacity-50">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-xs font-mono text-black">Veteran Member</div>
            </div>
            <div className="text-center opacity-50">
              <div className="text-3xl mb-2">👑</div>
              <div className="text-xs font-mono text-black">VIP Member</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
