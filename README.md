# Production URL Shortener API

A production-ready backend for a URL shortener, built with Node.js, Express, MongoDB, and Redis.

## Features & Architecture

*   **Caching Strategy (Redis)**: 
    *   **Redirects (`/:shortCode`)**: Uses a Cache-Aside pattern. On a cache miss, MongoDB is queried, and the URL is cached with a 24-hour TTL (`86400s`) for subsequent instant lookups.
    *   **Analytics (`/api/url/stats/:shortCode`)**: Cached with a short TTL (1 minute) to support realtime dashboards while shielding the DB from sudden traffic spikes.
*   **Short Code Generation**: 
    *   Uses a centralized **atomic Redis `INCR`** counter initialized at `10,000`. 
    *   The base-10 counter is deterministically converted into a highly compact **Base62 string** (`0-9a-zA-Z`), virtually eliminating collision checks while avoiding heavy entropy generators like `nanoid`.
*   **Asynchronous Analytics**: 
    *   Redirect logic (`processRedirect`) resolves and redirects the user immediately. 
    *   Click recording (capturing IP, Referer, User-Agent) is offloaded to the background via `setImmediate()`, ensuring redirect latency remains under sub-millisecond ranges on cache hits.
*   **MongoDB Architecture**: 
    *   Normalized collections for `Urls` and `Clicks`.
    *   The `Url` schema features a **TTL Index** on `expiresAt` so Mongo automatically purges expired links without cron jobs.
*   **Security & Input Validation**: 
    *   Requests are deeply validated using `validator.js`, actively blocking `localhost`, private networks, and protocols like `javascript:` / `data:` to prevent XSS payloads payload routing.
    *   `Helmet` provides HTTP header hardening.
    *   Custom `customAlias` endpoints filter out reserved system words (e.g. `api`, `admin`).
    *   IP-based rate limits backed by Redis (`10/minute` for creation, `100/minute` for redirects).

## Docker Setup

Spin up the entire stack using Docker Compose:

```bash
docker compose up -d --build
```

This starts:
1. `url_shortener_backend` (Port 5000)
2. `url_shortener_mongodb` (Port 27017)
3. `url_shortener_redis` (Port 6379)

## API Endpoints

*   **`POST /api/url/shorten`**: Create short URL
*   **`GET /:shortCode`**: Redirect
*   **`GET /api/url/stats/:shortCode`**: Analytics retrieval
*   **`PATCH /api/url/:shortCode`**: Update Custom Alias / Expiry
*   **`DELETE /api/url/:shortCode`**: Delete URL

## Testing

Jest and Supertest are configured to spin up module endpoints and evaluate Redis rate limiters.

```bash
npm install
npm test
```
