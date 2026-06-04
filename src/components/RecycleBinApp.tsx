'use client';
import { useState, useEffect } from 'react';
import { Trash2, Folder, RefreshCw, XCircle } from 'lucide-react';

export default function RecycleBinApp() {
  const [recycledItems, setRecycledItems] = useState<any[]>([]);

  const loadItems = () => {
    const saved = localStorage.getItem('pritam_os_recycled_items');
    if (saved) {
      try {
        setRecycledItems(JSON.parse(saved));
      } catch (e) {
        setRecycledItems([]);
      }
    } else {
      setRecycledItems([]);
    }
  };

  useEffect(() => {
    loadItems();
    window.addEventListener('trash-emptied', loadItems);
    return () => window.removeEventListener('trash-emptied', loadItems);
  }, []);

  const restoreItem = (itemToRestore: any) => {
    // 1. Remove from local Recycle Bin array
    const updatedRecycled = recycledItems.filter(item => item.id !== itemToRestore.id);
    setRecycledItems(updatedRecycled);
    localStorage.setItem('pritam_os_recycled_items', JSON.stringify(updatedRecycled));

    // 2. Add back to Desktop custom folders
    const currentFolders = JSON.parse(localStorage.getItem('pritam_os_custom_folders') || '[]');
    currentFolders.push({
      id: itemToRestore.id,
      label: itemToRestore.label,
      color: itemToRestore.color,
      fill: itemToRestore.fill,
      isCustomFolder: true
    });
    localStorage.setItem('pritam_os_custom_folders', JSON.stringify(currentFolders));

    // 3. Tell the Hero.tsx to immediately re-render so it pops back onto the desktop
    window.dispatchEvent(new Event('sync-folders'));
  };

  const deletePermanently = (id: string) => {
    const updatedRecycled = recycledItems.filter(item => item.id !== id);
    setRecycledItems(updatedRecycled);
    localStorage.setItem('pritam_os_recycled_items', JSON.stringify(updatedRecycled));
  };

  const emptyTrash = () => {
    setRecycledItems([]);
    localStorage.setItem('pritam_os_recycled_items', '[]');
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col font-sans select-none overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 bg-[#252526] border-b border-[#333] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 text-zinc-400">
          <Trash2 size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Recycle Bin</span>
        </div>
        <button 
          onClick={emptyTrash}
          disabled={recycledItems.length === 0}
          className="text-xs font-medium px-3 py-1.5 rounded border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          Empty
        </button>
      </div>
      
      {/* File List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {recycledItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
            <Trash2 size={48} className="mb-4" strokeWidth={1} />
            <p className="text-sm">The Recycle Bin is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {recycledItems.map(item => (
              <div key={item.id} className="group relative flex flex-col items-center p-3 rounded-xl hover:bg-white/5 transition-colors">
                <Folder size={40} className="text-blue-400/50 fill-blue-400/10 mb-2" strokeWidth={1} />
                <span className="text-xs text-zinc-300 text-center w-full truncate">{item.label}</span>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                  <button onClick={() => restoreItem(item)} className="p-1.5 bg-zinc-800 text-emerald-400 rounded hover:bg-zinc-700 transition-colors" title="Restore">
                    <RefreshCw size={14} />
                  </button>
                  <button onClick={() => deletePermanently(item.id)} className="p-1.5 bg-zinc-800 text-red-400 rounded hover:bg-zinc-700 transition-colors" title="Delete Permanently">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}