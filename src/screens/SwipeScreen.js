import React, { useContext } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';

export default function SwipeScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const containerClass = `flex-1 items-center justify-center ${isDarkMode ? 'bg-dark-900' : 'bg-slate-50'}`;
  const textClass = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <SafeAreaView className={containerClass}>
      <Text className={`text-lg ${textClass}`}>Fırsat Destesi Yakında...</Text>
    </SafeAreaView>
  );
}
