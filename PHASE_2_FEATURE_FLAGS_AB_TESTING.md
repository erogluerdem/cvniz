# Phase 2 Step 5: Özellik Bayrakları & A/B Test Sistemi

## 📋 Genel Bakış

Bu bölümde, CVniz projesinde özellikleri dinamik olarak yönetmek, yavaş dağıtmak (gradual rollout) ve A/B testleri çalıştırmak için tam sistem oluşturduk.

---

## 🚀 Özellik Bayrakları (Feature Flags)

### Amaç
- Özellikleri canlı ortamda etkinleştirme/devre dışı bırakma
- Belirli kullanıcılara kademeli dağıtım (%0-%100)
- Problematik özelliklerin hızlı kapatılması
- Beta tester ve kurumsal kullanıcılara özel erişim

### Mimarı

```
┌─────────────────────────────────────────┐
│      Frontend (React)                   │
│  - useFeatureFlags Hook                 │
│  - FeatureFlag Component                │
│  - FeatureFlagAdmin Panel               │
└──────────────┬──────────────────────────┘
               │
      /api/experiments/*
               │
┌──────────────▼──────────────────────────┐
│      Backend (Express)                  │
│  - featureflags.js Routes               │
│  - FeatureFlagService                   │
│  - Redis Caching (1h)                   │
│  - Sentry Error Tracking                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Database (MongoDB)                 │
│  - FeatureFlag Models                   │
│  - Stats & Tracking                     │
└─────────────────────────────────────────┘
```

### Varsayılan Bayraklar

#### AI Özellikleri
- `interview_prep`: İnterview hazırlığı (%20)
- `skill_gap_analysis`: Beceri boşluğu analizi (%30)
- `cv_scoring`: CV puanlaması (%40)
- `formatting_tips`: Biçimlendirme önerileri (%50)

#### Öneriler
- `recommendations_enabled`: Genel öneriler (%60)
- `trending_jobs`: Trend işler (%70)
- `salary_prediction`: Maaş tahmini (%50)

#### İzleme
- `monitoring_dashboard`: Gösterge paneli (%50)
- `performance_alerts`: Performans uyarıları (%40)

#### Beta & Deneyler
- `advanced_cv_analysis`: Gelişmiş analiz (%10)
- `interview_video`: Video röportaj (%5)
- `mock_interviews`: Simüle röportaj (%5)
- `recommendation_algorithm_v2`: Yeni algoritma (%15)
- `ui_redesign`: Yeni UI (%20)

#### Bakım
- `readonly_mode`: Sadece okuma modu (%0)
- `feature_limited`: Sınırlı özellik (%0)

### Dağıtım Stratejileri

#### 1. **Kademeli Dağıtım (Gradual Rollout)**
```javascript
// %0 → %10 → %25 → %50 → %100
await featureFlagService.rolloutFeature('interview_prep', 25);
```

#### 2. **Beta Tester Erişimi**
```javascript
// Tüm beta testers'a açık (rollout % ne olursa olsun)
const isBeta = await featureFlagService.isBetaTester(userId);
```

#### 3. **Kullanıcı Segmentasyonu**
```javascript
// Kurumsal kullanıcılar tüm özelliklere erişim
const context = { userRole: 'enterprise', tier: 'premium' };
await featureFlagService.isFeatureEnabled(name, userId, context);
```

### API Endpoints

#### Feature Flags (Admin)
```bash
# Tüm bayrakları getir
GET /api/experiments/flags

# Belirli bayrağı getir
GET /api/experiments/flags/:name

# Bayrağı güncelle
PUT /api/experiments/flags/:name
Body: { enabled: true, rollout: 50 }

# Dağıtım yüzdesini ayarla
POST /api/experiments/flags/:name/rollout
Body: { percentage: 75 }
```

#### Feature Flags (User)
```bash
# Kullanıcı için bayrakları getir
GET /api/experiments/feature-flags

# Belirli özelliğin etkinliğini kontrol et
GET /api/experiments/feature-enabled/:name
```

