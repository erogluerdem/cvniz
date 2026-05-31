/**
 * CV Migration Script
 * This script migrates CVs from localStorage to MongoDB via the API
 * Run this from the browser console while logged in
 */

(async function migrateCVs() {
    console.log('🚀 CV Migration başlıyor...');

    // Get old CVs from localStorage
    const oldCVsRaw = localStorage.getItem('CVniz_cvs');
    if (!oldCVsRaw) {
        console.log('❌ localStorage\'da CV bulunamadı');
        return;
    }

    const oldCVs = JSON.parse(oldCVsRaw);
    console.log(`📋 ${oldCVs.length} CV bulundu`);

    // Get auth token
    const token = localStorage.getItem('CVniz_auth_token');
    if (!token) {
        console.log('❌ Giriş yapmalısınız!');
        return;
    }

    let migrated = 0;
    let failed = 0;

    for (const cv of oldCVs) {
        try {
            const response = await fetch('/api/cvs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: cv.name || 'Unnamed CV',
                    template: cv.template || 'modern',
                    data: cv.data || {},
                    // Preserve original dates if available
                    importedFrom: 'localStorage',
                    originalCreatedAt: cv.createdAt,
                    originalUpdatedAt: cv.updatedAt
                })
            });

            const result = await response.json();

            if (result.success) {
                migrated++;
                console.log(`✅ ${migrated}/${oldCVs.length}: "${cv.name}" migrated`);
            } else {
                failed++;
                console.log(`❌ Failed: "${cv.name}" - ${result.error}`);
            }
        } catch (error) {
            failed++;
            console.log(`❌ Error: "${cv.name}" - ${error.message}`);
        }

        // Small delay to not overwhelm the server
        await new Promise(r => setTimeout(r, 100));
    }

    console.log('\n📊 Migration tamamlandı!');
    console.log(`✅ Başarılı: ${migrated}`);
    console.log(`❌ Başarısız: ${failed}`);
    console.log('\n🔄 Sayfayı yenileyin CV\'leri görmek için');

    // Optionally backup and clear old data
    if (migrated > 0) {
        localStorage.setItem('CVniz_cvs_backup', oldCVsRaw);
        console.log('💾 Eski veriler CVniz_cvs_backup\'a yedeklendi');
    }
})();

