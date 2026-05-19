import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Sparkles, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const containerClass = `flex-1 justify-center px-6 ${isDarkMode ? 'bg-dark-900' : 'bg-white'}`;
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextClass = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBgClass = isDarkMode ? 'bg-dark-800' : 'bg-slate-100';
  const inputBorderClass = isDarkMode ? 'border-dark-800' : 'border-slate-200';

  const handleLogin = () => {
    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className={containerClass}>
        
        {/* Logo / AI Icon */}
        <View className="items-center mb-12">
          <View className="bg-emerald-500 w-24 h-24 rounded-full items-center justify-center shadow-lg shadow-emerald-500/50 mb-6">
            <Sparkles color="white" size={48} />
          </View>
          <Text className={`text-3xl font-bold ${textClass}`}>KOBİ AI Asistanı</Text>
          <Text className={`text-base mt-2 text-center ${subTextClass}`}>Gizli kâr marjı erozyonunu önleyen yapay zeka gücünüz</Text>
        </View>

        {/* Form */}
        <View className="w-full mb-8">
          <View className="mb-5">
            <Text className={`text-sm font-medium mb-2 pl-1 ${textClass}`}>E-posta</Text>
            <TextInput
              className={`w-full px-5 py-4 rounded-2xl border ${inputBgClass} ${inputBorderClass} ${textClass}`}
              placeholder="sirket@ornek.com"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-8">
            <Text className={`text-sm font-medium mb-2 pl-1 ${textClass}`}>Şifre</Text>
            <View className="relative justify-center">
              <TextInput
                className={`w-full px-5 py-4 pr-14 rounded-2xl border ${inputBgClass} ${inputBorderClass} ${textClass}`}
                placeholder="••••••••"
                placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                className="absolute right-4 p-2"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff color={isDarkMode ? '#94a3b8' : '#64748b'} size={22} />
                ) : (
                  <Eye color={isDarkMode ? '#94a3b8' : '#64748b'} size={22} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            className="w-full bg-emerald-500 py-4 rounded-2xl items-center shadow-lg shadow-emerald-500/30"
            onPress={handleLogin}
          >
            <Text className="text-white font-bold text-lg">Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <TouchableOpacity className="items-center">
          <Text className={`text-base ${subTextClass}`}>
            Hesabınız yok mu? <Text className="text-emerald-500 font-bold">Şirket Kaydı Oluştur</Text>
          </Text>
        </TouchableOpacity>
        
      </View>
    </KeyboardAvoidingView>
  );
}
