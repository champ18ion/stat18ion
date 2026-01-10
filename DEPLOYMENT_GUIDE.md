# Stat18ion Deployment & Publishing Guide

> **INTERNAL USE ONLY**: This file contains sensitive operational details. Do not commit to public version control.

## 1. Publishing to NPM

The package is located in `packages/stat18ion`.

### Prerequisites
- You must be logged in to npm: `npm login`
- You must be a maintainer of the `stat18ion` package on npm.

### Publishing Steps
1.  **Navigate to package:**
    ```bash
    cd packages/stat18ion
    ```
2.  **Bump Version:**
    Update `version` in `package.json` (e.g., `0.0.3`).
3.  **Build & Publish:**
    ```bash
    npm publish --access public
    ```
    *Note: The `prepublishOnly` script will automatically run `npm run build` before publishing.*

---

## 2. Deploying the Servers

This is a Monorepo containing two apps:

### A. API Server (`apps/server`)
- **Type**: Node.js / Express
- **Build Command**: `tsc` (ensure `dist/index.js` is created)
- **Start Command**: `node dist/index.js`
- **Environment Variables**:
    - `PORT`: (default 3001)
    - `DATABASE_URL`: Connection string to Postgres (e.g. `postgres://user:pass@host:port/db`)
    - `JWT_SECRET`: Random long string for auth tokens.
    - `ADMIN_PASSWORD`: (Optional) For legacy admin login, though we now use DB users.

### B. Dashboard (`apps/site`)
- **Type**: Next.js App Router
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
    - No secret env vars needed for client-side, but ensure it can reach the API.
    - If you hardcode the API URL in the frontend, update it before building.

### Database Migrations
When deploying for the first time or after schema changes:
1.  Go to `apps/server`
2.  Run the migration script:
    ```bash
    npx ts-node migrate.ts
    ```

---

## 3. Local Testing (Before Publish)

Do not publish broken code. Test locally first.

1.  **Link Package**:
    ```bash
    cd packages/stat18ion
    npm link
    ```
2.  **Use in Test Project**:
    ```bash
    cd ../my-test-project
    npm link stat18ion
    ```
3.  **Verify**: Ensure `debug: true` works and events hit the local API (`http://localhost:3001/api/event`).
