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
  debug: false,      // Set to true to see logs in console
  trackLocal: false  // Set to true to send data from localhost/dev
});
```

### Configuration Options
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `siteId` | `string` | Required | Your unique Site UUID from the dashboard. |
| `endpoint` | `string` | SaaS URL | Your backend event endpoint. |
| `debug` | `boolean` | `false` | Enable console logging for events. |
| `trackLocal` | `boolean` | `false` | If false, data is never sent from `localhost`. |

### Next.js Integration

To keep your layout as a **Server Component** (for Metadata/SEO), create a small client-side component:

```tsx
// components/StatTracker.tsx
'use client';
import { useEffect } from 'react';
import { init } from 'stat18ion';

export default function StatTracker() {
  useEffect(() => {
    init({ siteId: 'YOUR_UUID_HERE' });
  }, []);
  return null;
}
```

Then add it to your `app/layout.tsx`:

```tsx
import StatTracker from './components/StatTracker';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StatTracker />
        {children}
      </body>
    </html>
  );
}
```

## Features
- 🚀 **Lightweight**: Zero dependencies, tiny bundle.
- 🕵️ **Privacy Friendly**: No IP storage, no cookies.
- ⚡ **Auto Tracking**: Automatically tracks route changes in SPAs (Next.js, React Router).
- 🛡️ **Dev Safety**: Automatically ignores `localhost` traffic unless `debug: true` is set.
