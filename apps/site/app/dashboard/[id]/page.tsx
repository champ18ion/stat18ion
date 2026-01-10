'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SiteAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Unwrapping params Promise (Next.js 15+ requirement)
    const resolvedParams = use(params);
    const siteId = resolvedParams.id;

    useEffect(() => {
        const token = localStorage.getItem('stat18ion_token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetch(`${API_URL}/api/stats/${siteId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (res.status === 401) throw new Error('Unauthorized');
                if (res.status === 403) throw new Error('Access Denied');
                return res.json();
            })
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => router.push('/dashboard'));
    }, [siteId, router]);

    if (loading) return <div className="p-8 text-white">Loading stats...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <header className="mb-8 pb-4 border-b border-zinc-800">
                <Link href="/dashboard" className="flex items-center text-sm text-zinc-500 hover:text-white mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Sites
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                        <p className="text-zinc-500 mt-1 font-mono text-sm">ID: {siteId}</p>
                    </div>
                    <div className="hidden md:block">
                        <code className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-2 rounded text-zinc-400">
                            npm install stat18ion
                        </code>
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Total Views</h3>
                    <p className="text-3xl font-bold mt-2">{stats.total_views}</p>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Unique Visitors</h3>
                    <p className="text-3xl font-bold mt-2">{stats.unique_visitors}</p>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Live Now</h3>
                    <p className="text-3xl font-bold mt-2 text-green-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        -
                    </p>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Bounce Rate</h3>
                    <p className="text-3xl font-bold mt-2">- %</p>
                </div>
            </div>

            {/* Main Chart */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl h-80 mb-8">
                <h3 className="text-lg font-semibold mb-6 text-zinc-200">Views (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.daily_views}>
                        <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: '#3f3f46' }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#1d4ed8' }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Top Pages */}
                <div className="p-0 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                        <h3 className="font-semibold text-zinc-200">Top Pages</h3>
                    </div>
                    <ul className="divide-y divide-zinc-800/50">
                        {stats.top_pages.map((page: any, i: number) => (
                            <li key={i} className="flex justify-between items-center p-4 hover:bg-zinc-900/50 transition-colors">
                                <span className="text-sm font-mono text-zinc-400 truncate max-w-[200px]">{page.path}</span>
                                <span className="text-sm font-bold">{page.count}</span>
                            </li>
                        ))}
                        {stats.top_pages.length === 0 && <li className="p-4 text-center text-zinc-500 text-sm">No data yet</li>}
                    </ul>
                </div>

                {/* Top Referrers */}
                <div className="p-0 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                        <h3 className="font-semibold text-zinc-200">Top Sources</h3>
                    </div>
                    <ul className="divide-y divide-zinc-800/50">
                        {stats.top_referrers.map((ref: any, i: number) => (
                            <li key={i} className="flex justify-between items-center p-4 hover:bg-zinc-900/50 transition-colors">
                                <span className="text-sm text-zinc-400 truncate max-w-[200px]">{ref.referrer || 'Direct / Unknown'}</span>
                                <span className="text-sm font-bold">{ref.count}</span>
                            </li>
                        ))}
                        {stats.top_referrers.length === 0 && <li className="p-4 text-center text-zinc-500 text-sm">No data yet</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}
