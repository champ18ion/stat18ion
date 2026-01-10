# Stat18ion Tracker

The official client SDK for [Stat18ion Analytics](https://stat18ion.com).
Privacy-first, lightweight (< 1KB), and cookie-free analytics.

## Installation

```bash
npm install stat18ion
```

## Usage

Initialize the tracker once in your application root (e.g., `layout.tsx` or `App.js`).

```javascript
import { init } from 'stat18ion';

init({
  siteId: 'YOUR_SITE_ID', 
  // Optional: defaults to production endpoint
  // endpoint: 'https://api.your-domain.com/api/event', 
  // Optional: enable logs in console
  // debug: false 
});
```

### Next.js Integration

In `app/layout.tsx`:

```tsx
'use client';
import { useEffect } from 'react';
import { init } from 'stat18ion';

export default function RootLayout({ children }) {
  useEffect(() => {
    init({ siteId: 'YOUR_UUID_HERE' });
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Features
- 🚀 **Lightweight**: Zero dependencies, tiny bundle.
- 🕵️ **Privacy Friendly**: No IP storage, no cookies.
- ⚡ **Auto Tracking**: Automatically tracks route changes in SPAs (Next.js, React Router).
- 🛡️ **Dev Safety**: Automatically ignores `localhost` traffic unless `debug: true` is set.
