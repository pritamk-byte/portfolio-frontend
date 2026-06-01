'use client';
import { useState, useEffect, useCallback } from 'react';
import { Trophy, RotateCcw, Play, Gamepad2 } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function Game() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback(() => {
    while (true) {
      // 1. Declare it as a const inside the loop so TS knows exactly what it is
      const newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      
      // 2. If it's a safe spot, return it directly!
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        return newFood;
      }
    }
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent scrolling when playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && gameOver) {
        resetGame();
        return;
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPaused, gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check Wall Collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120); // Game Speed

    return () => clearInterval(moveSnake);
  }, [direction, food, isPaused, gameOver, generateFood, highScore]);

  return (
    <div className="w-full h-full bg-[#111] flex flex-col items-center justify-center font-mono text-os-text select-none">
      
      {/* Game Header */}
      <div className="w-full max-w-[400px] flex justify-between items-center mb-6 px-4">
        <div>
          <h2 className="text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-2">
            <Gamepad2 size={18} /> Data Worm
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Intercept the data packets</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-light text-white">{score}</div>
          <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1 justify-end">
            <Trophy size={10} /> High: {highScore}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative bg-black border border-os-border rounded-lg shadow-2xl p-2">
        <div 
          className="grid gap-[1px] bg-zinc-900/50 border border-os-border/50"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full rounded-sm transition-all duration-75
                  ${isHead ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 
                    isSnake ? 'bg-emerald-500/80' : 
                    isFood ? 'bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 
                    'bg-transparent'
                  }
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              {gameOver ? (
                <>
                  <div className="text-red-500 font-bold text-xl mb-2 tracking-widest">SYSTEM FAILURE</div>
                  <div className="text-zinc-400 text-sm mb-6">Final Score: {score}</div>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 mx-auto bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <RotateCcw size={16} /> Reboot System
                  </button>
                </>
              ) : (
                <>
                  <div className="text-emerald-500 font-bold text-xl mb-6 tracking-widest">READY</div>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 mx-auto bg-[#0058d0] hover:bg-[#0069f6] text-white px-6 py-2 rounded-md transition-colors"
                  >
                    <Play size={16} /> Start
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-xs text-zinc-600 flex gap-4">
        <span>[ ARROWS ] to move</span>
        <span>[ SPACE ] to pause/play</span>
      </div>
    </div>
  );
}