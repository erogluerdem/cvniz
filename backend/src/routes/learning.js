import express from 'express';
import auth from '../middleware/auth.js';
import CourseService from '../services/CourseService.js';
import VideoStreamingService from '../services/VideoStreamingService.js';
import QuizService from '../services/QuizService.js';
import CertificateService from '../services/CertificateService.js';
import ProgressTrackingService from '../services/ProgressTrackingService.js';
import Sentry from '@sentry/node';

const router = express.Router();
const courseService = new CourseService();
const videoService = new VideoStreamingService();
const quizService = new QuizService();
const certificateService = new CertificateService();
const progressService = new ProgressTrackingService();

// ============================================
// COURSE ROUTES
// ============================================

/**
 * POST /api/learning/courses
 * Yeni kurs oluştur
 */
router.post('/courses', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      thumbnail,
      instructor,
      instructorBio,
      isPremium,
      price,
      learningOutcomes,
      requirements,
      tags,
      duration
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Başlık ve açıklama gerekli'
      });
    }

    const course = courseService.createCourse({
      userId: req.user.id,
      title,
      description,
      category,
      level,
      thumbnail,
      instructor: instructor || req.user.name,
      instructorBio,
      isPremium,
      price,
      learningOutcomes,
      requirements,
      tags,
      duration
    });

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/courses/:courseId
 * Kurs detaylarını al
 */
