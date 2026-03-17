# 🔗 URL Shortener

A full-stack, production-ready URL shortener built with **React + Vite** on the frontend and **Node.js + Express + MongoDB + Redis** on the backend, fully containerized with **Docker**.

---

## 🚀 Features

### Frontend
- **URL Shortener Form** — Real-time validation, custom alias support, loading state
- **Result Card** — Copy-to-clipboard with checkmark animation
- **Recent Links** — Last 5 links persisted in `localStorage`
- **Analytics Dashboard** (`/stats/:shortCode`) — Clicks over time, referrers, device breakdown, date range filters
- **404 / Expired Page** — Custom error page with redirect CTA
- **Dark Mode** — Toggle with `localStorage` persistence
- **Toast Notifications** — `react-hot-toast` for all feedback
- **Responsive Design** — Mobile-first layout across all pages
- **Loading Skeletons** — Perceived performance during data fetch

### Backend
- **Base62 Short Code Generation** — Atomic Redis `INCR` counter → Base62 encode (no `nanoid`)
- **Redis Caching** — Redirects cached for 1 hour, analytics for 60 seconds
- **Async Analytics** — Click data logged via `setImmediate()` — never blocks redirects
- **URL Expiry** — MongoDB TTL index auto-deletes expired links; returns `410 Gone`
- **Input Validation** — Blocks `localhost`, private IPs, `javascript:` / `data:` protocols, reserved aliases
- **Rate Limiting** — Redis-backed (`express-rate-limit` + `rate-limit-redis`)
  - `/api/url/shorten` → 10 req/min per IP
  - `/:shortCode` → 100 req/min per IP
- **Security** — `helmet` HTTP headers, `cors` middleware
- **Centralized Error Handling** — Standard codes: `400`, `404`, `410`, `429`, `500`

---

## 🏗️ Architecture

```
URL-Shortener/
├── frontend/                  # React + Vite app
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx       # Shortener form
│       │   ├── Analytics.jsx  # Stats dashboard
│       │   └── NotFound.jsx   # 404 page
│       └── App.jsx            # Router + dark mode
│
├── backend/                   # Express API
│   ├── controllers/           # Route handlers
│   ├── routes/                # API and redirect routes
│   ├── services/              # Business logic (urlService.js)
│   ├── models/
│   │   ├── Url.js             # URL schema (shortCode, expiresAt, clickCount)
│   │   └── Click.js           # Analytics schema (ip, userAgent, referer)
│   ├── middlewares/
│   │   ├── rateLimiter.js     # Redis-backed rate limiting
│   │   └── errorHandler.js    # Centralized error middleware
│   ├── utils/
│   │   ├── base62.js          # Counter → Base62 encoder
│   │   └── validator.js       # URL and alias validation
│   ├── redis.js               # Redis client connection
│   ├── connect.js             # MongoDB connection
│   ├── index.js               # App entry point
│   ├── Dockerfile
│   └── tests/
│       └── url.test.js        # Jest + Supertest integration tests
│
└── docker-compose.yml         # Full stack orchestration
```

---

## ⚙️ Short Code Generation

```
Redis INCR (atomic counter) → Base62 encode → shortCode
```

- Counter starts at offset `10,000` to produce non-trivial codes from the start
- Base62 charset: `0-9a-zA-Z` (62 chars)
- Collision-free within a single shard; optional DB collision check on reset
- Example: counter `10,001` → `"2bJ"`

---

## 🗄️ Cache Strategy

| Route | Cache Key | TTL |
|-------|-----------|-----|
| `GET /:shortCode` | `url:<shortCode>` | 24 hours |
| `GET /api/url/stats/:shortCode` | `stats:<shortCode>` | 60 seconds |
| Rate limit counters | `rl:...` | Per window |

On every redirect:
1. Check Redis → cache hit? Redirect immediately + log click async
2. Cache miss → query MongoDB → cache result → redirect

---

## 📊 Analytics Design

Every click is logged asynchronously via `setImmediate()` into a `Click` document:

```
Click {
  shortCode, timestamp, ip, userAgent, referer, country
}
```

This ensures:
- Zero redirect latency from analytics writes
- Rich data for the dashboard: referrers, device types, click history

---

## 🐳 Docker Setup

```bash
docker compose up -d --build
```

Starts three containers on a shared bridge network:

| Service | Image | Port |
|---------|-------|------|
| `url_shortener_backend` | Node:20-alpine | 5000 |
| `url_shortener_mongodb` | mongo:latest | 27017 |
| `url_shortener_redis` | redis:alpine | 6379 |

---

## 🧪 Testing

```bash
cd backend
npm test
```

Test coverage (Jest + Supertest):

| Test | Expected |
|------|----------|
| `POST /api/url/shorten` valid URL | `201` |
| `POST /api/url/shorten` invalid URL | `400` |
| `GET /:shortCode` valid | `302` redirect |
| `GET /:shortCode` not found | `404` |
| Rate limit exceeded | `429` |

---

## 🔧 Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/short-url
REDIS_URL=redis://127.0.0.1:6379
BASE_URL=http://localhost:5000
```

> **Never commit `.env`** — see `.env.example` instead.

---

## 📡 API Reference

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/url/shorten` | Create a short URL |
| `GET` | `/:shortCode` | Redirect to original |
| `GET` | `/api/url/stats/:shortCode` | Get click analytics |
| `PATCH` | `/api/url/:shortCode` | Update alias or expiry |
| `DELETE` | `/api/url/:shortCode` | Delete a short URL |

---

## 🛠️ Running Locally

```bash
# Backend
cd backend
npm install
npm run dev       # nodemon on port 5000

# Frontend
cd frontend
npm install
npm run dev       # Vite on port 5173
```

Requires local MongoDB and Redis running, or use `docker compose up`.
