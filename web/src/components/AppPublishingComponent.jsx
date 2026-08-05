import React, { useState, useEffect } from 'react';
import { Smartphone, Upload, Package, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

export default function AppPublishingComponent() {
  const [appConfig, setAppConfig] = useState(null);
  const [builds, setBuilds] = useState([]);
  const [releases, setReleases] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releaseData, setReleaseData] = useState({
    releaseNotes: '',
    version: '',
    buildNumber: ''
  });

  const platforms = [
    { id: 'ios', name: 'iOS', icon: '🍎', color: 'from-gray-400 to-gray-600' },
    { id: 'android', name: 'Android', icon: '🤖', color: 'from-green-400 to-green-600' }
  ];

  useEffect(() => {
    fetchAppConfig();
    fetchBuilds();
    fetchReleases();
  }, []);

  const fetchAppConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/app-store/config', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setAppConfig(data);
    } catch (error) {
      console.error('App config yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuilds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/app-store/builds', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setBuilds(data.builds || []);
    } catch (error) {
      console.error('Builds yüklenemedi:', error);
    }
  };

  const fetchReleases = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/app-store/releases', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setReleases(data.releases || []);
    } catch (error) {
      console.error('Releases yüklenemedi:', error);
    }
  };

  const handleCreateBuild = async (platform) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/app-store/builds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform,
          version: '1.0.0',
          buildNumber: Math.floor(Date.now() / 1000)
        })
      });

      const newBuild = await response.json();
      setBuilds([newBuild, ...builds]);
      alert(`${platform.toUpperCase()} build başlatıldı!`);
    } catch (error) {
      console.error('Build oluşturulamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRelease = async () => {
    if (!selectedBuild || !releaseData.releaseNotes) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/app-store/releases', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buildId: selectedBuild._id,
          releaseNotes: releaseData.releaseNotes,
          version: releaseData.version || '1.0.0'
        })
      });

      const newRelease = await response.json();
      setReleases([newRelease, ...releases]);
      setShowReleaseModal(false);
      setReleaseData({ releaseNotes: '', version: '', buildNumber: '' });
    } catch (error) {
      console.error('Release oluşturulamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishRelease = async (releaseId) => {
    if (!window.confirm('Bu release\'i yayınlamak istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/app-store/releases/${releaseId}/publish`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const updated = await response.json();
      setReleases(releases.map(r => r._id === releaseId ? updated : r));
      alert('Release yayınlandı!');
    } catch (error) {
      console.error('Release yayınlanamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Smartphone className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">App Store Yayıncılığı</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['config', 'builds', 'releases'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold border-b-2 transition ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'config' && 'App Konfigürasyonu'}
            {tab === 'builds' && 'Build\'ler'}
            {tab === 'releases' && 'Release\'ler'}
          </button>
        ))}
      </div>

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map(platform => (
              <div key={platform.id} className={`p-6 rounded-lg bg-gradient-to-br ${platform.color} text-white`}>
                <div className="text-4xl mb-2">{platform.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{platform.name}</h3>
                <button
                  onClick={() => handleCreateBuild(platform.id)}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition font-semibold disabled:opacity-50"
                >
                  Build Oluştur
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Builds Tab */}
      {activeTab === 'builds' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Son Builds</h3>

          {builds.length === 0 ? (
            <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
              Henüz build oluşturulmamış
            </div>
          ) : (
            builds.map(build => (
              <div key={build._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {build.platform === 'ios' ? '🍎' : '🤖'}
                      </span>
                      <h4 className="font-bold text-gray-800 capitalize">{build.platform}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        build.status === 'succeeded'
                          ? 'bg-green-100 text-green-700'
                          : build.status === 'building'
                          ? 'bg-blue-100 text-blue-700'
                          : build.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {build.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {build.version} (Build #{build.buildNumber})
                    </p>

                    <div className="text-xs text-gray-500">
                      {build.completedAt
                        ? `Tamamlandı: ${new Date(build.completedAt).toLocaleString('tr-TR')}`
                        : build.startedAt
                        ? `Başlama: ${new Date(build.startedAt).toLocaleString('tr-TR')}`
                        : `Oluşturum: ${new Date(build.createdAt).toLocaleString('tr-TR')}`}
                    </div>
                  </div>

                  {build.status === 'succeeded' && (
                    <button
                      onClick={() => {
                        setSelectedBuild(build);
                        setReleaseData({
                          ...releaseData,
                          version: build.version,
                          buildNumber: build.buildNumber
                        });
                        setShowReleaseModal(true);
                      }}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      Release Yap
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Releases Tab */}
      {activeTab === 'releases' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Release Geçmişi</h3>

          {releases.length === 0 ? (
            <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
              Henüz release yapılmamış
            </div>
          ) : (
            releases.map(release => (
              <div key={release._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-800">v{release.version}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        release.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : release.status === 'publishing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {release.status === 'published' ? '✓ Yayınlandı' : 
                         release.status === 'publishing' ? 'Yayınlanıyor...' : 
                         'Taslak'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{release.releaseNotes}</p>

                    <div className="text-xs text-gray-500">
                      {new Date(release.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>

                  {release.status === 'draft' && (
                    <button
                      onClick={() => handlePublishRelease(release._id)}
                      disabled={loading}
                      className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold disabled:opacity-50"
                    >
                      Yayınla
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Release Modal */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-md w-full p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Release Oluştur</h3>

            <div className="space-y-4 mb-6">
              {/* Version */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Versiyon</label>
                <input
                  type="text"
                  value={releaseData.version}
                  onChange={(e) => setReleaseData({ ...releaseData, version: e.target.value })}
                  placeholder="1.0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Release Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Release Notları</label>
                <textarea
                  value={releaseData.releaseNotes}
                  onChange={(e) => setReleaseData({ ...releaseData, releaseNotes: e.target.value })}
                  placeholder="Bu sürümde neler var?"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateRelease}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Oluşturuluyor...' : 'Release Oluştur'}
              </button>
              <button
                onClick={() => setShowReleaseModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                İptal Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
