import { localSessionTracker } from '../services/localSessionTracker';

// Wrapper for the local session tracker
class SessionTracker {
  constructor() {
    this.localTracker = localSessionTracker;
  }

  // Initialize tracking for a user
  initializeUser(user) {
    this.localTracker.initializeUser(user);
  }

  // Start a new meditation session
  async startSession() {
    await this.localTracker.startSession();
  }

  // Track breath cycles
  trackBreathCycle() {
    this.localTracker.trackBreathCycle();
  }

  // Track phase time
  trackPhaseTime(phase, duration) {
    this.localTracker.trackPhaseTime(phase, duration);
  }

  // End the meditation session
  async endSession(completed = true) {
    await this.localTracker.endSession(completed);
  }

  // Get meditation history for calendar
  async getMeditationHistory(startDate, endDate) {
    return await this.localTracker.getMeditationHistory(startDate, endDate);
  }

  // Get current session info
  getCurrentSessionInfo() {
    return this.localTracker.getCurrentSessionInfo();
  }

  // Check if session is active
  isSessionActive() {
    return this.localTracker.isSessionActive();
  }
}

export const sessionTracker = new SessionTracker();
export default sessionTracker;