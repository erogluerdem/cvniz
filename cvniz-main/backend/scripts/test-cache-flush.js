const CacheService = require('../src/services/CacheService');
const mongoose = require('mongoose');
require('dotenv').config();

async function testCacheFlush() {
    console.log('🧪 Cache Flush testi başlatılıyor...');

    try {
        // Mock some data into memory cache
        await CacheService.set('test_key', { data: 'test_value' }, 3600);
        console.log('✅ Test verisi cache\'e eklendi');

        let cached = await CacheService.get('test_key');
        console.log('🔍 Cache durumu (temizleme öncesi):', cached ? 'DOLU' : 'BOŞ');

        console.log('🧹 Cache temizleniyor...');
        await CacheService.flush();

        cached = await CacheService.get('test_key');
        console.log('🔍 Cache durumu (temizleme sonrası):', cached ? 'DOLU' : 'BOŞ');

        if (!cached) {
            console.log('🎉 TEST BAŞARILI: Cache başarıyla temizlendi.');
        } else {
            console.error('❌ TEST BAŞARISIZ: Cache temizlenemedi.');
        }

    } catch (error) {
        console.error('❌ Test sırasında hata:', error);
    } finally {
        process.exit(0);
    }
}

testCacheFlush();
