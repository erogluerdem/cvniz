const Job = require('../models/Job');
const User = require('../models/User');
const CacheService = require('./CacheService');
const * as Sentry from '@sentry/node';

/**
 * Job Recommendations Engine
 * ML-based matching and personalized job suggestions
 */
class RecommendationService {
    /**
     * Calculate similarity score between CV and Job (0-100)
     * Factors: skills match, experience level, location, salary expectations
     */
    async calculateMatchScore(cvData, job) {
        let score = 0;
        const weights = {
            skillsMatch: 40,
            experienceLevel: 20,
            location: 15,
            salaryAlignment: 15,
            jobType: 10
        };

        // 1. Skills Matching (40%)
        const cvSkills = (cvData?.skills || []).map(s => s.toLowerCase());
        const jobSkills = (job.skills || []).map(s => s.toLowerCase());
        
        if (jobSkills.length > 0) {
            const matchedSkills = jobSkills.filter(skill =>
                cvSkills.some(cvSkill =>
                    this.skillSimilarity(cvSkill, skill) > 0.7
                )
            );
            const skillsScore = (matchedSkills.length / jobSkills.length) * 100;
            score += (skillsScore * weights.skillsMatch) / 100;
        } else {
            score += weights.skillsMatch; // Default if no skills required
        }

        // 2. Experience Level Match (20%)
        const userExperience = this.getExperienceLevel(cvData);
        if (userExperience === job.experienceLevel) {
            score += weights.experienceLevel;
        } else if (this.isExperienceCompatible(userExperience, job.experienceLevel)) {
            score += (weights.experienceLevel * 0.7);
        }

        // 3. Location Preference (15%)
        const userLocation = cvData?.personal?.location?.toLowerCase() || '';
        const jobLocation = job.location?.toLowerCase() || '';
        
        if (job.locationType === 'remote') {
            score += weights.location; // Remote is universally attractive
        } else if (userLocation && jobLocation) {
            if (userLocation.includes(jobLocation) || jobLocation.includes(userLocation)) {
                score += weights.location;
            } else {
                score += (weights.location * 0.3); // Penalty for mismatch
            }
        }

        // 4. Salary Alignment (15%)
        const userSalaryExpectation = this.estimateSalaryExpectation(userExperience);
        if (job.salaryMin && job.salaryMax) {
            if (userSalaryExpectation >= job.salaryMin && userSalaryExpectation <= job.salaryMax) {
                score += weights.salaryAlignment;
            } else if (userSalaryExpectation > job.salaryMax) {
                score += (weights.salaryAlignment * 0.5); // Might still apply
            } else {
                score += (weights.salaryAlignment * 0.3); // Below expectation
            }
        }

        // 5. Job Type Match (10%)
        const preferredJobTypes = cvData?.preferences?.jobTypes || ['full-time'];
        if (preferredJobTypes.includes(job.type)) {
            score += weights.jobType;
        }

        return Math.min(Math.round(score), 100);
    }

