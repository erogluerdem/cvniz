import { useState, useCallback } from 'react';

/**
 * useLearning Hook
 * Kurs ve enrollment yönetimi
 */
export function useLearning() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchCourses = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`http://localhost:5000/api/learning/courses?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Kurslar yüklenemedi');
      const data = await response.json();
      setCourses(data.courses || []);
      return data;
    } catch (err) {
      setError(err.message);
      return { courses: [] };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/learning/courses/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Kurs yüklenemedi');
      const data = await response.json();
      return data.course;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const enrollCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/courses/${courseId}/enroll`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Kayıt başarısız');
      const data = await response.json();
      setEnrollments([data.enrollment, ...enrollments]);
      return data.enrollment;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, enrollments]);

  const fetchEnrollments = useCallback(async (status = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = status ? `?status=${status}` : '';
      const response = await fetch(
        `http://localhost:5000/api/learning/enrollments${params}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Enrolmentler yüklenemedi');
      const data = await response.json();
      setEnrollments(data.enrollments || []);
      return data;
    } catch (err) {
      setError(err.message);
      return { enrollments: [] };
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    courses,
    enrollments,
    loading,
    error,
    fetchCourses,
    getCourse,
    enrollCourse,
    fetchEnrollments
  };
}

/**
 * useVideo Hook
 * Video streaming yönetimi
 */
export function useVideo() {
  const [video, setVideo] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const getVideo = useCallback(async (videoId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/learning/videos/${videoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Video yüklenemedi');
      const data = await response.json();
      setVideo(data.video);
      return data.video;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const startStreaming = useCallback(async (videoId, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/videos/${videoId}/stream`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(options)
        }
      );
      if (!response.ok) throw new Error('Stream başlatılamadı');
      const data = await response.json();
      setSession(data.session);
      return data.session;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateStream = useCallback(async (sessionId, updates) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/stream/${sessionId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );
      if (!response.ok) throw new Error('Stream güncellenemedi');
      const data = await response.json();
      setSession(data.session);
      return data.session;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [token]);

  const endStream = useCallback(async (sessionId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/stream/${sessionId}/end`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Stream sonlandırılamadı');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    video,
    session,
    loading,
    error,
    getVideo,
    startStreaming,
    updateStream,
    endStream
  };
}

/**
 * useQuiz Hook
 * Quiz ve attempt yönetimi
 */
export function useQuiz() {
  const [attempt, setAttempt] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const startQuiz = useCallback(async (quizId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/quizzes/${quizId}/start`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Quiz başlatılamadı');
      const data = await response.json();
      setAttempt(data.attempt);
      return data.attempt;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const answerQuestion = useCallback(async (attemptId, questionId, answer) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/attempts/${attemptId}/answer`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ questionId, answer })
        }
      );
      if (!response.ok) throw new Error('Cevap kaydedilemedi');
      const data = await response.json();
      setAttempt(data.attempt);
      return data.attempt;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [token]);

  const submitQuiz = useCallback(async (attemptId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/attempts/${attemptId}/submit`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Quiz gönderilemedi');
      const data = await response.json();
      setAttempt(data.attempt);
      setResults(data.attempt);
      return data.attempt;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getResults = useCallback(async (attemptId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/attempts/${attemptId}/results`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Sonuçlar yüklenemedi');
      const data = await response.json();
      setResults(data.results);
      return data.results;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    attempt,
    results,
    loading,
    error,
    startQuiz,
    answerQuestion,
    submitQuiz,
    getResults
  };
}

/**
 * useCertificate Hook
 * Sertifika yönetimi
 */
export function useCertificate() {
  const [certificates, setCertificates] = useState([]);
  const [currentCert, setCurrentCert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/learning/my-certificates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Sertifikalar yüklenemedi');
      const data = await response.json();
      setCertificates(data.certificates || []);
      return data.certificates;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getCertificate = useCallback(async (certificateId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/certificates/${certificateId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Sertifika yüklenemedi');
      const data = await response.json();
      setCurrentCert(data.certificate);
      return data.certificate;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const verifyCertificate = useCallback(async (certificateId, verificationCode) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/certificates/${certificateId}/verify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ verificationCode })
        }
      );
      if (!response.ok) throw new Error('Doğrulama başarısız');
      return await response.json();
    } catch (err) {
      setError(err.message);
      return { isValid: false };
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    certificates,
    currentCert,
    loading,
    error,
    fetchCertificates,
    getCertificate,
    verifyCertificate
  };
}

/**
 * useProgress Hook
 * İlerleme izleme
 */
export function useProgress() {
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/learning/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('İstatistikler yüklenemedi');
      const data = await response.json();
      setStats(data.stats);
      return data.stats;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const generateReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/learning/report', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Rapor oluşturulamadı');
      const data = await response.json();
      setReport(data.report);
      return data.report;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateProgress = useCallback(async (recordId, updates) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/learning/progress/${recordId}/update`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );
      if (!response.ok) throw new Error('İlerleme güncellenemedi');
      return await response.json();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [token]);

  return {
    stats,
    report,
    loading,
    error,
    fetchStats,
    generateReport,
    updateProgress
  };
}

export default {
  useLearning,
  useVideo,
  useQuiz,
  useCertificate,
  useProgress
};
