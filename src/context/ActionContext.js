import React, { createContext, useState, useEffect } from 'react';
import { analyzeFinancialData } from '../services/geminiService';
// React Native bundler can require JSON files directly
const rawFinancialData = require('../../data/kobi_finans.json');

const INITIAL_OPPORTUNITIES = [
  {
    id: '1',
    title: 'Reklam Maliyeti Erozyonu',
    description: '"Google Ads" kampanyanızda X ürününün dönüşüm oranı düştü ancak harcama artıyor. Bu durum kar marjınızı %4 eritiyor.',
    actionText: 'Reklamı Duraklat ve Bütçeyi Kaydır',
    todoText: 'Google Ads X ürünü reklamı duraklatılacak ve bütçe optimize edilecek.',
    type: 'warning',
    impact: '12.400',
    effort: 'Düşük',
    risk: 'Yüksek',
    currentMargin: 12.0,
    potentialMargin: 16.0,
  },
  {
    id: '2',
    title: 'Stok Maliyeti Riski',
    description: 'Y ürünü 45 gündür stokta bekliyor. Depolama maliyeti ürün başına 12₺ arttı.',
    actionText: 'Hafta Sonu Flaş İndirimi Tanımla',
    todoText: 'Y ürünü için hafta sonu stok eritme %20 indirim kampanyası başlatılacak.',
    type: 'danger',
    impact: '8.500',
    effort: 'Orta',
    risk: 'Orta',
    currentMargin: 15.5,
    potentialMargin: 17.2,
  },
  {
    id: '3',
    title: 'Tedarikçi Fiyat Artışı',
    description: 'Z hammaddesinin tedarik fiyatı son 3 ayda %15 arttı ancak siz satış fiyatınızı değiştirmediniz.',
    actionText: 'Fiyatları %8 Güncelle',
    todoText: 'Z hammaddeli tüm ürünlerin satış fiyatları maliyet artışına göre %8 güncellenecek.',
    type: 'info',
    impact: '24.000',
    effort: 'Yüksek',
    risk: 'Kritik',
    currentMargin: 9.8,
    potentialMargin: 14.5,
  }
];

export const ActionContext = createContext();

export const ActionProvider = ({ children }) => {
  const [pendingActions, setPendingActions] = useState([]);
  const [approvedActions, setApprovedActions] = useState([]);
  const [rejectedActions, setRejectedActions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        // Gerçek API çağrısı (API Key olmadığı için hata fırlatabilir, fallback devreye girer)
        const aiData = await analyzeFinancialData(rawFinancialData);
        setPendingActions(aiData);
      } catch (error) {
        console.warn('AI Analizi başarısız oldu, varsayılan (fallback) veriler yükleniyor.', error.message);
        // API key yoksa veya kota dolduysa sistemi çökertmemek için statik veriyi yükle
        setTimeout(() => {
          setPendingActions(INITIAL_OPPORTUNITIES);
        }, 1500); // 1.5s sahte yükleme süresi
      } finally {
        setTimeout(() => {
          setIsLoadingData(false);
        }, 1500);
      }
    };

    fetchData();
  }, []);

  const approveAction = (action) => {
    setPendingActions(prev => prev.filter(a => a.id !== action.id));
    setApprovedActions(prev => [...prev, { ...action, completed: false }]);
  };

  const rejectAction = (action) => {
    setPendingActions(prev => prev.filter(a => a.id !== action.id));
    setRejectedActions(prev => [...prev, action]);
  };

  const undoAction = (action, fromType) => {
    if (fromType === 'approved') {
      setApprovedActions(prev => prev.filter(a => a.id !== action.id));
    } else {
      setRejectedActions(prev => prev.filter(a => a.id !== action.id));
    }
    setPendingActions(prev => [action, ...prev]);
  };

  const toggleActionCompletion = (actionId) => {
    setApprovedActions(prev =>
      prev.map(action =>
        action.id === actionId ? { ...action, completed: !action.completed } : action
      )
    );
  };

  return (
    <ActionContext.Provider
      value={{
        pendingActions,
        approvedActions,
        rejectedActions,
        isLoadingData,
        approveAction,
        rejectAction,
        undoAction,
        toggleActionCompletion,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
