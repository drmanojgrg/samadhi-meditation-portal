import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import PerfectVoidPortalCompact from './components/PerfectVoidPortalCompact';
import MeditationCalendar from './components/MeditationCalendar';
import { localAuthService } from './services/localAuthService';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('meditation');
  const user = localAuthService.getCurrentUser();

  return (
    <ErrorBoundary>
      <div className="App">
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-black to-purple-950">
          {/* Navigation */}
          <nav className="p-4 border-b border-purple-500/20">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-purple-100">Samadhi</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentView('meditation')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'meditation' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-600/20 text-purple-200 hover:bg-purple-600/30'
                  }`}
                >
                  Meditate
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'calendar' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-600/20 text-purple-200 hover:bg-purple-600/30'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => localAuthService.signOut()}
                  className="px-4 py-2 rounded-lg bg-red-600/20 text-red-200 hover:bg-red-600/30 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="p-4">
            {currentView === 'meditation' && <PerfectVoidPortalCompact />}
            {currentView === 'calendar' && <MeditationCalendar user={user} />}
          </main>
        </div>
      </ProtectedRoute>
    </div>
    </ErrorBoundary>
  );
}

export default App;