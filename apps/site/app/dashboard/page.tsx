'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function DashboardPage() {
    const router = useRouter();
    const [sites, setSites] = useState<any[]>([]);
    const [newSiteName, setNewSiteName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

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

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                <h1 className="text-3xl font-bold tracking-tight">Your Sites</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-medium transition-colors"
                >
                    <Plus size={16} /> New Site
                </button>
            </header>

            {isCreating && (
                <form onSubmit={handleCreateSite} className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-xl max-w-md animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-4">Add a new site</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Site Name (e.g. My Portfolio)"
                            value={newSiteName}
                            onChange={(e) => setNewSiteName(e.target.value)}
                            className="flex-1 p-2 bg-zinc-950 border border-zinc-800 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <button type="submit" className="px-4 py-2 bg-white text-black rounded font-medium">Create</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site) => (
                    <Link href={`/dashboard/${site.id}`} key={site.id} className="block group">
                        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-blue-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">{site.name}</h3>
                                    <p className="text-xs text-zinc-500 font-mono mt-1">{site.domain || 'No domain configured'}</p>
                                </div>
                                <ArrowRight className="text-zinc-600 group-hover:text-blue-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <div className="mt-4 pt-4 border-t border-zinc-800/50">
                                <p className="text-xs text-zinc-500">Site ID:</p>
                                <code className="text-xs text-zinc-400 bg-zinc-950 px-2 py-1 rounded block mt-1 overflow-hidden text-ellipsis">{site.id}</code>
                            </div>
                        </div>
                    </Link>
                ))}

                {sites.length === 0 && !isCreating && (
                    <div className="col-span-full text-center py-20 text-zinc-500">
                        You haven't added any sites yet. Click "New Site" to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
