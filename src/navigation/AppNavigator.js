import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeContext } from '../context/ThemeContext';

import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Stack.Navigator 
      initialRouteName="MainTabs"
      screenOptions={{ 
        headerShown: false, 
        contentStyle: { backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' } 
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
