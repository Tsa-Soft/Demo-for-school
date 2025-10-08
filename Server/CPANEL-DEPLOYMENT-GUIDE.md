# cPanel Backend Deployment Guide

## 📦 Deployment Package

Your backend is ready for cPanel deployment in: `backend-cpanel-deploy.tar.gz`

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Prepare cPanel Environment

1. **Login to cPanel**
2. **Navigate to "Setup Node.js App"**
   - Found under Software section

### Step 2: Create Node.js Application

1. Click **"Create Application"**
2. Configure the application:
   - **Node.js version**: 18.x or higher (latest LTS recommended)
   - **Application mode**: Production
   - **Application root**: `backend` (or your preferred folder)
   - **Application URL**: Your domain (e.g., `nukgsz.com`)
   - **Application startup file**: `dist/server.js`
   - **Port**: Leave default (will be assigned by cPanel)

3. Click **"Create"**

### Step 3: Upload Files

1. **Using cPanel File Manager**:
   - Navigate to the application root folder you specified (e.g., `backend`)
   - Upload `backend-cpanel-deploy.tar.gz`
   - Extract the archive (right-click → Extract)
   - Delete the .tar.gz file after extraction

2. **Files should be in this structure**:
   ```
   backend/
   ├── dist/              (compiled JavaScript files)
   ├── package-cpanel.json
   ├── .env.cpanel
   ├── setup-users-table.sql
   ├── Pictures/          (if exists)
   ├── Documents/         (if exists)
   └── Presentations/     (if exists)
   ```

### Step 4: Configure Environment Variables

1. **Rename configuration files**:
   - Rename `package-cpanel.json` to `package.json`
   - Rename `.env.cpanel` to `.env`

2. **Edit `.env` file** with your actual values:
   ```env
   NODE_ENV=production
   PORT=3001

   # UPDATE THESE WITH YOUR CPANEL MYSQL CREDENTIALS
   DB_HOST=127.0.0.1
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password

   UPLOAD_PATH=./uploads

   # UPDATE WITH YOUR ACTUAL DOMAIN
   ALLOWED_ORIGINS=https://nukgsz.com,https://www.nukgsz.com

   # CHANGE THIS TO A RANDOM SECRET STRING
   JWT_SECRET=your-random-secret-key-here

   BASE_PATH=/api
   ```

### Step 5: Setup MySQL Database

1. **In cPanel, go to "MySQL Databases"**
2. **Create Database**:
   - Create a new database (e.g., `nukgszco_3ou_Cms`)

3. **Create Database User**:
   - Create a new user with strong password
   - Grant ALL PRIVILEGES to the database

4. **Import Database Schema**:
   - Go to **phpMyAdmin**
   - Select your database
   - Go to **Import** tab
   - Upload `setup-users-table.sql`
   - Click **Go**

5. **Update .env file** with the database credentials

### Step 6: Install Dependencies

1. **Return to "Setup Node.js App"**
2. **Click on your application**
3. **In the "Detected configuration files" section**:
   - It should detect `package.json`
   - Click **"Run NPM Install"**
   - Wait for installation to complete

### Step 7: Start the Application

1. **In "Setup Node.js App"**:
   - Make sure your app is selected
   - Click **"Stop App"** if it's running
   - Click **"Start App"**

2. **Check Status**:
   - Status should show "Running"
   - Note the port number assigned

### Step 8: Configure Reverse Proxy (IMPORTANT)

cPanel usually handles this automatically, but verify:

1. **The app should be accessible at**: `https://yourdomain.com/api`
2. **If not working**, you may need to add `.htaccess` in your public_html:

   ```apache
   RewriteEngine On
   RewriteRule ^api/(.*)$ http://127.0.0.1:PORT/api/$1 [P,L]
   ```
   Replace `PORT` with the port assigned by cPanel

### Step 9: Test the Backend

1. **Test Health Endpoint**:
   ```
   https://yourdomain.com/api/health
   ```
   Should return: `{"status":"ok","time":"..."}`

2. **Test API Endpoint**:
   ```
   https://yourdomain.com/api/
   ```
   Should return backend info

3. **Check Browser Console** on your frontend:
   - CORS errors should be gone
   - API calls should work

### Step 10: Monitor and Logs

1. **View Application Logs**:
   - In "Setup Node.js App", click on your app
   - Scroll down to see logs
   - Look for startup messages and any errors

2. **Common Issues**:
   - **Port conflicts**: Restart the app
   - **Database connection**: Check credentials in `.env`
   - **CORS errors**: Verify `ALLOWED_ORIGINS` in `.env`
   - **404 errors**: Check Application URL configuration

## 🔧 Updating the Backend

To update the backend later:

1. Upload new `backend-cpanel-deploy.tar.gz`
2. Extract and overwrite files
3. In "Setup Node.js App", click **"Restart"**

## 📁 File Permissions

Ensure these folders have write permissions (755 or 775):
- `uploads/`
- `Pictures/`
- `Documents/`
- `Presentations/`

## 🔐 Security Checklist

- ✅ Change JWT_SECRET to a random string
- ✅ Use strong database password
- ✅ Keep .env file secure (not publicly accessible)
- ✅ Verify ALLOWED_ORIGINS only includes your domains
- ✅ Keep Node.js version updated

## 🆘 Troubleshooting

**Backend not starting?**
- Check Node.js version (must be 18+)
- Verify `dist/server.js` exists
- Check error logs in cPanel

**Database connection failed?**
- Verify database credentials in `.env`
- Check if database user has privileges
- Ensure DB_HOST is `127.0.0.1` or `localhost`

**CORS errors?**
- Verify `ALLOWED_ORIGINS` in `.env`
- Must include both `https://yourdomain.com` and `https://www.yourdomain.com`

**API returns 404?**
- Check BASE_PATH in `.env` (should be `/api`)
- Verify Application startup file is `dist/server.js`
- Check reverse proxy configuration

## 📞 Support

If you encounter issues:
1. Check application logs in cPanel
2. Verify all environment variables in `.env`
3. Test database connection with phpMyAdmin
4. Check Node.js app status in cPanel

---

**Deployment Package Created**: `backend-cpanel-deploy.tar.gz`
**Location**: `/home/shrek/Documents/Projects/Demo-for-school/backend/`
