import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import en from './locales/en.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';

export const LANGUAGE_STORAGE_KEY = 'app_language';
export const RTL_LANGUAGES = ['ar'];

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  ar: { translation: ar },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'tr', // default language — mosque's primary community language
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v3',
});

// Call this once on app start (and whenever the user changes language) to
// keep RTL layout in sync with Arabic. A full RTL flip on native requires
// an app restart, which Expo Updates / expo-dev-client can trigger.
export async function applyLanguage(lang) {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  await i18n.changeLanguage(lang);
  const shouldBeRTL = RTL_LANGUAGES.includes(lang);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.forceRTL(shouldBeRTL);
    // In production, prompt the user to restart the app (Updates.reloadAsync())
    // so native RTL layout fully applies.
  }
}

export async function loadStoredLanguage() {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored) {
    await applyLanguage(stored);
  }
  return stored || 'tr';
}

export default i18n;
