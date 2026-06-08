'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, FileText, Mail, GitBranch, X, Minus, Maximize2, 
  Globe, Users, User, LayoutGrid, Gamepad2, Crosshair, FileCode, Palette, 
  SquarePen, Monitor, Code2, Calculator as CalcIcon, Check, Music, Camera, 
  CloudSun, Activity, Compass, Folder, Trash2 
} from 'lucide-react';

import NetworkApp from './NetworkApp';
import NotesApp from './NotesApp';
import TerminalGuide from './TerminalGuide';
import PaintApp from './PaintApp';
import Game from './Game'; 
import CyberSweeper from './CyberSweeper';
import Finder from './Finder'; 
import InteractiveTerminal from './Terminal';
import Contact from './Contact'; 
import SystemProfile from './SystemProfile'; 
import CodeViewer from './CodeViewer';
import Calculator from './Calculator';
import VibePlayer from './VibePlayer';
import LensApp from './LensApp';
import WeatherApp from './WeatherApp';
import ActivityMonitor from './ActivityMonitor';
import BrowserApp from './BrowserApp';
import CustomFolder from './CustomFolder';
import RecycleBinApp from './RecycleBinApp';

// --- ZERO-DEPENDENCY SYNTHETIC AUDIO ENGINE ---
const playSystemSound = (type: 'pop' | 'click') => {
  if (typeof window === 'undefined') return;

  const savedVol = localStorage.getItem('pritam_os_volume');
  const masterVolume = savedVol !== null ? parseInt(savedVol) / 100 : 0.25;

  if (masterVolume === 0) return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2 * masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08 * masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    console.error("Audio API not supported");
  }
};

// --- SYSTEM APP REGISTRY ---
const SYSTEM_APPS = [
  { id: 'finder', label: 'Finder', icon: LayoutGrid, color: 'text-blue-400', title: 'Finder' },
  { id: 'profile', label: 'System Profile', icon: User, color: 'text-zinc-100', title: 'System Profile' },
  { id: 'vscode', label: 'VS Code', icon: Code2, color: 'text-blue-500', title: 'Code Viewer' },
  { id: 'calc', label: 'Calculator', icon: CalcIcon, color: 'text-orange-400', title: 'Calculator' },
  { id: 'terminal', label: 'Terminal', icon: TerminalIcon, color: 'text-emerald-400', title: 'Terminal' }, 
  { id: 'esp', label: 'ESP Platform', icon: Globe, color: 'text-blue-400', title: 'ESP Core' },
  { id: 'alumni', label: 'ConnectAlumni', icon: Users, color: 'text-orange-400', title: 'ConnectAlumni' },
  { id: 'resume', label: 'Resume.pdf', icon: FileText, color: 'text-yellow-400', title: 'Document Viewer' },
  { id: 'contact', label: 'Secure Channel', icon: Mail, color: 'text-purple-400', title: 'Mail Client' },
  { id: 'github', label: 'Repository', icon: GitBranch, color: 'text-zinc-100', title: 'GitHub' },
  { id: 'snake', label: 'Data Worm', icon: Gamepad2, color: 'text-emerald-400', title: 'Data Worm' },
  { id: 'minesweeper', label: 'Cyber Sweeper', icon: Crosshair, color: 'text-red-400', title: 'Cyber Sweeper' },
  { id: 'paint', label: 'Studio', icon: Palette, color: 'text-pink-400', title: 'Studio' },
  { id: 'notes', label: 'Notes', icon: SquarePen, color: 'text-amber-400', title: 'Notes' },
  { id: 'network', label: 'Network', icon: Users, color: 'text-indigo-400', title: 'Network' },
  { id: 'guide', label: 'commands.txt', icon: FileCode, color: 'text-os-text', title: 'Text Editor' },
  { id: 'player', label: 'VibeTunes', icon: Music, color: 'text-rose-500', title: 'Media Player' },
  { id: 'lens', label: 'Lens', icon: Camera, color: 'text-zinc-100', title: 'Camera' },
  { id: 'weather', label: 'Forecast', icon: CloudSun, color: 'text-blue-400', title: 'Weather' },
  { id: 'activity', label: 'Activity Monitor', icon: Activity, color: 'text-emerald-400', title: 'Task Manager' },
  { id: 'browser', label: 'WebSphere', icon: Compass, color: 'text-blue-400', title: 'Browser' },
  { id: 'trash', label: 'Recycle Bin', icon: Trash2, color: 'text-zinc-400', title: 'Recycle Bin' }
];

