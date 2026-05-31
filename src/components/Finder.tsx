'use client';
import { useState } from 'react';
import { Folder, FileText, Terminal, Globe, Users, HardDrive, Monitor, ChevronLeft, ChevronRight, LayoutGrid, List, Search, Airplay, Clock, Cloud } from 'lucide-react';

// --- THE VIRTUAL FILE SYSTEM ---
const fileSystem: Record<string, any[]> = {
  'Desktop': [
    { id: 'resume', name: 'Resume.pdf', type: 'file', icon: FileText, color: 'text-yellow-400' },
    { id: 'terminal', name: 'Terminal.app', type: 'file', icon: Terminal, color: 'text-emerald-400' },
    { id: 'projects', name: 'Projects', type: 'folder', icon: Folder, color: 'text-blue-400' },
  ],
  'Projects': [
    { id: 'alumni', name: 'ConnectAlumni.app', type: 'file', icon: Users, color: 'text-orange-400' },
    { id: 'esp', name: 'ESP_Core.app', type: 'file', icon: Globe, color: 'text-blue-400' },
    { id: 'source_code', name: 'Source Code', type: 'folder', icon: Folder, color: 'text-blue-400' },
  ],
  'Source Code': [
    { id: 'github', name: 'GitHub_Repo.link', type: 'file', icon: FileText, color: 'text-white' }
  ],
  'Documents': [
    { id: 'profile', name: 'System_Profile.app', type: 'file', icon: UserCircle, color: 'text-zinc-300' },
    { id: 'contact', name: 'Secure_Mail.app', type: 'file', icon: Mail, color: 'text-purple-400' },
  ],
  'Downloads': [
    { id: 'installer', name: 'PritamOS_v2.dmg', type: 'file', icon: HardDrive, color: 'text-zinc-400' }
  ]
};

// Quick helper icons for the sidebar
import { UserCircle, Mail } from 'lucide-react';

