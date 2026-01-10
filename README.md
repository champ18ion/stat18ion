# 🛰️ Stat18ion

### Privacy-first, lightweight, and modern analytics for the web.

Stat18ion is a complete, cookieless analytics solution designed to give you deep insights into your users without compromising their privacy.

## 📦 Project Structure

This is a **Monorepo** managed by **TurboRepo**.

-   **`apps/site`**: The Next.js dashboard and landing page. ([README](apps/site/README.md))
-   **`apps/server`**: The Express + PostgreSQL backend API. ([README](apps/server/README.md))
-   **`packages/stat18ion`**: The official lightweight tracker SDK. ([README](packages/stat18ion/README.md))

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- Npm (Workspaces enabled)

### Local Development
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/stat18ion.git
    cd stat18ion
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment**:
    - Backend: Copy `apps/server/.env.example` to `apps/server/.env` and fill in your details.
    - Frontend: Add `NEXT_PUBLIC_API_URL=http://localhost:3001` to your environment.

4.  **Run everything**:
    ```bash
    npm run dev
    ```
    This starts the API, Dashboard, and Tracker watcher simultaneously.

## 🛠️ Build & Deploy

- **Build everything**: `npm run build`
- **Build specific app**: `npx turbo build --filter=@stat18ion/server`

For detailed instructions, see the [**Deployment Guide**](DEPLOYMENT_GUIDE.md).

## 📄 License
MIT
