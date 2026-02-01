import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function IntegrationSettingsComponent() {
  const [integrations, setIntegrations] = useState([]);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [showCredentials, setShowCredentials] = useState({});

  const integrationTypes = [
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'İş akışı otomasyonu',
      icon: '⚡',
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Bildirim ve mesajlaşma',
      icon: '💬',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'google_calendar',
      name: 'Google Calendar',
      description: 'Takvim senkronizasyonu',
      icon: '📅',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Topluluk bildirimleri',
      icon: '🎮',
      color: 'from-indigo-400 to-indigo-600'
    }
  ];

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/integrations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setIntegrations(data.integrations || []);
    } catch (error) {
      console.error('Entegrasyonlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectIntegration = async (integration) => {
    setSelectedIntegration(integration);
    setCredentials({});
    setShowModal(true);
  };

  const handleSaveCredentials = async () => {
    if (!selectedIntegration) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/integrations/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          integrationName: selectedIntegration.id,
          credentials
        })
      });

      const data = await response.json();
      setIntegrations([...integrations, data]);
      setShowModal(false);

      // Test et
      await handleTestIntegration(data.integrationId);
    } catch (error) {
      console.error('Entegrasyon bağlanamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestIntegration = async (integrationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/integrations/${integrationId}/test`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      const data = await response.json();
      setTestResult(data);

      setTimeout(() => setTestResult(null), 5000);
    } catch (error) {
      console.error('Test başarısız:', error);
    }
  };

  const handleDeleteIntegration = async (integrationId) => {
    if (!window.confirm('Bu entegrasyonu kaldırmak istediğinizden emin misiniz?')) return;

    try {
      await fetch(`http://localhost:5000/api/integrations/${integrationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setIntegrations(integrations.filter(i => i.integrationId !== integrationId));
    } catch (error) {
      console.error('Entegrasyon silinemedi:', error);
    }
  };

  const getIntegrationStatus = (integrationName) => {
    return integrations.some(i => i.name === integrationName && i.enabled);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Entegrasyonlar</h1>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`mb-6 p-4 rounded-lg border-2 flex items-start gap-3 ${
          testResult.status === 'connected' 
            ? 'border-green-200 bg-green-50'
            : 'border-red-200 bg-red-50'
        }`}>
          {testResult.status === 'connected' ? (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-gray-800">
              {testResult.status === 'connected' ? 'Bağlantı Başarılı' : 'Bağlantı Başarısız'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {testResult.integrationName}: {testResult.details?.responseTime?.toFixed(0)}ms
            </p>
          </div>
        </div>
      )}

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {integrationTypes.map(integration => {
          const isConnected = getIntegrationStatus(integration.name);
          
          return (
            <div
              key={integration.id}
              className={`p-6 rounded-lg border-2 transition ${
                isConnected
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-blue-200'
              }`}
            >
              <div className="text-4xl mb-3">{integration.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

              {isConnected ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  Bağlı
                </div>
              ) : (
                <button
                  onClick={() => handleConnectIntegration(integration)}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                >
                  Bağla
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Connected Integrations */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Bağlı Entegrasyonlar</h2>

        {integrations.length === 0 ? (
          <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
            Henüz entegrasyon bağlanmamış
          </div>
        ) : (
          <div className="space-y-4">
            {integrations.map(integration => (
              <div key={integration.integrationId} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{integration.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Bağlanma Tarihi: {new Date(integration.enabledAt).toLocaleDateString('tr-TR')}
                    </p>
                    {integration.lastSync && (
                      <p className="text-sm text-gray-600">
                        Son Senkronizasyon: {new Date(integration.lastSync).toLocaleString('tr-TR')}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestIntegration(integration.integrationId)}
                      className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                    >
                      Test Et
                    </button>

                    <button
                      onClick={() => handleDeleteIntegration(integration.integrationId)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Modal */}
      {showModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {selectedIntegration.name} Bağla
            </h3>

            <div className="space-y-4 mb-6">
              {selectedIntegration.id === 'zapier' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={credentials.webhookUrl || ''}
                    onChange={(e) => setCredentials({ ...credentials, webhookUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedIntegration.id === 'slack' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bot Token
                    </label>
                    <input
                      type="password"
                      placeholder="xoxb-..."
                      value={credentials.botToken || ''}
                      onChange={(e) => setCredentials({ ...credentials, botToken: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Team ID
                    </label>
                    <input
                      type="text"
                      placeholder="T..."
                      value={credentials.teamId || ''}
                      onChange={(e) => setCredentials({ ...credentials, teamId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {selectedIntegration.id === 'google_calendar' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Access Token
                    </label>
                    <input
                      type="password"
                      placeholder="ya29..."
                      value={credentials.accessToken || ''}
                      onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Calendar ID
                    </label>
                    <input
                      type="text"
                      placeholder="primary"
                      value={credentials.calendarId || ''}
                      onChange={(e) => setCredentials({ ...credentials, calendarId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {selectedIntegration.id === 'discord' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="password"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={credentials.webhookUrl || ''}
                    onChange={(e) => setCredentials({ ...credentials, webhookUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveCredentials}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Bağlanıyor...' : 'Bağla'}
              </button>
              <button
                onClick={() => setShowModal(false)}
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
