#!/usr/bin/env node

/**
 * Export News Fallback Data Script
 *
 * This script reads news from the SQLite database and exports it to a JSON file
 * that can be used as fallback data when the backend is unavailable.
 *
 * Usage: node scripts/export-news-fallback.js
 */

import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../backend/database/cms.db');
const OUTPUT_PATH = path.join(__dirname, '../src/data/newsDbFallback.json');

function exportNews() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to the database.');
    });

    db.all('SELECT * FROM news WHERE is_published = 1 ORDER BY published_date DESC', [], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err.message);
        reject(err);
        return;
      }

      // Format the data for frontend consumption
      const formattedData = {
        lastUpdated: new Date().toISOString(),
        news: rows.map(row => ({
          id: row.id,
          title_bg: row.title_bg,
          title_en: row.title_en,
          excerpt_bg: row.excerpt_bg,
          excerpt_en: row.excerpt_en,
          content_bg: row.content_bg,
          content_en: row.content_en,
          featured_image_url: row.featured_image_url,
          featured_image_alt: row.featured_image_alt,
          is_published: Boolean(row.is_published),
          is_featured: Boolean(row.is_featured),
          published_date: row.published_date,
          created_at: row.created_at,
          updated_at: row.updated_at
        }))
      };

      // Ensure the directory exists
      const outputDir = path.dirname(OUTPUT_PATH);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write the JSON file
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(formattedData, null, 2), 'utf8');

      console.log(`Successfully exported ${rows.length} news articles to ${OUTPUT_PATH}`);

      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        }
        resolve(formattedData);
      });
    });
  });
}

// Run the export
exportNews()
  .then((data) => {
    console.log('Export completed successfully!');
    console.log(`Total articles: ${data.news.length}`);
    console.log(`Featured articles: ${data.news.filter(n => n.is_featured).length}`);
  })
  .catch((error) => {
    console.error('Export failed:', error);
    process.exit(1);
  });
