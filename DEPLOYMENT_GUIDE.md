# CVniz Production Deployment - Coolify

## Mevcut Durum
- **Frontend**: https://cvniz.com ✅ (çalışıyor)
- **Backend API**: ❌ (api.cvniz.com DNS'te yok)
- **Server IP**: 91.98.27.86

---

## Adım 1: Coolify'da Backend Deploy

### 1.1 Yeni Uygulama Oluştur
1. Coolify Dashboard'a git (http://91.98.27.86:8000/)
2. **New Resource** > **Application** seç
3. **Source**: Git repository (`/backend` klasörü)
4. **Build Pack**: Nixpacks veya Dockerfile

### 1.2 Environment Variables Ayarla
Coolify'da şu environment variable'ları ekle:

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://mongo:27017/CVniz
JWT_SECRET=cvniz-super-secret-production-key-2024-change-me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://cvniz.com,https://www.cvniz.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5242880
```

### 1.3 Domain Ayarla
- Coolify'da uygulama için domain olarak `api.cvniz.com` gir
- **SSL/HTTPS**: Coolify otomatik Let's Encrypt yapacaktır

---

## Adım 2: MongoDB Deploy (Eğer yoksa)

### 2.1 Coolify'da MongoDB
1. **New Resource** > **Database** > **MongoDB**
2. Deploy et
3. Connection string'i kopyala (örn: `mongodb://mongo:27017`)

---

## Adım 3: DNS Kaydı (Cloudflare)

Cloudflare panelinde:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | api | 91.98.27.86 | Proxied ✅ |

---

## Adım 4: Frontend'i Yeniden Deploy

`.env.production` dosyası oluşturuldu:
```
VITE_API_URL=https://api.cvniz.com/api
```

Frontend'i Coolify'da yeniden build et.

---

## Adım 5: Test

```bash
# Backend health check
curl https://api.cvniz.com/health

# Login test
curl -X POST https://api.cvniz.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## Sorun Giderme

### DNS hala çözümlenmiyor
- Cloudflare'da kayıt eklendikten sonra birkaç dakika bekleyin
- `nslookup api.cvniz.com` ile kontrol edin

### 502 Bad Gateway
- Coolify'da backend log'larına bakın
- MongoDB bağlantısını kontrol edin

### CORS hatası
- Backend env'de `CORS_ORIGIN` değerini kontrol edin
