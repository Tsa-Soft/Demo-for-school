import mysql from 'mysql2/promise';

export let db: mysql.Connection;

export const connectDatabase = async (): Promise<void> => {
  try {
    console.log('🔌 Attempting to connect to database...');
    console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
    console.log('DB_NAME:', process.env.DB_NAME || 'school_cms');
    console.log('DB_USER:', process.env.DB_USER || 'root');

    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'school_cms',
      charset: 'utf8mb4',
      timezone: 'Z'
    });

    console.log('✅ Database connection established successfully');

    // Test the connection
    await db.execute('SELECT 1');
    console.log('✅ Database connection test successful');

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};
