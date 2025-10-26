// NO STATIC FIREBASE IMPORTS - ALL FIREBASE OPERATIONS USE DYNAMIC IMPORTS
// This prevents automatic Firebase connection establishment

class LocalSessionTracker {
  constructor() {
    this.currentSession = null;
    this.startTime = null;
    this.user = null;
    this.sessions = [];
  }

  // Initialize tracking for a user
  initializeUser(user) {
    this.user = user;
    console.log('📊 Local session tracker initialized for:', user.email);
  }

  // Start a new meditation session (LOCAL ONLY)
  async startSession() {
    if (!this.user) {
      console.warn('⚠️ No user authenticated for session tracking');
      return;
    }

    this.startTime = Date.now();
    const sessionDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    this.currentSession = {
      userId: this.user.uid,
      sessionId: `${sessionDate}_${this.startTime}`,
      date: sessionDate,
      startTime: new Date(this.startTime),
      duration: 0,
      breathCycles: 0,
      phases: {
        inhale: 0,
        hold: 0,
        exhale: 0,
        void: 0
      },
      completed: false
    };

    console.log('🎯 Local meditation session started');
  }

  // Track breath cycles (LOCAL ONLY)
  trackBreathCycle() {
    if (!this.currentSession) return;
    this.currentSession.breathCycles++;
  }

  // Track phase time (LOCAL ONLY)
  trackPhaseTime(phase, duration) {
    if (!this.currentSession || !this.currentSession.phases[phase]) return;
    this.currentSession.phases[phase] += duration;
  }

  // Track phase change (LOCAL ONLY)
  trackPhaseChange(newPhase, breathCount) {
    if (!this.currentSession) return;
    console.log(`🌀 Phase transition: ${newPhase} (breath ${breathCount})`);
  }

  // End session with BATCH upload to Firebase (NO REAL-TIME STREAMS)
  async endSession(completed = true) {
    if (!this.currentSession || !this.user) return;

    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;

    this.currentSession.duration = totalDuration;
    this.currentSession.endTime = new Date(endTime);
    this.currentSession.completed = completed;

    // Always store locally first as backup
    this.storeSessionLocally();

    // Try to upload to Firebase with batch operation (no real-time streams)
    try {
      const { doc, setDoc, serverTimestamp, getFirestore } = await import('firebase/firestore');
      const db = getFirestore();
      
      const sessionDoc = doc(db, 'users', this.user.uid, 'sessions', this.currentSession.sessionId);
      
      await setDoc(sessionDoc, {
        ...this.currentSession,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: false }); // Batch write - no real-time listeners

      // Update daily stats
      await this.updateDailyTotals(this.currentSession.date, totalDuration);

      console.log(`✅ Session uploaded to Firebase: ${Math.round(totalDuration / 1000)}s`);
      
    } catch (error) {
      console.warn('⚠️ Firebase upload failed, session saved locally:', error.message);
    }

    this.currentSession = null;
    this.startTime = null;
  }

  // Update daily totals (BATCH WRITE ONLY - NO REAL-TIME STREAMS)
  async updateDailyTotals(date, duration) {
    try {
      const { doc, getDoc, setDoc, serverTimestamp, getFirestore } = await import('firebase/firestore');
      const db = getFirestore();
      
      const dailyDoc = doc(db, 'users', this.user.uid, 'dailyStats', date);
      const dailyData = await getDoc(dailyDoc);

      if (dailyData.exists()) {
        const existing = dailyData.data();
        await setDoc(dailyDoc, {
          totalDuration: existing.totalDuration + duration,
          sessionCount: existing.sessionCount + 1,
          lastSession: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: false }); // Batch operation only
      } else {
        await setDoc(dailyDoc, {
          date: date,
          totalDuration: duration,
          sessionCount: 1,
          lastSession: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      console.log('📊 Daily stats updated in Firebase');
    } catch (error) {
      console.warn('⚠️ Daily stats update failed, continuing with local data:', error.message);
    }
  }

  // Get meditation history for calendar (READ ONLY - DYNAMIC IMPORTS)
  async getMeditationHistory(startDate, endDate) {
    if (!this.user) return [];

    try {
      const { collection, query, where, getDocs, orderBy, getFirestore } = await import('firebase/firestore');
      const db = getFirestore();
      
      const dailyStatsRef = collection(db, 'users', this.user.uid, 'dailyStats');
      const q = query(
        dailyStatsRef,
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      const history = [];

      snapshot.forEach((doc) => {
        history.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return history;
    } catch (error) {
      console.error('❌ Error fetching meditation history:', error);
      return [];
    }
  }

  // Store session locally as fallback
  storeSessionLocally() {
    const localSessions = JSON.parse(localStorage.getItem('samadhi_sessions') || '[]');
    localSessions.push(this.currentSession);
    localStorage.setItem('samadhi_sessions', JSON.stringify(localSessions));
    console.log('💾 Session stored locally as fallback');
  }

  // Get current session info
  getCurrentSessionInfo() {
    if (!this.currentSession) return null;

    const now = Date.now();
    const elapsed = now - this.startTime;
    
    return {
      duration: elapsed,
      breathCycles: this.currentSession.breathCycles,
      phases: this.currentSession.phases
    };
  }

  // Check if session is active
  isSessionActive() {
    return !!this.currentSession;
  }
}

export const localSessionTracker = new LocalSessionTracker();
export default localSessionTracker;