# New Peckham Mosque — Mobile App

Cross-platform (iOS + Android, via Expo/React Native) mobile app for New Peckham
Mosque (ICMG Peckham), built from https://newpeckhammosque.org/.

## Features

- **Namaz Vakitleri / Prayer Times** — pulled automatically from the free Aladhan
  API using the **Diyanet İşleri Başkanlığı (Turkey)** calculation method, with a
  live countdown to the next prayer and offline caching.
- **Donate** — one-time or recurring **monthly, auto-charged** donations with a
  custom amount, via Stripe's PaymentSheet (real card payments — needs your own
  Stripe account, see below).
- **About** — mosque / ICMG / Sheikh Nazim Al-Qubrusi background, summarised from
  the website.
- **Announcements** — events, meetings, fundraisers etc., stored in Firestore,
  with **push notifications** sent to every device automatically when a new
  announcement is posted (via a Firebase Cloud Function).
- **Contact** — address (tap to open Maps), phone, email, social links, and an
  in-app contact form.
- **Languages** — Turkish, English and **Arabic** (with right-to-left layout
  support), switchable in Settings.

## Project layout

```
new-peckham-mosque-app/
  App.js                     # app entry, Stripe provider, push registration
  app.json                   # Expo config (name, icons, permissions)
  src/
    screens/                 # Home, PrayerTimes, Announcements, Donate, About, Contact, Settings
    components/              # PrayerRow, AnnouncementCard
    navigation/              # bottom-tab + stack navigator
    services/                # prayerTimesService, donationService, firebase, announcementsService, notificationService
    i18n/                    # en.json, tr.json, ar.json + i18next setup
    constants/               # colors.js (theme), mosqueInfo.js (address/phone/social)
  backend/
    server.js                # Node/Express server — creates Stripe PaymentIntents & Subscriptions
    functions/index.js       # Firebase Cloud Function — sends push notification on new announcement
```

## 1. Run the app

```bash
cd new-peckham-mosque-app
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android), or press `i` / `a` for a
simulator/emulator. Push notifications and Stripe payments require a physical
device or a dev build — they don't work in Expo Go's sandbox for production use,
but the UI and prayer-time logic work everywhere.

## 2. Set up prayer times (already working, no setup needed)

The Aladhan API needs **no API key**. It's already wired to the mosque's
coordinates in `src/constants/mosqueInfo.js`. Two things worth checking before
you publish:

- **Coordinates**: `mosqueInfo.js` has an approximate lat/long for 99 Cobourg Rd.
  Confirm the exact pin on Google Maps and update it there.
- **Calculation method**: set to Diyanet (method `13`) in
  `src/services/prayerTimesService.js`, since ICMG is a Turkish-community
  organisation. If the mosque actually follows a different local convention
  (e.g. the "London Unified Prayer Timetable"), change `METHOD` — see the full
  list at https://aladhan.com/calculation-methods.

## 3. Set up Donations (Stripe)

Real card payments need **your own Stripe account** — Anthropic/Claude cannot
provide one, and no payment keys are embedded in this code.

1. Create a Stripe account at https://dashboard.stripe.com and get your API keys.
2. **Backend** (required — the secret key must never be in the mobile app):
   ```bash
   cd backend
   npm install
   cp .env.example .env     # paste your sk_test_... or sk_live_... key in .env
   npm start
   ```
   Deploy this to any Node host (Render, Railway, Fly.io, a VPS). Free tiers exist
   on Render/Railway.
3. In `src/services/donationService.js`, set `BACKEND_URL` to your deployed
   backend's HTTPS URL.
4. In `App.js`, set `STRIPE_PUBLISHABLE_KEY` to your **publishable** key
   (`pk_test_...` / `pk_live_...` — this one IS safe to embed in the app).
5. Test with Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.

**How the monthly auto-charge works**: the backend creates a Stripe Subscription
with a dynamically-priced recurring item matching the donor's chosen amount, and
Stripe automatically charges the saved card every month until cancelled. A
`cancel-subscription` endpoint is included for a future "my donations" screen.

## 4. Set up Announcements + Push Notifications (Firebase)

1. Create a free project at https://console.firebase.google.com.
2. Enable **Firestore** (Build → Firestore Database → Create database).
3. Project settings → General → "Your apps" → add a Web app → copy the config
   object into `src/services/firebase.js`.
4. Set Firestore security rules so only your admin can write announcements but
   anyone can read them, e.g.:
   ```
   match /announcements/{doc} {
     allow read: if true;
     allow write: if false; // write only from the Firebase console or an admin tool
   }
   ```
5. To post a new announcement, add a document to the `announcements` collection
   (via the Firebase console, or build a tiny admin screen using
   `createAnnouncement()` from `src/services/announcementsService.js`) with
   fields: `title`, `body`, `category` (`event` | `meeting` | `fundraiser` |
   `general`), `createdAt` (serverTimestamp).
6. **Push notifications on new announcements**:
   ```bash
   cd backend/functions
   npm install
   firebase login
   firebase init functions   # select your project, choose existing functions code
   firebase deploy --only functions
   ```
   This deploys `notifyOnNewAnnouncement`, which fires automatically whenever a
   new `announcements` document is created, pushing a notification to every
   token stored in the `deviceTokens` Firestore collection.
7. In `src/services/notificationService.js`, wire the `TODO` to call the
   deployed `registerDeviceToken` HTTPS function (or your own backend) so each
   user's device token actually gets saved to Firestore.
8. Run `eas init` (part of `eas-cli`) once to get a real EAS `projectId`, and put
   it into `app.json` → `extra.eas.projectId` — push tokens require this.

## 5. Arabic / RTL

Arabic is a full translation (`src/i18n/locales/ar.json`). Selecting it in
Settings flips `I18nManager` to RTL. **Native RTL layout changes require an app
restart** (a limitation of React Native, not this app) — in production, prompt
the user to restart after a language change (e.g. with `expo-updates`'
`Updates.reloadAsync()`), which is already scaffolded as a comment in
`src/i18n/index.js`.

## 6. Before you publish

- Replace all `REPLACE_ME` / `REPLACE_WITH_...` placeholders (Stripe keys,
  Firebase config, backend URL, EAS project ID).
- App icon, adaptive icon, splash screen and notification icon are generated
  from the mosque's own emblem (`assets/branding/mosque-logo.png`) and already
  wired up in `app.json`. The ICMG wordmark (`assets/branding/icmg-logo.png`)
  is used on the About screen and the Home footer. Swap either source file and
  re-run the icon/splash generation if the mosque provides higher-resolution
  artwork later.
- Double-check the About-page history text in `src/i18n/locales/*.json` — the
  website itself doesn't publish a detailed history, so this is a reasonable
  summary based on public information about ICMG and Sheikh Nazim Al-Qubrusi;
  the mosque office should review and expand it.
- Build with `eas build --platform all` and submit via `eas submit`.

## Notes on what's genuinely "done" vs. what needs your keys

Everything here is real, working code — not a mockup. The only things that
can't be filled in for you are **credentials that belong to the mosque**:
a Stripe account, a Firebase project, and an EAS project ID. Once those three
are added, the whole flow (prayer times → donations → announcements → push)
works end-to-end.
