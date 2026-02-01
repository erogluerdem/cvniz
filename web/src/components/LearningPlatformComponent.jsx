import React, { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Award, TrendingUp, Video, HelpCircle, FileText } from 'lucide-react';

export default function LearningPlatformComponent() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const [stats, setStats] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchStats();
    fetchCertificates();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/learning/courses', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Kurslar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/learning/enrollments', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setEnrollments(data.enrollments || []);
    } catch (error) {
      console.error('Enrolmentler yüklenemedi:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/learning/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/learning/my-certificates', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setCertificates(data.certificates || []);
    } catch (error) {
      console.error('Sertifikalar yüklenemedi:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/learning/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      if (data.success) {
        fetchEnrollments();
        alert('Kursa kaydınız başarılı!');
      }
    } catch (error) {
      console.error('Kayıt başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    if (progress >= 20) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Öğrenme Platformu</h1>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 font-semibold">Kaydız Kurslar</div>
            <div className="text-3xl font-bold text-blue-900">{stats.enrolledCourses}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 font-semibold">Tamamlanan</div>
            <div className="text-3xl font-bold text-green-900">{stats.completedCourses}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-600 font-semibold">Toplam Saat</div>
            <div className="text-3xl font-bold text-purple-900">{Math.floor(stats.totalTimeSpent / 60)}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-sm text-orange-600 font-semibold">Öğrenme Streaki</div>
            <div className="text-3xl font-bold text-orange-900">{stats.learningStreak} gün</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'discover', label: 'Kursları Keşfet', icon: BookOpen },
          { id: 'learning', label: 'Devam Ettiğim', icon: Play },
          { id: 'completed', label: 'Tamamlanan', icon: CheckCircle },
          { id: 'certificates', label: 'Sertifikalar', icon: Award }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          {courses.length === 0 ? (
            <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
              Henüz kurs yok
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <div key={course.courseId} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                    <BookOpen className="w-12 h-12" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{course.description.substring(0, 100)}...</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {course.level}
                      </span>
                      <span className="text-xs text-gray-500">
                        {course.enrollmentCount} öğrenci
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-semibold">{course.rating.average.toFixed(1)}</span>
                    </div>

                    <button
                      onClick={() => handleEnroll(course.courseId)}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Kaydediliyor...' : 'Kursa Kayıt Ol'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Learning Tab */}
      {activeTab === 'learning' && (
        <div className="space-y-4">
          {enrollments.filter(e => e.status === 'active').length === 0 ? (
            <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
              Henüz kursa kaydolmadınız
            </div>
          ) : (
            enrollments
              .filter(e => e.status === 'active')
              .map(enrollment => (
                <div key={enrollment.enrollmentId} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{enrollment.course?.title}</h3>
                      <p className="text-sm text-gray-600">{enrollment.course?.instructor}</p>
                    </div>
                    <span className={`text-sm font-semibold ${getProgressColor(enrollment.progressPercentage)}`}>
                      {enrollment.progressPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>Son açılış: {new Date(enrollment.lastAccessedAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold">
                      Devam Et →
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Completed Tab */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {enrollments.filter(e => e.status === 'completed').length === 0 ? (
            <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
              Henüz kurs tamamlamadınız
            </div>
          ) : (
            enrollments
              .filter(e => e.status === 'completed')
              .map(enrollment => (
                <div key={enrollment.enrollmentId} className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-800">{enrollment.course?.title}</h3>
                        <p className="text-sm text-gray-600">
                          Tamamlanma Tarihi: {new Date(enrollment.completedAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                      Sertifikayı Görüntüle
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
              Henüz sertifikaya sahip değilsiniz
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <div key={cert.certificateId} className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="flex items-start justify-between mb-2">
                    <Award className="w-6 h-6 text-yellow-600" />
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                      {cert.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-1">{cert.courseName}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Veriliş: {new Date(cert.issueDate).toLocaleDateString('tr-TR')}
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-semibold">
                      İndir
                    </button>
                    <button className="flex-1 px-3 py-2 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-100 transition text-sm font-semibold">
                      Paylaş
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Learning Tips */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Öğrenmeyi Maksimize Edin</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Hergün öğrenme alışkanlığı oluşturun</li>
              <li>✓ Video'ları iki kez izleyin</li>
              <li>✓ Quiz'leri eksiksiz yapın</li>
              <li>✓ Sertifikalarınızı sosyal ağlarda paylaşın</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
