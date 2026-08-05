import React, { useState, useEffect } from 'react';
import { FileText, Download, Send, Trash2, Plus, Filter, Calendar } from 'lucide-react';

export default function InvoiceManagerComponent() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showModal, setShowModal] = useState(false);

  const statuses = [
    { value: 'all', label: 'Tümü' },
    { value: 'draft', label: 'Taslak' },
    { value: 'sent', label: 'Gönderilen' },
    { value: 'paid', label: 'Ödenen' },
    { value: 'overdue', label: 'Vadesi Geçen' },
    { value: 'canceled', label: 'İptal Edilen' }
  ];

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-400 text-gray-100'
  };

  useEffect(() => {
    fetchInvoices();
  }, [filterStatus, dateRange]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const response = await fetch(`http://localhost:5000/api/invoices?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Faturalar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (invoiceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}/pdf`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoiceId}.pdf`;
      a.click();
    } catch (error) {
      console.error('PDF indirilemedi:', error);
    }
  };

  const handleSendInvoice = async (invoiceId) => {
    try {
      await fetch(`http://localhost:5000/api/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setInvoices(prev =>
        prev.map(inv =>
          inv._id === invoiceId ? { ...inv, status: 'sent' } : inv
        )
      );
    } catch (error) {
      console.error('Fatura gönderilemedi:', error);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Bu faturayı silmek istediğinizden emin misiniz?')) return;

    try {
      await fetch(`http://localhost:5000/api/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setInvoices(prev => prev.filter(inv => inv._id !== invoiceId));
    } catch (error) {
      console.error('Fatura silinemedi:', error);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Faturalar</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Yeni Fatura
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Durum</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Başlangıç Tarihi</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bitiş Tarihi</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Yükleniyor...</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-8 text-gray-600">Fatura bulunamadı</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fatura No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Müşteri</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tutar</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tarih</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Durum</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 font-semibold">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-3 text-gray-800">
                    <div>
                      <p className="font-semibold">{invoice.customer?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-600">{invoice.customer?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-semibold">${invoice.totals?.total || 0}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(invoice.issuedAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[invoice.status] || 'bg-gray-100'}`}>
                      {statuses.find(s => s.value === invoice.status)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadPDF(invoice._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="PDF İndir"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {invoice.status === 'draft' && (
                        <button
                          onClick={() => handleSendInvoice(invoice._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Gönder"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteInvoice(invoice._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white/95 backdrop-blur-sm z-10">
              <h3 className="text-xl font-bold text-gray-800">{selectedInvoice.invoiceNumber}</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Müşteri Bilgileri</h4>
                <p className="text-gray-800">{selectedInvoice.customer?.name}</p>
                <p className="text-gray-600">{selectedInvoice.customer?.email}</p>
                <p className="text-gray-600">{selectedInvoice.customer?.company}</p>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Kalemler</h4>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Açıklama</th>
                      <th className="px-3 py-2 text-right">Miktar</th>
                      <th className="px-3 py-2 text-right">Fiyat</th>
                      <th className="px-3 py-2 text-right">Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items?.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-3 py-2">{item.description}</td>
                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">${item.unitPrice}</td>
                        <td className="px-3 py-2 text-right font-semibold">${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-end max-w-xs space-y-2">
                  <div className="w-full flex justify-between text-gray-600">
                    <span>Ara Toplam:</span>
                    <span>${selectedInvoice.totals?.subtotal}</span>
                  </div>
                  <div className="w-full flex justify-between text-gray-600">
                    <span>Vergi:</span>
                    <span>${selectedInvoice.totals?.tax}</span>
                  </div>
                  <div className="w-full flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                    <span>Toplam:</span>
                    <span>${selectedInvoice.totals?.total}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => handleDownloadPDF(selectedInvoice._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" />
                  PDF İndir
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
