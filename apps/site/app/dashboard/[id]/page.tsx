'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar,
    PieChart, Pie, Cell
} from 'recharts';
import {
    ArrowLeft, Terminal, Activity, Globe, Monitor, Smartphone,
    MousePointer2, UserCheck, Timer, Share2, Download, Cpu
} from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const CHART_COLORS = ['#00f3ff', '#7000ff', '#ff00c8', '#00ff41', '#ff8a00'];

export default function SiteAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showCodeSetup, setShowCodeSetup] = useState(false);

    const resolvedParams = use(params);
    const siteId = resolvedParams.id;

    useEffect(() => {
        const token = localStorage.getItem('stat18ion_token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchStats = () => {
            fetch(`${API_URL}/api/stats/${siteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (res.status === 401) throw new Error('Unauthorized');
                    return res.json();
                })
                .then((data) => {
                    setStats(data);
                    setLoading(false);
                })
                .catch(() => router.push('/dashboard'));
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [siteId, router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-mono">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-1 bg-cyan-950 overflow-hidden">
                    <div className="h-full bg-cyan-500 w-1/2 animate-[loading_1s_ease-in-out_infinite]" />
                </div>
                <span className="text-cyan-500/40 text-[10px] uppercase tracking-[0.5em] animate-pulse">Connecting to system...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-6 md:p-12 font-mono selection:bg-cyan-500/30">
            <div className="scanline" />

            {/* Header / Nav */}
            <header className="mb-12 border-b border-cyan-500/10 pb-8 relative">
                <Link href="/dashboard" className="inline-flex items-center text-[10px] text-cyan-500/40 hover:text-cyan-400 mb-6 transition-colors uppercase tracking-[0.3em] group">
                    <ArrowLeft size={12} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                    <div className="w-full lg:w-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity size={18} className="text-cyan-400 animate-pulse" />
                            <h1 className="text-4xl font-black tracking-tighter glow-text uppercase">Site Analytics</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigator.clipboard.writeText(siteId as string)}
                                className="text-[10px] text-cyan-500/60 bg-cyan-950/20 px-3 py-1 border border-cyan-500/10 uppercase tracking-widest hover:text-cyan-400 transition-colors cursor-alias"
                                title="Click to copy Site ID"
                            >
                                Site ID // {siteId}
                            </button>
                            <div className="flex items-center gap-1.5 px-3 py-1 border border-green-500/20 bg-green-500/5 text-green-500 font-bold text-[9px] uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active Visitors: {stats.live_now}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full lg:w-auto">
                        <button
                            onClick={() => {
                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2));
                                const downloadAnchorNode = document.createElement('a');
                                downloadAnchorNode.setAttribute("href", dataStr);
                                downloadAnchorNode.setAttribute("download", `stat18ion_export_${siteId}.json`);
                                document.body.appendChild(downloadAnchorNode);
                                downloadAnchorNode.click();
                                downloadAnchorNode.remove();
                            }}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 border border-cyan-500/20 text-cyan-500/60 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 text-xs uppercase tracking-widest transition-all"
                        >
                            <Download size={14} /> Export Data
                        </button>
                        <button
                            onClick={() => setShowCodeSetup(true)}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-cyan-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all font-mono"
                        >
                            <Terminal size={14} /> Setup Guide
                        </button>
                    </div>
                </div>
            </header>

            <main className="space-y-8">
                {/* KPI Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Visitors', val: stats.total_views, icon: <MousePointer2 size={16} /> },
                        { label: 'Unique Visitors', val: stats.unique_visitors, icon: <UserCheck size={16} /> },
                        { label: 'Avg Load Time', val: '240ms', icon: <Timer size={16} /> },
                        { label: 'Uptime', val: '99.9%', icon: <Share2 size={16} /> }
                    ].map((idx, i) => (
                        <div key={i} className="terminal-border p-6 bg-cyan-950/10 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors">
                                {idx.icon}
                            </div>
                            <h3 className="text-[10px] text-cyan-500/40 uppercase tracking-[0.2em] mb-2 font-bold">{idx.label}</h3>
                            <p className="text-4xl font-black text-cyan-100 group-hover:glow-text transition-all duration-500">{idx.val}</p>
                        </div>
                    ))}
                </div>

                {/* Main Visualization */}
                <div className="terminal-border bg-cyan-950/20 p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-cyan-100 uppercase tracking-[0.2em]">Traffic History // PAGE VIEWS</h3>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            <span className="text-[9px] text-cyan-500/60 uppercase tracking-widest font-bold">Last 7 Days</span>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.daily_views}>
                                <defs>
                                    <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    stroke="#00f3ff"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={{ stroke: 'rgba(0, 243, 255, 0.1)' }}
                                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                />
                                <YAxis
                                    stroke="#00f3ff"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={{ stroke: 'rgba(0, 243, 255, 0.1)' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0, 30, 35, 0.9)', border: '1px solid rgba(0, 243, 255, 0.2)', fontSize: '10px' }}
                                    itemStyle={{ color: '#00f3ff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#00f3ff"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#glowGradient)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Data Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Hardware Stats */}
                    {/* Browser Log */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Browser Distribution */}
                        <div className="terminal-border bg-cyan-950/10 p-6 space-y-6">
                            <h3 className="text-xs font-bold text-cyan-200 uppercase tracking-widest border-b border-cyan-500/10 pb-4 flex items-center gap-2">
                                <Monitor size={14} className="text-cyan-500" /> Browser Distribution
                            </h3>
                            <div className="space-y-6">
                                {stats.top_browsers.map((b: any, i: number) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                            <span className="text-cyan-100">{b.browser}</span>
                                            <span className="text-cyan-500/60">{b.count} Views</span>
                                        </div>
                                        <div className="h-1 bg-cyan-500/5 overflow-hidden">
                                            <div
                                                className="h-full bg-cyan-500 transition-all duration-1000 ease-out"
                                                style={{ width: `${(b.count / stats.total_views) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* OS Distribution */}
                        <div className="terminal-border bg-cyan-950/10 p-6 space-y-6">
                            <h3 className="text-xs font-bold text-cyan-200 uppercase tracking-widest border-b border-cyan-500/10 pb-4 flex items-center gap-2">
                                <Cpu size={14} className="text-cyan-500" /> OS Distribution
                            </h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.top_os}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="os"
                                        >
                                            {stats.top_os.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'black', border: '1px solid #333', fontSize: '10px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {stats.top_os.map((os: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-cyan-500/60 font-bold">
                                        <div className="w-1.5 h-1.5" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                        {os.os}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Log */}
                    <div className="terminal-border bg-cyan-950/20 flex flex-col">
                        <div className="p-4 bg-cyan-500/5 border-b border-cyan-500/10">
                            <h3 className="text-xs font-bold text-cyan-100 uppercase tracking-widest flex items-center gap-2">
                                <Globe size={14} className="text-cyan-500" /> Top Pages
                            </h3>
                        </div>
                        <div className="flex-1 overflow-auto max-h-[400px]">
                            <table className="w-full text-left font-mono text-[10px]">
                                <thead className="sticky top-0 bg-black uppercase tracking-widest text-cyan-500/40 font-bold">
                                    <tr>
                                        <th className="p-4 border-b border-cyan-500/10">Relative URL</th>
                                        <th className="p-4 border-b border-cyan-500/10 text-right">Views</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-cyan-500/5">
                                    {stats.top_pages.map((p: any, i: number) => (
                                        <tr key={i} className="hover:bg-cyan-500/5 transition-colors group">
                                            <td className="p-4 text-cyan-100 group-hover:text-cyan-400 truncate max-w-[150px]">{p.path}</td>
                                            <td className="p-4 text-right text-cyan-500/80 font-bold">{p.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Setup Guide Modal */}
            {showCodeSetup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-black border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(0,243,255,0.1)] p-8 relative">
                        <div className="flex justify-between items-center mb-6 text-left sticky top-0 bg-black z-10 pb-4">
                            <h2 className="text-xl font-bold text-cyan-100 uppercase tracking-widest">Setup Instructions</h2>
                            <button
                                onClick={() => setShowCodeSetup(false)}
                                className="text-cyan-500/40 hover:text-red-500 transition-colors font-bold text-xs"
                            >
                                [ CLOSE ]
                            </button>
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
  siteId: '${siteId}', 
  debug: false,
  trackLocal: false
});`}
                                </pre>
                            </div>

                            {/* Script tag */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">2. Static Script (Zero-Config)</div>
                                    <div className="px-2 py-0.5 border border-cyan-500/20 text-[8px] text-cyan-500/40 uppercase tracking-widest">CDN</div>
                                </div>
                                <div className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[11px] text-cyan-100/80 break-all select-all">
                                    {`<script defer src="https://unpkg.com/stat18ion@latest/dist/index.js" data-site-id="${siteId}"></script>`}
                                </div>
                                <p className="text-[9px] text-cyan-500/40 uppercase tracking-widest leading-relaxed">
                                    We use **unpkg** for global delivery. Best for static sites (HTML/Liquid) where NPM is not available.
                                </p>
                            </div>

                            {/* Middleware */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">3. Unblockable (Server-Side)</div>
                                    <div className="px-2 py-0.5 border border-cyan-500/20 text-[8px] text-green-500/60 uppercase tracking-widest font-bold">Stealth</div>
                                </div>
                                <pre className="bg-cyan-950/20 border border-cyan-500/10 p-4 font-mono text-[10px] text-cyan-100/80 overflow-x-auto select-all">
                                    {`import { trackServerEvent } from 'stat18ion';

export function middleware(req) {
  trackServerEvent(req, { 
    siteId: '${siteId}' 
  });
}`}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-cyan-500/10 flex justify-between items-center sticky bottom-0 bg-black py-4">
                            <div className="text-[9px] text-cyan-500/30 uppercase tracking-[0.2em]">SDK_BUNDLE_READY [v0.1.3]</div>
                            <button
                                onClick={() => setShowCodeSetup(false)}
                                className="px-6 py-2 bg-cyan-500 text-black font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all font-mono"
                            >
                                MISSION_READY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="mt-20 pt-12 border-t border-cyan-500/10 opacity-20 flex justify-between text-[8px] uppercase tracking-[0.4em]">
                <div>System Status: OPERATIONAL</div>
                <div>Stat18ion Analytics v0.1.3</div>
            </footer>
        </div>
    );
}
