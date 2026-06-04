'use client';
import { useState } from 'react';
import { FileCode2, Database, Code, ChevronRight, ChevronDown, LayoutPanelLeft } from 'lucide-react';

const files = [
  {
    id: 'java',
    name: 'AlumniController.java',
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
  },
  {
    id: 'sql',
    name: 'init_schema.sql',
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

CREATE INDEX idx_mauza_plot ON land_records(mauza_name, plot_number);`
  },
  {
    id: 'react',
    name: 'Hero.tsx',
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
      <h1 className="text-4xl font-bold tracking-tight">
        {isReady ? 'System Online' : 'Booting...'}
      </h1>
    </div>
  );
}`
  }
];

export default function CodeViewer() {
  const [activeFile, setActiveFile] = useState(files[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="w-full h-full flex bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden">
      {/* Activity Bar */}
      <div className="w-12 bg-[#333333] border-r border-[#2d2d2d] flex flex-col items-center py-4 shrink-0">
        <LayoutPanelLeft size={24} className="text-white opacity-80 mb-6 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
        <FileCode2 size={24} className="text-white opacity-40 mb-6" />
        <Database size={24} className="text-white opacity-40" />
      </div>

      {/* Explorer Sidebar */}
      {sidebarOpen && (
        <div className="w-60 bg-[#252526] border-r border-[#2d2d2d] flex flex-col shrink-0">
          <div className="text-[11px] font-semibold tracking-wider uppercase p-4">Explorer</div>
          <div className="flex items-center text-sm font-bold px-2 py-1 cursor-pointer">
            <ChevronDown size={16} className="mr-1" /> PORTFOLIO_WORKSPACE
          </div>
          <div className="flex flex-col mt-1">
            {files.map(file => (
              <div 
                key={file.id}
                onClick={() => setActiveFile(file)}
                className={`flex items-center px-6 py-1 text-[13px] cursor-pointer transition-colors ${activeFile.id === file.id ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e]'}`}
              >
                <file.icon size={14} className={`${file.color} mr-2`} />
                {file.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="flex bg-[#252526] overflow-x-auto [scrollbar-width:none]">
          <div className="flex items-center px-4 py-2 bg-[#1e1e1e] border-t border-[#007acc] text-[#ffffff] text-[13px] shrink-0">
            <activeFile.icon size={14} className={`${activeFile.color} mr-2`} />
            {activeFile.name}
          </div>
        </div>
        
        {/* Editor */}
        <div className="flex-1 overflow-auto p-4 bg-[#1e1e1e] font-mono text-[13px] leading-relaxed whitespace-pre custom-scrollbar">
          {activeFile.content.split('\n').map((line, i) => (
            <div key={i} className="table-row">
              <span className="table-cell text-right pr-6 text-[#858585] select-none">{i + 1}</span>
              <span className="table-cell text-[#d4d4d4]">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
