import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'announcements';

// Live-subscribes to the announcements list, newest first.
// Returns an unsubscribe function — call it from a useEffect cleanup.
export function subscribeToAnnouncements(onChange, onError) {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      onChange(items);
    },
    onError
  );
}

// Called from the mosque admin's own tool/dashboard (not exposed in the public app UI).
// Creating a document here is what triggers the Cloud Function in
// /backend/functions/index.js to push a notification to all subscribed devices.
export async function createAnnouncement({ title, body, category }) {
  return addDoc(collection(db, COLLECTION), {
    title,
    body,
    category: category || 'general',
    createdAt: serverTimestamp(),
  });
}

export default { subscribeToAnnouncements, createAnnouncement };
