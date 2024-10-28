# 🚀 Project Starter Guide

This guide will help you get started with setting up and running your application. Let's dive in! 🎉

## 📦 Technologies Used

- **Bun** 🍞 - A fast JavaScript runtime.
- **NestJS** 🐱‍💻 - A progressive Node.js framework.
- **Redis** 🔥 - An in-memory data structure store.
- **Prisma** 📝 - A next-generation ORM.
- **PostgreSQL** 🐘 - A powerful, open-source object-relational database system.

---

## 📝 Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** 🍞 - [Installation Guide](https://bun.sh/docs/install)
- **Docker** 🐳 (Optional, but recommended for Redis and PostgreSQL)
- **Git** 🐙

---

## 🔧 Installation Steps

### 1. Clone the Repository 📥

### 2. Install Dependencies 📦

```bash
bun install
```

---

## 🐘 Setting Up PostgreSQL

You can set up PostgreSQL either locally or using Docker.

### Using Docker 🐳

```bash
docker run --name postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
```

---

## 🔥 Setting Up Redis

Similarly, set up Redis using Docker or install it locally.

### Using Docker 🐳

```bash
docker run --name redis -p 6379:6379 -d redis
```

---

## 📝 Setting Up Prisma

### 1. Configure Environment Variables 🌐

Create a `.env` file in the root directory:

```env
PORT=
JWT_SECRET=
DATABASE_URL=
REDIS_PASSWORD=
REDIS_PORT=
REDIS_HOST=
```

### 2. Generate Prisma Client 🚀

```bash
npx prisma generate
```

### 3. Run Database Migrations 📋

```bash
npx prisma migrate dev --name init
```

---

## 🚀 Running the Application

### Start the Server 🏃‍♂️

```bash
bun start:dev
```

Your application should now be running at `http://localhost:3000` 🌐

Swagger will be available on `http://localhost:3000/api`

---

## 🧪 Running Tests

Execute the test suite with:

```bash
bun run test
```

---

## 📚 Additional Scripts

- **Prisma Studio** (GUI for the database):

  ```bash
  npx prisma studio
  ```


