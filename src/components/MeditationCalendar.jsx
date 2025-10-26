import React, { useState, useEffect } from 'react';
import { localSessionTracker } from '../services/localSessionTracker';

const MeditationCalendar = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meditationData, setMeditationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  const formatDuration = (ms) => `${Math.floor(ms/60000)}m ${Math.floor((ms%60000)/1000)}s`;

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      try {
        const history = await localSessionTracker.getMeditationHistory(startDate, endDate);
        setMeditationData(history);
      } catch (error) {
        console.error('Error fetching meditation data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, currentDate]);

  const getMeditationForDate = (date) => meditationData.find(s => s.date === date.toISOString().split('T')[0]);

  const generateCalendarDays = () => {
    const month = currentDate.getMonth();
    const firstDay = new Date(currentDate.getFullYear(), month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = [];
    const currentDay = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        meditation: getMeditationForDate(currentDay)
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return days;
  };

  const navigateMonth = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

  const days = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (!user) {
    return (
      <div className="text-center text-purple-300 p-8">
        Please sign in to view your meditation calendar
      </div>
    );
  }

  return (
    <div className="meditation-calendar max-w-4xl mx-auto p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 transition-colors"
        >
          ← Previous
        </button>
        
        <h2 className="text-2xl font-bold text-purple-100">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-purple-300 font-medium p-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => setSelectedDay(day)}
            className={`
              relative p-2 min-h-[60px] border border-purple-800/30 rounded-lg cursor-pointer
              transition-all duration-200 hover:bg-purple-600/10
              ${day.isCurrentMonth ? 'bg-purple-900/20' : 'bg-purple-900/10 opacity-60'}
              ${day.isToday ? 'ring-2 ring-purple-400' : ''}
              ${selectedDay?.date.toDateString() === day.date.toDateString() ? 'bg-purple-600/20' : ''}
            `}
          >
            <div className="text-sm text-purple-100 font-medium">
              {day.date.getDate()}
            </div>
            
            {day.meditation && (
              <div className="mt-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full mx-auto mb-1"></div>
                <div className="text-xs text-purple-300 text-center">
                  {formatDuration(day.meditation.totalDuration)}
                </div>
                <div className="text-xs text-purple-400 text-center">
                  {day.meditation.sessionCount} session{day.meditation.sessionCount !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
          <h3 className="text-lg font-semibold text-purple-100 mb-3">
            {selectedDay.date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {selectedDay.meditation ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300">
                  {formatDuration(selectedDay.meditation.totalDuration)}
                </div>
                <div className="text-sm text-purple-400">Total Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-300">
                  {selectedDay.meditation.sessionCount}
                </div>
                <div className="text-sm text-indigo-400">Sessions</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">
                  {Math.round(selectedDay.meditation.totalDuration / selectedDay.meditation.sessionCount / 60000)}m
                </div>
                <div className="text-sm text-cyan-400">Avg Session</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">
                  {new Date(selectedDay.meditation.lastSession.seconds * 1000).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-sm text-green-400">Last Session</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-purple-400">
              No meditation sessions on this day
            </div>
          )}
        </div>
      )}

      {/* Monthly Summary */}
      <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
        <h3 className="text-lg font-semibold text-indigo-100 mb-3">
          Monthly Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-300">
              {formatDuration(meditationData.reduce((sum, day) => sum + day.totalDuration, 0))}
            </div>
            <div className="text-sm text-indigo-400">Total Time</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300">
              {meditationData.reduce((sum, day) => sum + day.sessionCount, 0)}
            </div>
            <div className="text-sm text-purple-400">Total Sessions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">
              {meditationData.length}
            </div>
            <div className="text-sm text-cyan-400">Days Practiced</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300">
              {Math.round((meditationData.length / new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) * 100)}%
            </div>
            <div className="text-sm text-green-400">Consistency</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationCalendar;