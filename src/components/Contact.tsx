'use client';
import { useState, useEffect } from 'react';
import { Send, Inbox, Send as SendIcon, PenSquare, Trash2, Archive, Search, CheckCircle2, AlertCircle, ArrowLeft, MailX, RefreshCw, XCircle } from 'lucide-react';

type Email = {
  id: string;
  folder: 'inbox' | 'sent' | 'archive' | 'trash';
  sender: string;
  email: string;
  subject: string;
  snippet: string;
  time: string;
  body: string;
};

// --- DEFAULT GREETING EMAILS & FAKE HISTORY ---
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
  },
  {
    id: '4',
    folder: 'archive',
    sender: 'GitHub',
    email: 'noreply@github.com',
    subject: 'Dependabot Alert: 3 updates available',
    snippet: 'Dependabot has found 3 updates for your repositories...',
    time: 'May 12',
    body: 'Dependabot has successfully updated the following dependencies in your React frontend environment:\n\n- lucide-react (v0.290.0)\n- tailwindcss (v3.4.1)\n- next (v14.1.0)\n\nAll automated testing suites passed. These PRs have been merged.'
  },
  {
    id: '5',
    folder: 'archive',
    sender: 'Vercel',
    email: 'deploy@vercel.com',
    subject: 'Deployment Successful',
    snippet: 'Your production deployment for Pritam_OS is live...',
    time: 'May 10',
    body: 'Deployment Complete!\n\nYour project "pritam-os-portfolio" has been successfully deployed to production. The edge network has cached your static assets and Serverless functions are nominal.'
  },
  {
    id: '6',
    folder: 'trash',
    sender: 'Spam Filter',
    email: 'marketing@fakecompany.com',
    subject: 'Grow your LinkedIn network by 5000%!',
    snippet: 'Are you tired of not having enough connections? Click here...',
    time: 'May 01',
    body: 'WARNING: This message was flagged as spam.\n\n"Hey there! We noticed you have an amazing profile. Pay us $50 and we will use bots to artificially inflate your LinkedIn connections!"'
  }
];

