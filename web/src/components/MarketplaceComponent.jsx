/**
 * Marketplace Component
 * Browse and manage services
 */

import React, { useState, useEffect } from 'react';
import { Search, Star, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MarketplaceComponent = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000]);

    const categories = [
        'resume_writing',
        'interview_coaching',
        'career_consulting',
        'portfolio_building',
        'linkedin_optimization',
        'job_search',
        'freelance',
        'mentoring',
        'training'
    ];

    useEffect(() => {
        searchServices();
    }, [selectedCategory, priceRange]);

    const searchServices = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                category: selectedCategory,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                searchTerm,
                limit: 20
            });

            const response = await fetch(`/api/marketplace/search?${params}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            const data = await response.json();
            setServices(data.listings || []);
        } catch (error) {
            console.error('Hizmetler yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchServices();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-3">
                        Hizmet Pazarı
                    </h1>
                    <p className="text-blue-100 mb-6">
                        Profesyonel hizmetler ve koçluk bul
                    </p>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Hizmet ara..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Ara
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 space-y-6">
                            {/* Category Filter */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    Kategori
                                </h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat}
                                                checked={selectedCategory === cat}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 capitalize">
                                                {cat.replace(/_/g, ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    Fiyat Aralığı
                                </h3>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-600">
                                        ${priceRange[0]} - ${priceRange[1]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="md:col-span-3">
                        {loading ? (
                            <div className="text-center py-12">Yükleniyor...</div>
                        ) : services.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-12 text-center">
                                <p className="text-gray-600">Hizmet bulunamadı</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {services.map(service => (
                                    <div
                                        key={service._id}
                                        className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                                    >
                                        <div className="flex gap-6">
                                            {/* Provider Avatar */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={service.providerId?.avatar || '/default-avatar.png'}
                                                    alt="Provider"
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {service.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {service.providerId?.name}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            ${service.pricing?.amount}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {service.pricing?.type}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {service.description}
                                                </p>

                                                {/* Rating & Stats */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                            <span className="text-sm font-semibold">
                                                                {service.rating?.average.toFixed(1)}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                ({service.rating?.totalReviews})
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {service.ordersCompleted} sipariş tamamlandı
                                                        </span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <button className="p-2 text-gray-400 hover:text-red-500 transition">
                                                            <Heart className="w-5 h-5" />
                                                        </button>
                                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                                                            Sipariş Ver
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceComponent;
