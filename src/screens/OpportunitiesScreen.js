import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, Modal, KeyboardAvoidingView, TextInput, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Bot, Check, X, MessageSquare, TrendingDown, Undo2, ArrowUpRight, ShieldAlert, Send, Settings } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ActionContext } from '../context/ActionContext';
import { chatWithAI } from '../services/geminiService';

const { width } = Dimensions.get('window');

export default function OpportunitiesScreen() {
  const navigation = useNavigation();
  const { pendingActions, approvedActions, rejectedActions, isLoadingData, approveAction, rejectAction, undoAction } = useContext(ActionContext);
  const [activeTab, setActiveTab] = useState('all');
  
  // Chat State
  const [modalVisible, setModalVisible] = useState(false);
  const [activeAiContext, setActiveAiContext] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const flatListRef = useRef(null);
  const chatScrollRef = useRef(null);

  const handleAction = (item, isApproved) => {
    if (isApproved) {
      approveAction(item);
    } else {
      rejectAction(item);
    }
  };

  const handleUndo = (item, fromType) => {
    undoAction(item, fromType);
  };

  const openAiChat = (item) => {
    setActiveAiContext(item);
    setMessages([
      {
        id: '1',
        role: 'ai',
        text: `Merhaba! "${item.title}" sızıntısını önlemek için 3 adımlık detaylı bir optimizasyon planı hazırladım. Hedefimiz marjı %${item.potentialMargin}'e çekmek. Hemen incelemek ve eyleme geçmek ister misiniz?`
      }
    ]);
    setModalVisible(true);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isChatLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const aiResponse = await chatWithAI(activeAiContext, userMsg);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen daha sonra tekrar deneyin.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      setTimeout(() => chatScrollRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const renderOpportunityCard = ({ item }) => {
    const maxMargin = Math.max((item.potentialMargin || 25) + 5, 25);
    const currentProgress = ((item.currentMargin || 10) / maxMargin) * 100;
    const potentialProgress = (((item.potentialMargin || 15) - (item.currentMargin || 10)) / maxMargin) * 100;

    return (
      <View style={{ width: width - 40 }} className="bg-navy-900 rounded-[32px] p-6 shadow-2xl shadow-navy-900/60 border border-navy-800 mx-5 my-2 flex-1 justify-between flex-col">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 rounded-full bg-red-500/20 items-center justify-center mr-4 border border-red-500/30">
            <TrendingDown size={24} color="#fca5a5" />
          </View>
          <Text className="flex-1 text-xl font-extrabold text-white">{item.title}</Text>
        </View>

        {/* Flexible Scroll Area for Content */}
        <ScrollView className="flex-1 mb-2" showsVerticalScrollIndicator={false}>
          <Text className="text-slate-300 leading-6 mb-5 text-[15px] font-medium">{item.description}</Text>

          {/* Marj İyileşme Potansiyeli Visualization */}
          <View className="bg-navy-800 rounded-2xl p-4 mb-5 border border-navy-700">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Marj İyileşme Potansiyeli</Text>
            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-300 text-sm font-bold">Mevcut: %{item.currentMargin}</Text>
              <Text className="text-emerald-400 text-sm font-extrabold">Potansiyel: %{item.potentialMargin}</Text>
            </View>
            <View className="h-3 w-full bg-navy-900 rounded-full flex-row overflow-hidden border border-navy-700 mt-1">
              <View style={{ width: `${currentProgress}%` }} className="h-full bg-slate-500 rounded-l-full" />
              <View style={{ width: `${potentialProgress}%` }} className="h-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
            </View>
          </View>
        </ScrollView>

        {/* AI Button */}
        <TouchableOpacity 
          onPress={() => openAiChat(item)}
          className="flex-row items-center justify-center py-3 bg-white/10 rounded-2xl mb-4 border border-white/5 active:bg-white/20"
        >
          <MessageSquare size={18} color="#facc15" className="mr-2" />
          <Text className="text-white font-bold text-sm">AI ile Detaylı Konuş</Text>
        </TouchableOpacity>

        {/* Badges / Insights */}
        <View className="flex-row flex-wrap mb-2 justify-start">
          <View className="flex-row items-center bg-emerald-500/20 px-3 py-1.5 rounded-full mr-2 mb-2 border border-emerald-500/30">
            <ArrowUpRight size={14} color="#34d399" className="mr-1" />
            <Text className="text-emerald-300 text-xs font-bold">Kayıp: {item.impact}₺</Text>
          </View>
          <View className="flex-row items-center bg-yellow-400/20 px-3 py-1.5 rounded-full mr-2 mb-2 border border-yellow-400/30">
            <ShieldAlert size={14} color="#fde047" className="mr-1" />
            <Text className="text-yellow-300 text-xs font-bold">Risk: {item.risk}</Text>
          </View>
          <View className="flex-row items-center bg-blue-400/20 px-3 py-1.5 rounded-full mb-2 border border-blue-400/30">
            <Text className="text-blue-300 text-xs font-bold">Efor: {item.effort}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row justify-between items-center mt-2">
          <TouchableOpacity 
            onPress={() => handleAction(item, false)}
            className="flex-1 h-14 mr-2 rounded-2xl bg-navy-800 border border-navy-700 items-center justify-center flex-row active:bg-navy-700"
          >
            <X size={20} color="#94a3b8" className="mr-2" />
            <Text className="text-slate-300 font-bold">Yoksay</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleAction(item, true)}
            className="flex-1 h-14 ml-2 rounded-2xl bg-yellow-400 items-center justify-center flex-row shadow-lg shadow-yellow-400/20 active:bg-yellow-500"
          >
            <Check size={20} color="#0f172a" className="mr-2" />
            <Text className="text-navy-900 font-extrabold">Onayla</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderArchivedList = (data, type) => {
    if (data.length === 0) {
      return (
        <View className="items-center justify-center mt-20 px-5">
          <Text className="text-slate-400 text-center text-lg font-medium">Bu listede henüz işlem yapılmış bir fırsat bulunmuyor.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="bg-white p-5 rounded-3xl mb-4 border border-slate-200 shadow-sm flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="font-bold text-navy-900 text-base mb-1">{item.title}</Text>
              <Text className="text-slate-500 text-sm line-clamp-2">{item.description}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleUndo(item, type)}
              className="bg-slate-100 p-3 rounded-2xl active:bg-slate-200 border border-slate-200"
            >
              <Undo2 size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  return (
    <View className="flex-1 bg-slate-100">
      {/* Header */}
      <View className="pt-16 pb-4 bg-navy-900 shadow-lg shadow-navy-900/40 z-10">
        <View className="px-6 flex-row items-center justify-between mb-6">
          <View className="flex-row items-center space-x-3">
            <Bot size={32} color="#facc15" />
            <Text className="text-2xl font-extrabold text-white tracking-tight">AI Aksiyon Analizi</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Settings')}
            className="w-10 h-10 rounded-full bg-navy-800 items-center justify-center border border-navy-700"
          >
            <Settings size={20} color="#facc15" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View className="px-5 flex-row justify-between">
          <TouchableOpacity 
            onPress={() => setActiveTab('all')}
            className={`flex-1 py-3 items-center border-b-[3px] ${activeTab === 'all' ? 'border-yellow-400' : 'border-transparent'}`}
          >
            <Text className={`font-bold text-sm tracking-wide ${activeTab === 'all' ? 'text-yellow-400' : 'text-slate-400'}`}>TÜMÜ ({pendingActions.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('approved')}
            className={`flex-1 py-3 items-center border-b-[3px] ${activeTab === 'approved' ? 'border-emerald-400' : 'border-transparent'}`}
          >
            <Text className={`font-bold text-sm tracking-wide ${activeTab === 'approved' ? 'text-emerald-400' : 'text-slate-400'}`}>ONAYLANANLAR</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('rejected')}
            className={`flex-1 py-3 items-center border-b-[3px] ${activeTab === 'rejected' ? 'border-red-400' : 'border-transparent'}`}
          >
            <Text className={`font-bold text-sm tracking-wide ${activeTab === 'rejected' ? 'text-red-400' : 'text-slate-400'}`}>REDDEDİLENLER</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 pt-6">
        {isLoadingData ? (
          <View className="flex-1 items-center justify-center px-8 pb-20">
            <ActivityIndicator size="large" color="#facc15" />
            <Text className="text-navy-900 font-extrabold text-xl mt-6 text-center">Yapay Zeka Analiz Ediyor...</Text>
            <Text className="text-slate-500 text-center mt-3 text-sm">Finansal verileriniz taranıyor ve gizli erozyonlar tespit ediliyor.</Text>
          </View>
        ) : (
          <>
            {activeTab === 'all' && (
              pendingActions.length === 0 ? (
                <View className="items-center justify-center flex-1 px-8 pb-20">
                  <Check size={64} color="#10b981" />
                  <Text className="text-navy-900 font-extrabold text-2xl mt-6 text-center">Harika, Her Şey Temiz!</Text>
                  <Text className="text-slate-500 text-center mt-3 text-base">Bekleyen yeni bir erozyon tespiti yok.</Text>
                </View>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={pendingActions}
                  renderItem={renderOpportunityCard}
                  keyExtractor={item => item.id}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={width}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingVertical: 10 }}
                />
              )
            )}

            {activeTab === 'approved' && renderArchivedList(approvedActions, 'approved')}
            {activeTab === 'rejected' && renderArchivedList(rejectedActions, 'rejected')}
          </>
        )}
      </View>

      {/* AI Chat Modal Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-navy-900/80"
        >
          <View className="bg-white rounded-t-[40px] pt-6 px-6 pb-10 shadow-2xl h-[85%] border-t border-slate-200">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center mr-3">
                  <Bot size={24} color="#0f172a" />
                </View>
                <Text className="text-xl font-extrabold text-navy-900">KOBİ AI Danışmanı</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-slate-100 p-2.5 rounded-full border border-slate-200">
                <X size={20} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView ref={chatScrollRef} className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
              {messages.map((msg) => (
                <View 
                  key={msg.id} 
                  className={`rounded-2xl p-4 mb-4 max-w-[85%] ${
                    msg.role === 'ai' 
                      ? 'bg-slate-100 rounded-tl-sm self-start border border-slate-200' 
                      : 'bg-navy-900 rounded-tr-sm self-end shadow-sm shadow-navy-900/30'
                  }`}
                >
                  <Text className={`font-medium leading-5 ${msg.role === 'ai' ? 'text-navy-900' : 'text-white'}`}>
                    {msg.text}
                  </Text>
                </View>
              ))}
              
              {isChatLoading && (
                <View className="bg-slate-100 rounded-2xl rounded-tl-sm p-4 w-16 mb-4 border border-slate-200 self-start items-center justify-center">
                  <ActivityIndicator size="small" color="#0f172a" />
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View className="flex-row items-center bg-white border-2 border-slate-200 rounded-3xl px-4 py-2 shadow-sm shadow-slate-100">
              <TextInput 
                placeholder="Yapay zekaya sor..."
                placeholderTextColor="#94a3b8"
                className="flex-1 h-12 text-navy-900 font-medium text-base"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity 
                onPress={sendMessage}
                disabled={isChatLoading || !inputText.trim()}
                className={`w-11 h-11 rounded-full items-center justify-center shadow-md ${inputText.trim() ? 'bg-yellow-400 shadow-yellow-400/50' : 'bg-slate-200'}`}
              >
                <Send size={18} color="#0f172a" className="-ml-0.5" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
