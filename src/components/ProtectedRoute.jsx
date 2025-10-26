import React, { useState, useEffect } from 'react';
import { Loader2, Shield } from 'lucide-react';
import GoogleAuth from './GoogleAuth';
import { localAuthService } from '../services/localAuthService';
import { localSessionTracker } from '../services/localSessionTracker';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = localAuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      setAuthChecked(true);
      
      if (user) {
        // Initialize session tracking for authenticated user
        localSessionTracker.initializeUser(user);
        console.log('🔐 User authenticated:', user.email);
      } else {
        console.log('🔓 User not authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuthChange = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localSessionTracker.initializeUser(newUser);
    }
  };

  // Show loading spinner while checking authentication
  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-black to-purple-950">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500"></div>
            <Shield className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-purple-300 text-lg">Verifying access...</p>
          <p className="mt-2 text-purple-400 text-sm">Checking authentication status</p>
        </div>
      </div>
    );
  }

  // Show login form if user is not authenticated
  if (!user) {
    return <GoogleAuth onAuthChange={handleAuthChange} />;
  }

  // Render protected content if user is authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-black to-purple-950">
      {/* User info bar */}
      <div className="absolute top-4 right-4 z-50">
        <GoogleAuth onAuthChange={handleAuthChange} />
      </div>
      
      {/* Protected content */}
      <div className="w-full h-screen">
        {children}
      </div>
    </div>
  );
};

export default ProtectedRoute;