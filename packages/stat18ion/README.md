# Stat18ion Tracker

The official client SDK for [Stat18ion Analytics](https://stat18ion.com).
Privacy-first, lightweight (< 1KB), and cookie-free analytics.

## Installation

```bash
npm install stat18ion
```

## Setup Guides

### 1. Next.js App Router (Recommended)
Create a client-side provider component and drop it in your `layout.tsx`. This avoids SSR issues and makes setup "Plug n Play".

```tsx
// Stat18ionProvider.tsx
'use client'

import { useEffect } from 'react'
import { init } from 'stat18ion'

export function Stat18ionProvider() {
  useEffect(() => {
    init({ siteId: 'YOUR_SITE_ID' })
  }, [])
  return null
}
```

```tsx
// app/layout.tsx
import { Stat18ionProvider } from './Stat18ionProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Stat18ionProvider />
        {children}
      </body>
    </html>
  )
}
```

### 2. Unblockable (Middleware)
Zero client-side JS. Resistant to ad-blockers. Use a tight `matcher` to avoid tracking static assets or internal chunks.

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

### 3. Basic Script (HTML)
```html
<script defer 
  src="https://unpkg.com/stat18ion@latest/dist/index.js" 
  data-site-id="YOUR_SITE_ID">
</script>
```

## Features
- 🚀 **Aggressive Filtering**: Automatically ignores `.js`, `.css`, `.webp`, `.avif`, and other media noise.
- ⚡ **SPA Deduplication**: Built-in 1000ms cooldown to prevent duplicate events during hydration.
- 🕵️ **Privacy Friendly**: No IP storage, no cookies, 10-second backend cooldown.
- ⚡ **Auto Tracking**: Automatically tracks route changes in SPAs.
