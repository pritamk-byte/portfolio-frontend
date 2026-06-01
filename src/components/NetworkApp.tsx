'use client';
import { useState } from 'react';
import { Mail, Globe, ExternalLink, Check, Copy } from 'lucide-react';

// --- NATIVE SVG ICONS (Bypasses the Lucide brand icon issue entirely) ---
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function NetworkApp() {
  const [copied, setCopied] = useState(false);
  const email = "im.pritamk@gmail.com"; // 👈 Swap with your actual email!

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] text-os-text font-sans relative overflow-hidden flex flex-col">
      
      {/* Animated Ambient Background (Tailwind v4 Optimized!) */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-100 h-100 rounded-full bg-blue-600/20 blur-[100px] pointer-events-none"></div>

      <div className="flex-1 overflow-y-auto custom-scrollbar z-10 p-8">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-10 mt-4">
          <div className="relative group cursor-default mb-4">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative w-24 h-24 rounded-full bg-os-panel border border-os-border flex items-center justify-center overflow-hidden shadow-2xl">
              <span className="text-4xl font-bold bg-linear-to-br from-white to-zinc-500 text-transparent bg-clip-text">P</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-wide">Pritam Poddar</h1>
          <p className="text-sm text-zinc-400 font-medium mt-1 font-mono uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Software Engineer
          </p>
        </div>

        {/* Primary Connections Grid (Tailwind v4 Optimized!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          
          <a href="https://github.com/pritamk-byte" target="_blank" rel="noreferrer" 
             className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/8 hover:border-white/15 transition-all duration-300 overflow-hidden">
            <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300">
              <GithubIcon className="text-os-text group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white flex items-center gap-2">GitHub <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 group-hover:translate-y-0" /></div>
              <div className="text-xs text-zinc-500 mt-0.5">View my repositories</div>
            </div>
          </a>

          <a href="https://linkedin.com/in/im-pritamk" target="_blank" rel="noreferrer" 
             className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-[#0a66c2]/10 hover:border-[#0a66c2]/30 transition-all duration-300 overflow-hidden">
            <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[#0a66c2]">
              <LinkedinIcon className="text-os-text group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white flex items-center gap-2">LinkedIn <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 group-hover:translate-y-0" /></div>
              <div className="text-xs text-zinc-500 mt-0.5">Professional network</div>
            </div>
          </a>

          {/* ConnectAlumni Featured Card */}
          <a href="https://alumni-network-frontend-sepia.vercel.app/" target="_blank" rel="noreferrer" 
             className="group relative flex items-center gap-4 p-4 rounded-xl bg-linear-to-br from-orange-500/10 to-rose-500/5 border border-orange-500/20 hover:from-orange-500/20 hover:to-rose-500/10 hover:border-orange-500/40 transition-all duration-300 md:col-span-2">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Globe size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-orange-50 flex items-center gap-2">ConnectAlumni <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 group-hover:translate-y-0 text-orange-300" /></div>
              <div className="text-xs text-orange-200/60 mt-0.5">Founder & Lead Developer</div>
            </div>
          </a>

        </div>

        {/* Email Direct Copy Section */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="p-1 rounded-2xl bg-linear-to-b from-white/10 to-transparent">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f0f0f] border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Direct Email</div>
                  <div className="text-sm text-os-text font-mono mt-0.5">{email}</div>
                </div>
              </div>
              
              <button 
                onClick={handleCopyEmail}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-os-text border border-os-border hover:bg-white/10 hover:text-white'}
                `}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}