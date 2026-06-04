'use client';
import { useState } from 'react';
import { 
  FileCode2, Database, Code, ChevronRight, ChevronDown, 
  LayoutPanelLeft, X, GitBranch, RefreshCw, XCircle, AlertTriangle, 
  TerminalSquare, Play, Search, Copy, Code2
} from 'lucide-react';
// --- FILE SYSTEM DATA ---
const fileSystem = [
  {
    folder: 'src/api/controllers',
    isOpen: true,
    files: [
      {
        id: 'java',
        name: 'AlumniController.java',
        lang: 'Java',
        icon: Code,
        color: 'text-red-400',
        content: `package com.connectalumni.api.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/v1/network")
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    // Handles fetching matched alumni based on industry
    @GetMapping("/match")
    public ResponseEntity<List<ProfileDTO>> getIndustryMatches(
        @RequestParam String industry,
        @RequestParam int gradYear
    ) {
        // Optimized O(log n) indexing retrieval
        List<ProfileDTO> matches = alumniService.findOptimalMatches(industry, gradYear);
        return ResponseEntity.ok(matches);
    }
}`
      }
    ]
  },
  {
    folder: 'database/migrations',
    isOpen: true,
    files: [
      {
        id: 'sql',
        name: 'init_schema.sql',
        lang: 'SQL',
        icon: Database,
        color: 'text-zinc-300',
        content: `-- Core Relational Schema for Land Records & Mutations

CREATE TABLE land_records (
    parcel_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mauza_name VARCHAR(255) NOT NULL,
    plot_number VARCHAR(100) NOT NULL,
    owner_id UUID REFERENCES users(id),
    deed_date DATE NOT NULL,
    mutation_type VARCHAR(50) CHECK (mutation_type IN ('SALE', 'INHERITANCE', 'GIFT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimize queries for plot lookups
CREATE INDEX idx_mauza_plot ON land_records(mauza_name, plot_number);`
      }
    ]
  },
  {
    folder: 'src/components',
    isOpen: false,
    files: [
      {
        id: 'react',
        name: 'Hero.tsx',
        lang: 'React',
        icon: FileCode2,
        color: 'text-blue-400',
        content: `import { useEffect, useState } from 'react';

export default function Hero() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize OS environment
    setIsReady(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight text-white">
        {isReady ? 'System Online' : 'Booting...'}
      </h1>
    </div>
  );
}`
      }
    ]
  }
];

// Flat list for easy lookup
const allFiles = fileSystem.flatMap(f => f.files);

// --- ZERO-DEPENDENCY SYNTHETIC SYNTAX HIGHLIGHTER ---
const highlightCode = (code: string) => {
  let html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Strings (orange)
  html = html.replace(/(&quot;.*?&quot;|'.*?'|`.*?`)/g, '<span style="color: #ce9178;">$1</span>');
  // Keywords (blue)
  html = html.replace(/\b(import|from|export|default|function|const|let|var|return|if|else|for|while|class|public|private|final|package|int|String|List|UUID|VARCHAR|DATE|TIMESTAMP|PRIMARY KEY|REFERENCES|CHECK|CREATE TABLE|CREATE INDEX|ON|DEFAULT|NOT NULL)\b/g, '<span style="color: #569cd6;">$1</span>');
  // Annotations / React Components (teal)
  html = html.replace(/(@[A-Za-z]+|&lt;[A-Z][A-Za-z]* \/&gt;|&lt;[A-Z][A-Za-z]*&gt;|&lt;\/[A-Z][A-Za-z]*&gt;)/g, '<span style="color: #4ec9b0;">$1</span>');
  // Comments (green)
  html = html.replace(/(\/\/.*|--.*)/g, '<span style="color: #6a9955;">$1</span>');
  
  return html;
};

