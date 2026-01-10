type Config = {
    siteId: string;
    endpoint?: string;
    debug?: boolean;
};

let config: Config = {
    siteId: '',
    endpoint: 'https://stats.hashboard.in/api/event', // SaaS default (Replace with your actual domain)
};

const log = (message: string, ...args: any[]) => {
    if (config.debug) {
        console.log(`[Stat18ion] ${message}`, ...args);
    }
};

const sendEvent = (payload: any) => {
    const url = config.endpoint!;
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
    } else {
        fetch(url, {
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
        }).catch((err) => console.error(err));
    }
};

const trackPageView = () => {
    // Ignore localhost by default to avoid pollution
    const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
    if (isLocal && !config.debug) {
        return;
    }

    const payload = {
        siteId: config.siteId,
        path: window.location.pathname,
        referrer: document.referrer,
        ua: navigator.userAgent,
        ts: Date.now(),
    };
    log('Track PageView', payload);
    sendEvent(payload);
};

// History API Monkey Patching
const patchHistory = () => {
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

export const init = (options: Config) => {
    if (config.siteId) {
        console.warn('Stat18ion already initialized');
        return;
    }

    config = { ...config, ...options };

    if (!config.endpoint) {
        console.error('[Stat18ion] Error: No endpoint provided. Analytics will not be sent.');
        return;
    }

    log('Initialized', config);

    // Initial Page View
    trackPageView();

    // Route Changes
    patchHistory();
};

export const Analytics = () => {
    // Config would typically be passed via props or context in React
    // For now this is a placeholder if we want a Component wrapper
    return null;
};
