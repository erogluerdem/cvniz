import React, { useState, useEffect } from 'react';
import { Webhook, Plus, Trash2, Copy, CheckCircle } from 'lucide-react';

export default function WebhookManagerComponent({ integrationId }) {
  const [webhooks, setWebhooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ event: '', url: '' });
  const [copied, setCopied] = useState(null);

  const eventTypes = [
    { value: 'cv.created', label: 'CV Oluşturuldu' },
    { value: 'cv.updated', label: 'CV Güncellendi' },
    { value: 'cv.shared', label: 'CV Paylaşıldı' },
    { value: 'interview.completed', label: 'Röportaj Tamamlandı' },
    { value: 'payment.received', label: 'Ödeme Alındı' },
    { value: 'subscription.activated', label: 'Abonelik Aktivlendi' },
    { value: 'application.submitted', label: 'Başvuru Gönderildi' }
  ];

  useEffect(() => {
    fetchWebhooks();
  }, [integrationId]);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/integrations/${integrationId}/webhooks`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      const data = await response.json();
      setWebhooks(data.webhooks || []);
    } catch (error) {
      console.error('Webhook\'ler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhook.event || !newWebhook.url) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/integrations/${integrationId}/webhooks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newWebhook)
        }
      );

      const data = await response.json();
      setWebhooks([...webhooks, data]);
      setNewWebhook({ event: '', url: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Webhook oluşturulamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebhook = async (webhookId) => {
    if (!window.confirm('Bu webhook\'u silmek istediğinizden emin misiniz?')) return;

    try {
      await fetch(
        `http://localhost:5000/api/integrations/${integrationId}/webhooks/${webhookId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setWebhooks(webhooks.filter(w => w.webhookId !== webhookId));
    } catch (error) {
      console.error('Webhook silinemedi:', error);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Webhook className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Webhook'lar</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Webhook Ekle
        </button>
      </div>

      {/* Webhooks List */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Yükleniyor...</div>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg">
          Henüz webhook kaydedilmemiş
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map(webhook => {
            const eventLabel = eventTypes.find(e => e.value === webhook.event)?.label || webhook.event;
            
            return (
              <div key={webhook.webhookId} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {eventLabel}
                      </span>
                      {webhook.active && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 break-all">{webhook.url}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteWebhook(webhook.webhookId)}
                    className="ml-4 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-600">
                    Tetiklemeler: <span className="font-semibold text-gray-800">{webhook.triggerCount || 0}</span>
                  </div>
                  {webhook.lastTriggered && (
                    <div className="text-gray-600">
                      Son Tetikleme: <span className="font-semibold text-gray-800">
                        {new Date(webhook.lastTriggered).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Webhook Ekle</h3>

            <div className="space-y-4 mb-6">
              {/* Event Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event</label>
                <select
                  value={newWebhook.event}
                  onChange={(e) => setNewWebhook({ ...newWebhook, event: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Seçiniz</option>
                  {eventTypes.map(et => (
                    <option key={et.value} value={et.value}>{et.label}</option>
                  ))}
                </select>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/webhook"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Bu URL POST isteği alacak ve event verilerini JSON olarak alacak
                </p>
              </div>

              {/* Example Payload */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">Örnek Payload:</p>
                <pre className="text-xs text-gray-600 overflow-auto">
{`{
  "event": "${newWebhook.event}",
  "data": {...},
  "timestamp": "2026-02-01T10:30:00Z"
}`}
                </pre>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateWebhook}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Oluşturuluyor...' : 'Oluştur'}
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
