import Sentry from '@sentry/node';
import { recordEvent } from '../utils/logger.js';

/**
 * CertificateService
 * Sertifika oluşturma, doğrulama, badge yönetimi
 * 
 * @class CertificateService
 */
class CertificateService {
  constructor() {
    this.certificates = new Map();
    this.badges = new Map();
    this.certificateIdCounter = 0;
  }

  /**
   * Sertifika oluştur ve ver
   * @param {Object} certData - Sertifika verileri
   * @returns {Object} Oluşturulan sertifika
   */
  issueCertificate(certData) {
    try {
      const certificateId = `cert-${++this.certificateIdCounter}`;

      const certificate = {
        certificateId,
        enrollmentId: certData.enrollmentId,
        courseId: certData.courseId,
        userId: certData.userId,
        courseName: certData.courseName,
        studentName: certData.studentName,
        instructorName: certData.instructorName,
        instructorSignature: certData.instructorSignature,
        issueDate: new Date(),
        completionDate: certData.completionDate,
        expiryDate: certData.expiryDate || null,
        skills: certData.skills || [],
        grade: certData.grade || null, // A, B, C, etc.
        finalScore: certData.finalScore || null,
        certificateTemplate: certData.certificateTemplate || 'standard',
        certificateNumber: this.generateCertificateNumber(),
        verificationCode: this.generateVerificationCode(),
        pdfUrl: `https://cdn.cvniz.com/certificates/${certificateId}.pdf`,
        imageUrl: `https://cdn.cvniz.com/certificates/${certificateId}.png`,
        credentialUrl: `https://cvniz.com/verify/${certificateId}`,
        isValid: true,
        status: 'issued', // issued, verified, revoked, expired
        verifications: 0,
        shareCount: 0,
        sharePlatforms: [],
        metadata: {
          courseDuration: certData.courseDuration || 0,
          completionTime: certData.completionTime || 0,
          courseLevel: certData.courseLevel || 'beginner',
          issuedBy: 'CV Niçin Learning Platform'
        },
        createdAt: new Date(),
        revokedAt: null,
        revokeReason: null
      };

      this.certificates.set(certificateId, certificate);

      recordEvent('certificate_issued', {
        certificateId,
        courseId: certData.courseId,
        userId: certData.userId,
        courseName: certData.courseName,
        certificateNumber: certificate.certificateNumber
      });

      return certificate;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Sertifika verilmedi: ${error.message}`);
    }
  }

  /**
   * Sertifika detaylarını al
   * @param {string} certificateId - Sertifika ID
   * @returns {Object} Sertifika detayları
   */
  getCertificate(certificateId) {
    try {
      const certificate = this.certificates.get(certificateId);
      if (!certificate) {
        return null;
      }

      // Son geçerlilik durumunu kontrol et
      if (certificate.expiryDate && new Date() > new Date(certificate.expiryDate)) {
        certificate.status = 'expired';
        certificate.isValid = false;
        this.certificates.set(certificateId, certificate);
      }

      return certificate;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Sertifika yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Sertifikayı doğrula
   * @param {string} certificateId - Sertifika ID
   * @param {string} verificationCode - Doğrulama kodu
   * @returns {Object} Doğrulama sonucu
   */
  verifyCertificate(certificateId, verificationCode) {
    try {
      const certificate = this.certificates.get(certificateId);
      if (!certificate) {
        return {
          isValid: false,
          message: 'Sertifika bulunamadı'
        };
      }

      if (!certificate.isValid) {
        return {
          isValid: false,
          message: 'Sertifika geçersiz',
          reason: certificate.status
        };
      }

      if (certificate.verificationCode !== verificationCode) {
        return {
          isValid: false,
          message: 'Doğrulama kodu yanlış'
        };
      }

      if (certificate.expiryDate && new Date() > new Date(certificate.expiryDate)) {
        certificate.status = 'expired';
        certificate.isValid = false;
        this.certificates.set(certificateId, certificate);
        return {
          isValid: false,
          message: 'Sertifika süresi dolmuş'
        };
      }

      certificate.verifications += 1;
      certificate.status = 'verified';
      this.certificates.set(certificateId, certificate);

      recordEvent('certificate_verified', {
        certificateId,
        verifications: certificate.verifications
      });

      return {
        isValid: true,
        certificate: {
          certificateNumber: certificate.certificateNumber,
          studentName: certificate.studentName,
          courseName: certificate.courseName,
          issueDate: certificate.issueDate,
          completionDate: certificate.completionDate,
          skills: certificate.skills,
          grade: certificate.grade
        }
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Doğrulama başarısız: ${error.message}`);
    }
  }

  /**
   * Sertifikayı iptal et
   * @param {string} certificateId - Sertifika ID
   * @param {string} reason - Gerekçe
   * @returns {Object} İptal edilen sertifika
   */
  revokeCertificate(certificateId, reason) {
    try {
      const certificate = this.certificates.get(certificateId);
      if (!certificate) {
        return null;
      }

      certificate.status = 'revoked';
      certificate.isValid = false;
      certificate.revokedAt = new Date();
      certificate.revokeReason = reason;
      this.certificates.set(certificateId, certificate);

      recordEvent('certificate_revoked', {
        certificateId,
        reason
      });

      return certificate;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Sertifika iptal edilemedi: ${error.message}`);
    }
  }

  /**
   * Kullanıcının sertifikalarını listele
   * @param {string} userId - Kullanıcı ID
   * @returns {Array} Sertifikalar
   */
  getUserCertificates(userId) {
    try {
      const certificates = Array.from(this.certificates.values())
        .filter(c => c.userId === userId && c.isValid)
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

      return certificates;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Sertifikalar yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Badge oluştur
   * @param {Object} badgeData - Badge verileri
   * @returns {Object} Oluşturulan badge
   */
  createBadge(badgeData) {
    try {
      const badgeId = `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const badge = {
        badgeId,
        name: badgeData.name,
        description: badgeData.description,
        icon: badgeData.icon,
        color: badgeData.color || '#4CAF50',
        category: badgeData.category || 'achievement', // achievement, milestone, skill, exclusive
        criteria: badgeData.criteria, // Kazanma kriteri
        criteriaType: badgeData.criteriaType || 'completion', // completion, score, streak, enrollment
        criteriaValue: badgeData.criteriaValue, // Kriterin değeri
        difficulty: badgeData.difficulty || 'medium',
        isPublic: badgeData.isPublic !== false,
        earnedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.badges.set(badgeId, badge);

      recordEvent('badge_created', {
        badgeId,
        name: badge.name,
        category: badge.category
      });

      return badge;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Badge oluşturulamadı: ${error.message}`);
    }
  }

  /**
   * Kullanıcıya badge ver
   * @param {string} userId - Kullanıcı ID
   * @param {string} badgeId - Badge ID
   * @returns {Object} Badge ve referans
   */
  awardBadge(userId, badgeId) {
    try {
      const badge = this.badges.get(badgeId);
      if (!badge) {
        return null;
      }

      const badgeAwardId = `award-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      badge.earnedCount += 1;
      this.badges.set(badgeId, badge);

      recordEvent('badge_awarded', {
        userId,
        badgeId,
        badgeName: badge.name,
        badgeCategory: badge.category
      });

      return {
        awardId: badgeAwardId,
        userId,
        badge,
        awardedAt: new Date()
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Badge verilemedi: ${error.message}`);
    }
  }

  /**
   * Kullanıcının badge'lerini listele
   * @param {string} userId - Kullanıcı ID
   * @returns {Array} Badge'ler
   */
  getUserBadges(userId) {
    try {
      // Simüle: Kullanıcı tüm public badge'leri gördü
      const badges = Array.from(this.badges.values())
        .filter(b => b.isPublic)
        .map(b => ({
          ...b,
          earned: Math.random() > 0.5 // Simüle: %50 oranında kazanılmış
        }));

      return badges.sort((a, b) => b.earned - a.earned);
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Badge'ler yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Badge'leri listele
   * @returns {Array} Badge'ler
   */
  listBadges() {
    try {
      return Array.from(this.badges.values())
        .filter(b => b.isPublic)
        .sort((a, b) => b.earnedCount - a.earnedCount);
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Badge'ler yüklenemedi: ${error.message}`);
    }
  }

  /**
   * Sertifika sayısını al
   * @param {string} courseId - Kurs ID
   * @returns {number} Sertifika sayısı
   */
  getCertificateCount(courseId) {
    try {
      const count = Array.from(this.certificates.values())
        .filter(c => c.courseId === courseId && c.isValid).length;
      return count;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Sertifika sayısı alınamadı: ${error.message}`);
    }
  }

  /**
   * Sertifika pdfini oluştur
   * @param {string} certificateId - Sertifika ID
   * @returns {Buffer} PDF buffer
   */
  generateCertificatePdf(certificateId) {
    try {
      const certificate = this.certificates.get(certificateId);
      if (!certificate) {
        return null;
      }

      // Simüle: PDF oluştur
      const pdfContent = `
        =======================================
        BAŞARI SERTİFİKASI
        =======================================
        
        Sertifika No: ${certificate.certificateNumber}
        Öğrenci: ${certificate.studentName}
        Kurs: ${certificate.courseName}
        Eğitmeni: ${certificate.instructorName}
        
        Veriliş Tarihi: ${new Date(certificate.issueDate).toLocaleDateString('tr-TR')}
        Tamamlanma Tarihi: ${new Date(certificate.completionDate).toLocaleDateString('tr-TR')}
        
        Final Puanı: ${certificate.finalScore}
        Not: ${certificate.grade}
        
        Öğrenilen Beceriler:
        ${certificate.skills.map(s => `  • ${s}`).join('\n')}
        
        Doğrulama Kodu: ${certificate.verificationCode}
        Doğrulama URL: ${certificate.credentialUrl}
        
        =======================================
        ${certificate.instructorSignature || 'Dijital İmza'}
        =======================================
      `;

      recordEvent('certificate_pdf_generated', {
        certificateId,
        studentName: certificate.studentName
      });

      return Buffer.from(pdfContent);
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`PDF oluşturulamadı: ${error.message}`);
    }
  }

  /**
   * Sertifikayı sosyal ağda paylaş
   * @param {string} certificateId - Sertifika ID
   * @param {string} platform - Platform (linkedin, twitter, facebook)
   * @returns {Object} Paylaşım bilgileri
   */
  shareCertificate(certificateId, platform) {
    try {
      const certificate = this.certificates.get(certificateId);
      if (!certificate) {
        return null;
      }

      certificate.shareCount += 1;
      if (!certificate.sharePlatforms.includes(platform)) {
        certificate.sharePlatforms.push(platform);
      }
      this.certificates.set(certificateId, certificate);

      const shareUrls = {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${certificate.credentialUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${certificate.credentialUrl}&text=CV Niçin'de ${certificate.courseName} kursunu başarıyla tamamladım!`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${certificate.credentialUrl}`
      };

      recordEvent('certificate_shared', {
        certificateId,
        platform,
        totalShares: certificate.shareCount
      });

      return {
        platform,
        shareUrl: shareUrls[platform] || shareUrls.linkedin,
        certificateUrl: certificate.credentialUrl,
        message: `${certificate.studentName} CV Niçin'de ${certificate.courseName} kursunu tamamladı!`
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Sertifika paylaşılamadı: ${error.message}`);
    }
  }

  /**
   * Sertifika istatistiklerini al
   * @returns {Object} İstatistikler
   */
  getCertificateStats() {
    try {
      const allCerts = Array.from(this.certificates.values());
      const validCerts = allCerts.filter(c => c.isValid);

      const stats = {
        totalCertificates: allCerts.length,
        validCertificates: validCerts.length,
        revokedCertificates: allCerts.filter(c => c.status === 'revoked').length,
        expiredCertificates: allCerts.filter(c => c.status === 'expired').length,
        averageGrade: validCerts.length > 0
          ? validCerts.reduce((sum, c) => sum + (c.grade ? 1 : 0), 0) / validCerts.length
          : 0,
        averageScore: validCerts.length > 0
          ? (validCerts.reduce((sum, c) => sum + (c.finalScore || 0), 0) / validCerts.length).toFixed(2)
          : 0,
        totalVerifications: validCerts.reduce((sum, c) => sum + c.verifications, 0),
        topCourses: this.getTopCourses(allCerts),
        badgesCreated: this.badges.size,
        totalBadgesAwarded: Array.from(this.badges.values()).reduce((sum, b) => sum + b.earnedCount, 0)
      };

      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`İstatistikler yüklenemedi: ${error.message}`);
    }
  }

  /**
   * En çok sertifikası verilen kursları al
   * @param {Array} certificates - Sertifikalar
   * @returns {Array} En çok kurslar
   */
  getTopCourses(certificates) {
    try {
      const courseMap = {};
      certificates.forEach(c => {
        if (!courseMap[c.courseId]) {
          courseMap[c.courseId] = {
            courseId: c.courseId,
            courseName: c.courseName,
            count: 0
          };
        }
        courseMap[c.courseId].count += 1;
      });

      return Object.values(courseMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Top kurslar alınamadı: ${error.message}`);
    }
  }

  /**
   * Sertifika numarası oluştur
   * @returns {string} Sertifika numarası
   */
  generateCertificateNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `CVNZ-${timestamp}-${random}`;
  }

  /**
   * Doğrulama kodu oluştur
   * @returns {string} Doğrulama kodu
   */
  generateVerificationCode() {
    return Math.random().toString(36).substr(2, 12).toUpperCase();
  }
}

export default CertificateService;
