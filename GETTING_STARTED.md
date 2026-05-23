# 🚀 Quick Start Guide

## Базова структура проекту створена!

Проект **Modern E-Commerce Dashboard** успішно ініціалізовано у вашій теці.

---

## 📋 Що вже готово:

### ✅ Backend (Node.js + Express + TypeScript + Prisma)
- Базова структура API
- Prisma schema з усіма моделями
- Auth модуль (JWT authentication)
- Middleware (auth, error handling, rate limiting)
- Utilities (hashing, tokens, logging)
- Database seed файл

### ✅ Frontend (React + TypeScript + Vite + TailwindCSS)
- Базова структура додатку
- Router setup
- Zustand store для auth
- React Query configuration
- TailwindCSS + базові стилі

### ✅ DevOps
- Docker configuration
- Docker Compose (dev & prod)
- Nginx configuration
- GitHub Actions CI/CD
- Environment examples

---

## 🛠️ Наступні кроки для запуску:

### 1️⃣ Встановити залежності

```bash
# Root dependencies
npm install

# Backend dependencies
cd apps/backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2️⃣ Налаштувати environment variables

**Backend:**
```bash
cd apps/backend
copy .env.example .env
# Відредагуй .env файл з твоїми налаштуваннями
```

**Frontend:**
```bash
cd apps/frontend
copy .env.example .env
```

### 3️⃣ Запустити PostgreSQL

**Варіант A: Docker (рекомендовано)**
```bash
# З root директорії
docker-compose up -d postgres
```

**Варіант B: Локальна установка**
- Встанови PostgreSQL 16
- Створи базу даних `ecommerce_dev`

### 4️⃣ Запустити Prisma migrations

```bash
cd apps/backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 5️⃣ Запустити проект

**Варіант A: Окремо backend і frontend**
```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

**Варіант B: Одночасно (з root директорії)**
```bash
npm run dev
```

**Варіант C: Docker (повний стек)**
```bash
docker-compose up -d
```

---

## 🌐 Доступ до додатку:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api/v1
- **Health Check:** http://localhost:5001/health

---

## 🔑 Тестові дані для входу:

```
Email: admin@ecommerce.com
Password: Admin@123
```

---

## 📦 Корисні команди:

```bash
# Prisma Studio (GUI для бази даних)
cd apps/backend
npm run prisma:studio

# Перегенерувати Prisma Client
npm run prisma:generate

# Створити нову міграцію
npm run prisma:migrate

# Запустити seed знову
npm run prisma:seed

# Build для production
npm run build

# Lint
npm run lint

# Type check (frontend)
cd apps/frontend
npm run type-check
```

---

## 🐳 Docker команди:

```bash
# Запустити все
docker-compose up -d

# Зупинити все
docker-compose down

# Переглянути логи
docker-compose logs -f

# Перебудувати контейнери
docker-compose up -d --build

# Production
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📁 Структура проекту:

```
Modern-Ecommerce-Dashboard/
├── apps/
│   ├── backend/              # Node.js API
│   │   ├── src/
│   │   │   ├── modules/      # Auth, Products, Orders, etc.
│   │   │   ├── common/       # Middleware, Utils
│   │   │   ├── config/       # Configuration
│   │   │   ├── database/     # Prisma schema
│   │   │   └── main.ts       # Entry point
│   │   └── package.json
│   │
│   └── frontend/             # React app
│       ├── src/
│       │   ├── features/     # Feature modules
│       │   ├── shared/       # Shared components
│       │   ├── store/        # Zustand stores
│       │   ├── router/       # React Router
│       │   └── App.tsx
│       └── package.json
│
├── docker/                   # Docker configs
├── .github/workflows/        # CI/CD
├── docker-compose.yml
└── package.json
```

---

## ⚠️ Важливо:

1. **Базова структура готова**, але деякі модулі (Products, Orders, Analytics) мають тільки заглушки
2. Потрібно **дореалізувати повний функціонал** для кожного модуля
3. **Frontend компоненти** потрібно створити (UI components, pages, forms)
4. Всі **основні файли конфігурації** вже на місці

---

## 🎯 Що потрібно дореалізувати:

### Backend:
- [ ] Повна реалізація Products CRUD
- [ ] Повна реалізація Orders module
- [ ] Analytics service з реальними даними
- [ ] Users management
- [ ] Categories management
- [ ] File upload для зображень

### Frontend:
- [ ] UI Components (Button, Card, Input, etc.)
- [ ] Dashboard page з charts
- [ ] Products management page
- [ ] Orders page
- [ ] Login/Register forms
- [ ] Layout components (Sidebar, Header)

---

## 📚 Документація:

- **Prisma:** https://www.prisma.io/docs
- **React Query:** https://tanstack.com/query/latest
- **Zustand:** https://zustand-demo.pmnd.rs/
- **TailwindCSS:** https://tailwindcss.com/docs
- **Shadcn/ui:** https://ui.shadcn.com/

---

## 🆘 Troubleshooting:

**Проблема:** Prisma не може підключитися до бази
```bash
# Перевір чи запущений PostgreSQL
docker-compose ps

# Перевір DATABASE_URL в .env
```

**Проблема:** Port вже зайнятий
```bash
# Зміни PORT в .env файлах
# Backend: PORT=5001
# Frontend: vite.config.ts -> server.port
```

**Проблема:** Module not found
```bash
# Видали node_modules та перевстанови
rm -rf node_modules
npm install
```

---

## 🎉 Готово!

Тепер у тебе є **production-ready структура** для e-commerce dashboard.

Наступний крок — **встановити залежності та запустити проект**! 🚀

---

**Створено:** 2026-05-23
**Версія:** 1.0.0
