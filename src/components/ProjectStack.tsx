'use client';
import { useState, useRef } from 'react';
import { ExternalLink, Folder, FileCode2, TerminalSquare, Play, RotateCcw } from 'lucide-react';
import ScrambleText from './ScrambleText';

const projects = [
  {
    id: 'esp',
    filename: 'esp_core.ts',
    title: 'Engineering Services Platform',
    status: 'ONLINE',
    desc: 'An enterprise B2B/B2C platform connecting clients with field inspectors and skilled tradespeople.',
    architecture: '6-Tier RBAC (Role-Based Access Control) with Split Connection Pooling.',
    roles: ['CLIENT', 'WORKER', 'INSPECTOR', 'DISPATCH', 'ADMIN', 'SUPER_ADMIN'],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind'],
    url: 'https://esp-frontend-s719.vercel.app/'
  },
  {
    id: 'alumni',
    filename: 'connect_alumni.java',
    title: 'ConnectAlumni',
    status: 'ONLINE',
    desc: 'A scalable networking platform bridging the gap between university students and alumni for professional growth.',
    architecture: 'RESTful API with Relational Data Pipelines.',
    roles: ['STUDENT', 'ALUMNI', 'MODERATOR'],
    tech: ['Java', 'Spring Boot', 'SQL', 'Next.js'],
    url: 'https://alumni-network-frontend-sepia.vercel.app/'
  },
  {
    id: 'health',
    filename: 'health_sys.html',
    title: 'HealthCare System UI',
    status: 'STABLE',
    desc: 'A sophisticated frontend architecture designed specifically for a modern HealthCare Management System.',
    architecture: 'Fluid Grids & Strict Accessibility Web Guidelines.',
    roles: ['PATIENT', 'STAFF'],
    tech: ['HTML5', 'CSS3', 'Accessibility'],
    url: 'https://impritamk.github.io/HealthCare-Management-System/'
  }
];

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const activeProject = projects[activeIndex];

  // --- NATIVE DRAG LOGIC ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  return (
    <section className="py-32 px-[5%] md:px-16 max-w-[1400px] mx-auto relative z-10 overflow-hidden" id="projects">
      
      <div className="mb-12 border-b border-zinc-800 pb-6 flex items-end justify-between">
        <div>
          <div className="text-base font-mono uppercase tracking-widest text-zinc-100 mb-4">03 // Active Deployments</div>
          <h2 className="text-[clamp(2rem,3vw,3rem)] font-medium tracking-tight leading-[1.1]">
            <ScrambleText text="System Architectures." />
          </h2>
        </div>
      </div>

      {/* The Movable macOS Window */}
      <div 
        className="w-full max-w-5xl mx-auto bg-[#050505] border border-zinc-800 rounded-xl shadow-2xl flex flex-col font-mono relative z-20 transition-shadow hover:shadow-emerald-500/5"
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          height: '700px'
        }}
      >
        
        {/* TOP BAR (DRAGGABLE HANDLE) */}
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={resetPosition}
          className={`h-12 bg-[#111] border-b border-zinc-800 rounded-t-xl flex items-center justify-between px-4 select-none touch-none
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
        >
          {/* Mac Buttons */}
          <div className="flex gap-2 w-20">
            <button onClick={resetPosition} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center group">
              <RotateCcw size={8} className="text-red-900 opacity-0 group-hover:opacity-100" />
            </button>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>

          {/* Window Title */}
          <div className="text-xs text-zinc-500 flex items-center gap-2">
            <TerminalSquare size={14} />
            pritam@portfolio:~/_deployments
          </div>

          {/* Spacer to balance flexbox */}
          <div className="w-20"></div>
        </div>

        {/* WINDOW BODY */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar (File Explorer) */}
          <div className="w-full md:w-64 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-zinc-800 p-4 flex flex-col gap-1 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 px-2 flex items-center gap-2">
              <Folder size={12} />
              projects/
            </div>
            
            {projects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => { setActiveIndex(idx); setViewMode('code'); }}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors w-full text-left interactive
                  ${activeIndex === idx 
                    ? 'bg-zinc-800/50 text-emerald-400' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }
                `}
              >
                <FileCode2 size={14} className={activeIndex === idx ? 'text-emerald-500' : 'text-zinc-500'} />
                {proj.filename}
              </button>
            ))}
          </div>

          {/* Right Area (Editor / Preview) */}
          <div className="flex-1 flex flex-col bg-[#000] overflow-hidden">
            
            {/* Editor Tabs */}
            <div className="flex bg-[#0a0a0a] border-b border-zinc-800 text-xs">
              <button 
                onClick={() => setViewMode('code')}
                className={`px-6 py-3 flex items-center gap-2 interactive border-r border-zinc-800 ${viewMode === 'code' ? 'bg-[#000] text-emerald-400 border-t-2 border-t-emerald-500' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                <FileCode2 size={14} /> config.json
              </button>
              <button 
                onClick={() => setViewMode('preview')}
                className={`px-6 py-3 flex items-center gap-2 interactive border-r border-zinc-800 ${viewMode === 'preview' ? 'bg-[#000] text-emerald-400 border-t-2 border-t-emerald-500' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                <Play size={14} /> live_preview.sh
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto relative">
              
              {/* CODE VIEW */}
              {viewMode === 'code' && (
                <div className="p-6 md:p-8 text-sm md:text-base leading-relaxed text-zinc-300">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-zinc-500">/* SYSTEM CONFIGURATION DATA */</span>
                    <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-emerald-500 hover:text-emerald-400 border border-emerald-500/30 hover:border-emerald-500 px-3 py-1 rounded transition-colors interactive">
                      DEPLOY <ExternalLink size={12} />
                    </a>
                  </div>
                  
                  <div>
                    <span className="text-purple-400">const</span> <span className="text-blue-400">projectData</span> <span className="text-purple-400">=</span> {'{'}
                  </div>
                  
                  <div className="pl-4 md:pl-8 border-l border-zinc-800/50 ml-2">
                    <div className="py-1">
                      <span className="text-zinc-400">title:</span> <span className="text-emerald-400">"{activeProject.title}"</span>,
                    </div>
                    <div className="py-1">
                      <span className="text-zinc-400">status:</span> <span className="text-orange-400">"{activeProject.status}"</span>,
                    </div>
                    <div className="py-1">
                      <span className="text-zinc-400">description:</span> <span className="text-emerald-400">"{activeProject.desc}"</span>,
                    </div>
                    <div className="py-1">
                      <span className="text-zinc-400">architecture:</span> <span className="text-emerald-400">"{activeProject.architecture}"</span>,
                    </div>
                    
                    <div className="py-1 mt-2">
                      <span className="text-zinc-400">rbac_roles:</span> {'['}
                    </div>
                    <div className="pl-4 md:pl-8 py-1 flex flex-wrap gap-2">
                      {activeProject.roles.map((role, i) => (
                        <span key={role} className="text-emerald-400">
                          "{role}"{i < activeProject.roles.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                    <div>{']'},</div>

                    <div className="py-1 mt-2">
                      <span className="text-zinc-400">tech_stack:</span> {'['}
                    </div>
                    <div className="pl-4 md:pl-8 py-1 flex flex-wrap gap-2">
                      {activeProject.tech.map((tech, i) => (
                        <span key={tech} className="text-emerald-400">
                          "{tech}"{i < activeProject.tech.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                    <div>{']'}</div>
                  </div>
                  
                  <div>{'};'}</div>
                </div>
              )}

              {/* LIVE PREVIEW VIEW */}
              {viewMode === 'preview' && (
                <iframe 
                  src={activeProject.url} 
                  className="absolute inset-0 w-full h-full border-none bg-white" 
                  title={activeProject.title} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}