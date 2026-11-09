import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import PrayerTimesScreen from '../screens/PrayerTimesScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import DonateScreen from '../screens/DonateScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  HomeTab: '🏠',
  PrayerTimesTab: '🕐',
  AnnouncementsTab: '📢',
  DonateTab: '🤲',
  MoreTab: '☰',
};

function TabIcon({ routeName, focused }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{TAB_ICONS[routeName]}</Text>
  );
}

// "More" is a tiny stack so Settings lives inside the tab bar too.
function MoreStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: t('settings.title'), headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{ title: t('about.title'), headerShown: false }}
      />
      <Stack.Screen
        name="ContactScreen"
        component={ContactScreen}
        options={{ title: t('contact.title'), headerShown: false }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: t('settings.title'), headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
          tabBarStyle: { paddingTop: 4, height: 60 },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: t('tabs.home') }} />
        <Tab.Screen
          name="PrayerTimesTab"
          component={PrayerTimesScreen}
          options={{ title: t('tabs.prayerTimes') }}
        />
        <Tab.Screen
          name="AnnouncementsTab"
          component={AnnouncementsScreen}
          options={{ title: t('tabs.announcements') }}
        />
        <Tab.Screen
          name="DonateTab"
          component={DonateScreen}
          options={{ title: t('tabs.donate') }}
        />
        <Tab.Screen name="MoreTab" component={MoreStack} options={{ title: t('tabs.more') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
