'use client';
import { useState, useEffect, useRef } from 'react';
import { Wifi, BatteryMedium, Command, Zap, Search, Settings, RotateCcw, CloudSun, SlidersHorizontal, Bluetooth, Monitor, Volume2, Sun, Moon, Image as ImageIcon, Languages } from 'lucide-react';

const systemMenus: Record<string, string[]> = {
  File: ['New Window', 'New Tab', 'Open...', 'Save', 'Close Window'],
  Edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'],
  View: ['Actual Size', 'Zoom In', 'Zoom Out', 'Enter Full Screen'],
  Go: ['Back', 'Forward', 'Desktop', 'Downloads'],
  Window: ['Minimize', 'Zoom', 'Bring All to Front'],
  Help: ['Pritam_OS Help', 'Search...']
};

export default function Header() {
  const [currentDateObj, setCurrentDateObj] = useState(new Date());
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Control Center States
  const [brightness, setBrightness] = useState(100);
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(true);
  
  const [themeMode, setThemeMode] = useState<'Dark' | 'Light' | 'Midnight'>('Dark');
  const [lang, setLang] = useState('EN');

  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const handleUnlock = () => setIsUnlocked(true);
    window.addEventListener('system-unlock', handleUnlock);
    return () => window.removeEventListener('system-unlock', handleUnlock);
  }, []);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentDateObj(now);
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 1. Check if they saved a theme previously
    const savedTheme = localStorage.getItem('pritam_os_theme') as 'Dark' | 'Light' | 'Midnight';
    if (savedTheme) setThemeMode(savedTheme);
  }, []);

  useEffect(() => {
    // 2. Whenever theme changes, update the HTML tag and save to memory
    document.documentElement.setAttribute('data-theme', themeMode.toLowerCase());
    localStorage.setItem('pritam_os_theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    let overlay = document.getElementById('brightness-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'brightness-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.zIndex = '99998'; 
      overlay.style.pointerEvents = 'none';
      overlay.style.backgroundColor = 'black';
      overlay.style.transition = 'opacity 0.1s ease-out';
      document.body.appendChild(overlay);
    }
    overlay.style.opacity = `${(100 - brightness) / 100}`;
  }, [brightness]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const launchApp = (appId: string) => {
    window.dispatchEvent(new CustomEvent('launch-app', { detail: appId }));
    setOpenMenu(null);
  };

  const handleMenuHover = (menuName: string) => {
    if (openMenu && !['clock', 'control'].includes(openMenu)) {
      setOpenMenu(menuName);
    }
  };

  const cycleTheme = () => {
    const modes: ('Dark' | 'Light' | 'Midnight')[] = ['Dark', 'Light', 'Midnight'];
    setThemeMode(modes[(modes.indexOf(themeMode) + 1) % modes.length]);
  };

  const cycleLang = () => {
    const langs = ['EN', 'ES', 'FR'];
    setLang(langs[(langs.indexOf(lang) + 1) % langs.length]);
  };

  if (!isUnlocked) return null;

  const year = currentDateObj.getFullYear();
  const month = currentDateObj.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const currentDay = currentDateObj.getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <header ref={menuRef} className="fixed top-0 left-0 w-full h-7 px-4 flex justify-between items-center z-[120] bg-os-panel/60 backdrop-blur-xl border-b border-os-border text-[11px] font-sans tracking-wide text-os-text select-none shadow-md transition-colors duration-300">
      
      {/* 👇 REMOVED THE DUPLICATE ref={menuRef} FROM THIS DIV */}
      <div className="flex items-center gap-1 md:gap-4">
        <div className="relative" onMouseEnter={() => handleMenuHover('apple')}>
          <button 
            onClick={() => setOpenMenu(openMenu === 'apple' ? null : 'apple')}
            className={`flex items-center justify-center cursor-default h-6 rounded px-2 transition-colors interactive 
              ${openMenu === 'apple' ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'}
            `}
          >
            <Command size={12} className="text-emerald-500" strokeWidth={2} />
          </button>
          
          {openMenu === 'apple' && (
            <div className="absolute top-7 left-0 w-52 bg-[#181818]/95 backdrop-blur-3xl border border-os-border rounded-lg shadow-2xl py-1.5 z-[130] font-normal text-os-text">
              <button onClick={() => launchApp('profile')} className="flex items-center gap-2 w-full px-4 py-1.5 hover:bg-[#0058d0] hover:text-white rounded transition-colors text-left interactive">
                <Command size={14} className="opacity-70" />
                <span>About Pritam_OS</span>
              </button>
              <div className="h-px bg-zinc-800 my-1"></div>
              <button onClick={() => launchApp('terminal')} className="flex items-center gap-2 w-full px-4 py-1.5 hover:bg-[#0058d0] hover:text-white rounded transition-colors text-left interactive">
                <Zap size={14} className="opacity-70" />
                <span>Initialize Vibe Mode</span>
              </button>
              <div className="h-px bg-zinc-800 my-1"></div>
              <button onClick={() => window.location.reload()} className="flex items-center gap-2 w-full px-4 py-1.5 hover:bg-[#0058d0] hover:text-white rounded transition-colors text-left">
                <RotateCcw size={14} className="opacity-70" />
                <span>Restart...</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="font-bold text-zinc-100 cursor-default px-1 hidden md:block">
          Pritam_OS
        </div>

        <nav className="hidden md:flex items-center">
          {Object.keys(systemMenus).map((menuName) => (
            <div key={menuName} className="relative" onMouseEnter={() => handleMenuHover(menuName)}>
              <button 
                onClick={() => setOpenMenu(openMenu === menuName ? null : menuName)}
                className={`cursor-default px-2 py-0.5 rounded transition-colors h-6 flex items-center
                  ${openMenu === menuName ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'}
                `}
              >
                {menuName}
              </button>

              {openMenu === menuName && (
                <div className="absolute top-7 left-0 w-48 bg-[#181818]/95 backdrop-blur-3xl border border-os-border rounded-lg shadow-2xl py-1.5 z-[130] font-normal text-os-text">
                  {systemMenus[menuName].map((item, idx) => (
                    <div key={idx}>
                      <button onClick={() => setOpenMenu(null)} className="flex items-center w-full px-4 py-1.5 hover:bg-[#0058d0] hover:text-white transition-colors text-left cursor-default">
                        {item}
                      </button>
                      {(idx === 2 || idx === 4) && <div className="h-px bg-zinc-800 my-1"></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center gap-3 text-zinc-400">
          <BatteryMedium size={14} className="hover:text-emerald-400 transition-colors cursor-default" />
          <Wifi size={12} className={wifiOn ? 'text-white' : 'text-zinc-600'} />
          
          <div 
            className="flex items-center gap-1.5 bg-white/5 border border-os-border rounded px-1.5 py-0.5 cursor-pointer hover:bg-white/10 transition-colors group interactive"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          >
            <Search size={12} strokeWidth={2.5} className="text-zinc-400 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-mono text-zinc-500 group-hover:text-os-text transition-colors">⌘K</span>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setOpenMenu(openMenu === 'control' ? null : 'control')}
            className={`flex items-center justify-center cursor-default h-6 rounded px-2 transition-colors interactive 
              ${openMenu === 'control' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <SlidersHorizontal size={12} strokeWidth={2.5} />
          </button>

          {openMenu === 'control' && (
            <div className="absolute top-7 right-0 w-[300px] bg-[#181818]/95 backdrop-blur-3xl border border-os-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[130] p-4 font-normal text-os-text cursor-default">
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3 flex flex-col gap-3">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setWifiOn(!wifiOn)}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${wifiOn ? 'bg-blue-500 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
                      <Wifi size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Wi-Fi</div>
                      <div className="text-[10px] text-zinc-400">{wifiOn ? 'Home_Network' : 'Off'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setBtOn(!btOn)}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${btOn ? 'bg-blue-500 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
                      <Bluetooth size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Bluetooth</div>
                      <div className="text-[10px] text-zinc-400">{btOn ? 'On' : 'Off'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex-1 bg-zinc-800/40 border border-zinc-700/50 rounded-xl flex flex-col justify-center items-center text-zinc-400 hover:text-white transition-colors cursor-pointer interactive">
                    <Monitor size={16} className="mb-1" />
                    <span className="text-[10px]">AirDrop</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3 mb-3 flex flex-col">
                <span className="text-xs font-semibold text-white mb-2 ml-1">Display</span>
                <div className="relative flex items-center bg-zinc-900 rounded-full h-7 border border-zinc-700 overflow-hidden">
                  <div className="absolute left-2 text-zinc-400 z-10 pointer-events-none"><Sun size={12} /></div>
                  <div className="absolute top-0 left-0 h-full bg-white transition-all duration-75" style={{ width: `${brightness}%` }}></div>
                  <input 
                    type="range" min="20" max="100" 
                    value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </div>
              </div>

              <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3 mb-3 flex flex-col">
                <span className="text-xs font-semibold text-white mb-2 ml-1">Sound</span>
                <div className="relative flex items-center bg-zinc-900 rounded-full h-7 border border-zinc-700 overflow-hidden">
                  <div className="absolute left-2 text-zinc-400 z-10 pointer-events-none"><Volume2 size={12} /></div>
                  <div className="absolute top-0 left-0 h-full bg-white transition-all duration-75" style={{ width: '65%' }}></div>
                  <input type="range" min="0" max="100" defaultValue="65" className="w-full h-full opacity-0 cursor-pointer z-20" />
                </div>
              </div>

              <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3 flex flex-col">
                <span className="text-xs font-semibold text-white mb-2 ml-1">Personalization</span>
                <div className="grid grid-cols-3 gap-2">
                  
                  <button 
                    onClick={() => window.dispatchEvent(new Event('next-wallpaper'))}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors group"
                  >
                    <ImageIcon size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] text-os-text">Wallpaper</span>
                  </button>

                  <button 
                    onClick={cycleTheme}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors group"
                  >
                    {themeMode === 'Light' ? <Sun size={14} className="text-amber-400 group-hover:scale-110 transition-transform" /> : <Moon size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />}
                    <span className="text-[9px] text-os-text">{themeMode}</span>
                  </button>

                  <button 
                    onClick={cycleLang}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors group"
                  >
                    <Languages size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] text-os-text">{lang}</span>
                  </button>

                </div>
              </div>

            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setOpenMenu(openMenu === 'clock' ? null : 'clock')}
            className={`flex items-center gap-2 cursor-default h-6 px-3 rounded transition-colors 
              ${openMenu === 'clock' ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'}
            `}
          >
            <span>{mounted ? dateStr : 'Updating...'}</span>
            <span>{mounted ? time : ''}</span>
          </button>
          
          {openMenu === 'clock' && (
            <div className="absolute top-7 right-0 w-72 bg-[#181818]/95 backdrop-blur-3xl border border-os-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[130] p-4 font-normal text-os-text cursor-default">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-3xl font-light text-white mb-1">{mounted ? time : '--:--'}</div>
                  <div className="text-xs text-zinc-400">{mounted ? currentDateObj.toLocaleDateString(lang === 'EN' ? 'en-US' : lang === 'ES' ? 'es-ES' : 'fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 text-xl font-medium text-white">
                    28°C <CloudSun size={24} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">Partly Cloudy</div>
                </div>
              </div>

              <div className="h-px bg-zinc-800/80 mb-4"></div>

              <div className="px-1">
                <div className="text-sm font-medium text-zinc-100 mb-3 ml-1">
                  {currentDateObj.toLocaleDateString(lang === 'EN' ? 'en-US' : lang === 'ES' ? 'es-ES' : 'fr-FR', { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-medium text-zinc-500">
                  {weekDays.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center text-xs">
                  {blanks.map(blank => <div key={`blank-${blank}`} className="h-7"></div>)}
                  {days.map(day => {
                    const isToday = day === currentDay;
                    return (
                      <div 
                        key={day} 
                        className={`flex items-center justify-center h-7 rounded-full transition-colors cursor-default
                          ${isToday ? 'bg-[#0058d0] text-white font-medium shadow-md' : 'text-os-text hover:bg-zinc-800/80'}
                        `}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}