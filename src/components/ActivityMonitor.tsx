'use client';
import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Network } from 'lucide-react';

const generateData = (length: number, min: number, max: number) => 
  Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1) + min));

export default function ActivityMonitor() {
  const [activeTab, setActiveTab] = useState<'cpu' | 'memory' | 'network'>('cpu');
  const [history, setHistory] = useState<number[]>(generateData(40, 10, 30));
  const [currentLoad, setCurrentLoad] = useState(20);

  // Simulate real-time data processing
  useEffect(() => {
    const interval = setInterval(() => {
      const isSpike = Math.random() > 0.8;
      const change = isSpike ? Math.floor(Math.random() * 40) : Math.floor(Math.random() * 10) - 5;
      
      setCurrentLoad(prev => {
        const next = Math.min(100, Math.max(5, prev + change));
        setHistory(currHistory => [...currHistory.slice(1), next]);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Convert array data into SVG polygon points
  const graphPoints = history.map((val, i) => `${(i / 39) * 100},${100 - val}`).join(' ');

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-zinc-300 font-sans select-none">
      
      {/* Toolbar - Scrollable on mobile */}
      <div className="flex items-center gap-2 p-2 sm:p-3 bg-[#2d2d2d] border-b border-[#404040] shrink-0 overflow-x-auto [scrollbar-width:none]">
        <button onClick={() => setActiveTab('cpu')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap ${activeTab === 'cpu' ? 'bg-[#565656] text-white' : 'hover:bg-[#404040]'}`}><Cpu size={14} /> CPU</button>
        <button onClick={() => setActiveTab('memory')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap ${activeTab === 'memory' ? 'bg-[#565656] text-white' : 'hover:bg-[#404040]'}`}><HardDrive size={14} /> Memory</button>
        <button onClick={() => setActiveTab('network')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap ${activeTab === 'network' ? 'bg-[#565656] text-white' : 'hover:bg-[#404040]'}`}><Network size={14} /> Network</button>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-[#1e1e1e]">
        <div className="min-w-[300px] sm:min-w-full">
          <table className="w-full text-left text-[11px] sm:text-xs">
            <thead className="sticky top-0 bg-[#252526] border-b border-[#404040] shadow-sm z-10">
              <tr>
                <th className="font-semibold py-2 px-3 sm:px-4">Process Name</th>
                <th className="font-semibold py-2 px-3 sm:px-4">% CPU</th>
                <th className="font-semibold py-2 px-3 sm:px-4">Memory</th>
                <th className="font-semibold py-2 px-3 sm:px-4 hidden sm:table-cell">Threads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2d2d]">
              <tr className="hover:bg-[#2a2d2e] transition-colors">
                <td className="py-2.5 px-3 sm:px-4 flex items-center gap-2 truncate"><Activity size={14} className="text-blue-400 shrink-0" /> <span className="truncate">WindowManager</span></td>
                <td className="py-2.5 px-3 sm:px-4">{Math.floor(currentLoad * 0.4)}%</td>
                <td className="py-2.5 px-3 sm:px-4 whitespace-nowrap">124 MB</td>
                <td className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">12</td>
              </tr>
              <tr className="hover:bg-[#2a2d2e] transition-colors">
                <td className="py-2.5 px-3 sm:px-4 flex items-center gap-2 truncate"><Cpu size={14} className="text-emerald-400 shrink-0" /> <span className="truncate">SyntheticAudio</span></td>
                <td className="py-2.5 px-3 sm:px-4">{Math.floor(currentLoad * 0.2)}%</td>
                <td className="py-2.5 px-3 sm:px-4 whitespace-nowrap">45 MB</td>
                <td className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">4</td>
              </tr>
              <tr className="hover:bg-[#2a2d2e] transition-colors">
                <td className="py-2.5 px-3 sm:px-4 flex items-center gap-2 truncate"><Network size={14} className="text-rose-400 shrink-0" /> <span className="truncate">React Runtime</span></td>
                <td className="py-2.5 px-3 sm:px-4">{Math.floor(currentLoad * 0.15)}%</td>
                <td className="py-2.5 px-3 sm:px-4 whitespace-nowrap">256 MB</td>
                <td className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">8</td>
              </tr>
              <tr className="hover:bg-[#2a2d2e] transition-colors text-zinc-500">
                <td className="py-2.5 px-3 sm:px-4 flex items-center gap-2 truncate"><span className="w-3.5 shrink-0"></span> <span className="truncate">idle_task</span></td>
                <td className="py-2.5 px-3 sm:px-4">{100 - currentLoad}%</td>
                <td className="py-2.5 px-3 sm:px-4">--</td>
                <td className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time SVG Graph Bottom Panel */}
      <div className="h-44 sm:h-48 bg-[#252526] border-t border-[#404040] p-3 sm:p-4 flex flex-row gap-4 sm:gap-6 shrink-0">
        <div className="w-24 sm:w-1/3 flex flex-col justify-center shrink-0">
          <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">System Load</div>
          <div className="text-2xl sm:text-4xl font-light text-white mb-2">{currentLoad}%</div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-[10px] sm:text-xs font-medium">
            <span className="text-blue-400">User: {Math.floor(currentLoad * 0.7)}%</span>
            <span className="text-rose-400">Sys: {Math.floor(currentLoad * 0.3)}%</span>
          </div>
        </div>
        
        <div className="flex-1 relative border border-[#404040] rounded bg-[#1e1e1e] overflow-hidden">
          {/* SVG Graph */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#333" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#333" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#333" strokeWidth="0.5" />
            
            {/* Fill gradient */}
            <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
            <polygon points={`0,100 ${graphPoints} 100,100`} fill="url(#graphGradient)" />
            
            {/* The line itself */}
            <polyline points={graphPoints} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

    </div>
  );
}