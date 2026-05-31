'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.cursor = 'none';
    let isNative = false;

    const onMouseMove = (e: MouseEvent) => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
      
      if (cursorRingRef.current) {
        gsap.to(cursorRingRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1, // Snappier follow speed like Apple
          ease: "power2.out"
        });
      }
    };

    // Inside CustomCursor.tsx

    const addHoverState = () => {
      if (isNative) return;
      if (cursorRingRef.current) {
        gsap.to(cursorRingRef.current, {
          width: 48, height: 48,
          backgroundColor: "rgba(255, 255, 255, 0.15)", // Slightly brighter frosted look
          borderColor: "transparent",
          // Removed backdrop filter here!
          duration: 0.2
        });
      }
      if (cursorDotRef.current) {
        gsap.to(cursorDotRef.current, { opacity: 0, duration: 0.2 });
      }
    };

    const removeHoverState = () => {
      if (isNative) return;
      if (cursorRingRef.current) {
        gsap.to(cursorRingRef.current, {
          width: 24, height: 24,
          backgroundColor: "transparent",
          borderColor: "rgba(161, 161, 170, 0.5)", 
          // Removed backdrop filter here!
          duration: 0.2
        });
      }
      if (cursorDotRef.current) {
        gsap.to(cursorDotRef.current, { opacity: 1, duration: 0.2 });
      }
    };
    
    // Hides the custom cursor completely when hovering over iframes/inputs
    const showNativeCursor = () => {
      isNative = true;
      document.body.style.cursor = 'auto';
      if (cursorRingRef.current) gsap.to(cursorRingRef.current, { opacity: 0, duration: 0.1 });
      if (cursorDotRef.current) gsap.to(cursorDotRef.current, { opacity: 0, duration: 0.1 });
    };

    const hideNativeCursor = () => {
      isNative = false;
      document.body.style.cursor = 'none';
      if (cursorRingRef.current) gsap.to(cursorRingRef.current, { opacity: 1, duration: 0.1 });
      if (cursorDotRef.current) gsap.to(cursorDotRef.current, { opacity: 1, duration: 0.1 });
    };

    // EVENT DELEGATION: Intelligently detects what is under the mouse
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // 1. Check if hovering over an iframe (your tabs/apps) or inputs
      if (
        target.tagName?.toLowerCase() === 'iframe' || 
        target.tagName?.toLowerCase() === 'input' || 
        target.tagName?.toLowerCase() === 'textarea' || 
        target.classList?.contains('cursor-se-resize')
      ) {
        showNativeCursor();
        return;
      }

      // 2. Check if hovering over interactive buttons/links
      if (target.closest('button, a, .interactive')) {
        hideNativeCursor();
        addHoverState();
        return;
      }

      // 3. Default state (Empty Desktop / HUD Background)
      hideNativeCursor();
      removeHoverState();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorDotRef} 
        className="fixed top-0 left-0 w-[4px] h-[4px] bg-white rounded-full pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
      <div 
        ref={cursorRingRef} 
        className="fixed top-0 left-0 w-[24px] h-[24px] border border-zinc-500 rounded-full pointer-events-none z-[999998] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
    </>
  );
} 