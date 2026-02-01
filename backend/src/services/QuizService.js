import Sentry from '@sentry/node';
import { recordEvent } from '../utils/logger.js';

/**
 * QuizService
 * Quiz yönetimi, sınav yapma, sonuç hesaplama
 * 
 * @class QuizService
 */
class QuizService {
  constructor() {
    this.quizzes = new Map();
    this.attempts = new Map();
    this.questions = new Map();
    this.quizIdCounter = 0;
  }

  /**
   * Quiz oluştur
   * @param {Object} quizData - Quiz verileri
   * @returns {Object} Oluşturulan quiz
   */
  createQuiz(quizData) {
    try {
      const quizId = `quiz-${++this.quizIdCounter}`;

      const quiz = {
        quizId,
        lessonId: quizData.lessonId,
        title: quizData.title,
        description: quizData.description,
        type: quizData.type || 'assessment', // assessment, survey, practice
        totalQuestions: 0,
        totalPoints: 0,
        passingScore: quizData.passingScore || 70,
        timeLimit: quizData.timeLimit || null, // minutes
        showFeedback: quizData.showFeedback !== false,
        showCorrectAnswers: quizData.showCorrectAnswers !== false,
        randomizeQuestions: quizData.randomizeQuestions || false,
        randomizeAnswers: quizData.randomizeAnswers || false,
        questions: [],
        difficulty: quizData.difficulty || 'medium', // easy, medium, hard
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft', // draft, published, archived
        attempts: 0,
        averageScore: 0,
        passRate: 0,
        statistics: {
          totalAttempts: 0,
          passedAttempts: 0,
          failedAttempts: 0,
          averageTime: 0
        }
      };

      this.quizzes.set(quizId, quiz);

      recordEvent('quiz_created', {
        quizId,
        title: quiz.title,
        type: quiz.type,
        lessonId: quizData.lessonId
      });

      return quiz;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Quiz oluşturulamadı: ${error.message}`);
    }
  }

  /**
   * Quiz'e soru ekle
   * @param {string} quizId - Quiz ID
   * @param {Object} questionData - Soru verileri
   * @returns {Object} Oluşturulan soru
   */
  addQuestion(quizId, questionData) {
    try {
      const quiz = this.quizzes.get(quizId);
      if (!quiz) {
        return null;
      }

      const questionId = `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const question = {
        questionId,
        quizId,
        text: questionData.text,
        type: questionData.type || 'multiple', // multiple, true-false, short-answer, essay
        points: questionData.points || 1,
        difficulty: questionData.difficulty || 'medium',
        explanation: questionData.explanation || '',
        order: (quiz.questions.length || 0) + 1,
        imageUrl: questionData.imageUrl || null
      };

      // Soru türüne göre seçenekleri ekle
      if (question.type === 'multiple' || question.type === 'true-false') {
        question.options = questionData.options.map((opt, idx) => ({
          id: `opt-${idx}`,
          text: opt.text,
          isCorrect: opt.isCorrect || false
        }));
      } else if (question.type === 'short-answer') {
        question.correctAnswers = questionData.correctAnswers || [];
        question.caseSensitive = questionData.caseSensitive || false;
      } else if (question.type === 'essay') {
        question.rubric = questionData.rubric || null;
      }

      this.questions.set(questionId, question);
      quiz.questions.push(questionId);
      quiz.totalQuestions = quiz.questions.length;
      quiz.totalPoints += question.points;
      quiz.updatedAt = new Date();

      this.quizzes.set(quizId, quiz);

      recordEvent('question_added', {
        questionId,
        quizId,
        type: question.type,
        points: question.points
      });

      return question;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Soru eklenemedi: ${error.message}`);
    }
  }

  /**
   * Quiz yayınla
   * @param {string} quizId - Quiz ID
   * @returns {Object} Yayınlanan quiz
   */
  publishQuiz(quizId) {
    try {
      const quiz = this.quizzes.get(quizId);
      if (!quiz) {
        return null;
      }

      if (quiz.questions.length === 0) {
        throw new Error('Quiz yayınlanmak için en az bir soru gerekli');
      }

      quiz.status = 'published';
      quiz.updatedAt = new Date();
      this.quizzes.set(quizId, quiz);

      recordEvent('quiz_published', {
        quizId,
        title: quiz.title,
        questions: quiz.questions.length
      });

      return quiz;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Quiz yayınlanamadı: ${error.message}`);
    }
  }

  /**
   * Quiz denemesini başlat
   * @param {string} quizId - Quiz ID
   * @param {string} userId - Kullanıcı ID
   * @returns {Object} Başlanan deneme
   */
  startAttempt(quizId, userId) {
    try {
      const quiz = this.quizzes.get(quizId);
      if (!quiz) {
        return null;
      }

      if (quiz.status !== 'published') {
        throw new Error('Quiz yayınlanmamış');
      }

      const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const attempt = {
        attemptId,
        quizId,
        userId,
        startedAt: new Date(),
        endedAt: null,
        submittedAt: null,
        answers: {},
        score: null,
        percentage: null,
        passed: null,
        timeTaken: null,
        feedback: null,
        isActive: true
      };

      // Soruları randomize et gerekirse
      let questionIds = [...quiz.questions];
      if (quiz.randomizeQuestions) {
        questionIds = questionIds.sort(() => Math.random() - 0.5);
      }

      attempt.questions = questionIds.map(id => {
        const question = this.questions.get(id);
        let options = question.options;
        
        if (options && quiz.randomizeAnswers) {
          options = [...options].sort(() => Math.random() - 0.5);
        }

        return {
          id,
          text: question.text,
          type: question.type,
          points: question.points,
          imageUrl: question.imageUrl,
          options: options,
          order: question.order
        };
      });

      this.attempts.set(attemptId, attempt);

      // Quiz attempts sayısını güncelle
      quiz.attempts += 1;
      this.quizzes.set(quizId, quiz);

      recordEvent('quiz_attempt_started', {
        attemptId,
        quizId,
        userId,
        questionCount: attempt.questions.length
      });

      return attempt;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Deneme başlatılamadı: ${error.message}`);
    }
  }

  /**
   * Soruya cevap ver
   * @param {string} attemptId - Deneme ID
   * @param {string} questionId - Soru ID
   * @param {*} answer - Cevap
   * @returns {Object} Güncellenmiş deneme
   */
  answerQuestion(attemptId, questionId, answer) {
    try {
      const attempt = this.attempts.get(attemptId);
      if (!attempt) {
        return null;
      }

      if (!attempt.isActive) {
        throw new Error('Bu deneme aktif değil');
      }

      attempt.answers[questionId] = {
        answer,
        answeredAt: new Date()
      };

      this.attempts.set(attemptId, attempt);

      recordEvent('question_answered', {
        attemptId,
        questionId,
        answerType: typeof answer
      });

      return attempt;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Cevap kaydedilemedi: ${error.message}`);
    }
  }

  /**
   * Quiz denemesini gönder ve puanla
   * @param {string} attemptId - Deneme ID
   * @returns {Object} Puanlandırılmış deneme
   */
  submitAttempt(attemptId) {
    try {
      const attempt = this.attempts.get(attemptId);
      if (!attempt) {
        return null;
      }

      if (!attempt.isActive) {
        throw new Error('Bu deneme aktif değil');
      }

      const quiz = this.quizzes.get(attempt.quizId);
      let score = 0;
      let feedback = [];

      // Her soruyu puanla
      attempt.questions.forEach(q => {
        const question = this.questions.get(q.id);
        const userAnswer = attempt.answers[q.id];

        if (question.type === 'multiple' || question.type === 'true-false') {
          const correctOption = question.options.find(opt => opt.isCorrect);
          
          if (userAnswer && userAnswer.answer === correctOption.id) {
            score += question.points;
            feedback.push({
              questionId: q.id,
              correct: true,
              message: `Doğru! ${question.explanation}`
            });
          } else {
            feedback.push({
              questionId: q.id,
              correct: false,
              correctAnswer: correctOption.text,
              message: `Yanlış. Doğru cevap: ${correctOption.text}. ${question.explanation}`
            });
          }
        } else if (question.type === 'short-answer') {
          if (userAnswer) {
            const answer = question.caseSensitive 
              ? userAnswer.answer 
              : userAnswer.answer.toLowerCase();
            
            const isCorrect = question.correctAnswers.some(ca =>
              question.caseSensitive ? ca === userAnswer.answer : ca.toLowerCase() === answer
            );

            if (isCorrect) {
              score += question.points;
              feedback.push({
                questionId: q.id,
                correct: true,
                message: `Doğru! ${question.explanation}`
              });
            } else {
              feedback.push({
                questionId: q.id,
                correct: false,
                message: `Yanlış. ${question.explanation}`
              });
            }
          }
        } else if (question.type === 'essay') {
          // Essay: Manuel puanlama gerekli (simüle: 0 puan)
          feedback.push({
            questionId: q.id,
            correct: null,
            message: 'Essayınız manuel olarak puanlandırılacak.'
          });
        }
      });

      // Puanları hesapla
      attempt.score = score;
      attempt.percentage = (score / quiz.totalPoints * 100).toFixed(2);
      attempt.passed = attempt.percentage >= quiz.passingScore;
      attempt.endedAt = new Date();
      attempt.submittedAt = new Date();
      attempt.timeTaken = (attempt.endedAt - attempt.startedAt) / 1000 / 60; // minutes
      attempt.isActive = false;
      attempt.feedback = quiz.showCorrectAnswers ? feedback : [];

      this.attempts.set(attemptId, attempt);

      // Quiz istatistiklerini güncelle
      quiz.statistics.totalAttempts += 1;
      if (attempt.passed) {
        quiz.statistics.passedAttempts += 1;
      } else {
        quiz.statistics.failedAttempts += 1;
      }
      
      const allAttempts = Array.from(this.attempts.values())
        .filter(a => a.quizId === attempt.quizId && a.score !== null);
      
      if (allAttempts.length > 0) {
        const avgScore = allAttempts.reduce((sum, a) => sum + parseFloat(a.score), 0) / allAttempts.length;
        quiz.averageScore = avgScore.toFixed(2);
        quiz.passRate = ((quiz.statistics.passedAttempts / quiz.statistics.totalAttempts) * 100).toFixed(2);
      }

      this.quizzes.set(attempt.quizId, quiz);

      recordEvent('quiz_submitted', {
        attemptId,
        quizId: attempt.quizId,
        score,
        percentage: attempt.percentage,
        passed: attempt.passed,
        timeTaken: attempt.timeTaken
      });

      return attempt;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Deneme gönderilemedi: ${error.message}`);
    }
  }

  /**
   * Quiz detaylarını al
   * @param {string} quizId - Quiz ID
   * @returns {Object} Quiz detayları
   */
  getQuiz(quizId) {
    try {
      const quiz = this.quizzes.get(quizId);
      if (!quiz) {
        return null;
      }

      return {
        ...quiz,
        questions: quiz.questions.map(id => this.questions.get(id))
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Quiz yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Deneme sonuçlarını al
   * @param {string} attemptId - Deneme ID
   * @returns {Object} Deneme sonuçları
   */
  getAttemptResults(attemptId) {
    try {
      const attempt = this.attempts.get(attemptId);
      if (!attempt) {
        return null;
      }

      if (!attempt.submittedAt) {
        throw new Error('Bu deneme henüz gönderilmedi');
      }

      return {
        attemptId: attempt.attemptId,
        quizId: attempt.quizId,
        userId: attempt.userId,
        score: attempt.score,
        percentage: attempt.percentage,
        passed: attempt.passed,
        timeTaken: attempt.timeTaken,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        feedback: attempt.feedback
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Sonuçlar yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Kullanıcının quiz denemelerini listele
   * @param {string} userId - Kullanıcı ID
   * @returns {Array} Denemeler
   */
  getUserAttempts(userId) {
    try {
      const attempts = Array.from(this.attempts.values())
        .filter(a => a.userId === userId && a.submittedAt !== null)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

      return attempts.map(a => ({
        ...a,
        quiz: this.quizzes.get(a.quizId)
      }));
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Denemeler yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Quiz istatistiklerini al
   * @param {string} quizId - Quiz ID
   * @returns {Object} İstatistikler
   */
  getQuizStats(quizId) {
    try {
      const quiz = this.quizzes.get(quizId);
      if (!quiz) {
        return null;
      }

      const allAttempts = Array.from(this.attempts.values())
        .filter(a => a.quizId === quizId);

      const submittedAttempts = allAttempts.filter(a => a.submittedAt !== null);
      const scores = submittedAttempts.map(a => parseFloat(a.score));

      return {
        quizId,
        title: quiz.title,
        totalAttempts: quiz.statistics.totalAttempts,
        passedAttempts: quiz.statistics.passedAttempts,
        failedAttempts: quiz.statistics.failedAttempts,
        passRate: quiz.passRate,
        averageScore: quiz.averageScore,
        highestScore: scores.length > 0 ? Math.max(...scores) : 0,
        lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
        totalQuestions: quiz.totalQuestions,
        totalPoints: quiz.totalPoints,
        difficulty: quiz.difficulty,
        type: quiz.type
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`İstatistikler yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Soru performansını analiz et
   * @param {string} quizId - Quiz ID
   * @returns {Object} Soru analizi
   */
  analyzeQuestionPerformance(quizId) {
    try {
      const quiz = this.quizzes.get(quizId);
      if (!quiz) {
        return null;
      }

      const allAttempts = Array.from(this.attempts.values())
        .filter(a => a.quizId === quizId && a.submittedAt !== null);

      const analysis = {};

      quiz.questions.forEach(questionId => {
        const question = this.questions.get(questionId);
        const correctCount = allAttempts.filter(a => {
          const question = this.questions.get(questionId);
          const userAnswer = a.answers[questionId];
          
          if (question.type === 'multiple' || question.type === 'true-false') {
            const correctOption = question.options.find(opt => opt.isCorrect);
            return userAnswer && userAnswer.answer === correctOption.id;
          }
          return false;
        }).length;

        analysis[questionId] = {
          question: question.text,
          difficulty: question.difficulty,
          totalAttempts: allAttempts.length,
          correctAnswers: correctCount,
          correctPercentage: allAttempts.length > 0 
            ? ((correctCount / allAttempts.length) * 100).toFixed(2)
            : 0,
          discriminationIndex: 'medium'
        };
      });

      return analysis;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Soru analizi yapılamadı: ${error.message}`);
    }
  }
}

export default QuizService;
