'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, ArrowRight, LayoutGrid, Activity, ShieldCheck, Search, Terminal, Globe } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function DashboardPage() {
    const router = useRouter();
    const [sites, setSites] = useState<any[]>([]);
    const [newSiteName, setNewSiteName] = useState('');
    const [newSiteDomain, setNewSiteDomain] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSiteForCode, setSelectedSiteForCode] = useState<any>(null);
    const [selectedTab, setSelectedTab] = useState('next-opt');
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopyStatus(id);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    const handleDeleteSite = async (siteId: string) => {
        if (!confirm('Are you absolutely sure? This will delete all collected data for this site permanently.')) return;

        const token = localStorage.getItem('stat18ion_token');
        const res = await fetch(`${API_URL}/api/sites/${siteId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            setSites(sites.filter(s => s.id !== siteId));
        }
    };

    const CopyButton = ({ text, id }: { text: string, id: string }) => (
        <button
            onClick={() => handleCopy(text, id)}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all font-bold"
        >
            {copyStatus === id ? 'COPIED!' : 'COPY_CODE'}
        </button>
    );

    useEffect(() => {
        const token = localStorage.getItem('stat18ion_token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetch(`${API_URL}/api/sites`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (res.status === 401) throw new Error('Unauthorized');
                return res.json();
            })
            .then((data) => setSites(data))
            .catch(() => router.push('/login'));
    }, [router]);

    const handleCreateSite = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('stat18ion_token');

        const res = await fetch(`${API_URL}/api/sites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: newSiteName,
                domain: newSiteDomain
            }),
        });

        if (res.ok) {
            const site = await res.json();
            setSites([site, ...sites]);
            setNewSiteName('');
            setNewSiteDomain('');
            setIsCreating(false);
        }
    };

    const filteredSites = sites.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen p-6 md:p-12 font-mono selection:bg-cyan-500/30">
            <div className="scanline" />

            {/* System Status Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-cyan-500/10">
                <div>
                    <div className="flex items-center gap-2 text-cyan-500/40 text-[10px] uppercase tracking-[0.3em] mb-1">
                        <Activity size={10} className="animate-pulse" /> {/* Active Node */}
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter glow-text uppercase">Project Dashboard</h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={14} />
                        <input
                            type="text"
                            placeholder="Filter sites..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-cyan-950/20 border border-cyan-500/20 px-10 py-2.5 text-xs text-cyan-100 placeholder:text-cyan-500/20 focus:outline-none focus:border-cyan-400/50 transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="flex items-center gap-3 px-6 py-2.5 bg-cyan-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} /> Register Site
                    </button>
                    <button
                        onClick={() => { localStorage.removeItem('stat18ion_token'); router.push('/login'); }}
                        className="p-2.5 border border-red-500/20 text-red-500/60 hover:bg-red-500/10 transition-colors"
                        title="Logout"
                    >
                        <ShieldCheck size={18} />
                    </button>
                </div>
            </div>

            {/* New Site UI */}
            {isCreating && (
                <div className="mb-12 terminal-border bg-cyan-950/20 p-8 max-w-2xl animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2 mb-6 text-cyan-400 text-xs uppercase tracking-widest font-bold">
                        <Terminal size={14} /> Register New Site
                    </div>
                    <form onSubmit={handleCreateSite} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">Site Name</label>
                            <input
                                type="text"
                                placeholder="e.g. My Portfolio"
                                value={newSiteName}
                                onChange={(e) => setNewSiteName(e.target.value)}
                                className="w-full bg-black/40 border border-cyan-500/20 p-3 text-sm text-cyan-100 focus:outline-none focus:border-cyan-400 transition-colors"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">Domain (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. myportfolio.com"
                                value={newSiteDomain}
                                onChange={(e) => setNewSiteDomain(e.target.value)}
                                className="w-full bg-black/40 border border-cyan-500/20 p-3 text-sm text-cyan-100 focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                        </div>
                        <div className="flex gap-4 pt-2">
                            <button type="submit" className="flex-1 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all">
                                Register Site
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-6 py-3 border border-red-500/20 text-red-500/60 hover:bg-red-500/10 text-xs uppercase tracking-widest font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Site Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSites.map((site) => (
                    <div key={site.id} className="terminal-border bg-cyan-950/5 hover:bg-cyan-500/[0.03] hover:border-cyan-400/50 transition-all duration-500 relative overflow-hidden h-full flex flex-col group">
                        <div className="p-8 flex-1">
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <Link href={`/dashboard/${site.id}`} className="group/title">
                                        <h3 className="text-xl font-bold text-cyan-100 group-hover/title:text-cyan-400 transition-colors uppercase tracking-tight">
                                            {site.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-2 text-cyan-500/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                                        <Globe size={11} /> {site.domain || 'NO_DOMAIN_LINKED'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDeleteSite(site.id)}
                                        className="p-2 border border-red-500/10 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        title="Delete Project"
                                    >
                                        <ShieldCheck size={14} />
                                    </button>
                                    <div className="p-2 border border-cyan-500/10 group-hover:border-cyan-400/30 transition-colors">
                                        <LayoutGrid size={20} className="text-cyan-500/40 group-hover:text-cyan-400 transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="flex gap-1">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="h-1 w-full bg-cyan-500/10 overflow-hidden">
                                            <div className="h-full bg-cyan-500 w-1/3 animate-pulse" />
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-cyan-500/5">
                                    <p className="text-[9px] text-cyan-500/30 uppercase tracking-[0.3em] mb-1">SITE_ID</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopy(site.id, `id-${site.id}`);
                                        }}
                                        className="w-full font-mono text-[10px] text-cyan-500/60 bg-black/40 px-3 py-2 border border-cyan-500/5 group-hover:border-cyan-500/20 truncate transition-colors text-left hover:text-cyan-400 active:bg-cyan-500/10 cursor-alias flex justify-between items-center"
                                        title="Click to copy Site ID"
                                    >
                                        {site.id}
                                        <span className="text-[7px] opacity-0 group-hover:opacity-100 transition-opacity">
                                            {copyStatus === `id-${site.id}` ? 'COPIED' : 'CLICK_TO_COPY'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-cyan-500/5 border-t border-cyan-500/10 flex gap-2">
                            <Link
                                href={`/dashboard/${site.id}`}
                                className="flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20 hover:bg-cyan-500 hover:text-black transition-all"
                            >
                                View Analytics
                            </Link>
                            <button
                                onClick={() => {
                                    setSelectedSiteForCode(site);
                                    setSelectedTab('next-opt');
                                }}
                                className="px-4 py-1.5 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 transition-all"
                                title="Get Tracking Code"
                            >
                                <Terminal size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredSites.length === 0 && (
                    <div className="col-span-full py-32 border border-dashed border-cyan-500/10 flex flex-col items-center justify-center opacity-30 text-center animate-pulse">
                        <LayoutGrid size={48} className="mb-4 text-cyan-500" />
                        <p className="font-mono text-xs uppercase tracking-widest">
                            {searchQuery ? 'NO_MATCHING_PROJECTS_FOUND' : 'NO_SITES_REGISTERED_YET'}
                        </p>
                    </div>
                )}
            </div>

            {/* Get Code Modal */}
            {selectedSiteForCode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-black border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(0,243,255,0.1)] relative">
                        {/* Header */}
                        <div className="p-8 pb-4 border-b border-cyan-500/10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-cyan-100 uppercase tracking-widest flex items-center gap-3">
                                    <Terminal className="text-cyan-400" size={20} /> Setup Instructions
                                </h2>
                                <button
                                    onClick={() => setSelectedSiteForCode(null)}
                                    className="text-cyan-500/40 hover:text-red-500 transition-colors font-bold text-xs"
                                >
                                    [ CLOSE ]
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'next-opt', label: 'NEXT_JS (OPT)' },
                                    { id: 'next-simple', label: 'NEXT_JS (SIMPLE)' },
                                    { id: 'react', label: 'REACT / VITE' },
                                    { id: 'stealth', label: 'STEALTH_MODE' },
                                    { id: 'script', label: 'CDN_SCRIPT' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedTab(tab.id)}
                                        className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all ${selectedTab === tab.id
                                            ? 'bg-cyan-500 text-black border-cyan-500'
                                            : 'border-cyan-500/20 text-cyan-500/40 hover:border-cyan-500/40 hover:text-cyan-300'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto flex-1 scrollbar-hide">
                            <div className="mb-6 p-3 border border-amber-500/20 bg-amber-500/5 text-[10px] text-amber-500/60 uppercase tracking-wider leading-relaxed">
                                <span className="font-bold text-amber-500">[ WARNING ]</span> Avoid using both Middleware and Script tags simultaneously to prevent double-counting.
                            </div>

                            <div className="space-y-6">
                                {selectedTab === 'next-opt' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[9px] text-cyan-500/40 uppercase tracking-widest leading-relaxed">
                                                Keep your `layout.tsx` as a Server Component.
                                            </p>
                                            <CopyButton
                                                id="code-next-opt"
                                                text={`// components/Stat18ion.tsx
'use client';
import { useEffect } from 'react';
import { init } from 'stat18ion';

export function Stat18ion() {
  useEffect(() => {
    init({ siteId: '${selectedSiteForCode.id}' });
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
}`} />
                                        </div>
                                        <pre className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[10px] text-cyan-100/80 overflow-x-auto select-all">
                                            {`// components/Stat18ion.tsx
'use client';
import { useEffect } from 'react';
import { init } from 'stat18ion';

export function Stat18ion() {
  useEffect(() => {
    init({ siteId: '${selectedSiteForCode.id}' });
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
}`}
                                        </pre>
                                    </div>
                                )}

                                {selectedTab === 'next-simple' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[9px] text-cyan-500/40 uppercase tracking-widest leading-relaxed">
                                                Quick integration (Client Component layout).
                                            </p>
                                            <CopyButton
                                                id="code-next-simple"
                                                text={`'use client';
import { useEffect } from 'react';
import { init } from 'stat18ion';

export default function RootLayout({ children }) {
  useEffect(() => {
    init({ siteId: '${selectedSiteForCode.id}' });
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`} />
                                        </div>
                                        <pre className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[10px] text-cyan-100/80 overflow-x-auto select-all">
                                            {`'use client';
import { useEffect } from 'react';
import { init } from 'stat18ion';

export default function RootLayout({ children }) {
  useEffect(() => {
    init({ siteId: '${selectedSiteForCode.id}' });
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}
                                        </pre>
                                    </div>
                                )}

                                {selectedTab === 'react' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[9px] text-cyan-500/40 uppercase tracking-widest leading-relaxed">
                                                Standard SPA integration (React, Vue, Svelte).
                                            </p>
                                            <CopyButton
                                                id="code-react"
                                                text={`// App.js or main.js
import { init } from 'stat18ion';

init({
  siteId: '${selectedSiteForCode.id}',
  debug: false
});`} />
                                        </div>
                                        <pre className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[10px] text-cyan-100/80 overflow-x-auto select-all">
                                            {`// App.js or main.js
import { init } from 'stat18ion';

init({
  siteId: '${selectedSiteForCode.id}',
  debug: false
});`}
                                        </pre>
                                    </div>
                                )}

                                {selectedTab === 'stealth' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[9px] text-cyan-500/40 uppercase tracking-widest leading-relaxed">
                                                Pure server-side tracking via Edge Runtime.
                                            </p>
                                            <CopyButton
                                                id="code-stealth"
                                                text={`// middleware.ts
import { trackServerEvent } from 'stat18ion';

export function middleware(req) {
  trackServerEvent({ 
    siteId: '${selectedSiteForCode.id}',
    path: req.nextUrl.pathname,
    ua: req.headers.get('user-agent'),
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\\\..*).*)'],
};`} />
                                        </div>
                                        <pre className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[10px] text-cyan-100/80 overflow-x-auto select-all">
                                            {`// middleware.ts
import { trackServerEvent } from 'stat18ion';

export function middleware(req) {
  trackServerEvent({ 
    siteId: '${selectedSiteForCode.id}',
    path: req.nextUrl.pathname,
    ua: req.headers.get('user-agent'),
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\\\..*).*)'],
};`}
                                        </pre>
                                    </div>
                                )}

                                {selectedTab === 'script' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[9px] text-cyan-500/40 uppercase tracking-widest leading-relaxed">
                                                Zero-config CDN script for basic sites.
                                            </p>
                                            <CopyButton
                                                id="code-script"
                                                text={`<script defer src="https://unpkg.com/stat18ion@latest/dist/index.js" data-site-id="${selectedSiteForCode.id}"></script>`} />
                                        </div>
                                        <div className="bg-cyan-950/20 border border-cyan-500/10 p-6 font-mono text-[11px] text-cyan-100/80 break-all select-all flex justify-between items-center text-left">
                                            {`<script defer src="https://unpkg.com/stat18ion@latest/dist/index.js" data-site-id="${selectedSiteForCode.id}"></script>`}
                                        </div>
                                    </div>
                                )}

                                {/* Configuration Parameters */}
                                <div className="p-4 border border-cyan-500/10 bg-cyan-950/20 rounded-sm mt-8">
                                    <h3 className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-3 font-mono">Configuration Reference</h3>
                                    <div className="grid grid-cols-1 gap-3 text-[9px] uppercase tracking-tighter text-cyan-100/60 font-mono">
                                        <div className="flex justify-between border-b border-cyan-500/5 pb-1">
                                            <span className="text-cyan-500">siteId [REQUIRED]</span>
                                            <span>Your unique node identifier</span>
                                        </div>
                                        <div className="flex justify-between border-b border-cyan-500/5 pb-1">
                                            <span className="text-cyan-500">debug [OPTIONAL]</span>
                                            <span>Enable console logs for verification</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 pt-4 border-t border-cyan-500/10 flex justify-between items-center bg-black/50">
                            <div className="text-[9px] text-cyan-500/30 uppercase tracking-[0.2em] font-bold select-none">SDK_BUNDLE_READY [v0.1.10]</div>
                            <button
                                onClick={() => setSelectedSiteForCode(null)}
                                className="px-8 py-2.5 bg-cyan-500 text-black font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all font-mono shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                            >
                                CLOSE_INTERFACE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
