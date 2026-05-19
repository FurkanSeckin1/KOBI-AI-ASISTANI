import 'react-native-reanimated';
import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import { ActionProvider } from './src/context/ActionContext';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Wrapper to use ThemeContext for StatusBar style
const MainApp = () => {
  const { isDarkMode } = React.useContext(ThemeContext);
  return (
    <NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ActionProvider>
            <MainApp />
          </ActionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
