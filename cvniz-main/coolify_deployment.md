# CVniz Coolify Kurulum Rehberi

Bu rehber, CVniz sistemini (Frontend, Backend, Redis, MongoDB) Coolify'a kurmak için adım adım talimatlar sunar.

## 1. Hazırlık

### Ön Koşul: Sunucu Gereksinimleri
- **Coolify Instance**: Çalışan bir Coolify v4 örneği.
- **Kaynaklar**: Tüm yapı için en az 4GB RAM ve 2 vCPU önerilir.

### Gerekli Ortam Değişkenleri (Environment Variables)
Aşağıdaki değerlerin hazır olduğundan emin olun:
- `MONGODB_URI`: Bağlantı dizesi (Coolify'ın kendi veritabanını kullanıyorsanız dahili adres olacaktır).
- `REDIS_URL`: Bağlantı dizesi (Coolify'ın kendi Redis'ini kullanıyorsanız dahili adres olacaktır).
- `JWT_SECRET`: Uzun ve rastgele bir anahtar.
- `PORT`: 3001 (Backend için).
- `VITE_API_URL`: API'nizin genel URL'si (Örn: `https://api.cvniz.com/api`).

---

## 2. Altyapı Kurulumu (Veritabanları)

Coolify'da önce veritabanı servislerini oluşturmalısınız.

### MongoDB
1. **Resource** -> **Database** -> **MongoDB** yolunu izleyerek yeni bir kaynak oluşturun.
2. `Image` değerini `mongo:7.0` olarak ayarlayın.
3. `cvniz-mongodb` gibi bir isim verin.
4. Kurulum tamamlandıktan sonra **Internal Connection String** değerini not edin (Örn: `mongodb://kullanici:sifre@cvniz-mongodb:27017`).

### Redis
1. **Resource** -> **Database** -> **Redis** yolunu izleyerek yeni bir kaynak oluşturun.
2. `Image` değerini `redis:7-alpine` olarak ayarlayın.
3. `cvniz-redis` gibi bir isim verin.
4. **Internal Connection String** değerini not edin (Örn: `redis://cvniz-redis:6379`).

---

## 3. Uygulama Kurulumu (GitHub Üzerinden)

Coolify'da projeyi GitHub'dan çekerek kurmak en sağlıklı ve otomatik (CI/CD) yöntemdir.

### Adım 0: GitHub Bağlantısı
1. Coolify panelinde **Sources** -> **GitHub App** (önerilen) veya **Deployment Key** üzerinden GitHub hesabınızı bağlayın.
2. Eğer deponuz gizli (private) ise, Coolify'ın oluşturduğu **SSH Key**'i GitHub deponuzun **Settings -> Deploy Keys** kısmına ekleyin.

### Seçenek A: Docker Compose Kullanımı (Önerilen)
Tüm yapıyı (Backend + Frontend + Nginx) tek seferde kurmak için:

1. **Resource** -> **Docker Compose** oluşturun.
2. GitHub deponuzu seçin.
3. `docker/docker-compose.yml` dosyasını kaynak gösterin.
4. **Environment Variables** kısmına veritabanı adreslerini ve JWT anahtarınızı girin.

### Seçenek B: Bireysel Servisler (Ayrı Ayrı)

#### Backend Servisi
1. **Resource** -> **Public/Private Repository** oluşturun.
2. GitHub deponuzu ve `backend` dizinini seçin.
3. **Build Pack**: `Docker` seçin.
4. **Ortam Değişkenleri**: `MONGODB_URI`, `REDIS_URL`, `JWT_SECRET`, `CORS_ORIGIN` değerlerini girin.

#### Frontend (Web) Servisi
1. **Resource** -> **Public/Private Repository** oluşturun.
2. GitHub deponuzu seçin ve **Base Directory** kısmını mutlaka **`/web`** yapın.
3. **Build Pack**: Mutlaka **`Docker`** seçin.
4. **Port**: **`80`** (Uygulama Docker içinde 80 portunda çalışıyor).
5. **Build Arguments** (Çok Önemli): 
   - `VITE_API_URL`: Backend API adresiniz (Örn: `https://api.domaininiz.com/api`). Bu değerin derleme sırasında girilmesi şarttır.
6. **Environment Variables**:
   - `VITE_APP_URL`: `https://domaininiz.com`



---

## 4. Kalıcı Depolama (Persistent Storage / Volumes)

**Çok Önemli:** GitHub'dan her yeni sürüm çektiğinizde veya konteyner yeniden başladığında, `uploads` klasöründeki dosyaların silinmemesi için Coolify'da "Persistent Storage" kullanmalısınız.

### Backend için Volume Yapılandırması
1. Backend servisinin ayarlarına gidin.
2. **Storage** sekmesini bulun.
3. Yeni bir volume ekleyin:
   - **Mount Path**: `/app/uploads` (Backend Dockerfile'daki dizine göre)
   - **Volume Name**: `cvniz-uploads`
4. Bu işlem, kullanıcıların yüklediği resimlerin ve dosyaların konteyner silinse bile sunucuda güvenle saklanmasını sağlar.

---

## 5. Otomatik Cache Temizliği

Sistem, her 24 saatte bir gece yarısı (00:00) cache'i otomatik olarak temizleyecek şekilde yapılandırılmıştır.
- Coolify tarafında bunun için ek bir ayar yapmanıza gerek yoktur.
- Çalıştığını backend loglarında şu mesajı görerek doğrulayabilirsiniz: `✅ [Cron] Günlük cache başarıyla temizlendi`.

---

## 5. Sağlık Kontrolleri (Health Checks)

Coolify servisleri otomatik olarak izler. Sağlık kontrolü uç noktalarının (Health Check endpoints) yapılandırıldığından emin olun:
- **Backend Health Check**: `GET /health` (Cevap: `status: "ok"`)
- **Frontend Health Check**: Ana sayfanın doğru şekilde yüklendiğini kontrol edin.

---

## 6. Sorun Giderme

- **CORS Hataları**: Backend'deki `CORS_ORIGIN` değerinin frontend domaininizle (https:// dahil) tam eşleştiğinden emin olun.
- **Veritabanı Bağlantısı**: Daha hızlı ve güvenli bağlantı için dahili servis isimlerini (örn: `cvniz-mongodb`) kullanın.
- **Değişiklikler**: Bir ortam değişkenini değiştirdiğinizde, etkili olması için servisi Coolify'da **Redeploy** (Yeniden Dağıt) yapmalısınız.
