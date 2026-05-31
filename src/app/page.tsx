import Hero from '@/components/Hero';
import HUD from '@/components/HUD';
import CustomCursor from '@/components/CustomCursor';
import Spotlight from '@/components/Spotlight';
import Header from '@/components/Header';
export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] overflow-hidden selection:bg-emerald-500/30 relative text-zinc-100">
      
      {/* 1. The Custom macOS Cursor */}
      <CustomCursor />

      {/* 2. The Interactive macOS Top Menu Bar */}
      <Header />
      
      {/* 3. The Desktop Wallpaper, Lock Screen & Desktop Icons */}
      <Hero />
      
      {/* 4. The Window Manager & Dock */}
      <HUD />

      {/* 5. The Cmd+K Command Palette */}
      <Spotlight />
      
    </main>
  );
}