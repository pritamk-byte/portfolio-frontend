'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Command, TerminalSquare, User, Globe, Users, FileText, Mail, GitBranch } from 'lucide-react';

const searchData = [
  { id: 'profile', name: 'System Profile', type: 'Application', icon: User },
  { id: 'terminal', name: 'Terminal', type: 'Application', icon: TerminalSquare },
  { id: 'alumni', name: 'ConnectAlumni', type: 'Project', icon: Users },
  { id: 'esp', name: 'ESP Platform', type: 'Project', icon: Globe },
  { id: 'resume', name: 'Resume.pdf', type: 'Document', icon: FileText },
  { id: 'contact', name: 'Mail Client', type: 'Utility', icon: Mail },
  { id: 'github', name: 'GitHub Profile', type: 'Web Link', icon: GitBranch },
];

export default function Spotlight() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle Spotlight with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredResults = searchData.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard Navigation inside the Search Results
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    if (e.key === 'Enter' && filteredResults.length > 0) {
      e.preventDefault();
      launchApp(filteredResults[selectedIndex].id);
    }
  };

  const launchApp = (appId: string) => {
    if (appId === 'github') {
      window.open('https://github.com', '_blank');
    } else {
      window.dispatchEvent(new CustomEvent('launch-app', { detail: appId }));
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] px-4">
      
      {/* Background Blur Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Spotlight Modal */}
      <div className="relative w-full max-w-[650px] bg-[#1e1e1e]/90 backdrop-blur-3xl border border-zinc-700 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col animate-[fadeIn_0.15s_ease-out]">
        
        {/* Search Bar */}
        <div className="flex items-center px-4 h-14 border-b border-zinc-800">
          <Search size={22} className="text-zinc-400 mr-3" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0); // Reset selection when typing
            }}
            onKeyDown={handleInputKeyDown}
            className="flex-1 bg-transparent text-xl text-zinc-100 placeholder:text-zinc-500 outline-none font-light"
          />
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono bg-zinc-800/50 px-2 py-1 rounded">
            <Command size={10} /> <span>K</span>
          </div>
        </div>

        {/* Search Results */}
        {filteredResults.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto py-2 mac-scrollbar">
            {filteredResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => launchApp(item.id)}
                  className={`flex items-center px-4 py-2 mx-2 rounded-lg cursor-default transition-colors
                    ${isSelected ? 'bg-[#0058d0] text-white' : 'text-zinc-300 hover:bg-zinc-800'}
                  `}
                >
                  <Icon size={18} className={`mr-3 ${isSelected ? 'text-white' : 'text-zinc-400'}`} />
                  <span className="flex-1 text-sm">{item.name}</span>
                  <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-zinc-500'}`}>
                    {item.type}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-zinc-500 text-sm">
            No results found for "{query}"
          </div>
        )}
      </div>

    </div>
  );
}