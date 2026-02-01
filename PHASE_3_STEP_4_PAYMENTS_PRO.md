# Phase 3 Step 4: Payments Pro - Kapsamlı Rehber

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Backend Servisleri](#backend-servisleri)
3. [Frontend Bileşenleri](#frontend-bileşenleri)
4. [Custom Hooks](#custom-hooks)
5. [API Dökümentasyonu](#api-dökümentasyonu)
6. [İş Modeli](#iş-modeli)
7. [Test Senaryoları](#test-senaryoları)
8. [Dağıtım](#dağıtım)

---

## Genel Bakış

**Amaç**: Tam kapsamlı ödeme işleme sistemi, fatura yönetimi, vergi uyumluluğu ve abonelik yönetimi

**Teknolojiler**:
- Backend: Node.js 18+, Express, MongoDB 8.0
- Payment: Stripe API (Production-ready)
- Invoicing: PDFKit
- Frontend: React 18, Vite 4.4, Tailwind CSS
- Monitoring: Sentry, Event Logging

**Toplam LOC**: 4,400+
- Backend Services: 2,900+ LOC
- React Components: 850 LOC
- Custom Hooks: 550 LOC
- Models: 100 LOC

---

## Backend Servisleri

### 1. PaymentService.js (650 LOC)

**Amaç**: Stripe entegrasyonu ile ödeme işleme

#### Başlıca Metodlar

```javascript
// Ödeme niyeti oluştur
await paymentService.createPaymentIntent({
  amount: 5000,  // Sent (0.05 USD)
  currency: 'USD',
  paymentMethod: 'card',
  metadata: { orderId: '12345' }
});
// Döner: { clientSecret, paymentId, status: 'pending' }

// Ödemeyi doğrula
await paymentService.confirmPayment(paymentId, {
  cardNumber: '4242424242424242',
  expiryMonth: '12',
  expiryYear: '25',
  cvc: '123'
});
// Döner: { status: 'succeeded', transactionId }

// Geri ödeme işle
await paymentService.processRefund(paymentId, {
  reason: 'requested_by_customer',
  amount: 5000
});
// Döner: { refundId, status: 'succeeded' }

// Ödeme istatistikleri
const stats = await paymentService.getPaymentStats();
// Döner: { totalPayments, totalAmount, averageAmount, byStatus, byMethod }
```

#### Dolandırıcılık Tespiti (4 Katman)

```
Katman 1: Tutar Anomalisi
├─ Ortalama tutarın 3 katı > Orta riskli
└─ 10 katı > Yüksek riskli

Katman 2: Hız Kontrol
├─ 5+ ödeme/saat > Yüksek riskli
└─ Şüpheli bot aktivitesi

Katman 3: Ülke Uyuşmazlığı
├─ Fatura ülkesi ≠ Tespit edilen ülke
└─ Orta riskli bayrak

Katman 4: Yeni Kart
├─ İlk kez kullanılan ödeme yöntemi
└─ Düşük riskli (uyarı)
```

#### Ödeme Durumları

```
pending      → Henüz işlenmedi
processing   → 3D Secure vb. bekleniyor
succeeded    → Başarılı
failed       → Başarısız
refunded     → Para iade edildi
canceled     → İptal edildi
```

#### Stripe Webhook'ları

```javascript
// Başarılı ödeme
payment.succeeded
├─ Status güncelle → succeeded
├─ Event kaydet
└─ Invoice oluştur (varsa)

// Başarısız ödeme
payment.failed
├─ Status güncelle → failed
├─ Düşük puan ile işaretle
└─ Email gönder

// Geri ödeme
charge.refunded
├─ Refund tablosu güncelle
├─ Status → refunded
└─ Event kaydet
```

---

### 2. InvoiceService.js (700 LOC)

**Amaç**: Fatura yaşam döngüsü ve PDF oluşturma

#### Başlıca Metodlar

```javascript
// Fatura oluştur
const invoice = await invoiceService.createInvoice({
  customer: {
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    company: 'Teknoloji A.Ş.'
  },
  items: [
    { description: 'Yazılım Geliştirme', quantity: 40, unitPrice: 100 },
    { description: 'Danışmanlık', quantity: 10, unitPrice: 150 }
  ],
  dueDate: '2026-03-01'
});
// Döner: { invoiceNumber: 'INV-2026-00001', status: 'draft' }

// PDF oluştur
const pdfBlob = await invoiceService.generateInvoicePDF(invoiceId);

// Faturayı gönder
await invoiceService.sendInvoice(invoiceId);
// Döner: { status: 'sent', sentAt: timestamp }

// Ödendi olarak işaretle
await invoiceService.markAsPaid(invoiceId, {
  paymentId: 'pay_xxxxx',
  paidAmount: 5500
});
// Döner: { status: 'paid', paidAt: timestamp }

// Fatura istatistikleri
const stats = await invoiceService.getInvoiceStats();
// Döner: { totalInvoices, totalAmount, byStatus, averageAmount }
```

#### Fatura Numarası Format

```
INV-YYYY-XXXXX
  │   │    └─ 5 haneli sıra numarası (otomatik artan)
  │   └────── Yıl
  └────────── Ön ek (sabit)

Örnek: INV-2026-00001, INV-2026-00002
```

#### Fatura Durumları

```
draft    → Henüz hazırlanıyor
sent     → Müşteriye gönderildi
viewed   → Müşteri görüntüledi
paid     → Ödendi
overdue  → Vadesi geçti
canceled → İptal edildi
```

#### PDF İçeriği

```
┌─────────────────────────────────┐
│         FATURA (Invoice)         │
│    INV-2026-00001              │
├─────────────────────────────────┤
│ Tarih: 01.02.2026              │
│ Vade Tarihi: 01.03.2026        │
│                                 │
│ Müşteri Bilgileri:             │
│ Ahmet Yılmaz                   │
│ Teknoloji A.Ş.                │
│ ahmet@example.com              │
├─────────────────────────────────┤
│ Açıklama        Qty  Fiy    Top│
│ Yazılım Gç.     40   100   4000│
│ Danışmanlık     10   150   1500│
├─────────────────────────────────┤
│ Ara Toplam:            5500.00 │
│ Vergi (%18):            990.00 │
│ TOPLAM:                6490.00 │
├─────────────────────────────────┤
│ Ödeme Koşulları: NET 30        │
│ Teşekkür ederiz!               │
└─────────────────────────────────┘
```

---

### 3. TaxService.js (750 LOC)

**Amaç**: Vergi hesaplaması, uyum kontrol ve beyanname yönetimi

#### Başlıca Metodlar

```javascript
// Vergi oranını al
const rate = await taxService.getTaxRate({
  country: 'TR',
  category: 'service',
  date: '2026-02-01'
});
// Döner: { rate: 0.18, category: 'service' }

// Vergi hesapla
const calc = await taxService.calculateTax({
  country: 'TR',
  items: [
    { description: 'Hizmet', amount: 1000, category: 'service' },
    { description: 'Ürün', amount: 500, category: 'product' }
  ]
});
// Döner: {
//   subtotal: 1500,
//   taxable: 1500,
//   tax: 270,
//   total: 1770,
//   breakdown: { vat: 270 }
// }

// Uyum kontrol et
const compliance = await taxService.checkCompliance();
// Döner: {
//   status: 'compliant',
//   missingFilings: 0,
//   nextDeadline: '2026-03-15'
// }

// Beklenen son tarihler
const deadlines = await taxService.getUpcomingDeadlines();
// Döner: [
//   { quarter: 'Q1', deadline: '2026-03-15', type: 'quarterly' },
//   { quarter: 'Year', deadline: '2026-04-15', type: 'annual' }
// ]
```

#### Ülke Vergi Oranları

| Ülke | KDV Oranı | Kategori |
|------|-----------|----------|
| TR (Türkiye) | 18% | Standart |
| DE (Almanya) | 19% | Standart |
| FR (Fransa) | 20% | Standart |
| US (Amerika) | 8% (orta) | Eyalet |
| GB (İngiltere) | 20% | Standart |
| JP (Japonya) | 10% | Standart |
| AE (BAE) | 5% | Düşük |

#### Vergi Beyannamesi Döngüsü

```
Q1 (Ocak-Mart)
├─ Taslak hazırlama
├─ Son tarih: 15 Mart
├─ Gönderim: 15 Mart öncesi
└─ Doğrulama: 15 Nisan

Q2 (Nisan-Haziran)
├─ Taslak hazırlama
├─ Son tarih: 15 Haziran
├─ Gönderim: 15 Haziran öncesi
└─ Doğrulama: 15 Temmuz

Yıllık
├─ 4 Üçer aylık beyannameden derle
├─ Son tarih: 15 Nisan
└─ Dosyalama: Müdürlüğe teslim
```

---

### 4. SubscriptionService.js (800 LOC)

**Amaç**: Abonelik yaşam döngüsü ve faturalama

#### Başlıca Metodlar

```javascript
// Planları listele
const plans = await subscriptionService.getPlans();
// Döner: [
//   {
//     planId: 'free',
//     name: 'Ücretsiz',
//     monthlyPrice: 0,
//     features: { messages: 100, interviews: 5 }
//   },
//   {
//     planId: 'pro',
//     name: 'Profesyonel',
//     monthlyPrice: 99,
//     features: { messages: 5000, interviews: 50 }
//   }
// ]

// Abonelik oluştur
const sub = await subscriptionService.createSubscription({
  planId: 'pro',
  billingCycle: 'monthly',
  paymentMethodId: 'pm_xxxxx'
});
// Döner: {
//   subscriptionId: 'sub_xxxxx',
//   status: 'active',
//   currentPeriodEnd: '2026-03-01'
// }

// Aboneliği güncelle (yükselt/düşür)
const updated = await subscriptionService.updateSubscription(
  subscriptionId,
  'enterprise'
);
// Döner: {
//   status: 'active',
//   proration: { credit: 20, charge: 50 },
//   newTotal: 150
// }

// Kullanım limitini kontrol et
const usage = await subscriptionService.checkUsageLimit('messages');
// Döner: {
//   limit: 5000,
//   used: 3500,
//   remaining: 1500,
//   percentage: 70
// }

// İstatistikler
const stats = await subscriptionService.getSubscriptionStats();
// Döner: {
//   totalSubscriptions: 1500,
//   mrr: 45000,
//   arr: 540000,
//   churnRate: 2.5,
//   trialing: 150
// }
```

#### Abonelik Planları

```
┌─────────────────────────────────────────────────────┐
│ Ücretsiz │ Başlangıç │ Profesyonel │ Enterprise   │
├─────────────────────────────────────────────────────┤
│ $0/ay    │ $29/ay   │ $99/ay      │ Özel fiyat  │
├─────────────────────────────────────────────────────┤
│ • 100 msg│ • 1K msg │ • 5K msg    │ • Sınırsız  │
│ • 5 inte │ • 20 int │ • 50 int    │ • Premium   │
│ • 10 jobs│ • 50 job │ • 500 jobs  │ • Dedicated │
│ • 1 temp │ • 5 temp │ • ∞ templates│ • API       │
└─────────────────────────────────────────────────────┘

Hepsi içerir: Temel CV editörü, Deneme sürümü (14 gün)
```

#### Dunning Sistemi (Ödeme Kurtarma)

```
1. Ödeme Başarısız
   ↓
2. İlk Retry (1. Gün)
   ├─ Başarılı → Abonelik Aktif
   └─ Başarısız → 2. Retry'ye devam
   ↓
3. İkinci Retry (3. Gün)
   ├─ Başarılı → Abonelik Aktif
   └─ Başarısız → 3. Retry'ye devam
   ↓
4. Üçüncü Retry (7. Gün)
   ├─ Başarılı → Abonelik Aktif
   └─ Başarısız → Durması bekleniyor
   ↓
5. Son Durum: past_due
   ├─ 7 gün sonra → canceled
   └─ Kullanıcı manüel olarak Aktif edebilir
```

#### Proration Hesaplama

```
Senaryo: Başlangıç ($29/ay) → Profesyonel ($99/ay)

1. Kalan gün hesapla
   Fatura döneminin bitiş: 2026-03-01
   Bugün: 2026-02-14
   Kalan: 15 gün

2. Günlük oranlar
   Başlangıç: $29/30 = $0.97/gün
   Profesyonel: $99/30 = $3.30/gün

3. Kredi hesapla
   Kullanılmayan (Başlangıç): 15 × $0.97 = $14.55
   
4. Yeni ücret hesapla
   Kalan (Profesyonel): 15 × $3.30 = $49.50

5. Net ücret
   $49.50 - $14.55 = $34.95

6. Sonraki fatura
   Normal Profesyonel fiyatı: $99.00
```

#### MRR/ARR/Churn Hesaplamaları

```javascript
MRR (Aylık Tekrarlayan Gelir)
= Tüm aktif aylık aboneliklerin fiyatları toplamı
= sum(activeMonthlySubscriptions.price)
= Örnek: 1500 users × $50 = $75,000 MRR

ARR (Yıllık Tekrarlayan Gelir)
= MRR × 12
= $75,000 × 12 = $900,000 ARR

Churn Oranı (Aylık)
= (İptal Edilen Abonelikler / Başlangıc Aktif) × 100
= (40 canceled / 1500 active) × 100 = 2.67%

Yıllık Churn Öngörüsü
= 1 - (1 - churn_rate)^12
= 1 - (0.9733)^12 = ~29% yıllık churn
```

---

## Frontend Bileşenleri

### 1. PaymentFormComponent.jsx (350 LOC)

**Amaç**: Stripe ödeme formu ve dolandırıcılık uyarıları

```jsx
<PaymentFormComponent
  amount={5000}  // Sent
  description="Pro Plan Yükseltme"
  onSuccess={(payment) => console.log('Ödeme başarılı:', payment)}
/>
```

**Özellikler**:
- Kart numarası doğrulaması (16 hane)
- CVC doğrulaması (3 hane)
- Ülke seçimi
- Dolandırıcılık seviyesi göstergesi
- SSL şifreleme bildirimi
- Başarı animasyonu

---

### 2. InvoiceManagerComponent.jsx (350 LOC)

**Amaç**: Fatura yönetimi ve PDF indirme

```jsx
<InvoiceManagerComponent />
```

**Özellikler**:
- Fatura listesi (durum filtresi)
- Tarih aralığı filtresi
- PDF indirme
- Fatura gönderme
- Fatura silaçıkla
- Yeni fatura oluşturma
- Detay modal

---

### 3. TaxCalculatorComponent.jsx (350 LOC)

**Amaç**: İnteraktif vergi hesaplama

```jsx
<TaxCalculatorComponent />
```

**Özellikler**:
- Ülke seçimi
- Kalem ekleme/çıkarma
- Gerçek zamanlı hesapla
- Vergi dağılımı göster
- Uyum durumu göster
- Rapor indir (JSON)

---

## Custom Hooks

### usePayment()

```javascript
const { payment, loading, error, createPaymentIntent, confirmPayment } = usePayment();

// 1. Intent oluştur
const intent = await createPaymentIntent(5000, 'USD', { orderId: '123' });

// 2. Formu göster (user kart bilgisi girer)

// 3. Doğrula
const result = await confirmPayment(intent.paymentId, cardData);

// 4. Sonuç kontrol et
if (result.status === 'succeeded') {
  // Başarılı
} else if (result.fraudRisk?.riskLevel === 'high') {
  // Gözden geçirilmesi gerekli
}
```

### useInvoices()

```javascript
const { invoices, createInvoice, generatePDF, sendInvoice } = useInvoices();

// Yeni fatura oluştur
const invoice = await createInvoice({
  customer: { name: 'Ahmet', email: 'ahmet@example.com' },
  items: [{ description: 'Hizmet', amount: 1000 }]
});

// PDF oluştur
const pdfBlob = await generatePDF(invoice._id);

// Gönder
await sendInvoice(invoice._id);
```

### useTaxes()

```javascript
const { calculation, checkCompliance, calculateTax } = useTaxes();

// Hesapla
const result = await calculateTax('TR', [
  { description: 'Hizmet', amount: 1000, category: 'service' }
]);

// Uyum kontrol et
const comp = await checkCompliance();
// Yapı: { status, missingFilings, nextDeadline }
```

### useSubscriptions()

```javascript
const { plans, subscription, getPlans, createSubscription, updateSubscription } = useSubscriptions();

// Planları göster
const allPlans = await getPlans();

// Abonelik oluştur
const sub = await createSubscription('pro', 'monthly');

// Güncelle
const updated = await updateSubscription('enterprise');

// İptal et
await cancelSubscription(false); // Dönem sonunda
```

---

## API Dökümentasyonu

### Ödeme Endpointleri

```
POST /api/payments/intent
├─ Body: { amount, currency, metadata }
└─ Döner: { clientSecret, paymentId, status }

POST /api/payments/:id/confirm
├─ Body: { cardNumber, cvc, expiryMonth, expiryYear, billingAddress }
└─ Döner: { status, transactionId, fraudRisk? }

GET /api/payments/:id
└─ Döner: { transactionId, amount, status, fraud, ... }

GET /api/payments?status=succeeded&limit=20
└─ Döner: { payments: [...], total, page }

POST /api/payments/:id/refund
├─ Body: { reason, amount }
└─ Döner: { refundId, status, refundedAt }

GET /api/payments/stats
└─ Döner: { totalPayments, totalAmount, averageAmount, byStatus }

POST /api/payments/webhook
└─ Webhook handler (Stripe)
```

### Fatura Endpointleri

```
POST /api/invoices
├─ Body: { customer, items, dueDate, terms }
└─ Döner: { invoiceNumber, status: 'draft' }

GET /api/invoices?status=paid&startDate=...
└─ Döner: { invoices: [...], total, page }

GET /api/invoices/:id
└─ Döner: { invoiceNumber, customer, items, totals, status }

GET /api/invoices/:id/pdf
└─ Döner: PDF blob

POST /api/invoices/:id/send
└─ Döner: { status: 'sent', sentAt }

POST /api/invoices/:id/paid
├─ Body: { paymentId, paidAmount }
└─ Döner: { status: 'paid', paidAt }

GET /api/invoices/stats
└─ Döner: { totalInvoices, totalAmount, byStatus, average }
```

### Vergi Endpointleri

```
POST /api/tax/calculate
├─ Body: { country, items }
└─ Döner: { calculation: { totals, breakdown, compliance } }

GET /api/tax/summary?year=2026
└─ Döner: { quarters: [ ... ], totalTax, totalSales }

GET /api/tax/compliance
└─ Döner: { status: 'compliant', missingFilings, nextDeadline }

GET /api/tax/deadlines
└─ Döner: { deadlines: [ { quarter, deadline, type } ] }

POST /api/tax/filings
├─ Body: { period, amounts, documentation }
└─ Döner: { filingId, confirmationNumber, status: 'submitted' }
```

### Abonelik Endpointleri

```
GET /api/subscriptions/plans?tier=professional
└─ Döner: { plans: [ ... ] }

POST /api/subscriptions
├─ Body: { planId, billingCycle, paymentMethodId }
└─ Döner: { subscriptionId, status: 'active', currentPeriodEnd }

GET /api/subscriptions/user
└─ Döner: { subscriptionId, status, usage, nextBillingDate }

POST /api/subscriptions/update
├─ Body: { newPlanId }
└─ Döner: { subscriptionId, proration: { credit, charge } }

POST /api/subscriptions/cancel
├─ Body: { immediately: false }
└─ Döner: { status: 'canceled', canceledAt, refund? }

GET /api/subscriptions/usage/:feature
└─ Döner: { limit, used, remaining, percentage }

GET /api/subscriptions/stats
└─ Döner: { totalSubs, mrr, arr, churnRate, trialing }
```

---

## İş Modeli

### Gelir Akışları

```
1. Tek Seferlik Ödeme (One-time)
   ├─ Premium özelliklerin kilidini aç
   ├─ $9.99 - $99.99 aralığı
   └─ Örnek: İleri CV şablonu paketi

2. Aylık Abonelik
   ├─ Yazılı olarak yenilenir
   ├─ İptal etmeye kadar devam
   └─ MRR hesaplamaya katılır

3. Yıllık Abonelik
   ├─ 1 yıl için ödeme
   ├─ Aylıktan %20 indirim
   └─ ARR hesaplamaya katılır

4. Kurumsal Planlar
   ├─ Özel fiyat
   ├─ Dedicated support
   └─ API erişimi
```

### Fatura Yönetimi

```
Fatura Döngüsü:
1. Taslak → 2. Gönderildi → 3. Ödendi → Arşiv

Otomatik Faturalama:
├─ Aylık abonelik: Her ay
├─ Yıllık abonelik: Her yıl
└─ Upgrade/Downgrade: Anında

Hatırlatıcılar:
├─ Vade 5 gün kala
├─ Vade geldikten sonra
└─ Ödeme alındıktan sonra
```

### Vergi Uyumluluğu

```
Çok İşletmeci Yapı:
├─ Ülke başına vergi oranları
├─ Kategoriye göre muafiyet
└─ Dinamik hesaplama

Beyanname Yönetimi:
├─ Otomatik Q1-Q4 takibi
├─ Beklenen son tarihler
├─ Dosyalama durumu
└─ Uyum raporları

Denetim Hazırlığı:
├─ Tam fatura geçmişi
├─ Vergi ödeme doğrulaması
└─ Katılım raporları
```

---

## Test Senaryoları

### 1. Ödeme Akışı Testi

```javascript
// Test 1.1: Başarılı Ödeme
await testPaymentFlow({
  amount: 5000,
  cardNumber: '4242424242424242',
  cvc: '123',
  expectedStatus: 'succeeded'
});

// Test 1.2: Dolandırıcılık Uyarısı
await testFraudDetection({
  amount: 500000,  // Anormal yüksek
  expectedRisk: 'high',
  expectedFlag: true
});

// Test 1.3: Başarısız Ödeme
await testFailedPayment({
  cardNumber: '4000000000000002',
  expectedStatus: 'failed'
});

// Test 1.4: Geri Ödeme
await testRefund({
  paymentId: 'pay_xxxxx',
  reason: 'requested_by_customer',
  expectedStatus: 'succeeded'
});
```

### 2. Fatura Testi

```javascript
// Test 2.1: Fatura Oluştur
const invoice = await testInvoiceCreation({
  customerName: 'Test User',
  items: [{ description: 'Test', amount: 1000 }]
});
expect(invoice.invoiceNumber).toMatch(/INV-\d{4}-\d{5}/);

// Test 2.2: PDF Oluştur
const pdfBlob = await testPDFGeneration(invoice._id);
expect(pdfBlob.size).toBeGreaterThan(1000);
expect(pdfBlob.type).toBe('application/pdf');

// Test 2.3: Fatura Gönder
await testInvoiceSending(invoice._id);
// Email gönderildi
```

### 3. Vergi Testi

```javascript
// Test 3.1: Türkiye Vergi Hesaplaması
const calc = await testTaxCalculation({
  country: 'TR',
  amount: 1000,
  category: 'service',
  expectedRate: 0.18,
  expectedTax: 180
});

// Test 3.2: Ülke Uyuşmazlığı
const compliance = await testTaxCompliance();
expect(compliance.status).toMatch(/compliant|pending/);

// Test 3.3: Beyanname Takibi
const deadlines = await testTaxDeadlines();
expect(deadlines).toHaveLength(4); // 4 çeyrek
```

### 4. Abonelik Testi

```javascript
// Test 4.1: Abonelik Oluştur
const sub = await testSubscriptionCreation({
  planId: 'pro',
  expectedFeatures: { messages: 5000, interviews: 50 }
});

// Test 4.2: Plan Yükselt (Proration)
const updated = await testSubscriptionUpgrade({
  currentPlan: 'starter',
  newPlan: 'pro',
  expectProration: true
});
expect(updated.proration.charge).toBeGreaterThan(0);

// Test 4.3: Dunning Sistemi
await testDunningFlow({
  failureAttempts: 3,
  expectedStatus: 'exhausted'
});
```

---

## Dağıtım

### 1. Ortam Değişkenleri

```bash
# Backend (.env)
STRIPE_API_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/payments
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
EMAIL_SERVICE_API_KEY=xxxxx

# Frontend (.env.local)
VITE_API_URL=https://api.example.com
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

### 2. Docker Dağıtımı

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 5000
CMD ["node", "src/server.js"]

# Frontend Dockerfile
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### 3. Dağıtım Sırası

```
1. Database Migration
   ├─ Yeni koleksiyonları oluştur
   ├─ İndeks ekle
   └─ Mevcut veri migrate et

2. Backend Dağıt
   ├─ Services başlat
   ├─ Webhook yapılandır
   └─ Sentry bağla

3. Frontend Dağıt
   ├─ Build et
   ├─ Static dosyaları serve et
   └─ Cache keşfet

4. Smoke Tests
   ├─ Ödeme akışı
   ├─ Fatura oluşturma
   ├─ Vergi hesaplaması
   └─ Abonelik yönetimi

5. Monitoring
   ├─ Error tracking
   ├─ Performance metrics
   └─ Usage analytics
```

### 4. Rollback Stratejisi

```
Sorun Tespiti:
├─ Error rate arttı → önceki sürüme dön
├─ Payment başarısızlığı → Stripe webhook kontrol et
└─ Database sorunu → backup'tan restore et

Rollback Adımları:
1. Trafik eski sürüme yönlendir
2. Database rollback (varsa)
3. Services yeniden başlat
4. Smoke tests çalıştır
5. Monitoring kontrol et
```

---

## İletişim & Destek

**Backend Sorguları**: `backend/src/services/` klasörüne bakın
**Frontend Sorunları**: `web/src/components/` ve `web/src/hooks/` kontrol edin
**Vergi Soruları**: TaxService.js ve compliance metodlarına danışın
**Abonelik Sorunları**: SubscriptionService.js ve proration mantığını inceleyin

---

## Sonraki Adımlar

- [ ] React Native mobil uygulama (iOS/Android)
- [ ] Gelişmiş raporlama dashboard'u
- [ ] Multi-currency desteği
- [ ] Crypto ödeme entegrasyonu
- [ ] Otomatik vergi dosyalama (GümrükAPI)

---

**Geliştirme Tarihi**: 01 Şubat 2026
**Versiyon**: 1.0.0
**Durum**: Production Ready ✅
