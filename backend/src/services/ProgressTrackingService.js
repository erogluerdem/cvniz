import Sentry from '@sentry/node';
import { recordEvent } from '../utils/logger.js';

/**
 * ProgressTrackingService
 * Öğrenme ilerleme izleme, milestone'lar, analytics
 * 
 * @class ProgressTrackingService
 */
class ProgressTrackingService {
  constructor() {
    this.progressRecords = new Map();
    this.milestones = new Map();
    this.learningPaths = new Map();
    this.recordIdCounter = 0;
  }

  /**
   * İlerleme kaydı oluştur
   * @param {Object} progressData - İlerleme verileri
   * @returns {Object} İlerleme kaydı
   */
  createProgressRecord(progressData) {
    try {
      const recordId = `progress-${++this.recordIdCounter}`;

      const record = {
        recordId,
        enrollmentId: progressData.enrollmentId,
        courseId: progressData.courseId,
        userId: progressData.userId,
        lessonId: progressData.lessonId,
        currentModule: progressData.currentModule || 1,
        totalModules: progressData.totalModules || 1,
        completedModules: [],
        completedLessons: [],
        completedQuizzes: [],
        overallProgress: 0,
        timeSpent: 0, // minutes
        lastAccessedAt: new Date(),
        createdAt: new Date(),
        activities: [],
        bookmarkedItems: [],
        notes: {}
      };

      this.progressRecords.set(recordId, record);

      recordEvent('progress_record_created', {
        recordId,
        enrollmentId: progressData.enrollmentId,
        courseId: progressData.courseId
      });

      return record;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`İlerleme kaydı oluşturulamadı: ${error.message}`);
    }
  }

  /**
   * İlerleme güncelle
   * @param {string} recordId - Kayıt ID
   * @param {Object} updates - Güncellemeler
   * @returns {Object} Güncellenmiş kayıt
   */
  updateProgress(recordId, updates) {
    try {
      const record = this.progressRecords.get(recordId);
      if (!record) {
        return null;
      }

      if (updates.lessonCompleted) {
        if (!record.completedLessons.includes(updates.lessonId)) {
          record.completedLessons.push(updates.lessonId);
        }
      }

      if (updates.moduleCompleted) {
        if (!record.completedModules.includes(updates.moduleId)) {
          record.completedModules.push(updates.moduleId);
        }
      }

      if (updates.quizCompleted) {
        if (!record.completedQuizzes.includes(updates.quizId)) {
          record.completedQuizzes.push(updates.quizId);
        }
      }

      if (updates.timeSpent !== undefined) {
        record.timeSpent += updates.timeSpent;
      }

      if (updates.currentModule !== undefined) {
        record.currentModule = updates.currentModule;
      }

      // Genel ilerlemeyi hesapla
      record.overallProgress = (
        (record.completedModules.length / record.totalModules) * 100
      ).toFixed(2);

      record.lastAccessedAt = new Date();

      // Aktivite kaydı
      const activity = {
        type: updates.activityType || 'update',
        timestamp: new Date(),
        details: {
          lessonCompleted: updates.lessonCompleted || false,
          moduleCompleted: updates.moduleCompleted || false,
          quizCompleted: updates.quizCompleted || false,
          timeSpent: updates.timeSpent || 0
        }
      };
      record.activities.push(activity);

      this.progressRecords.set(recordId, record);

      recordEvent('progress_updated', {
        recordId,
        overallProgress: record.overallProgress,
        timeSpent: record.timeSpent,
        completedModules: record.completedModules.length
      });

      return record;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`İlerleme güncellenemedi: ${error.message}`);
    }
  }

  /**
   * İlerleme kaydını al
   * @param {string} recordId - Kayıt ID
   * @returns {Object} İlerleme kaydı
   */
  getProgressRecord(recordId) {
    try {
      const record = this.progressRecords.get(recordId);
      if (!record) {
        return null;
      }
      return record;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`İlerleme kaydı yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Milestone oluştur
   * @param {Object} milestoneData - Milestone verileri
   * @returns {Object} Oluşturulan milestone
   */
  createMilestone(milestoneData) {
    try {
      const milestoneId = `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const milestone = {
        milestoneId,
        courseId: milestoneData.courseId,
        title: milestoneData.title,
        description: milestoneData.description,
        type: milestoneData.type || 'completion', // completion, quiz, submission, streak
        targetValue: milestoneData.targetValue,
        reward: milestoneData.reward || {},
        icon: milestoneData.icon,
        color: milestoneData.color || '#2196F3',
        order: milestoneData.order || 1,
        earnedCount: 0,
        createdAt: new Date()
      };

      this.milestones.set(milestoneId, milestone);

      recordEvent('milestone_created', {
        milestoneId,
        courseId: milestoneData.courseId,
        type: milestone.type
      });

      return milestone;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Milestone oluşturulamadı: ${error.message}`);
    }
  }

  /**
   * Milestone'u kontrol et ve eğer geçilmişse ödülü ver
   * @param {string} recordId - İlerleme kaydı ID
   * @param {string} milestoneId - Milestone ID
   * @param {number} currentValue - Mevcut değer
   * @returns {Object} Milestone sonucu
   */
  checkMilestone(recordId, milestoneId, currentValue) {
    try {
      const record = this.progressRecords.get(recordId);
      const milestone = this.milestones.get(milestoneId);

      if (!record || !milestone) {
        return null;
      }

      const achieved = currentValue >= milestone.targetValue;

      if (achieved && !record.completedMilestones) {
        record.completedMilestones = [];
      }

      if (achieved && !record.completedMilestones.includes(milestoneId)) {
        record.completedMilestones.push(milestoneId);
        milestone.earnedCount += 1;

        this.milestones.set(milestoneId, milestone);
        this.progressRecords.set(recordId, record);

        recordEvent('milestone_achieved', {
          recordId,
          milestoneId,
          title: milestone.title,
          type: milestone.type
        });

        return {
          achieved: true,
          milestone,
          reward: milestone.reward
        };
      }

      return {
        achieved: false,
        progress: (currentValue / milestone.targetValue * 100).toFixed(2),
        remaining: Math.max(0, milestone.targetValue - currentValue)
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Milestone kontrolü başarısız: ${error.message}`);
    }
  }

  /**
   * Kullanıcının milestone'larını listele
   * @param {string} userId - Kullanıcı ID
   * @returns {Array} Milestone'lar
   */
  getUserMilestones(userId) {
    try {
      const userRecords = Array.from(this.progressRecords.values())
        .filter(r => r.userId === userId);

      const completedMilestones = new Set();
      userRecords.forEach(r => {
        if (r.completedMilestones) {
          r.completedMilestones.forEach(m => completedMilestones.add(m));
        }
      });

      const milestones = Array.from(this.milestones.values())
        .map(m => ({
          ...m,
          achieved: completedMilestones.has(m.milestoneId)
        }))
        .sort((a, b) => b.achieved - a.achieved);

      return milestones;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Milestone'lar yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Öğrenme yolu oluştur
   * @param {Object} pathData - Yol verileri
   * @returns {Object} Oluşturulan yol
   */
  createLearningPath(pathData) {
    try {
      const pathId = `path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const path = {
        pathId,
        userId: pathData.userId,
        title: pathData.title,
        description: pathData.description,
        courses: pathData.courses || [],
        duration: pathData.duration || 0,
        difficulty: pathData.difficulty || 'intermediate',
        icon: pathData.icon,
        color: pathData.color || '#4CAF50',
        startedAt: new Date(),
        completedAt: null,
        progress: 0,
        enrollments: {},
        isPublished: pathData.isPublished || false,
        createdAt: new Date()
      };

      this.learningPaths.set(pathId, path);

      recordEvent('learning_path_created', {
        pathId,
        userId: pathData.userId,
        courseCount: path.courses.length
      });

      return path;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Öğrenme yolu oluşturulamadı: ${error.message}`);
    }
  }

  /**
   * Öğrenme yolu ilerleme güncelle
   * @param {string} pathId - Yol ID
   * @param {string} courseId - Kurs ID
   * @param {number} courseProgress - Kurs ilerleme yüzdesi
   * @returns {Object} Güncellenmiş yol
   */
  updateLearningPathProgress(pathId, courseId, courseProgress) {
    try {
      const path = this.learningPaths.get(pathId);
      if (!path) {
        return null;
      }

      path.enrollments[courseId] = courseProgress;

      // Genel ilerleme hesapla
      const totalProgress = Object.values(path.enrollments).reduce((a, b) => a + b, 0);
      path.progress = (totalProgress / path.courses.length * 100).toFixed(2);

      if (path.progress === 100) {
        path.completedAt = new Date();
      }

      this.learningPaths.set(pathId, path);

      recordEvent('learning_path_progress_updated', {
        pathId,
        courseId,
        pathProgress: path.progress
      });

      return path;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Yol ilerleme güncellenemedi: ${error.message}`);
    }
  }

  /**
   * Kullanıcının istatistiklerini al
   * @param {string} userId - Kullanıcı ID
   * @returns {Object} İstatistikler
   */
  getUserStats(userId) {
    try {
      const progressRecords = Array.from(this.progressRecords.values())
        .filter(r => r.userId === userId);

      const totalTimeSpent = progressRecords.reduce((sum, r) => sum + r.timeSpent, 0);
      const totalModulesCompleted = progressRecords.reduce((sum, r) => sum + r.completedModules.length, 0);
      const totalLessonsCompleted = progressRecords.reduce((sum, r) => sum + r.completedLessons.length, 0);
      const averageProgress = progressRecords.length > 0
        ? (progressRecords.reduce((sum, r) => sum + parseFloat(r.overallProgress), 0) / progressRecords.length).toFixed(2)
        : 0;

      const stats = {
        userId,
        enrolledCourses: progressRecords.length,
        totalTimeSpent,
        totalModulesCompleted,
        totalLessonsCompleted,
        averageProgress,
        completedCourses: progressRecords.filter(r => r.overallProgress === 100).length,
        inProgressCourses: progressRecords.filter(r => r.overallProgress > 0 && r.overallProgress < 100).length,
        notStartedCourses: progressRecords.filter(r => r.overallProgress === 0).length,
        averageTimePerCourse: progressRecords.length > 0
          ? Math.floor(totalTimeSpent / progressRecords.length)
          : 0,
        learningStreak: this.calculateStreak(progressRecords),
        mostActiveDay: this.getMostActiveDay(progressRecords),
        completionRate: progressRecords.length > 0
          ? ((progressRecords.filter(r => r.overallProgress === 100).length / progressRecords.length) * 100).toFixed(2)
          : 0
      };

      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`İstatistikler yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Öğrenme streakını hesapla
   * @param {Array} progressRecords - İlerleme kayıtları
   * @returns {number} Streak (gün)
   */
  calculateStreak(progressRecords) {
    try {
      const activities = [];
      progressRecords.forEach(r => {
        r.activities.forEach(a => {
          activities.push(new Date(a.timestamp));
        });
      });

      if (activities.length === 0) return 0;

      activities.sort((a, b) => b - a);

      let streak = 1;
      let currentDate = new Date(activities[0]);
      currentDate.setHours(0, 0, 0, 0);

      for (let i = 1; i < activities.length; i++) {
        const prevDate = new Date(activities[i]);
        prevDate.setHours(0, 0, 0, 0);

        const diffDays = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          streak++;
          currentDate = prevDate;
        } else if (diffDays > 1) {
          break;
        }
      }

      return streak;
    } catch (error) {
      return 0;
    }
  }

  /**
   * En aktif gün bulma
   * @param {Array} progressRecords - İlerleme kayıtları
   * @returns {string} En aktif gün
   */
  getMostActiveDay(progressRecords) {
    try {
      const dayCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

      progressRecords.forEach(r => {
        r.activities.forEach(a => {
          const day = new Date(a.timestamp).getDay();
          dayCount[day]++;
        });
      });

      const mostActiveDayNum = Object.keys(dayCount).reduce((a, b) =>
        dayCount[a] > dayCount[b] ? a : b
      );

      return dayNames[mostActiveDayNum];
    } catch (error) {
      return 'Bilinmiyor';
    }
  }

  /**
   * İlerleme raporu oluştur
   * @param {string} userId - Kullanıcı ID
   * @returns {Object} Rapor
   */
  generateProgressReport(userId) {
    try {
      const stats = this.getUserStats(userId);
      const paths = Array.from(this.learningPaths.values())
        .filter(p => p.userId === userId);

      const report = {
        userId,
        generatedAt: new Date(),
        statistics: stats,
        learningPaths: paths,
        recommendations: this.generateRecommendations(stats),
        summary: `${stats.enrolledCourses} kursa kaydız. ${stats.completedCourses} kurs tamamlandı. Toplam öğrenme süresi: ${stats.totalTimeSpent} dakika.`
      };

      recordEvent('progress_report_generated', {
        userId,
        courses: stats.enrolledCourses,
        completedCourses: stats.completedCourses
      });

      return report;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Rapor oluşturulamadı: ${error.message}`);
    }
  }

  /**
   * Önerileri oluştur
   * @param {Object} stats - İstatistikler
   * @returns {Array} Öneriler
   */
  generateRecommendations(stats) {
    try {
      const recommendations = [];

      if (stats.completionRate < 50) {
        recommendations.push('Eksik kursları tamamlamaya odaklanın');
      }

      if (stats.learningStreak < 3) {
        recommendations.push('Öğrenme rutini oluşturmaya çalışın');
      }

      if (stats.inProgressCourses > 3) {
        recommendations.push('Çok fazla kursa aynı anda devam etmeyin');
      }

      if (stats.averageProgress > 80) {
        recommendations.push('Süper gidiyorsunuz! Yeni kurslar ekleyin');
      }

      return recommendations;
    } catch (error) {
      return [];
    }
  }
}

export default ProgressTrackingService;