// --- 1. THE REUSABLE OS WINDOW COMPONENT ---
function DesktopWindow({ 
  id, title, icon: Icon, isActive, isMinimized, isMobile, onFocus, onMinimize, onClose, children 
}: { 
  id: string, title: string, icon: any, isActive: boolean, isMinimized: boolean, isMobile: boolean, onFocus: () => void, onMinimize: () => void, onClose: () => void, children: React.ReactNode 
}) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 900, height: 600 });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [snapPreview, setSnapPreview] = useState<'left' | 'right' | 'top' | null>(null);

  useEffect(() => {
    const w = Math.min(950, window.innerWidth * 0.9);
    const h = Math.min(650, window.innerHeight * 0.75);
    setSize({ width: w, height: h });
    setPos({
      x: (window.innerWidth - w) / 2 + (Math.floor(Math.random() * 40) - 20),
      y: (window.innerHeight - h) / 2 + (Math.floor(Math.random() * 40) - 20)
    });
    setIsReady(true);
    playSystemSound('pop'); 
  }, []);

  const handleDragDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onFocus();
    playSystemSound('click');
    if (isMaximized || isMobile) return; 
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      let nextX = e.clientX - dragStart.current.x;
      let nextY = e.clientY - dragStart.current.y;
      setPos({ x: nextX, y: nextY });

      if (e.clientX < 30) setSnapPreview('left');
      else if (e.clientX > window.innerWidth - 30) setSnapPreview('right');
      else if (e.clientY < 40) setSnapPreview('top');
      else setSnapPreview(null);
    }
  };

  const handleDragUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (snapPreview) {
      playSystemSound('pop');
      if (snapPreview === 'left') {
        setPos({ x: 0, y: 28 }); 
        setSize({ width: window.innerWidth / 2, height: window.innerHeight - 28 });
        setIsMaximized(false);
      } else if (snapPreview === 'right') {
        setPos({ x: window.innerWidth / 2, y: 28 });
        setSize({ width: window.innerWidth / 2, height: window.innerHeight - 28 });
        setIsMaximized(false);
      } else if (snapPreview === 'top') {
        setIsMaximized(true);
      }
      setSnapPreview(null);
    }
  };

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizing) {
      let newW = e.clientX - pos.x;
      let newH = e.clientY - pos.y;
      newW = Math.max(400, Math.min(window.innerWidth - pos.x - 16, newW));
      newH = Math.max(300, Math.min(window.innerHeight - pos.y - 100, newH));
      setSize({ width: newW, height: newH });
    }
  };

  if (!isReady) return null;

  return (
    <>
      {snapPreview && !isMinimized && (
        <div 
          className="fixed z-[85] bg-white/10 border-2 border-white/20 backdrop-blur-sm transition-all duration-200 rounded-xl pointer-events-none"
          style={{
            top: snapPreview === 'top' ? '28px' : '28px',
            bottom: snapPreview === 'top' ? '80px' : '0px',
            left: snapPreview === 'right' ? '50%' : '0px',
            right: snapPreview === 'left' ? '50%' : '0px',
          }}
        />
      )}

      <div 
        ref={windowRef}
        onPointerDownCapture={onFocus}
        className={`fixed flex flex-col overflow-hidden bg-[#050505] border border-os-border shadow-2xl rounded-xl
          ${isMinimized ? 'opacity-0 scale-50 translate-y-[20vh] pointer-events-none' : isActive ? 'z-[95] shadow-[0_0_40px_rgba(0,0,0,0.5)] opacity-100 scale-100 translate-y-0' : 'z-[80] opacity-0 pointer-events-none md:pointer-events-auto md:opacity-95 md:hover:opacity-100 scale-100 translate-y-0'}
          ${isDragging || isResizing ? 'transition-none' : 'transition-transform duration-300 ease-out'}
        `}
        style={
          isMobile ? { left: '8px', top: '70px', right: '8px', bottom: '90px', width: 'auto', height: 'auto' } : 
          isMaximized ? { left: '0px', top: '28px', right: '0px', bottom: '0px', width: 'auto', height: 'auto', borderRadius: '0px', transform: 'none' } : 
          { 
            left: 0, top: 0, 
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`, 
            width: `${size.width}px`, height: `${size.height}px`,
            willChange: 'transform'
          }
        }
      >
        {!isMobile && (
          <div 
            onPointerDown={handleDragDown}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragUp}
            onPointerCancel={handleDragUp}
            onDoubleClick={() => setIsMaximized(!isMaximized)}
            className="h-12 bg-[#111] border-b border-os-border flex items-center justify-between px-4 select-none touch-none shrink-0 cursor-grab active:cursor-grabbing"
          >
            <div className="flex gap-2 w-20">
              <button onClick={(e) => { e.stopPropagation(); playSystemSound('click'); onClose(); }} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center group interactive">
                <X size={10} className="text-red-900 opacity-0 group-hover:opacity-100" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); playSystemSound('click'); onMinimize(); }} className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center group interactive">
                <Minus size={10} className="text-yellow-900 opacity-0 group-hover:opacity-100" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); playSystemSound('click'); setIsMaximized(!isMaximized); }} className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center group interactive">
                <Maximize2 size={8} className="text-emerald-900 opacity-0 group-hover:opacity-100" />
              </button>
            </div>
            <div className="text-xs text-zinc-500 flex items-center gap-2 truncate px-4">
              <Icon size={14} /> {title}
            </div>
            <div className="w-20"></div> 
          </div>
        )}

        <div className="flex-1 w-full h-full relative bg-black overflow-hidden flex flex-col">
          {(isDragging || isResizing) && <div className="absolute inset-0 z-[100] cursor-grabbing"></div>}
          {children}
        </div>

        {!isMaximized && !isMobile && (
          <div 
            onPointerDown={(e) => { e.stopPropagation(); onFocus(); setIsResizing(true); (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
            onPointerMove={handleResizeMove}
            onPointerUp={() => setIsResizing(false)}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 flex items-end justify-end p-1 touch-none"
          >
            <div className="w-3 h-3 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:4px_4px]"></div>
          </div>
        )}
      </div>
    </>
  );
}

function DockItem({ item, isOpen, isActive, mouseX, onClick, onContextMenu }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState(52);

  useEffect(() => {
    const isMobileScreen = window.innerWidth < 768;
    const baseSize = isMobileScreen ? 38 : 52; 
    const maxSize = isMobileScreen ? 50 : 85;  
    const distanceLimit = isMobileScreen ? 80 : 150; 

    if (mouseX === null || isMobileScreen) {
      setSize(baseSize);
      return;
    }
    
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const iconCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - iconCenterX);

      if (distance < distanceLimit) {
        const scale = Math.cos((distance / distanceLimit) * (Math.PI / 2));
        setSize(baseSize + (maxSize - baseSize) * scale);
      } else {
        setSize(baseSize);
      }
    }
  }, [mouseX]);

  const Icon = item.icon;
  const isHovering = mouseX !== null;

  return (
    <div className="group relative flex flex-col items-center justify-end shrink-0">
      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 hidden md:block">
        <div className="bg-zinc-800/90 backdrop-blur-sm text-zinc-100 text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-700 shadow-xl whitespace-nowrap">
          {item.label}
        </div>
      </div>
      <button
        ref={ref}
        onClick={onClick}
        onContextMenu={(e) => onContextMenu(e, item.id)}
        style={{ 
          width: `${size}px`, height: `${size}px`, willChange: 'width, height',
          transition: `width ${isHovering ? '50ms' : '250ms'} ease-out, height ${isHovering ? '50ms' : '250ms'} ease-out`
        }}
        className={`flex items-center justify-center bg-zinc-900/80 border rounded-2xl hover:bg-zinc-800 origin-bottom shadow-lg interactive focus:outline-none mb-2
          ${isActive ? 'border-emerald-500/50' : 'border-zinc-700/50 hover:border-zinc-500'}
        `}
      >
        <Icon className={`${item.color} w-[45%] h-[45%]`} />
      </button>
      <div className={`absolute bottom-0 w-1 h-1 rounded-full bg-zinc-400 transition-all duration-300 ${isOpen ? 'opacity-100 shadow-[0_0_8px_rgba(161,161,170,1)]' : 'opacity-0 translate-y-2'}`}></div>
    </div>
  );
}

export default function HUD() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 👇 LOOPHOLE FIX: The HUD relies on local storage to know if it should be mounted
  useEffect(() => {
    const checkAuthStatus = () => {
      const EXPIRATION_TIME_MS = 60 * 60 * 1000;
      const lastActive = localStorage.getItem('pritam_os_last_active');
      if (lastActive && (Date.now() - parseInt(lastActive) < EXPIRATION_TIME_MS)) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    };
    
    checkAuthStatus(); 

    const handleUnlock = () => setIsUnlocked(true);
    const handleLock = () => setIsUnlocked(false);
    
    window.addEventListener('system-unlock', handleUnlock);
    window.addEventListener('system-lock-triggered', handleLock); // Listen for the new lock event
    
    return () => {
      window.removeEventListener('system-unlock', handleUnlock);
      window.removeEventListener('system-lock-triggered', handleLock);
    };
  }, []);
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [minimizedApps, setMinimizedApps] = useState<string[]>([]);
  
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDock, setShowDock] = useState(true);
  const [showMobileNotice, setShowMobileNotice] = useState(false);

  const [pinnedApps, setPinnedApps] = useState<string[]>(['finder', 'profile', 'contact', 'github']);
  const [dockContextMenu, setDockContextMenu] = useState<{show: boolean, x: number, appId: string | null}>({ show: false, x: 0, appId: null });

  const [customFolders, setCustomFolders] = useState<any[]>([]);

  useEffect(() => {
    const savedPinned = localStorage.getItem('pritam_os_dock_pinned');
    if (savedPinned) {
      setPinnedApps(JSON.parse(savedPinned));
    }
  }, []);

  const togglePinApp = (id: string) => {
    setPinnedApps(prev => {
      const newPinned = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      localStorage.setItem('pritam_os_dock_pinned', JSON.stringify(newPinned));
      return newPinned;
    });
  };

  useEffect(() => {
    const closeMenu = () => setDockContextMenu(prev => ({ ...prev, show: false }));
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  useEffect(() => {
    if (isUnlocked && isMobile) {
      const hasSeenNotice = localStorage.getItem('pritam_os_mobile_notice');
      if (!hasSeenNotice) {
        const timer = setTimeout(() => {
          setShowMobileNotice(true);
          playSystemSound('pop');
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [isUnlocked, isMobile]);

  const dismissMobileNotice = () => {
    setShowMobileNotice(false);
    localStorage.setItem('pritam_os_mobile_notice', 'true');
  };

  useEffect(() => {
    const handleToggleDock = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setShowDock(customEvent.detail);
    };
    window.addEventListener('toggle-dock', handleToggleDock);
    return () => window.removeEventListener('toggle-dock', handleToggleDock);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleLaunch = (e: Event) => {
      const savedCustom = localStorage.getItem('pritam_os_custom_folders');
      if (savedCustom) {
        setCustomFolders(JSON.parse(savedCustom));
      }

      const customEvent = e as CustomEvent<string>;
      const id = customEvent.detail;
      
      setOpenApps((prev: string[]) => {
        if (!prev.includes(id)) return [...prev, id];
        return prev;
      });
      
      setMinimizedApps((prev) => prev.filter(app => app !== id));
      setActiveApp(id);
    };
    
    window.addEventListener('launch-app', handleLaunch);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('launch-app', handleLaunch);
    };
  }, []);

  const handleCloseApp = (id: string) => {
    const newOpenApps = openApps.filter(app => app !== id);
    setOpenApps(newOpenApps);
    setMinimizedApps((prev) => prev.filter(app => app !== id));
    
    if (activeApp === id) {
      setActiveApp(newOpenApps.length > 0 ? newOpenApps[newOpenApps.length - 1] : null);
    }
  };

  const handleMinimizeApp = (id: string) => {
    setMinimizedApps(prev => [...prev, id]);
    setActiveApp(null);
  };

  const getAppInfo = (id: string) => {
    const staticApp = SYSTEM_APPS.find(app => app.id === id);
    if (staticApp) return staticApp;

    if (id.startsWith('folder-')) {
      const folderData = customFolders.find(f => f.id === id);
      return {
        id,
        label: folderData?.label || 'Folder',
        icon: Folder,
        color: 'text-blue-400',
        title: folderData?.label || 'Folder'
      };
    }
    return null;
  };

  const visibleDockItemIds = Array.from(new Set([...pinnedApps, ...openApps]));
  const sortedDockItemIds = [
    ...pinnedApps.filter(id => visibleDockItemIds.includes(id)),
    ...openApps.filter(id => !pinnedApps.includes(id))
  ];
  const currentDockItems = sortedDockItemIds.map(id => getAppInfo(id)).filter(Boolean) as any[];

  // 👇 IMPORTANT: DO NOT RENDER ANYTHING IF THE SCREEN IS LOCKED OR BOOTING
  if (!isUnlocked) return null;
  
  return (
    <>
      <div className={`fixed top-4 left-4 right-4 z-[9999] transition-all duration-500 ease-out transform ${showMobileNotice ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#18181b]/95 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-start gap-4 max-w-sm mx-auto">
          <div className="bg-blue-500/20 p-2 rounded-full shrink-0">
            <Monitor size={20} className="text-blue-400" />
          </div>
          <div className="flex-1 mt-0.5">
            <h4 className="text-white text-sm font-semibold mb-1">Desktop Recommended</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">For the full Pritam_OS experience with draggable windows and multitasking, please visit on a PC.</p>
          </div>
          <button onClick={dismissMobileNotice} className="text-zinc-500 hover:text-white p-1 shrink-0 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {dockContextMenu.show && dockContextMenu.appId && (
        <div 
          className="fixed z-[9999] w-48 bg-os-window/90 backdrop-blur-3xl border border-os-border rounded-xl shadow-2xl py-1.5 text-[12px] font-sans text-os-text"
          style={{ bottom: '90px', left: dockContextMenu.x }}
        >
          {openApps.includes(dockContextMenu.appId) && (
            <>
              <button 
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white"
                onClick={() => handleCloseApp(dockContextMenu.appId!)}
              >
                Quit
              </button>
              <div className="h-px bg-white/10 my-1"></div>
            </>
          )}
          <button 
            className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between items-center"
            onClick={() => togglePinApp(dockContextMenu.appId!)}
          >
            <span>{pinnedApps.includes(dockContextMenu.appId) ? 'Remove from Dock' : 'Keep in Dock'}</span>
            {pinnedApps.includes(dockContextMenu.appId) && <Check size={12} />}
          </button>
        </div>
      )}

      {isMobile && openApps.length > 0 && (
        <div className="fixed top-8 left-2 right-2 h-8 z-[110] flex gap-1 overflow-x-auto bg-[#111111]/80 backdrop-blur-md rounded-lg p-1 border border-os-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {openApps.map(appId => {
            const appInfo = getAppInfo(appId);
            const isActive = activeApp === appId;
            return (
              <div 
                key={appId}
                onClick={() => { 
                  playSystemSound('click'); 
                  setActiveApp(appId);
                  setMinimizedApps(prev => prev.filter(a => a !== appId));
                }}
                className={`flex items-center gap-2 px-3 h-full rounded text-[11px] font-sans tracking-wide shrink-0 transition-all duration-150 interactive
                  ${isActive ? 'bg-[#0058d0] text-white font-medium shadow' : 'bg-zinc-900/40 text-zinc-400'}
                `}
              >
                <span>{appInfo?.label}</span>
                <X size={10} className="hover:text-red-400 p-0.5" onClick={(e) => { e.stopPropagation(); playSystemSound('click'); handleCloseApp(appId); }} />
              </div>
            );
          })}
        </div>
      )}

      <>
        {openApps.includes('finder') && (
          <DesktopWindow id="finder" title="Finder" icon={LayoutGrid} isActive={activeApp === 'finder'} isMinimized={minimizedApps.includes('finder')} isMobile={isMobile} onFocus={() => setActiveApp('finder')} onMinimize={() => handleMinimizeApp('finder')} onClose={() => handleCloseApp('finder')}>
            <Finder />
          </DesktopWindow>
        )}
        {openApps.includes('profile') && (
          <DesktopWindow id="profile" title="System Profile" icon={User} isActive={activeApp === 'profile'} isMinimized={minimizedApps.includes('profile')} isMobile={isMobile} onFocus={() => setActiveApp('profile')} onMinimize={() => handleMinimizeApp('profile')} onClose={() => handleCloseApp('profile')}>
            <SystemProfile />
          </DesktopWindow>
        )}
        {openApps.includes('vscode') && (
          <DesktopWindow id="vscode" title="VS Code - Portfolio Workspace" icon={Code2} isActive={activeApp === 'vscode'} isMinimized={minimizedApps.includes('vscode')} isMobile={isMobile} onFocus={() => setActiveApp('vscode')} onMinimize={() => handleMinimizeApp('vscode')} onClose={() => handleCloseApp('vscode')}>
            <CodeViewer />
          </DesktopWindow>
        )}
        {openApps.includes('calc') && (
          <DesktopWindow id="calc" title="Calculator" icon={CalcIcon} isActive={activeApp === 'calc'} isMinimized={minimizedApps.includes('calc')} isMobile={isMobile} onFocus={() => setActiveApp('calc')} onMinimize={() => handleMinimizeApp('calc')} onClose={() => handleCloseApp('calc')}>
            <Calculator />
          </DesktopWindow>
        )}
        {openApps.includes('terminal') && (
          <DesktopWindow id="terminal" title="visitor@pritam-os:~$" icon={TerminalIcon} isActive={activeApp === 'terminal'} isMinimized={minimizedApps.includes('terminal')} isMobile={isMobile} onFocus={() => setActiveApp('terminal')} onMinimize={() => handleMinimizeApp('terminal')} onClose={() => handleCloseApp('terminal')}>
            <InteractiveTerminal />
          </DesktopWindow>
        )}
        {openApps.includes('guide') && (
          <DesktopWindow id="guide" title="commands.txt - Text Editor" icon={FileCode} isActive={activeApp === 'guide'} isMinimized={minimizedApps.includes('guide')} isMobile={isMobile} onFocus={() => setActiveApp('guide')} onMinimize={() => handleMinimizeApp('guide')} onClose={() => handleCloseApp('guide')}>
            <TerminalGuide />
          </DesktopWindow>
        )}
        {openApps.includes('esp') && (
          <DesktopWindow id="esp" title="Preview - ESP Core" icon={Globe} isActive={activeApp === 'esp'} isMinimized={minimizedApps.includes('esp')} isMobile={isMobile} onFocus={() => setActiveApp('esp')} onMinimize={() => handleMinimizeApp('esp')} onClose={() => handleCloseApp('esp')}>
            <iframe src="https://esp-frontend-s719.vercel.app/" className="w-full h-full border-none bg-white" title="ESP Platform" />
          </DesktopWindow>
        )}
        {openApps.includes('alumni') && (
          <DesktopWindow id="alumni" title="Preview - ConnectAlumni" icon={Users} isActive={activeApp === 'alumni'} isMinimized={minimizedApps.includes('alumni')} isMobile={isMobile} onFocus={() => setActiveApp('alumni')} onMinimize={() => handleMinimizeApp('alumni')} onClose={() => handleCloseApp('alumni')}>
            <iframe src="https://alumni-network-frontend-sepia.vercel.app/" className="w-full h-full border-none bg-white" title="ConnectAlumni" />
          </DesktopWindow>
        )}
        {openApps.includes('resume') && (
          <DesktopWindow id="resume" title="Document Viewer" icon={FileText} isActive={activeApp === 'resume'} isMinimized={minimizedApps.includes('resume')} isMobile={isMobile} onFocus={() => setActiveApp('resume')} onMinimize={() => handleMinimizeApp('resume')} onClose={() => handleCloseApp('resume')}>
            <iframe src="/resume.pdf" className="w-full h-full border-none bg-zinc-900" title="Resume" />
          </DesktopWindow>
        )}
        {openApps.includes('contact') && (
          <DesktopWindow id="contact" title="pritam@os:~/mail_client" icon={Mail} isActive={activeApp === 'contact'} isMinimized={minimizedApps.includes('contact')} isMobile={isMobile} onFocus={() => setActiveApp('contact')} onMinimize={() => handleMinimizeApp('contact')} onClose={() => handleCloseApp('contact')}>
            <Contact />
          </DesktopWindow>
        )}
        {openApps.includes('snake') && (
          <DesktopWindow id="snake" title="Data_Worm.exe" icon={Gamepad2} isActive={activeApp === 'snake'} isMinimized={minimizedApps.includes('snake')} isMobile={isMobile} onFocus={() => setActiveApp('snake')} onMinimize={() => handleMinimizeApp('snake')} onClose={() => handleCloseApp('snake')}>
            <Game />
          </DesktopWindow>
        )}
        {openApps.includes('minesweeper') && (
          <DesktopWindow id="minesweeper" title="Cyber_Sweeper.exe" icon={Crosshair} isActive={activeApp === 'minesweeper'} isMinimized={minimizedApps.includes('minesweeper')} isMobile={isMobile} onFocus={() => setActiveApp('minesweeper')} onMinimize={() => handleMinimizeApp('minesweeper')} onClose={() => handleCloseApp('minesweeper')}>
            <CyberSweeper />
          </DesktopWindow>
        )}
        {openApps.includes('paint') && (
          <DesktopWindow id="paint" title="Studio" icon={Palette} isActive={activeApp === 'paint'} isMinimized={minimizedApps.includes('paint')} isMobile={isMobile} onFocus={() => setActiveApp('paint')} onMinimize={() => handleMinimizeApp('paint')} onClose={() => handleCloseApp('paint')}>
            <PaintApp />
          </DesktopWindow>
        )}
        {openApps.includes('notes') && (
          <DesktopWindow id="notes" title="Notes" icon={SquarePen} isActive={activeApp === 'notes'} isMinimized={minimizedApps.includes('notes')} isMobile={isMobile} onFocus={() => setActiveApp('notes')} onMinimize={() => handleMinimizeApp('notes')} onClose={() => handleCloseApp('notes')}>
            <NotesApp />
          </DesktopWindow>
        )}
        {openApps.includes('network') && (
          <DesktopWindow id="network" title="Network & Contacts" icon={Users} isActive={activeApp === 'network'} isMinimized={minimizedApps.includes('network')} isMobile={isMobile} onFocus={() => setActiveApp('network')} onMinimize={() => handleMinimizeApp('network')} onClose={() => handleCloseApp('network')}>
            <NetworkApp />
          </DesktopWindow>
        )}
        {openApps.includes('player') && (
          <DesktopWindow id="player" title="VibeTunes" icon={Music} isActive={activeApp === 'player'} isMinimized={minimizedApps.includes('player')} isMobile={isMobile} onFocus={() => setActiveApp('player')} onMinimize={() => handleMinimizeApp('player')} onClose={() => handleCloseApp('player')}>
            <VibePlayer />
          </DesktopWindow>
        )}
        {openApps.includes('lens') && (
          <DesktopWindow id="lens" title="Lens" icon={Camera} isActive={activeApp === 'lens'} isMinimized={minimizedApps.includes('lens')} isMobile={isMobile} onFocus={() => setActiveApp('lens')} onMinimize={() => handleMinimizeApp('lens')} onClose={() => handleCloseApp('lens')}>
            <LensApp />
          </DesktopWindow>
        )}
        {openApps.includes('weather') && (
          <DesktopWindow id="weather" title="Forecast" icon={CloudSun} isActive={activeApp === 'weather'} isMinimized={minimizedApps.includes('weather')} isMobile={isMobile} onFocus={() => setActiveApp('weather')} onMinimize={() => handleMinimizeApp('weather')} onClose={() => handleCloseApp('weather')}>
            <WeatherApp />
          </DesktopWindow>
        )}
        {openApps.includes('activity') && (
          <DesktopWindow id="activity" title="Activity Monitor" icon={Activity} isActive={activeApp === 'activity'} isMinimized={minimizedApps.includes('activity')} isMobile={isMobile} onFocus={() => setActiveApp('activity')} onMinimize={() => handleMinimizeApp('activity')} onClose={() => handleCloseApp('activity')}>
            <ActivityMonitor openApps={openApps} />
          </DesktopWindow>
        )}
        {openApps.includes('browser') && (
          <DesktopWindow id="browser" title="WebSphere Browser" icon={Compass} isActive={activeApp === 'browser'} isMinimized={minimizedApps.includes('browser')} isMobile={isMobile} onFocus={() => setActiveApp('browser')} onMinimize={() => handleMinimizeApp('browser')} onClose={() => handleCloseApp('browser')}>
            <BrowserApp />
          </DesktopWindow>
        )}

        {openApps.includes('trash') && (
          <DesktopWindow id="trash" title="Recycle Bin" icon={Trash2} isActive={activeApp === 'trash'} isMinimized={minimizedApps.includes('trash')} isMobile={isMobile} onFocus={() => setActiveApp('trash')} onMinimize={() => handleMinimizeApp('trash')} onClose={() => handleCloseApp('trash')}>
            <RecycleBinApp />
          </DesktopWindow>
        )}

        {openApps.filter(id => id.startsWith('folder-')).map(folderId => {
          const folderInfo = getAppInfo(folderId);
          return (
            <DesktopWindow
              key={folderId}
              id={folderId}
              title={folderInfo?.title || 'Folder'}
              icon={Folder}
              isActive={activeApp === folderId}
              isMinimized={minimizedApps.includes(folderId)}
              isMobile={isMobile}
              onFocus={() => setActiveApp(folderId)}
              onMinimize={() => handleMinimizeApp(folderId)}
              onClose={() => handleCloseApp(folderId)}
            >
              <CustomFolder folderName={folderInfo?.title || 'Folder'} />
            </DesktopWindow>
          );
        })}
      </>

      <div className={`fixed left-1/2 -translate-x-1/2 z-[100] max-w-[95vw] md:max-w-none transition-all duration-500 ease-in-out ${showDock ? 'bottom-4 opacity-100' : '-bottom-32 opacity-0 pointer-events-none'}`}>
        <div 
          onMouseMove={(e) => setMouseX(e.clientX)}
          onMouseLeave={() => setMouseX(null)}
          className="flex items-end gap-2 md:gap-3 px-3 md:px-4 pb-2 pt-4 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-os-border/80 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] h-[75px] overflow-x-auto md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {currentDockItems.map((item) => (
            <DockItem 
              key={item.id} 
              item={item} 
              isOpen={openApps.includes(item.id)}
              isActive={activeApp === item.id && !minimizedApps.includes(item.id)}
              mouseX={mouseX}
              onContextMenu={(e: React.MouseEvent, id: string) => {
                e.preventDefault();
                e.stopPropagation();
                setDockContextMenu({
                  show: true,
                  x: Math.min(e.clientX, window.innerWidth - 200),
                  appId: id
                });
              }}
              onClick={(e: any) => {
                e.preventDefault();
                playSystemSound('click');
                if (item.id === 'github') { window.open('https://github.com/pritamk-byte', '_blank'); return; }
                
                setOpenApps(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
                setActiveApp(item.id);
                setMinimizedApps(prev => prev.filter(app => app !== item.id));
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}