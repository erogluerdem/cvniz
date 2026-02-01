import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function TaxCalculatorComponent() {
  const [items, setItems] = useState([
    { id: 1, description: '', amount: 0, category: 'service', taxable: true }
  ]);
  const [country, setCountry] = useState('TR');
  const [calculation, setCalculation] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [loading, setLoading] = useState(false);

  const countries = [
    { code: 'TR', name: 'Türkiye', taxRate: 0.18 },
    { code: 'DE', name: 'Almanya', taxRate: 0.19 },
    { code: 'FR', name: 'Fransa', taxRate: 0.20 },
    { code: 'US', name: 'Amerika', taxRate: 0.08 },
    { code: 'GB', name: 'İngiltere', taxRate: 0.20 },
    { code: 'JP', name: 'Japonya', taxRate: 0.10 },
    { code: 'AE', name: 'BAE', taxRate: 0.05 }
  ];

  const categories = [
    { value: 'service', label: 'Hizmet', taxable: true },
    { value: 'product', label: 'Ürün', taxable: true },
    { value: 'digital', label: 'Dijital', taxable: true },
    { value: 'exempt', label: 'Muaf', taxable: false }
  ];

  useEffect(() => {
    calculateTax();
  }, [items, country]);

  const calculateTax = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/tax/calculate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          country,
          items: items.filter(item => item.amount > 0)
        })
      });

      const data = await response.json();
      setCalculation(data.calculation);

      // Check compliance
      const complianceResponse = await fetch('http://localhost:5000/api/tax/compliance', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const complianceData = await complianceResponse.json();
      setCompliance(complianceData.compliance);
    } catch (error) {
      console.error('Vergi hesaplaması başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    const newId = Math.max(...items.map(i => i.id || 0)) + 1;
    setItems([...items, { id: newId, description: '', amount: 0, category: 'service', taxable: true }]);
  };

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Vergi Hesaplayıcı</h2>
      </div>

      {/* Compliance Status */}
      {compliance && (
        <div className="mb-6 p-4 rounded-lg border-2 flex items-start gap-4" style={{
          borderColor: compliance.status === 'compliant' ? '#10b981' : '#ef4444',
          backgroundColor: compliance.status === 'compliant' ? '#ecfdf5' : '#fef2f2'
        }}>
          {compliance.status === 'compliant' ? (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-gray-800">
              {compliance.status === 'compliant' ? 'Vergi Uyumlu' : 'Uyum Gözden Geçirmesi Gerekli'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {compliance.missingFilings > 0 
                ? `${compliance.missingFilings} eksik beyanname`
                : 'Tüm beyannameler güncel'}
            </p>
            {compliance.nextDeadline && (
              <p className="text-sm text-gray-600 mt-1">
                Sonraki son tarih: {new Date(compliance.nextDeadline).toLocaleDateString('tr-TR')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Country Selection */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Vergi Yetkilisi Ülkesi</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          {countries.map(c => (
            <option key={c.code} value={c.code}>
              {c.name} ({(c.taxRate * 100).toFixed(0)}% KDV)
            </option>
          ))}
        </select>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Kalemler</h3>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Açıklama</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Kalem açıklaması"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tutar ($)</label>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-end">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                    >
                      Sil
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Button */}
        <button
          onClick={addItem}
          className="mt-4 w-full px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
        >
          + Kalem Ekle
        </button>
      </div>

      {/* Calculation Results */}
      {calculation && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-4">Özet</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Ara Toplam:</span>
                <span className="font-semibold text-gray-800">${calculation.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Vergi ({(countries.find(c => c.code === country)?.taxRate * 100).toFixed(0)}%):</span>
                <span className="font-semibold">${calculation.totals.tax.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-blue-200 pt-3 flex justify-between text-lg">
                <span className="font-bold text-gray-800">Toplam:</span>
                <span className="font-bold text-blue-600">${calculation.totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-4">Vergi Dağılımı</h3>
            <div className="space-y-3">
              {calculation.breakdown && Object.entries(calculation.breakdown).map(([key, value]) => (
                value > 0 && (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-700 capitalize">{key}:</span>
                    <span className="font-semibold text-gray-800">${value.toFixed(2)}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filing Information */}
      {calculation && !loading && calculation.compliance && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Beyanname Gerekli</p>
              <p className="text-sm text-green-700 mt-1">
                Bu ödeme {calculation.compliance.jurisdiction} vergi makamına bildirilmesi gerekir.
                Son tarih: <span className="font-semibold">
                  {new Date(calculation.compliance.deadlineDate).toLocaleDateString('tr-TR')}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Export Button */}
      {calculation && !loading && (
        <button
          onClick={() => {
            const data = JSON.stringify(calculation, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tax-calculation-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
        >
          Raporu İndir
        </button>
      )}
    </div>
  );
}
