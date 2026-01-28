'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, ArrowRight, LayoutGrid, Activity, ShieldCheck, Search, Terminal } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function DashboardPage() {
    const router = useRouter();
    const [sites, setSites] = useState<any[]>([]);
    const [newSiteName, setNewSiteName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
            body: JSON.stringify({ name: newSiteName }),
        });

        if (res.ok) {
            const site = await res.json();
            setSites([site, ...sites]);
            setNewSiteName('');
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
                        <Activity size={10} className="animate-pulse" /> {/* // Cluster_Active_Node // */}
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter glow-text uppercase">Matrix_Overview</h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH_NODES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-cyan-950/20 border border-cyan-500/20 px-10 py-2.5 text-xs text-cyan-100 placeholder:text-cyan-500/20 focus:outline-none focus:border-cyan-400/50 transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="flex items-center gap-3 px-6 py-2.5 bg-cyan-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} /> Initialize_Node
                    </button>
                    <button
                        onClick={() => { localStorage.removeItem('stat18ion_token'); router.push('/login'); }}
                        className="p-2.5 border border-red-500/20 text-red-500/60 hover:bg-red-500/10 transition-colors"
                        title="TERMINATE_SESSION"
                    >
                        <ShieldCheck size={18} />
                    </button>
                </div>
            </div>

            {/* New Site UI */}
            {isCreating && (
                <div className="mb-12 terminal-border bg-cyan-950/20 p-8 max-w-2xl animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2 mb-6 text-cyan-400 text-xs uppercase tracking-widest font-bold">
                        <Terminal size={14} /> Node_Configuration_Wizard
                    </div>
                    <form onSubmit={handleCreateSite} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-cyan-500/60 uppercase tracking-widest">Entry://Name</label>
                            <input
                                type="text"
                                placeholder="E.G. PROJECT_ALFA"
                                value={newSiteName}
                                onChange={(e) => setNewSiteName(e.target.value)}
                                className="w-full bg-black/40 border border-cyan-500/20 p-3 text-sm text-cyan-100 focus:outline-none focus:border-cyan-400 transition-colors"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-4 pt-2">
                            <button type="submit" className="flex-1 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all">
                                CREATE_IDENTITY
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-6 py-3 border border-red-500/20 text-red-500/60 hover:bg-red-500/10 text-xs uppercase tracking-widest font-bold"
                            >
                                ABORT
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSites.map((site) => (
                    <Link href={`/dashboard/${site.id}`} key={site.id} className="group">
                        <div className="p-8 terminal-border bg-cyan-950/5 hover:bg-cyan-500/[0.03] hover:border-cyan-400/50 transition-all duration-500 relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/[0.02] -rotate-45 translate-x-8 -translate-y-8" />

                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-cyan-100 group-hover:text-cyan-400 transition-colors uppercase tracking-tighter">
                                        {site.name}
                                    </h3>
                                    <p className="text-[10px] text-cyan-500/40 uppercase tracking-[0.2em]">
                                        {site.domain || 'LINK_RESERVED'}
                                    </p>
                                </div>
                                <div className="p-2 border border-cyan-500/10 group-hover:border-cyan-400/30 transition-colors">
                                    <ArrowRight className="text-cyan-500/40 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" size={16} />
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
                                    <p className="text-[9px] text-cyan-500/30 uppercase tracking-[0.3em] mb-1">NODE_ID</p>
                                    <div className="font-mono text-[10px] text-cyan-500/60 bg-black/40 px-3 py-2 border border-cyan-500/5 group-hover:border-cyan-500/20 truncate transition-colors">
                                        {site.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredSites.length === 0 && (
                    <div className="col-span-full py-32 border border-dashed border-cyan-500/10 flex flex-col items-center justify-center opacity-30 text-center animate-pulse">
                        <LayoutGrid size={48} className="mb-4 text-cyan-500" />
                        <p className="font-mono text-xs uppercase tracking-widest">
                            {searchQuery ? 'NO_MATCHING_NODES_FOUND' : 'CLUSTER_EMPTY_AWAITING_INITIALIZATION'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
