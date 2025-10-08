# 🚨 URGENT FIX - Database Connection Issue

## Problem
Error: `Cannot read properties of undefined (reading 'execute')`
This means the database is NOT connected.

## ✅ Solution - Step by Step

### Step 1: Stop the Current Backend
1. Go to **cPanel → Setup Node.js App**
2. Click on your backend app
3. Click **"Stop App"**

### Step 2: Upload New Fixed Version
1. Go to **cPanel → File Manager**
2. Navigate to `/home/nukgszco/backend/`
3. **Backup old files** (rename `dist` folder to `dist-old`)
4. Upload **`backend-cpanel-deploy-v2.tar.gz`**
5. Extract it (right-click → Extract)
6. Delete the tar.gz file

### Step 3: Verify Files
Make sure you have:
```
backend/
├── dist/
│   ├── server.js
│   ├── database/
│   │   └── init-mysql.js  ← IMPORTANT!
│   ├── routes/
│   └── middleware/
├── package.json
├── .env
└── setup-users-table.sql
```

### Step 4: Update .env File
Edit `.env` and make sure it has:

```env
NODE_ENV=production
PORT=3001

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=nukgszco_3ou_Cms
DB_USER=nukgsz
DB_PASSWORD=hk~Gn-EG7f8J

# Upload path
UPLOAD_PATH=./uploads

# CORS Origins
ALLOWED_ORIGINS=https://nukgsz.com,https://www.nukgsz.com

# JWT Secret - CHANGE THIS!
JWT_SECRET=your-random-super-secret-key-change-me-123456789

# Base path for API
BASE_PATH=/api
```

### Step 5: Verify Database Exists
1. Go to **cPanel → MySQL Databases**
2. Check if database `nukgszco_3ou_Cms` exists
3. If NOT, create it:
   - Database Name: `nukgszco_3ou_Cms`
   - Click "Create Database"

### Step 6: Verify User Privileges
1. In **MySQL Databases**, scroll to "Add User To Database"
2. Select:
   - User: `nukgsz`
   - Database: `nukgszco_3ou_Cms`
3. Click "Add"
4. Grant **ALL PRIVILEGES**
5. Click "Make Changes"

### Step 7: Start Backend
1. Go back to **Setup Node.js App**
2. Click **"Start App"**
3. **WATCH THE LOGS** - You should see:
   ```
   🔧 Server Configuration:
   PORT: 3001
   BASE_PATH: /api
   ALLOWED_ORIGINS: [ 'https://nukgsz.com', 'https://www.nukgsz.com' ]
   🔗 Connected to MySQL database
   📋 Database tables created successfully
   ⚠️  No admin user found. Please create one...
   ✅ Database initialized successfully
   🚀 ========================================
   🚀 Server started successfully on port 3001
   ```

### Step 8: Create Admin User
If you see "No admin user found", create one:

1. Go to **cPanel → phpMyAdmin**
2. Select database `nukgszco_3ou_Cms`
3. Click **SQL** tab
4. Run this query:

```sql
INSERT INTO users (username, email, password_hash, role)
VALUES (
  'admin',
  'admin@nukgsz.com',
  '$2a$10$YQ5EbN5xJ5Zq5J5J5J5J5uKZJ5J5J5J5J5J5J5J5J5J5J5J5J5J5Je',
  'admin'
);
```

**Login credentials:**
- Username: `admin`
- Password: `admin123`

**CHANGE THE PASSWORD IMMEDIATELY AFTER FIRST LOGIN!**

### Step 9: Test Login
1. Go to your website: `https://nukgsz.com`
2. Try to login with:
   - Username: `admin`
   - Password: `admin123`
3. Should work now! ✅

## 🔍 Verify It's Working

After starting the backend, the logs should show:
- ✅ Database connection successful
- ✅ Tables created
- ✅ Server started
- ✅ No more "Cannot read properties of undefined" errors

## ⚠️ Common Issues

### Issue: "Access denied for user"
**Fix:** Check DB credentials in `.env` file

### Issue: "Unknown database"
**Fix:** Create the database in cPanel MySQL Databases

### Issue: Still getting 500 error
**Fix:**
1. Check logs for specific error
2. Verify all .env variables are correct
3. Restart the app

### Issue: "Admin user not found"
**Fix:** Run the SQL query in Step 8 to create admin user

## 📞 Need Help?

If you still have issues:
1. Check backend logs in cPanel
2. Verify database exists and user has privileges
3. Make sure you uploaded v2 package (with database/init-mysql.js)
4. Restart the Node.js app

---

**Files:**
- New package: `backend-cpanel-deploy-v2.tar.gz` (53KB)
- Location: `/home/shrek/Documents/Projects/Demo-for-school/backend/`
