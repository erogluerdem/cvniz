/**
 * Premium Plans Component
 * Subscription management and plan selection
 */

import React, { useState, useEffect } from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PremiumPlansComponent = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState('monthly');

    useEffect(() => {
        loadPlans();
        loadCurrentPlan();
    }, []);

    const loadPlans = async () => {
        try {
            const response = await fetch('/api/premium/plans', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.error('Planlar yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCurrentPlan = async () => {
        try {
            const response = await fetch('/api/premium/status', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setCurrentPlan(data.plan);
        } catch (error) {
            console.error('Mevcut plan yüklenemedi:', error);
        }
    };

    const subscribeToPlan = async (planId) => {
        try {
            const response = await fetch('/api/premium/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    planId,
                    billingCycle
                })
            });

            if (response.ok) {
                alert('Başarı! Abonelik aktif hale geldi.');
                loadCurrentPlan();
            }
        } catch (error) {
            console.error('Abonelik başarısız:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Premium Planlarımız
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Kariyer gelişiminiz için ideal planı seçin
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-lg font-medium transition ${
                                billingCycle === 'monthly'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                        >
                            Aylık
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-lg font-medium transition ${
                                billingCycle === 'yearly'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                        >
                            Yıllık (İndirimli)
                        </button>
                    </div>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={plan._id}
                            className={`rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                                currentPlan === plan.name
                                    ? 'ring-2 ring-blue-600 bg-white'
                                    : 'bg-white'
                            }`}
                        >
                            {/* Header */}
                            <div className={`p-6 ${
                                idx === 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-gray-50'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold">
                                        {plan.name === 'premium' && '✨ Premium'}
                                        {plan.name === 'pro' && '⚡ Pro'}
                                        {plan.name === 'enterprise' && '👑 Enterprise'}
                                    </h3>
                                    {idx === 1 && <Star className="w-5 h-5" />}
                                </div>
                                <div className="text-3xl font-bold">
                                    ${plan.price[billingCycle]}/
                                    <span className="text-lg">{billingCycle === 'monthly' ? 'ay' : 'yıl'}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="p-6 space-y-3">
                                {plan.features?.slice(0, 5).map((feature, fidx) => (
                                    <div key={fidx} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {feature.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Limits */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <p className="text-sm font-semibold text-gray-900 mb-2">
                                    Aylık Limitler:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>💬 {plan.limits?.chatbotMessages} Chatbot Mesajı</li>
                                    <li>📄 {plan.limits?.resumeParsingQuota} Özgeçmiş Ayrıştırma</li>
                                    <li>🎤 {plan.limits?.interviewsPerMonth} Mülakat</li>
                                    <li>🎯 {plan.limits?.jobApplications} İş Başvurusu</li>
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="p-6 border-t border-gray-200">
                                {currentPlan === plan.name ? (
                                    <button
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold cursor-not-allowed"
                                    >
                                        Mevcut Plan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => subscribeToPlan(plan._id)}
                                        className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
                                            idx === 1
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                                        }`}
                                    >
                                        {currentPlan ? 'Yükselt' : 'Başla'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Sık Sorulan Sorular
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Herhangi bir zaman iptal edebilir miyim?
                            </h3>
                            <p className="text-gray-600">
                                Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İade alırsınız.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Plan değiştirebilir miyim?
                            </h3>
                            <p className="text-gray-600">
                                Evet, istediğiniz zaman farklı bir plana yükseltebilir veya indirebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumPlansComponent;
