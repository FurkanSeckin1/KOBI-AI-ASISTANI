import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, Building, CreditCard, Shield, ChevronRight, ArrowLeft } from 'lucide-react-native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="pt-16 pb-4 bg-navy-900 shadow-lg shadow-navy-900/40 z-10 px-4">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center mr-2"
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-white tracking-tight">Ayarlar</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View className="bg-white rounded-[32px] p-6 mb-8 shadow-xl shadow-slate-200/50 border border-slate-100 items-center">
          <View className="w-24 h-24 rounded-full bg-navy-900 items-center justify-center mb-4 border-4 border-slate-50 shadow-md">
            <Text className="text-3xl font-black text-yellow-400">AY</Text>
          </View>
          <Text className="text-2xl font-extrabold text-navy-900 mb-1">Ahmet Yılmaz</Text>
          <Text className="text-slate-500 font-medium mb-3">Yılmaz Tekstil A.Ş.</Text>
          
          <View className="bg-yellow-100 px-4 py-1.5 rounded-full border border-yellow-200">
            <Text className="text-yellow-700 font-bold text-xs uppercase tracking-widest">AI Premium Üye</Text>
          </View>
        </View>

        <Text className="text-navy-900 font-extrabold text-lg mb-4 ml-2">Hesap Yönetimi</Text>

        {/* Menu Items */}
        <View className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 mb-10">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-slate-100 active:bg-slate-50">
            <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4">
              <Building size={20} color="#0f172a" />
            </View>
            <Text className="font-bold text-navy-900 text-base flex-1">Şirket Bilgileri</Text>
            <ChevronRight size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 border-b border-slate-100 active:bg-slate-50">
            <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4">
              <CreditCard size={20} color="#0f172a" />
            </View>
            <Text className="font-bold text-navy-900 text-base flex-1">Fatura ve Planlar</Text>
            <ChevronRight size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 active:bg-slate-50">
            <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4">
              <Shield size={20} color="#0f172a" />
            </View>
            <Text className="font-bold text-navy-900 text-base flex-1">Güvenlik Ayarları</Text>
            <ChevronRight size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>
        
        {/* Logout */}
        <TouchableOpacity className="items-center justify-center py-4 mb-10">
          <Text className="text-red-500 font-bold text-base">Hesaptan Çıkış Yap</Text>
        </TouchableOpacity>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
