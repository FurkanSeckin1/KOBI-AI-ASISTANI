import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BarChart3, PieChart, ShieldCheck, Target, TrendingUp } from 'lucide-react-native';
import { ActionContext } from '../context/ActionContext';

export default function ChartsScreen() {
  const { pendingActions, approvedActions, rejectedActions } = useContext(ActionContext);
  
  // Hesaplamalar
  const allActions = [...pendingActions, ...approvedActions, ...rejectedActions];
  
  // KOBİ görevi onaylayıp "completed" (tiklenmiş) yaptıysa bu zararı toplam kayıptan düş!
  const totalLeakageStr = allActions.reduce((acc, curr) => {
    if (curr.completed) return acc;
    const val = parseInt((curr.impact || '0').replace(/\./g, '').replace(/,/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  
  // Onaylanan (ve onaylanıp da tamamlananlar dahil)
  const totalApprovedStr = approvedActions.reduce((acc, curr) => {
    const val = parseInt((curr.impact || '0').replace(/\./g, '').replace(/,/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  // Başarı skoru = Toplam Kurtarılan Bütçe / Toplam Bulunan Sızıntı
  const totalFoundLeakage = allActions.reduce((acc, curr) => {
    const val = parseInt((curr.impact || '0').replace(/\./g, '').replace(/,/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const aiSuccessScore = totalFoundLeakage > 0 ? Math.round((totalApprovedStr / totalFoundLeakage) * 100) : 0;
  
  // Basit kategori analizi (title üzerinden ve sadece TAMAMLANMAMIŞ zararları gösterir)
  let logisticCount = 0;
  let opsCount = 0;
  let supplyCount = 0;
  
  allActions.filter(a => !a.completed).forEach(a => {
    const title = a.title.toLowerCase();
    if (title.includes('lojistik') || title.includes('kargo')) logisticCount++;
    else if (title.includes('tedarik') || title.includes('hammadde')) supplyCount++;
    else opsCount++;
  });
  
  const totalCount = (logisticCount + opsCount + supplyCount) || 1;
  const logisticPct = Math.round((logisticCount / totalCount) * 100);
  const supplyPct = Math.round((supplyCount / totalCount) * 100);
  const opsPct = 100 - logisticPct - supplyPct;

  return (
    <View className="flex-1 bg-slate-100">
      <View className="px-6 pt-16 pb-6 bg-navy-900 rounded-b-[40px] shadow-lg shadow-navy-900/50">
        <Text className="text-2xl font-extrabold text-white tracking-tight">Finansal Komuta Merkezi</Text>
        <Text className="text-slate-300 mt-2 text-sm">Gelişmiş İstatistikler ve Sektörel Analiz</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Top Summary Cards */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-yellow-400 rounded-[24px] p-5 flex-1 mr-2 shadow-md shadow-yellow-400/30 border border-yellow-300 relative overflow-hidden">
            <View className="absolute -right-4 -bottom-4 opacity-20">
              <Target size={80} color="#0f172a" />
            </View>
            <Text className="text-navy-900/80 text-[10px] font-extrabold uppercase tracking-widest mb-2">Güncel Kayıp Tahmini</Text>
            <Text className="text-2xl font-black text-navy-900">₺{totalLeakageStr.toLocaleString('tr-TR')}</Text>
            <Text className="text-navy-900/70 text-xs font-bold mt-1">Kurtarılabilir Bütçe</Text>
          </View>

          <View className="bg-emerald-500 rounded-[24px] p-5 flex-1 ml-2 shadow-md shadow-emerald-500/30 border border-emerald-400 relative overflow-hidden">
            <View className="absolute -right-4 -bottom-4 opacity-20">
              <ShieldCheck size={80} color="#0f172a" />
            </View>
            <Text className="text-emerald-900/80 text-[10px] font-extrabold uppercase tracking-widest mb-2">AI Başarı Skoru</Text>
            <Text className="text-3xl font-black text-white">%{aiSuccessScore}</Text>
            <Text className="text-emerald-100 text-xs font-bold mt-1">Onaylanan İyileştirme</Text>
          </View>
        </View>

        {/* Erosion Distribution */}
        <View className="bg-white rounded-[32px] p-6 mb-6 shadow-xl shadow-slate-200/50 border border-slate-100">
          <View className="flex-row items-center mb-6">
            <PieChart size={20} color="#0f172a" className="mr-2" />
            <Text className="font-extrabold text-navy-900 text-lg">Güncel Erozyon Dağılımı</Text>
          </View>
          
          <View className="flex-row items-center justify-between mb-4">
            <View className="w-24 h-24 rounded-full border-[12px] border-slate-100 items-center justify-center relative overflow-hidden">
              <View className="absolute top-0 right-0 w-12 h-12 bg-red-500" style={{ height: `${opsPct}%` }} />
              <View className="absolute bottom-0 right-0 w-12 h-12 bg-yellow-400" style={{ height: `${supplyPct}%` }} />
              <View className="absolute top-0 left-0 w-12 h-24 bg-blue-500" style={{ height: `${logisticPct}%` }} />
              <View className="w-16 h-16 bg-white rounded-full z-10 items-center justify-center">
                <Text className="text-navy-900 font-extrabold text-xs">Kalan</Text>
              </View>
            </View>

            <View className="flex-1 ml-6 space-y-3">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                <Text className="text-slate-600 text-xs font-bold flex-1">Lojistik Kaybı</Text>
                <Text className="text-navy-900 text-xs font-black">%{logisticPct}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                <Text className="text-slate-600 text-xs font-bold flex-1">Operasyonel</Text>
                <Text className="text-navy-900 text-xs font-black">%{opsPct}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                <Text className="text-slate-600 text-xs font-bold flex-1">Tedarik Zinciri</Text>
                <Text className="text-navy-900 text-xs font-black">%{supplyPct}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Loss Trend Bar Chart */}
        <View className="bg-white rounded-[32px] p-6 mb-6 shadow-xl shadow-slate-200/50 border border-slate-100">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <BarChart3 size={20} color="#eab308" className="mr-2" />
              <Text className="font-extrabold text-navy-900 text-lg">Aylık Kayıp Trendi</Text>
            </View>
            <View className="bg-emerald-100 px-2 py-1 rounded">
              <Text className="text-emerald-700 text-[10px] font-bold">-%12 İyileşme</Text>
            </View>
          </View>
          
          <View className="flex-row items-end justify-between h-40 pt-4 border-b border-l border-slate-200 pl-2 pb-2 relative">
            <Text className="absolute left-[-24px] top-0 text-[10px] font-bold text-slate-400">10k</Text>
            <Text className="absolute left-[-24px] top-1/2 -mt-2 text-[10px] font-bold text-slate-400">5k</Text>
            
            {/* Mockup Vertical Bars Side by Side */}
            {[
              { label: 'Oca', loss: 80, prev: 60 },
              { label: 'Şub', loss: 90, prev: 70 },
              { label: 'Mar', loss: 60, prev: 90 },
              { label: 'Nis', loss: 40, prev: 80 },
              { label: 'May', loss: 30, prev: 85 },
            ].map((col, idx) => (
              <View key={idx} className="items-center flex-1">
                <View className="flex-row items-end h-full">
                  <View className="w-2.5 bg-slate-300 rounded-t-sm mx-[1px]" style={{ height: `${col.prev}%` }} />
                  <View className="w-2.5 bg-red-500 rounded-t-sm mx-[1px]" style={{ height: `${col.loss}%` }} />
                </View>
                <Text className="text-[10px] font-bold text-slate-500 mt-2">{col.label}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row justify-center mt-4">
            <View className="flex-row items-center mr-4">
              <View className="w-3 h-3 bg-slate-300 rounded-sm mr-1" />
              <Text className="text-[10px] font-bold text-slate-500">Geçen Yıl</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-red-500 rounded-sm mr-1" />
              <Text className="text-[10px] font-bold text-slate-500">Bu Yıl (Kayıp)</Text>
            </View>
          </View>
        </View>

        {/* Industry Benchmark */}
        <View className="bg-white rounded-[32px] p-6 mb-4 shadow-xl shadow-slate-200/50 border border-slate-100">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <TrendingUp size={20} color="#0f172a" className="mr-2" />
              <Text className="font-extrabold text-navy-900 text-lg">Sektörel Benchmark</Text>
            </View>
          </View>

          <Text className="text-slate-500 text-sm font-medium mb-4">Firmanızın ortalama kar marjı potansiyeli sektörün gerisinde. Ancak aldığınız AI aksiyonları bu arayı kapatıyor.</Text>

          <View className="space-y-4">
            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs font-bold text-navy-900">Sizin İşletmeniz</Text>
                <Text className="text-xs font-black text-emerald-500">Marj Kaybı: %4.5</Text>
              </View>
              <View className="w-full bg-slate-100 h-6 rounded-md overflow-hidden">
                <View className="bg-emerald-500 h-full w-[45%]" />
              </View>
            </View>
            
            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs font-bold text-slate-500">Sektör Ortalaması</Text>
                <Text className="text-xs font-black text-slate-500">Marj Kaybı: %8.2</Text>
              </View>
              <View className="w-full bg-slate-100 h-6 rounded-md overflow-hidden">
                <View className="bg-slate-400 h-full w-[82%]" />
              </View>
            </View>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
