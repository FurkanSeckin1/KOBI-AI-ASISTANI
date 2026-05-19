import { GoogleGenerativeAI } from '@google/generative-ai';

// Expo ortamından API anahtarını güvenli şekilde çekiyoruz
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeFinancialData = async (rawData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Sen acımasız ve son derece zeki bir kurumsal finans analistisin.
Sana bir KOBİ'nin son 3 aylık finansal ham verilerini vereceğim. Bu veriyi incele ve 3 adet "Gizli Kar Marjı Erozyonu" tespit et. 
Bu tespitleri uygulamada doğrudan gösterebilmem için SADECE aşağıdaki JSON array formatında döndür. Markdown backtick (\`\`\`) KULLANMA, düz JSON stringi ver.

İstenen JSON formatı her bir obje için:
{
  "id": "benzersiz_id",
  "title": "Erozyon Başlığı (örn: Lojistik Maliyet Erozyonu)",
  "description": "Tespitin detaylı açıklaması ve nedeni.",
  "actionText": "Kısa ve net eylem önerisi (örn: Kargo Firmasıyla Yeniden Anlaş)",
  "todoText": "Bu eylemin to-do listesindeki detaylı hali",
  "type": "danger veya warning veya info",
  "impact": "Sayısal etki (örn: '15.000')",
  "effort": "Orta, Yüksek veya Düşük",
  "risk": "Kritik, Yüksek veya Orta",
  "currentMargin": "Mevcut marj (örn: 12.0)",
  "potentialMargin": "İyileştirilmiş marj (örn: 14.5)"
}

İşte Ham Veri:
${JSON.stringify(rawData)}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonString);

  } catch (error) {
    console.error('Gemini API Error (Analyze):', error);
    throw error;
  }
};

export const chatWithAI = async (opportunityContext, userMessage) => {
  try {
    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY && API_KEY === 'AIzaSyD__JzUDq2KY0XaWA4TTw2mtWY5erbPEDI') {
      throw new Error("API_KEY_MISSING");
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Sen bir KOBİ finans asistanısın. Şu an kullanıcıya şu finansal erozyon hakkında danışmanlık yapıyorsun:
Başlık: ${opportunityContext?.title || 'Bilinmeyen'}
Detay: ${opportunityContext?.description || 'Bilinmeyen'}
Önerilen Eylem: ${opportunityContext?.todoText || 'Bilinmeyen'}
Maliyet Etkisi: ${opportunityContext?.impact || '0'} TL

Kullanıcının sorusu: "${userMessage}"
Sadece bu soruya odaklan, net, profesyonel ve çözüm odaklı kısa bir cevap ver.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    // Terminale detaylı log bas
    console.error('\n========== GEMINI CHAT ERROR ==========');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Full Error:', error);
    console.error('=======================================\n');

    if (error.message === 'API_KEY_MISSING' || error.message.includes('API key not valid') || error.status === 401 || error.status === 403) {
      return '⚠️ API Bağlantı Hatası: Lütfen internetinizi veya .env dosyasındaki EXPO_PUBLIC_GEMINI_API_KEY anahtarınızı kontrol edin.';
    }

    return '⚠️ Yapay zeka sunucularına şu an ulaşılamıyor. Lütfen daha sonra tekrar deneyiniz.';
  }
};
