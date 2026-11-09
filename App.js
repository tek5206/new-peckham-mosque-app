import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n';
import { registerForPushNotificationsAsync } from './src/services/notificationService';

// TODO: replace with your real Stripe publishable key (pk_live_... or pk_test_...)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_REPLACE_ME';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier="merchant.org.newpeckhammosque.app"
      >
        <StatusBar style="light" />
        <AppNavigator />
      </StripeProvider>
    </SafeAreaProvider>
  );
}
