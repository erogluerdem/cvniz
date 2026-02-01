import Sentry from '@sentry/node';
import { recordEvent } from '../utils/logger.js';

/**
 * VideoStreamingService
 * Video streaming, adaptive bitrate, progress tracking
 * 
 * @class VideoStreamingService
 */
class VideoStreamingService {
  constructor() {
    this.videos = new Map();
    this.streamSessions = new Map();
    this.watchHistory = new Map();
    this.videoIdCounter = 0;
  }

  /**
   * Video yükle
   * @param {Object} videoData - Video verileri
   * @returns {Object} Yüklenen video
   */
  uploadVideo(videoData) {
    try {
      const videoId = `video-${++this.videoIdCounter}`;

      const video = {
        videoId,
        lessonId: videoData.lessonId,
        title: videoData.title,
        description: videoData.description,
        duration: videoData.duration, // seconds
        uploadedAt: new Date(),
        status: 'processing', // processing, ready, failed
        formats: {
          hd: {
            url: `https://cdn.cvniz.com/videos/${videoId}/1080p.mp4`,
            bitrate: 5000, // kbps
            resolution: '1080p',
            size: null
          },
          sd: {
            url: `https://cdn.cvniz.com/videos/${videoId}/720p.mp4`,
            bitrate: 2500,
            resolution: '720p',
            size: null
          },
          mobile: {
            url: `https://cdn.cvniz.com/videos/${videoId}/480p.mp4`,
            bitrate: 1000,
            resolution: '480p',
            size: null
          }
        },
        thumbnailUrl: videoData.thumbnailUrl,
        subtitles: {
          tr: null,
          en: null,
          es: null
        },
        captions: null,
        viewCount: 0,
        downloadCount: 0,
        playbackStats: {
          averageWatchDuration: 0,
          averagePlaybackSpeed: 1.0,
          completionRate: 0
        }
      };

      // Simüle et: Upload ve processing tamamlansın
      setTimeout(() => {
        video.status = 'ready';
        video.formats.hd.size = Math.floor(Math.random() * 400 + 200) * 1024 * 1024; // 200-600 MB
        video.formats.sd.size = Math.floor(Math.random() * 200 + 100) * 1024 * 1024; // 100-300 MB
        video.formats.mobile.size = Math.floor(Math.random() * 100 + 50) * 1024 * 1024; // 50-150 MB
      }, 5000);

      this.videos.set(videoId, video);

      recordEvent('video_uploaded', {
        videoId,
        title: video.title,
        duration: video.duration,
        lessonId: videoData.lessonId
      });

      return video;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Video yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Video detaylarını al
   * @param {string} videoId - Video ID
   * @returns {Object} Video detayları
   */
  getVideo(videoId) {
    try {
      const video = this.videos.get(videoId);
      if (!video) {
        return null;
      }
      return video;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Video yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Streaming oturumu başlat
   * @param {string} videoId - Video ID
   * @param {string} userId - Kullanıcı ID
   * @param {Object} options - Seçenekler
   * @returns {Object} Stream oturumu
   */
  startStreamSession(videoId, userId, options = {}) {
    try {
      const video = this.videos.get(videoId);
      if (!video) {
        return null;
      }

      const sessionId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Cihaz bant genişliğine göre format seç
      let selectedFormat = 'sd';
      if (options.bandwidth === 'high') {
        selectedFormat = 'hd';
      } else if (options.bandwidth === 'low') {
        selectedFormat = 'mobile';
      }

      const session = {
        sessionId,
        videoId,
        userId,
        startedAt: new Date(),
        endedAt: null,
        currentTime: options.resumeAt || 0,
        format: selectedFormat,
        bitrate: video.formats[selectedFormat].bitrate,
        playbackSpeed: options.playbackSpeed || 1.0,
        deviceType: options.deviceType || 'web', // web, mobile, tablet, tv
        qualitySwitches: 0,
        bufferingEvents: 0,
        bufferingTime: 0, // milliseconds
        pauses: 0,
        seeks: 0,
        isActive: true,
        streamUrl: `${video.formats[selectedFormat].url}?session=${sessionId}&user=${userId}`
      };

      this.streamSessions.set(sessionId, session);

      // Video view count'u artır
      video.viewCount += 1;
      this.videos.set(videoId, video);

      recordEvent('stream_started', {
        sessionId,
        videoId,
        userId,
        format: selectedFormat,
        deviceType: options.deviceType
      });

      return session;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Stream oturumu başlatılamadı: ${error.message}`);
    }
  }

  /**
   * Streaming oturumunu güncelle
   * @param {string} sessionId - Oturum ID
   * @param {Object} updates - Güncellemeler
   * @returns {Object} Güncellenmiş oturum
   */
  updateStreamSession(sessionId, updates) {
    try {
      const session = this.streamSessions.get(sessionId);
      if (!session) {
        return null;
      }

      if (updates.currentTime !== undefined) {
        session.currentTime = updates.currentTime;
      }

      if (updates.playbackSpeed !== undefined) {
        session.playbackSpeed = Math.max(0.5, Math.min(2.0, updates.playbackSpeed));
      }

      if (updates.format) {
        const video = this.videos.get(session.videoId);
        if (video && video.formats[updates.format]) {
          session.format = updates.format;
          session.bitrate = video.formats[updates.format].bitrate;
          session.qualitySwitches = (session.qualitySwitches || 0) + 1;

          recordEvent('quality_changed', {
            sessionId,
            newFormat: updates.format,
            bitrate: session.bitrate
          });
        }
      }

      if (updates.bufferingEvent) {
        session.bufferingEvents = (session.bufferingEvents || 0) + 1;
        session.bufferingTime = (session.bufferingTime || 0) + updates.bufferingEvent;
      }

      if (updates.pause) {
        session.pauses = (session.pauses || 0) + 1;
      }

      if (updates.seek) {
        session.seeks = (session.seeks || 0) + 1;
      }

      this.streamSessions.set(sessionId, session);
      return session;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Stream oturumu güncellenemedi: ${error.message}`);
    }
  }

  /**
   * Streaming oturumunu sonlandır
   * @param {string} sessionId - Oturum ID
   * @returns {Object} Sonlandırılan oturum
   */
  endStreamSession(sessionId) {
    try {
      const session = this.streamSessions.get(sessionId);
      if (!session) {
        return null;
      }

      session.isActive = false;
      session.endedAt = new Date();

      // İzleme geçmişini kaydet
      const watchHistoryId = `watch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const video = this.videos.get(session.videoId);
      const watchDuration = session.currentTime;
      const completionPercentage = (watchDuration / video.duration) * 100;

      this.watchHistory.set(watchHistoryId, {
        watchHistoryId,
        videoId: session.videoId,
        userId: session.userId,
        watchedAt: new Date(),
        watchDuration,
        totalDuration: video.duration,
        completionPercentage,
        playbackStats: {
          qualitySwitches: session.qualitySwitches,
          bufferingEvents: session.bufferingEvents,
          bufferingTime: session.bufferingTime,
          pauses: session.pauses,
          seeks: session.seeks,
          averagePlaybackSpeed: session.playbackSpeed
        }
      });

      // Video playback stats'ı güncelle
      const completedSessions = Array.from(this.streamSessions.values())
        .filter(s => s.videoId === session.videoId && !s.isActive);

      if (completedSessions.length > 0) {
        const avgDuration = completedSessions.reduce((sum, s) => sum + s.currentTime, 0) / completedSessions.length;
        const completionRate = completedSessions.filter(s => s.currentTime >= video.duration * 0.9).length / completedSessions.length;
        video.playbackStats.averageWatchDuration = Math.floor(avgDuration);
        video.playbackStats.completionRate = (completionRate * 100).toFixed(2);
        this.videos.set(session.videoId, video);
      }

      this.streamSessions.set(sessionId, session);

      recordEvent('stream_ended', {
        sessionId,
        videoId: session.videoId,
        watchDuration,
        completionPercentage: completionPercentage.toFixed(2)
      });

      return session;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Stream oturumu sonlandırılamadı: ${error.message}`);
    }
  }

  /**
   * Kullanıcının izleme geçmişini al
   * @param {string} userId - Kullanıcı ID
   * @returns {Array} İzleme geçmişi
   */
  getWatchHistory(userId) {
    try {
      const history = Array.from(this.watchHistory.values())
        .filter(h => h.userId === userId)
        .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));

      return history;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`İzleme geçmişi yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Video'ya subtitle ekle
   * @param {string} videoId - Video ID
   * @param {string} language - Dil kodu
   * @param {string} subtitleUrl - Subtitle dosya URL
   * @returns {Object} Güncellenmiş video
   */
  addSubtitle(videoId, language, subtitleUrl) {
    try {
      const video = this.videos.get(videoId);
      if (!video) {
        return null;
      }

      video.subtitles[language] = {
        language,
        url: subtitleUrl,
        addedAt: new Date()
      };

      this.videos.set(videoId, video);

      recordEvent('subtitle_added', {
        videoId,
        language
      });

      return video;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Subtitle eklenemedi: ${error.message}`);
    }
  }

  /**
   * Video indir
   * @param {string} videoId - Video ID
   * @param {string} userId - Kullanıcı ID
   * @param {string} format - Format (hd, sd, mobile)
   * @returns {Object} İndirme bilgileri
   */
  downloadVideo(videoId, userId, format = 'sd') {
    try {
      const video = this.videos.get(videoId);
      if (!video) {
        return null;
      }

      if (!video.formats[format]) {
        throw new Error('Geçersiz format');
      }

      video.downloadCount += 1;
      this.videos.set(videoId, video);

      recordEvent('video_downloaded', {
        videoId,
        userId,
        format,
        size: video.formats[format].size
      });

      return {
        downloadUrl: `${video.formats[format].url}?download=true&user=${userId}`,
        format,
        size: video.formats[format].size,
        expiresIn: 604800000 // 7 days in milliseconds
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Video indirilemedi: ${error.message}`);
    }
  }

  /**
   * Video istatistiklerini al
   * @param {string} videoId - Video ID
   * @returns {Object} İstatistikler
   */
  getVideoStats(videoId) {
    try {
      const video = this.videos.get(videoId);
      if (!video) {
        return null;
      }

      const watchHistories = Array.from(this.watchHistory.values())
        .filter(h => h.videoId === videoId);

      const completionRates = watchHistories.map(h => h.completionPercentage);
      const avgCompletion = completionRates.length > 0
        ? (completionRates.reduce((a, b) => a + b, 0) / completionRates.length).toFixed(2)
        : 0;

      const stats = {
        videoId,
        title: video.title,
        duration: video.duration,
        viewCount: video.viewCount,
        downloadCount: video.downloadCount,
        uniqueViewers: new Set(watchHistories.map(h => h.userId)).size,
        averageWatchDuration: video.playbackStats.averageWatchDuration,
        completionRate: video.playbackStats.completionRate,
        averageCompletion: avgCompletion,
        qualityDistribution: {
          hd: Array.from(this.streamSessions.values()).filter(s => s.videoId === videoId && s.format === 'hd').length,
          sd: Array.from(this.streamSessions.values()).filter(s => s.videoId === videoId && s.format === 'sd').length,
          mobile: Array.from(this.streamSessions.values()).filter(s => s.videoId === videoId && s.format === 'mobile').length
        },
        deviceDistribution: {
          web: Array.from(this.streamSessions.values()).filter(s => s.videoId === videoId && s.deviceType === 'web').length,
          mobile: Array.from(this.streamSessions.values()).filter(s => s.videoId === videoId && s.deviceType === 'mobile').length,
          tablet: Array.from(this.streamSessions.values()).filter(s => s.videoId === videoId && s.deviceType === 'tablet').length,
          tv: Array.from(this.streamSessions.values()).filter(s => s.videoId === videoId && s.deviceType === 'tv').length
        },
        subtitleLanguages: Object.keys(video.subtitles).filter(lang => video.subtitles[lang] !== null)
      };

      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Video istatistikleri yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Adaptive bitrate seç
   * @param {string} sessionId - Oturum ID
   * @param {number} networkSpeed - Ağ hızı (Mbps)
   * @returns {string} Seçilen format
   */
  selectAdaptiveBitrate(sessionId, networkSpeed) {
    try {
      const session = this.streamSessions.get(sessionId);
      if (!session) {
        return null;
      }

      let format = 'mobile';
      if (networkSpeed > 5) {
        format = 'hd';
      } else if (networkSpeed > 2.5) {
        format = 'sd';
      }

      if (session.format !== format) {
        session.format = format;
        const video = this.videos.get(session.videoId);
        session.bitrate = video.formats[format].bitrate;
        this.streamSessions.set(sessionId, session);
      }

      return format;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Bitrate seçilemedi: ${error.message}`);
    }
  }
}

export default VideoStreamingService;
