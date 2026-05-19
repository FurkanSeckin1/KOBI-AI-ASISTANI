import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ActionContext } from '../context/ActionContext';
import { Check, Square, ListTodo, Trophy, DollarSign, Activity } from 'lucide-react-native';

export default function ActionPlanScreen() {
  const { approvedActions, toggleActionCompletion } = useContext(ActionContext);

  const pendingTasks = approvedActions.filter(a => !a.completed);
  const completedTasks = approvedActions.filter(a => a.completed);

  const progressPercentage = approvedActions.length === 0 
    ? 0 
    : Math.round((completedTasks.length / approvedActions.length) * 100);

  const totalRecovered = completedTasks.reduce((acc, curr) => acc + parseInt(curr.impact.replace('.', '')), 0);

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-6 pt-16 pb-8 bg-navy-900 rounded-b-[40px] shadow-lg shadow-navy-900/50">
        <View className="flex-row items-center space-x-3">
          <ListTodo size={32} color="#facc15" />
          <Text className="text-2xl font-extrabold text-white tracking-tight">To-Do Planı</Text>
        </View>
        <Text className="text-slate-300 mt-2 text-sm leading-5">
          Fırsatlar destesinden onayladığınız aksiyonlar.
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Progress Card */}
        {approvedActions.length > 0 && (
          <View className="bg-white p-5 rounded-[24px] mb-6 shadow-sm border border-slate-100">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="font-bold text-navy-900 text-sm">Görev İlerlemesi</Text>
                <Text className="text-slate-500 text-xs mt-1">Kurtarılan: <Text className="font-bold text-emerald-500">+{totalRecovered.toLocaleString('tr-TR')} ₺</Text></Text>
              </View>
              <Text className="font-extrabold text-emerald-500 text-xl">%{progressPercentage}</Text>
            </View>
            <View className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <View 
                className="bg-emerald-500 h-full rounded-full" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </View>
            {progressPercentage === 100 && (
              <View className="flex-row items-center mt-4 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <Trophy size={20} color="#10b981" className="mr-3" />
                <Text className="text-emerald-700 text-sm font-bold flex-1">Harika! Tüm erozyon deliklerini kapattınız. Hedeflerinize bir adım daha yaklaştınız.</Text>
              </View>
            )}
          </View>
        )}

        <Text className="text-navy-900 font-extrabold text-xl mb-4">Yapılacaklar ({pendingTasks.length})</Text>
        
        {pendingTasks.length === 0 && completedTasks.length === 0 ? (
          <View className="items-center py-12 px-6 bg-white rounded-3xl border border-slate-100 border-dashed mt-2">
            <ListTodo size={48} color="#cbd5e1" className="mb-4" />
            <Text className="text-slate-400 text-center text-base font-medium">Henüz onaylanmış bir aksiyon planı yok. Fırsatlar sekmesinden önerileri onaylayarak başlayın.</Text>
          </View>
        ) : pendingTasks.length === 0 ? (
          <Text className="text-slate-400 mb-6 italic">Bekleyen görev kalmadı.</Text>
        ) : (
          pendingTasks.map((action) => (
            <View key={action.id} className="bg-white p-5 rounded-3xl mb-4 border border-slate-100 shadow-sm shadow-slate-100">
              
              <View className="flex-row items-start mb-3">
                <View className="flex-1 mr-2">
                  <View className="bg-yellow-100 self-start px-2 py-1 rounded mb-2">
                    <Text className="text-yellow-700 text-[10px] font-bold uppercase">{action.title}</Text>
                  </View>
                  <Text className="font-extrabold text-navy-900 text-[15px] leading-5">
                    {action.todoText || action.actionText}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => toggleActionCompletion(action.id)}
                  className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center border border-slate-200"
                >
                  <Square size={24} color="#eab308" />
                </TouchableOpacity>
              </View>

              <View className="h-[1px] bg-slate-100 w-full mb-3" />

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100">
                  <DollarSign size={14} color="#10b981" className="mr-1" />
                  <Text className="text-emerald-700 text-xs font-bold">Beklenen Etki: +{action.impact}₺</Text>
                </View>
                
                <View className="flex-row items-center bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100">
                  <Activity size={14} color="#3b82f6" className="mr-1" />
                  <Text className="text-blue-700 text-xs font-bold">Efor: {action.effort}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Completed Tasks Summary */}
        {completedTasks.length > 0 && (
          <View className="mt-6 mb-10">
            <Text className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-4">Tamamlananlar ({completedTasks.length})</Text>
            {completedTasks.map((action) => (
              <TouchableOpacity 
                key={`comp-${action.id}`} 
                onPress={() => toggleActionCompletion(action.id)}
                className="bg-slate-50 p-4 rounded-2xl mb-3 border border-emerald-100 opacity-70"
              >
                <View className="flex-row items-center mb-2">
                  <View className="w-6 h-6 rounded-md bg-yellow-400 items-center justify-center mr-3">
                    <Check size={16} color="#0f172a" />
                  </View>
                  <Text className="text-slate-500 text-sm flex-1 line-through font-medium">
                    {action.todoText || action.actionText}
                  </Text>
                </View>
                <View className="ml-9 flex-row">
                  <Text className="text-emerald-600 text-xs font-bold">+{action.impact}₺ Kurtarıldı</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
