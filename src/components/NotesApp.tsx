'use client';
import { useState, useEffect } from 'react';
import { SquarePen, Trash2, Search } from 'lucide-react';

type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount (with custom Easter Egg defaults!)
  useEffect(() => {
    const savedNotes = localStorage.getItem('pritam_os_notes');
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      setNotes(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    } else {
      const defaultNotes = [
        {
          id: '1',
          title: 'Candidate Review: Pritam',
          content: 'Strong background in full-stack development.\n\nKey Technical Strengths:\n- Java & Complex SQL Database Management\n- Built the ConnectAlumni platform\n- Handled complex database schemas and real-world system architecture (e.g., land mutation records).\n\nAction item: Schedule technical interview ASAP!',
          date: new Date().toLocaleDateString()
        },
        {
          id: '2',
          title: 'Personal Reminders',
          content: '1. Refactor backend APIs.\n2. Optimize Pandas data processing.\n3. Check the next Royal Challengers Bangalore (RCB) match time! 🏏',
          date: new Date().toLocaleDateString()
        }
      ];
      setNotes(defaultNotes);
      setActiveId(defaultNotes[0].id);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever notes change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pritam_os_notes', JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const createNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      date: new Date().toLocaleDateString()
    };
    setNotes([newNote, ...notes]);
    setActiveId(newNote.id);
  };

  const deleteNote = (idToDelete: string) => {
    const filtered = notes.filter(n => n.id !== idToDelete);
    setNotes(filtered);
    if (activeId === idToDelete) {
      setActiveId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const updateNote = (text: string) => {
    if (!activeId) return;
    
    // Auto-generate title from first line
    const lines = text.split('\n');
    const newTitle = lines[0].trim() || 'New Note';

    setNotes(notes.map(note => 
      note.id === activeId ? { ...note, title: newTitle, content: text, date: new Date().toLocaleDateString() } : note
    ));
  };

  const activeNote = notes.find(n => n.id === activeId);
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded) return <div className="w-full h-full bg-[#1e1e1e]"></div>;

  return (
    <div className="w-full h-full flex bg-[#1e1e1e] font-sans text-zinc-200 overflow-hidden">
      
      {/* LEFT SIDEBAR: Note List */}
      <div className="w-64 border-r border-white/10 bg-[#141414] flex flex-col shrink-0">
        
        {/* Sidebar Header */}
        <div className="h-14 px-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md py-1 pl-8 pr-3 text-xs text-zinc-300 outline-none focus:border-white/20 transition-all placeholder:text-zinc-600"
            />
          </div>
          <button 
            onClick={createNote}
            className="ml-3 p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <SquarePen size={16} />
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] p-2 space-y-1">
          {filteredNotes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveId(note.id)}
              className={`w-full text-left p-3 rounded-lg transition-all border ${
                activeId === note.id 
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-50' 
                  : 'border-transparent hover:bg-white/5 text-zinc-400'
              }`}
            >
              <div className="text-sm font-semibold truncate leading-tight mb-1">{note.title}</div>
              <div className="text-[11px] opacity-60 flex justify-between items-center">
                <span>{note.date}</span>
                <span className="truncate ml-2 flex-1 text-right">
                  {note.content.replace(/\n/g, ' ').substring(0, 20)}
                </span>
              </div>
            </button>
          ))}
          {filteredNotes.length === 0 && (
            <div className="text-center text-xs text-zinc-600 mt-8">No notes found</div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Editor Area */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
        {activeNote ? (
          <>
            <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <span className="text-xs font-medium text-zinc-500">{activeNote.date}</span>
              <button 
                onClick={() => deleteNote(activeNote.id)}
                className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                title="Delete Note"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(e.target.value)}
              className="flex-1 w-full p-6 bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-zinc-300 custom-scrollbar"
              placeholder="Start typing..."
              spellCheck={false}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
            Select or create a note
          </div>
        )}
      </div>
      
    </div>
  );
}