# 🌟 CVniz — Kurulum Kılavuzu & Teşekkürler

Merhaba Değerli Geliştirici / Girişimci Arkadaşım,

Öncelikle **CVniz (Yapay Zeka Destekli Kariyer & CV SaaS Platformu)** projesini [erdemeroglu.com.tr](https://erdemeroglu.com.tr) üzerinden indirdiğin için çok teşekkür ederim.

Aylarca üzerinde büyük bir tutkuyla çalıştığımız bu projeyi açık kaynak ve tamamen ücretsiz olarak seninle paylaşmaktan büyük mutluluk duyuyorum. Amacım; ister bu projeyi bir SaaS girişimi olarak yayına alıp gelir elde etmen, ister portföyüne güçlü bir proje olarak eklemen, istersen de yapay zeka entegrasyonları, React Native mobil mimarisi ve makine öğrenmesi modellerini inceleyerek kendine yeni değerler katmandır.

---

## 🎁 cvniz.com Alan Adı Çekilişi Hakkında

Bildiğin gibi, projenin jenerik ve akılda kalıcı orijinal alan adı olan **cvniz.com**, bu projeyi indiren ve R10.net üzerindeki resmi konumuza indirdiğini belirten üyelerimiz arasından şeffaf bir çekilişle **ücretsiz olarak devredilecektir**.

Eğer henüz R10 konumuza yorum bırakmadıysan:
1. R10.net üzerindeki konumuza git,
2. Projeyle ilgili beğendiğin özellikleri veya iyi niyet dileğini yazarak *"İndirdim, çekilişe katılıyorum"* mesajı bırak.
3. Çekiliş gününde kazanırsan alan adı doğrudan firması üzerinden sana ücretsiz transfer edilecektir!

---

## 📁 Proje Klasör Yapısı

Paket içerisinde tüm katmanlar birbirinden bağımsız ve temiz bir mimariyle ayrılmıştır:

```text
cvniz/
├── web/                # React 18 (Vite) + Tailwind CSS + Framer Motion Web Arayüzü
├── backend/            # Node.js + Express.js + MongoDB + Redis REST API
├── cvniz-app/          # React Native (Expo) - iOS & Android Mobil Uygulaması
├── docker/             # Docker Compose & Container Yapılandırmaları
├── Makefile            # Hızlı derleme ve konteyner yönetim komutları
└── KURULUM_VE_TESEKKURLER.md
```

---

## 🚀 Hızlı Başlangıç (Docker ile Tek Komut)

Sistemi bilgisayarında veya bir Linux (Ubuntu/Debian) sunucuda çalıştırmanın en hızlı yolu Docker kullanmaktır:

### 1. Ortam Değişkenlerini Hazırlayın:
```bash
# Ana dizindeki örnek env dosyasını kopyalayın
cp .env.example .env

# Backend içerisindeki env dosyasını kopyalayın
cp backend/.env.example backend/.env
```

`.env` dosyası içerisinde aşağıdaki temel ayarları kendi bilgilerinize göre düzenleyin:
* `OPENAI_API_KEY`: OpenAI API anahtarınız (AI Smart Fill, Headshot ve Mülakat Koçu için)
* `GEMINI_API_KEY`: Google Gemini API anahtarınız (Opsiyonel alternatif model)
* `JWT_SECRET`: Güçlü rastgele bir güvenlik anahtarı
* `MONGO_URI`: MongoDB bağlantı adresiniz (Docker kullanıyorsanız varsayılan kalabilir)
* `REDIS_URL`: Redis önbellekleme adresi (Docker kullanıyorsanız varsayılan kalabilir)

### 2. Konteynerleri Başlatın:
```bash
docker-compose up -d --build
```

Tüm servisler yaklaşık 1-2 dakika içinde ayağa kalkacaktır:
* **Web Arayüzü:** `http://localhost:5173` (veya production portunda: `http://localhost:80`)
* **Backend API:** `http://localhost:5000/api`
* **MongoDB:** `localhost:27017`
* **Redis:** `localhost:6379`

---

## 💻 Manuel / Lokal Geliştirme Kurulumu

Docker yerine projeyi lokal ortamınızda adım adım çalıştırmak isterseniz:

### 1. Backend (API) Servisi:
Gereksinimler: Node.js 18+, MongoDB, Redis
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
API servisi varsayılan olarak `http://localhost:5000` portunda çalışacaktır.

### 2. Web Frontend (React):
```bash
cd web
npm install
npm run dev
```
Web uygulaması varsayılan olarak `http://localhost:5173` adresinde açılacaktır.

### 3. Mobil Uygulama (Expo / React Native):
```bash
cd cvniz-app
npm install
npx expo start
```
Terminalde çıkan QR kodu telefonunuzdaki **Expo Go** uygulaması ile okutarak uygulamayı anında canlı test edebilirsiniz. Google Play veya App Store derlemesi (build) almak için `eas build` komutunu kullanabilirsiniz.

---

## 🛠️ Öne Çıkan Modüller & İpuçları

1. **AI Smart Fill:** `backend/src/services/ai/` altında yer alan prompt mimarisini inceleyerek sektörel şablonları geliştirebilirsin.
2. **AI Headshot:** Fotoğraf işleme modülü `backend/src/services/imageProcessingService.js` içerisindedir.
3. **ATS Analiz Motoru:** `web/src/utils/atsScanner.js` ve backend skorlama algoritması gerçek anahtar kelime frekans analizi yapar.
4. **Multiplayer Editör:** `backend/src/services/socketService.js` üzerinden WebSockets ile canlı imleç senkronizasyonu sağlar.
5. **İş Zekası & Makine Öğrenmesi:** `backend/src/services/analytics/` altında churn tahmini ve gelir öngörüsü modelleri yer almaktadır.

---

## 🤝 İletişim & Destek

Kurulumda takıldığın bir aşama, aklına takılan mimari bir soru veya iş birliği önerin olursa benimle her zaman iletişime geçebilirsin:

* **Kişisel Web Sitem:** [https://erdemeroglu.com.tr](https://erdemeroglu.com.tr)
* **İletişim Formu:** [https://erdemeroglu.com.tr/iletisim](https://erdemeroglu.com.tr/iletisim)
* **E-posta:** iletisim@erdemeroglu.com.tr
* **LinkedIn:** [linkedin.com/in/erogluerdem](https://linkedin.com/in/erogluerdem)

Projeyi güle güle kullan, SaaS yolculuğunda ve yazılım kariyerinde sonsuz başarılar dilerim! 🚀
