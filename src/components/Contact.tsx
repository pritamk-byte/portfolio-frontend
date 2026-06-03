'use client';
import { useState, useEffect } from 'react';
import { Send, Inbox, Send as SendIcon, PenSquare, Trash2, Archive, Search, CheckCircle2, AlertCircle, ArrowLeft, MailX } from 'lucide-react';

type Email = {
  id: string;
  sender: string;
  email: string;
  subject: string;
  snippet: string;
  time: string;
  body: string;
  folder: 'inbox' | 'sent' | 'archive' | 'trash';
};

// --- DEFAULT GREETING EMAILS ---
const DEFAULT_EMAILS: Email[] = [
  {
    id: '1',
    folder: 'inbox',
    sender: 'Pritam Poddar',
    email: 'contact@pritam.dev',
    subject: 'Welcome to my Interactive Workspace',
    snippet: 'Thank you for visiting. I built this OS-style portfolio to...',
    time: '10:00 AM',
    body: 'Hello and welcome!\n\nI engineered this interactive web-based OS to showcase my passion for building seamless, high-performance applications. As a software engineer deeply involved in full-stack development, I enjoy managing complex codebases, from responsive frontends to robust backend and database integrations.\n\nPlease feel free to explore the apps, check out my code, and experience the environment.\n\nBest regards,\nPritam Poddar'
  },
  {
    id: '2',
    folder: 'inbox',
    sender: 'Pritam Poddar',
    email: 'projects@pritam.dev',
    subject: 'Featured Projects & Architecture',
    snippet: 'A quick overview of the Engineering Services Platform and ConnectAlumni...',
    time: 'Yesterday',
    body: 'Hi again,\n\nWhile you are here, I highly recommend checking out my core projects available on the desktop:\n\n1. ConnectAlumni: A platform designed to bridge the gap between students and college alumni for professional networking.\n2. ESP Core: A comprehensive engineering services platform.\n\nMy technical stack frequently includes Java, SQL, React, and various database management strategies to ensure scalable and reliable systems.\n\nCheers,\nPritam'
  },
  {
    id: '3',
    folder: 'inbox',
    sender: 'Pritam Poddar',
    email: 'connect@pritam.dev',
    subject: "Let's Connect!",
    snippet: 'If you are looking for a dedicated software engineer...',
    time: 'Monday',
    body: 'Hello,\n\nIf you are a recruiter, fellow developer, or just someone passing by, I would love to connect!\n\nYou can use the "Compose" button right here in this app to send me a real message (it connects directly to my backend API). Your sent messages will automatically save to your Sent folder here on the OS.\n\nLooking forward to hearing from you!\n\nBest,\nPritam Poddar'
  }
];

