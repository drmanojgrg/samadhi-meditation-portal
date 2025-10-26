# Firebase Setup Instructions

## 1. Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name: "tantric-meditation" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Click on "Google" provider
3. Enable it and add your email as an authorized domain
4. Save the configuration

## 3. Enable Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select your preferred region
4. Click "Done"

## 4. Get Your Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app
4. Register your app with a name
5. Copy the config object

## 5. Update Firebase Config

Replace the placeholder config in `src/firebase/config.js` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## 6. Security Rules (Optional)

For production, update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own sessions
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 7. Test the Setup

1. Run `npm run dev`
2. You should see the Google login screen
3. Sign in with your Google account
4. Access should be granted to the meditation portal
5. Your session data will be tracked in Firestore

## Features Enabled

- ✅ Google Authentication
- ✅ User session tracking
- ✅ Meditation time monitoring
- ✅ Breath count tracking
- ✅ Phase transition logging
- ✅ Protected route access
- ✅ All files under 250 LOC