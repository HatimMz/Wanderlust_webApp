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
├── app.js                 # Express server and API setup
├── models/                # Mongoose models and validation schemas
├── routes/                # User, listing, and review API routes
├── utils/                 # Error and async middleware helpers
├── initDB/                # Database seed and initialization scripts
└── client/
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── api.js         # Shared frontend API request helper
    │   ├── App.jsx        # Router and application composition
    │   └── main.jsx       # React entry point
    └── package.json
```

The React UI is organized under `client/src/components/` instead of keeping
all components in one file. The folder currently contains components for the
layout, authentication, listing cards, listing details, listing forms,
protected routes, and shared form presentation.

`client/src/api.js` centralizes frontend requests. It applies the API base URL,
sends session cookies, handles JSON responses, and turns failed API responses
into errors for components to display.

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally on `mongodb://127.0.0.1:27017/wanderLust`

## Installation

Install backend dependencies from the project root:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
cd ..
```

## Running the application

Start the backend API from the project root:

```bash
npm start
```

The API runs on `http://localhost:3000`.

In a second terminal, start the Vite frontend:

```bash
cd client
npm run dev
```

The development frontend will be available at the URL printed by Vite,
typically `http://localhost:5173`.

The frontend uses `http://localhost:3000/api` by default. To point it at a
different API server, create `client/.env` with:

```bash
VITE_API_URL=http://localhost:3000/api
```

## Useful commands

From `client/`:

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run Oxlint
npm run preview  # Preview the production build
```

From the project root:

```bash
npm start        # Start the Express API
```

## API route groups

- `GET /api/health` — API health check
- `/api/users` — registration, login, logout, and current-user requests
- `/api/listings` — listing creation, browsing, editing, and deletion
- `/api/listings/:id/reviews` — listing review creation and deletion
