'use client';
import { useState, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
}

export default function ScrambleText({ text }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';

  const handleMouseEnter = () => {
    let iterations = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split('')
          .map((letter, index) => {
            if (index < iterations || text[index] === ' ') return text[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iterations >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iterations += 1 / 2;
    }, 30);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      className="inline-block cursor-pointer border-b border-dashed border-zinc-600 transition-colors duration-300 hover:text-zinc-500"
    >
      {displayText}
    </span>
  );
}