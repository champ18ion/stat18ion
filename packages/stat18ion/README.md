# Stat18ion Tracker

The official client SDK for [Stat18ion Analytics](https://stat18ion.com).
Privacy-first, lightweight (< 1KB), and cookie-free analytics.

## Installation

```bash
npm install stat18ion
```

## Setup Guides (5 Ways to Track)

### 1. Next.js App Router (Optimized)
Keep your `layout.tsx` as a Server Component by using a dedicated client provider.

```tsx
// components/Stat18ion.tsx
'use client';
import { useEffect } from 'react';
import { init } from 'stat18ion';

export function Stat18ion() {
  useEffect(() => {
    init({ siteId: 'YOUR_SITE_ID' });
  }, []);
  return null;
}

// app/layout.tsx
import { Stat18ion } from './components/Stat18ion';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Stat18ion />
        {children}
      </body>
    </html>
  );
}
```

### 2. Next.js App Router (Simple)
Quickest way if you don't mind a Client Component layout.

```tsx
// app/layout.tsx
'use client';
import { useEffect } from 'react';
import { init } from 'stat18ion';

export default function RootLayout({ children }) {
  useEffect(() => {
    init({ siteId: 'YOUR_SITE_ID' });
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 3. Vanilla React / Vite
Standard implementation for any SPA framework.

```javascript
// main.js or App.js
import { init } from 'stat18ion';

init({
  siteId: 'YOUR_SITE_ID', 
  debug: false // Optional: enable console logs
});
```

### 4. Stealth Mode (Middleware)
100% unblockable, server-side tracking via Next.js Middleware.

```typescript
// middleware.ts
import { trackServerEvent } from 'stat18ion';

export function middleware(req) {
  trackServerEvent({ 
    siteId: 'YOUR_SITE_ID',
    path: req.nextUrl.pathname,
    ua: req.headers.get('user-agent'),
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
```

### 5. Static Script (CDN)
Best for basic HTML sites, Shopify, or Webflow.

```html
<script defer 
  src="https://unpkg.com/stat18ion@latest/dist/index.js" 
  data-site-id="YOUR_SITE_ID">
</script>
```

## Advanced: Stealth Mode (Middleware)
Zero client-side JS. Resistant to ad-blockers.

```typescript
// middleware.ts
import { trackServerEvent } from 'stat18ion';

export function middleware(req) {
  trackServerEvent({ 
    siteId: 'YOUR_SITE_ID',
    path: req.nextUrl.pathname,
    ua: req.headers.get('user-agent'),
  });
}

export const config = {
  // Filters out images, chunks, and system files at the edge level
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
```

## Configuration Reference

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `siteId` | `string` | **Required** | Your unique node identifier (found in dashboard). |
| `endpoint` | `string` | `/api/events` | Custom ingestion path for your analytics server. |
| `debug` | `boolean` | `false` | Enables console logging for debugging events. |
| `trackLocal` | `boolean` | `false` | If true, tracks hits on `localhost` or `127.0.0.1`. |

## Features (v0.1.10)
- 🚀 **Strict Idempotency**: Internal protection against multiple initializations (common in React).
- 🛡️ **Aggressive Filtering**: Automatically ignores `.webp`, `.avif`, `.mp4`, `.webm`, and system files.
- ⚡ **SPA Deduplication**: Built-in 1000ms cooldown for route changes.
- 🕵️ **Privacy Friendly**: No IP storage, no cookies, 10-second backend cooldown.