export default function Finder() {
  const [currentFolder, setCurrentFolder] = useState('Desktop');
  const [history, setHistory] = useState<string[]>(['Desktop']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const currentFiles = fileSystem[currentFolder] || [];

  const navigateTo = (folder: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folder);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolder(folder);
    setSelectedFile(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFolder(history[historyIndex - 1]);
      setSelectedFile(null);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentFolder(history[historyIndex + 1]);
      setSelectedFile(null);
    }
  };

  const handleFileAction = (item: any) => {
    if (item.type === 'folder') {
      navigateTo(item.name);
    } else {
      // Launch App!
      if (item.id === 'github') {
        window.open('https://github.com', '_blank');
      } else {
        window.dispatchEvent(new CustomEvent('launch-app', { detail: item.id }));
      }
    }
  };

  // Mobile Single-Tap VS PC Double-Click logic
  const handleInteraction = (e: React.MouseEvent, item: any, isDoubleClick: boolean = false) => {
    e.stopPropagation();
    const isMobile = window.innerWidth < 768;
    
    if (isMobile || isDoubleClick) {
      handleFileAction(item);
    } else {
      setSelectedFile(item.id);
    }
  };

  return (
    <div className="flex w-full h-full bg-[#1e1e1e] text-zinc-200 select-none font-sans" onClick={() => setSelectedFile(null)}>
      
      {/* SIDEBAR */}
      <div className="w-48 bg-[#2a2a2b]/90 backdrop-blur-xl border-r border-black/50 flex flex-col shrink-0 hidden sm:flex">
        <div className="px-4 py-2 mt-2 text-[10px] font-bold text-zinc-500 tracking-wider">Favorites</div>
        <div className="flex flex-col px-2 gap-0.5 text-xs font-medium">
          <SidebarItem icon={Airplay} label="Desktop" active={currentFolder === 'Desktop'} onClick={() => navigateTo('Desktop')} />
          <SidebarItem icon={FileText} label="Documents" active={currentFolder === 'Documents'} onClick={() => navigateTo('Documents')} />
          <SidebarItem icon={Cloud} label="Downloads" active={currentFolder === 'Downloads'} onClick={() => navigateTo('Downloads')} />
        </div>

        <div className="px-4 py-2 mt-4 text-[10px] font-bold text-zinc-500 tracking-wider">iCloud</div>
        <div className="flex flex-col px-2 gap-0.5 text-xs font-medium">
          <SidebarItem icon={Folder} label="Projects" active={currentFolder === 'Projects'} onClick={() => navigateTo('Projects')} />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1c1c1e]">
        
        {/* Toolbar */}
        <div className="h-14 border-b border-black/50 flex items-center justify-between px-4 bg-[#2d2d2d] shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <button onClick={goBack} disabled={historyIndex === 0} className={`p-1 rounded ${historyIndex === 0 ? 'text-zinc-600' : 'text-zinc-300 hover:bg-white/10'}`}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={goForward} disabled={historyIndex === history.length - 1} className={`p-1 rounded ${historyIndex === history.length - 1 ? 'text-zinc-600' : 'text-zinc-300 hover:bg-white/10'}`}>
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="font-semibold text-sm tracking-wide hidden md:block">{currentFolder}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-zinc-800 rounded-md border border-zinc-700 overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'}`}><LayoutGrid size={14} /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'}`}><List size={14} /></button>
            </div>
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-2.5 top-1.5 text-zinc-400" />
              <input type="text" placeholder="Search" className="bg-zinc-800 border border-zinc-700 rounded-md h-7 pl-8 pr-3 text-xs outline-none focus:border-blue-500 w-40 placeholder:text-zinc-500" />
            </div>
          </div>
        </div>

        {/* File View */}
        <div className="flex-1 overflow-y-auto p-4 mac-scrollbar">
          {viewMode === 'grid' ? (
            <div className="flex flex-wrap gap-4 items-start">
              {currentFiles.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedFile === item.id;
                return (
                  <div 
                    key={item.name}
                    onClick={(e) => handleInteraction(e, item, false)}
                    onDoubleClick={(e) => handleInteraction(e, item, true)}
                    className="flex flex-col items-center gap-2 w-24 p-2 rounded-lg cursor-default interactive"
                  >
                    <div className={`w-16 h-16 flex items-center justify-center rounded-xl transition-colors ${isSelected ? 'bg-white/10 ring-1 ring-white/20' : ''}`}>
                      <Icon size={42} className={item.color} strokeWidth={1.5} />
                    </div>
                    <span className={`text-[11px] text-center leading-tight px-1.5 py-0.5 rounded ${isSelected ? 'bg-blue-600 text-white' : 'text-zinc-300'}`}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
              {currentFiles.length === 0 && <div className="text-zinc-500 text-sm w-full text-center mt-10">Folder is empty</div>}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex text-xs font-semibold text-zinc-500 border-b border-zinc-800 pb-2 mb-2 px-2">
                <div className="flex-1">Name</div>
                <div className="w-32 hidden sm:block">Kind</div>
              </div>
              {currentFiles.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedFile === item.id;
                return (
                  <div 
                    key={item.name}
                    onClick={(e) => handleInteraction(e, item, false)}
                    onDoubleClick={(e) => handleInteraction(e, item, true)}
                    className={`flex items-center text-sm px-2 py-1.5 rounded-md cursor-default interactive ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}
                  >
                    <Icon size={16} className={`mr-3 ${isSelected ? 'text-white' : item.color}`} />
                    <div className="flex-1 truncate">{item.name}</div>
                    <div className={`w-32 text-xs hidden sm:block ${isSelected ? 'text-blue-200' : 'text-zinc-500'}`}>
                      {item.type === 'folder' ? 'Folder' : 'Application'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-default interactive ${active ? 'bg-white/20 text-white font-semibold' : 'text-zinc-400 hover:bg-white/10 hover:text-zinc-200'}`}
    >
      <Icon size={14} className={active ? 'text-blue-400' : ''} />
      <span>{label}</span>
    </div>
  );
}