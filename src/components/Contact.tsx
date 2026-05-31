'use client';
import { useState } from 'react';
import { Send, Inbox, Send as SendIcon, PenSquare, Trash2, Archive, Search, User, CheckCircle2, AlertCircle } from 'lucide-react';

// --- FAKE EMAILS DATABASE ---
const FAKE_MAILS = [
  {
    id: '1',
    sender: 'System Admin',
    email: 'admin@pritam-os.local',
    subject: 'Welcome to Pritam-OS',
    snippet: 'Initialization complete. All systems are running nominally...',
    time: '10:42 AM',
    body: 'Welcome to the interactive portfolio environment.\n\nAll backend microservices are currently stable. The 6-tier RBAC system is enforcing strict policies, and the Brevo SMTP relay is online and awaiting transmission.\n\nFeel free to explore the system.'
  },
  {
    id: '2',
    sender: 'GitHub Alerts',
    email: 'noreply@github.com',
    subject: '[Action Required] Repository Starred',
    snippet: 'Someone just starred your Engineering Services Platform repository...',
    time: 'Yesterday',
    body: 'Congratulations!\n\nA recruiter just reviewed your architecture and starred your repository. Your implementation of Prisma connection pooling with Supabase was highly noted.'
  },
  {
    id: '3',
    sender: 'Tech Recruiter',
    email: 'talent@bigtech.com',
    subject: 'Senior Full-Stack Engineering Role',
    snippet: 'We saw your OS portfolio and were incredibly impressed...',
    time: 'Tuesday',
    body: 'Hi Pritam,\n\nWe came across your interactive desktop portfolio and were blown away by the attention to detail and backend complexity you showcased.\n\nAre you available for a quick technical screen next week?'
  }
];

