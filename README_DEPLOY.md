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

Security: do not commit real secrets to the repository. Use Render's Environment settings to store secrets.
