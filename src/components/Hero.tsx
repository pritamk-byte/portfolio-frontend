'use client';
import { useState, useEffect, useRef } from 'react';
import { Command, ArrowRight, Folder, FileText, Globe, TerminalSquare, Gamepad2, Crosshair, FileCode } from 'lucide-react';

const wallpapers = [
  { id: 'default-blur', type: 'css', name: 'Dynamic Aura' },
  { id: 'monterey', type: 'image', name: 'Monterey Abstract', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
  { id: 'ventura', type: 'image', name: 'Ventura Waves', url: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2564&auto=format&fit=crop' },
  { id: 'big-sur', type: 'image', name: 'Big Sur Coast', url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2564&auto=format&fit=crop' },
  { id: 'catalina', type: 'image', name: 'Catalina Island', url: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=2564&auto=format&fit=crop' },
  { id: 'yosemite', type: 'image', name: 'Yosemite Valley', url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2564&auto=format&fit=crop' },
  { id: 'sonoma', type: 'image', name: 'Sonoma Horizon', url: 'https://images.unsplash.com/photo-1506744626753-1fa28f673b0c?q=80&w=2564&auto=format&fit=crop' },
  { id: 'mojave', type: 'image', name: 'Mojave Night', url: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2564&auto=format&fit=crop' },
  { id: 'aurora', type: 'image', name: 'Aurora Borealis', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2564&auto=format&fit=crop' }
];

const desktopIcons = [
  { id: 'profile', label: 'Pritam_OS', icon: Folder, color: 'text-blue-400', fill: 'fill-blue-400/20' },
  { id: 'guide', label: 'commands.txt', icon: FileCode, color: 'text-zinc-300', fill: '' },
  { id: 'alumni', label: 'ConnectAlumni', icon: Globe, color: 'text-orange-400', fill: '' },
  { id: 'resume', label: 'Resume.pdf', icon: FileText, color: 'text-white', fill: '' },
  { id: 'terminal', label: 'Terminal', icon: TerminalSquare, color: 'text-emerald-400', fill: '' },
  { id: 'snake', label: 'Data Worm', icon: Gamepad2, color: 'text-emerald-400', fill: '' },
  { id: 'minesweeper', label: 'Cyber Sweeper', icon: Crosshair, color: 'text-red-400', fill: '' },
];

// --- DRAGGABLE PHYSICS ENGINE COMPONENT ---
function DraggableIcon({ 
  item, index, isSelected, onClick, onDoubleClick 
}: { 
  item: any, index: number, isSelected: boolean, onClick: (e: React.MouseEvent, id: string) => void, onDoubleClick: (id: string) => void 
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const originalPos = useRef({ x: 0, y: 0 });

  // Calculate initial position on mount (Auto-wrapping grid)
  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const rightMargin = screenWidth < 768 ? 20 : 40;
    const topMargin = 60;
    const verticalSpacing = 100;
    const horizontalSpacing = 90;
    
    const maxPerColumn = Math.max(1, Math.floor((screenHeight - topMargin - 120) / verticalSpacing));
    const column = Math.floor(index / maxPerColumn);
    const row = index % maxPerColumn;
    
    setPos({
      x: screenWidth - rightMargin - 80 - (column * horizontalSpacing),
      y: topMargin + (row * verticalSpacing)
    });
    
    setIsReady(true);
  }, [index]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick(e as unknown as React.MouseEvent, item.id);
    setIsDragging(true);
    
    originalPos.current = { x: pos.x, y: pos.y }; 
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      let newX = e.clientX - dragStart.current.x;
      let newY = e.clientY - dragStart.current.y;

      const iconWidth = 80;  
      const iconHeight = 100; 
      const topBarHeight = 28;
      const dockHeight = 100;

      // Keep within viewport constraints
      newX = Math.max(0, Math.min(window.innerWidth - iconWidth, newX));
      newY = Math.max(topBarHeight, Math.min(window.innerHeight - dockHeight - iconHeight, newY));

      setPos({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Grid Element Collision Engine
    const currentRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const allIcons = document.querySelectorAll('.desktop-icon');
    let hasOverlap = false;
    const buffer = 15;

    allIcons.forEach(icon => {
      if (icon === e.currentTarget) return; 
      
      const rect = icon.getBoundingClientRect();
      
      if (
        currentRect.left < rect.right + buffer &&
        currentRect.right > rect.left - buffer &&
        currentRect.top < rect.bottom + buffer &&
        currentRect.bottom > rect.top - buffer
      ) {
        hasOverlap = true;
      }
    });

    // Snap smoothly backwards to previous safe matrix spot if dropped on another item
    if (hasOverlap) {
      setPos({ x: originalPos.current.x, y: originalPos.current.y });
    }
  };

  if (!isReady) return null;

  const Icon = item.icon;

  return (
    <div 
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(item.id); }}
      className={`absolute flex flex-col items-center gap-1 w-20 group touch-none desktop-icon
        ${isDragging ? 'cursor-grabbing z-50 transition-none' : 'cursor-default z-10 transition-all duration-300 ease-out'}
      `}
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
    >
      <div className={`w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200
        ${isSelected ? 'bg-white/20 border border-white/30 shadow-lg' : 'bg-transparent border border-transparent'}
      `}>
        <Icon size={32} className={`${item.color} ${item.fill} drop-shadow-lg`} strokeWidth={1.5} />
      </div>
      <div className={`text-[11px] font-medium px-1.5 py-0.5 rounded text-center leading-tight tracking-wide drop-shadow-md select-none
        ${isSelected ? 'bg-blue-600 text-white' : 'text-zinc-100 bg-transparent'}
      `}>
        {item.label}
      </div>
    </div>
  );
}

// --- MAIN HERO COMPONENT ---
export default function Hero() {
  const [progress, setProgress] = useState(0);
  const [bootStage, setBootStage] = useState<'loading' | 'login' | 'desktop'>('loading');
  const [themeIdx, setThemeIdx] = useState(1);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const currentWallpaper = wallpapers[themeIdx];

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
    if (isSubmittingLogin) return; 
    if (bootStage !== 'login') return; 
    
    setIsSubmittingLogin(true); 
    setBootStage('desktop');
    
    window.dispatchEvent(new Event('system-unlock')); 
    
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
      
      {/* THE WALLPAPER LAYER */}
      <div className="absolute inset-0 bg-[#000000] transition-all duration-1000">
        {currentWallpaper.type === 'css' ? (
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/30 blur-[120px] transition-colors duration-1000"></div>
            <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 blur-[130px] transition-colors duration-1000"></div>
            <div className="absolute bottom-[-20%] left-[15%] w-[70vw] h-[70vw] rounded-full bg-emerald-900/15 blur-[140px] transition-colors duration-1000"></div>
          </>
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 opacity-90"
            style={{ backgroundImage: `url(${currentWallpaper.url})` }}
          />
        )}
      </div>

      {/* RENDER DRAGGABLE ICONS */}
      {bootStage === 'desktop' && (
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="relative w-full h-full pointer-events-auto">
            {desktopIcons.map((item, index) => (
              <DraggableIcon 
                key={item.id}
                item={item}
                index={index}
                isSelected={selectedIcon === item.id}
                onClick={handleIconClick}
                onDoubleClick={() => {
                  if (window.innerWidth >= 768) launchApp(item.id);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* CONTEXT MENU */}
      {contextMenu.show && (
        <div 
          className="fixed z-[9999] w-56 bg-[#1e1e1e]/80 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl py-1.5 text-[12px] font-sans text-zinc-200"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white">New Folder</button>
          <div className="h-px bg-white/10 my-1"></div>
          
          <div className="px-4 py-1 text-zinc-500 font-semibold text-[10px] tracking-wider uppercase">Wallpaper</div>
          <button 
            className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white flex justify-between items-center" 
            onClick={() => setThemeIdx(p => (p + 1) % wallpapers.length)}
          >
            <span>Next Background</span>
            <span className="text-zinc-500 text-[10px]">{currentWallpaper.name}</span>
          </button>
          
          <div className="h-px bg-white/10 my-1"></div>
          <button className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white" onClick={() => launchApp('terminal')}>Open Terminal</button>
          <button className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white" onClick={() => window.location.reload()}>Refresh Workspace</button>
        </div>
      )}

      {/* BOOT SCREEN */}
      {bootStage === 'loading' && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <Command size={56} className="text-zinc-200 mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" strokeWidth={1.5} />
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-200 transition-all duration-150 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* LOGIN PROFILE SCREEN */}
      <div 
        className={`absolute inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-3xl bg-black/40 transition-all duration-1000 ease-in-out
          ${bootStage === 'login' ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'}
          ${bootStage === 'loading' && 'hidden'}
        `}
      >
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