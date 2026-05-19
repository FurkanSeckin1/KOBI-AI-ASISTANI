import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Activity, TrendingDown, DollarSign, Target, PieChart, TrendingUp } from 'lucide-react-native';
import { ActionContext } from '../context/ActionContext';

export default function SummaryScreen() {
  const { pendingActions, approvedActions, rejectedActions } = useContext(ActionContext);
  
  // Dynamic Calculations
  const allActions = [...pendingActions, ...approvedActions, ...rejectedActions];
  
  // KOBİ görevi onaylayıp "completed" (tiklenmiş) yaptıysa bu zararı toplam kayıptan DÜŞ (Kalan Kayıp)
  const totalLeakage = allActions.reduce((acc, curr) => {
    if (curr.completed) return acc;
    const val = parseInt((curr.impact || '0').replace(/\./g, '').replace(/,/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  // Sadece kalan (tamamlanmamış) zararların kategori bazlı dağılımı
  let logisticVal = 0;
  let supplyVal = 0;
  let opsVal = 0;
  
  allActions.filter(a => !a.completed).forEach(a => {
    const title = (a.title || '').toLowerCase();
    const val = parseInt((a.impact || '0').replace(/\./g, '').replace(/,/g, '')) || 0;
    
    if (title.includes('lojistik') || title.includes('kargo')) logisticVal += val;
    else if (title.includes('tedarik') || title.includes('hammadde')) supplyVal += val;
    else opsVal += val;
  });

  const totalCalc = logisticVal + supplyVal + opsVal || 1; // Prevent division by zero
  
  const logisticPct = Math.round((logisticVal / totalCalc) * 100);
  const supplyPct = Math.round((supplyVal / totalCalc) * 100);
  const opsPct = 100 - logisticPct - supplyPct;

  // Potential improvement from approved actions
  const totalApproved = approvedActions.reduce((acc, curr) => {
    const val = parseInt((curr.impact || '0').replace(/\./g, '').replace(/,/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  
  // Başlangıçtaki toplam zararı bul (başarı oranını hesaplamak için)
  const initialTotalLeak = allActions.reduce((acc, curr) => {
    const val = parseInt((curr.impact || '0').replace(/\./g, '').replace(/,/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 1);

  const improvementRatio = ((totalApproved / initialTotalLeak) * 5).toFixed(1); // Fake projection math multiplier

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-6 pt-16 pb-8 bg-navy-900 rounded-b-[40px] shadow-lg shadow-navy-900/50">
        <Text className="text-2xl font-bold text-white tracking-tight">Finansal Derinlik</Text>
        <Text className="text-slate-300 mt-2 text-sm">Gizli Erozyon ve Kar Analizi</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Main KPI Card - Current Leakage */}
        <View className="bg-yellow-400 rounded-[32px] p-6 mb-4 shadow-sm shadow-yellow-400/30 border border-yellow-300 flex-row items-center relative overflow-hidden">
          <View className="absolute -right-4 -top-4 opacity-10">
            <Target size={120} color="#0f172a" />
          </View>
          <View className="w-14 h-14 rounded-full bg-white/30 items-center justify-center mr-4">
            <DollarSign size={28} color="#0f172a" />
          </View>
          <View className="flex-1">
            <Text className="text-navy-900/70 text-xs font-bold uppercase tracking-wider mb-1">Güncel Sızıntı Tutarı</Text>
            <Text className="text-4xl font-extrabold text-navy-900">₺{totalLeakage.toLocaleString('tr-TR')}</Text>
            <View className="bg-navy-900/10 self-start px-2 py-1 rounded-md mt-2">
              <Text className="text-navy-900 text-[10px] font-bold">Aksiyonlarla Birlikte Düşer</Text>
            </View>
          </View>
        </View>

        {/* Grid Stats */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-white rounded-[24px] p-5 flex-1 mr-2 shadow-sm shadow-slate-200 border border-slate-100">
            <View className="flex-row items-center justify-between mb-3">
              <Activity size={24} color="#10b981" />
              <View className="bg-emerald-50 px-2 py-1 rounded">
                <Text className="text-emerald-600 text-[10px] font-bold">+{improvementRatio}%</Text>
              </View>
            </View>
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Potansiyel Artış</Text>
            <Text className="text-2xl font-bold text-navy-900">%24.2</Text>
          </View>

          <View className="bg-white rounded-[24px] p-5 flex-1 ml-2 shadow-sm shadow-slate-200 border border-slate-100">
            <View className="flex-row items-center justify-between mb-3">
              <TrendingDown size={24} color="#ef4444" />
              <View className="bg-red-50 px-2 py-1 rounded">
                <Text className="text-red-600 text-[10px] font-bold">-0.8%</Text>
              </View>
            </View>
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Aylık Erozyon Trendi</Text>
            <Text className="text-2xl font-bold text-navy-900">%4.5</Text>
          </View>
        </View>

        {/* Category Based Leakage Progress Bars */}
        <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm shadow-slate-200 border border-slate-100">
          <View className="flex-row items-center mb-6">
            <PieChart size={20} color="#0f172a" className="mr-2" />
            <Text className="font-bold text-navy-900 text-lg">Güncel Erozyon Kök Nedenleri</Text>
          </View>
          
          <View className="space-y-5">
            {/* Logistic */}
            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-semibold text-navy-900">Lojistik ve Kargo</Text>
                <Text className="text-sm font-bold text-red-500">%{logisticPct} (₺{logisticVal.toLocaleString('tr-TR')})</Text>
              </View>
              <View className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <View className="bg-red-500 h-full rounded-full" style={{ width: `${logisticPct}%` }} />
              </View>
            </View>

            {/* Operation */}
            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-semibold text-navy-900">Operasyon & Depolama</Text>
                <Text className="text-sm font-bold text-yellow-500">%{opsPct} (₺{opsVal.toLocaleString('tr-TR')})</Text>
              </View>
              <View className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <View className="bg-yellow-400 h-full rounded-full" style={{ width: `${opsPct}%` }} />
              </View>
            </View>

            {/* Supply */}
            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-semibold text-navy-900">Tedarikçi Maliyetleri</Text>
                <Text className="text-sm font-bold text-emerald-500">%{supplyPct} (₺{supplyVal.toLocaleString('tr-TR')})</Text>
              </View>
              <View className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <View className="bg-emerald-400 h-full rounded-full" style={{ width: `${supplyPct}%` }} />
              </View>
            </View>
          </View>
        </View>

        <View className="bg-navy-900 rounded-[32px] p-6 mb-4 shadow-md shadow-navy-900/30 relative overflow-hidden flex-row items-center">
          <View className="absolute right-0 opacity-20">
            <TrendingUp size={100} color="#ffffff" />
          </View>
          <View className="flex-1 pr-4">
            <Text className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Gelecek Projeksiyonu</Text>
            <Text className="text-white text-base leading-5">Aksiyon planındaki görevleri tamamlayarak önümüzdeki ay kar marjınızı <Text className="font-bold text-emerald-400">%{improvementRatio} oranında</Text> artırabilirsiniz.</Text>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
