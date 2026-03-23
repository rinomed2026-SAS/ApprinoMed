# 🚀 RINOMED 2026 - Full Integration Testing

**Status:** ✅ Development Environment Ready  
**Date:** $(date)  
**Environment:** macOS + iPhone 17 Pro Simulator + Express.js API

---

## 📋 Environment Status

### ✅ Frontend (Mobile App)
- **Status:** Running on iPhone 17 Pro Simulator
- **App:** Ionic 8 + Angular 20
- **Current Screen:** HOME/Dashboard (post-login)
- **Port:** iOS Simulator (localhost via bridge)

### ✅ Backend (API Server)
- **Status:** Running on port 4000
- **Framework:** Express.js
- **Database:** PostgreSQL (rinomed2026)
- **ORM:** Prisma (v5.22.0)
- **Process:** tsx watch (development mode)

### ✅ Database
- **Status:** Synced and seeded
- **Admin Credentials:** review@rinomed2026.com / Rinomed2026!
- **Test Data:** ✅ Users, Sessions, Speakers, Venues seeded

---

## 🔍 Testing Checklist

### Phase 1: API Connectivity (Pre-Login)

```bash
# Test API health endpoint
curl -i http://localhost:4000/health

# Expected Response:
# HTTP/1.1 200 OK
# Content-Type: application/json
# {"status":"ok","timestamp":"2025-01-XX"}
```

### Phase 2: Login Flow (Credentials → Auth Token)

**Test Case 1: Valid Credentials**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "review@rinomed2026.com",
    "password": "Rinomed2026!"
  }'

# Expected Response (200):
# {
#   "success": true,
#   "message": "Login successful",
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIs...",
#     "user": {
#       "id": "uuid",
#       "email": "review@rinomed2026.com",
#       "name": "Review User",
#       "role": "admin"
#     }
#   }
# }
```

**Test Case 2: Invalid Email**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "Rinomed2026!"
  }'

# Expected Response (401):
# {"success": false, "error": "Invalid credentials"}
```

**Test Case 3: Invalid Password**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "review@rinomed2026.com",
    "password": "WrongPassword"
  }'

# Expected Response (401):
# {"success": false, "error": "Invalid credentials"}
```

### Phase 3: Mobile App Login (Manual Testing in Simulator)

**Steps:**
1. Open iOS Simulator (should show RINOMED app)
2. Current screen: HOME page (need to verify pre-login state)
3. Navigate to login screen (if needed)
4. Enter credentials:
   - Email: `review@rinomed2026.com`
   - Password: `Rinomed2026!`
5. Tap "Iniciar Sesión" button
6. Expected: 
   - Loading spinner appears (250ms animation)
   - API call to http://localhost:4000/api/auth/login
   - Success response received
   - Navigation to HOME page
   - User data persisted to localStorage

### Phase 4: Home Page Data Loading

**API Endpoints to Test:**
```bash
# Get user profile (requires auth token)
curl -H "Authorization: Bearer {token}" \
  http://localhost:4000/api/users/profile

# Get sessions/agenda (requires auth token)
curl -H "Authorization: Bearer {token}" \
  http://localhost:4000/api/sessions

# Get speakers (requires auth token)
curl -H "Authorization: Bearer {token}" \
  http://localhost:4000/api/speakers

# Get statistics (requires auth token)
curl -H "Authorization: Bearer {token}" \
  http://localhost:4000/api/statistics
```

**Mobile App Test:**
1. After successful login, verify HOME page loads:
   - Header with user avatar ✅
   - Statistics cards: Total Sesiones, Mi Agenda, Preguntas ✅
   - Quick Access grid: 6 buttons ✅
   - Event Info section ✅
   - Bottom tab bar ✅

2. Verify animations:
   - Header slides down (600ms) ✅
   - Stats cards cascade (100ms delay) ✅
   - Quick access buttons cascade (150ms delay) ✅
   - Event info slides in (200ms delay) ✅

3. Verify data loading:
   - Statistics numbers populated from API ✅
   - User avatar shows initial (first letter of name) ✅
   - Navigation links functional ✅

### Phase 5: Navigation & Tab Bar

**Test Tab Bar Navigation:**
1. **Home Tab** → Verify HOME page displays ✅
2. **Agenda Tab** → Navigate to Agenda (test in next phase)
3. **Speakers Tab** → Navigate to Speakers (test in next phase)
4. **Mi Agenda Tab** → Navigate to Mi Agenda (test in next phase)
5. **Info Tab** → Navigate to Info (test in next phase)

---

## 🔧 Debugging Commands

### Check API Logs
```bash
tail -50 /tmp/api-dev.log
```

### Monitor API in Real-Time
```bash
# Terminal 1: Watch API logs
tail -f /tmp/api-dev.log

