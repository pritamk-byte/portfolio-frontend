'use client';
import { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Home, Lock } from 'lucide-react';

export default function BrowserApp() {
  // Defaulting to an iframe-friendly site
  const [urlInput, setUrlInput] = useState('https://en.wikipedia.org/wiki/Software_engineering');
  const [currentUrl, setCurrentUrl] = useState('https://en.wikipedia.org/wiki/Software_engineering');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = urlInput;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setCurrentUrl(finalUrl);
    setUrlInput(finalUrl);
    setIsLoading(true);
  };

  const handleHome = () => {
    const homeUrl = 'https://en.wikipedia.org/wiki/Main_Page';
    setCurrentUrl(homeUrl);
    setUrlInput(homeUrl);
    setIsLoading(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#ececec] dark:bg-[#1e1e1e] font-sans">
      
      {/* Browser Toolbar (Safari Style) */}
      <div className="h-12 sm:h-14 bg-gradient-to-b from-[#f5f5f5] to-[#e8e8e8] dark:from-[#3a3a3c] dark:to-[#2d2d2d] border-b border-zinc-300 dark:border-zinc-700 flex items-center px-2 sm:px-4 gap-2 sm:gap-4 shrink-0">
        
        {/* Nav Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 text-zinc-500 dark:text-zinc-400 shrink-0">
          <button className="p-1 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors disabled:opacity-30"><ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" /></button>
          <button className="p-1 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors disabled:opacity-30 opacity-30"><ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" /></button>
          <button onClick={() => { setIsLoading(true); const temp = currentUrl; setCurrentUrl(''); setTimeout(() => setCurrentUrl(temp), 50); }} className="p-1 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors hidden sm:block"><RotateCw size={16} /></button>
          <button onClick={handleHome} className="p-1 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors"><Home size={16} className="sm:w-[18px] sm:h-[18px]" /></button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleNavigate} className="flex-1 max-w-2xl mx-auto relative group min-w-0">
          <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            <Lock size={10} className="sm:w-[12px] sm:h-[12px]" />
          </div>
          <input 
            type="text" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-white dark:bg-[#1c1c1e] border border-zinc-300 dark:border-zinc-700 rounded-md py-1 sm:py-1.5 pl-7 sm:pl-8 pr-3 sm:pr-4 text-[11px] sm:text-[13px] text-center text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all truncate"
          />
        </form>

        <div className="w-[88px] hidden md:block shrink-0"></div> {/* Spacer to center URL bar on large screens */}
      </div>

      {/* Progress Bar (Fake loading) */}
      {isLoading && (
        <div className="h-[2px] bg-transparent shrink-0">
          <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_forwards]" onAnimationEnd={() => setIsLoading(false)}></div>
        </div>
      )}

      {/* Viewport */}
      <div className="flex-1 bg-white dark:bg-black relative">
        {currentUrl ? (
          <iframe 
            src={currentUrl} 
            className="w-full h-full border-none"
            title="Web Browser"
            onLoad={() => setIsLoading(false)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400">
            <Globe size={48} className="opacity-20" />
          </div>
        )}
      </div>

      {/* Loading animation styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}