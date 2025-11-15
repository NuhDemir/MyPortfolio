# Environment Variables Setup Guide

## 📋 Frontend Environment Variables

### Development (.env.development)

```env
# Local backend URL
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_PROXY_TARGET=http://localhost:5000
```

### Production (.env.production)

```env
# Render.com backend URL
VITE_API_BASE_URL=https://myportfolio-backend.onrender.com/api
```

## 🚀 Deployment Steps

### 1. Local Development

```bash
cd frontend
npm run dev
```

- Uses `.env.development` automatically
- Backend should run on `localhost:5000`

### 2. Production Build

```bash
cd frontend
npm run build
```

- Uses `.env.production` automatically
- Backend keep-alive akan ping ke Render backend

### 3. Render.com Deployment

**Backend Environment Variables** (di Render Dashboard):

- `CORS_ALLOWED_ORIGINS` = `https://nuhdemir.dev`
- `FRONTEND_URL` = `https://nuhdemir.dev`
- `NODE_ENV` = `production`

**Frontend Environment Variables** (di hosting platform):

- `VITE_API_BASE_URL` = `https://myportfolio-backend.onrender.com/api`

## 🔧 Backend Keep-Alive Verification

### Console Logs Saat Pertama Kali Load

```
🔧 App Config: {
  apiBaseUrl: "https://myportfolio-backend.onrender.com/api",
  keepAliveEnabled: true,
  environment: "production",
  isProduction: true
}
🔄 Backend keep-alive started: Ping every 10 minutes
✅ Backend ping successful: { status: 'ok', ... }
```

### Test Health Endpoint

```bash
curl https://myportfolio-backend.onrender.com/api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2025-11-12T19:30:00.000Z",
  "uptime": 1234.56,
  "environment": "production"
}
```

## 📊 Keep-Alive Timeline

```
0 min   → Page loads, immediate ping
10 min  → Automatic ping #1
20 min  → Automatic ping #2
30 min  → Automatic ping #3
...
```

**Render Sleep**: 15 minutes inactivity  
**Ping Interval**: 10 minutes  
**Safety Margin**: 5 minutes

## ⚠️ Troubleshooting

### Ping Tidak Terlihat di Console

**Check 1**: Environment variable loaded?

```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
```

**Check 2**: Keep-alive enabled?

```javascript
// Should be true in production
console.log("Enabled:", import.meta.env.PROD);
```

### CORS Error

Pastikan backend `CORS_ALLOWED_ORIGINS` berisi frontend domain:

```
https://nuhdemir.dev
```

### Backend Tetap Sleep

1. Check Render dashboard logs
2. Verify health endpoint responds
3. Increase ping frequency (5 minutes)

## 📝 File Structure

```
MyPortfolio/
├── frontend/
│   ├── .env.development      # Local config
│   ├── .env.production       # Production config
│   ├── .env.example          # Template
│   └── src/
│       ├── app/App.jsx       # useBackendKeepAlive usage
│       └── shared/hooks/
│           └── useBackendKeepAlive.js
│
├── backend/
│   └── src/app/http/
│       └── routes.js         # /api/health endpoint
│
└── docs/
    └── backend/
        └── KEEP_ALIVE.md     # Full documentation
```

## 🔒 Security Notes

- ✅ `.env` files are gitignored
- ✅ `.env.example` is committed as template
- ✅ Sensitive values in Render dashboard
- ✅ Health endpoint is public (read-only)
- ⚠️ Consider rate limiting for health endpoint

---

**Updated**: November 12, 2025  
**Status**: ✅ Active & Working
