import Link from "next/link";
import { Terminal, Cpu, Globe, Zap, Shield, BarChart3, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="scanline" />

      {/* Header / System Status */}
      <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center border-b border-cyan-500/10 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-10 h-10 border border-cyan-500/30 flex items-center justify-center bg-cyan-950/20 group-hover:border-cyan-400 transition-colors duration-500 relative overflow-hidden">
            <BarChart3 size={20} className="text-cyan-400" />
            <div className="absolute inset-0 bg-cyan-400/5 animate-pulse" />
          </div>
          <span className="font-mono text-xl font-bold tracking-tighter glow-text uppercase">Stat18ion<span className="animate-pulse">_</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-cyan-500/60">
          <Link href="#features" className="hover:text-cyan-400 transition-colors">/Features</Link>
          <Link href="#frameworks" className="hover:text-cyan-400 transition-colors">/Frameworks</Link>
          <Link href="/login" className="px-4 py-2 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all">/Login</Link>
        </nav>
      </header>

      <main className="w-full max-w-7xl px-6 flex-1 flex flex-col items-center justify-center py-20 lg:py-32 relative">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
        <div className="absolute bottom-1/4 right-0 w-32 h-px bg-gradient-to-l from-cyan-500/20 to-transparent" />

        {/* Hero Section */}
        <section className="text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/20 bg-cyan-950/20 font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-4 animate-in fade-in slide-in-from-bottom-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            System Status: Operational [v0.1.2]
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-800 drop-shadow-sm leading-tight">
            ANALYTICS<br />FOR MINIMALISTS
          </h1>

          <p className="max-w-2xl mx-auto font-mono text-sm md:text-base text-cyan-200/60 leading-relaxed uppercase tracking-wide">
            unblockable tracking. zero client-side latency. privacy by default.
            the terminal-grade analytics engine for modern developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/register"
              className="group relative px-8 py-4 bg-cyan-500 text-black font-mono font-bold uppercase tracking-widest transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
              <span className="relative z-10 flex items-center gap-2">Initialize Setup <ChevronRight size={18} /></span>
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 border border-cyan-500/30 text-cyan-400 font-mono font-bold uppercase tracking-widest hover:bg-cyan-500/10 transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </section>

        {/* Console Demo */}
        <section className="w-full max-w-3xl mt-24 terminal-border bg-black/40 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-2 px-4 py-2 bg-cyan-950/40 border-b border-cyan-500/10">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 font-mono text-[10px] text-cyan-500/40 tracking-widest uppercase">stat18ion@terminal:~</span>
          </div>
          <div className="p-6 font-mono text-sm md:text-base space-y-2">
            <div className="flex gap-3">
              <span className="text-cyan-500">λ</span>
              <span className="text-white">npm install stat18ion</span>
            </div>
            <div className="text-cyan-500/60 leading-relaxed pt-2">
              <p>+ stat18ion@0.1.2</p>
              <p>added 1 package, and audited 12 packages in 402ms</p>
            </div>
            <div className="flex gap-3 pt-4">
              <span className="text-cyan-500">λ</span>
              <span className="text-white">cat middleware.ts</span>
            </div>
            <div className="bg-cyan-950/20 p-4 border-l-2 border-cyan-500 text-cyan-100/80 mt-2">
              <p><span className="text-cyan-500">import</span> &#123; trackServerEvent &#125; <span className="text-cyan-500">from</span> 'stat18ion';</p>
              <p className="mt-2 text-cyan-500/40">// Zero-config unblockable tracking</p>
              <p><span className="text-cyan-500">export function</span> middleware(req) &#123;</p>
              <p>&nbsp;&nbsp;trackServerEvent(&#123; siteId: 'FF21', path: req.url &#125;);</p>
              <p>&#125;</p>
            </div>
          </div>
        </section>

        {/* Framework Showcase */}
        <section id="frameworks" className="w-full mt-32 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-mono text-2xl font-bold tracking-widest uppercase text-cyan-100 italic">Compatible_Environments</h2>
            <div className="w-24 h-px bg-cyan-500 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['Next.js', 'Nuxt', 'Astro', 'Remix', 'React', 'Vue', 'Svelte', 'Vanilla'].map((f) => (
              <div key={f} className="terminal-border bg-cyan-950/10 p-4 flex flex-col items-center gap-3 group hover:border-cyan-400 transition-all duration-300">
                <Terminal size={24} className="text-cyan-500/40 group-hover:text-cyan-400 transition-colors" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500/60 group-hover:text-cyan-200">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap />, title: "ZERO JS", desc: "Track events via server-side middleware. No impact on Core Web Vitals." },
            { icon: <Shield />, title: "UNBLOCKABLE", desc: "Since requests originate from your server, ad-blockers can't touch them." },
            { icon: <Cpu />, title: "ENRICHED DATA", desc: "Automatic Browser, OS, and Device detection with zero extra config." }
          ].map((feat, i) => (
            <div key={i} className="p-8 terminal-border bg-cyan-950/10 space-y-4 hover:bg-cyan-900/10 transition-colors group">
              <div className="text-cyan-500 group-hover:scale-110 transition-transform duration-500">{feat.icon}</div>
              <h3 className="font-mono font-bold tracking-widest uppercase text-cyan-100">{feat.title}</h3>
              <p className="font-mono text-xs text-cyan-200/40 leading-relaxed uppercase">{feat.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="w-full max-w-7xl px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-cyan-500/10 mt-20 opacity-50 font-mono text-[10px] uppercase tracking-[0.3em]">
        <p>© 2026 STAT18ION CORE // ALL RIGHTS RESERVED</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Github</a>
        </div>
      </footer>
    </div>
  );
}
