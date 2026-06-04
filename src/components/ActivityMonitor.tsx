'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Activity, Cpu, HardDrive, Network, LayoutGrid, TerminalSquare, Compass, 
  Music2, Calculator, Mail, SquarePen, Globe, FileText, Users, Gamepad2, 
  Crosshair, Palette, Code2, Camera, CloudSun
} from 'lucide-react';

// 👇 1. APP REGISTRY: Maps app IDs to their display info and base resource usage
const APP_REGISTRY: Record<string, { name: string, cpu: number, ram: number, icon: any, color: string }> = {
  finder: { name: 'Finder', cpu: 1.2, ram: 85, icon: LayoutGrid, color: 'text-blue-400' },
  profile: { name: 'System Profile', cpu: 0.8, ram: 45, icon: Users, color: 'text-zinc-100' },
  vscode: { name: 'VS Code', cpu: 8.5, ram: 350, icon: Code2, color: 'text-blue-500' },
  calc: { name: 'Calculator', cpu: 0.5, ram: 25, icon: Calculator, color: 'text-orange-400' },
  terminal: { name: 'Terminal', cpu: 2.1, ram: 65, icon: TerminalSquare, color: 'text-emerald-400' },
  esp: { name: 'ESP Platform', cpu: 4.0, ram: 180, icon: Globe, color: 'text-blue-400' },
  alumni: { name: 'ConnectAlumni', cpu: 4.5, ram: 190, icon: Users, color: 'text-orange-400' },
  resume: { name: 'Document Viewer', cpu: 1.0, ram: 70, icon: FileText, color: 'text-yellow-400' },
  contact: { name: 'Mail Client', cpu: 2.5, ram: 110, icon: Mail, color: 'text-purple-400' },
  github: { name: 'GitHub', cpu: 1.5, ram: 90, icon: Globe, color: 'text-zinc-100' },
  snake: { name: 'Data Worm', cpu: 6.0, ram: 120, icon: Gamepad2, color: 'text-emerald-400' },
  minesweeper: { name: 'Cyber Sweeper', cpu: 3.5, ram: 80, icon: Crosshair, color: 'text-red-400' },
  paint: { name: 'Studio', cpu: 5.5, ram: 210, icon: Palette, color: 'text-pink-400' },
  notes: { name: 'Notes', cpu: 1.5, ram: 60, icon: SquarePen, color: 'text-amber-400' },
  network: { name: 'Network', cpu: 2.0, ram: 95, icon: Network, color: 'text-indigo-400' },
  guide: { name: 'Text Editor', cpu: 0.8, ram: 40, icon: FileText, color: 'text-os-text' },
  player: { name: 'VibeTunes', cpu: 3.0, ram: 150, icon: Music2, color: 'text-rose-500' },
  activity: { name: 'Activity Monitor', cpu: 4.2, ram: 90, icon: Activity, color: 'text-emerald-400' },
  browser: { name: 'WebSphere', cpu: 12.0, ram: 480, icon: Compass, color: 'text-blue-400' },
  lens: { name: 'Lens', cpu: 15.0, ram: 310, icon: Camera, color: 'text-zinc-100' },
  weather: { name: 'Forecast', cpu: 2.0, ram: 75, icon: CloudSun, color: 'text-blue-400' }
};

const generateData = (length: number, min: number, max: number) => 
  Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1) + min));

type Process = { id: string, name: string, cpu: number, ram: number, icon: any, color: string };

