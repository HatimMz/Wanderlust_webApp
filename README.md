# WanderLust

WanderLust is a full-stack vacation-rental application built with a Node.js
and Express API, MongoDB, and a React/Vite frontend. Users can browse stays,
create accounts, publish listings, and leave reviews.

## Features

- Browse and search listings by title, location, or country
- View listing details, images, prices, and reviews
- Register, log in, and log out using session-based authentication
- Create, edit, and delete listings when authenticated
- Add and delete reviews for listings
- Responsive frontend with a dedicated layout and protected routes

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, React Router, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | Passport Local, passport-local-mongoose, express-session |
| Validation and middleware | Joi, Multer, CORS |

## Project structure

```text
.
├── frontend/              # React/Vite application and frontend environment
├── backend/               # Express API, models, routes, and backend environment
└── api/                   # Vercel serverless adapter for the backend
```

The React UI is organized under `frontend/src/components/`. The folder contains
components for the layout, authentication, listing cards, listing details,
listing forms, protected routes, and shared form presentation.

`frontend/src/api.js` centralizes frontend requests. It applies the API base URL,
sends session cookies, handles JSON responses, and turns failed API responses
into errors for components to display.

## Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- A MongoDB database (local for development, or a hosted database for Vercel)
- `MONGODB_URI` and `SESSION_SECRET` environment variables

## Installation

Install both applications' dependencies from the project root:

```bash
npm run install:all
```

Create `backend/.env` from `backend/.env.example` and set your MongoDB URL and
a long, random `SESSION_SECRET`. Create `frontend/.env` from
`frontend/.env.example` if you need to override the API URL; `/api` is the
default and works with the local Vite proxy.

Environment files belong inside their respective application directories and
are ignored by Git.

## Running the application

Start the backend API from the project root:

```bash
npm start
```

The API runs on `http://localhost:3000`.

In a second terminal, start the Vite frontend from the project root:

```bash
npm run dev:frontend
```

The development frontend will be available at the URL printed by Vite,
typically `http://localhost:5173`.

## Useful commands

From the project root:

```bash
npm start             # Start the Express API
npm run dev:frontend  # Start the Vite development server
npm run build         # Create the frontend production build
npm run lint          # Run frontend Oxlint
```

## Deploying to Vercel

Import this repository into Vercel with the repository root as the project
root. The checked-in `vercel.json` installs dependencies from `backend/` and
`frontend/`, builds `frontend/`, and serves its `dist` output. The root `api/`
adapter forwards API requests to the Express app in `backend/`.

Before deploying, create a hosted MongoDB database and add these environment
variables in the Vercel project settings for every deployment environment:

- `MONGODB_URI` — the hosted database connection string
- `SESSION_SECRET` — a long, unique random secret

Optionally set `CLIENT_ORIGIN` if the API should accept credentialed browser
requests from a separate frontend origin. The default Vercel deployment serves
the frontend and API on the same origin and does not need this setting.

The app uses MongoDB to persist both application data and login sessions.
Ensure the database allows connections from Vercel and that its credentials
are kept in Vercel environment variables, not committed to the repository.

## API route groups

- `GET /api/health` — API health check
- `/api/users` — registration, login, logout, and current-user requests
- `/api/listings` — listing creation, browsing, editing, and deletion
- `/api/listings/:id/reviews` — listing review creation and deletion