# Terminal 2: Make requests
curl -X GET http://localhost:4000/health
```

### Test API with Auth Token
```bash
# 1. Login and capture token
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"review@rinomed2026.com","password":"Rinomed2026!"}' \
  | jq -r '.data.token')

# 2. Use token for authenticated requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/users/profile
```

### Database Query
```bash
# Connect to PostgreSQL
psql postgresql://localhost:5432/rinomed2026

# View users
SELECT id, email, name, role, created_at FROM users;

# View sessions
SELECT id, title, start_time, speaker_id FROM sessions;
```

---

## 📊 Success Criteria

| Criteria | Status | Notes |
|----------|--------|-------|
| API Server Running | ✅ | Port 4000 listening |
| Database Connected | ✅ | PostgreSQL rinomed2026 synced |
| Test Data Seeded | ✅ | Admin user created |
| Simulator Running | ✅ | iPhone 17 Pro active |
| App Compiled | ✅ | Angular build successful |
| **Login API Works** | ⏳ | Testing in progress |
| **Home Page Loads** | ⏳ | Testing in progress |
| **Statistics Load** | ⏳ | Testing in progress |
| **Navigation Works** | ⏳ | Testing in progress |
| **Full E2E Flow** | ⏳ | Testing in progress |

---

## 🎯 Next Steps

1. **Verify API Health**
   ```bash
   curl http://localhost:4000/health
   ```

2. **Test Login Endpoint**
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"review@rinomed2026.com","password":"Rinomed2026!"}'
   ```

3. **Open Simulator**
   - View running app on iPhone 17 Pro
   - Navigate to login screen
   - Test complete login flow
   - Verify HOME page loads with data

4. **Capture Success Screenshots**
   - Login screen entry
   - Loading state
   - HOME page with data
   - Tab bar navigation

---

## 📱 App Architecture Integration

### Login Flow (login.page.ts)
```typescript
// 1. User enters credentials in UI
// 2. Form validation passes
// 3. API Call: POST /api/auth/login
// 4. Await response with auth token
// 5. Store token in localStorage
// 6. Store user data
// 7. Navigate to HOME
// 8. HOME page loads
```

### Home Page Flow (home.page.ts)
```typescript
// 1. Page loads (ngOnInit)
// 2. Load user data from localStorage
// 3. Load statistics from API (requires token)
// 4. Populate header, cards, grid
// 5. Show animations
// 6. Ready for navigation
```

### API Integration Points
- `src/app/api.ts` - HTTP client service
- `src/app/auth.ts` - Authentication service
- All requests use Authorization header with JWT token

---

## 🚨 Troubleshooting

### API Not Responding
```bash
# Check if running
lsof -i :4000

# Check logs
tail -20 /tmp/api-dev.log

# Restart if needed
pkill -f "tsx watch"
npm run dev > /tmp/api-dev.log 2>&1 &
```

### App Can't Connect to API
- Ensure API is running on port 4000
- Check iOS Simulator network settings
- Verify API endpoint in `src/app/api.ts` uses `localhost:4000`
- Check CORS configuration in API

### Database Connection Error
```bash
# Verify PostgreSQL is running
psql postgresql://localhost:5432/rinomed2026

# Check .env file in services/api
cat .env | grep DATABASE_URL
```

### Simulator Issues
```bash
# Kill simulator
killall "com.apple.CoreSimulator.CoreSimulatorService"

# Restart
open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app
```

---

## 📋 Testing Timeline

- **[✅] API Setup** - 15:30
- **[✅] Database Seeding** - 15:35
- **[✅] Simulator Verification** - 15:40
- **[⏳] API Health Check** - In progress
- **[⏳] Login Endpoint Test** - Next
- **[⏳] Mobile Login Flow** - After API verified
- **[⏳] Home Page Integration** - After login works
- **[⏳] Full E2E Success** - Final validation

---

**Last Updated:** $(date)  
**Testing Environment:** RINOMED 2026 Full Stack Integration  
**Next Action:** Verify API health and test login endpoint
