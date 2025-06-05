import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface EventManagerProps {
  secretMode?: boolean;
}

export default function EventManager({ secretMode }: EventManagerProps) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Annual General Meeting',
      date: '2025-07-15',
      time: '19:00',
      location: 'Community Center',
      description: 'Our yearly AGM to discuss association matters and elect new board members.',
      attendees: 45,
      maxAttendees: 100,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Summer BBQ Social',
      date: '2025-08-20',
      time: '12:00',
      location: 'Central Park',
      description: 'Join us for a fun summer barbecue with games and activities for all ages.',
      attendees: 23,
      maxAttendees: 50,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Charity Fundraiser',
      date: '2025-06-01',
      time: '18:30',
      location: 'Town Hall',
      description: 'Completed charity event that raised funds for local community projects.',
      attendees: 67,
      maxAttendees: 80,
      status: 'completed'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    maxAttendees: 50
  });

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;

    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      attendees: 0,
      status: 'upcoming'
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      maxAttendees: 50
    });
    setShowCreateForm(false);
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return '📅';
      case 'ongoing': return '🔴';
      case 'completed': return '✅';
      default: return '📅';
    }
  };

  if (selectedEvent) {
    return (
      <div className="space-y-6">
        {/* Event Detail View */}
        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="win95-title-buttons flex space-x-1 mr-3">
                <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
                <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
                <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
              </div>
              <span className="font-bold text-sm">📅 Event Details</span>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="win95-button bg-win95-gray text-black px-3 py-1 text-xs font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken"
            >
              ← Back to Events
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="win95-window bg-white border-win95-sunken p-4">
                <h2 className="text-xl font-bold text-black font-mono mb-2">{selectedEvent.title}</h2>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getStatusIcon(selectedEvent.status)}</span>
                    <span className="text-black">
                      {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">📍</span>
                    <span className="text-black">{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">👥</span>
                    <span className="text-black">
                      {selectedEvent.attendees} / {selectedEvent.maxAttendees} attendees
                    </span>
                  </div>
                </div>
              </div>

              <div className="win95-window bg-white border-win95-sunken p-4">
                <h3 className="font-bold text-sm font-mono text-black mb-2">Description:</h3>
                <p className="text-sm font-mono text-black">{selectedEvent.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Attendance Progress */}
              <div className="win95-window bg-white border-win95-sunken p-4">
                <h3 className="font-bold text-sm font-mono text-black mb-3">Attendance Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-black">
                    <span>Registered</span>
                    <span>{selectedEvent.attendees} / {selectedEvent.maxAttendees}</span>
                  </div>
                  <div className="w-full bg-win95-gray border-win95-sunken h-6 relative">
                    <div 
                      className={`h-full ${secretMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-win95-blue'} pixel-progress`}
                      style={{ width: `${(selectedEvent.attendees / selectedEvent.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className={`text-lg font-bold ${secretMode ? 'text-purple-600' : 'text-win95-blue'} font-mono`}>
                      {Math.round((selectedEvent.attendees / selectedEvent.maxAttendees) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* RSVP Actions */}
              <div className="win95-window bg-white border-win95-sunken p-4">
                <h3 className="font-bold text-sm font-mono text-black mb-3">RSVP Management</h3>
                <div className="space-y-2">
                  <button className="w-full win95-button bg-green-500 text-white py-2 px-4 text-sm font-bold font-mono border-win95-raised hover:bg-green-600 active:border-win95-sunken">
                    ✅ Mark Attendance
                  </button>
                  <button className="w-full win95-button bg-yellow-500 text-black py-2 px-4 text-sm font-bold font-mono border-win95-raised hover:bg-yellow-600 active:border-win95-sunken">
                    📧 Send Reminder
                  </button>
                  <button className="w-full win95-button bg-win95-gray text-black py-2 px-4 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken">
                    📋 View Attendee List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-3">
              <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
              <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
              <div className="w-4 h-4 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-sm">📅 Event Management</span>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="win95-button bg-win95-gray text-black px-4 py-2 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken"
          >
            {showCreateForm ? '❌ Cancel' : '➕ Create Event'}
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-black font-mono mb-2">Event Calendar & Management</h2>
          <p className="text-sm text-black font-mono">
            Organize association events, track attendance, and manage RSVPs with retro style.
          </p>
        </div>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="win95-window bg-win95-gray border-win95-raised p-4">
          <div className="win95-title-bar bg-green-600 text-white px-3 py-2 mb-4 flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-3">
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
              <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-xs">🎉 Create New Event</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1 font-mono">Event Title:</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
                  placeholder="Enter event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-black mb-1 font-mono">Date:</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black mb-1 font-mono">Time:</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1 font-mono">Location:</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1 font-mono">Max Attendees:</label>
                <input
                  type="number"
                  value={newEvent.maxAttendees}
                  onChange={(e) => setNewEvent({...newEvent, maxAttendees: parseInt(e.target.value) || 50})}
                  className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1 font-mono">Description:</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono h-20 resize-none"
                  placeholder="Enter event description"
                />
              </div>

              <button
                onClick={handleCreateEvent}
                className="w-full win95-button bg-green-500 text-white py-2 px-4 text-sm font-bold font-mono border-win95-raised hover:bg-green-600 active:border-win95-sunken"
              >
                🎉 Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="win95-window bg-white border-win95-sunken p-4 hover:bg-win95-highlight hover:text-white transition-colors cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getStatusIcon(event.status)}</span>
                <div className={`px-2 py-1 text-xs font-bold font-mono text-white rounded ${getStatusColor(event.status)}`}>
                  {event.status.toUpperCase()}
                </div>
              </div>
            </div>

            <h3 className="font-bold text-sm font-mono text-black mb-2">{event.title}</h3>
            
            <div className="space-y-1 text-xs font-mono text-black mb-3">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🕐</span>
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👥</span>
                <span>{event.attendees} / {event.maxAttendees}</span>
              </div>
            </div>

            <div className="w-full bg-win95-gray border-win95-sunken h-2 mb-2">
              <div 
                className={`h-full ${secretMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-win95-blue'}`}
                style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs font-mono text-gray-600 line-clamp-2">
              {event.description}
            </p>

            <div className="text-xs font-mono opacity-60 mt-2">
              👆 Click for details
            </div>
          </div>
        ))}
      </div>

      {/* Mini Calendar */}
      <div className="win95-window bg-win95-gray border-win95-raised p-4">
        <div className="win95-title-bar bg-win95-blue text-white px-3 py-2 mb-4 flex items-center">
          <div className="win95-title-buttons flex space-x-1 mr-3">
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
            <div className="w-3 h-3 bg-win95-gray border-win95-raised"></div>
          </div>
          <span className="font-bold text-xs">📅 Event Calendar</span>
        </div>

        <div className="win95-window bg-white border-win95-sunken p-4">
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs font-bold font-mono text-black p-2 bg-win95-gray border-win95-raised">
                {day}
              </div>
            ))}
            {Array.from({length: 35}, (_, i) => {
              const day = i - 6; // Start from a Sunday
              const hasEvent = events.some(event => {
                const eventDate = new Date(event.date);
                return eventDate.getDate() === day && day > 0 && day <= 31;
              });
              
              return (
                <div 
                  key={i} 
                  className={`text-xs font-mono p-2 border ${
                    day > 0 && day <= 31 
                      ? hasEvent 
                        ? `${secretMode ? 'bg-purple-200' : 'bg-blue-200'} border-win95-raised text-black font-bold` 
                        : 'bg-white border-win95-sunken text-black hover:bg-win95-highlight hover:text-white cursor-pointer'
                      : 'bg-win95-gray border-win95-raised text-gray-400'
                  }`}
                >
                  {day > 0 && day <= 31 ? day : ''}
                  {hasEvent && <div className="text-xs">📅</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
