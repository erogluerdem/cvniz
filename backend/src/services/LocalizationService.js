const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

// Language Schema
const languageSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  nativeName: String,
  englishName: String,
  region: [String],
  rtl: { type: Boolean, default: false },
  numeralSystem: { type: String, default: 'latin' },
  dateFormat: String,
  timeFormat: String,
  currencyFormat: String,
  status: { type: String, enum: ['active', 'beta', 'deprecated'], default: 'active' },
  completeness: {
    percentage: Number,
    lastUpdated: Date,
    translator: String
  },
  metadata: {
    speakers: Number,
    familyTree: [String],
    dialects: [String]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

languageSchema.index({ code: 1, status: 1 });

// Translation Schema
const translationSchema = new mongoose.Schema({
  key: { type: String, required: true, index: true },
  namespace: { type: String, required: true },
  context: String,
  translations: Map,
  metadata: {
    pluralRules: String,
    interpolations: [String],
    variables: [String]
  },
  status: {
    reviewed: { type: Boolean, default: false },
    QA: { type: Boolean, default: false },
    readyForProduction: { type: Boolean, default: false }
  },
  metadata: {
    createdBy: String,
    lastModifiedBy: String,
    notes: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

translationSchema.index({ key: 1, namespace: 1 });
translationSchema.index({ 'status.readyForProduction': 1 });

// User Language Preference Schema
const userLanguagePrefSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true, unique: true },
  preferredLanguage: { type: String, required: true },
  secondaryLanguages: [String],
  autoDetect: { type: Boolean, default: true },
  dateFormat: String,
  timeFormat: String,
  numberFormat: String,
  currencyFormat: String,
  interfaceLanguage: String,
  contentLanguages: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

userLanguagePrefSchema.index({ userId: 1 });

const Language = mongoose.model('Language', languageSchema);
const Translation = mongoose.model('Translation', translationSchema);
const UserLanguagePreference = mongoose.model('UserLanguagePreference', userLanguagePrefSchema);

class LocalizationService {
  // Language Management
  async getAllLanguages(includeInactive = false) {
    try {
      const query = includeInactive ? {} : { status: 'active' };
      const languages = await Language.find(query).sort({ name: 1 });
      recordEvent('languages_listed', { count: languages.length, inactive: includeInactive });
      return languages;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Dilleri listelerken hata: ${error.message}`);
    }
  }

  async getLanguage(code) {
    try {
      const language = await Language.findOne({ code });
      if (!language) throw new Error('Dil bulunamadı');
      recordEvent('language_retrieved', { code });
      return language;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async createLanguage(languageData) {
    try {
      const language = new Language(languageData);
      await language.save();
      recordEvent('language_created', { code: language.code, name: language.name });
      return language;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async updateLanguageStatus(code, status, completeness) {
    try {
      const language = await Language.findOneAndUpdate(
        { code },
        {
          status,
          'completeness.percentage': completeness,
          'completeness.lastUpdated': new Date(),
          updatedAt: new Date()
        },
        { new: true }
      );
      recordEvent('language_status_updated', { code, status, completeness });
      return language;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Translation Management
  async getTranslation(key, language) {
    try {
      const translation = await Translation.findOne({ key });
      if (!translation) throw new Error('Çeviri bulunamadı');

      const value = translation.translations.get(language);
      recordEvent('translation_retrieved', { key, language });
      
      return {
        key,
        language,
        value: value || translation.translations.get('en'),
        metadata: translation.metadata
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async getTranslations(namespace, language) {
    try {
      const translations = await Translation.find({ 
        namespace,
        'status.readyForProduction': true
      });

      const result = {};
      for (const trans of translations) {
        result[trans.key] = trans.translations.get(language) || trans.translations.get('en');
      }

      recordEvent('translations_retrieved', { namespace, language, count: translations.length });
      return result;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async addTranslation(key, namespace, language, value, metadata = {}) {
    try {
      let translation = await Translation.findOne({ key, namespace });

      if (!translation) {
        translation = new Translation({
          key,
          namespace,
          translations: new Map(),
          metadata
        });
      }

      translation.translations.set(language, value);
      await translation.save();

      recordEvent('translation_added', { key, namespace, language });
      return translation;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async updateTranslation(key, language, value) {
    try {
      const translation = await Translation.findOneAndUpdate(
        { key },
        {
          $set: { [`translations.${language}`]: value },
          updatedAt: new Date()
        },
        { new: true }
      );

      recordEvent('translation_updated', { key, language });
      return translation;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async reviewTranslation(key, language, status) {
    try {
      const translation = await Translation.findOneAndUpdate(
        { key },
        {
          'status.reviewed': true,
          'status.QA': status === 'approved',
          'status.readyForProduction': status === 'approved',
          updatedAt: new Date()
        },
        { new: true }
      );

      recordEvent('translation_reviewed', { key, language, status });
      return translation;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async getTranslationProgress(namespace) {
    try {
      const translations = await Translation.find({ namespace });
      const languages = await Language.find({ status: 'active' });

      const progress = {};
      for (const lang of languages) {
        const completed = translations.filter(t => 
          t.translations.has(lang.code) && 
          t.status.readyForProduction
        ).length;
        progress[lang.code] = {
          completed,
          total: translations.length,
          percentage: Math.round((completed / translations.length) * 100)
        };
      }

      recordEvent('translation_progress_calculated', { namespace, languages: languages.length });
      return progress;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // User Language Preferences
  async getUserLanguagePreference(userId) {
    try {
      let pref = await UserLanguagePreference.findOne({ userId });
      if (!pref) {
        pref = await this.createUserLanguagePreference(userId, { 
          preferredLanguage: 'tr',
          interfaceLanguage: 'tr'
        });
      }
      recordEvent('user_language_pref_retrieved', { userId });
      return pref;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async createUserLanguagePreference(userId, data) {
    try {
      const pref = new UserLanguagePreference({ userId, ...data });
      await pref.save();
      recordEvent('user_language_pref_created', { userId, language: data.preferredLanguage });
      return pref;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async updateUserLanguagePreference(userId, updates) {
    try {
      const pref = await UserLanguagePreference.findOneAndUpdate(
        { userId },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      recordEvent('user_language_pref_updated', { userId });
      return pref;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Language Detection
  async detectLanguage(text, userCountry) {
    try {
      // Simple language detection based on common patterns
      const patterns = {
        'tr': /[çğıöşüÇĞİÖŞÜ]/,
        'de': /[äöüß]/,
        'fr': /[àâæçéèêëïîôùûüœ]/,
        'es': /[áéíóú¿¡ñ]/
      };

      let detectedLanguage = 'en';
      for (const [lang, pattern] of Object.entries(patterns)) {
        if (pattern.test(text)) {
          detectedLanguage = lang;
          break;
        }
      }

      recordEvent('language_detected', { detected: detectedLanguage, country: userCountry });
      return detectedLanguage;
    } catch (error) {
      Sentry.captureException(error);
      return 'en';
    }
  }

  // Localization Formatting
  async formatDate(date, language, format) {
    try {
      const lang = await Language.findOne({ code: language });
      if (!lang) throw new Error('Dil bulunamadı');

      const formatter = new Intl.DateTimeFormat(language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      recordEvent('date_formatted', { language, format });
      return formatter.format(new Date(date));
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async formatNumber(number, language, options = {}) {
    try {
      const lang = await Language.findOne({ code: language });
      if (!lang) throw new Error('Dil bulunamadı');

      const formatter = new Intl.NumberFormat(language, options);
      recordEvent('number_formatted', { language, value: number });
      return formatter.format(number);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async formatCurrency(amount, language, currency) {
    try {
      const lang = await Language.findOne({ code: language });
      if (!lang) throw new Error('Dil bulunamadı');

      const formatter = new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency || 'USD'
      });

      recordEvent('currency_formatted', { language, currency, amount });
      return formatter.format(amount);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Pluralization
  async getPluralForm(count, language) {
    try {
      const pluralRules = new Intl.PluralRules(language);
      const rule = pluralRules.select(count);
      recordEvent('plural_form_retrieved', { language, count, rule });
      return rule;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Localization Statistics
  async getLocalizationStats() {
    try {
      const languages = await Language.find();
      const translations = await Translation.find();

      const stats = {
        totalLanguages: languages.length,
        activeLanguages: languages.filter(l => l.status === 'active').length,
        totalTranslations: translations.length,
        completionByLanguage: {},
        reviewStatus: {
          reviewed: 0,
          notReviewed: 0,
          approved: 0
        }
      };

      for (const lang of languages) {
        const count = translations.filter(t => t.translations.has(lang.code)).length;
        stats.completionByLanguage[lang.code] = {
          translated: count,
          percentage: Math.round((count / translations.length) * 100)
        };
      }

      stats.reviewStatus.reviewed = translations.filter(t => t.status.reviewed).length;
      stats.reviewStatus.notReviewed = translations.length - stats.reviewStatus.reviewed;
      stats.reviewStatus.approved = translations.filter(t => t.status.readyForProduction).length;

      recordEvent('localization_stats_calculated', stats);
      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}

module.exports = { LocalizationService, Language, Translation, UserLanguagePreference };
