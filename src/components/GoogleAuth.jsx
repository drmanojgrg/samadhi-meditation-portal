import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { localAuthService } from '../services/localAuthService';

const GoogleAuth = ({ onAuthChange }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = localAuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      if (onAuthChange) {
        onAuthChange(user);
      }
    });

    return () => unsubscribe();
  }, [onAuthChange]);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      const result = await localAuthService.signInWithGoogle();
      console.log('✅ Google sign-in successful');
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await localAuthService.signOut();
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        <span className="ml-2 text-purple-300">Connecting...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg border border-purple-500/20">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName}
              className="w-10 h-10 rounded-full border-2 border-purple-400/50"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <div className="text-purple-100 font-medium text-sm">
              {user.displayName || 'Meditator'}
            </div>
            <div className="text-purple-300 text-xs">
              {user.email}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="ml-auto flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 
                     text-red-300 hover:text-red-200 rounded-lg transition-all duration-200
                     border border-red-500/20 hover:border-red-500/40"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-black to-purple-950">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
          🕉️ Samadhi Portal
        </h1>
        <p className="text-purple-300 text-lg mb-8">
          Enter the sacred space of deep meditation
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-8 rounded-xl border border-purple-500/20 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-purple-100 mb-2">
            Sacred Access Required
          </h2>
          <p className="text-purple-300 text-sm">
            Sign in with Google to enter your Samadhi meditation journey
          </p>
        </div>

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 
                     bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                     text-white font-medium rounded-lg transition-all duration-200
                     border border-purple-500/30 hover:border-purple-400/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-lg hover:shadow-purple-500/25"
        >
          {signingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          <span>
            {signingIn ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-purple-400">
            Your meditation progress will be safely stored and tracked
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;