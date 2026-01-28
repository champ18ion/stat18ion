# Stat18ion Tracker

The official client SDK for [Stat18ion Analytics](https://stat18ion.com).
Privacy-first, lightweight (< 1KB), and cookie-free analytics.

## Installation

```bash
npm install stat18ion
```

## Usage

### 1. Unblockable (Server-Side) — **Recommended**
This is immune to ad-blockers and requires zero client-side JavaScript. Best for Next.js, Nuxt, or any server-side framework.

```typescript
// middleware.ts (Next.js Example)
import { NextResponse } from 'next/server';
import { trackServerEvent } from 'stat18ion';

export async function middleware(req) {
  // Track the event without blocking the visitor
  trackServerEvent({
    siteId: 'YOUR_SITE_ID',
    path: req.nextUrl.pathname,
    ua: req.headers.get('user-agent') || '',
    referrer: req.headers.get('referer') || '',
  });

  return NextResponse.next();
}
```

### 2. Standard (Client-Side)
Initialize once in your application root.

```javascript
import { init } from 'stat18ion';

init({
  siteId: 'YOUR_SITE_ID', 
  debug: false,
  trackLocal: false
});
```

## Features
- 🚀 **Lightweight**: Zero dependencies, tiny bundle.
- 🕵️ **Privacy Friendly**: No IP storage, no cookies.
- ⚡ **Auto Tracking**: Automatically tracks route changes in SPAs (Next.js, React Router).
- 🛡️ **Dev Safety**: Automatically ignores `localhost` traffic unless `debug: true` is set.
