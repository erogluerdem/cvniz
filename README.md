# 🎉 CVniz - AI-Powered CV Builder

> Professional CV creation made easy with AI assistance, cross-platform support, and advanced analytics.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/CVniz/backend-test.yml)

## ✨ Features

### 🚀 Core Features
- **Multiple CV Templates** - Professional, creative, and modern designs
- **AI-Powered Suggestions** - Get smart recommendations for your CV content
- **Real-time Collaboration** - Work on your CV anywhere, anytime
- **Cross-Platform** - Web, iOS, Android with full sync
- **Export Formats** - PDF, DOCX, JSON
- **Public CV Sharing** - Share your CV with a unique link
- **View Analytics** - Track who viewed your CV

### 🤖 AI Features
- CV content optimization
- Cover letter generation
- Interview preparation
- Salary negotiation assistance
- Job recommendations
- Skill gap analysis

### 💼 Professional Features
- A/B testing framework
- Advanced analytics dashboard
- Email campaign tracking
- Payment integration (Iyzipay)
- API access with API keys
- Admin panel

### 🔒 Security & Performance
- JWT authentication with refresh tokens
- Rate limiting & DDoS protection
- XSS/CSRF protection
- Error tracking (Sentry)
- Redis caching layer
- MongoDB indexing optimization
- Automated security headers

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Cache**: Redis
- **Auth**: JWT + API Keys
- **Monitoring**: Sentry
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State**: Context API
- **i18n**: i18next (TR/EN)
- **Charts**: Recharts
- **Animations**: Framer Motion

### Mobile
- **Framework**: React Native (Expo)
- **Sync**: Cross-platform sync engine
- **Push**: Firebase Cloud Messaging

### Infrastructure
- **Hosting**: Coolify + Hetzner
- **CI/CD**: GitHub Actions
- **Email**: Nodemailer
- **File Upload**: AWS S3
- **Payments**: Iyzipay

---

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js 18+
- MongoDB 6.0+
- Redis 7.0+
- Docker (optional)
```

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/yourusername/CVniz.git
cd CVniz

# 2. Install dependencies
cd backend && npm install
cd ../web && npm install

# 3. Setup environment
cp ../.env.example ../.env
# Edit .env with your configuration

# 4. Start services (Docker)
cd ../docker
docker-compose up -d

# 5. Run backend
cd ../backend
npm run dev
# Backend: http://localhost:3001

# 6. Run frontend (new terminal)
cd ../web
npm run dev
# Frontend: http://localhost:5173
```

---

## 📚 Documentation

### Guides
- [Deployment Guide](./DEPLOYMENT_GUIDE_V2.md)
- [Hosting Recommendations](./hosting_onerileri.md)
- [Setup Instructions](./kurulum.md)

### API Documentation
```bash
# Run server and visit:
# http://localhost:3001/api-docs

# API Base URL (Production)
https://api.cvniz.com/api
```

### Available Endpoints
```
Authentication
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/refresh
  POST   /api/auth/logout

CVs
  GET    /api/cvs
  POST   /api/cvs
  GET    /api/cvs/:id
  PUT    /api/cvs/:id
  DELETE /api/cvs/:id

Analytics
  GET    /api/analytics/dashboard
  GET    /api/analytics/views
  GET    /api/abtests/results

AI Features
  POST   /api/ai/improve-cv
  POST   /api/ai/generate-letter
  POST   /api/ai/interview-prep

User
  GET    /api/users/profile
  PUT    /api/users/profile
  GET    /api/users/stats
```

---

## 🧪 Testing

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage

# Run specific test file
npm test auth.test.js
```

---

## 📦 Deployment

### Via Coolify (Recommended)

1. **Server Setup**
   ```bash
   # SSH to server
   ssh root@your-server-ip
   
   # Install Coolify
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```

2. **Deploy Backend**
   - Coolify Dashboard → New Resource → Application
   - Select GitHub repository
   - Set environment variables
   - Deploy

3. **Deploy Frontend**
   - Same process, different branch/directory

### Environment Variables

See `.env.example` for complete list. Key variables:

```env
# Database
MONGODB_URI=mongodb://mongo:27017/CVniz
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Sentry (Error Tracking)
SENTRY_DSN=https://...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Firebase (Push Notifications)
FIREBASE_CONFIG={"type":"service_account",...}
```

---

## 🔄 CI/CD Pipeline

GitHub Actions automatically:
- Run tests on every push
- Check code quality
- Build artifacts
- Report to Sentry
- (Optional) Deploy to Coolify

Workflows: `.github/workflows/`

---

## 📊 Monitoring

### Sentry Integration
- Real-time error tracking
- Performance monitoring
- Source map support
- Alert notifications

### Analytics
- User engagement metrics
- CV view statistics
- A/B test results
- AI feature usage

---

## 🔐 Security

### Implemented
- ✅ JWT authentication
- ✅ API key validation
- ✅ Rate limiting (100 req/15min for auth)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ XSS sanitization
- ✅ SQL injection prevention (MongoDB)
- ✅ HTTPS enforcement

### Best Practices
- Rotate secrets regularly
- Use environment variables
- Enable 2FA for GitHub
- Review API keys monthly
- Monitor Sentry alerts

---

## 🐛 Known Issues & Roadmap

### Current Version (2.0)
- ✅ Multi-language support (TR/EN)
- ✅ A/B testing framework
- ✅ Advanced analytics
- ✅ AI features (beta)

### Planned (Q1 2026)
- 🚀 Video CV support
- 🚀 LinkedIn import/export
- 🚀 Interview video recording
- 🚀 Team collaboration

---

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@cvniz.com
- **Chat**: [Discord Server]

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Expo for React Native framework
- Vercel for Vite
- MongoDB Atlas
- Coolify for deployment platform
- Sentry for error tracking

---

## 📈 Project Stats

- **Lines of Code**: ~50,000+
- **API Endpoints**: 40+
- **Database Collections**: 25+
- **Test Coverage**: 50%+
- **Performance**: <200ms avg response time

---

**Made with ❤️ by CVniz Team**

[Visit Website](https://cvniz.com) • [API Docs](https://api.cvniz.com/api-docs) • [Admin Panel](https://admin.cvniz.com)
