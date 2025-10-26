// Local-only authentication service - NO FIRESTORE, NO WEBSOCKETS
import { auth } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { googleProvider } from '../firebase/config';

class LocalAuthService {
  constructor() {
    this.currentUser = null;
    this.isLoading = true;
  }

  // Sign in with Google (NO FIRESTORE WRITES)
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google sign-in successful');
      return result.user;
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      this.currentUser = null;
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  }

  // Auth state listener (NO FIRESTORE OPERATIONS)
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.isLoading = false;
      if (user) {
        console.log('✅ User authenticated:', user.email);
        // Store session data locally only
        localStorage.setItem('samadhi_user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString()
        }));
      } else {
        localStorage.removeItem('samadhi_user');
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

  // Get local session data
  getLocalSession() {
    const stored = localStorage.getItem('samadhi_user');
    return stored ? JSON.parse(stored) : null;
  }
}

export const localAuthService = new LocalAuthService();
export default localAuthService;