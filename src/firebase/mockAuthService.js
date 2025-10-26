// Mock Authentication Service (for testing without Firebase)
// Use this temporarily if you haven't set up Firebase yet

class MockAuthService {
  constructor() {
    this.currentUser = null;
    this.isLoading = false;
  }

  // Mock Google Sign In
  async signInWithGoogle() {
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user
      const mockUser = {
        uid: 'mock-user-123',
        email: 'drmanojgrg@gmail.com',
        displayName: 'Dr. Manoj',
        photoURL: 'https://via.placeholder.com/150'
      };
      
      this.currentUser = mockUser;
      console.log('🕉️ Mock Samadhi authentication successful');
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('❌ Mock authentication error:', error);
      return { success: false, error: 'Mock authentication failed' };
    }
  }

  // Mock Sign Out
  async signOutUser() {
    this.currentUser = null;
    console.log('✅ Mock user signed out');
    return { success: true };
  }

  // Mock auth state listener
  onAuthStateChange(callback) {
    // Simulate initial loading
    setTimeout(() => {
      callback(this.currentUser);
    }, 500);
    
    // Return unsubscribe function
    return () => {};
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  // Mock user document creation
  async createUserDocument(user) {
    console.log('📝 Mock user document created for:', user.email);
  }

  async updateLastLogin(uid) {
    console.log('⏰ Mock last login updated for:', uid);
  }
}

// Export mock service
export const mockAuthService = new MockAuthService();

// Instructions for switching back to real Firebase:
// 1. Set up your Firebase project
// 2. Update src/firebase/config.js with real credentials  
// 3. Import authService from './firebase/authService' instead of this file