### Frontend Kullanımı

#### Hook Kullanımı
```jsx
import { useFeatureFlags, FeatureFlag } from '@/hooks/useFeatureFlags';

function MyComponent() {
    const { isFeatureEnabled, flags } = useFeatureFlags();

    // Doğrudan kullan
    if (!isFeatureEnabled('interview_prep')) {
        return <div>Özellik henüz aktif değil</div>;
    }

    // Tüm bayrakları kontrol et
    const { interview_prep, skill_gap } = flags;

    return <div>Özellikler etkin</div>;
}
```

#### Component Kullanımı
```jsx
<FeatureFlag name="advanced_cv_analysis" fallback={<Spinner />}>
    <AdvancedCVAnalysisPanel />
</FeatureFlag>
```

### Admin Paneli

**Konum**: `/admin/feature-flags`

**Özellikler**:
- ✅ Tüm bayrakları liste
- ✅ Hızlı aç/kapat toggle
- ✅ Dağıtım yüzdesini slider ile ayarla
- ✅ Gerçek zamanlı istatistikler
- ✅ Etkinleştirme sayısı, kullanıcı sayısı, aktivasyon %

---

## 📊 A/B Test Sistemi

### Amaç
- Ürün kararlarını veriye dayandır
- Yeni özellikler için kullanıcı tepkisini ölç
- İstatistiksel anlamlılığı hesapla
- Kazananı otomatik belirle

### Mimarı

```
┌────────────────────────────────────┐
│   Frontend (React)                 │
│ - useABTest Hook                   │
│ - useABTestResults Hook            │
│ - ABTestDashboard                  │
└─────────────┬──────────────────────┘
              │
     /api/experiments/ab-test/*
              │
┌─────────────▼──────────────────────┐
│   Backend (Express)                │
│ - featureflags.js Routes           │
│ - ABTestService                    │
│ - Statistical Significance         │
│ - Event Tracking                   │
└─────────────┬──────────────────────┘
              │
┌─────────────▼──────────────────────┐
│   Database (MongoDB)               │
│ - ABTest Model                     │
│ - Events Collection                │
│ - Results Aggregation              │
└────────────────────────────────────┘
```

### Varsayılan Deneyler

#### 1. **İş Önerisi Algoritması**
- **Amaç**: Yeni ML algoritmanın performansını test et
- **Kontrol**: Mevcut algoritma
- **Variant**: Yeni algoritma v2
- **Oran**: 50/50 split
- **Metrikler**: 
  - Dönüşüm oranı
  - Başvuru sayısı
  - Kullanıcı katılımı

#### 2. **UI Dizayn (İş Kartı)**
- **Amaç**: Yeni kartlar tasarımının etkisini ölç
- **Kontrol**: Mevcut tasarım
- **Variant**: Yeni minimalist tasarım
- **Oran**: 50/50 split
- **Metrikler**:
  - Tıkla oranı
  - Kalış süresi
  - Dönüşüm

#### 3. **Premium Özellik Ödeme Duvarı**
- **Amaç**: En iyi mesaj ve fiyatı bul
- **Varinat 1**: Erkek erişim engeli
- **Variant 2**: Özellikleri sınırla
- **Variant 3**: Teklif göster
- **Oran**: 33/33/34 split
- **Metrikler**:
  - Dönüşüm oranı
  - Gelir
  - Geri dönüş oranı

### Deneyim Yaşam Döngüsü

```
Draft → Active → Analyzing → Concluded → Winner Declared
  ↓        ↓           ↓           ↓            ↓
Oluştur  Başlat    Izle Sonuç  Sonlandır   Uygula
```

### İstatistiksel Anlamlılık

#### Chi-Square Test
```javascript
χ² = Σ((Observed - Expected)² / Expected)

// Minimum 95% güven seviyesi gerekir
// Z-Score > 1.96
```

#### Formüller
```javascript
ConversionRate = Conversions / Total
Improvement = ((VariantRate - ControlRate) / ControlRate) * 100
ZScore = (VariantRate - ControlRate) / StandardError
```