export default function CodeViewer() {
  const [folders, setFolders] = useState(fileSystem);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  
  // Tab Management State
  const [openFiles, setOpenFiles] = useState([allFiles[0]]);
  const [activeFileId, setActiveFileId] = useState<string | null>(allFiles[0].id);

  const activeFile = allFiles.find(f => f.id === activeFileId);

  const toggleFolder = (folderName: string) => {
    setFolders(folders.map(f => f.folder === folderName ? { ...f, isOpen: !f.isOpen } : f));
  };

  const handleOpenFile = (file: any) => {
    if (!openFiles.find(f => f.id === file.id)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFileId(file.id);
  };

  const handleCloseFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newOpen = openFiles.filter(f => f.id !== id);
    setOpenFiles(newOpen);
    if (activeFileId === id) {
      setActiveFileId(newOpen.length > 0 ? newOpen[newOpen.length - 1].id : null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden select-none">
      
      {/* --- TOP ROW: Activity Bar + Explorer + Editor --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 1. Activity Bar (Far Left) */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 shrink-0 border-r border-[#252526]">
          <LayoutPanelLeft 
            size={24} 
            className={`mb-6 cursor-pointer transition-colors ${sidebarOpen ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'}`} 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
          />
          <Search size={22} className="text-zinc-500 hover:text-zinc-400 mb-6 cursor-pointer" />
          <GitBranch size={22} className="text-zinc-500 hover:text-zinc-400 mb-6 cursor-pointer" />
          <Play size={22} className="text-zinc-500 hover:text-zinc-400 cursor-pointer" />
        </div>

        {/* 2. Explorer Sidebar */}
        {sidebarOpen && (
          <div className="w-56 bg-[#252526] flex flex-col shrink-0">
            <div className="text-[11px] font-semibold tracking-wider uppercase p-4 text-zinc-400">Explorer</div>
            <div className="flex items-center text-xs font-bold px-2 py-1 mb-2 bg-[#37373d]/50">
              <ChevronDown size={14} className="mr-1" /> PRITAM_PORTFOLIO
            </div>
            
            <div className="flex flex-col flex-1 overflow-y-auto [scrollbar-width:none]">
              {folders.map(folder => (
                <div key={folder.folder}>
                  <div 
                    onClick={() => toggleFolder(folder.folder)}
                    className="flex items-center px-4 py-1 text-[12px] cursor-pointer hover:bg-[#2a2d2e] text-zinc-300 font-medium"
                  >
                    {folder.isOpen ? <ChevronDown size={14} className="mr-1" /> : <ChevronRight size={14} className="mr-1" />}
                    {folder.folder.split('/').pop()}
                  </div>
                  {folder.isOpen && folder.files.map(file => (
                    <div 
                      key={file.id}
                      onClick={() => handleOpenFile(file)}
                      className={`flex items-center pl-9 pr-4 py-1 text-[13px] cursor-pointer transition-colors ${activeFileId === file.id ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-zinc-400'}`}
                    >
                      <file.icon size={14} className={`${file.color} mr-2 shrink-0`} />
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          
          {/* Editor Tabs */}
          {openFiles.length > 0 ? (
            <div className="flex bg-[#252526] overflow-x-auto [scrollbar-width:none] border-b border-[#2d2d2d] shrink-0">
              {openFiles.map(file => (
                <div 
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`group flex items-center px-3 py-2 text-[12px] shrink-0 cursor-pointer border-t-2 border-r border-r-[#2d2d2d] ${activeFileId === file.id ? 'bg-[#1e1e1e] border-t-blue-500 text-white' : 'bg-[#2d2d2d] border-t-transparent text-zinc-400 hover:bg-[#1e1e1e]/50'}`}
                >
                  <file.icon size={14} className={`${file.color} mr-2`} />
                  <span className="mr-3">{file.name}</span>
                  <X 
                    size={14} 
                    onClick={(e) => handleCloseFile(e, file.id)}
                    className={`hover:bg-white/10 rounded-sm p-0.5 ${activeFileId === file.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-10 bg-[#252526] border-b border-[#2d2d2d] shrink-0"></div>
          )}
          
          {/* Code View */}
          <div className="flex-1 overflow-auto bg-[#1e1e1e] relative">
            {activeFile ? (
              <div className="flex p-4 font-mono text-[13px] leading-relaxed select-text">
                {/* Line Numbers */}
                <div className="flex flex-col text-right pr-6 select-none border-r border-[#404040] text-[#858585]">
                  {activeFile.content.split('\n').map((_, i) => (
                    <span key={i} className="min-w-[1.5rem]">{i + 1}</span>
                  ))}
                </div>
                {/* The Code */}
                <div className="pl-6 whitespace-pre overflow-x-auto [scrollbar-width:none]">
                  {activeFile.content.split('\n').map((line, i) => (
                    <div 
                      key={i} 
                      className="min-w-full"
                      dangerouslySetInnerHTML={{ __html: highlightCode(line) || '&#8203;' }} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Code2 size={120} className="text-white/5 stroke-[0.5]" />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- INTEGRATED TERMINAL (BOTTOM PANEL) --- */}
      {terminalOpen && (
        <div className="h-48 bg-[#1e1e1e] border-t border-[#404040] flex flex-col shrink-0">
          <div className="flex items-center justify-between px-4 pt-2">
            <div className="flex gap-4 text-[11px] uppercase tracking-wider font-semibold">
              <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer">Problems</span>
              <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer">Output</span>
              <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer">Debug Console</span>
              <span className="text-white border-b border-white pb-1 cursor-pointer">Terminal</span>
            </div>
            <X size={14} className="text-zinc-400 hover:text-white cursor-pointer" onClick={() => setTerminalOpen(false)} />
          </div>
          <div className="flex-1 p-4 font-mono text-[12px] text-zinc-300 overflow-y-auto [scrollbar-width:none]">
            <div className="text-emerald-400 mb-1">pritam@os:~/portfolio-workspace$ <span className="text-white">mvn spring-boot:run</span></div>
            <div className="text-zinc-500 mb-1">[INFO] Scanning for projects...</div>
            <div className="text-zinc-500 mb-1">[INFO] Building connect-alumni-api 1.0.0</div>
            <div className="text-zinc-300 mb-1">  .   ____          _            __ _ _</div>
            <div className="text-zinc-300 mb-1"> /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\</div>
            <div className="text-zinc-300 mb-1">( ( )\\___ | '_ | '_| | '_ \\/ _\` | \\ \\ \\ \\</div>
            <div className="text-zinc-300 mb-1"> \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )</div>
            <div className="text-zinc-300 mb-1">  '  |____| .__|_| |_|_| |_\\__, | / / / /</div>
            <div className="text-zinc-300 mb-2"> =========|_|==============|___/=/_/_/_/</div>
            <div className="text-zinc-400">Tomcat started on port(s): 8080 (http) with context path ''</div>
            <div className="text-blue-400 mt-1">Started Application in 2.458 seconds (JVM running for 3.12)</div>
          </div>
        </div>
      )}

      {/* --- STATUS BAR (FOOTER) --- */}
      <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-medium shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded"><GitBranch size={12}/> main*</div>
          <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded"><RefreshCw size={12}/> 0</div>
          <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded"><XCircle size={12}/> 0 <AlertTriangle size={12}/> 0</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="cursor-pointer hover:bg-white/20 px-1 rounded">Ln 14, Col 32</div>
          <div className="cursor-pointer hover:bg-white/20 px-1 rounded">Spaces: 4</div>
          <div className="cursor-pointer hover:bg-white/20 px-1 rounded">UTF-8</div>
          <div className="cursor-pointer hover:bg-white/20 px-1 rounded">{activeFile ? activeFile.lang : 'Ready'}</div>
          {!terminalOpen && <TerminalSquare size={14} className="cursor-pointer hover:opacity-80" onClick={() => setTerminalOpen(true)}/>}
        </div>
      </div>

    </div>
  );
}