export default function Contact() {
  const [mails, setMails] = useState<Email[]>([]);
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'archive' | 'trash'>('inbox');
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

  const handleFolderChange = (folder: 'inbox' | 'sent' | 'archive' | 'trash') => {
    setActiveFolder(folder);
    setActiveTab('read');
    setMobileView('list');
    const folderMails = mails.filter(m => m.folder === folder);
    setSelectedMailId(folderMails.length > 0 ? folderMails[0].id : null);
  };

  // Move an email to a different folder
  const handleMoveMail = (id: string, targetFolder: 'inbox' | 'archive' | 'trash') => {
    const updatedMails = mails.map(m => m.id === id ? { ...m, folder: targetFolder } : m);
    saveMailsToMemory(updatedMails);
    
    // Auto-select the next available mail in the current folder
    const remainingInFolder = updatedMails.filter(m => m.folder === activeFolder);
    setSelectedMailId(remainingInFolder.length > 0 ? remainingInFolder[0].id : null);
    
    if (mobileView === 'details') setMobileView('list');
  };

  // Permanently delete a single email
  const handlePermanentDelete = (id: string) => {
    const updatedMails = mails.filter(m => m.id !== id);
    saveMailsToMemory(updatedMails);
    
    const remainingInFolder = updatedMails.filter(m => m.folder === activeFolder);
    setSelectedMailId(remainingInFolder.length > 0 ? remainingInFolder[0].id : null);
    
    if (mobileView === 'details') setMobileView('list');
  };

  // Empty the entire trash folder
  const handleEmptyTrash = () => {
    const updatedMails = mails.filter(m => m.folder !== 'trash');
    saveMailsToMemory(updatedMails);
    setSelectedMailId(null);
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

      // Save the sent mail locally to the Sent folder!
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
        handleFolderChange('sent'); // Automatically switch to sent folder
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
        <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Favorites</div>
        
        <button onClick={() => handleFolderChange('inbox')} className={`flex items-center justify-between px-4 py-2 mx-2 rounded-md transition-colors ${activeFolder === 'inbox' && activeTab !== 'compose' ? 'bg-[#2d2d2d] text-zinc-100' : 'text-zinc-400 hover:bg-[#252525]'}`}>
          <div className="flex items-center gap-3"><Inbox size={16} /> Inbox</div>
          {mails.filter(m => m.folder === 'inbox').length > 0 && (
            <span className="text-xs bg-zinc-700 text-os-text px-1.5 py-0.5 rounded-full">{mails.filter(m => m.folder === 'inbox').length}</span>
          )}
        </button>

        <button onClick={() => handleFolderChange('sent')} className={`flex items-center gap-3 px-4 py-2 mx-2 rounded-md transition-colors mt-1 ${activeFolder === 'sent' && activeTab !== 'compose' ? 'bg-[#2d2d2d] text-zinc-100' : 'text-zinc-400 hover:bg-[#252525]'}`}>
          <SendIcon size={16} /> Sent
        </button>

        <button onClick={() => handleFolderChange('archive')} className={`flex items-center gap-3 px-4 py-2 mx-2 rounded-md transition-colors mt-1 ${activeFolder === 'archive' && activeTab !== 'compose' ? 'bg-[#2d2d2d] text-zinc-100' : 'text-zinc-400 hover:bg-[#252525]'}`}>
          <Archive size={16} /> Archive
        </button>

        <button onClick={() => handleFolderChange('trash')} className={`flex items-center justify-between px-4 py-2 mx-2 rounded-md transition-colors mt-1 ${activeFolder === 'trash' && activeTab !== 'compose' ? 'bg-[#2d2d2d] text-zinc-100' : 'text-zinc-400 hover:bg-[#252525]'}`}>
          <div className="flex items-center gap-3"><Trash2 size={16} /> Trash</div>
          {mails.filter(m => m.folder === 'trash').length > 0 && (
            <span className="text-xs bg-zinc-700/50 text-zinc-500 px-1.5 py-0.5 rounded-full">{mails.filter(m => m.folder === 'trash').length}</span>
          )}
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

        {/* 👇 Mobile Only: Scrollable Folder Segmented Control */}
        <div className="flex md:hidden p-2 bg-[#181818] border-b border-os-border/50 gap-2 shrink-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button onClick={() => handleFolderChange('inbox')} className={`px-4 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${activeFolder === 'inbox' ? 'bg-[#0058d0] text-white' : 'bg-[#2d2d2d] text-zinc-400'}`}>Inbox</button>
          <button onClick={() => handleFolderChange('sent')} className={`px-4 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${activeFolder === 'sent' ? 'bg-[#0058d0] text-white' : 'bg-[#2d2d2d] text-zinc-400'}`}>Sent</button>
          <button onClick={() => handleFolderChange('archive')} className={`px-4 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${activeFolder === 'archive' ? 'bg-[#0058d0] text-white' : 'bg-[#2d2d2d] text-zinc-400'}`}>Archive</button>
          <button onClick={() => handleFolderChange('trash')} className={`px-4 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${activeFolder === 'trash' ? 'bg-[#0058d0] text-white' : 'bg-[#2d2d2d] text-zinc-400'}`}>Trash</button>
        </div>

        {/* Trash Auto-Delete Warning Banner */}
        {activeFolder === 'trash' && (
          <div className="bg-[#1e1e1e] p-2 flex flex-col items-center justify-center border-b border-os-border/50 shrink-0">
            <span className="text-[10px] text-zinc-500 mb-1.5 text-center">Items in Trash will be automatically deleted after 30 days.</span>
            {currentFolderMails.length > 0 && (
              <button onClick={handleEmptyTrash} className="text-xs text-blue-400 hover:text-blue-300 font-medium">Empty Trash Now</button>
            )}
          </div>
        )}

        {/* Email List */}
        <div className="flex-1 overflow-y-auto mac-scrollbar">
          {currentFolderMails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-8 text-center">
              <MailX size={32} className="mb-2 opacity-30" />
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
                {activeFolder === 'trash' ? (
                  <>
                    <button onClick={() => handleMoveMail(selectedMail.id, 'inbox')} className="hover:text-emerald-400" title="Restore to Inbox"><RefreshCw size={16} /></button>
                    <button onClick={() => handlePermanentDelete(selectedMail.id)} className="hover:text-red-500 text-red-400/70" title="Delete Permanently"><XCircle size={16} /></button>
                  </>
                ) : activeFolder === 'archive' ? (
                  <>
                    <button onClick={() => handleMoveMail(selectedMail.id, 'inbox')} className="hover:text-os-text" title="Move to Inbox"><Inbox size={16} /></button>
                    <button onClick={() => handleMoveMail(selectedMail.id, 'trash')} className="hover:text-red-400" title="Move to Trash"><Trash2 size={16} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleMoveMail(selectedMail.id, 'archive')} className="hover:text-os-text" title="Archive"><Archive size={16} /></button>
                    <button onClick={() => handleMoveMail(selectedMail.id, 'trash')} className="hover:text-red-400" title="Move to Trash"><Trash2 size={16} /></button>
                  </>
                )}
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