# 🚀 Backend Setup Guide

## ✅ Проблеми виправлено!

Всі конфігураційні проблеми були виправлені:
- ✅ Prisma schema переміщено в стандартне місце
- ✅ Створено .env файл з правильними налаштуваннями
- ✅ Оновлено package.json для seed скрипта
- ✅ Seed файл переміщено в правильну директорію

---

## 📋 Передумови

Перед запуском переконайся, що:
1. ✅ Node.js 20.x встановлено
2. ✅ Docker Desktop встановлено
3. ⚠️ **Docker Desktop запущено** (це критично!)

---

## 🐳 Крок 1: Запустити Docker Desktop

**ВАЖЛИВО:** Docker Desktop має бути запущений перед виконанням наступних команд!

### Windows:
1. Натисни **Start Menu**
2. Знайди **Docker Desktop**
3. Запусти програму
4. Зачекай поки Docker повністю завантажиться (іконка в system tray стане зеленою)

### Перевірка:
```bash
docker ps
```
Якщо бачиш таблицю (навіть порожню) - Docker працює! ✅

---

## 🗄️ Крок 2: Запустити PostgreSQL

З **root директорії проекту**:

```bash
cd "D:\Projects for git\Modern-Ecommerce-Dashboard"
docker-compose up -d postgres
```

Очікуваний результат:
```
✔ Container ecommerce-postgres  Started
```

### Перевірка:
```bash
docker ps
```
Має бути контейнер `ecommerce-postgres` зі статусом `Up`

---

## 🔧 Крок 3: Налаштувати Prisma

Перейди в backend директорію:
```bash
cd apps/backend
```

### 3.1 Згенерувати Prisma Client:
```bash
npx prisma generate
```

Очікуваний результат:
```
✔ Generated Prisma Client
```

### 3.2 Створити базу даних та таблиці:
```bash
npx prisma migrate dev --name init
```

Очікуваний результат:
```
✔ Database created
✔ Migration applied
```

### 3.3 Заповнити базу тестовими даними:
```bash
npx prisma db seed
```

Очікуваний результат:
```
🌱 Starting database seed...
✅ Admin user created: admin@ecommerce.com
✅ Categories created
✅ Products created
🎉 Database seed completed!
```

---

## 🚀 Крок 4: Запустити Backend Server

```bash
npm run dev
```

Очікуваний результат:
```
🚀 Server running on port 5000
📝 Environment: development
🔗 API: http://localhost:5000/api/v1
```

### Перевірка:
Відкрий новий термінал і виконай:
```bash
curl http://localhost:5000/health
```

Очікувана відповідь:
```json
{"status":"ok","timestamp":"...","uptime":...}
```

---

## 🎨 Крок 5: Запустити Frontend

Відкрий **новий термінал** і виконай:

```bash
cd "D:\Projects for git\Modern-Ecommerce-Dashboard\apps\frontend"
npm run dev
```

Очікуваний результат:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

---

## 🌐 Крок 6: Відкрити додаток

Відкрий браузер і перейди на:
```
http://localhost:3000
```

### Тестові дані для входу:
```
Email: admin@ecommerce.com
Password: Admin@123
```

---

## 🛠️ Корисні команди

### Prisma:
```bash
# Відкрити Prisma Studio (GUI для бази даних)
npx prisma studio

# Перегенерувати Prisma Client після зміни schema
npx prisma generate

# Створити нову міграцію
npx prisma migrate dev --name your_migration_name

# Скинути базу даних (ОБЕРЕЖНО!)
npx prisma migrate reset
```

### Docker:
```bash
# Переглянути запущені контейнери
docker ps

# Переглянути логи PostgreSQL
docker logs ecommerce-postgres

# Зупинити PostgreSQL
docker-compose down

# Перезапустити PostgreSQL
docker-compose restart postgres
```

### Backend:
```bash
# Запустити в dev режимі
npm run dev

# Зібрати для production
npm run build

# Запустити production build
npm start

# Lint код
npm run lint
```

---

## ❌ Troubleshooting

### Проблема: "Cannot find module '@prisma/client'"
**Рішення:**
```bash
npx prisma generate
```

### Проблема: "Docker daemon not running"
**Рішення:**
1. Запусти Docker Desktop
2. Зачекай 30-60 секунд
3. Перевір: `docker ps`

### Проблема: "Port 5000 already in use"
**Рішення:**
1. Знайди процес: `netstat -ano | findstr :5000`
2. Вбий процес: `taskkill /PID <PID> /F`
3. Або зміни PORT в `.env` файлі

### Проблема: "Database connection error"
**Рішення:**
1. Перевір чи запущений PostgreSQL: `docker ps`
2. Перевір DATABASE_URL в `.env`
3. Перезапусти контейнер: `docker-compose restart postgres`

### Проблема: "Migration failed"
**Рішення:**
```bash
# Скинути базу та почати заново
npx prisma migrate reset
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 📊 Структура файлів

```
apps/backend/
├── prisma/
│   ├── schema.prisma      # ✅ Prisma schema (переміщено сюди)
│   └── seed.ts            # ✅ Seed файл (переміщено сюди)
├── src/
│   ├── modules/           # Feature modules
│   ├── common/            # Utilities & middleware
│   ├── config/            # Configuration
│   └── main.ts            # Entry point
├── .env                   # ✅ Environment variables (створено)
├── package.json           # ✅ Оновлено з prisma.seed
└── tsconfig.json
```

---

## ✅ Checklist для успішного запуску

- [ ] Docker Desktop запущено
- [ ] PostgreSQL контейнер працює (`docker ps`)
- [ ] `.env` файл існує в `apps/backend/`
- [ ] Prisma Client згенеровано (`npx prisma generate`)
- [ ] Міграції виконано (`npx prisma migrate dev`)
- [ ] База заповнена даними (`npx prisma db seed`)
- [ ] Backend сервер запущено (`npm run dev`)
- [ ] Frontend запущено (`npm run dev`)
- [ ] Можу відкрити http://localhost:3000
- [ ] Можу залогінитись з admin@ecommerce.com

---

## 🎉 Готово!

Якщо всі кроки виконано успішно, твій Modern E-Commerce Dashboard працює!

**Наступні кроки:**
- Досліджуй API endpoints
- Додавай нові features
- Кастомізуй UI
- Деплой на production

---

**Потрібна допомога?** Перевір секцію Troubleshooting вище або створи issue на GitHub.
