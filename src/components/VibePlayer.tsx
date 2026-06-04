'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music2, ListMusic } from 'lucide-react';

// 👇 1. UPDATE THESE 'src' PATHS TO MATCH YOUR MP3 FILES IN THE PUBLIC FOLDER
const PLAYLIST = [
  { 
    id: 1, 
    title: 'Deep Focus (Code Mode)', 
    artist: 'Pritam_OS', 
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop', 
    src: '/audio/track1.mp3' 
  },
  { 
    id: 2, 
    title: 'RCB Stadium Anthem', 
    artist: 'Chinnaswamy Vibes', 
    cover: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=500&auto=format&fit=crop', 
    src: '/audio/track2.mp3' 
  },
  { 
    id: 3, 
    title: 'Midnight Deployment', 
    artist: 'The Backends', 
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500&auto=format&fit=crop', 
    src: '/audio/track3.mp3' 
  }
];

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function VibePlayer() {
  // Real Audio Reference
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = PLAYLIST[currentTrackIdx];

  // Handle Play/Pause Button
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Auto-play when song changes (if already playing)
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
  }, [currentTrackIdx]);

  // Audio Event Listeners
  const handleTimeUpdate = () => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleNext = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  // Allow clicking on the progress bar to seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#121212] text-white font-sans select-none overflow-hidden">
      
      {/* THE HIDDEN HTML5 AUDIO ENGINE */}
      <audio 
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {/* Sidebar / Playlist (Hidden on small screens) */}
      <div className="hidden md:flex w-64 bg-[#0a0a0a] border-r border-white/5 flex-col shrink-0">
        <div className="p-6 pb-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Music2 size={24} className="text-rose-500" />
            VibeTunes
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mb-4 pl-2">Up Next</div>
          {PLAYLIST.map((track, idx) => (
            <div 
              key={track.id}
              onClick={() => { 
                setCurrentTrackIdx(idx); 
                setIsPlaying(true); 
              }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${currentTrackIdx === idx ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <img src={track.cover} alt="cover" className="w-10 h-10 rounded shadow-sm object-cover" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className={`text-sm truncate font-medium ${currentTrackIdx === idx ? 'text-rose-400' : 'text-zinc-200'}`}>{track.title}</span>
                <span className="text-[11px] text-zinc-500 truncate">{track.artist}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-b from-[#2a2a2a] to-[#121212] overflow-hidden">
        
        {/* Top Bar (Mobile) */}
        <div className="md:hidden flex items-center p-4 border-b border-white/5 bg-black/20 shrink-0">
          <Music2 size={20} className="text-rose-500 mr-2" />
          <span className="font-semibold">VibeTunes</span>
        </div>

        {/* Artwork & Info (Responsive Fluid Setup) */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 min-h-0">
          {/* 👇 Fluid image sizing instead of hardcoded pixels */}
          <div className="relative group w-full max-w-[220px] sm:max-w-[280px] md:max-w-[320px] aspect-square mb-6 sm:mb-8 shrink-0">
            <div className={`absolute inset-0 bg-rose-500/20 blur-3xl rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}></div>
            <img 
              src={currentTrack.cover} 
              alt="Album Cover" 
              className={`relative z-10 w-full h-full object-cover object-center bg-black rounded-2xl shadow-2xl border border-white/10 transition-transform duration-500 ${isPlaying ? 'scale-100' : 'scale-95'}`}
            />
          </div>
          
          <div className="text-center px-4 w-full shrink-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 truncate">{currentTrack.title}</h1>
            <p className="text-zinc-400 text-sm sm:text-base truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls (Bottom) */}
        <div className="p-6 sm:p-8 bg-black/40 backdrop-blur-xl border-t border-white/5 shrink-0">
          
          {/* Interactive Scrubbable Progress Bar */}
          <div className="mb-6">
            <div 
              ref={progressBarRef}
              onClick={handleSeek}
              className="h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer group relative"
            >
              <div 
                className="h-full bg-rose-500 transition-all duration-100 ease-linear group-hover:bg-rose-400"
                style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] font-medium text-zinc-500 mt-2">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-6 sm:gap-8">
            <button className="text-zinc-500 hover:text-white transition-colors hidden sm:block"><Shuffle size={20} /></button>
            <button onClick={handlePrev} className="text-zinc-300 hover:text-white transition-colors active:scale-95"><SkipBack size={28} fill="currentColor" /></button>
            <button 
              onClick={togglePlay}
              className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={handleNext} className="text-zinc-300 hover:text-white transition-colors active:scale-95"><SkipForward size={28} fill="currentColor" /></button>
            <button className="text-zinc-500 hover:text-white transition-colors hidden sm:block"><Repeat size={20} /></button>
          </div>
        </div>

      </div>
    </div>
  );
}