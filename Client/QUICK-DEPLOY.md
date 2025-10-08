# ⚡ Quick cPanel Deployment - nukgsz.com

## 📦 What's in the Package

`cpanel-deployment-package.tar.gz` contains:
- ✅ Backend server (`backend/server.js`)
- ✅ Package files (`package.json`, `package-lock.json`)
- ✅ Database setup SQL
- ✅ Frontend build (`dist/` folder)
- ✅ Full deployment guide

---

## 🚀 5-Minute Deployment

### 1️⃣ Upload Package (1 min)

1. Login to **cPanel**
2. Go to **File Manager**
3. Upload `cpanel-deployment-package.tar.gz`
4. Right-click → **Extract**

### 2️⃣ Setup Backend (2 min)

1. cPanel → **Setup Node.js App**
2. Click **Create Application**:
   - Node version: **18.x or higher**
   - App root: `backend`
   - Startup file: `server.js`
3. Click **Create**
4. Click **Run NPM Install**
5. Create `.env` file in `backend/` folder:

```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nukgszco_3ou_Cms
DB_USER=nukgszco
DB_PASSWORD=hk~Gn-EG7f8J
JWT_SECRET=your-random-secret-key-here
ALLOWED_ORIGINS=https://www.nukgsz.com,https://nukgsz.com
```

6. Click **Start Application**

### 3️⃣ Deploy Frontend (1 min)

1. Move all files from `dist/` to `public_html/`
2. Create `.htaccess` in `public_html/`:

```apache
RewriteEngine On
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>
```

### 4️⃣ Test (1 min)

Open: `https://nukgsz.com/api/health`

Should see: `{"status":"OK",...}`

Then open: `https://nukgsz.com`

---

## ✅ Done!

Your site is now live at **https://nukgsz.com**

**Need detailed instructions?** → See `CPANEL-DEPLOYMENT-GUIDE.md`

**Having issues?** → Check the troubleshooting section in the full guide
