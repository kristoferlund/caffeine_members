import { useState } from 'react';
import { useMembers } from '../hooks/useQueries';
import type { Member } from '../backend';

interface DashboardProps {
  onMemberSelect: (member: Member) => void;
  secretMode?: boolean;
}

export default function Dashboard({ onMemberSelect, secretMode }: DashboardProps) {
  const { data: members, isLoading } = useMembers();
  const [selectedChart, setSelectedChart] = useState<'growth' | 'status' | 'activity'>('growth');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="win95-window bg-win95-gray border-win95-sunken p-4">
          <div className="flex items-center space-x-3">
            <div className="win95-loading-dots">
              <span>●</span><span>●</span><span>●</span>
            </div>
            <span className="text-black text-sm font-mono">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  const totalMembers = members?.length || 0;
  const activeMembers = Math.floor(totalMembers * 0.85); // Simulate 85% active
  const newThisMonth = Math.floor(totalMembers * 0.12); // Simulate 12% new this month
  const avgDaysActive = Math.floor(Math.random() * 200) + 50; // Random between 50-250 days

  // Generate mock chart data
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, _index) => ({
      month,
      value: Math.floor(Math.random() * 20) + _index * 5 + 10
    }));
  };

  const chartData = generateChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));

  const renderPixelChart = () => {
    return (
      <div className="win95-window bg-white border-win95-sunken p-4 h-64">
        <div className="h-full flex items-end justify-around space-x-2">
          {chartData.map((data, _index) => {
            const height = (data.value / maxValue) * 180;
            return (
              <div key={data.month} className="flex flex-col items-center">
                <div 
                  className={`w-8 ${secretMode ? 'bg-gradient-to-t from-purple-500 to-pink-500' : 'bg-win95-blue'} border border-black pixel-bar`}
                  style={{ height: `${height}px` }}
                ></div>
                <span className="text-xs font-mono mt-2 text-black">{data.month}</span>
                <span className="text-xs font-mono text-gray-600">{data.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStatusChart = () => {
    const statuses = [
      { name: 'Active', count: activeMembers, color: 'bg-green-500' },
      { name: 'Inactive', count: totalMembers - activeMembers - 2, color: 'bg-yellow-500' },
      { name: 'Suspended', count: 1, color: 'bg-red-500' },
      { name: 'Honorary', count: 1, color: 'bg-purple-500' }
    ];

    return (
      <div className="win95-window bg-white border-win95-sunken p-4 h-64">
        <div className="grid grid-cols-2 gap-4 h-full">
          {statuses.map((status, _index) => (
            <div key={status.name} className="flex flex-col items-center justify-center">
              <div className={`w-16 h-16 ${status.color} border-2 border-black pixel-square flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{status.count}</span>
              </div>
              <span className="text-xs font-mono mt-2 text-black">{status.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActivityChart = () => {
    const activities = ['Logins', 'Events', 'Messages', 'Updates'];
    return (
      <div className="win95-window bg-white border-win95-sunken p-4 h-64">
        <div className="space-y-4">
          {activities.map((activity, _index) => {
            const value = Math.floor(Math.random() * 100) + 20;
            return (
              <div key={activity} className="flex items-center space-x-3">
                <span className="text-xs font-mono w-16 text-black">{activity}:</span>
                <div className="flex-1 bg-win95-gray border-win95-sunken h-4 relative">
                  <div 
                    className={`h-full ${secretMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-win95-blue'} pixel-progress`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <span className="text-xs font-mono w-8 text-black">{value}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const recentMembers = members?.slice(-5).reverse() || [];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-win95-blue text-white px-2 py-1 mb-3 flex items-center">
            <span className="font-bold text-xs">👥 Total Members</span>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${secretMode ? 'text-purple-600' : 'text-win95-blue'} font-mono`}>
              {totalMembers}
            </div>
            <div className="text-xs font-mono text-black">Registered</div>
          </div>
        </div>

        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-green-600 text-white px-2 py-1 mb-3 flex items-center">
            <span className="font-bold text-xs">✅ Active Members</span>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${secretMode ? 'text-green-400' : 'text-green-600'} font-mono`}>
              {activeMembers}
            </div>
            <div className="text-xs font-mono text-black">Online</div>
          </div>
        </div>

        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-orange-600 text-white px-2 py-1 mb-3 flex items-center">
            <span className="font-bold text-xs">🆕 New This Month</span>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${secretMode ? 'text-orange-400' : 'text-orange-600'} font-mono`}>
              {newThisMonth}
            </div>
            <div className="text-xs font-mono text-black">Joined</div>
          </div>
        </div>

        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-purple-600 text-white px-2 py-1 mb-3 flex items-center">
            <span className="font-bold text-xs">📊 Avg. Activity</span>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${secretMode ? 'text-purple-400' : 'text-purple-600'} font-mono`}>
              {avgDaysActive}
            </div>
            <div className="text-xs font-mono text-black">Days</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="win95-title-buttons flex space-x-1 mr-3">
                <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
                <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
                <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              </div>
              <span className="font-bold text-xs">📈 Analytics Charts</span>
            </div>
          </div>

          {/* Chart Type Selector */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setSelectedChart('growth')}
              className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                selectedChart === 'growth' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
              }`}
            >
              Growth
            </button>
            <button
              onClick={() => setSelectedChart('status')}
              className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                selectedChart === 'status' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
              }`}
            >
              Status
            </button>
            <button
              onClick={() => setSelectedChart('activity')}
              className={`win95-button px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken ${
                selectedChart === 'activity' ? 'bg-win95-blue text-white' : 'bg-win95-gray text-black'
              }`}
            >
              Activity
            </button>
          </div>

          {selectedChart === 'growth' && renderPixelChart()}
          {selectedChart === 'status' && renderStatusChart()}
          {selectedChart === 'activity' && renderActivityChart()}
        </div>

        {/* Recent Members */}
        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-3">
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-xs">🆕 Recent Members</span>
          </div>

          <div className="space-y-2">
            {recentMembers.map((member, _index) => (
              <div
                key={member.email}
                className="win95-window bg-white border-win95-sunken p-3 hover:bg-win95-highlight hover:text-white transition-colors cursor-pointer"
                onClick={() => onMemberSelect(member)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">👤</div>
                    <div>
                      <h4 className="font-bold text-sm font-mono">
                        {member.name} {member.surname}
                      </h4>
                      <p className="text-xs font-mono opacity-60">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-xs font-mono opacity-60">
                    {new Date(Number(member.createdDate) / 1000000).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Leaderboard */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
          <div className="win95-title-buttons flex space-x-1 mr-3">
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
          </div>
          <span className="font-bold text-xs">🏆 Member Leaderboard</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {recentMembers.slice(0, 3).map((member, _index) => {
            const points = Math.floor(Math.random() * 1000) + 500;
            const badges = ['🌟', '🎯', '💎', '🚀', '⭐'][Math.floor(Math.random() * 5)];
            
            return (
              <div key={member.email} className="win95-window bg-white border-win95-sunken p-3 text-center">
                <div className="text-4xl mb-2">
                  {_index === 0 ? '🥇' : _index === 1 ? '🥈' : '🥉'}
                </div>
                <h4 className="font-bold text-sm font-mono text-black">
                  {member.name} {member.surname}
                </h4>
                <div className={`text-lg font-bold ${secretMode ? 'text-purple-600' : 'text-win95-blue'} font-mono`}>
                  {points} pts
                </div>
                <div className="text-lg">{badges}</div>
                <div className="text-xs font-mono text-gray-600 mt-1">
                  Rank #{_index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
