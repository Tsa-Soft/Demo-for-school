#!/usr/bin/env node

/**
 * Export News Fallback Data from MySQL Script
 *
 * This script reads news from the MySQL database and exports it to a JSON file
 * that can be used as fallback data when the backend is unavailable.
 *
 * Usage: node scripts/export-news-from-mysql.js
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const OUTPUT_PATH = path.join(__dirname, '../src/data/newsDbFallback.json');

async function exportNews() {
  let connection;

  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'school_cms',
      charset: 'utf8mb4'
    });

    console.log('Connected to MySQL database.');

    // Query published news
    const [rows] = await connection.execute(
      'SELECT * FROM news WHERE is_published = 1 ORDER BY published_date DESC'
    );

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
    console.log(`Total articles: ${rows.length}`);
    console.log(`Featured articles: ${rows.filter(n => n.is_featured).length}`);

    return formattedData;
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed.');
    }
  }
}

// Run the export
exportNews()
  .then(() => {
    console.log('Export completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
