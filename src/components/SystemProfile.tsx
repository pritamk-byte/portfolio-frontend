'use client';
import { useState } from 'react';
import { Search, User, Monitor, Code2, Database, Cpu, Zap, Fingerprint, TerminalSquare, Check, Layers } from 'lucide-react';

export default function SystemProfile() {
  const [activeTab, setActiveTab] = useState<'general' | 'developer' | 'vibe'>('general');

  // macOS Settings Icon Box
  const SettingIcon = ({ icon: Icon, colorClass }: { icon: any, colorClass: string }) => (
    <div className={`w-7 h-7 rounded-[6px] flex items-center justify-center text-white shadow-sm ${colorClass}`}>
      <Icon size={14} strokeWidth={2.5} />
    </div>
  );

  // macOS Toggle Switch
  const Toggle = ({ active }: { active: boolean }) => (
    <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-[#34c759]' : 'bg-[#39393d]'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
    </div>
  );

  return (
    <div className="absolute inset-0 w-full h-full bg-[#000000] font-sans flex text-[13px] overflow-hidden select-none">
      
      {/* LEFT PANE: Sidebar */}
      <div className="w-60 bg-os-window/60 backdrop-blur-2xl border-r border-white/[0.05] flex flex-col shrink-0 z-10">
        
        {/* Search Bar */}
        <div className="px-4 py-4">
          <div className="bg-[#000000]/20 border border-white/[0.05] rounded-md flex items-center px-2 py-1.5 text-zinc-400 shadow-inner">
            <Search size={14} className="mr-2 opacity-60" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none w-full text-[13px] text-os-text placeholder:text-zinc-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mac-scrollbar px-2">
          
          {/* Apple ID Card */}
          <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-default">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-zinc-600 to-zinc-800 flex items-center justify-center shadow-inner">
              <User size={20} className="text-white drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-zinc-100">Pritam Poddar</span>
              <span className="text-[11px] text-zinc-500">System Admin</span>
            </div>
          </div>

          <div className="h-px bg-white/[0.05] mx-2 mb-2"></div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-0.5">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-left
                ${activeTab === 'general' ? 'bg-[#0058d0] text-white' : 'text-os-text hover:bg-white/[0.05]'}
              `}
            >
              <SettingIcon icon={Fingerprint} colorClass="bg-zinc-500" />
              <span className="text-[13px]">General Identity</span>
            </button>

            <button 
              onClick={() => setActiveTab('developer')}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-left
                ${activeTab === 'developer' ? 'bg-[#0058d0] text-white' : 'text-os-text hover:bg-white/[0.05]'}
              `}
            >
              <SettingIcon icon={Code2} colorClass="bg-[#0058d0]" />
              <span className="text-[13px]">Developer Arsenal</span>
            </button>

            <button 
              onClick={() => setActiveTab('vibe')}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-left
                ${activeTab === 'vibe' ? 'bg-[#0058d0] text-white' : 'text-os-text hover:bg-white/[0.05]'}
              `}
            >
              <SettingIcon icon={Zap} colorClass="bg-orange-500" />
              <span className="text-[13px]">Operating Mode</span>
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT PANE: Settings Content */}
      <div className="flex-1 overflow-y-auto mac-scrollbar bg-[#000000]">
        
        {/* --- GENERAL IDENTITY --- */}
        {activeTab === 'general' && (
          <div className="max-w-2xl mx-auto py-10 px-8 lg:px-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-6">General Identity</h2>
            
            <div className="bg-[#1c1c1e] rounded-xl overflow-hidden border border-white/[0.05] mb-8 shadow-sm">
              <div className="p-5 flex items-center gap-5 bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e]">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-white/[0.05] shadow-inner">
                  <User size={32} className="text-zinc-400" />
                </div>
                <div>
                  <div className="text-lg font-medium text-zinc-100 mb-0.5">Follows Logic.</div>
                  <div className="text-[13px] text-zinc-400">Software Engineer & Backend Architect</div>
                </div>
              </div>
              
              <div className="p-5 text-[13px] text-os-text leading-relaxed border-t border-white/[0.05]">
                I build digital solutions where code strictly dictates the form. My approach favors logical clarity over unnecessary complexity.<br /><br />
                I am a developer who genuinely enjoys translating complex computational problems into practical, grounded solutions. I let the code speak for itself.
              </div>
            </div>

            <h3 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2 ml-3">Core Philosophy</h3>
            <div className="bg-[#1c1c1e] rounded-xl overflow-hidden border border-white/[0.05] flex flex-col divide-y divide-white/[0.05] shadow-sm">
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3.5">
                  <SettingIcon icon={Cpu} colorClass="bg-purple-500" />
                  <span className="text-os-text">Full-Stack Core Focus</span>
                </div>
                <Check size={16} className="text-[#34c759] mr-1" strokeWidth={3} />
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3.5">
                  <SettingIcon icon={Monitor} colorClass="bg-zinc-500" />
                  <span className="text-os-text">Minimalist UI Aesthetic</span>
                </div>
                <Check size={16} className="text-[#34c759] mr-1" strokeWidth={3} />
              </div>
            </div>
          </div>
        )}

        {/* --- DEVELOPER ARSENAL --- */}
        {activeTab === 'developer' && (
          <div className="max-w-2xl mx-auto py-10 px-8 lg:px-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-6">Developer Arsenal</h2>
            
            <h3 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2 ml-3">Core Engines</h3>
            <div className="bg-[#1c1c1e] rounded-xl overflow-hidden border border-white/[0.05] mb-8 flex flex-col divide-y divide-white/[0.05] shadow-sm">
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3.5">
                  <SettingIcon icon={TerminalSquare} colorClass="bg-red-500" />
                  <span className="text-os-text">Java</span>
                </div>
                <span className="text-zinc-500 text-xs mr-1">Stable Build</span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3.5">
                  <SettingIcon icon={TerminalSquare} colorClass="bg-yellow-500" />
                  <span className="text-os-text">Python</span>
                </div>
                <span className="text-zinc-500 text-xs mr-1">Stable Build</span>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3.5">
                  <SettingIcon icon={TerminalSquare} colorClass="bg-indigo-500" />
                  <span className="text-os-text">C</span>
                </div>
                <span className="text-zinc-500 text-xs mr-1">Stable Build</span>
              </div>
            </div>

            <h3 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2 ml-3">Database & Storage</h3>
            <div className="bg-[#1c1c1e] rounded-xl overflow-hidden border border-white/[0.05] mb-8 shadow-sm">
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3.5">
                  <SettingIcon icon={Database} colorClass="bg-blue-500" />
                  <span className="text-os-text">PostgreSQL / SQL</span>
                </div>
                <span className="text-zinc-500 text-xs mr-1">Active Connect</span>
              </div>
            </div>

            <h3 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2 ml-3">Modern Frameworks & Web</h3>
            <div className="bg-[#1c1c1e] rounded-xl overflow-hidden border border-white/[0.05] flex flex-col divide-y divide-white/[0.05] shadow-sm">
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3.5">
                  <SettingIcon icon={Layers} colorClass="bg-[#00c7b7]" />
                  <span className="text-os-text">React.js</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3.5">
                  <SettingIcon icon={Layers} colorClass="bg-[#34c759]" />
                  <span className="text-os-text">Node.js</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3.5">
                  <SettingIcon icon={Code2} colorClass="bg-zinc-600" />
                  <span className="text-os-text">JavaScript / HTML / CSS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIBE CODING --- */}
        {activeTab === 'vibe' && (
          <div className="max-w-2xl mx-auto py-10 px-8 lg:px-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-6">Operating Mode</h2>

            <div className="bg-[#1c1c1e] rounded-xl overflow-hidden border border-white/[0.05] flex flex-col shadow-sm">
              
              <div className="p-8 border-b border-white/[0.05] flex flex-col items-center justify-center text-center gap-4 bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e]">
                <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
                  <Zap size={32} className="text-orange-500 drop-shadow-lg" />
                </div>
                <div>
                  <div className="text-lg font-medium text-zinc-100 mb-1">Vibe Coding Protocol</div>
                  <div className="text-[13px] text-[#34c759] font-medium">Status: Active</div>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-white/[0.05]">
                <div className="flex items-center justify-between p-4">
                  <span className="text-os-text text-[14px]">State Flow</span>
                  <Toggle active={true} />
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <span className="text-os-text text-[14px]">Overthinking</span>
                  <Toggle active={false} />
                </div>
              </div>

              <div className="p-5 font-mono text-[12px] text-zinc-400 bg-[#151515] border-t border-white/[0.05]">
                <div className="text-zinc-600 mb-2">/* System Configuration Override */</div>
                <div className="mb-1"><span className="text-[#ff7ab2]">const</span> output = <span className="text-[#34c759]">"IMMACULATE"</span>;</div>
                <div><span className="text-[#ff7ab2]">export default</span> function executeVibe();</div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}