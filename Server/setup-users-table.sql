-- SQL заявка за създаване на таблица за потребители
-- Използвайте тази заявка в MySQL Workbench или phpMyAdmin

-- Изберете базата данни
USE test;

-- Създаване на таблица users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Проверка дали таблицата е създадена успешно
SHOW TABLES LIKE 'users';

-- Покажи структурата на таблицата
DESCRIBE users;
