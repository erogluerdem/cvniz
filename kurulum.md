CVniz Mobil Uygulama - Walkthrough
Özet
CVniz web uygulaması için iOS ve Android mobil uygulaması ve backend API altyapısı oluşturuldu. PC'de yarım kalan CV'nin mobilde devam etmesi için cross-platform senkronizasyon sistemi kuruldu.

Oluşturulan Bileşenler
1. Backend API (/backend)
Node.js + Express + MongoDB tabanlı RESTful API:

Dosya	Açıklama
server.js
Express server, rate limiting, CORS
User.js
Kullanıcı modeli, bcrypt hash, JWT
CV.js
CV modeli, versiyonlama, sync tracking
auth.js
Login, register, social login, token refresh
cv.js
CV CRUD, duplicate, archive, versions
sync.js
Push/pull sync, conflict resolution
2. React Native Mobil Uygulama (/mobile)
Expo tabanlı iOS ve Android uygulaması:

Ekranlar
Ekran	Dosya	Özellikler
Login	
LoginScreen.js
E-posta/şifre, social login
Register	
RegisterScreen.js
Kayıt formu, validation
Dashboard	
DashboardScreen.js
CV listesi, sync durumu
Editor	
EditorScreen.js
CV düzenleme (collapsible sections)
Templates	
TemplatesScreen.js
Şablon seçimi, premium badges
Profile	
ProfileScreen.js
Kullanıcı profili, istatistikler
Settings	
SettingsScreen.js
Tema, sync, uygulama ayarları
Preview	
PreviewScreen.js
CV önizleme, PDF export
Context'ler
AuthContext - Token yönetimi, login/register/logout
CVContext - CV CRUD, offline queue
SyncContext - Push/pull sync, network monitoring
ThemeContext - Dark/light/system tema
3. Web API Entegrasyonu
api.js
 - Web uygulaması için API service

Kurulum Adımları
1. MongoDB Kurulumu
# MongoDB yükleyin ve başlatın
# Windows: https://www.mongodb.com/try/download/community
2. Backend Başlatma
cd backend
npm install
npm run dev  # http://localhost:3001
3. Mobil Uygulama
cd mobile
npm install
npx expo start
# iOS: 'i' tuşu | Android: 'a' tuşu
IMPORTANT

mobile/src/constants/index.js dosyasında API_BASE_URL'i bilgisayarınızın IP adresi ile güncelleyin (örn: http://192.168.1.100:3001/api)

4. Web Uygulaması
cd web
npm install
npm run dev  # http://localhost:5173
Senkronizasyon Akışı
Mobile
API
Web
Mobile
API
Web
CV oluştur/güncelle
syncVersion: 1
GET /sync/status
hasUpdates: true
GET /sync/pull
Güncel CV'ler
Local storage güncelle
Sonraki Adımlar
Web context'lerini API'ye bağlama - AuthContext.jsx ve CVContext.jsx dosyalarını API çağrıları yapacak şekilde güncelleme
MongoDB Atlas - Production için cloud MongoDB kurulumu
EAS Build - App Store ve Google Play için build
Push Notifications - Expo Notifications entegrasyonu
