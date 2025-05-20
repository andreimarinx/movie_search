# 🎬 Movie Search App

A full-stack app to search movies via the OMDb API, using server-side caching, rate limiting, and a Vue 3 frontend.

---

## 🧱 Stack

- **Frontend**: Vue 3 + Vite + Axios
- **Backend**: Express.js + Redis
- **API**: OMDb API
- **Dockerized**: Full dev stack with Docker Compose

---

## 🚀 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/andreimarinx/movie_search.git
cd movie_search
```

### 2. Setup Environment

Create a `.env` file in the root:

```env
OMDB_API_KEY=your-omdb-key
API_KEY=your-internal-api-key
PORT=3000
REDIS_URL=redis://redis:6379
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-internal-api-key
```
Also create `server/.env`:

```env
OMDB_API_KEY=your-omdb-key
PORT=3000
REDIS_URL=redis://localhost:6379
API_KEY=our-internal-api-key
```
### 3. Run locally

#### Backend:

```bash
cd server
npm install
npm run devStart
```

#### Frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Access:  
- Frontend: [http://localhost:5173](http://localhost:5173)  
- Backend: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🐳 Run with Docker Compose

```bash
docker-compose up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)  
- Backend: [http://localhost:3000/search?title=batman](http://localhost:3000/search?title=batman)

Replace localhost with server public ip
```bash
find . -type f -exec perl -pi -e 's/localhost/SERVER_PUBLIC_IP/g' {} +
```

---

## 🔒 API Security

The `/search` endpoint is protected with an `x-api-key` header. Set this in `.env` as `API_KEY`.

---

## 🩺 Health Check

```http
GET /api/health
```

Returns `{ status: "ok", timestamp: <ms> }`

---

## 📦 Deployment

This project is production-ready with Nginx for frontend and Docker Compose orchestration.

---

## 📄 License

MIT
