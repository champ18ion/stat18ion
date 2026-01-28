type Config = {
    siteId: string;
    endpoint?: string;
    debug?: boolean;
    trackLocal?: boolean;
};

let config: Config = {
    siteId: '',
    endpoint: 'https://stats.hashboard.in/api/event',
};

const log = (message: string, ...args: any[]) => {
    if (config.debug) {
        console.log(`[Stat18ion] ${message}`, ...args);
    }
};

/**
 * Client-side event sender
 */
const sendEvent = (payload: any) => {
    const url = config.endpoint!;
    const body = JSON.stringify(payload);

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
    } else {
        fetch(url, {
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            credentials: 'omit',
        }).catch((err) => console.error(err));
    }
};

const isStaticAsset = (path: string) => {
    const staticExtensions = [
        '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.json', '.map'
    ];
    return (
        staticExtensions.some(ext => path.toLowerCase().endsWith(ext)) ||
        path.includes('/_next/static/') ||
        path.includes('/api/')
    );
};

/**
 * Main function to track page views (Client-side)
 */
const trackPageView = () => {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    if (isStaticAsset(path)) return;

    const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
    if (isLocal && !config.trackLocal) {
        log('Skipping event sending on localhost.');
        return;
    }

    const payload = {
        siteId: config.siteId,
        path: path,
        referrer: document.referrer,
        ua: navigator.userAgent,
        ts: Date.now(),
    };
    log('Track PageView', payload);
    sendEvent(payload);
};

// History API Monkey Patching
const patchHistory = () => {
    if (typeof window === 'undefined') return;

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        trackPageView();
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        trackPageView();
    };

    window.addEventListener('popstate', () => {
        trackPageView();
    });
};

/**
 * Initialize Client-Side Tracking
 */
export const init = (options: Config) => {
    if (config.siteId) return;

    config = { ...config, ...options };
    if (!config.endpoint) return;

    log('Initialized', config);
    trackPageView();
    patchHistory();
};

/**
 * Server-Side Tracking for "Plug n Play" unblockable analytics.
 * Use this in Next.js Middleware or Server Actions.
 */
export const trackServerEvent = async (options: {
    siteId: string;
    path: string;
    referrer?: string;
    ua?: string;
    endpoint?: string;
}) => {
    if (isStaticAsset(options.path)) return;

    const payload = {
        siteId: options.siteId,
        path: options.path,
        referrer: options.referrer || '',
        ua: options.ua || '',
        ts: Date.now(),
    };

    const endpoint = options.endpoint || 'https://stats.hashboard.in/api/event';

    try {
        await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('[Stat18ion] Server-side tracking failed:', err);
    }
};

export const Analytics = () => {
    return null;
};

// Auto-initialize if running in a browser and script tag has data-site-id
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const script = document.currentScript || document.querySelector('script[data-site-id]');
    if (script) {
        const siteId = script.getAttribute('data-site-id');
        if (siteId && !config.siteId) {
            init({ siteId });
        }
    }
}
