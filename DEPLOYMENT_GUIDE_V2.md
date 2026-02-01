# CVniz Deployment & Configuration Guide (Updated 2026)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6.0+
- Redis 7.0+ (for caching)
- Docker & Docker Compose
- GitHub account (for CI/CD)

---

## 📋 Environment Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/CVniz.git
cd CVniz
```

### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../web
npm install
```

### 3. Configure environment variables
```bash
# Copy and update .env file
cp ../.env.example ../.env

# Essential variables to update:
# - MONGODB_URI
# - JWT_SECRET (generate with: openssl rand -hex 32)
# - SENTRY_DSN (optional, for error tracking)
# - Email service credentials
# - Firebase config (for push notifications)
```

---

## 🔄 Coolify Deployment

### Setup Coolify on Hetzner
```bash
# SSH into your server
ssh root@91.98.27.86

# Install Coolify (one command)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Access dashboard
# Visit: http://91.98.27.86:8000 in your browser
```

### Deploy Backend Service
1. **Create New Resource** → **Application**
2. **Source**: Connect GitHub repository
3. **Set Build Pack**: Select `Nodejs`
4. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb://mongo:27017/CVniz
   REDIS_URL=redis://redis:6379
   JWT_SECRET=[GENERATE_NEW]
   SENTRY_DSN=[YOUR_SENTRY_DSN]
   CORS_ORIGIN=https://cvniz.com,https://api.cvniz.com
   ```
5. **Domain**: `api.cvniz.com`
6. **Deploy**

### Deploy Frontend Service
1. **Create New Resource** → **Application**
2. **Source**: Same GitHub repository
3. **Build Command**: `npm run build`
4. **Publish Directory**: `web/dist`
5. **Environment Variables**:
   ```env
   VITE_API_URL=https://api.cvniz.com/api
   VITE_SENTRY_DSN=[YOUR_SENTRY_DSN]
   ```
6. **Domain**: `cvniz.com`
7. **Deploy**

### Deploy Database Services
```bash
# MongoDB
- Resource Type: Database
- Select: MongoDB
- Version: Latest
- Create

# Redis
- Resource Type: Database
- Select: Redis
- Version: Latest
- Create
```

---

## 🔐 Security Setup

### 1. Generate JWT Secret
```bash
openssl rand -hex 32
# Use this value for JWT_SECRET and JWT_REFRESH_SECRET
```

### 2. Set up Sentry for Error Tracking
```bash
# 1. Sign up at https://sentry.io
# 2. Create new project for Node.js
# 3. Copy DSN to SENTRY_DSN env variable
```

### 3. Configure Firebase (Push Notifications)
```bash
# 1. Go to https://console.firebase.google.com
# 2. Create new project
# 3. Download service account JSON
# 4. Set FIREBASE_CONFIG env variable with JSON content
```

### 4. API Key Management
Users can generate API keys from their dashboard:
```javascript
// Using API key
curl -X GET https://api.cvniz.com/api/users/profile \
  -H "x-api-key: cvniz_[your-api-key]"
```

---

## 📊 Database Optimization

### Create Indexes (Run once after first deployment)
```bash
# SSH into backend container or run locally
npm run create-indexes
```

This creates optimal indexes for:
- User lookups (email, createdAt, isPremium)
- CV queries (userId, isPublic, template)
- View tracking (cvId, viewerId, timestamps)
- Analytics aggregations (userId, action)

---

## 🤖 CI/CD Pipeline

### GitHub Actions Workflows
Automatic testing and deployment on each push:

1. **Backend Tests** (`.github/workflows/backend-test.yml`)
   - Runs Jest tests
   - Linting with ESLint
   - Coverage reports
   - On every push to `main` or `develop`

2. **Frontend Build** (`.github/workflows/frontend-test.yml`)
   - Vite build
   - On every push to `main` or `develop`

### To deploy new version:
```bash
git push origin main
# Workflows automatically run
# On success, Coolify rebuilds services
```

---

## 📧 Email Templates

Pre-configured HTML email templates for:
- Welcome emails
- Password reset
- Email verification
- CV view notifications

Located in: `backend/src/templates/emails/`

---

## 📦 Docker Compose (Local Development)

```bash
cd docker
docker-compose up -d

# Services running:
# - MongoDB: localhost:27017
# - Redis: localhost:6379
# - Backend: localhost:3001
# - Frontend: localhost:5173
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run with Coverage
```bash
npm test -- --coverage
```

---

## 📊 Monitoring

### Monitor Application Health
```bash
# Health check endpoint
curl https://api.cvniz.com/health

# Response:
# {"status":"ok","timestamp":"2026-02-01T10:00:00.000Z","environment":"production"}
```

### View Logs in Coolify
1. Open Coolify Dashboard
2. Select your application
3. View logs in real-time

### Sentry Error Tracking
- Visit: https://sentry.io
- All production errors are logged
- Set up alerts for critical errors

---

## 🔄 Backup & Recovery

### Automatic Backups (via Coolify)
Configure S3 backups:
1. Coolify Dashboard → Settings
2. Enable automatic backups
3. Configure S3 credentials
4. Backups run daily

### Manual Backup
```bash
# Backup MongoDB
mongodump --uri "mongodb://localhost:27017/CVniz" --archive=backup.gz --gzip

# Restore MongoDB
mongorestore --uri "mongodb://localhost:27017/CVniz" --archive=backup.gz --gzip
```

---

## 🚨 Troubleshooting

### 502 Bad Gateway
- Check backend logs in Coolify
- Verify MongoDB connection: `mongodb://mongo:27017/CVniz`
- Check Redis connection if cache is enabled

### CORS Errors
- Verify `CORS_ORIGIN` environment variable
- Ensure frontend domain is in the list

### High Memory Usage
- Check for memory leaks in Sentry
- Review MongoDB queries performance
- Check Redis cache hit rate

### Database Connection Issues
```bash
# Test MongoDB connection
npm run test-db

# Test Redis connection
npm run test-redis
```

---

## 📝 Maintenance

### Weekly Tasks
- [ ] Check Sentry for new errors
- [ ] Review analytics dashboard
- [ ] Monitor API performance

### Monthly Tasks
- [ ] Review and rotate JWT secrets
- [ ] Check SSL certificate expiration (Coolify auto-renews)
- [ ] Analyze A/B test results
- [ ] Update dependencies

### Quarterly Tasks
- [ ] Database optimization
- [ ] Security audit
- [ ] Performance tuning

---

## 📞 Support

For issues or questions:
1. Check Sentry dashboard for errors
2. Review application logs
3. Contact support team

---

**Last Updated**: February 2026
**Deployed On**: Coolify + Hetzner CAX21 (8GB RAM)
**Status**: ✅ Production Ready
