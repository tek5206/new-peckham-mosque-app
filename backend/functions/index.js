// Firebase Cloud Function: whenever a new document is added to the
// "announcements" Firestore collection, send an Expo push notification
// to every device token stored in the "deviceTokens" collection.
//
// Deploy with:
//   cd backend/functions && npm install
//   firebase deploy --only functions
//
// Requires: `firebase init functions` once in the backend/ folder, and
// device tokens to be written to Firestore from the app (see
// src/services/notificationService.js — wire the TODO there to call
// a small HTTPS function or your own backend endpoint that writes to
// the deviceTokens collection).

const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
admin.initializeApp();

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

exports.notifyOnNewAnnouncement = onDocumentCreated('announcements/{id}', async (event) => {
  const announcement = event.data.data();

  const tokensSnapshot = await admin.firestore().collection('deviceTokens').get();
  const tokens = tokensSnapshot.docs.map((doc) => doc.data().token).filter(Boolean);

  if (tokens.length === 0) {
    console.log('No device tokens registered — skipping push.');
    return;
  }

  const chunks = [];
  for (let i = 0; i < tokens.length; i += 100) {
    chunks.push(tokens.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    const messages = chunk.map((token) => ({
      to: token,
      sound: 'default',
      title: `New Peckham Mosque — ${announcement.title}`,
      body: announcement.body?.slice(0, 120) || '',
      data: { announcementId: event.params.id },
    }));

    await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(messages),
    });
  }

  console.log(`Sent push notification to ${tokens.length} device(s).`);
});

// Lets the app register its push token without exposing Firestore write rules publicly.
exports.registerDeviceToken = require('firebase-functions/v2/https').onRequest(
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).send('');
    }
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: 'token is required' });
      await admin.firestore().collection('deviceTokens').doc(token).set({
        token,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);