### API Endpoints

#### A/B Test Yönetimi (Admin)
```bash
# Tüm deneyleri listele
GET /api/experiments/ab-tests

# Yeni deney oluştur
POST /api/experiments/ab-tests
Body: {
  name: "İş Algoritması v2",
  description: "Yeni ML algoritması test",
  variants: {
    control: { name: "Mevcut", weight: 50 },
    variant_v2: { name: "Yeni v2", weight: 50 }
  },
  metrics: ["conversions", "clicks", "engagement"],
  startDate: "2024-01-15",
  endDate: "2024-02-15"
}

# Deneyi başlat
POST /api/experiments/ab-tests/:id/start

# Sonuçları getir
GET /api/experiments/ab-test/:id/results

# Deneyi sonlandır
POST /api/experiments/ab-tests/:id/conclude
```

#### A/B Test Katılımı (User)
```bash
# Varyant ataması al
GET /api/experiments/ab-test/:experimentId

# Olay kaydet
POST /api/experiments/ab-test/:experimentId/event
Body: {
  variant: "control",
  eventType: "conversion",
  metadata: { amount: 99, currency: "USD" }
}
```

### Frontend Kullanımı

#### Hook Kullanımı
```jsx
import { useABTest } from '@/hooks/useABTest';

function JobCard() {
    const { variant, trackEvent, recordConversion } = useABTest('ui_card_design');

    const handleClick = () => {
        trackEvent('click', { elementId: 'job-card' });
    };

    const handleApply = async (jobId) => {
        await recordConversion(0, { jobId });
    };

    // Variant'a göre render et
    if (variant === 'control') {
        return <TraditionalJobCard onClick={handleClick} onApply={handleApply} />;
    }

    return <ModernJobCard onClick={handleClick} onApply={handleApply} />;
}
```

#### Sonuçları Görüntüleme
```jsx
import { useABTestResults } from '@/hooks/useABTest';

function ExperimentResults() {
    const { results, significance, loading } = useABTestResults('ui_card_design');

    return (
        <div>
            <h2>Deney Sonuçları</h2>
            
            {/* Variant Performansı */}
            {results?.variants.map(variant => (
                <div key={variant.name}>
                    <h3>{variant.name}</h3>
                    <p>Dönüşüm: {results.results[variant].conversionRate}%</p>
                </div>
            ))}

            {/* İstatistiksel Anlamlılık */}
            {significance && (
                <div>
                    <p>Güven: {significance.confidence}%</p>
                    <p>Z-Score: {significance.zScore}</p>
                    <p>İyileşme: {significance.improvement}%</p>
                </div>
            )}
        </div>
    );
}
```

### Admin Gösterge Paneli

**Konum**: `/admin/ab-tests`

**Özellikler**:
- ✅ Aktif deneyler listesi
- ✅ Varyant performans metrikleri
- ✅ İstatistiksel anlamlılık göstergesi
- ✅ Güven % ve Z-Score
- ✅ İyileşme % vs kontrol
- ✅ Kazanan beyan fonksiyonu

---

## 🔄 İntegrasyon

### Feature Flags ile A/B Test Kombinasyonu

```javascript
// Yeni özelliği kademeli olarak dağıt
// SONRA A/B testini çalıştır

// Aşama 1: %10 kullanıcıya dağıt
await featureFlagService.rolloutFeature('recommendation_v2', 10);

// Aşama 2: %10 kitlede A/B test çalıştır
await aBTestService.createExperiment({
    name: 'Recommendation Algorithm v2',
    variants: {
        control: { name: 'Mevcut', weight: 50 },
        new: { name: 'Yeni v2', weight: 50 }
    }
});

// Aşama 3: Sonuçlar iyi ise %50'ye çıkar
if (isSignificant && improvement > 10) {
    await featureFlagService.rolloutFeature('recommendation_v2', 50);
}

// Aşama 4: Tam dağıtım
await featureFlagService.rolloutFeature('recommendation_v2', 100);
```