// 👇 2. ACCEPTS THE OPEN APPS ARRAY AS A PROP
export default function ActivityMonitor({ openApps = [] }: { openApps?: string[] }) {
  const [activeTab, setActiveTab] = useState<'cpu' | 'memory' | 'network'>('cpu');
  const [history, setHistory] = useState<number[]>(generateData(40, 5, 15));
  const [currentLoad, setCurrentLoad] = useState(10);
  const [processes, setProcesses] = useState<Process[]>([]);

  // Keep a mutable ref of open apps so the interval doesn't need to be recreated
  const openAppsRef = useRef(openApps);
  
  useEffect(() => {
    const apps = [...openApps];
    if (!apps.includes('activity')) apps.push('activity'); // Ensure Activity Monitor itself is always tracked!
    openAppsRef.current = apps;
  }, [openApps]);

  // Simulate real-time data processing based on ACTUAL open apps
  useEffect(() => {
    const interval = setInterval(() => {
      let totalCpu = 0;
      const currentProcesses: Process[] = [];

      // 1. Always run the base OS Process
      const osCpu = 3 + Math.random() * 2;
      const osRam = 412 + Math.random() * 10;
      totalCpu += osCpu;
      currentProcesses.push({ id: 'os', name: 'Window Server', cpu: osCpu, ram: osRam, icon: Cpu, color: 'text-zinc-400' });

      // 2. Map through currently open apps and apply jitter
      openAppsRef.current.forEach(appId => {
        const appData = APP_REGISTRY[appId] || { name: appId, cpu: 2.0, ram: 50, icon: Activity, color: 'text-zinc-400' };
        
        // Jitter: CPU fluctuates +/- 20%, RAM fluctuates +/- 5%
        const jitterCpu = appData.cpu * (0.8 + Math.random() * 0.4); 
        const jitterRam = appData.ram * (0.95 + Math.random() * 0.1);
        
        totalCpu += jitterCpu;
        currentProcesses.push({
          id: appId,
          name: appData.name,
          cpu: jitterCpu,
          ram: jitterRam,
          icon: appData.icon,
          color: appData.color
        });
      });

      // Sort processes by CPU usage (highest at the top)
      currentProcesses.sort((a, b) => b.cpu - a.cpu);

      setProcesses(currentProcesses);
      
      // Update global graph
      setCurrentLoad(prev => {
        // Occasional global system spike
        const isSpike = Math.random() > 0.9;
        if (isSpike) totalCpu += Math.random() * 15;

        const next = Math.min(100, Math.max(1, Math.round(totalCpu)));
        setHistory(currHistory => [...currHistory.slice(1), next]);
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const graphPoints = history.map((val, i) => `${(i / 39) * 100},${100 - val}`).join(' ');

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-zinc-300 font-sans select-none">
      
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 sm:p-3 bg-[#2d2d2d] border-b border-[#404040] shrink-0 overflow-x-auto [scrollbar-width:none]">
        <button onClick={() => setActiveTab('cpu')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap ${activeTab === 'cpu' ? 'bg-[#565656] text-white' : 'hover:bg-[#404040]'}`}><Cpu size={14} /> CPU</button>
        <button onClick={() => setActiveTab('memory')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap ${activeTab === 'memory' ? 'bg-[#565656] text-white' : 'hover:bg-[#404040]'}`}><HardDrive size={14} /> Memory</button>
        <button onClick={() => setActiveTab('network')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap ${activeTab === 'network' ? 'bg-[#565656] text-white' : 'hover:bg-[#404040]'}`}><Network size={14} /> Network</button>
      </div>

      {/* Dynamic Process List */}
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
              {processes.map(proc => (
                <tr key={proc.id} className="hover:bg-[#2a2d2e] transition-colors">
                  <td className="py-2.5 px-3 sm:px-4 flex items-center gap-2 truncate">
                    <proc.icon size={14} className={`${proc.color} shrink-0`} /> 
                    <span className="truncate">{proc.name}</span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">{proc.cpu.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 sm:px-4 whitespace-nowrap">{Math.round(proc.ram)} MB</td>
                  <td className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">{Math.max(1, Math.floor(proc.ram / 40))}</td>
                </tr>
              ))}
              <tr className="hover:bg-[#2a2d2e] transition-colors text-zinc-500">
                <td className="py-2.5 px-3 sm:px-4 flex items-center gap-2 truncate">
                  <span className="w-3.5 shrink-0"></span> <span className="truncate">idle_task</span>
                </td>
                <td className="py-2.5 px-3 sm:px-4">{Math.max(0, 100 - currentLoad).toFixed(1)}%</td>
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
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <line x1="0" y1="25" x2="100" y2="25" stroke="#333" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#333" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#333" strokeWidth="0.5" />
            
            <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
            <polygon points={`0,100 ${graphPoints} 100,100`} fill="url(#graphGradient)" />
            <polyline points={graphPoints} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

    </div>
  );
}