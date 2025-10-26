# 🕉️ Samadhi Meditation Portal - Firebase Setup

## Firebase Project Configuration for drmanojgrg@gmail.com

### Step 1: Access Firebase Console
1. Go to https://console.firebase.google.com/
2. Sign in with **drmanojgrg@gmail.com**
3. Look for existing **"Samadhi"** project OR create new one

### Step 2: Create/Configure Samadhi Project
If project doesn't exist:
1. Click **"Create a project"**
2. Project name: **"Samadhi"** or **"samadhi-meditation"**
3. Project ID will be: **samadhi-meditation-xxxxx**
4. Enable Google Analytics (recommended)
5. Click **"Create project"**

### Step 3: Enable Authentication
1. In Firebase Console → **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Google"** provider
5. **Enable** the Google sign-in method
6. Add authorized domain: `localhost` (for development)
7. Add your production domain if deploying
8. **Save**

### Step 4: Enable Firestore Database
1. Go to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select your preferred region (us-central1 recommended)
5. Click **"Done"**

### Step 5: Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** → **Web app** (</>) 
4. App nickname: **"Samadhi Meditation Portal"**
5. **Do NOT** check "Firebase Hosting" (optional)
6. Click **"Register app"**
7. **COPY** the config object that appears

### Step 6: Update Your Code
Replace the config in `src/firebase/config.js` with your actual values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Your actual API key
  authDomain: "samadhi-meditation-xxxxx.firebaseapp.com",
  projectId: "samadhi-meditation-xxxxx",
  storageBucket: "samadhi-meditation-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 7: Set Firestore Security Rules
In Firestore Database → Rules, paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own meditation sessions
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Step 8: Test Authentication
1. Update your config in `src/firebase/config.js`
2. Run: `npm run dev`
3. Visit: http://localhost:3000
4. You should see Google sign-in screen
5. Sign in with **drmanojgrg@gmail.com**
6. Access granted to Samadhi meditation portal! 🧘‍♂️

### 📱 What Will Be Tracked:
- ✅ User authentication with Google
- ✅ Meditation session duration
- ✅ Breath cycle counts
- ✅ Phase progression (Preparation → Deep → Integration)
- ✅ Total meditation time and session statistics
- ✅ Buddhist bell and binaural audio preferences

### 🔒 Security Features:
- ✅ Google OAuth authentication only
- ✅ User data isolation in Firestore
- ✅ Protected routes (no access without login)
- ✅ Session tracking with user attribution

### 📊 Firebase Console Monitoring:
After setup, you can monitor in Firebase Console:
- **Authentication** → See user logins
- **Firestore** → View user profiles and session data
- **Usage** → Track API calls and storage usage

Once you complete these steps, your Samadhi meditation portal will have complete authentication! 🕉️✨