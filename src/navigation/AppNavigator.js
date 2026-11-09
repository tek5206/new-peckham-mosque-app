import React from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/colors';
import { Shadows } from '../constants/theme';

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
  HomeTab: { active: 'home', inactive: 'home-outline' },
  PrayerTimesTab: { active: 'time', inactive: 'time-outline' },
  AnnouncementsTab: { active: 'megaphone', inactive: 'megaphone-outline' },
  DonateTab: { active: 'heart', inactive: 'heart-outline' },
  MoreTab: { active: 'grid', inactive: 'grid-outline' },
};

function TabIcon({ routeName, focused }) {
  const icon = TAB_ICONS[routeName];
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons
        name={focused ? icon.active : icon.inactive}
        size={23}
        color={focused ? Colors.primary : Colors.textFaint}
      />
      <View
        style={{
          marginTop: 4,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: focused ? Colors.gold : 'transparent',
        }}
      />
    </View>
  );
}

// "More" is a tiny stack so Settings lives inside the tab bar too.
function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    card: Colors.card,
    primary: Colors.primary,
    text: Colors.text,
    border: Colors.border,
  },
};

export default function AppNavigator() {
  const { t } = useTranslation();

  return (
    <NavigationContainer theme={NavTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textFaint,
          tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: -2 },
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 86 : 66,
            paddingTop: 10,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            backgroundColor: Colors.card,
            borderTopWidth: 0,
            ...Shadows.raised,
          },
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
