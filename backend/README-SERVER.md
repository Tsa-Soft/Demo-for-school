# Опростен Server.js за School CMS

## Какво е това?

`server.js` е опростена версия на backend сървъра, която използва само Express и MySQL без TypeScript и допълнителни сложности.

## Как да стартирам?

### 1. Инсталация (ако все още не е направена)

```bash
cd backend
npm install
```

Всички нужни пакети (express, mysql2, bcryptjs, cors, dotenv) вече са инсталирани.

### 2. Конфигурация на базата данни

Убедете се, че файлът `.env` в папката `backend` има правилните настройки:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=test
DB_USER=shrek
DB_PASSWORD=
PORT=3001
ALLOWED_ORIGINS=https://www.nukgsz.com,https://nukgsz.com,http://localhost:5173
```

### 3. Създаване на таблица за потребители

Изпълнете следната SQL заявка в MySQL:

```sql
USE test;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Стартиране на сървъра

```bash
npm run server
```

Или директно:

```bash
npx nodemon server.js
```

Сървърът ще стартира на `http://localhost:3001`

## API Endpoints

### Автентикация

#### Регистрация
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "test",
  "email": "test@example.com",
  "password": "password123"
}
```

#### Логин
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "test",
  "password": "password123"
}
```

### Други endpoints

- `GET /api/health` - Проверка дали сървърът работи
- `GET /api/users` - Списък с всички потребители (без пароли)
- `GET /api/content` - Съдържание от базата
- `GET /api/navigation/header-menu` - Навигационно меню
- `GET /api/pages` - Всички страници
- `GET /api/schoolstaff` - Списък с персонала
- `GET /api/translations?lang=bg` - Преводи

## Тестване с curl

```bash
# Health check
curl http://localhost:3001/api/health

# Регистрация
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass123"}'

# Логин
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass123"}'

# Списък потребители
curl http://localhost:3001/api/users
```

## Разлика между server.js и src/index.ts

| Характеристика | server.js | src/index.ts |
|----------------|-----------|--------------|
| Език | JavaScript (ES6) | TypeScript |
| Сложност | Прост | По-сложен |
| Функции | Основни CRUD | Пълен CMS |
| JWT Tokens | ❌ | ✅ |
| File Upload | ❌ | ✅ |
| Helmet Security | ❌ | ✅ |
| Използване | Обучение/тестване | Продукция |

## Кога да използвам server.js?

- За учебни цели и разбиране на основите
- За бързо тестване на API endpoints
- Когато не ви трябват сложни функции като JWT, file upload и др.

## Кога да използвам src/index.ts?

- За продукция и реалното училищно приложение
- Когато ви трябват всички CMS функции
- За по-добра сигурност и производителност

## Често срещани проблеми

### Порт 3001 е зает
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F

# Linux/Mac
lsof -i :3001
kill -9 [PID_NUMBER]
```

### Не мога да се свържа към MySQL
- Проверете дали MySQL сървърът работи
- Проверете потребителско име и парола в `.env`
- Уверете се, че базата данни `test` съществува

### CORS грешки
- Добавете вашия домейн в `ALLOWED_ORIGINS` в `.env`
- Или променете директно в `server.js`

## Преминаване към TypeScript версията

Когато сте готови да използвате пълната TypeScript версия:

```bash
npm run dev    # Стартира src/index.ts с TypeScript
npm run build  # Компилира TypeScript в dist/
npm start      # Стартира компилирания код
```
