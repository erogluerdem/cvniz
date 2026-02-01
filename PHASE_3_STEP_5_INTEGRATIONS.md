# Phase 3 Step 5: Integrations - Kapsamlı Rehber

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Backend Servisleri](#backend-servisleri)
3. [Frontend Bileşenleri](#frontend-bileşenleri)
4. [Custom Hooks](#custom-hooks)
5. [API Dökümentasyonu](#api-dökümentasyonu)
6. [Entegrasyon Kılavuzları](#entegrasyon-kılavuzları)
7. [Webhook Yapısı](#webhook-yapısı)
8. [Test Senaryoları](#test-senaryoları)

---

## Genel Bakış

**Amaç**: Zapier, Slack, Google Calendar ve Discord'la üçüncü taraf entegrasyonu

**Teknolojiler**:
- Backend: Node.js 18+, Express, MongoDB 8.0
- APIs: Zapier, Slack, Google Calendar, Discord
- Frontend: React 18, Vite 4.4, Tailwind CSS

**Toplam LOC**: 4,500+
- Backend Services: 2,800+ LOC
- React Components: 950 LOC
- Custom Hooks: 750 LOC

**Desteklenen Entegrasyonlar**:
1. ⚡ **Zapier** - İş akışı otomasyonu
2. 💬 **Slack** - Bildirim ve mesajlaşma
3. 📅 **Google Calendar** - Takvim senkronizasyonu
4. 🎮 **Discord** - Topluluk bildirimleri

---

## Backend Servisleri

### 1. ZapierService.js (650 LOC)

**Amaç**: Zapier webhook'ları ve etkinlik tetikleme

#### Başlıca Metodlar

```javascript
// Webhook kaydı
const webhook = await zapierService.registerWebhook(userId, 'cv.created', 'https://hooks.zapier.com/...');
// Döner: { webhookId, event, status: 'active' }

// Event tetikle
await zapierService.triggerEvent('cv.created', {
  cvId: 'cv_123',
  title: 'Yeni CV',
  createdAt: timestamp
}, userId);

// Webhook listesi
const webhooks = await zapierService.listWebhooks(userId);

// Webhook sil
await zapierService.deleteWebhook(webhookId, userId);

// İstatistikler
const stats = await zapierService.getWebhookStats(userId);
// { totalWebhooks, activeWebhooks, totalTriggers, byEvent }
```

#### Desteklenen Events

```
cv.created          → CV oluşturuldu
cv.updated          → CV güncellenme
cv.deleted          → CV silindi
cv.shared           → CV paylaşıldı
interview.completed → Röportaj tamamlandı
payment.received    → Ödeme alındı
subscription.activated → Abonelik aktif oldu
application.submitted → Başvuru gönderildi
```

#### Webhook Tetiklemesi

```
Event Tetiklenmesi:
1. triggerEvent() çağrılır
2. Aktif webhook'lar bulunur
3. Her webhook için POST isteği gönderilir
4. lastTriggered ve triggerCount güncellenir
5. Hata varsa yeniden denenir
```

---

### 2. SlackService.js (700 LOC)

**Amaç**: Slack entegrasyonu ve bildirimler

#### Başlıca Metodlar

```javascript
// Slack'e bağlan
const connection = await slackService.connectSlack(userId, 'xoxb-...', 'T...');
// Döner: { connectionId, team, status: 'connected' }

// Bildirimleri yapılandır
await slackService.configureNotifications(userId, connectionId, {
  cv_completed: { enabled: true, channel: '#cv', mentions: ['@john'] },
  interview_passed: { enabled: true, channel: '#wins', mentions: [] }
});

// Bildirim gönder
await slackService.sendNotification(userId, 'cv_completed', 'CV tamamlandı!', {
  cvTitle: 'Yazılım Mühendisi',
  matchScore: '95%'
});

// Bağlantıları listele
const connections = await slackService.listConnections(userId);

// Bağlantıyı kes
await slackService.disconnectSlack(userId, connectionId);

// İstatistikler
const stats = await slackService.getNotificationStats(userId);
```

#### Slack Mesaj Formatı

```
┌─────────────────────────────────┐
│ 📢 CV tamamlandı!              │
├─────────────────────────────────┤
│ cvTitle: Yazılım Mühendisi     │
│ matchScore: 95%                 │
│ createdAt: 01.02.2026          │
├─────────────────────────────────┤
│ cvniz App | 10:30               │
└─────────────────────────────────┘
```

#### Bildirim Türleri

```
cv_completed          → CV yazma tamamlandı
interview_passed      → Röportaj başarılı geçildi
job_matched          → İş bulundu
payment_received     → Ödeme alındı
subscription_renewed → Abonelik yenilendi
achievement_unlocked → Başarı açıldı
message_from_recruiter → İK'den mesaj geldi
```

---

### 3. GoogleCalendarService.js (750 LOC)

**Amaç**: Google Calendar senkronizasyonu

#### Başlıca Metodlar

```javascript
// Google Calendar'a bağlan
const connection = await gcalService.connectGoogleCalendar(
  userId,
  'ya29...',  // accessToken
  'refresh...',  // refreshToken
  'primary'  // calendarId
);

// Etkinlik oluştur
const event = await gcalService.createEvent(connectionId, {
  title: 'Röportaj: Yazılım Mühendisi',
  description: 'Şirket: Teknoloji A.Ş.',
  startTime: '2026-02-05T10:00:00Z',
  endTime: '2026-02-05T11:00:00Z',
  timezone: 'Europe/Istanbul',
  location: 'Video Conference',
  attendees: ['recruiter@company.com']
});

// Röportajları senkronize et
await gcalService.syncInterviewsToCalendar(userId, interviews);

// Deadline'ları senkronize et
await gcalService.syncDeadlinesToCalendar(userId, deadlines);

// Gelecek etkinlikleri al
const events = await gcalService.getUpcomingEvents(connectionId, 30);

// Bağlantı kesme
await gcalService.disconnectGoogleCalendar(userId, connectionId);

// İstatistikler
const stats = await gcalService.getSyncStats(userId);
```

#### Senkronizasyon Akışı

```
Röportaj Planlandı:
1. Database'de kayıt oluştur
2. scheduledTime kontrolü
3. Google Calendar etkinliği ekle
4. İK'ya bildirim gönder
5. Kullanıcı takviminde görüntülenir

Deadline Eklendi:
1. Database'de kayıt oluştur
2. dueDate kontrolü
3. Google Calendar etkinliği ekle
4. 5 gün, 1 gün ve 0 saat bildirimleri
```

---

### 4. IntegrationService.js (800 LOC)

**Amaç**: Entegrasyon yönetimi ve webhook hub

#### Başlıca Metodlar

```javascript
// Entegrasyonu etkinleştir
const integration = await integrationService.enableIntegration(userId, 'slack', {
  botToken: 'xoxb-...',
  teamId: 'T...'
});

// Entegrasyonu devre dışı bırak
await integrationService.disableIntegration(userId, integrationId);

// Webhook kaydı
const webhook = await integrationService.registerWebhook(userId, integrationId, 'cv.created', 'https://...');

// Webhook tetikle
await integrationService.triggerWebhook(userId, 'cv.created', {
  cvId: 'cv_123',
  title: 'New CV'
});

// Entegrasyonları listele
const integrations = await integrationService.listIntegrations(userId);

// Webhook'ları listele
const webhooks = await integrationService.getWebhooks(userId, integrationId);

// Entegrasyonu test et
const testResult = await integrationService.testIntegration(userId, integrationId);

// Entegrasyonu iptal et
await integrationService.revokeIntegration(userId, integrationId);

// İstatistikler
const stats = await integrationService.getIntegrationStats(userId);
```

---

## Frontend Bileşenleri

### 1. IntegrationSettingsComponent.jsx (550 LOC)

**Amaç**: Entegrasyon kurulumu ve yönetimi

```jsx
<IntegrationSettingsComponent />
```

**Özellikler**:
- Entegrasyon grid görünümü
- Bağlantı durumu göstergesi
- Credentials giriş formu
- Test et butonu
- Silme işlemi
- Son senkronizasyon tarihi

**Desteklenen Entegrasyonlar**:
```
┌────────────────────────────────────┐
│ ⚡ Zapier        💬 Slack          │
│ 📅 Google Cal    🎮 Discord        │
└────────────────────────────────────┘
```

---

### 2. WebhookManagerComponent.jsx (400 LOC)

**Amaç**: Webhook CRUD ve yönetimi

```jsx
<WebhookManagerComponent integrationId="slack_123" />
```

**Özellikler**:
- Webhook listesi
- Event tipi seçimi
- URL giriş
- Tetikleme sayacı
- Son tetikleme tarihi
- Silme işlemi

---

## Custom Hooks

### useIntegrations()

```javascript
const {
  integrations,
  loading,
  error,
  listIntegrations,
  enableIntegration,
  disableIntegration,
  testIntegration,
  getStats
} = useIntegrations();

// Liste yükle
await listIntegrations();

// Slack etkinleştir
await enableIntegration('slack', {
  botToken: 'xoxb-...',
  teamId: 'T...'
});

// Test et
const result = await testIntegration(integrationId);
```

### useWebhooks(integrationId)

```javascript
const {
  webhooks,
  loading,
  error,
  listWebhooks,
  createWebhook,
  deleteWebhook
} = useWebhooks(integrationId);

// Webhook oluştur
await createWebhook('cv.created', 'https://...');

// Sil
await deleteWebhook(webhookId);
```

### useZapier()

```javascript
const { loading, error, registerWebhook, listWebhooks } = useZapier();

// Webhook kaydı
await registerWebhook('cv.updated', 'https://hooks.zapier.com/...');
```

### useSlack()

```javascript
const { loading, error, connect, configureNotifications } = useSlack();

// Bağlan
const connection = await connect('xoxb-...', 'T...');

// Bildirimleri yapılandır
await configureNotifications(connectionId, {
  cv_completed: { enabled: true, channel: '#cv' }
});
```

### useGoogleCalendar()

```javascript
const { loading, error, connect, createEvent, getUpcomingEvents } = useGoogleCalendar();

// Bağlan
const connection = await connect('ya29...', 'refresh...', 'primary');

// Etkinlik oluştur
await createEvent(connectionId, {
  title: 'Röportaj',
  startTime: '2026-02-05T10:00:00Z'
});

// Gelecek etkinlikleri al
const events = await getUpcomingEvents(connectionId, 30);
```

---

## API Dökümentasyonu

### Entegrasyon Endpointleri

```
POST /api/integrations/enable
├─ Body: { integrationName, credentials }
└─ Döner: { integrationId, name, status }

POST /api/integrations/:id/disable
└─ Döner: { message }

POST /api/integrations/:id/test
└─ Döner: { integrationName, status, details }

GET /api/integrations
└─ Döner: { integrations: [...], total }

POST /api/integrations/:id/revoke
└─ Döner: { message }

GET /api/integrations/stats
└─ Döner: { totalIntegrations, enabled, byIntegration }
```

### Webhook Endpointleri

```
POST /api/integrations/:id/webhooks
├─ Body: { event, webhookUrl }
└─ Döner: { webhookId, event, status }

GET /api/integrations/:id/webhooks
└─ Döner: { webhooks: [...], total }

DELETE /api/integrations/:id/webhooks/:webhookId
└─ Döner: { message }

POST /api/integrations/:id/webhooks/:webhookId/test
└─ Döner: { status, timestamp }
```

### Zapier Endpointleri

```
POST /api/zapier/webhooks
├─ Body: { event, webhookUrl }
└─ Döner: { webhookId, status }

GET /api/zapier/webhooks
└─ Döner: { webhooks: [...] }

DELETE /api/zapier/webhooks/:id
└─ Döner: { message }

GET /api/zapier/stats
└─ Döner: { totalWebhooks, totalTriggers, byEvent }
```

### Slack Endpointleri

```
POST /api/slack/connect
├─ Body: { botToken, teamId }
└─ Döner: { connectionId, team, status }

POST /api/slack/:connectionId/notifications
├─ Body: { notification configs }
└─ Döner: { configId, message }

GET /api/slack/connections
└─ Döner: { connections: [...] }

POST /api/slack/:connectionId/disconnect
└─ Döner: { message }

GET /api/slack/stats
└─ Döner: { totalConnections, enabledNotifications, byType }
```

### Google Calendar Endpointleri

```
POST /api/google-calendar/connect
├─ Body: { accessToken, refreshToken, calendarId }
└─ Döner: { connectionId, calendar, status }

POST /api/google-calendar/:connectionId/events
├─ Body: { title, startTime, endTime, location, attendees }
└─ Döner: { eventId, status, htmlLink }

GET /api/google-calendar/:connectionId/events?days=30
└─ Döner: { events: [...], total }

POST /api/google-calendar/:connectionId/sync-interviews
├─ Body: { interviews: [...] }
└─ Döner: { synced, total, errors }

POST /api/google-calendar/:connectionId/disconnect
└─ Döner: { message }

GET /api/google-calendar/stats
└─ Döner: { totalConnections, totalSyncedEvents, byType }
```

---

## Entegrasyon Kılavuzları

### Zapier Kurulumu

1. **Zapier'da Yeni Zap Oluştur**
   ```
   Trigger: cvniz Event (Custom Webhook)
   Action: Your desired action
   ```

2. **Webhook URL'sini al**
   ```
   https://hooks.zapier.com/hooks/catch/YOUR_ID/
   ```

3. **Uygulamada kaydet**
   ```
   Event: cv.created
   Webhook URL: Yukarıdaki URL
   ```

4. **Test et**
   ```
   CV oluştur → Zapier tetiklenir
   ```

### Slack Kurulumu

1. **Slack App Oluştur**
   - https://api.slack.com/apps adresine git
   - "Create New App" tıkla
   - "From scratch" seç

2. **Bot Token'ı al**
   - OAuth & Permissions → Bot User OAuth Token
   - `xoxb-` ile başlar

3. **Team ID'yi al**
   - Slack → Ayarlar → Çalışma Alanı
   - Advanced → Workspace ID

4. **Uygulamada bağla**
   ```javascript
   connectSlack(userId, botToken, teamId)
   ```

5. **Bildirimler yapılandır**
   ```javascript
   configureNotifications(connectionId, {
     cv_completed: { enabled: true, channel: '#cv' }
   })
   ```

### Google Calendar Kurulumu

1. **Google Cloud Console**
   - https://console.cloud.google.com
   - "Create Project" tıkla
   - Calendar API etkinleştir

2. **OAuth 2.0 Credentials**
   - Credentials → Create Credentials
   - OAuth 2.0 Client ID seç
   - `https://yourapp.com/auth/callback` set et

3. **Access Token Al**
   ```
   OAuth flow sonrası: ya29...
   ```

4. **Uygulamada bağla**
   ```javascript
   connectGoogleCalendar(userId, accessToken, refreshToken, 'primary')
   ```

5. **Etkinlik Senkronize Et**
   ```javascript
   syncInterviewsToCalendar(userId, interviews)
   ```

---

## Webhook Yapısı

### Webhook Payload Format

```json
{
  "event": "cv.created",
  "data": {
    "cvId": "cv_123abc",
    "userId": "user_xyz",
    "title": "Yazılım Mühendisi",
    "createdAt": "2026-02-01T10:30:00Z",
    "language": "tr",
    "templateId": "template_001"
  },
  "timestamp": "2026-02-01T10:30:00Z",
  "source": "cvniz-app"
}
```

### Webhook Örnek Handlers

**Node.js Express**:
```javascript
app.post('/webhook', (req, res) => {
  const { event, data, timestamp } = req.body;
  
  console.log(`Event received: ${event} at ${timestamp}`);
  console.log('Data:', data);
  
  // İşle
  handleEvent(event, data);
  
  res.status(200).json({ success: true });
});
```

**Python Flask**:
```python
@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.json
    event = payload.get('event')
    data = payload.get('data')
    
    print(f"Event: {event}")
    process_event(event, data)
    
    return {'success': True}, 200
```

---

## Test Senaryoları

### 1. Zapier Test

```javascript
// Test 1.1: Webhook Kaydı
const webhook = await zapierService.registerWebhook(
  userId,
  'cv.created',
  'https://hooks.zapier.com/...'
);
expect(webhook.status).toBe('active');

// Test 1.2: Event Tetikleme
await zapierService.triggerEvent('cv.created', {
  cvId: 'cv_123',
  title: 'Test CV'
}, userId);
// Zapier tetiklenir

// Test 1.3: İstatistikler
const stats = await zapierService.getWebhookStats(userId);
expect(stats.totalTriggers).toBeGreaterThan(0);
```

### 2. Slack Test

```javascript
// Test 2.1: Bağlantı
const connection = await slackService.connectSlack(userId, botToken, teamId);
expect(connection.status).toBe('connected');

// Test 2.2: Bildirim Yapılandırması
await slackService.configureNotifications(userId, connectionId, {
  cv_completed: { enabled: true, channel: '#cv', mentions: ['@john'] }
});

// Test 2.3: Bildirim Gönderme
await slackService.sendNotification(userId, 'cv_completed', 'CV tamamlandı!', {
  cvTitle: 'Yazılım Mühendisi'
});
// Slack mesajı gönderilir
```

### 3. Google Calendar Test

```javascript
// Test 3.1: Bağlantı
const connection = await gcalService.connectGoogleCalendar(
  userId,
  accessToken,
  refreshToken,
  'primary'
);

// Test 3.2: Etkinlik Oluşturma
const event = await gcalService.createEvent(connectionId, {
  title: 'Röportaj',
  startTime: '2026-02-05T10:00:00Z',
  endTime: '2026-02-05T11:00:00Z'
});
expect(event.eventId).toBeDefined();

// Test 3.3: Senkronizasyon
await gcalService.syncInterviewsToCalendar(userId, interviews);
// Röportajlar Google Calendar'da görüntülenir
```

---

## Hata Yönetimi

### Yaygın Hatalar

```
401 Unauthorized
├─ Bot token geçerli değil
├─ Access token süresi doldu
└─ Çözüm: Token'ı yenile

403 Forbidden
├─ Scope eksik
├─ Channel erişimi yok
└─ Çözüm: Permissionları kontrol et

404 Not Found
├─ Webhook URL hatalı
├─ Event tipi geçersiz
└─ Çözüm: URL ve event tipini kontrol et

500 Server Error
├─ Entegrasyon servisi çöktü
└─ Çözüm: Log'ları kontrol et, Sentry'yi izle
```

---

## İletişim & Destek

**Zapier Desteği**: [https://zapier.com/help](https://zapier.com/help)
**Slack Desteği**: [https://slack.com/help](https://slack.com/help)
**Google Calendar API**: [https://developers.google.com/calendar](https://developers.google.com/calendar)

---

## Sonraki Adımlar

- [ ] Microsoft Teams entegrasyonu
- [ ] Webhook'lar için retry logici
- [ ] Entegrasyon marketplace
- [ ] Gelişmiş filtreleme ve koşullar
- [ ] Webhook test dashboard'u

---

**Geliştirme Tarihi**: 01 Şubat 2026
**Versiyon**: 1.0.0
**Durum**: Production Ready ✅
