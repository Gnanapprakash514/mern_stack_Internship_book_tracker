# Render deployment notes

This repo includes `render.yaml` at the repo root to declare two services:

- Backend: `book-tracker-backend` (Node web service)
  - Build: `cd backend && npm ci`
  - Start: `cd backend && npm start`
  - Health check: `/health`
  - Required env vars: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`

- Frontend: `book-tracker-frontend` (Static site)
  - Build: `cd frontend && npm ci && npm run build`
  - Root: `frontend`
  - Publish path: `dist`
  - Required env var: `VITE_API_URL` (point to backend URL)

Steps to deploy on Render (UI):
1. Sign in to Render and click **New** → **Import from Git**.
2. Select the repo and branch `main` — Render will detect `render.yaml` and show services.
3. Create both services and set the environment variables in each service's dashboard.
4. Trigger deploy and monitor build logs.

Local development (quick):
- Backend:
  - Create `backend/.env` or set env vars: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=development`.
  - Run: `cd backend && npm ci && npm start` (server defaults to port 5000).
- Frontend:
  - Create `frontend/.env.local` with `VITE_API_URL=http://localhost:5000`.
  - Run: `cd frontend && npm ci && npm run dev` (Vite defaults to port 5173).

Security: do not commit real secrets to the repository. Use Render's Environment settings to store secrets.
