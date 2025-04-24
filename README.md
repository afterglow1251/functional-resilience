# 📦 functional-resilience

A library designed to improve the resilience of Node.js/NestJS applications. It includes modules for logging, exception handling, system monitoring, and a set of utilities for health-checking various data sources and services.

---

## 🧩 Modules

- **`LoggerRequestModule`** – Logs incoming HTTP requests.
- **`LoggerExceptionFilterModule`** – Several exception filters with integrated logging.
- **`SystemMonitoringModule`** – Periodic system resource monitoring (CPU, memory, disk, etc.).

---

## 🛠 Utilities

This package also provides utilities for **health checks** of:

- Databases (SQL/NoSQL)
- ORM/ODM connections (e.g., TypeORM, Mongoose)
- External APIs
- Internal services

---

## ✨ Decorators

The library also includes powerful decorators to enhance fault tolerance:

- `@Fallback()` – Define fallback logic for failed method executions.
- `@CircuitBreaker()` – Protect services from cascading failures.
- `@Retry()` – Automatically retry failed method calls with custom strategies.

---

## 📦 Required Dependencies

The following packages are **required** to use the core functionality:

```bash
npm install pino pino-pretty pino-roll
```

---

## 🔁 Optional Dependencies

Depending on the features you want to use, you may need to install the following additional packages:

- **To use `TraceMiddleware`**:

  ```bash
  npm install @nestjs/cls
  ```

- **To use `SystemMonitoringModule`**:
  ```bash
  npm install systeminformation node-cron lowdb
  ```
