// Импортване на необходимите модули
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Импортване на вашите модулни рутери
import authRouter from './routes/auth';
import pagesRouter from './routes/pages';
import contentRouter from './routes/content';
import staffRouter from './routes/staff';
import schoolStaffRouter from './routes/schoolstaff';
import newsRouter from './routes/news';
import eventsRouter from './routes/events';
import patronRouter from './routes/patron';
import usefulLinksRouter from './routes/useful-links';
import uploadRouter from './routes/upload';
import imagesRouter from './routes/images';
import navigationRouter from './routes/navigation';
import achievementsRouter from './routes/achievements';
import directorsRouter from './routes/directors';
import translationsRouter from './routes/translations';
import healthRouter from './routes/health';

// Зареждане на променливите от .env файла в process.env
dotenv.config();

// ------------ Конфигурация от .env ------------
const PORT = process.env.PORT || 3001;
const BASE_PATH = (process.env.BASE_PATH || '/api').replace(/\/+$/, '');
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://nukgsz.com,https://www.nukgsz.com')
  .split(',')
  .map(s => s.trim());

console.log('🔧 Server Configuration:');
console.log('PORT:', PORT);
console.log('BASE_PATH:', BASE_PATH);
console.log('ALLOWED_ORIGINS:', ALLOWED_ORIGINS);

// Създаване на Express приложението
const app: Express = express();

// ------------ Middleware (посредници) ------------
// За обработка на JSON заявки
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Настройка на CORS (Cross-Origin Resource Sharing) за сигурност
app.use(cors({
  origin: (origin, callback) => {
    // Позволява заявки от разрешените домейни или ако няма origin (напр. от Postman)
    console.log('🌐 CORS request from origin:', origin);
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('⚠️ CORS blocked origin:', origin);
      callback(null, true); // Still allow but log warning for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
}));

// Handle preflight requests
app.options('*', cors());

// Serve static files from Pictures directory
app.use('/Pictures', express.static(path.join(__dirname, '../../Pictures')));
app.use('/Documents', express.static(path.join(__dirname, '../../Documents')));
app.use('/Presentations', express.static(path.join(__dirname, '../../Presentations')));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ------------ Регистриране на рутерите ------------
app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}/pages`, pagesRouter);
app.use(`${BASE_PATH}/content`, contentRouter);
app.use(`${BASE_PATH}/staff`, staffRouter);
app.use(`${BASE_PATH}/schoolstaff`, schoolStaffRouter);
app.use(`${BASE_PATH}/news`, newsRouter);
app.use(`${BASE_PATH}/events`, eventsRouter);
app.use(`${BASE_PATH}/patron`, patronRouter);
app.use(`${BASE_PATH}/useful-links`, usefulLinksRouter);
app.use(`${BASE_PATH}/upload`, uploadRouter);
app.use(`${BASE_PATH}/images`, imagesRouter);
app.use(`${BASE_PATH}/navigation`, navigationRouter);
app.use(`${BASE_PATH}/achievements`, achievementsRouter);
app.use(`${BASE_PATH}/directors`, directorsRouter);
app.use(`${BASE_PATH}/translations`, translationsRouter);
app.use(`${BASE_PATH}/health`, healthRouter);

// Health check endpoint - за проверка дали сървърът работи
app.get(`${BASE_PATH}/`, (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'School CMS API is running',
    time: new Date().toISOString(),
    version: '2.0.0'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  console.log('❌ 404 Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// ------------ Глобален error handler ------------
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[GLOBAL ERROR HANDLER]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ------------ Старт на сървъра ------------
app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log(`🚀 Server started successfully on port ${PORT}`);
  console.log(`🚀 API available at: http://localhost:${PORT}${BASE_PATH}`);
  console.log(`🚀 Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
  console.log('🚀 ========================================');
});