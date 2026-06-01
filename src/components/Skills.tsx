'use client';
import { Database, Code2, Server, Layers } from 'lucide-react';
import ScrambleText from './ScrambleText';

export default function Skills() {
  return (
    <section className="py-32 px-[5%] md:px-16 max-w-[1400px] mx-auto relative z-10" id="skills">
      
      {/* Section Header */}
      <div className="mb-12 border-b border-os-border pb-6">
        <div className="text-base font-mono uppercase tracking-widest text-zinc-100">02 // Technical Arsenal</div>
      </div>

      <div className="mb-12">
        <h2 className="text-[clamp(2rem,3vw,3rem)] font-medium tracking-tight leading-[1.1] mb-4">
          <ScrambleText text="Architecture & Logic." />
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl">
          A modular breakdown of my active development stack, highlighting established core languages and framework ecosystem.
        </p>
      </div>

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
        
        {/* 1. Core Languages (Spans 2 columns) */}
        <div className="md:col-span-2 bg-[#050505] border border-os-border rounded-2xl p-8 hover:border-zinc-700 transition-colors group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 border border-os-border rounded-lg">
                <Server size={20} className="text-os-text" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100">Core Engines</h3>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap relative z-10">
            {['Java', 'Python', 'C'].map((skill) => (
              <span key={skill} className="px-5 py-2.5 bg-zinc-900/50 border border-os-border rounded-lg text-os-text text-sm font-medium hover:bg-zinc-800 hover:border-zinc-600 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Database */}
        <div className="md:col-span-1 bg-[#050505] border border-os-border rounded-2xl p-8 hover:border-zinc-700 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 border border-os-border rounded-lg">
                <Database size={20} className="text-os-text" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100">Storage</h3>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <span className="px-5 py-2.5 bg-zinc-900/50 border border-os-border rounded-lg text-os-text text-sm font-medium hover:bg-zinc-800 hover:border-zinc-600 transition-colors cursor-default w-full text-center">
              SQL
            </span>
          </div>
        </div>

        {/* 3. Frontend / Web */}
        <div className="md:col-span-1 bg-[#050505] border border-os-border rounded-2xl p-8 hover:border-zinc-700 transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-zinc-900 border border-os-border rounded-lg">
              <Code2 size={20} className="text-os-text" />
            </div>
            <h3 className="text-lg font-medium text-zinc-100">Web Basics</h3>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {['JavaScript', 'HTML5', 'CSS3'].map((skill) => (
              <span key={skill} className="px-4 py-2 bg-zinc-900/50 border border-os-border rounded-lg text-os-text text-sm hover:text-zinc-100 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Frameworks (React & Node) */}
        <div className="md:col-span-1 bg-[#050505] border border-os-border rounded-2xl p-8 hover:border-zinc-700 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 border border-os-border rounded-lg">
                <Layers size={20} className="text-os-text" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100">Frameworks</h3>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {['Node.js', 'React.js'].map((skill) => (
              <span key={skill} className="px-5 py-2.5 bg-zinc-800/30 border border-zinc-700/50 text-os-text rounded-lg text-sm font-medium hover:border-zinc-600 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Vibe Coding (Muted Code Snippet) */}
        <div className="md:col-span-1 bg-[#020202] border border-os-border/50 rounded-2xl p-8 flex flex-col justify-between group cursor-default font-mono">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">sys.config // OP_MODE</span>
          </div>
          
          <div className="flex flex-col gap-2 text-sm">
            <div className="text-zinc-500 mb-2">/* Vibe Coding Protocol */</div>
            <div className="text-os-text">
              <span className="text-zinc-600">const</span> state <span className="text-zinc-600">=</span> <span className="text-emerald-500/70">"FLOW"</span>;
            </div>
            <div className="text-os-text">
              <span className="text-zinc-600">let</span> overthinking <span className="text-zinc-600">=</span> <span className="text-orange-500/70">false</span>;
            </div>
            <div className="text-os-text">
              <span className="text-zinc-600">const</span> output <span className="text-zinc-600">=</span> <span className="text-emerald-500/70">"IMMACULATE"</span>;
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}