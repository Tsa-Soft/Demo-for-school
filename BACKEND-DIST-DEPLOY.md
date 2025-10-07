# 🚀 Backend Dist Deployment Guide

## 📦 Package: backend-dist-deploy.tar.gz

This package contains the **compiled TypeScript backend** with all features:
- ✅ Full CMS functionality
- ✅ JWT authentication
- ✅ File uploads (multer)
- ✅ Security headers (helmet)
- ✅ All API endpoints
- ✅ Image/document management

---

## ⚡ Quick Deploy Steps

### 1. Upload to cPanel
```bash
# Upload backend-dist-deploy.tar.gz to cPanel File Manager
# Extract it in home directory
# You'll get a dist/ folder
```

### 2. Setup Node.js Application

**In cPanel → Setup Node.js App:**

```
Node.js version:     20.19.4 (or latest 20.x)
Application mode:    Production
Application root:    dist
Application URL:     (leave empty)
Application startup: index.js
```

Click **"Create"**

### 3. Install Dependencies

**Option A - Using cPanel (Recommended):**
1. In Node.js App interface, find your app
2. Click **"Run NPM Install"**
3. Wait for installation (may take 2-3 minutes due to multer)

**Option B - Using SSH:**
```bash
cd ~/dist
npm install --production
```

**Note:** This may show warnings about `multer` being deprecated, but it will still work.

### 4. Update Environment Variables

The `.env` file is already in the dist/ folder with production settings.

**Optional:** Update any settings:
```bash
cd ~/dist
nano .env
```

Change these if needed:
- `JWT_SECRET` → Your own random secret
- Database credentials (already set)

### 5. Start the Application

In cPanel Node.js App interface:
- Click **"Start"** or **"Restart App"**
- Status should show **"Running"** (green)

OR via SSH:
```bash
cd ~/dist
node index.js
```

### 6. Test the API

Open in browser:
```
https://nukgsz.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-10-07T..."
}
```

---

## 📂 What's in dist/?

```
dist/
├── index.js                    ← Main server file (compiled)
├── package.json                ← Production dependencies
├── .env                        ← Environment config
├── database/
│   ├── init-mysql.js          ← Database initialization
│   └── init.js
├── routes/                    ← All API routes
│   ├── auth.js
│   ├── content.js
│   ├── staff.js
│   ├── images.js
│   └── ... (all routes)
├── middleware/
└── utils/
```

---

## 🔧 Troubleshooting

### ❌ npm install fails with multer error

**Problem:** `multer` needs native compilation
**Solution:** Install packages one by one:

```bash
cd ~/dist
npm install express@4.18.2 --save
npm install mysql2@3.14.5 --save
npm install bcryptjs@2.4.3 --save
npm install cors@2.8.5 --save
npm install dotenv@16.3.1 --save
npm install jsonwebtoken@9.0.2 --save
npm install helmet@7.1.0 --save
npm install morgan@1.10.0 --save
npm install uuid@9.0.1 --save

# Try multer last (may fail on some hosts)
npm install multer@1.4.5-lts.1 --save
```

If multer still fails, file uploads won't work, but the rest of the API will.

### ❌ Application won't start

Check logs:
```bash
# Via cPanel: Setup Node.js App → View Logs
# Via SSH:
tail -f ~/logs/dist-error.log
```

Common issues:
- Database connection failed → Check .env credentials
- Port already in use → cPanel assigns ports automatically
- Missing dependencies → Run npm install again

### ❌ CORS errors

Update ALLOWED_ORIGINS in `.env`:
```env
ALLOWED_ORIGINS=https://www.nukgsz.com,https://nukgsz.com
```

Restart the app after changing .env.

### ❌ JWT errors

Update JWT_SECRET in `.env` to a strong random string:
```env
JWT_SECRET=your-very-long-random-secret-key-here-123456789
```

---

## 🆚 Comparison: dist vs server.js

| Feature | dist/ (Full TypeScript) | server.js (Simple) |
|---------|------------------------|-------------------|
| Language | Compiled TypeScript | Pure JavaScript |
| Size | ~100+ files | 1 file |
| Dependencies | 9 packages | 5 packages |
| File uploads | ✅ Yes (multer) | ❌ No |
| JWT tokens | ✅ Yes | ❌ No |
| Security headers | ✅ Yes (helmet) | ❌ Basic |
| CMS features | ✅ Full | ⚠️ Basic |
| Installation | 2-3 minutes | 30 seconds |
| Shared hosting | ⚠️ May need workarounds | ✅ Works everywhere |

---

## 💡 When to Use dist/ vs server.js

### Use **dist/** when:
- ✅ You need full CMS functionality
- ✅ File uploads are required
- ✅ JWT authentication is needed
- ✅ Your host supports native npm packages
- ✅ Production deployment

### Use **server.js** when:
- ✅ You need quick deployment
- ✅ Shared hosting with limited support
- ✅ Basic API only (no file uploads)
- ✅ npm install keeps failing
- ✅ Development/testing

---

## 📊 Monitoring

### Check Status:
```bash
# cPanel → Setup Node.js App
# Status should be "Running" (green)
```

### View Logs:
```bash
# Via cPanel: Click app → View Logs
# Via SSH:
cd ~/dist
tail -f ../logs/dist-error.log
```

### Test Endpoints:
```bash
curl https://nukgsz.com/api/health
curl https://nukgsz.com/api/content
curl https://nukgsz.com/api/pages
```

---

## 🔄 Updating

To update the backend:

1. Build locally: `cd backend && npm run build`
2. Create new tar: `tar -czf backend-dist-deploy.tar.gz dist/`
3. Upload to cPanel
4. Extract (overwrite old files)
5. Restart app in cPanel

OR via SSH:
```bash
# Upload new dist/ files
# Then:
cd ~/dist
npm install --production
# Restart in cPanel or: pkill node
```

---

## ✅ Success Checklist

- [ ] backend-dist-deploy.tar.gz uploaded
- [ ] Extracted to dist/ folder
- [ ] Node.js app created (startup: index.js)
- [ ] npm install completed (no blocking errors)
- [ ] .env configured with DB credentials
- [ ] Application started (status: Running)
- [ ] /api/health returns JSON
- [ ] No errors in application logs
- [ ] Can access all API endpoints
- [ ] Database connected successfully

---

## 🎉 Deployment Complete!

Your full-featured backend is now running at:
- 🌐 https://nukgsz.com/api/
- 🌐 https://www.nukgsz.com/api/

**All CMS features are available!**

---

## 📞 Support

### Still having issues?

1. **Check if simpler version works:**
   - Try `backend-deploy-clean.tar.gz` (server.js) instead
   - If that works, problem is with native packages

2. **Check host capabilities:**
   - Some shared hosts don't support native npm packages
   - Ask your host if `node-gyp` is available

3. **Alternative:**
   - Deploy backend on a cloud service (Heroku, Railway, etc.)
   - Update frontend API URL to point to cloud backend
