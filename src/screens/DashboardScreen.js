import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react-native';

export default function DashboardScreen() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const containerClass = `flex-1 ${isDarkMode ? 'bg-dark-900' : 'bg-slate-50'}`;
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const headerClass = `flex-row justify-between items-center px-6 py-4 border-b ${isDarkMode ? 'border-dark-800 bg-dark-900' : 'border-slate-200 bg-white'}`;

  return (
    <SafeAreaView className={containerClass} edges={['top']}>
      {/* Header */}
      <View className={headerClass}>
        <View>
          <Text className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Günaydın</Text>
          <Text className={`text-xl font-bold ${textClass}`}>Hoş Geldin, KOBİ A.Ş.</Text>
        </View>
        <TouchableOpacity 
          onPress={toggleTheme}
          className={`p-2.5 rounded-full ${isDarkMode ? 'bg-dark-800' : 'bg-slate-100'}`}
        >
          {isDarkMode ? (
            <Sun color="#10b981" size={24} />
          ) : (
            <Moon color="#10b981" size={24} />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center p-6">
        <Text className={`text-lg text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Ana Sayfa içeriği yakında burada yer alacak.
        </Text>
      </View>
    </SafeAreaView>
  );
}
