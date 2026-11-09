// Firebase is used for two things in this app:
//   1. Firestore — stores announcements (duyurular) so all users see the same list.
//   2. (Optional) Cloud Functions — a function in /backend/functions triggers an
//      Expo push notification whenever a new announcement document is created.
//
// Create a free Firebase project at https://console.firebase.google.com, enable
// Firestore, then paste your config below (Project settings → General → Your apps → Web app).

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME.firebaseapp.com',
  projectId: 'REPLACE_ME',
  storageBucket: 'REPLACE_ME.appspot.com',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
