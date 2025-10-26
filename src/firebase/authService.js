// DEPRECATED FILE: This file is replaced by src/services/localAuthService.js
// NO FIREBASE IMPORTS - prevents automatic connection establishment
// All components now use localAuthService instead

console.warn('⚠️ DEPRECATED: firebase/authService.js is no longer used. Switch to localAuthService.');

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isLoading = true;
  }

  // Google Sign In for Samadhi Portal
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user data to Firestore
      await this.createUserDocument(user);
      
      console.log('🕉️ Samadhi portal access granted:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Samadhi authentication error:', error);
      
      // Handle specific Firebase auth errors
      let userMessage = 'Authentication failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        userMessage = 'Sign-in cancelled. Please try again to access Samadhi.';
      } else if (error.code === 'auth/network-request-failed') {
        userMessage = 'Network error. Please check your connection.';
      }
      
      return { success: false, error: userMessage };
    }
  }

  // Sign Out
  async signOutUser() {
    try {
      await signOut(auth);
      console.log('✅ User signed out successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // DEPRECATED: Firestore operations moved to localSessionTracker.js with dynamic imports
  async createUserDocument(user) {
    console.log('⚠️ Using deprecated authService - switch to localAuthService');
    // This method is deprecated - user creation is now handled by localSessionTracker

    if (!userSnap.exists()) {
      const { displayName, email, photoURL, uid } = user;
      const createdAt = serverTimestamp();

      try {
        await setDoc(userRef, {
          uid,
          displayName,
          email,
          photoURL,
          createdAt,
          lastLoginAt: serverTimestamp(),
          totalMeditationTime: 0,
          totalSessions: 0,
          currentStreak: 0,
          longestStreak: 0,
          preferences: {
            binauralEnabled: true,
            soundEnabled: true,
            breathGuide: true
          }
        });
        console.log('✅ User document created');
      } catch (error) {
        // Silently fail - user creation is optional
        // console.error('❌ Error creating user document:', error);
      }
    } else {
      // Update last login - silently fail if Firestore unavailable
      try {
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp()
        });
      } catch (error) {
        // Enhanced error handling for network issues
        if (error.code === 'unavailable' || error.code === 'failed-precondition' || 
            error.message?.includes('400') || error.message?.includes('transport errored')) {
          console.warn('🌐 Firestore temporarily unavailable, skipping login update');
          return;
        }
        // Silently fail - session tracking is optional
      }
    }
  }

  // Update user's last login
  async updateLastLogin(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      // Enhanced error handling for offline/network issues
      if (error.code === 'unavailable' || error.code === 'failed-precondition' || 
          error.message?.includes('400') || error.message?.includes('transport errored')) {
        // Network/connectivity issue - queue for retry or skip
        console.warn('🌐 Firestore temporarily unavailable, skipping login update');
        return;
      }
      // Silently fail for other errors - session tracking is optional
      console.warn('⚠️ Login update failed:', error.code || 'unknown');
    }
  }

  // Auth state listener
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.isLoading = false;
      if (user) {
        this.updateLastLogin(user.uid);
      }
      callback(user);
    });
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }
}

export const authService = new AuthService();
export default authService;