    /**
     * String similarity algorithm (Levenshtein distance)
     */
    skillSimilarity(str1, str2) {
        const s1 = str1.toLowerCase();
        const s2 = str2.toLowerCase();

        if (s1 === s2) return 1.0;

        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;

        if (longer.length === 0) return 1.0;

        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    /**
     * Levenshtein distance algorithm for string similarity
     */
    levenshteinDistance(s1, s2) {
        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                } else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    /**
     * Extract experience level from CV
     */
    getExperienceLevel(cvData) {
        const experience = cvData?.experience || [];
        const totalYears = experience.length;

        if (totalYears === 0) return 'entry';
        if (totalYears <= 2) return 'junior';
        if (totalYears <= 5) return 'mid';
        if (totalYears <= 10) return 'senior';
        return 'lead';
    }

    /**
     * Check if user experience is compatible with job level
     */
    isExperienceCompatible(userLevel, jobLevel) {
        const hierarchy = ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'];
        const userIdx = hierarchy.indexOf(userLevel);
        const jobIdx = hierarchy.indexOf(jobLevel);

        // User can apply for jobs at their level or slightly above
        return userIdx >= jobIdx - 1;
    }

    /**
     * Estimate salary expectation based on experience
     * Returns in TL (Turkish Lira) as baseline
     */
    estimateSalaryExpectation(experienceLevel) {
        const salaryMap = {
            entry: 25000,      // ~$800
            junior: 40000,     // ~$1300
            mid: 70000,        // ~$2300
            senior: 120000,    // ~$4000
            lead: 180000,      // ~$6000
            executive: 250000  // ~$8000
        };
        return salaryMap[experienceLevel] || 40000;
    }

    /**
     * Get personalized job recommendations for a user
     */
    async getRecommendations(userId, limit = 10, filters = {}) {
        try {
            const cacheKey = `recommendations:${userId}:${limit}`;
            const cached = await CacheService.get(cacheKey);
            if (cached) return cached;

            // Get user's CV data
            const user = await User.findById(userId).select('skills preferences');
            if (!user) {
                throw new Error('User not found');
            }

            // Get CV to extract skills and experience
            const CV = require('../models/CV');
            const userCV = await CV.findOne({ userId, isDefault: true });

            if (!userCV) {
                return {
                    recommendations: [],
                    message: 'Complete your CV first for better recommendations'
                };
            }

            // Build query filters
            let query = {
                status: 'active',
                expiryDate: { $gt: new Date() }
            };

            // Apply additional filters
            if (filters.experienceLevel) {
                query.experienceLevel = filters.experienceLevel;
            }
            if (filters.locationType) {
                query.locationType = filters.locationType;
            }
            if (filters.jobType) {
                query.type = filters.jobType;
            }
            if (filters.minSalary) {
                query.salaryMax = { $gte: filters.minSalary };
            }
            if (filters.location) {
                query.location = new RegExp(filters.location, 'i');
            }

            // Get active jobs
            const jobs = await Job.find(query)
                .limit(limit * 3) // Get more to rank
                .select('_id title company location skills experienceLevel salaryMin salaryMax type locationType description');

            // Calculate match scores
            const scoredJobs = await Promise.all(
                jobs.map(async (job) => ({
                    ...job.toObject(),
                    matchScore: await this.calculateMatchScore(userCV.toObject(), job),
                    matchPercentage: await this.calculateMatchScore(userCV.toObject(), job)
                }))
            );

            // Sort by match score and take top results
            const recommendations = scoredJobs
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, limit)
                .map(job => ({
                    jobId: job._id,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    locationType: job.locationType,
                    salaryRange: `${job.salaryMin || 'N/A'} - ${job.salaryMax || 'N/A'} ${job.type}`,
                    matchScore: job.matchScore,
                    matchPercentage: `${job.matchPercentage}%`,
                    experienceLevel: job.experienceLevel,
                    skillsMatch: this.getMatchedSkills(userCV.skills, job.skills)
                }));

            const result = {
                recommendations,
                totalFound: recommendations.length,
                filters: filters
            };

            // Cache for 6 hours (recommendations change based on job postings)
            await CacheService.set(cacheKey, result, 6 * 3600);

            return result;
        } catch (err) {
            console.error('Recommendation Engine Error:', err);
            Sentry.captureException(err);
            return { error: err.message, recommendations: [] };
        }
    }

    /**
     * Get skills that match between user and job
     */
    getMatchedSkills(userSkills, jobSkills) {
        if (!userSkills || !jobSkills) return [];

        const matched = jobSkills.filter(jobSkill =>
            userSkills.some(userSkill =>
                this.skillSimilarity(userSkill.toLowerCase(), jobSkill.toLowerCase()) > 0.7
            )
        );

        return matched.slice(0, 5); // Return top 5 matched skills
    }