export default function Contact() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [selectedMailId, setSelectedMailId] = useState<string>(FAKE_MAILS[0].id);
  
  // Form State for Compose Mode
  const [formState, setFormState] = useState<'idle' | 'transmitting' | 'success' | 'error'>('idle');

  const selectedMail = FAKE_MAILS.find(m => m.id === selectedMailId) || FAKE_MAILS[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('transmitting');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('https://portfolio-backend-t2zv.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Transmission failed');

      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        setActiveTab('inbox'); // Return to inbox after sending
      }, 3000);
      
    } catch (error) {
      console.error(error);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#1e1e1e] font-sans flex text-sm overflow-hidden">
      
      {/* 1. LEFT PANE: Folders (Hidden on small screens) */}
      <div className="hidden lg:flex flex-col w-48 bg-[#181818] border-r border-zinc-800/50 pt-2">
        <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Favorites</div>
        
        <button 
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center justify-between px-4 py-2 mx-2 rounded-md transition-colors ${activeTab === 'inbox' ? 'bg-[#2d2d2d] text-zinc-100' : 'text-zinc-400 hover:bg-[#252525]'}`}
        >
          <div className="flex items-center gap-3">
            <Inbox size={16} /> Inbox
          </div>
          <span className="text-xs bg-zinc-700 text-zinc-200 px-1.5 py-0.5 rounded-full">3</span>
        </button>

        <button className="flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-zinc-400 hover:bg-[#252525] transition-colors mt-1">
          <SendIcon size={16} /> Sent
        </button>
      </div>

      {/* 2. MIDDLE PANE: Message List */}
      <div className="w-full md:w-72 flex-shrink-0 bg-[#1e1e1e] border-r border-zinc-800/50 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-zinc-800/50 flex items-center justify-between px-4 shrink-0 bg-[#252525]">
          <div className="font-semibold text-zinc-200">Inbox</div>
          <button 
            onClick={() => setActiveTab('compose')}
            className="text-zinc-400 hover:text-emerald-400 transition-colors"
            title="Compose New Message"
          >
            <PenSquare size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-zinc-800/50 shrink-0">
          <div className="bg-[#2d2d2d] rounded-md flex items-center px-2 py-1.5 text-zinc-400">
            <Search size={14} className="mr-2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none w-full text-xs text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto mac-scrollbar">
          {FAKE_MAILS.map((mail) => (
            <button
              key={mail.id}
              onClick={() => {
                setSelectedMailId(mail.id);
                setActiveTab('inbox');
              }}
              className={`w-full text-left p-3 border-b border-zinc-800/30 transition-colors
                ${activeTab === 'inbox' && selectedMailId === mail.id 
                  ? 'bg-[#0058d0] text-white' 
                  : 'hover:bg-[#252525] text-zinc-300'
                }
              `}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold truncate pr-2">{mail.sender}</span>
                <span className={`text-[10px] shrink-0 ${activeTab === 'inbox' && selectedMailId === mail.id ? 'text-blue-200' : 'text-zinc-500'}`}>
                  {mail.time}
                </span>
              </div>
              <div className="font-medium text-xs mb-1 truncate">{mail.subject}</div>
              <div className={`text-xs truncate ${activeTab === 'inbox' && selectedMailId === mail.id ? 'text-blue-200' : 'text-zinc-500'}`}>
                {mail.snippet}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. RIGHT PANE: Message Viewer OR Compose Window */}
      <div className="flex-1 bg-[#1e1e1e] flex flex-col hidden md:flex">
        
        {/* Right Pane Toolbar */}
        <div className="h-12 border-b border-zinc-800/50 flex items-center justify-end px-4 shrink-0 gap-4 text-zinc-400 bg-[#252525]">
          {activeTab === 'compose' ? (
            <span className="text-xs font-mono text-emerald-500 animate-pulse">Establishing Secure SMTP Relay...</span>
          ) : (
            <>
              <button className="hover:text-zinc-200"><Archive size={16} /></button>
              <button className="hover:text-red-400"><Trash2 size={16} /></button>
            </>
          )}
        </div>

        {/* --- VIEW MODE: Read Email --- */}
        {activeTab === 'inbox' && (
          <div className="flex-1 overflow-y-auto p-8 mac-scrollbar">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-6">{selectedMail.subject}</h2>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#2d2d2d] flex items-center justify-center text-zinc-400 font-bold">
                {selectedMail.sender.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-zinc-200">{selectedMail.sender}</div>
                <div className="text-xs text-zinc-500">
                  To: Pritam Poddar &lt;contact@pritam.dev&gt;
                </div>
              </div>
              <div className="ml-auto text-xs text-zinc-500">{selectedMail.time}</div>
            </div>

            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {selectedMail.body}
            </div>
          </div>
        )}

        {/* --- COMPOSE MODE: The Actual Form --- */}
        {activeTab === 'compose' && (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            
            <div className="px-6 py-3 border-b border-zinc-800/50 flex items-center text-zinc-300">
              <span className="text-zinc-500 w-20">To:</span>
              <span className="bg-[#2d2d2d] px-2 py-1 rounded text-sm flex items-center gap-2">
                Pritam Poddar &lt;contact@pritam.dev&gt;
              </span>
            </div>

            <div className="px-6 py-3 border-b border-zinc-800/50 flex items-center">
              <span className="text-zinc-500 w-20">From:</span>
              <input 
                type="email" 
                name="email"
                required
                disabled={formState !== 'idle'}
                placeholder="your.email@example.com" 
                className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder:text-zinc-700"
              />
            </div>

            <div className="px-6 py-3 border-b border-zinc-800/50 flex items-center">
              <span className="text-zinc-500 w-20">Identity:</span>
              <input 
                type="text" 
                name="name"
                required
                disabled={formState !== 'idle'}
                placeholder="Your Name / Company" 
                className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder:text-zinc-700"
              />
            </div>

            <div className="flex-1 p-6">
              <textarea 
                name="message"
                required
                disabled={formState !== 'idle'}
                placeholder="Compose your message..." 
                className="w-full h-full bg-transparent border-none outline-none text-zinc-200 placeholder:text-zinc-700 resize-none mac-scrollbar"
              ></textarea>
            </div>

            {/* Compose Footer / Send Button */}
            <div className="p-4 border-t border-zinc-800/50 bg-[#252525] flex justify-end">
              <button 
                type="submit" 
                disabled={formState !== 'idle'}
                className={`px-6 py-2 rounded-md flex items-center justify-center gap-2 font-medium text-sm transition-all
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