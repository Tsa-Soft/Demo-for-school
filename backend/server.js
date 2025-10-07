/**
 * Production-ready Express backend за SuperHosting/Passenger.
 * Поддържани маршрути (както при стария фронт):
 *  - GET  /health
 *  - POST /login                 { username, password }
 *  - POST /register              { username, email, password }
 *  - GET  /translations?lang=bg
 *  - GET  /content
 *  - GET  /pages
 *  - GET  /navigation/header-menu
 *  - GET  /schoolstaff
 *  - GET  /images/:key           (взема от БД или от uploads/)
 *
 * Заб.: Може да се монтира под BASE_PATH (напр. /api). По подразбиране е "".
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
// за стабилност на shared hosting – pure JS bcrypt:
const bcrypt = require('bcryptjs');

const app = express();

// ------------ Конфигурация от .env ------------
const NODE_ENV    = process.env.NODE_ENV || 'production';
const PORT        = process.env.PORT || 3000; // Passenger подава PORT
const BASE_PATH   = (process.env.BASE_PATH || '').replace(/\/+$/,''); // напр. "/api" или ""
const UPLOAD_PATH = process.env.UPLOAD_PATH || path.join(__dirname, 'uploads');

const DB_HOST     = process.env.DB_HOST || '127.0.0.1';
const DB_NAME     = process.env.DB_NAME || 'nukgszco_3ou_Cms';
const DB_USER     = process.env.DB_USER || 'nukgszco';
const DB_PASSWORD = process.env.DB_PASSWORD || 'nukgszco';

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
);

// ------------ Middleware ------------
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // позволи curl/health/cron
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error('CORS blocked: ' + origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
}));
app.use((req,res,next)=>{ res.setHeader('Vary','Origin'); next(); });

// ------------ DB Pool ------------
let pool;
(async () => {
  pool = await mysql.createPool({
    host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
    waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    // charset: 'utf8mb4_unicode_ci' // при нужда
  });
  console.log(`[DB] Pool ready: ${DB_HOST} / ${DB_NAME}`);
})().catch(err => {
  console.error('[DB] init error:', err);
  process.exit(1);
});

// ------------ Помощни функции ------------
function routePath(p) {
  // за да работи еднакво при BASE_PATH="" и BASE_PATH="/api"
  return `${BASE_PATH}${p}`;
}

function jsonInput(req) {
  return typeof req.body === 'object' && req.body ? req.body : {};
}

// безопасно връщане на файл
function safeSendFile(res, absPath) {
  if (!absPath.startsWith(UPLOAD_PATH)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  fs.access(absPath, fs.constants.R_OK, (err) => {
    if (err) return res.status(404).json({ error: 'Not found' });
    res.sendFile(absPath);
  });
}

// ------------ Health ------------
app.get(routePath('/health'), (req, res) => {
  res.json({
    status: 'ok',
    env: NODE_ENV,
    node: process.versions.node,
    time: new Date().toISOString(),
    basePath: BASE_PATH || '/',
  });
});

// ------------ Auth ------------
app.post(routePath('/register'), async (req, res) => {
  const { username, email, password } = jsonInput(req);
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Всички полета са задължителни!' });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    const sql = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, COALESCE(?, "user"))';
    const params = [username, email, hash, null];
    const conn = await pool.getConnection();
    try {
      await conn.execute(sql, params);
    } finally { conn.release(); }
    return res.status(201).json({ message: 'Регистрацията е успешна!' });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Потребителското име или email вече съществува!' });
    }
    console.error('[REGISTER]', err);
    return res.status(500).json({ message: 'Грешка при регистрация!' });
  }
});

app.post(routePath('/login'), async (req, res) => {
  const { username, password } = jsonInput(req);
  if (!username || !password) {
    return res.status(400).json({ message: 'Всички полета са задължителни!' });
  }
  try {
    const conn = await pool.getConnection();
    let rows;
    try {
      [rows] = await conn.execute(
        'SELECT id, username, email, password_hash, role FROM users WHERE username = ? LIMIT 1',
        [username]
      );
    } finally { conn.release(); }
    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: 'Грешно потребителско име или парола!' });
    }
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Грешно потребителско име или парола!' });
    }
    // Ако ползвате JWT, тук издайте токен. Засега връщаме базова информация:
    return res.status(200).json({ message: 'Успешен вход!', username: user.username, role: user.role || null });
  } catch (err) {
    console.error('[LOGIN]', err);
    return res.status(500).json({ message: 'Грешка при заявка!' });
  }
});

// ------------ Бизнес маршрути, съвместими с фронта ------------
// 1) Преводи
app.get(routePath('/translations'), async (req, res) => {
  const lang = (req.query.lang || 'bg').toString();
  try {
    // Очаквана таблица: translations(lang, `key`, `value`)
    const conn = await pool.getConnection();
    let rows;
    try {
      [rows] = await conn.execute(
        'SELECT `key`, `value` FROM translations WHERE lang = ?',
        [lang]
      );
    } finally { conn.release(); }
    const dict = {};
    for (const r of rows) dict[r.key] = r.value;
    return res.json(dict);
  } catch (err) {
    console.error('[translations]', err);
    return res.status(500).json({});
  }
});

// 2) Content (key-value)
app.get(routePath('/content'), async (req, res) => {
  try {
    // Очаквана таблица: content(`key`, `value`)
    const conn = await pool.getConnection();
    let rows;
    try {
      [rows] = await conn.execute('SELECT `key`, `value` FROM content');
    } finally { conn.release(); }
    const dict = {};
    for (const r of rows) dict[r.key] = r.value;
    return res.json(dict);
  } catch (err) {
    console.error('[content]', err);
    return res.status(500).json({});
  }
});

// 3) Pages
app.get(routePath('/pages'), async (req, res) => {
  try {
    // Очаквана таблица: pages(id, slug, title, excerpt, body, published, order_index, updated_at)
    const conn = await pool.getConnection();
    let rows;
    try {
      [rows] = await conn.execute(
        'SELECT id, slug, title, excerpt, body, updated_at FROM pages WHERE published = 1 ORDER BY COALESCE(order_index, id) ASC'
      );
    } finally { conn.release(); }
    return res.json(rows);
  } catch (err) {
    console.error('[pages]', err);
    return res.status(500).json([]);
  }
});

// 4) Header navigation
app.get(routePath('/navigation/header-menu'), async (req, res) => {
  try {
    // Очаквана таблица: navigation(id, location, label, url, order_index, enabled)
    const conn = await pool.getConnection();
    let rows;
    try {
      [rows] = await conn.execute(
        'SELECT label, url FROM navigation WHERE location = "header" AND COALESCE(enabled,1)=1 ORDER BY COALESCE(order_index,id) ASC'
      );
    } finally { conn.release(); }
    return res.json(rows);
  } catch (err) {
    console.error('[navigation/header-menu]', err);
    return res.status(500).json([]);
  }
});

// 5) School staff
app.get(routePath('/schoolstaff'), async (req, res) => {
  try {
    // Очаквана таблица: school_staff(id, name, position, phone, email, photo) (photo = filename или URL)
    const conn = await pool.getConnection();
    let rows;
    try {
      [rows] = await conn.execute(
        'SELECT id, name, position, phone, email, photo FROM school_staff ORDER BY COALESCE(sort_order,id) ASC'
      );
    } finally { conn.release(); }
    return res.json(rows);
  } catch (err) {
    console.error('[schoolstaff]', err);
    return res.status(500).json([]);
  }
});

// 6) Images by key
app.get(routePath('/images/:key'), async (req, res) => {
  const key = (req.params.key || '').toString();
  if (!key) return res.status(400).json({ error: 'Missing key' });

  try {
    const conn = await pool.getConnection();
    let rows;
    try {
      // Очаквана таблица: images(`key`, path)  (path = относителен файл в uploads/)
      [rows] = await conn.execute('SELECT `path` FROM images WHERE `key` = ? LIMIT 1', [key]);
    } finally { conn.release(); }

    let candidate;
    if (rows && rows.length && rows[0].path) {
      candidate = path.resolve(UPLOAD_PATH, rows[0].path);
    } else {
      // fallback: директни файлове по популярни разширения
      const tryExt = ['.jpg','.jpeg','.png','.webp','.gif'];
      for (const ext of tryExt) {
        const p = path.resolve(UPLOAD_PATH, key + ext);
        if (fs.existsSync(p)) { candidate = p; break; }
      }
    }

    if (!candidate) return res.status(404).json({ error: 'Image not found' });
    return safeSendFile(res, candidate);
  } catch (err) {
    console.error('[images]', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// ------------ Глобален error handler ------------
app.use((err, req, res, next) => {
  console.error('[UNCAUGHT]', err?.stack || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ------------ Старт ------------
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT} (NODE_ENV=${NODE_ENV}, BASE_PATH="${BASE_PATH || '/'}")`);
});