    /**
     * Get salary prediction for a specific role
     */
    async getSalaryPrediction(jobTitle, experienceLevel, location = 'Turkey') {
        try {
            const cacheKey = `salary:${jobTitle}:${experienceLevel}:${location}`;
            const cached = await CacheService.get(cacheKey);
            if (cached) return cached;

            // Get similar jobs and calculate average
            const jobs = await Job.find({
                title: new RegExp(jobTitle, 'i'),
                experienceLevel: experienceLevel,
                location: new RegExp(location, 'i'),
                salaryMin: { $exists: true, $ne: null },
                status: 'active'
            }).limit(50);

            if (jobs.length === 0) {
                return {
                    prediction: this.estimateSalaryExpectation(experienceLevel),
                    confidence: 'low',
                    basedOn: 0,
                    message: 'Based on general experience level'
                };
            }

            const avgMin = Math.round(
                jobs.reduce((sum, job) => sum + (job.salaryMin || 0), 0) / jobs.length
            );
            const avgMax = Math.round(
                jobs.reduce((sum, job) => sum + (job.salaryMax || 0), 0) / jobs.length
            );

            const result = {
                prediction: {
                    min: avgMin,
                    max: avgMax,
                    average: Math.round((avgMin + avgMax) / 2)
                },
                confidence: jobs.length > 20 ? 'high' : 'medium',
                basedOn: jobs.length,
                message: `Based on ${jobs.length} similar job postings`
            };

            await CacheService.set(cacheKey, result, 24 * 3600); // Cache for 24 hours

            return result;
        } catch (err) {
            console.error('Salary Prediction Error:', err);
            return {
                prediction: this.estimateSalaryExpectation(experienceLevel),
                confidence: 'low',
                error: err.message
            };
        }
    }

    /**
     * Get trending jobs in specific skills
     */
    async getTrendingJobs(skills = [], limit = 10) {
        try {
            const cacheKey = `trending:${skills.join('-')}:${limit}`;
            const cached = await CacheService.get(cacheKey);
            if (cached) return cached;

            let query = {
                status: 'active',
                expiryDate: { $gt: new Date() }
            };

            if (skills.length > 0) {
                query.skills = { $in: skills.map(s => new RegExp(s, 'i')) };
            }

            const trending = await Job.find(query)
                .sort({ views: -1, applications: -1 })
                .limit(limit)
                .select('title company location skills experienceLevel views applications');

            const result = {
                trending: trending.map(job => ({
                    jobId: job._id,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    skills: job.skills,
                    views: job.views,
                    applications: job.applications,
                    popularity: job.views + job.applications
                })),
                asOf: new Date()
            };

            await CacheService.set(cacheKey, result, 3600); // Cache for 1 hour

            return result;
        } catch (err) {
            console.error('Trending Jobs Error:', err);
            return { trending: [], error: err.message };
        }
    }

    /**
     * Record job interaction for better recommendations
     */
    async recordJobInteraction(userId, jobId, interactionType) {
        try {
            // Track user interest
            const JobInteraction = require('../models/JobInteraction') || null;

            if (JobInteraction) {
                await JobInteraction.create({
                    userId,
                    jobId,
                    type: interactionType, // 'view', 'apply', 'save', 'dismiss'
                    timestamp: new Date()
                });
            }

            // Increment job view/application count
            await Job.findByIdAndUpdate(
                jobId,
                {
                    $inc: {
                        [interactionType === 'apply' ? 'applications' : 'views']: 1
                    }
                }
            );

            // Invalidate recommendation cache for this user
            await CacheService.del(`recommendations:${userId}:*`);

        } catch (err) {
            console.error('Job Interaction Error:', err);
        }
    }

