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
| url                  |
| status               |
| error_message        |
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
