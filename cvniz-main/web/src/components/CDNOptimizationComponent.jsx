import React, { useState, useEffect } from 'react';
import { Zap, Activity, Globe, Layers } from 'lucide-react';

export default function CDNOptimizationComponent() {
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAssets();
    loadStats();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/cdn/assets', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error('Dosyaları yüklerken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cdn/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('İstatistikleri yüklerken hata:', error);
    }
  };

  const optimizeAsset = async (assetId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cdn/assets/${assetId}/optimize`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const updated = await response.json();
      setAssets(assets.map(a => a.assetId === assetId ? updated : a));
    } catch (error) {
      console.error('Dosya optimize edilirken hata:', error);
    }
  };

  const purgeCache = async (pattern) => {
    try {
      await fetch('http://localhost:5000/api/cdn/cache/purge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pattern })
      });
      loadAssets();
    } catch (error) {
      console.error('Cache temizlerken hata:', error);
    }
  };

  const filteredAssets = filter === 'all' ? assets : assets.filter(a => a.type === filter);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-800">CDN Optimizasyonu</h1>
        </div>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
        >
          Yenile
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <h4 className="text-sm text-gray-600 mb-1">Toplam Dosya</h4>
            <p className="text-3xl font-bold text-blue-600">{stats.totalAssets}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <h4 className="text-sm text-gray-600 mb-1">Toplam Bant Genişliği</h4>
            <p className="text-3xl font-bold text-purple-600">{stats.totalBandwidth}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <h4 className="text-sm text-gray-600 mb-1">Toplam İstekler</h4>
            <p className="text-3xl font-bold text-green-600">{stats.totalRequests.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <h4 className="text-sm text-gray-600 mb-1">Ort. Yükleme Zamanı</h4>
            <p className="text-3xl font-bold text-orange-600">{stats.averageLoadTime}</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['all', 'image', 'video', 'document', 'script', 'style'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
              filter === type
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {type === 'all' ? 'Tümü' : type}
          </button>
        ))}
      </div>

      {/* Assets List */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Dosya bulunamadı</p>
            </div>
          ) : (
            filteredAssets.map(asset => (
              <div
                key={asset.assetId}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{asset.name}</h3>
                    <p className="text-sm text-gray-600">{asset.type} • {asset.mimeType}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {asset.status}
                  </span>
                </div>

                {/* File Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Boyut</p>
                    <p className="font-semibold">{(asset.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div>
                    <p className="text-gray-600">İstekler</p>
                    <p className="font-semibold">{asset.metrics.requests.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bant Genişliği</p>
                    <p className="font-semibold">{(asset.metrics.bandwidth / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Y. Zamanı</p>
                    <p className="font-semibold">{asset.metrics.averageLoadTime || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hit Oranı</p>
                    <p className="font-semibold">{asset.metrics.hitRate || 'N/A'}</p>
                  </div>
                </div>

                {/* Compression Ratio */}
                {asset.optimization.compressionRatio && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Sıkıştırma Oranı</span>
                      <span className="text-sm font-bold text-green-600">{asset.optimization.compressionRatio}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: `${asset.optimization.compressionRatio}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Regions */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Bölgeler</p>
                  <div className="flex gap-2 flex-wrap">
                    {asset.distribution.regions.map(region => (
                      <span
                        key={region}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => optimizeAsset(asset.assetId)}
                    className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                  >
                    Optimize Et
                  </button>
                  <button
                    onClick={() => purgeCache(asset.name)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    Cache Temizle
                  </button>
                  <button
                    onClick={() => setSelectedAsset(selectedAsset === asset.assetId ? null : asset.assetId)}
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    Detaylar
                  </button>
                </div>

                {/* Details */}
                {selectedAsset === asset.assetId && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3">Detaylı Bilgiler</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Cache Stratejisi</p>
                        <p className="font-semibold">{asset.cache.strategy}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">TTL</p>
                        <p className="font-semibold">{asset.cache.ttl} saniye</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Sıkıştırma</p>
                        <p className="font-semibold">{asset.distribution.compressionFormat}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">İzleme</p>
                        <p className="font-semibold">{asset.monitoring.enabled ? 'Aktif' : 'Pasif'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
