import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PUSH_TOKEN_KEY = 'expo_push_token';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Registers the device for push notifications and returns the Expo push token.
// Save this token (e.g. in a Firestore "deviceTokens" collection) from your own
// admin backend so the Cloud Function in /backend/functions can notify all users
// whenever a new announcement is posted.
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C9A24B',
    });
  }

  if (!Device.isDevice) {
    console.log('Push notifications require a physical device.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Push notification permission was not granted.');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    // projectId comes from app.json -> extra.eas.projectId (set this up with `eas init`)
    projectId: require('expo-constants').default.expoConfig?.extra?.eas?.projectId,
  });
  const token = tokenData.data;
  await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

  // TODO: send `token` to your backend / Firestore `deviceTokens` collection here,
  // e.g. await fetch(`${BACKEND_URL}/register-device`, { method: 'POST', body: JSON.stringify({ token }) })

  return token;
}

export async function getNotificationPreference() {
  const value = await AsyncStorage.getItem('notifications_enabled');
  return value === null ? true : value === 'true';
}

export async function setNotificationPreference(enabled) {
  await AsyncStorage.setItem('notifications_enabled', String(enabled));
}

export default { registerForPushNotificationsAsync, getNotificationPreference, setNotificationPreference };
