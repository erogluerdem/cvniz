import React, { useState, useEffect } from 'react';
import { Globe, Check, AlertCircle } from 'lucide-react';

export default function LanguageSelectorComponent() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [translations, setTranslations] = useState({});
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLanguages();
    loadProgress();
  }, []);

  const loadLanguages = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/languages', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setLanguages(data);
    } catch (error) {
      console.error('Dilleri yüklerken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/translations/progress', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error('İlerleme yüklerken hata:', error);
    }
  };

  const selectLanguage = async (langCode) => {
    try {
      await fetch('http://localhost:5000/api/user/language', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferredLanguage: langCode })
      });
      setSelectedLanguage(langCode);
      document.documentElement.lang = langCode;
    } catch (error) {
      console.error('Dil güncellenirken hata:', error);
    }
  };

  const getProgressBadge = (langCode) => {
    const p = progress[langCode];
    if (!p) return null;

    const percentage = p.percentage || 0;
    if (percentage === 100) return 'Tamamlandı';
    if (percentage >= 90) return 'Neredeyse Tamamlandı';
    if (percentage >= 75) return 'Çoğu Tamamlandı';
    return `${percentage}%`;
  };

  const getStatusColor = (langCode) => {
    const p = progress[langCode];
    if (!p) return 'bg-gray-200';
    if (p.percentage === 100) return 'bg-green-500';
    if (p.percentage >= 90) return 'bg-blue-500';
    if (p.percentage >= 75) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Dil Seçimi</h1>
        </div>
        <button
          onClick={loadLanguages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Yenile
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          {/* Language Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {languages.map(lang => {
              const isSelected = selectedLanguage === lang.code;
              const prog = progress[lang.code];
              const isComplete = prog?.percentage === 100;

              return (
                <div
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {/* Language Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{lang.nativeName}</h3>
                      <p className="text-sm text-gray-600">{lang.englishName}</p>
                    </div>
                    {isComplete && (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Status */}
                  <div className="mb-3 text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Durum:</span>
                      <span className={`font-semibold px-2 py-1 rounded text-white ${
                        lang.status === 'active' ? 'bg-green-500' :
                        lang.status === 'beta' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {lang.status === 'active' ? 'Aktif' :
                         lang.status === 'beta' ? 'Beta' : 'Deprecated'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {prog && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Çeviri İlerlemesi</span>
                        <span className="font-semibold">{prog.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getStatusColor(lang.code)}`}
                          style={{ width: `${prog.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="text-xs space-y-1">
                    {lang.rtl && (
                      <div className="flex items-center gap-1 text-purple-600">
                        <span>RTL Desteği</span>
                      </div>
                    )}
                    <div className="text-gray-600">
                      Konuşan: {lang.metadata.speakers?.toLocaleString() || 'N/A'}
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    className={`w-full mt-3 py-2 rounded font-semibold transition ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? 'Seçili ✓' : 'Seç'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Translation Progress Details */}
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Çeviri İlerlemesi Özeti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(progress).map(([langCode, prog]) => (
                <div
                  key={langCode}
                  className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">
                      {languages.find(l => l.code === langCode)?.nativeName || langCode}
                    </h3>
                    <span className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                      prog.percentage === 100 ? 'bg-green-500' :
                      prog.percentage >= 90 ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}>
                      {prog.percentage}%
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Çevirilen:</span>
                      <span className="font-semibold">{prog.translated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam:</span>
                      <span className="font-semibold">{prog.total}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-300 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${prog.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language Features */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Seçili Dil Özellikleri</h3>
            {selectedLanguage && languages.find(l => l.code === selectedLanguage) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tarih Formatı</p>
                  <p className="font-semibold">{languages.find(l => l.code === selectedLanguage)?.dateFormat}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Saat Formatı</p>
                  <p className="font-semibold">{languages.find(l => l.code === selectedLanguage)?.timeFormat}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Para Birimi</p>
                  <p className="font-semibold">{languages.find(l => l.code === selectedLanguage)?.currencyFormat}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">RTL Desteği</p>
                  <p className="font-semibold">
                    {languages.find(l => l.code === selectedLanguage)?.rtl ? 'Evet' : 'Hayır'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
