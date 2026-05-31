import React, { useState, useEffect } from 'react';
import { Globe, Settings, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegionalSettingsComponent() {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('EU');
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState({});

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/regions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setRegions(data);
      
      // Check health of each region
      for (const region of data) {
        const healthRes = await fetch(`http://localhost:5000/api/regions/${region.code}/health`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const health = await healthRes.json();
        setHealthStatus(prev => ({ ...prev, [region.code]: health }));
      }
    } catch (error) {
      console.error('Bölgeleri yüklerken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRegion = async (regionCode) => {
    try {
      await fetch('http://localhost:5000/api/user/region', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ primaryRegion: regionCode })
      });
      setSelectedRegion(regionCode);
    } catch (error) {
      console.error('Bölge güncellenirken hata:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Bölgesel Ayarlar</h1>
        </div>
        <button
          onClick={loadRegions}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map(region => {
            const health = healthStatus[region.code];
            const isHealthy = health?.healthy;
            const isSelected = selectedRegion === region.code;

            return (
              <div
                key={region.code}
                className={`p-6 rounded-lg border-2 transition cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-400'
                }`}
                onClick={() => updateUserRegion(region.code)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{region.code}</h3>
                    <p className="text-gray-600">{region.name}</p>
                  </div>
                  {isHealthy ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>

                {/* Server Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunucu:</span>
                    <span className="font-semibold">{region.server.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gecikmesi:</span>
                    <span className="font-semibold">{region.server.latency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dilim:</span>
                    <span className="font-semibold">{region.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Para Birimi:</span>
                    <span className="font-semibold">{region.pricing.currency}</span>
                  </div>
                </div>

                {/* Capacity */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Kapasite</span>
                    <span className="font-semibold">
                      {region.server.capacity.current}/{region.server.capacity.max}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(region.server.capacity.current / region.server.capacity.max) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Etkin Özellikler</h4>
                  <div className="flex flex-wrap gap-2">
                    {region.features.enabled.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compliance */}
                <div className="flex gap-3 text-xs">
                  {region.compliance.gdpr && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">GDPR</span>
                  )}
                  {region.compliance.ccpa && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">CCPA</span>
                  )}
                </div>

                {/* Select Button */}
                <button
                  className={`w-full mt-4 py-2 rounded-lg font-semibold transition ${
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
      )}

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm text-gray-600 mb-1">Toplam Bölge</h4>
          <p className="text-2xl font-bold text-blue-600">{regions.length}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm text-gray-600 mb-1">Aktif Bölge</h4>
          <p className="text-2xl font-bold text-green-600">
            {regions.filter(r => r.server.status === 'active').length}
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm text-gray-600 mb-1">Ort. Gecikme</h4>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(regions.reduce((sum, r) => sum + r.server.latency, 0) / regions.length)}ms
          </p>
        </div>
      </div>
    </div>
  );
}
