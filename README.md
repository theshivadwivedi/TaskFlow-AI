# TaskFlow AI

A to-do app I built with a FastAPI backend and a React frontend, with an AI chat assistant baked in so you can ask it things like "what should I work on next?" instead of scrolling through your task list.

Live: [taskflow-ai-1-gd16.onrender.com](https://taskflow-ai-1-gd16.onrender.com)

(It's on Render's free tier, so if the backend's been idle for a bit, the first request can take up to a minute while it wakes up. Just refresh if it looks stuck.)

## What it does

- Sign up / log in with JWT auth, plus forgot/reset password over email
- Create, edit, delete tasks — mark them pending, in progress, or completed
- Search and filter by priority/status
- Ask the AI assistant about your tasks and it'll actually answer using your real data (LangChain + Gemini under the hood)
- Dashboard shows quick stats so you can see what's piling up

## Stack

**Frontend:** React (Vite), Tailwind, React Router, React Hook Form + Zod, Framer Motion, Axios

**Backend:** FastAPI, MongoDB, JWT auth, LangChain + Gemini for the chat, Brevo for sending reset emails

**Hosting:** Render (both the API and the frontend), MongoDB Atlas for the database

## Running it locally

You'll need Python 3.11+, Node 18+, a MongoDB connection string (Atlas free tier works fine), a free Brevo account for email, and a Gemini API key.



## Project layout

```
backend/
  app/
    core/         → auth/security stuff
    models/       → request/response schemas
    routers/      → API endpoints
    services/     → the actual logic
    main.py

ai-todo-frontend/
  src/
    components/   → TaskCard, Navbar, modals, etc.
    components/chat/  → the AI chat widget
    pages/        → Auth, Dashboard, ResetPassword
    services/     → API calls
```

---

Built as a personal project to learn full-stack development with AI features.