router.get('/courses/:courseId', async (req, res) => {
  try {
    const course = courseService.getCourse(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Kurs bulunamadı'
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/courses
 * Kursları ara ve listele
 */
router.get('/courses', async (req, res) => {
  try {
    const { search, category, level, isPremium, sortBy, page = 1 } = req.query;

    const courses = courseService.searchCourses({
      search,
      category,
      level,
      isPremium: isPremium === 'true',
      sortBy
    });

    const limit = 20;
    const skip = (page - 1) * limit;
    const paginated = courses.slice(skip, skip + limit);

    res.json({
      success: true,
      courses: paginated,
      pagination: {
        page: parseInt(page),
        limit,
        total: courses.length,
        pages: Math.ceil(courses.length / limit)
      }
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/courses/:courseId/enroll
 * Kursa kayıt ol
 */
router.post('/courses/:courseId/enroll', auth, async (req, res) => {
  try {
    const enrollment = courseService.enrollInCourse(req.params.courseId, req.user.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Kurs bulunamadı'
      });
    }

    res.status(201).json({
      success: true,
      enrollment
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/enrollments
 * Kullanıcının enrolmentlerini al
 */
router.get('/enrollments', auth, async (req, res) => {
  try {
    const { status, page = 1 } = req.query;

    const result = courseService.getUserEnrollments(req.user.id, {
      status,
      page: parseInt(page),
      limit: 20
    });

    res.json({
      success: true,
      enrollments: result.enrollments,
      pagination: result.pagination
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// VIDEO STREAMING ROUTES
// ============================================

/**
 * POST /api/learning/videos
 * Video yükle
 */
router.post('/videos', auth, async (req, res) => {
  try {
    const { lessonId, title, description, duration, thumbnailUrl } = req.body;

    const video = videoService.uploadVideo({
      lessonId,
      title,
      description,
      duration,
      thumbnailUrl
    });

    res.status(201).json({
      success: true,
      video
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/videos/:videoId
 * Video detaylarını al
 */
router.get('/videos/:videoId', async (req, res) => {
  try {
    const video = videoService.getVideo(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video bulunamadı'
      });
    }

    res.json({
      success: true,
      video
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/videos/:videoId/stream
 * Streaming oturumunu başlat
 */
router.post('/videos/:videoId/stream', auth, async (req, res) => {
  try {
    const { bandwidth, deviceType, resumeAt } = req.body;

    const session = videoService.startStreamSession(
      req.params.videoId,
      req.user.id,
      { bandwidth, deviceType, resumeAt }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video bulunamadı'
      });
    }

    res.status(201).json({
      success: true,
      session
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/stream/:sessionId
 * Streaming oturumunu güncelle
 */
router.post('/stream/:sessionId', auth, async (req, res) => {
  try {
    const session = videoService.updateStreamSession(req.params.sessionId, req.body);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Oturum bulunamadı'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/stream/:sessionId/end
 * Streaming oturumunu sonlandır
 */
router.post('/stream/:sessionId/end', auth, async (req, res) => {
  try {
    const session = videoService.endStreamSession(req.params.sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Oturum bulunamadı'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/videos/:videoId/stats
 * Video istatistiklerini al
 */
router.get('/videos/:videoId/stats', async (req, res) => {
  try {
    const stats = videoService.getVideoStats(req.params.videoId);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Video bulunamadı'
      });
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// QUIZ ROUTES
// ============================================

/**
 * POST /api/learning/quizzes
 * Quiz oluştur
 */
router.post('/quizzes', auth, async (req, res) => {
  try {
    const {
      lessonId,
      title,
      description,
      type,
      passingScore,
      timeLimit,
      showFeedback,
      showCorrectAnswers,
      difficulty
    } = req.body;

    const quiz = quizService.createQuiz({
      lessonId,
      title,
      description,
      type,
      passingScore,
      timeLimit,
      showFeedback,
      showCorrectAnswers,
      difficulty
    });

    res.status(201).json({
      success: true,
      quiz
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/quizzes/:quizId/questions
 * Quiz'e soru ekle
 */
router.post('/quizzes/:quizId/questions', auth, async (req, res) => {
  try {
    const {
      text,
      type,
      points,
      difficulty,
      explanation,
      imageUrl,
      options,
      correctAnswers,
      caseSensitive,
      rubric
    } = req.body;

    const question = quizService.addQuestion(req.params.quizId, {
      text,
      type,
      points,
      difficulty,
      explanation,
      imageUrl,
      options,
      correctAnswers,
      caseSensitive,
      rubric
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Quiz bulunamadı'
      });
    }

    res.status(201).json({
      success: true,
      question
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/quizzes/:quizId/start
 * Quiz denemesini başlat
 */
router.post('/quizzes/:quizId/start', auth, async (req, res) => {
  try {
    const attempt = quizService.startAttempt(req.params.quizId, req.user.id);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz bulunamadı'
      });
    }

    res.status(201).json({
      success: true,
      attempt
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/attempts/:attemptId/answer
 * Soruya cevap ver
 */
router.post('/attempts/:attemptId/answer', auth, async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    const attempt = quizService.answerQuestion(req.params.attemptId, questionId, answer);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Deneme bulunamadı'
      });
    }

    res.json({
      success: true,
      attempt
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/attempts/:attemptId/submit
 * Quiz denemesini gönder
 */
router.post('/attempts/:attemptId/submit', auth, async (req, res) => {
  try {
    const attempt = quizService.submitAttempt(req.params.attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Deneme bulunamadı'
      });
    }

    res.json({
      success: true,
      attempt
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/attempts/:attemptId/results
 * Deneme sonuçlarını al
 */
router.get('/attempts/:attemptId/results', auth, async (req, res) => {
  try {
    const results = quizService.getAttemptResults(req.params.attemptId);

    if (!results) {
      return res.status(404).json({
        success: false,
        message: 'Deneme bulunamadı'
      });
    }

    res.json({
      success: true,
      results
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// CERTIFICATE ROUTES
// ============================================

/**
 * POST /api/learning/certificates
 * Sertifika ver
 */
router.post('/certificates', auth, async (req, res) => {
  try {
    const certificate = certificateService.issueCertificate(req.body);

    res.status(201).json({
      success: true,
      certificate
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/certificates/:certificateId
 * Sertifika detaylarını al
 */
router.get('/certificates/:certificateId', async (req, res) => {
  try {
    const certificate = certificateService.getCertificate(req.params.certificateId);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Sertifika bulunamadı'
      });
    }

    res.json({
      success: true,
      certificate
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/certificates/:certificateId/verify
 * Sertifikayı doğrula
 */
router.post('/certificates/:certificateId/verify', async (req, res) => {
  try {
    const { verificationCode } = req.body;

    const result = certificateService.verifyCertificate(
      req.params.certificateId,
      verificationCode
    );

    res.json({
      success: result.isValid,
      result
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/my-certificates
 * Kullanıcının sertifikalarını al
 */
router.get('/my-certificates', auth, async (req, res) => {
  try {
    const certificates = certificateService.getUserCertificates(req.user.id);

    res.json({
      success: true,
      certificates
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// PROGRESS ROUTES
// ============================================

/**
 * GET /api/learning/progress/:recordId
 * İlerleme kaydını al
 */
router.get('/progress/:recordId', auth, async (req, res) => {
  try {
    const record = progressService.getProgressRecord(req.params.recordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'İlerleme kaydı bulunamadı'
      });
    }

    res.json({
      success: true,
      record
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/learning/progress/:recordId/update
 * İlerleme güncelle
 */
router.post('/progress/:recordId/update', auth, async (req, res) => {
  try {
    const record = progressService.updateProgress(req.params.recordId, req.body);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'İlerleme kaydı bulunamadı'
      });
    }

    res.json({
      success: true,
      record
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/stats
 * Kullanıcının istatistiklerini al
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = progressService.getUserStats(req.user.id);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/learning/report
 * İlerleme raporu oluştur
 */
router.get('/report', auth, async (req, res) => {
  try {
    const report = progressService.generateProgressReport(req.user.id);

    res.json({
      success: true,
      report
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
