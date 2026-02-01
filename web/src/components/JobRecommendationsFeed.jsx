import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Briefcase,
    MapPin,
    DollarSign,
    TrendingUp,
    Zap,
    BookOpen,
    Save,
    Share2,
    ChevronRight
} from 'lucide-react';

/**
 * Job Recommendations Feed Component
 * Displays personalized job recommendations with match scores
 */
export const JobRecommendationsFeed = ({ userId }) => {
    const {
        recommendations,
        trending,
        loading,
        error,
        saved,
        getRecommendations,
        getTrendingJobs,
        recordInteraction,
        saveJob,
        unsaveJob,
        isJobSaved
    } = useRecommendations();

    const [activeTab, setActiveTab] = useState('recommended'); // recommended, trending
    const [filters, setFilters] = useState({
        experienceLevel: '',
        location: '',
        locationType: '',
        minSalary: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const observerTarget = useRef(null);

    // Load initial recommendations
    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            await getRecommendations(filters);
        } catch (err) {
            console.error('Failed to load recommendations:', err);
        }
    };

    const loadTrendingJobs = async () => {
        try {
            await getTrendingJobs();
        } catch (err) {
            console.error('Failed to load trending jobs:', err);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    const applyFilters = () => {
        loadRecommendations();
        setShowFilters(false);
    };

    const handleJobInteraction = async (jobId, type) => {
        await recordInteraction(jobId, type);
    };

    const handleSaveJob = async (jobId) => {
        if (isJobSaved(jobId)) {
            await unsaveJob(jobId);
        } else {
            await saveJob(jobId);
        }
    };

    const renderMatchScore = (score) => {
        const colors = {
            high: 'text-green-600',
            medium: 'text-amber-600',
            low: 'text-red-600'
        };

        let level = 'low';
        if (score >= 70) level = 'high';
        else if (score >= 50) level = 'medium';

        return (
            <div className={`text-lg font-bold ${colors[level]}`}>
                {score}%
            </div>
        );
    };

    const renderJobCard = (job, index) => (
        <motion.div
            key={job._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Match Score Badge */}
                    {job.matchScore !== undefined && (
                        <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                            <span className="text-xs text-gray-600 font-semibold">Match</span>
                            {renderMatchScore(job.matchScore)}
                        </div>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={() => handleSaveJob(job._id)}
                        className={`p-2 rounded-lg transition-colors ${
                            isJobSaved(job._id)
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Heart
                            size={20}
                            fill={isJobSaved(job._id) ? 'currentColor' : 'none'}
                        />
                    </button>
                </div>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {job.location || 'Remote'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {job.salaryMin && job.salaryMax
                            ? `$${job.salaryMin}-${job.salaryMax}k`
                            : 'Salary TBD'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {job.experienceLevel || 'Any'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {job.applications || 0} applications
                    </span>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                {job.description}
            </p>

            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                        Required Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 5).map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                        {job.skills.length > 5 && (
                            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                +{job.skills.length - 5} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                    onClick={() => {
                        handleJobInteraction(job._id, 'view');
                        setSelectedJob(job);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    View Details
                    <ChevronRight size={16} />
                </button>

                <button
                    onClick={() => handleJobInteraction(job._id, 'apply')}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    Apply Now
                </button>

                <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Share"
                >
                    <Share2 size={18} />
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Job Recommendations for You
                </h1>
                <p className="text-gray-600">
                    Personalized job matches based on your CV and preferences
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('recommended')}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                        activeTab === 'recommended'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Recommended for You
                </button>

                <button
                    onClick={() => {
                        setActiveTab('trending');
                        loadTrendingJobs();
                    }}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                        activeTab === 'trending'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <TrendingUp size={16} className="inline mr-2" />
                    Trending Jobs
                </button>
            </div>

            {/* Filter Button */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <Zap size={16} />
                    Filters
                </button>

                {Object.values(filters).some(v => v) && (
                    <button
                        onClick={() => {
                            setFilters({
                                experienceLevel: '',
                                location: '',
                                locationType: '',
                                minSalary: ''
                            });
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience Level
                                </label>
                                <select
                                    value={filters.experienceLevel}
                                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">All Levels</option>
                                    <option value="entry">Entry Level</option>
                                    <option value="mid">Mid Level</option>
                                    <option value="senior">Senior</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location Type
                                </label>
                                <select
                                    value={filters.locationType}
                                    onChange={(e) => handleFilterChange('locationType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">All Types</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="onsite">On-site</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Min Salary
                                </label>
                                <input
                                    type="number"
                                    value={filters.minSalary}
                                    onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                                    placeholder="e.g., 50000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    placeholder="e.g., Istanbul"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <button
                            onClick={applyFilters}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6"
                >
                    {error}
                </motion.div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                </div>
            )}

            {/* Jobs List */}
            {!loading && activeTab === 'recommended' && recommendations && (
                <div>
                    {recommendations.jobs && recommendations.jobs.length > 0 ? (
                        <AnimatePresence mode="wait">
                            {recommendations.jobs.map((job, idx) =>
                                renderJobCard(job, idx)
                            )}
                        </AnimatePresence>
                    ) : (
                        <div className="text-center py-12">
                            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-600 text-lg">No jobs found matching your criteria</p>
                            <button
                                onClick={() => setShowFilters(true)}
                                className="mt-4 px-4 py-2 text-blue-600 font-medium hover:text-blue-700"
                            >
                                Adjust Filters
                            </button>
                        </div>
                    )}

                    {recommendations.total && (
                        <div className="text-center py-6 text-gray-600">
                            Showing {recommendations.jobs?.length || 0} of {recommendations.total} jobs
                        </div>
                    )}
                </div>
            )}

            {/* Trending Jobs */}
            {!loading && activeTab === 'trending' && trending && (
                <div>
                    {trending.jobs && trending.jobs.length > 0 ? (
                        <AnimatePresence mode="wait">
                            {trending.jobs.map((job, idx) =>
                                renderJobCard(job, idx)
                            )}
                        </AnimatePresence>
                    ) : (
                        <div className="text-center py-12">
                            <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-600 text-lg">No trending jobs available</p>
                        </div>
                    )}
                </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} />
        </div>
    );
};

export default JobRecommendationsFeed;
