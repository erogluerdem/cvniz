import Sentry from '@sentry/node';
import { recordEvent } from '../utils/logger.js';

/**
 * CourseService
 * Kurs yönetimi, başlangıç, tamamlama ve içerik yönetimi
 *
 * @class CourseService
 */
class CourseService {
    constructor() {
        this.courses = new Map();
        this.enrollments = new Map();
        this.modules = new Map();
        this.courseIdCounter = 0;
    }

    /**
   * Yeni kurs oluştur
   * @param {Object} courseData - Kurs verileri
   * @returns {Object} Oluşturulan kurs
   */
    createCourse(courseData) {
        try {
            const courseId = `course-${++this.courseIdCounter}`;

            const course = {
                courseId,
                userId: courseData.userId,
                title: courseData.title,
                description: courseData.description,
                category: courseData.category || 'technology',
                level: courseData.level || 'beginner', // beginner, intermediate, advanced
                language: courseData.language || 'tr',
                thumbnail: courseData.thumbnail,
                instructor: courseData.instructor,
                instructorBio: courseData.instructorBio,
                rating: {
                    average: 0,
                    count: 0,
                    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                },
                duration: courseData.duration || 0, // minutes
                price: courseData.price || 0,
                isPremium: courseData.isPremium || false,
                learningOutcomes: courseData.learningOutcomes || [],
                requirements: courseData.requirements || [],
                tags: courseData.tags || [],
                enrollmentCount: 0,
                completionRate: 0,
                status: 'draft', // draft, published, archived
                visibility: courseData.visibility || 'private', // private, public, unlisted
                createdAt: new Date(),
                updatedAt: new Date(),
                publishedAt: null
            };

            this.courses.set(courseId, course);
            recordEvent('course_created', {
                courseId,
                title: course.title,
                instructor: course.instructor,
                isPremium: course.isPremium
            });

            return course;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Kurs oluşturulamadı: ${error.message}`);
        }
    }

    /**
   * Kurs detaylarını al
   * @param {string} courseId - Kurs ID
   * @returns {Object} Kurs detayları
   */
    getCourse(courseId) {
        try {
            const course = this.courses.get(courseId);
            if (!course) {
                return null;
            }
            return course;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Kurs yüklenemedi: ${error.message}`);
        }
    }

    /**
   * Kurs güncelle
   * @param {string} courseId - Kurs ID
   * @param {Object} updates - Güncellemeler
   * @returns {Object} Güncellenmiş kurs
   */
    updateCourse(courseId, updates) {
        try {
            const course = this.courses.get(courseId);
            if (!course) {
                return null;
            }

            const allowedFields = [
                'title', 'description', 'category', 'level', 'thumbnail',
                'instructorBio', 'price', 'isPremium', 'learningOutcomes',
                'requirements', 'tags', 'visibility', 'duration'
            ];

            Object.keys(updates).forEach(key => {
                if (allowedFields.includes(key)) {
                    course[key] = updates[key];
                }
            });

            course.updatedAt = new Date();
            this.courses.set(courseId, course);

            recordEvent('course_updated', {
                courseId,
                fields: Object.keys(updates)
            });

            return course;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Kurs güncellenemedi: ${error.message}`);
        }
    }

    /**
   * Kurs yayınla
   * @param {string} courseId - Kurs ID
   * @returns {Object} Yayınlanan kurs
   */
    publishCourse(courseId) {
        try {
            const course = this.courses.get(courseId);
            if (!course) {
                return null;
            }

            // Doğrulama: En az bir modul ve 3 kursun öğrenme çıktısı
            const modules = Array.from(this.modules.values())
                .filter(m => m.courseId === courseId);

            if (modules.length === 0) {
                throw new Error('Kurs yayınlanmak için en az bir modül gerekli');
            }

            if (course.learningOutcomes.length < 3) {
                throw new Error('Kurs yayınlanmak için en az 3 öğrenme çıktısı gerekli');
            }

            course.status = 'published';
            course.visibility = 'public';
            course.publishedAt = new Date();
            this.courses.set(courseId, course);

            recordEvent('course_published', {
                courseId,
                title: course.title,
                visibility: course.visibility
            });

            return course;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Kurs yayınlanamadı: ${error.message}`);
        }
    }

    /**
   * Kursa kayıt ol
   * @param {string} courseId - Kurs ID
   * @param {string} userId - Kullanıcı ID
   * @returns {Object} Kaydı
   */
    enrollInCourse(courseId, userId) {
        try {
            const course = this.courses.get(courseId);
            if (!course) {
                return null;
            }

            const enrollmentId = `enroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Zaten kaydı olup olmadığını kontrol et
            const existing = Array.from(this.enrollments.values())
                .find(e => e.courseId === courseId && e.userId === userId && e.status === 'active');

            if (existing) {
                return existing;
            }

            const enrollment = {
                enrollmentId,
                courseId,
                userId,
                status: 'active', // active, completed, paused, dropped
                enrolledAt: new Date(),
                completedAt: null,
                progressPercentage: 0,
                lastAccessedAt: null,
                certificateId: null,
                certificateIssuedAt: null,
                bookmarkedModules: [],
                notes: {}
            };

            this.enrollments.set(enrollmentId, enrollment);

            // Kurs enrollment sayısını güncelle
            course.enrollmentCount = (course.enrollmentCount || 0) + 1;
            this.courses.set(courseId, course);

            recordEvent('course_enrolled', {
                enrollmentId,
                courseId,
                userId,
                courseTitle: course.title
            });

            return enrollment;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Kursa kaydı başarısız: ${error.message}`);
        }
    }

    /**
   * Kullanıcı enrolmentlerini listele
   * @param {string} userId - Kullanıcı ID
   * @param {Object} filter - Filtre seçenekleri
   * @returns {Object} Enrolmentler ve sayfalama
   */
    getUserEnrollments(userId, filter = {}) {
        try {
            const page = filter.page || 1;
            const limit = filter.limit || 20;
            const status = filter.status;

            let enrollments = Array.from(this.enrollments.values())
                .filter(e => e.userId === userId);

            if (status) {
                enrollments = enrollments.filter(e => e.status === status);
            }

            // Kurs bilgisini ekle
            enrollments = enrollments.map(e => ({
                ...e,
                course: this.courses.get(e.courseId)
            }));

            // Tarih sıralama
            enrollments.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));

            // Sayfalama
            const total = enrollments.length;
            const pages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const paginated = enrollments.slice(skip, skip + limit);

            return {
                enrollments: paginated,
                pagination: {
                    page,
                    limit,
                    total,
                    pages
                }
            };
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Enrolmentler yüklenemedi: ${error.message}`);
        }
    }

    /**
   * Kurs modülü ekle
   * @param {string} courseId - Kurs ID
   * @param {Object} moduleData - Modül verileri
   * @returns {Object} Oluşturulan modül
   */
    addModule(courseId, moduleData) {
        try {
            const course = this.courses.get(courseId);
            if (!course) {
                return null;
            }

            const moduleId = `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const module = {
                moduleId,
                courseId,
                title: moduleData.title,
                description: moduleData.description,
                order: moduleData.order || 1,
                lessons: [],
                duration: 0,
                createdAt: new Date()
            };

            this.modules.set(moduleId, module);

            recordEvent('module_added', {
                moduleId,
                courseId,
                title: module.title
            });

            return module;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Modül eklenemedi: ${error.message}`);
        }
    }

    /**
   * Kurs modullerini listele
   * @param {string} courseId - Kurs ID
   * @returns {Array} Modüller
   */
    getCourseModules(courseId) {
        try {
            const modules = Array.from(this.modules.values())
                .filter(m => m.courseId === courseId)
                .sort((a, b) => a.order - b.order);

            return modules;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Modüller yüklenemedi: ${error.message}`);
        }
    }

    /**
   * Kurs ilerlemesini güncelle
   * @param {string} enrollmentId - Kayıt ID
   * @param {number} progressPercentage - İlerleme yüzdesi
   * @returns {Object} Güncellenmiş kayıt
   */
    updateProgress(enrollmentId, progressPercentage) {
        try {
            const enrollment = this.enrollments.get(enrollmentId);
            if (!enrollment) {
                return null;
            }

            enrollment.progressPercentage = Math.min(100, Math.max(0, progressPercentage));
            enrollment.lastAccessedAt = new Date();

            if (enrollment.progressPercentage === 100) {
                enrollment.status = 'completed';
                enrollment.completedAt = new Date();
            }

            this.enrollments.set(enrollmentId, enrollment);

            recordEvent('progress_updated', {
                enrollmentId,
                courseId: enrollment.courseId,
                progressPercentage: enrollment.progressPercentage
            });

            return enrollment;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`İlerleme güncellenemedi: ${error.message}`);
        }
    }

    /**
   * Kurs istatistiklerini al
   * @param {string} userId - Kullanıcı ID
   * @returns {Object} İstatistikler
   */
    getCourseStats(userId) {
        try {
            const courses = Array.from(this.courses.values())
                .filter(c => c.userId === userId);

            const enrollments = Array.from(this.enrollments.values())
                .filter(e => courses.some(c => c.courseId === e.courseId));

            const completedEnrollments = enrollments.filter(e => e.status === 'completed');
            const activeEnrollments = enrollments.filter(e => e.status === 'active');

            const stats = {
                totalCourses: courses.length,
                publishedCourses: courses.filter(c => c.status === 'published').length,
                draftCourses: courses.filter(c => c.status === 'draft').length,
                totalEnrollments: enrollments.length,
                completedEnrollments: completedEnrollments.length,
                activeEnrollments: activeEnrollments.length,
                averageRating: courses.length > 0
                    ? (courses.reduce((sum, c) => sum + c.rating.average, 0) / courses.length).toFixed(2)
                    : 0,
                totalStudents: new Set(enrollments.map(e => e.userId)).size,
                completionRate: enrollments.length > 0
                    ? ((completedEnrollments.length / enrollments.length) * 100).toFixed(2)
                    : 0,
                coursesByLevel: {
                    beginner: courses.filter(c => c.level === 'beginner').length,
                    intermediate: courses.filter(c => c.level === 'intermediate').length,
                    advanced: courses.filter(c => c.level === 'advanced').length
                }
            };

            return stats;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`İstatistikler yüklenemedi: ${error.message}`);
        }
    }

    /**
   * Kursları ara ve listele
   * @param {Object} filter - Filtre
   * @returns {Array} Kurslar
   */
    searchCourses(filter = {}) {
        try {
            let courses = Array.from(this.courses.values())
                .filter(c => c.status === 'published');

            if (filter.category) {
                courses = courses.filter(c => c.category === filter.category);
            }

            if (filter.level) {
                courses = courses.filter(c => c.level === filter.level);
            }

            if (filter.search) {
                const query = filter.search.toLowerCase();
                courses = courses.filter(c =>
                    c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some(t => t.toLowerCase().includes(query))
                );
            }

            if (filter.isPremium !== undefined) {
                courses = courses.filter(c => c.isPremium === filter.isPremium);
            }

            // Sıralama
            if (filter.sortBy === 'rating') {
                courses.sort((a, b) => b.rating.average - a.rating.average);
            } else if (filter.sortBy === 'enrollments') {
                courses.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
            } else if (filter.sortBy === 'newest') {
                courses.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            }

            return courses;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Kurslar aranırken hata: ${error.message}`);
        }
    }

    /**
   * Kurs derecelendir
   * @param {string} courseId - Kurs ID
   * @param {number} rating - Puan (1-5)
   * @returns {Object} Güncellenmiş kurs
   */
    rateCourse(courseId, rating) {
        try {
            const course = this.courses.get(courseId);
            if (!course) {
                return null;
            }

            if (rating < 1 || rating > 5) {
                throw new Error('Puan 1 ile 5 arasında olmalıdır');
            }

            // Ortalama hesapla
            const total = course.rating.average * course.rating.count;
            course.rating.count += 1;
            course.rating.average = (total + rating) / course.rating.count;
            course.rating.distribution[rating] = (course.rating.distribution[rating] || 0) + 1;

            this.courses.set(courseId, course);

            recordEvent('course_rated', {
                courseId,
                rating,
                averageRating: course.rating.average
            });

            return course;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Kurs derecelenemedi: ${error.message}`);
        }
    }

    /**
   * Kurs arşivle
   * @param {string} courseId - Kurs ID
   * @returns {Object} Arşivlenen kurs
   */
    archiveCourse(courseId) {
        try {
            const course = this.courses.get(courseId);
            if (!course) {
                return null;
            }

            course.status = 'archived';
            this.courses.set(courseId, course);

            recordEvent('course_archived', {
                courseId,
                title: course.title
            });

            return course;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Kurs arşivlenemedi: ${error.message}`);
        }
    }
}

export default CourseService;
