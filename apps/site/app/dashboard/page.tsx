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
                                <div className="p-2 border border-cyan-500/10 group-hover:border-cyan-400/30 transition-colors">
                                    <LayoutGrid size={20} className="text-cyan-500/40 group-hover:text-cyan-400 transition-all" />
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
                                            navigator.clipboard.writeText(site.id);
                                        }}
                                        className="w-full font-mono text-[10px] text-cyan-500/60 bg-black/40 px-3 py-2 border border-cyan-500/5 group-hover:border-cyan-500/20 truncate transition-colors text-left hover:text-cyan-400 active:bg-cyan-500/10 cursor-alias"
                                        title="Click to copy Site ID"
                                    >
                                        {site.id}
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
                                onClick={() => setSelectedSiteForCode(site)}
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
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(0,243,255,0.1)] p-8 relative scrollbar-hide">
                        <div className="flex justify-between items-center mb-6 text-left sticky top-0 bg-black z-10 pb-4">
                            <h2 className="text-xl font-bold text-cyan-100 uppercase tracking-widest">Setup Instructions</h2>
                            <button
                                onClick={() => setSelectedSiteForCode(null)}
                                className="text-cyan-500/40 hover:text-red-500 transition-colors font-bold text-xs"
                            >
                                [ CLOSE ]
                            </button>
                        </div>

                        <div className="mb-6 p-3 border border-amber-500/20 bg-amber-500/5 text-[10px] text-amber-500/60 uppercase tracking-wider leading-relaxed">
                            <span className="font-bold text-amber-500">[ WARNING ]</span> Avoid using both Middleware and Script tags simultaneously to prevent double-counting of visits. Choose one implementation method for optimal accuracy.
                        </div>

                        <div className="space-y-8 text-left">
                            {/* NPM Option */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">1. NPM Implementation (Modular)</div>
                                    <div className="px-2 py-0.5 border border-cyan-500/20 text-[8px] text-cyan-400 uppercase tracking-widest">Recommended</div>
                                </div>
                                <div className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[11px] text-cyan-100/80 break-all select-all flex justify-between items-center mb-2">
                                    <span>npm install stat18ion</span>
                                </div>
                                <pre className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[10px] text-cyan-100/80 overflow-x-auto select-all">
                                    {`import { init } from 'stat18ion';

init({
  siteId: '${selectedSiteForCode.id}', 
  debug: false
});`}
                                </pre>
                            </div>

                            {/* Next.js Provider */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">2. Next.js App Router (Plug n Play)</div>
                                    <div className="px-2 py-0.5 border border-cyan-500/20 text-[8px] text-blue-400 uppercase tracking-widest">Recommended</div>
                                </div>
                                <p className="text-[9px] text-cyan-500/40 uppercase tracking-widest">Create a component and drop it in your `layout.tsx` (Server Component safe):</p>
                                <pre className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[10px] text-cyan-100/80 overflow-x-auto select-all">
                                    {`'use client'

import { useEffect } from 'react'
import { init } from 'stat18ion'

export function Stat18ionProvider() {
  useEffect(() => {
    init({ siteId: '${selectedSiteForCode.id}' })
  }, [])
  return null
}`}
                                </pre>
                            </div>

                            {/* Script tag */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">3. Static Script (Zero-Config)</div>
                                    <div className="px-2 py-0.5 border border-cyan-500/20 text-[8px] text-cyan-500/40 uppercase tracking-widest">CDN</div>
                                </div>
                                <div className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[11px] text-cyan-100/80 break-all select-all">
                                    {`<script defer src="https://unpkg.com/stat18ion@latest/dist/index.js" data-site-id="${selectedSiteForCode.id}"></script>`}
                                </div>
                            </div>

                            {/* Middleware */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">4. Unblockable (Server-Side)</div>
                                    <div className="px-2 py-0.5 border border-cyan-500/20 text-[8px] text-green-500/60 uppercase tracking-widest font-bold">Stealth</div>
                                </div>
                                <pre className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[10px] text-cyan-100/80 overflow-x-auto select-all">
                                    {`import { trackServerEvent } from 'stat18ion';

export function middleware(req) {
  trackServerEvent({ 
    siteId: '${selectedSiteForCode.id}',
    path: req.nextUrl.pathname,
    ua: req.headers.get('user-agent'),
  });
}

export const config = {
  // Aggressive filtering for static chunks, images, and system files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\\\..*).*)'],
};`}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-cyan-500/10 flex justify-between items-center sticky bottom-0 bg-black py-4">
                            <div className="text-[9px] text-cyan-500/30 uppercase tracking-[0.2em]">SDK_BUNDLE_READY [v0.1.8]</div>
                            <button
                                onClick={() => setSelectedSiteForCode(null)}
                                className="px-6 py-2 bg-cyan-500 text-black font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all font-mono"
                            >
                                System Ready
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
