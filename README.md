# Media Scraper Platform

## Introduction

Media Scraper Platform is a full-stack web application designed to **scrape, store, and display image and video media URLs from multiple web pages at scale**.

The system exposes a backend API that accepts an array of web URLs, scrapes image and video sources from each page, persists the extracted data into a SQL database, and provides a paginated and searchable interface to view the collected media.

The platform is built with **Node.js**, **React.js**, and **PostgreSQL**, fully **Dockerized**, and optimized to handle **high-concurrency scraping workloads (~5000 requests concurrently)** on resource-constrained environments.

---

## Features

- Accepts multiple web URLs in a single API request
- Scrapes:
  - Image URLs (`<img>`, background images)
  - Video URLs (`<video>`, `<source>`, embedded media)
- Stores structured scraping data in PostgreSQL
- Paginated and searchable media listing
- Filter media by type (Image / Video)
- Fully Dockerized (Backend, Frontend, Database)
- Load testing for high concurrency scraping
- Simple and responsive UI

---

## Tech Stack

- React.js
- Node.js
- Postgres
- Docker

## Database Structure

```text
+----------------------+
|     scrape_jobs      |
+----------------------+
| id (UUIDv7, PK)      |
| status               |
| created_at           |
+----------+-----------+
           |
           | 1
           |
           | N
+----------v-----------+
|      web_pages       |
+----------------------+
| id (UUIDv7, PK)      |
| scrape_job_id (FK)   |
| title                |
| url                  |
| created_at           |
+----------+-----------+
           |
           | 1
           |
           | N
+----------v-----------+
|     media_assets     |
+----------------------+
| id (UUIDv7, PK)      |
| web_page_id (FK)     |
| title                |
| type (IMAGE/VIDEO)   |
| media_url            |
| created_at           |
+----------------------+

```

## Repository Structure (Expected)

```text
media-scraper/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── workers/
│   │   ├── routes/
│   │   ├── entities/
│   │   ├── config/
│   │   └── app.ts
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Docker and Docker Compose
- PostgreSQL (or use the provided Docker container)

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

The service needs environment variables to connect to the database. When running with Docker Compose, these are provided in the docker-compose.yml file. For local development, you may need to create a `.env` file with:

```
# Service Configuration
PORT=3000 -- Specify the port the backend service will run on

# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=postgres
```

### Running the Service

```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

## Database Migrations

The app service uses TypeORM for the ORM and database migrations.

### Migration layout

- Entities live under `src/**/entities/*.entity.ts`
- Migrations live under `src/migrations/*.ts`
- Compiled JS goes to `dist/**` (TypeORM CLI runs against compiled JS)

### Apply Migrations

To apply existing migrations to your database:

```bash
# Apply pending migrations to the database
npm run migration:run
```

To revert the last applied migration:

```bash
npm run migration:revert
```
