'use client';
import { useState, useEffect } from 'react';
import { Command, ArrowRight, Folder, FileText, Globe, TerminalSquare } from 'lucide-react';

const themes = {
  default: { c1: 'bg-purple-900/30', c2: 'bg-blue-900/20', c3: 'bg-emerald-900/15' },
  ocean:   { c1: 'bg-cyan-900/30',   c2: 'bg-blue-900/20', c3: 'bg-teal-900/15' },
  lava:    { c1: 'bg-red-900/30',    c2: 'bg-orange-900/20', c3: 'bg-yellow-900/15' },
  matrix:  { c1: 'bg-emerald-900/30',c2: 'bg-green-900/20', c3: 'bg-lime-900/15' }
};
const themeKeys = Object.keys(themes) as (keyof typeof themes)[];

const desktopIcons = [
  { id: 'profile', label: 'Pritam_OS', icon: Folder, color: 'text-blue-400', fill: 'fill-blue-400/20' },
  { id: 'alumni', label: 'ConnectAlumni', icon: Globe, color: 'text-orange-400', fill: '' },
  { id: 'resume', label: 'Resume.pdf', icon: FileText, color: 'text-white', fill: '' },
  { id: 'terminal', label: 'Terminal', icon: TerminalSquare, color: 'text-emerald-400', fill: '' },
];

export default function Hero() {
  const [progress, setProgress] = useState(0);
  const [bootStage, setBootStage] = useState<'loading' | 'login' | 'desktop'>('loading');
  const [themeIdx, setThemeIdx] = useState(0);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  // THE MISSING STATE DECLARATION: Fixes Error 2304
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const currentTheme = themes[themeKeys[themeIdx]];

  useEffect(() => {
    if (bootStage !== 'loading') return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setBootStage('login'), 400); 
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 5; 
      });
    }, 120);
    return () => clearInterval(interval);
  }, [bootStage]);

  useEffect(() => {
    const closeMenu = () => setContextMenu(prev => ({ ...prev, show: false }));
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (bootStage !== 'desktop') return; 
    const x = Math.min(e.clientX, window.innerWidth - 240);
    const y = Math.min(e.clientY, window.innerHeight - 200);
    setContextMenu({ show: true, x, y });
  };

  const handleLogin = () => {
    // 1. Submit State Lock prevents double rapid-fire executions!
    if (isSubmittingLogin) return; 
    if (bootStage !== 'login') return; 
    
    // 2. Lock the process immediately.
    setIsSubmittingLogin(true); 
    setBootStage('desktop');
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('launch-app', { detail: 'profile' }));
    }, 800);
  };

  const launchApp = (appId: string) => {
    window.dispatchEvent(new CustomEvent('launch-app', { detail: appId }));
    setSelectedIcon(null);
  };

  const handleIconClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Mobile Check: If screen is mobile, open immediately on single tap
    if (window.innerWidth < 768) {
      launchApp(id);
    } else {
      setSelectedIcon(id);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-0 bg-black overflow-hidden select-none"
      onContextMenu={handleContextMenu}
      onClick={() => setSelectedIcon(null)}
    >
      {/* Updated tailwind warning classes (e.g. top-[-20%]) */}
      <div className="absolute inset-0 bg-[#000000]">
        <div className={`absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full ${currentTheme.c1} blur-[120px] transition-colors duration-1000`}></div>
        <div className={`absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full ${currentTheme.c2} blur-[130px] transition-colors duration-1000`}></div>
        <div className={`absolute bottom-[-20%] left-[15%] w-[70vw] h-[70vw] rounded-full ${currentTheme.c3} blur-[140px] transition-colors duration-1000`}></div>
      </div>

      {bootStage === 'desktop' && (
        <div className="absolute top-12 right-4 md:right-6 flex flex-col gap-4 md:gap-6 z-10 p-2 md:p-4">
          {desktopIcons.map((item) => {
            const isSelected = selectedIcon === item.id;
            const Icon = item.icon;
            
            return (
              <div 
                key={item.id}
                className="flex flex-col items-center gap-1 w-20 cursor-default group touch-manipulation"
                onClick={(e) => handleIconClick(e, item.id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (window.innerWidth >= 768) launchApp(item.id);
                }}
              >
                <div className={`w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200
                  ${isSelected ? 'bg-white/20 border border-white/30 shadow-lg' : 'bg-transparent border border-transparent'}
                `}>
                  <Icon size={32} className={`${item.color} ${item.fill} drop-shadow-lg`} strokeWidth={1.5} />
                </div>
                <div className={`text-[11px] font-medium px-1.5 py-0.5 rounded text-center leading-tight tracking-wide drop-shadow-md
                  ${isSelected ? 'bg-blue-600 text-white' : 'text-zinc-100 bg-transparent'}
                `}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Updated z-9999 class */}
      {contextMenu.show && (
        <div 
          className="fixed z-9999 w-56 bg-[#1e1e1e]/80 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl py-1.5 text-[12px] font-sans text-zinc-200"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white">New Folder</button>
          <div className="h-px bg-white/10 my-1"></div>
          <button className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white" onClick={() => setThemeIdx(p => (p + 1) % themeKeys.length)}>Change Desktop Background...</button>
          <div className="h-px bg-white/10 my-1"></div>
          <button className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white" onClick={() => launchApp('terminal')}>Open Terminal</button>
          <button className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white" onClick={() => window.location.reload()}>Refresh Workspace</button>
        </div>
      )}

      {bootStage === 'loading' && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <Command size={56} className="text-zinc-200 mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" strokeWidth={1.5} />
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-200 transition-all duration-150 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div 
        className={`absolute inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-3xl bg-black/40 transition-all duration-1000 ease-in-out
          ${bootStage === 'login' ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'}
          ${bootStage === 'loading' && 'hidden'}
        `}
      >
        {/* Updated bg-linear-to-tr class */}
        <div className="w-24 h-24 rounded-full bg-linear-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center border border-zinc-500 shadow-2xl mb-4 overflow-hidden">
           <span className="text-4xl text-white font-medium drop-shadow-md">P</span>
        </div>
        <h1 className="text-xl font-semibold text-white mb-6 tracking-wide drop-shadow-lg">Pritam Poddar</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="relative flex items-center group">
          <input 
            type="password"
            placeholder="Enter Password"
            className="w-48 h-8 rounded-full bg-white/10 border border-white/20 px-4 text-xs text-white placeholder:text-white/50 backdrop-blur-md outline-none focus:bg-white/20 focus:border-white/40 transition-all pr-8 tracking-widest text-center"
            autoFocus
          />
          <button type="submit" className="absolute right-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100 focus-within:opacity-100">
            <ArrowRight size={12} className="text-white" />
          </button>
        </form>
        <div className="text-[10px] text-white/40 mt-3 font-medium">Press Enter to log in</div>
        <p className="mt-8 text-[10px] text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-2">
          <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>Software Engineer
        </p>
      </div>
    </div>
  );
}