    /**
     * Get matched skills between user's CV and job requirements
     */
    getMatchedSkills(cvSkills = [], jobSkills = []) {
        const userSkillsNorm = cvSkills.map(s => s.toLowerCase());
        const matched = [];
        const missing = [];

        (jobSkills || []).forEach(jobSkill => {
            const jobSkillLower = jobSkill.toLowerCase();
            const isMatched = userSkillsNorm.some(userSkill =>
                this.skillSimilarity(userSkill, jobSkillLower) > 0.65
            );

            if (isMatched) {
                matched.push(jobSkill);
            } else {
                missing.push(jobSkill);
            }
        });

        return {
            matched,
            missing,
            matchedCount: matched.length,
            missingCount: missing.length,
            completionPercentage: jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0
        };
    }

    /**
     * Get learning path for missing skills
     */
    async getLearningPath(missingSkills = []) {
        if (missingSkills.length === 0) {
            return { items: [] };
        }

        // Map skills to learning resources (mock data - in production, connect to learning APIs)
        const resourceMap = {
            'python': {
                course: 'Python for Data Science',
                platform: 'Coursera',
                duration: '4 weeks',
                difficulty: 'beginner'
            },
            'javascript': {
                course: 'The Complete JavaScript Course 2024',
                platform: 'Udemy',
                duration: '60 hours',
                difficulty: 'beginner'
            },
            'react': {
                course: 'React - The Complete Guide',
                platform: 'Udemy',
                duration: '40 hours',
                difficulty: 'intermediate'
            },
            'machine learning': {
                course: 'Machine Learning Specialization',
                platform: 'Coursera',
                duration: '3 months',
                difficulty: 'advanced'
            },
            'cloud': {
                course: 'AWS Certified Solutions Architect',
                platform: 'Udemy',
                duration: '8 weeks',
                difficulty: 'intermediate'
            },
            'devops': {
                course: 'The Complete Hands-On Introduction to Apache Kafka',
                platform: 'Udemy',
                duration: '10 hours',
                difficulty: 'advanced'
            }
        };

        const learningPath = missingSkills.map(skill => {
            const skillLower = skill.toLowerCase();
            return resourceMap[skillLower] || {
                course: `${skill} Masterclass`,
                platform: 'LinkedIn Learning',
                duration: '2-4 weeks',
                difficulty: 'intermediate'
            };
        });

        return {
            skills: missingSkills,
            items: learningPath,
            estimatedTime: `${missingSkills.length * 2}-${missingSkills.length * 4} weeks`
        };
    }

    /**
     * Get skill recommendations based on job market trends
     */
    async getSkillRecommendations(currentSkills = [], targetRole = '') {
        try {
            const cacheKey = `skill-recommendations:${targetRole}`;
            const cached = await CacheService.get(cacheKey);
            if (cached) return JSON.parse(cached);

            // Mock trending skills by role (in production, analyze from job postings)
            const skillsByRole = {
                'full-stack developer': ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker', 'AWS'],
                'data scientist': ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow', 'Spark'],
                'devops engineer': ['Kubernetes', 'Docker', 'Jenkins', 'AWS', 'Terraform', 'CI/CD'],
                'frontend developer': ['React', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'GraphQL', 'Webpack'],
                'backend developer': ['Node.js', 'Python', 'Java', 'PostgreSQL', 'Redis', 'Docker']
            };

            const recommendedSkills = skillsByRole[targetRole?.toLowerCase()] || [];
            const missingSkills = recommendedSkills.filter(skill =>
                !currentSkills.some(cs => 
                    this.skillSimilarity(cs.toLowerCase(), skill.toLowerCase()) > 0.6
                )
            );

            const result = {
                targetRole,
                recommendedSkills: missingSkills.slice(0, 5),
                priority: missingSkills.slice(0, 2),
                estimatedLearningTime: `${missingSkills.length * 3}-${missingSkills.length * 5} weeks`
            };

            await CacheService.set(cacheKey, JSON.stringify(result), 86400); // Cache for 24 hours
            return result;
        } catch (err) {
            console.error('Skill Recommendations Error:', err);
            return { recommendedSkills: [], priority: [] };
        }
    }
}

module.exports = new RecommendationService();
