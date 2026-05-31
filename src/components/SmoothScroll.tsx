'use client';
import { ReactLenis } from 'lenis/react'; // Note the change from @studio-freight/lenis to lenis/react

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}