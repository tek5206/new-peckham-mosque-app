import AsyncStorage from '@react-native-async-storage/async-storage';
import MosqueInfo from '../constants/mosqueInfo';

// Aladhan API (https://aladhan.com/prayer-times-api) — free, no API key required.
// method=13 => Diyanet İşleri Başkanlığı (Turkey) calculation method, which is the
// method New Peckham Mosque (an ICMG / Turkish-community mosque) is most likely to want.
// If the mosque instead follows local UK (e.g. London Unified / MWL) timings, change
// METHOD below — see https://aladhan.com/calculation-methods for the full list.
const METHOD = 13;
const CACHE_KEY = 'cached_prayer_times_v1';

const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function todayDateString() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export async function fetchTodayPrayerTimes({ latitude, longitude } = {}) {
  const lat = latitude ?? MosqueInfo.coordinates.latitude;
  const lng = longitude ?? MosqueInfo.coordinates.longitude;
  const date = todayDateString();
  const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=${METHOD}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Aladhan API error: ${response.status}`);
    const json = await response.json();
    const timings = json?.data?.timings;
    if (!timings) throw new Error('Malformed Aladhan response');

    const result = {};
    PRAYER_KEYS.forEach((key) => {
      // Strip any timezone suffix like "(BST)"
      result[key] = String(timings[key]).split(' ')[0];
    });

    const payload = {
      timings: result,
      hijriDate: json?.data?.date?.hijri?.date,
      fetchedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    return { ...payload, fromCache: false };
  } catch (err) {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      return { ...JSON.parse(cached), fromCache: true };
    }
    throw err;
  }
}

// Returns { name, time, date } for the soonest upcoming prayer (today or tomorrow's Fajr)
export function getNextPrayer(timings) {
  if (!timings) return null;
  const now = new Date();
  const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const key of order) {
    const time = timings[key];
    if (!time) continue;
    const [h, m] = time.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(h, m, 0, 0);
    if (prayerDate.getTime() > now.getTime()) {
      return { name: key, time, date: prayerDate };
    }
  }

  // All of today's prayers have passed — next one is tomorrow's Fajr
  const [h, m] = (timings.Fajr || '05:00').split(':').map(Number);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(h, m, 0, 0);
  return { name: 'Fajr', time: timings.Fajr, date: tomorrow };
}

export function formatCountdown(targetDate) {
  const diffMs = targetDate.getTime() - Date.now();
  if (diffMs <= 0) return '00:00:00';
  const totalSeconds = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

export default {
  fetchTodayPrayerTimes,
  getNextPrayer,
  formatCountdown,
};