export default function Contact() {
  const [mails, setMails] = useState<Email[]>([]);
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent'>('inbox');
  const [activeTab, setActiveTab] = useState<'read' | 'compose'>('read');
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  
  // Responsive Mobile View Management
  const [mobileView, setMobileView] = useState<'list' | 'details' | 'compose'>('list');
  
  // Form State for Compose Mode
  const [formState, setFormState] = useState<'idle' | 'transmitting' | 'success' | 'error'>('idle');

  // --- MEMORY: Load and Save Emails ---
  useEffect(() => {
    const savedMails = localStorage.getItem('pritam_os_mails');
    if (savedMails) {
      const parsed = JSON.parse(savedMails);
      setMails(parsed);
      const initialFolderMails = parsed.filter((m: Email) => m.folder === 'inbox');
      if (initialFolderMails.length > 0) setSelectedMailId(initialFolderMails[0].id);
    } else {
      setMails(DEFAULT_EMAILS);
      setSelectedMailId(DEFAULT_EMAILS[0].id);
    }
  }, []);

  const saveMailsToMemory = (newMails: Email[]) => {
    setMails(newMails);
    localStorage.setItem('pritam_os_mails', JSON.stringify(newMails));
  };

  const currentFolderMails = mails.filter(m => m.folder === activeFolder);
  const selectedMail = mails.find(m => m.id === selectedMailId);

  const handleFolderChange = (folder: 'inbox' | 'sent') => {
    setActiveFolder(folder);
    setActiveTab('read');
    setMobileView('list');
    const folderMails = mails.filter(m => m.folder === folder);
    setSelectedMailId(folderMails.length > 0 ? folderMails[0].id : null);
  };

  const handleMoveMail = (id: string, targetFolder: 'archive' | 'trash') => {
    const updatedMails = mails.map(m => m.id === id ? { ...m, folder: targetFolder } : m);
    saveMailsToMemory(updatedMails);
    
    // Auto-select the next available mail in the current folder
    const remainingInFolder = updatedMails.filter(m => m.folder === activeFolder);
    if (remainingInFolder.length > 0) {
      setSelectedMailId(remainingInFolder[0].id);
    } else {
      setSelectedMailId(null);
    }
    
    // If on mobile, kick them back to the list view so they aren't stuck on a deleted email
    if (mobileView === 'details') setMobileView('list');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('transmitting');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Transmission failed');

      // 👇 Save the sent mail locally to the Sent folder!
      const newSentMail: Email = {
        id: Date.now().toString(),
        folder: 'sent',
        sender: String(data.name || 'Visitor'),
        email: String(data.email),
        subject: 'Message to Pritam',
        snippet: String(data.message).substring(0, 40) + '...',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        body: String(data.message)
      };
      
      saveMailsToMemory([newSentMail, ...mails]);

      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        handleFolderChange('sent'); // Automatically switch to sent folder to show them it saved!
      }, 3000);
      
    } catch (error) {
      console.error(error);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-os-window font-sans flex text-sm overflow-hidden">
      
      {/* 1. LEFT PANE: Folders (Visible on tablets and desktop) */}
      <div className="hidden md:flex flex-col w-40 lg:w-48 bg-[#181818] border-r border-os-border/50 pt-2 shrink-0">
        <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Favorites</div>
        
        <button 
          onClick={() => handleFolderChange('inbox')}
          className={`flex items-center justify-between px-4 py-2 mx-2 rounded-md transition-colors ${activeFolder === 'inbox' && activeTab !== 'compose' ? 'bg-[#2d2d2d] text-zinc-100' : 'text-zinc-400 hover:bg-[#252525]'}`}
        >
          <div className="flex items-center gap-3"><Inbox size={16} /> Inbox</div>
          {mails.filter(m => m.folder === 'inbox').length > 0 && (
            <span className="text-xs bg-zinc-700 text-os-text px-1.5 py-0.5 rounded-full">
              {mails.filter(m => m.folder === 'inbox').length}
            </span>
          )}
        </button>

        <button 
          onClick={() => handleFolderChange('sent')}
          className={`flex items-center gap-3 px-4 py-2 mx-2 rounded-md transition-colors mt-1 ${activeFolder === 'sent' && activeTab !== 'compose' ? 'bg-[#2d2d2d] text-zinc-100' : 'text-zinc-400 hover:bg-[#252525]'}`}
        >
          <SendIcon size={16} /> Sent
        </button>
      </div>

      {/* 2. MIDDLE PANE: Message List */}
      <div className={`w-full md:w-64 lg:w-72 flex-shrink-0 bg-os-window border-r border-os-border/50 flex flex-col ${mobileView !== 'list' ? 'hidden md:flex' : 'flex'}`}>
        {/* Toolbar */}
        <div className="h-12 border-b border-os-border/50 flex items-center justify-between px-4 shrink-0 bg-[#252525]">
          <div className="font-semibold text-os-text capitalize">{activeFolder}</div>
          <button 
            onClick={() => {
              setActiveTab('compose');
              setMobileView('compose');
              setSelectedMailId(null);
            }}
            className="text-zinc-400 hover:text-emerald-400 transition-colors p-1"
            title="Compose New Message"
          >
            <PenSquare size={18} />
          </button>
        </div>

        {/* 👇 Mobile Only: Folder Segmented Control */}
        <div className="flex md:hidden p-2 bg-[#181818] border-b border-os-border/50 gap-2 shrink-0">
          <button 
            onClick={() => handleFolderChange('inbox')}
            className={`flex-1 text-center py-1.5 rounded text-xs font-medium transition-colors ${activeFolder === 'inbox' ? 'bg-[#0058d0] text-white' : 'bg-[#2d2d2d] text-zinc-400'}`}
          >
            Inbox
          </button>
          <button 
            onClick={() => handleFolderChange('sent')}
            className={`flex-1 text-center py-1.5 rounded text-xs font-medium transition-colors ${activeFolder === 'sent' ? 'bg-[#0058d0] text-white' : 'bg-[#2d2d2d] text-zinc-400'}`}
          >
            Sent
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-os-border/50 shrink-0 hidden md:block">
          <div className="bg-[#2d2d2d] rounded-md flex items-center px-2 py-1.5 text-zinc-400">
            <Search size={14} className="mr-2" />
            <input type="text" placeholder="Search" className="bg-transparent border-none outline-none w-full text-xs text-os-text placeholder:text-zinc-500" />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto mac-scrollbar">
          {currentFolderMails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-8 text-center">
              <MailX size={32} className="mb-2 opacity-50" />
              <div className="text-xs">No messages in {activeFolder}</div>
            </div>
          ) : (
            currentFolderMails.map((mail) => (
              <button
                key={mail.id}
                onClick={() => {
                  setSelectedMailId(mail.id);
                  setActiveTab('read');
                  setMobileView('details');
                }}
                className={`w-full text-left p-3 border-b border-os-border/30 transition-colors
                  ${activeTab === 'read' && selectedMailId === mail.id 
                    ? 'bg-[#0058d0] text-white' 
                    : 'hover:bg-[#252525] text-os-text'
                  }
                `}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold truncate pr-2">{mail.sender}</span>
                  <span className={`text-[10px] shrink-0 ${activeTab === 'read' && selectedMailId === mail.id ? 'text-blue-200' : 'text-zinc-500'}`}>
                    {mail.time}
                  </span>
                </div>
                <div className="font-medium text-xs mb-1 truncate">{mail.subject}</div>
                <div className={`text-xs truncate ${activeTab === 'read' && selectedMailId === mail.id ? 'text-blue-200' : 'text-zinc-500'}`}>
                  {mail.snippet}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* 3. RIGHT PANE: Message Viewer OR Compose Window */}
      <div className={`flex-1 bg-os-window flex flex-col ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Right Pane Toolbar */}
        <div className="h-12 border-b border-os-border/50 flex items-center justify-between md:justify-end px-4 shrink-0 gap-4 text-zinc-400 bg-[#252525]">
          <button 
            onClick={() => setMobileView('list')} 
            className="flex md:hidden items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> <span className="text-xs">Back</span>
          </button>

          {activeTab === 'compose' ? (
            <span className="text-xs font-mono text-emerald-500 animate-pulse truncate max-w-[200px] sm:max-w-none">Secure SMTP Relay Ready...</span>
          ) : (
            selectedMail && (
              <div className="flex items-center gap-4">
                <button onClick={() => handleMoveMail(selectedMail.id, 'archive')} className="hover:text-os-text" title="Archive"><Archive size={16} /></button>
                <button onClick={() => handleMoveMail(selectedMail.id, 'trash')} className="hover:text-red-400" title="Delete"><Trash2 size={16} /></button>
              </div>
            )
          )}
        </div>

        {/* --- VIEW MODE: Read Email --- */}
        {activeTab === 'read' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 mac-scrollbar">
            {selectedMail ? (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-4 sm:mb-6 break-words">{selectedMail.subject}</h2>
                
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#2d2d2d] flex items-center justify-center text-zinc-400 font-bold shrink-0">
                    {selectedMail.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-os-text truncate">{selectedMail.sender}</div>
                    <div className="text-xs text-zinc-500 truncate">
                      {activeFolder === 'sent' ? `To: Pritam Poddar <contact@pritam.dev>` : `From: ${selectedMail.email}`}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500 shrink-0 self-start pt-1">{selectedMail.time}</div>
                </div>

                <div className="text-os-text leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">
                  {selectedMail.body}
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
                Select an item to read
              </div>
            )}
          </div>
        )}

        {/* --- COMPOSE MODE: The Actual Form --- */}
        {activeTab === 'compose' && (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            
            <div className="px-4 sm:px-6 py-3 border-b border-os-border/50 flex items-center text-os-text overflow-hidden">
              <span className="text-zinc-500 w-16 sm:w-20 shrink-0">To:</span>
              <span className="bg-[#2d2d2d] px-2 py-1 rounded text-xs sm:text-sm truncate">
                Pritam Poddar &lt;contact@pritam.dev&gt;
              </span>
            </div>

            <div className="px-4 sm:px-6 py-3 border-b border-os-border/50 flex items-center">
              <span className="text-zinc-500 w-16 sm:w-20 shrink-0">From:</span>
              <input 
                type="email" 
                name="email"
                required
                disabled={formState !== 'idle'}
                placeholder="your.email@example.com" 
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-os-text placeholder:text-zinc-700 min-w-0"
              />
            </div>

            <div className="px-4 sm:px-6 py-3 border-b border-os-border/50 flex items-center">
              <span className="text-zinc-500 w-16 sm:w-20 shrink-0">Identity:</span>
              <input 
                type="text" 
                name="name"
                required
                disabled={formState !== 'idle'}
                placeholder="Your Name / Company" 
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-os-text placeholder:text-zinc-700 min-w-0"
              />
            </div>

            <div className="flex-1 p-4 sm:p-6 min-h-0">
              <textarea 
                name="message"
                required
                disabled={formState !== 'idle'}
                placeholder="Compose your message..." 
                className="w-full h-full bg-transparent border-none outline-none text-xs sm:text-sm text-os-text placeholder:text-zinc-700 resize-none mac-scrollbar"
              ></textarea>
            </div>

            {/* Compose Footer / Send Button */}
            <div className="p-4 border-t border-os-border/50 bg-[#252525] flex justify-end shrink-0 gap-3">
              <button 
                type="button"
                onClick={() => {
                  setActiveTab('read');
                  setMobileView('list');
                }}
                className="px-4 py-2 rounded-md text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={formState !== 'idle'}
                className={`w-full sm:w-auto px-6 py-2 rounded-md flex items-center justify-center gap-2 font-medium text-sm transition-all
                  ${formState === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                    formState === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                    'bg-[#0058d0] hover:bg-[#0069f6] text-white'}
                `}
              >
                {formState === 'transmitting' && <span className="animate-pulse">Sending...</span>}
                {formState === 'success' && <><CheckCircle2 size={16} /> Sent</>}
                {formState === 'error' && <><AlertCircle size={16} /> Failed</>}
                {formState === 'idle' && <><Send size={14} /> Send Message</>}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}