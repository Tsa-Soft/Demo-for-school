# Database Fallback System for News

This project includes a fallback system that allows the frontend to display news even when the backend API is unavailable. The system works by exporting news data from the MySQL database to a JSON file that can be imported by the frontend.

## How It Works

1. **Database Export**: News data from the MySQL database (configured in `backend/.env`) is exported to `src/data/newsDbFallback.json`
2. **Frontend Fallback**: When the backend API fails, the frontend automatically loads news from the JSON file
3. **Seamless Experience**: Users see news content even when the backend is down

## Usage

### Exporting News from Database

To update the fallback data with the latest news from the database:

```bash
# Export from MySQL database
node scripts/export-news-from-mysql.js

# Or export from SQLite database (if using SQLite)
node scripts/export-news-fallback.js
```

The MySQL export script:
- Reads all published news articles from the MySQL database
- Uses database credentials from `backend/.env`
- Formats data for frontend consumption
- Saves them to `src/data/newsDbFallback.json`

### Automatic Fallback

The fallback happens automatically when:
- The backend server is not running
- The backend API returns an error
- Network connection fails

The NewsPage and NewsArticlePage components will:
1. First try to fetch from the backend API
2. If that fails, load from the database fallback JSON file
3. If that also fails, fall back to mock data

## Files

- `scripts/export-news-from-mysql.js` - Script to export from MySQL database to JSON (recommended)
- `scripts/export-news-fallback.js` - Script to export from SQLite database to JSON (alternative)
- `src/data/newsDbFallback.json` - Exported news data (auto-generated)
- `src/utils/newsDbFallback.ts` - Utility functions to read fallback data
- `pages/NewsPage.tsx` - News list page with fallback support
- `pages/NewsArticlePage.tsx` - Individual news article page with fallback support
- `backend/.env` - Database configuration (used by MySQL export script)

## When to Update Fallback Data

You should run the export script:
- After adding new news articles via the CMS
- Before deploying to production
- As part of your build process (optional)

## Adding to Build Process (Optional)

To automatically update the fallback data during build, add this to your `package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/export-news-from-mysql.js",
    "build": "vite build"
  }
}
```

**Note**: Make sure MySQL/MariaDB is running and accessible during the build process.

## Benefits

- **Resilience**: Frontend works even when backend is down
- **Performance**: Faster initial load from cached JSON
- **User Experience**: No error messages for users when backend is unavailable
- **Development**: Continue frontend development without running the backend

## Limitations

- Fallback data is static and won't reflect real-time changes
- Images may not load if backend serving images is down
- Attachments won't be available in fallback mode
- Must manually run export script to update fallback data
