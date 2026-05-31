'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Server, Database, Code2, Terminal, Trophy } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SkillsBento() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".bento-card", 
        { opacity: 0, y: 30 }, 
        { 
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" }, 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" 
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-[5%] md:px-16 max-w-[1400px] mx-auto border-t border-zinc-800" id="skills">
      
      <div className="mb-16 border-b border-zinc-800 pb-6">
        <div className="text-base font-mono uppercase tracking-widest text-zinc-100">03 // Technical Skills</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Wide Card */}
        <div className="bento-card opacity-0 md:col-span-2 bg-[#0a0a0a] border border-zinc-800 p-10 rounded-2xl flex flex-col gap-4 hover:bg-[#151515] transition-colors duration-500 group">
          <Server className="w-8 h-8 text-zinc-100 mb-2 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-xl font-semibold text-zinc-100">Backend Architecture</h3>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-md">Building robust server-side logic and scalable APIs primarily using Java, Python, and modern backend frameworks.</p>
        </div>

        {/* Standard Cards */}
        <div className="bento-card opacity-0 bg-[#0a0a0a] border border-zinc-800 p-10 rounded-2xl flex flex-col gap-4 hover:bg-[#151515] transition-colors duration-500 group">
          <Database className="w-8 h-8 text-zinc-100 mb-2 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-xl font-semibold text-zinc-100">Relational Logic</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">SQL Database management, schema design, and seamless integrations.</p>
        </div>

        <div className="bento-card opacity-0 bg-[#0a0a0a] border border-zinc-800 p-10 rounded-2xl flex flex-col gap-4 hover:bg-[#151515] transition-colors duration-500 group">
          <Code2 className="w-8 h-8 text-zinc-100 mb-2 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-xl font-semibold text-zinc-100">HackerRank: Java</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">5-Star Rating, demonstrating deep algorithmic competence.</p>
        </div>

        <div className="bento-card opacity-0 bg-[#0a0a0a] border border-zinc-800 p-10 rounded-2xl flex flex-col gap-4 hover:bg-[#151515] transition-colors duration-500 group">
          <Terminal className="w-8 h-8 text-zinc-100 mb-2 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-xl font-semibold text-zinc-100">Data Manipulation</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">Proficient in Pandas, DSA, and complex problem-solving workflows.</p>
        </div>

        <div className="bento-card opacity-0 bg-[#0a0a0a] border border-zinc-800 p-10 rounded-2xl flex flex-col gap-4 hover:bg-[#151515] transition-colors duration-500 group">
          <Trophy className="w-8 h-8 text-zinc-100 mb-2 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-xl font-semibold text-zinc-100">Code Arena 2k25</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">Secured 3rd Position in competitive programming.</p>
        </div>

      </div>
    </section>
  );
}