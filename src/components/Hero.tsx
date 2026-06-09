'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Command, ArrowRight, Folder, Mail, Music2, Code2, Calculator as CalcIcon, TerminalSquare, 
  SquarePen, Palette, Globe, Users, FileText, FileCode, Gamepad2, Camera, CloudSun, 
  Activity, Compass, Crosshair, EyeOff, Eye, Trash2, X, Moon, RotateCcw, Power, Image as ImageIcon, Wifi, WifiOff, BatteryMedium, Loader2 
} from 'lucide-react';

const wallpapers = [
  { id: 'default-blur', type: 'css', name: 'Dynamic Aura' },
  { id: 'monterey', type: 'image', name: 'Monterey Abstract', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
  { id: 'ventura', type: 'image', name: 'Ventura Waves', url: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2564&auto=format&fit=crop' },
  { id: 'big-sur', type: 'image', name: 'Big Sur Coast', url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2564&auto=format&fit=crop' },
  { id: 'catalina', type: 'image', name: 'Catalina Island', url: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=2564&auto=format&fit=crop' },
  { id: 'neon-fluid', type: 'image', name: 'Neon Fluid', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop' },
  { id: 'abstract-ink', type: 'image', name: 'Macro Fluid', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2564&auto=format&fit=crop' },
  { id: 'vibrant-mesh', type: 'image', name: 'Vibrant Mesh', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2564&auto=format&fit=crop' },
  { id: 'yosemite', type: 'image', name: 'Yosemite Valley', url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2564&auto=format&fit=crop' },
  { id: 'snow-peaks', type: 'image', name: 'Snow Peaks', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2564&auto=format&fit=crop' },
  { id: 'forest-road', type: 'image', name: 'Forest Road', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2564&auto=format&fit=crop' },
  { id: 'lake-reflection', type: 'image', name: 'Alpine Lake', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2564&auto=format&fit=crop' },
  { id: 'tropical-beach', type: 'image', name: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2564&auto=format&fit=crop' },
  { id: 'aurora-sky', type: 'image', name: 'Northern Lights', url: 'https://images.unsplash.com/photo-1513628253939-010e64ac66cd?q=80&w=2564&auto=format&fit=crop' },
  { id: 'desert-dunes', type: 'image', name: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2564&auto=format&fit=crop' },
  { id: 'nyc-skyline', type: 'image', name: 'City Skyline', url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2564&auto=format&fit=crop' },
  { id: 'ocean-cliffs', type: 'image', name: 'Ocean Cliffs', url: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?q=80&w=2564&auto=format&fit=crop' },
  { id: 'autumn-woods', type: 'image', name: 'Autumn Woods', url: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2564&auto=format&fit=crop' },
  { id: 'dark-matter', type: 'image', name: 'Dark Matter', url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2564&auto=format&fit=crop' },
  { id: 'deep-space', type: 'image', name: 'Deep Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2564&auto=format&fit=crop' },
];

const initialDesktopIcons = [
  { id: 'profile', label: 'Pritam_OS', icon: Folder, color: 'text-blue-400', fill: 'fill-blue-400/20', isCustomFolder: false },
  { id: 'contact', label: 'Mail.app', icon: Mail, color: 'text-purple-400', fill: '', isCustomFolder: false },
  { id: 'player', label: 'VibeTunes.app', icon: Music2, color: 'text-rose-500', fill: '', isCustomFolder: false },
  { id: 'vscode', label: 'VS Code', icon: Code2, color: 'text-blue-500', fill: '', isCustomFolder: false },
  { id: 'calc', label: 'Calculator', icon: CalcIcon, color: 'text-orange-400', fill: '', isCustomFolder: false },
  { id: 'terminal', label: 'Terminal', icon: TerminalSquare, color: 'text-emerald-400', fill: '', isCustomFolder: false },
  { id: 'notes', label: 'Notes.app', icon: SquarePen, color: 'text-amber-400', fill: '', isCustomFolder: false },
  { id: 'paint', label: 'Studio.app', icon: Palette, color: 'text-pink-400', fill: '', isCustomFolder: false },
  { id: 'esp', label: 'ESP Core', icon: Globe, color: 'text-blue-400', fill: '', isCustomFolder: false },
  { id: 'alumni', label: 'ConnectAlumni', icon: Users, color: 'text-orange-400', fill: '', isCustomFolder: false },
  { id: 'resume', label: 'Resume.pdf', icon: FileText, color: 'text-white', fill: '', isCustomFolder: false },
  { id: 'guide', label: 'commands.txt', icon: FileCode, color: 'text-os-text', fill: '', isCustomFolder: false },
  { id: 'network', label: 'Network.app', icon: Users, color: 'text-indigo-400', fill: '', isCustomFolder: false },
  { id: 'snake', label: 'Data Worm', icon: Gamepad2, color: 'text-emerald-400', fill: '', isCustomFolder: false },
  { id: 'lens', label: 'Lens.app', icon: Camera, color: 'text-zinc-100', fill: '', isCustomFolder: false },
  { id: 'weather', label: 'Forecast.app', icon: CloudSun, color: 'text-blue-400', fill: '', isCustomFolder: false },
  { id: 'activity', label: 'Activity Monitor', icon: Activity, color: 'text-emerald-400', fill: '', isCustomFolder: false },
  { id: 'browser', label: 'Web Browser', icon: Compass, color: 'text-blue-400', fill: '', isCustomFolder: false },
  { id: 'minesweeper', label: 'Cyber Sweeper', icon: Crosshair, color: 'text-red-400', fill: '', isCustomFolder: false },
  { id: 'trash', label: 'Recycle Bin', icon: Trash2, color: 'text-zinc-400', fill: 'fill-zinc-400/20', isCustomFolder: false },
];

const EXPIRATION_TIME_MS = 60 * 60 * 1000;

// ZERO-FLICKER WALLPAPER ENGINE
const WallpaperLayer = ({ activeIdx }: { activeIdx: number }) => (
  <div className="absolute inset-0 z-0 bg-[#1e1e1e] overflow-hidden pointer-events-none">
    {wallpapers.map((wp, idx) => (
      <div
        key={wp.id}
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
      >
        {wp.type === 'css' ? (
          <div className="absolute inset-0 w-full h-full bg-[#1e1e1e]">
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/30 blur-[120px]"></div>
            <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 blur-[130px]"></div>
            <div className="absolute bottom-[-20%] left-[15%] w-[70vw] h-[70vw] rounded-full bg-emerald-900/15 blur-[140px]"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${wp.url}')` }} />
        )}
      </div>
    ))}
  </div>
);

function DraggableIcon({ 
  item, index, isSelected, onClick, onDoubleClick, onRename, onContextMenu
}: { 
  item: any, index: number, isSelected: boolean, onClick: (e: React.MouseEvent, id: string) => void, onDoubleClick: (id: string) => void, onRename: (id: string, newLabel: string) => void, onContextMenu: (e: React.MouseEvent, id: string) => void
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [renamingValue, setRenamingValue] = useState(item.label);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const originalPos = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    setRenamingValue(item.label);
  }, [item.label]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isEditing) return;
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
      newX = Math.max(0, Math.min(window.innerWidth - 80, newX));
      newY = Math.max(28, Math.min(window.innerHeight - 200, newY));
      setPos({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    const currentRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const allIcons = document.querySelectorAll('.desktop-icon');
    let hasOverlap = false;

    allIcons.forEach(icon => {
      if (icon === e.currentTarget) return; 
      const rect = icon.getBoundingClientRect();
      if (
        currentRect.left < rect.right + 15 &&
        currentRect.right > rect.left - 15 &&
        currentRect.top < rect.bottom + 15 &&
        currentRect.bottom > rect.top - 15
      ) {
        hasOverlap = true;
      }
    });

    if (hasOverlap) {
      setPos({ x: originalPos.current.x, y: originalPos.current.y });
    }
  };

  const submitRename = () => {
    setIsEditing(false);
    const trimmed = renamingValue.trim();
    if (trimmed && trimmed !== item.label) onRename(item.id, trimmed);
    else setRenamingValue(item.label);
  };

  if (!isReady) return null;

  const Icon = item.icon;

  return (
    <div 
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(e) => onContextMenu(e, item.id)}
      className={`absolute flex flex-col items-center gap-1 w-18 group touch-none desktop-icon
        ${isDragging ? 'cursor-grabbing z-50 transition-none' : 'cursor-default z-10 transition-all duration-300 ease-out'}
      `}
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
    >
      <div 
        onDoubleClick={(e) => { 
          e.stopPropagation(); 
          if (!isEditing) onDoubleClick(item.id); 
        }}
        className={`w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200
        ${isSelected ? 'bg-white/20 border border-white/30 shadow-lg' : 'bg-transparent border border-transparent'}
      `}>
        <Icon size={32} className={`${item.color} ${item.fill} drop-shadow-lg`} strokeWidth={1.5} />
      </div>

      {isEditing ? (
        <input
          type="text"
          value={renamingValue}
          autoFocus
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => setRenamingValue(e.target.value)}
          onBlur={submitRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitRename();
            if (e.key === 'Escape') {
              setIsEditing(false);
              setRenamingValue(item.label);
            }
          }}
          className="w-full text-[11px] font-medium px-1 bg-blue-600 border border-blue-400 text-white rounded text-center outline-none focus:ring-0"
        />
      ) : (
        <div 
          onDoubleClick={(e) => {
            if (item.isCustomFolder || item.id.startsWith('folder-')) {
              e.stopPropagation();
              setIsEditing(true);
            }
          }}
          className={`text-[11px] font-medium px-1 py-0.5 rounded text-center leading-tight tracking-wide drop-shadow-md select-none w-full overflow-hidden text-ellipsis line-clamp-2 wrap-break-word
            ${isSelected ? 'bg-blue-600 text-white' : 'text-zinc-100 bg-transparent'}
          `}
        >
          {item.label}
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const [progress, setProgress] = useState<number>(0);
  const [bootStage, setBootStage] = useState<'loading' | 'login' | 'desktop'>('loading');
  
  const [desktopWpIdx, setDesktopWpIdx] = useState(0);
  const [lockWpIdx, setLockWpIdx] = useState(8);
  
  const [contextMenu, setContextMenu] = useState<{show: boolean, x: number, y: number, targetId: string | null}>({ show: false, x: 0, y: 0, targetId: null });
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // LOCK SCREEN STATE
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // STATUS & POWER
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isOnline, setIsOnline] = useState(true);
  
  const [isAsleep, setIsAsleep] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isPoweredOff, setIsPoweredOff] = useState(false);

  const [showIcons, setShowIcons] = useState(true);
  const [showDock, setShowDock] = useState(true);
  const [icons, setIcons] = useState(initialDesktopIcons);

  // Hardware Status Effects (Battery & Network)
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => setBatteryLevel(Math.round(battery.level * 100)));
      });
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Sleep Wake-Up
  useEffect(() => {
    if (!isAsleep) return;
    const wakeUp = () => setIsAsleep(false);
    
    const timeoutId = setTimeout(() => {
      window.addEventListener('keydown', wakeUp);
      window.addEventListener('mousemove', wakeUp);
      window.addEventListener('click', wakeUp);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('keydown', wakeUp);
      window.removeEventListener('mousemove', wakeUp);
      window.removeEventListener('click', wakeUp);
    };
  }, [isAsleep]);

  // Lockscreen Key Press Effect
  useEffect(() => {
    const handleAnyKey = (e: KeyboardEvent) => {
      if (bootStage === 'login' && !showPasswordPrompt && !isAsleep && !isPoweredOff && !isShuttingDown) {
        setShowPasswordPrompt(true);
      }
    };
    window.addEventListener('keydown', handleAnyKey);
    return () => window.removeEventListener('keydown', handleAnyKey);
  }, [bootStage, showPasswordPrompt, isAsleep, isPoweredOff, isShuttingDown]);

  // Auto-focus password when unlocked
  useEffect(() => {
    if (showPasswordPrompt && passwordInputRef.current) {
      setTimeout(() => passwordInputRef.current?.focus(), 400);
    }
  }, [showPasswordPrompt]);

  const loadDesktopIcons = () => {
    const savedCustomIcons = localStorage.getItem('pritam_os_custom_folders');
    if (savedCustomIcons) {
      try {
        const parsed = JSON.parse(savedCustomIcons);
        const remapped = parsed.map((folder: any) => ({ ...folder, icon: Folder }));
        setIcons([...initialDesktopIcons, ...remapped]);
      } catch (e) {
        console.error("Error formatting folder persistent payload:", e);
      }
    } else {
      setIcons(initialDesktopIcons);
    }
  };

  // INITIAL HYDRATION AND GLOBAL LISTENERS
  useEffect(() => {
    const savedDWP = localStorage.getItem('pritam_os_desktop_wp');
    if (savedDWP !== null) setDesktopWpIdx(parseInt(savedDWP));

    const savedLWP = localStorage.getItem('pritam_os_lockscreen_wp');
    if (savedLWP !== null) setLockWpIdx(parseInt(savedLWP));

    const savedIcons = localStorage.getItem('pritam_os_show_icons');
    if (savedIcons !== null) setShowIcons(savedIcons === 'true');

    const savedDock = localStorage.getItem('pritam_os_show_dock');
    if (savedDock !== null) {
      setShowDock(savedDock === 'true');
      setTimeout(() => window.dispatchEvent(new CustomEvent('toggle-dock', { detail: savedDock === 'true' })), 500);
    }

    loadDesktopIcons();

    // Boot Check
    const lastActive = localStorage.getItem('pritam_os_last_active');
    const now = Date.now();

    if (lastActive && (now - parseInt(lastActive) < EXPIRATION_TIME_MS)) {
      localStorage.setItem('pritam_os_last_active', now.toString());
      setProgress(100);
      setBootStage('desktop');
      setTimeout(() => window.dispatchEvent(new Event('system-unlock')), 100);
    } else {
      localStorage.removeItem('pritam_os_last_active');
    }

    const handleNextDesktopWp = () => setDesktopWpIdx(prev => (prev + 1) % wallpapers.length);
    
    // 👇 ADDED BROADCAST: Unmounts HUD when lock is clicked
    const handleSystemLock = () => {
      localStorage.removeItem('pritam_os_last_active'); 
      setBootStage('login'); 
      setShowPasswordPrompt(false); 
      setIsSubmittingLogin(false);
      window.dispatchEvent(new Event('system-lock-triggered')); 
    };

    const handleSystemSleep = () => setIsAsleep(true);
    
    const handleSystemShutdown = () => {
      localStorage.removeItem('pritam_os_last_active');
      window.dispatchEvent(new Event('system-lock-triggered'));
      setIsShuttingDown(true);
      setTimeout(() => {
        setIsShuttingDown(false);
        setIsPoweredOff(true);
      }, 2500);
    };

    const handleSystemRestart = () => {
      localStorage.removeItem('pritam_os_last_active');
      window.dispatchEvent(new Event('system-lock-triggered'));
      setIsShuttingDown(true);
      setTimeout(() => {
        window.location.reload(); 
      }, 2000);
    };

    window.addEventListener('sync-folders', loadDesktopIcons);
    window.addEventListener('next-wallpaper', handleNextDesktopWp);
    window.addEventListener('system-lock', handleSystemLock);
    window.addEventListener('system-sleep', handleSystemSleep);
    window.addEventListener('system-shutdown', handleSystemShutdown);
    window.addEventListener('system-restart', handleSystemRestart);

    return () => {
      window.removeEventListener('sync-folders', loadDesktopIcons);
      window.removeEventListener('next-wallpaper', handleNextDesktopWp);
      window.removeEventListener('system-lock', handleSystemLock);
      window.removeEventListener('system-sleep', handleSystemSleep);
      window.removeEventListener('system-shutdown', handleSystemShutdown);
      window.removeEventListener('system-restart', handleSystemRestart);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('pritam_os_desktop_wp', desktopWpIdx.toString());
  }, [desktopWpIdx]);

  useEffect(() => {
    localStorage.setItem('pritam_os_lockscreen_wp', lockWpIdx.toString());
  }, [lockWpIdx]);

  useEffect(() => {
    if (bootStage !== 'loading') return;
    const lastActive = localStorage.getItem('pritam_os_last_active');
    if (lastActive && (Date.now() - parseInt(lastActive) < EXPIRATION_TIME_MS)) return;

    const interval = setInterval(() => {
      setProgress((prev: number) => {
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIcon && selectedIcon.startsWith('folder-')) {
        if (document.activeElement?.tagName === 'INPUT') return;
        handleDeleteFolder(selectedIcon);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIcon, icons]);

  useEffect(() => {
    const closeMenu = () => setContextMenu(prev => ({ ...prev, show: false }));
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (bootStage !== 'desktop') return; 
    const x = Math.min(e.clientX, window.innerWidth - 240);
    const y = Math.min(e.clientY, window.innerHeight - 200);
    setContextMenu({ show: true, x, y, targetId: null });
  };

  const handleIconContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (bootStage !== 'desktop') return;
    const x = Math.min(e.clientX, window.innerWidth - 240);
    const y = Math.min(e.clientY, window.innerHeight - 200);
    setContextMenu({ show: true, x, y, targetId: id });
    setSelectedIcon(id);
  };

  const handleLogin = () => {
    if (isSubmittingLogin || bootStage !== 'login') return; 
    setIsSubmittingLogin(true); 
    localStorage.setItem('pritam_os_last_active', Date.now().toString());
    
    setTimeout(() => {
      setBootStage('desktop');
      setShowPasswordPrompt(false); 
      setIsSubmittingLogin(false);
      window.dispatchEvent(new Event('system-unlock')); 
      setTimeout(() => window.dispatchEvent(new CustomEvent('launch-app', { detail: 'profile' })), 800);
    }, 300);
  };

  const launchApp = (appId: string) => {
    window.dispatchEvent(new CustomEvent('launch-app', { detail: appId }));
    setSelectedIcon(null);
  };

  const handleIconClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.innerWidth < 768) launchApp(id); 
    else setSelectedIcon(id);
  };

  const toggleIcons = () => {
    const newVal = !showIcons;
    setShowIcons(newVal);
    localStorage.setItem('pritam_os_show_icons', String(newVal));
  };

  const toggleDock = () => {
    const newVal = !showDock;
    setShowDock(newVal);
    localStorage.setItem('pritam_os_show_dock', String(newVal));
    window.dispatchEvent(new CustomEvent('toggle-dock', { detail: newVal }));
  };

  const createNewFolder = () => {
    const folderId = `folder-${Date.now()}`;
    const newFolder = { id: folderId, label: 'Untitled Folder', icon: Folder, color: 'text-blue-400', fill: 'fill-blue-400/20', isCustomFolder: true };
    const updatedIcons = [...icons, newFolder];
    setIcons(updatedIcons);

    const customOnly = updatedIcons.filter(icon => icon.isCustomFolder || icon.id.startsWith('folder-')).map(f => ({
      id: f.id, label: f.label, color: f.color, fill: f.fill, isCustomFolder: true
    }));
    localStorage.setItem('pritam_os_custom_folders', JSON.stringify(customOnly));
  };

  const handleRenameFolder = (id: string, newLabel: string) => {
    const updatedIcons = icons.map(icon => icon.id === id ? { ...icon, label: newLabel } : icon);
    setIcons(updatedIcons);

    const customOnly = updatedIcons.filter(icon => icon.isCustomFolder || icon.id.startsWith('folder-')).map(f => ({
      id: f.id, label: f.label, color: f.color, fill: f.fill, isCustomFolder: true
    }));
    localStorage.setItem('pritam_os_custom_folders', JSON.stringify(customOnly));
  };

  const handleDeleteFolder = (id: string) => {
    if (!id.startsWith('folder-')) return;
    const folderToDelete = icons.find(icon => icon.id === id);
    if (!folderToDelete) return;

    const recycled = JSON.parse(localStorage.getItem('pritam_os_recycled_items') || '[]');
    recycled.push({
      id: folderToDelete.id, label: folderToDelete.label, color: folderToDelete.color, fill: folderToDelete.fill, isCustomFolder: true, deletedAt: Date.now()
    });
    localStorage.setItem('pritam_os_recycled_items', JSON.stringify(recycled));

    const updatedIcons = icons.filter(icon => icon.id !== id);
    setIcons(updatedIcons);

    const customOnly = updatedIcons.filter(icon => icon.isCustomFolder || icon.id.startsWith('folder-')).map(f => ({
      id: f.id, label: f.label, color: f.color, fill: f.fill, isCustomFolder: true
    }));
    localStorage.setItem('pritam_os_custom_folders', JSON.stringify(customOnly));
    
    if (selectedIcon === id) setSelectedIcon(null);
    setContextMenu({ show: false, x: 0, y: 0, targetId: null });
  };

  const handleEmptyTrash = () => {
    localStorage.setItem('pritam_os_recycled_items', '[]');
    setContextMenu({ show: false, x: 0, y: 0, targetId: null });
    window.dispatchEvent(new Event('trash-emptied'));
  };

  const handlePowerOn = () => {
    setIsPoweredOff(false);
    setIsSubmittingLogin(false);
    setBootStage('loading');
    setProgress(0);
  };

  return (
    <>
      {/* 1. BACKGROUND & DESKTOP (z-0) */}
      <div 
        className="fixed inset-0 z-0 bg-black overflow-hidden select-none"
        onContextMenu={handleDesktopContextMenu}
        onClick={() => setSelectedIcon(null)}
      >
        <WallpaperLayer activeIdx={desktopWpIdx} />

        <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${bootStage === 'desktop' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {showIcons && (
            <div className="relative w-full h-full pointer-events-auto">
              {icons.map((item, index) => (
                <DraggableIcon 
                  key={item.id}
                  item={item}
                  index={index}
                  isSelected={selectedIcon === item.id}
                  onClick={handleIconClick}
                  onDoubleClick={() => { if (window.innerWidth >= 768) launchApp(item.id); }}
                  onRename={handleRenameFolder}
                  onContextMenu={handleIconContextMenu}
                />
              ))}
            </div>
          )}
        </div>

        {contextMenu.show && bootStage === 'desktop' && (
          <div 
            className="fixed z-9999 w-56 bg-os-window/80 backdrop-blur-3xl border border-os-border rounded-xl shadow-2xl py-1.5 text-[12px] font-sans text-os-text"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            {contextMenu.targetId === 'trash' ? (
              <>
                <button onClick={() => launchApp('trash')} className="w-full text-left px-4 py-1.5 hover:bg-[#0058d0] hover:text-white">Open</button>
                <div className="h-px bg-white/10 my-1"></div>
                <button onClick={handleEmptyTrash} className="w-full text-left px-4 py-1.5 text-zinc-400 hover:bg-red-500 hover:text-white flex items-center justify-between">
                  Empty Recycle Bin <Trash2 size={14} />
                </button>
              </>
            ) : contextMenu.targetId ? (
              <>
                <button onClick={() => launchApp(contextMenu.targetId!)} className="w-full text-left px-4 py-1.5 hover:bg-[#0058d0] hover:text-white">Open</button>
                {contextMenu.targetId.startsWith('folder-') && (
                  <>
                    <div className="h-px bg-white/10 my-1"></div>
                    <button onClick={() => handleDeleteFolder(contextMenu.targetId!)} className="w-full text-left px-4 py-1.5 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-between">
                      Move to Trash <Trash2 size={14} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button onClick={createNewFolder} className="w-full text-left px-4 py-1.5 hover:bg-[#0058d0] hover:text-white">New Folder</button>
                <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))} className="w-full text-left px-4 py-1.5 hover:bg-[#0058d0] hover:text-white flex justify-between items-center">
                  <span>Spotlight Search</span><span className="text-[10px] opacity-60 font-mono tracking-widest">⌘K</span>
                </button>
                <div className="h-px bg-white/10 my-1"></div>
                <div className="px-4 py-1 text-zinc-500 font-semibold text-[10px] tracking-wider uppercase">View</div>
                <button className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white flex justify-between items-center group" onClick={toggleIcons}>
                  <span>{showIcons ? 'Hide Desktop Icons' : 'Show Desktop Icons'}</span>
                  {showIcons ? <EyeOff size={12} className="opacity-0 group-hover:opacity-100" /> : <Eye size={12} className="opacity-0 group-hover:opacity-100" />}
                </button>
                <button className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white flex justify-between items-center group" onClick={toggleDock}>
                  <span>{showDock ? 'Hide Dock' : 'Show Dock'}</span>
                  {showDock ? <EyeOff size={12} className="opacity-0 group-hover:opacity-100" /> : <Eye size={12} className="opacity-0 group-hover:opacity-100" />}
                </button>
                <div className="h-px bg-white/10 my-1"></div>
                <div className="px-4 py-1 text-zinc-500 font-semibold text-[10px] tracking-wider uppercase">Wallpaper</div>
                <button onClick={() => window.dispatchEvent(new Event('next-wallpaper'))} className="w-full text-left px-4 py-1 hover:bg-[#0058d0] hover:text-white flex justify-between items-center">
                  <span>Next Background</span><span className="text-zinc-500 text-[10px] truncate max-w-20 text-right">{wallpapers[(desktopWpIdx + 1) % wallpapers.length].name}</span>
                </button>
                <div className="h-px bg-white/10 my-1"></div>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#0058d0] hover:text-white" onClick={() => launchApp('terminal')}>Open Terminal</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#0058d0] hover:text-white" onClick={() => window.location.reload()}>Refresh Workspace</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 👇 ABSOLUTE OVERLAYS (z-[99999]): Removed from z-0 container so they physically cover HUD and Header */}

      {/* 2. SLEEP SCREEN OVERLAY */}
      {isAsleep && (
        <div 
          className="fixed inset-0 z-[99999] bg-black cursor-default"
          onMouseMove={() => setIsAsleep(false)}
        />
      )}

      {/* 3. SHUTTING DOWN ANIMATION */}
      {isShuttingDown && (
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center transition-opacity duration-500">
           <Loader2 className="animate-spin text-zinc-500 mb-6" size={40} />
           <p className="text-zinc-400 font-medium tracking-widest uppercase text-xs animate-pulse">Shutting Down...</p>
        </div>
      )}

      {/* 4. POWER OFF SCREEN */}
      {isPoweredOff && (
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center transition-opacity duration-1000">
           <button onClick={handlePowerOn} className="text-white/20 hover:text-white/80 transition-all flex flex-col items-center gap-4">
             <Power size={48} />
             <span className="text-xs font-medium tracking-widest uppercase animate-pulse">Power On</span>
           </button>
        </div>
      )}

      {/* 5. INITIAL BOOT SCREEN */}
      {bootStage === 'loading' && (
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center">
          <Command size={56} className="text-os-text mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" strokeWidth={1.5} />
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-200 transition-all duration-150 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* 6. PURE MAC OS SONOMA LOCK SCREEN */}
      <div 
        className={`fixed inset-0 z-[99998] flex flex-col items-center transition-all duration-1000 ease-in-out
          ${bootStage === 'login' ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'}
        `}
        onClick={() => { if (bootStage === 'login' && !showPasswordPrompt && !isAsleep && !isShuttingDown && !isPoweredOff) setShowPasswordPrompt(true); }}
      >
        <WallpaperLayer activeIdx={lockWpIdx} />
        
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out z-10 ${showPasswordPrompt ? 'backdrop-blur-3xl bg-black/40' : 'backdrop-blur-none bg-black/10'}`}></div>
        
        {/* Top: Clock & Date */}
        <div className={`z-20 mt-16 sm:mt-24 flex flex-col items-center transition-all duration-700 ease-in-out ${showPasswordPrompt ? 'scale-75 -translate-y-12 opacity-0' : 'scale-100 translate-y-0 opacity-100'}`}>
          <div className="text-lg sm:text-2xl text-white font-medium drop-shadow-md select-none">{dateString}</div>
          <div className="text-[70px] sm:text-[100px] leading-none font-bold text-white tracking-tighter drop-shadow-xl select-none mt-2">{timeString}</div>
        </div>

        {/* Center: Hidden User Auth */}
        <div 
          className={`z-20 absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-500 ease-in-out transform 
            ${showPasswordPrompt ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center border-2 border-white/20 shadow-2xl mb-4 overflow-hidden">
             <span className="text-2xl sm:text-3xl text-white font-medium drop-shadow-md">P</span>
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-white drop-shadow-lg select-none mb-4">Pritam Poddar</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="relative flex items-center group">
            <input 
              ref={passwordInputRef}
              type="password" placeholder="Enter Password" 
              className="w-48 h-8 rounded-full bg-white/10 border border-white/20 px-4 text-xs text-white placeholder:text-white/50 backdrop-blur-md outline-none focus:bg-white/20 focus:border-white/40 transition-all pr-8 tracking-widest text-center"
            />
            <button type="submit" disabled={isSubmittingLogin} className="absolute right-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100 focus-within:opacity-100 disabled:opacity-50">
              {isSubmittingLogin ? <Loader2 size={12} className="text-white animate-spin" /> : <ArrowRight size={12} className="text-white" />}
            </button>
          </form>
          <div className="text-[10px] text-white/40 mt-2 font-medium text-center">Touch ID or Enter Password</div>
        </div>

        {/* Bottom Status / Power Bar */}
        <div className={`absolute bottom-8 right-8 sm:bottom-12 sm:right-12 z-30 flex flex-col sm:flex-row items-end sm:items-center gap-4 transition-all duration-500 ${showPasswordPrompt ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
           <div className="flex items-center gap-3 text-white/90 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
             {isOnline ? <Wifi size={16} /> : <WifiOff size={16} className="opacity-50" />}
             <div className="flex items-center gap-1.5">
               <span className="text-xs font-semibold">{batteryLevel}%</span>
               <BatteryMedium size={16} />
             </div>
           </div>

           <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-lg">
             <button onClick={(e) => { e.stopPropagation(); setLockWpIdx(p => (p+1)%wallpapers.length); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors" title="Change Lockscreen Wallpaper">
               <ImageIcon size={14} />
             </button>
             <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new Event('system-sleep')); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors" title="Sleep">
               <Moon size={14} />
             </button>
             <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new Event('system-restart')); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors" title="Restart">
               <RotateCcw size={14} />
             </button>
             <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new Event('system-shutdown')); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/80 text-white transition-colors" title="Shut Down">
               <Power size={14} />
             </button>
           </div>
        </div>

        {/* Hint text */}
        {!showPasswordPrompt && (
          <div className="absolute bottom-12 z-20 text-[10px] sm:text-xs font-medium text-white/70 tracking-wide animate-pulse cursor-default select-none">
            Click or press any key to unlock
          </div>
        )}

        {/* Cancel Login Button */}
        {showPasswordPrompt && (
          <div className="absolute bottom-12 z-20">
            <button 
               onClick={(e) => { e.stopPropagation(); setShowPasswordPrompt(false); }}
               className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors border border-white/10 shadow-lg"
             >
               <X size={16} className="text-white" />
             </button>
          </div>
        )}

      </div>
    </>
  );
}