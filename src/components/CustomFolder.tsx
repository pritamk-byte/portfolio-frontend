'use client';
import { FolderOpen } from 'lucide-react';

export default function CustomFolder({ folderName }: { folderName: string }) {
  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col items-center justify-center text-zinc-500 font-sans select-none relative overflow-hidden">
      {/* Folder Header */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#252526] border-b border-[#333] flex items-center px-4 shrink-0">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">{folderName}</span>
      </div>
      
      {/* Empty State Body */}
      <FolderOpen size={56} className="mb-4 opacity-20" strokeWidth={1} />
      <p className="text-sm font-medium text-zinc-400">This folder is empty.</p>
      <p className="text-xs mt-2 opacity-40">Drag and drop functionality coming soon.</p>
    </div>
  );
}