---

## 📈 İzleme & Analitik

### Metrikleri Takip Etme

```javascript
// Her özellik kullanımında
await featureFlagService.trackUsage('interview_prep', userId, enabled);

// Her deney olayında
await aBTestService.trackEvent(experimentId, userId, variant, eventType);
```

### Örnek Metrikleri
- **Aktivasyon**: Özellik etkin olan % kullanıcı
- **Dönüşüm Oranı**: Dönüşüm yapan / Toplam
- **Katılım**: Ortalama sayfa kalış süresi
- **Hata Oranı**: Özellik hataları / Toplam

---

## 🔒 Güvenlik

### Yetkilendirme
- ✅ Admin paneli (`adminOnly` middleware)
- ✅ Bayrak değişiklikleri (JWT token)
- ✅ Deneyler (kurumsal kullanıcı)
- ✅ Sonuçlar (admin only)

### Veri Gizliliği
- ✅ Kullanıcı ID hash'lenmiş
- ✅ Metadata şifreleme
- ✅ GDPR uyumlu silme

---

## 🎯 En İyi Uygulamalar

### 1. **Dağıtım Stratejisi**
- Başkente küçük % ile başla (%5-%10)
- Metrikleri monitör et
- Hızlı geri alma yeteneği sağla
- Hatalar için kill switch hazırla

### 2. **A/B Test Tasarımı**
- Minimum 1 hafta çalıştır
- Yeterli örnek boyutu sağla (n > 100 per variant)
- Birden fazla metriği izle
- Haftanın gününü kontrol et

### 3. **Hata Yönetimi**
```javascript
try {
    await featureFlagService.isFeatureEnabled(name, userId);
} catch (error) {
    // Düştüğünde özelliği kapalı kabul et
    return false;
}
```

### 4. **Caching Stratejisi**
- Bayrak kontrolü: 1 saat cache
- Konfigürasyon: 30 gün cache
- Redis kullan, fallback DB'ye

---

## 📊 Metrikleri Analiz Etme

### Dönüşüm Oranı Artışı İyi mi?
- **< %5**: Fark ettirmemiş
- **%5-%15**: İyi, anlamlılığı kontrol et
- **> %15**: Çok iyi, hızlı dağıt

### Güven % Kaç Olmalı?
- **< %80**: Yeterli veri yok, bekle
- **80%-94%**: Eğilim gösteriliyor, devam et
- **> 95%**: Anlamlı, sonuç al

### Kaç Gün Çalıştırmalı?
- **Minimum**: 7 gün (hafta sonu etkisini kontrol et)
- **Optimal**: 14-21 gün
- **Maksimum**: 30 gün (diminishing returns)

---

## ✅ Kontrol Listesi

- [x] FeatureFlagService.js (600+ LOC)
- [x] ABTestService.js (güncelleştirildi)
- [x] featureflags.js routes (12 endpoint)
- [x] useFeatureFlags hook
- [x] useABTest ve useABTestResults hook
- [x] FeatureFlagAdmin component
- [x] ABTestDashboard component
- [x] API entegrasyonu
- [x] Error handling
- [x] Sentry tracking
- [x] Dokümantasyon

---

## 🚀 Sonraki Adımlar

### Phase 2 Step 6: Performans Optimizasyonu
- [ ] API response caching
- [ ] Frontend bundle optimization
- [ ] Database indexing
- [ ] CDN integration

### Phase 2 Step 7: Mobil İyileştirmeler
- [ ] React Native bileşenleri
- [ ] Offline mode
- [ ] Push notifications
- [ ] App analytics

### Phase 2 Step 8: Kurumsal Özellikler
- [ ] SSO integration
- [ ] SCIM provisioning
- [ ] Advanced audit logs
- [ ] Custom workflows

---

## 📞 Destek

Sorular veya sorunlar için:
1. Loglara bak: `docker logs cvniz-backend`
2. Sentry dashboard'ı kontrol et
3. GitHub issues açış
4. Team slack'inde sor
