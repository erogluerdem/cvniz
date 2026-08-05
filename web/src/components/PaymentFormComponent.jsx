import React, { useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Lock } from 'lucide-react';

export default function PaymentFormComponent({ onSuccess, amount, description }) {
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    email: '',
    country: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fraudRisk, setFraudRisk] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateCard = () => {
    if (!formData.cardNumber || formData.cardNumber.length !== 16) {
      setError('Kart numarası 16 haneli olmalıdır');
      return false;
    }
    if (!formData.cvc || formData.cvc.length !== 3) {
      setError('CVC 3 haneli olmalıdır');
      return false;
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      setError('Son kullanma tarihi gereklidir');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateCard()) return;

    setLoading(true);
    try {
      // Simulate network request for payment
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock success response
      const result = {
        status: 'succeeded',
        paymentId: 'pay_mock_' + Date.now(),
        amount
      };

      setSuccess(true);
      if (onSuccess) onSuccess(result);
      
    } catch (err) {
      setError('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ödeme Başarılı</h2>
          <p className="text-gray-600 mb-6">Ödemeniz başarıyla işlendi</p>
          <div className="w-full p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <p className="text-sm text-gray-600">Tutar</p>
            <p className="text-2xl font-bold text-green-600">${amount.toFixed(2)}</p>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Panele Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ödeme Yap</h2>
        <CreditCard className="w-6 h-6 text-blue-600" />
      </div>

      {/* Fraud Risk Warning */}
      {fraudRisk && fraudRisk.riskLevel === 'high' && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-yellow-800">Ödeme Gözden Geçiriliyor</p>
            <p className="text-sm text-yellow-700">Güvenlik nedeniyle ödemeniz incelenmektedir</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Display */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Ödeme Tutarı</p>
          <p className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</p>
        </div>

        {/* Card Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Kart Sahibi Adı</label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="Ad Soyad"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Kart Numarası</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="16"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
            required
          />
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ay/Yıl</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleChange}
                placeholder="MM"
                maxLength="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleChange}
                placeholder="YY"
                maxLength="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CVC</label>
            <input
              type="text"
              name="cvc"
              value={formData.cvc}
              onChange={handleChange}
              placeholder="123"
              maxLength="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ülke</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Seçiniz</option>
            <option value="TR">Türkiye</option>
            <option value="US">Amerika</option>
            <option value="DE">Almanya</option>
            <option value="FR">Fransa</option>
            <option value="GB">İngiltere</option>
          </select>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Ödemeniz SSL ile şifrelenmektedir</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
        </button>
      </form>
    </div>
  );
}
