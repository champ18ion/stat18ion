# 📡 Stat18ion API

The backend ingestion and analytics engine for Stat18ion.

## Features
-   **Event Ingestion**: Privacy-friendly event tracking (IP hashing, no cookies).
-   **Analytics API**: Query site stats, top pages, and referrers.
-   **Authentication**: JWT-based user auth and site ownership.

## Tech Stack
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **Validation**: Zod
-   **Security**: Bcrypt + JWT

## Setup
1.  Copy `.env.example` to `.env`.
2.  Provide a valid `DATABASE_URL` (PostgreSQL).
3.  Choose a `JWT_SECRET`.

## Development
Run `npm run dev` in this folder (or `root`) to start the server.
Default port is `3001`.
