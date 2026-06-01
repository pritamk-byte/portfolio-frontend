'use client';
import { useState, useEffect } from 'react';
import { Flag, Bomb, RotateCcw, ShieldAlert } from 'lucide-react';

const GRID_SIZE = 10;
const MINES_COUNT = 15;

type Cell = { x: number; y: number; isMine: boolean; isRevealed: boolean; isFlagged: boolean; neighborMines: number; };

export default function CyberSweeper() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(MINES_COUNT);

  // Initialize Board
  const initBoard = () => {
    let newBoard: Cell[][] = Array(GRID_SIZE).fill(null).map((_, y) => 
      Array(GRID_SIZE).fill(null).map((_, x) => ({ x, y, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 }))
    );

    // Plant Mines
    let minesPlanted = 0;
    while (minesPlanted < MINES_COUNT) {
      const rx = Math.floor(Math.random() * GRID_SIZE);
      const ry = Math.floor(Math.random() * GRID_SIZE);
      if (!newBoard[ry][rx].isMine) {
        newBoard[ry][rx].isMine = true;
        minesPlanted++;
      }
    }

    // Calculate Neighbors
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!newBoard[y][x].isMine) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (y + dy >= 0 && y + dy < GRID_SIZE && x + dx >= 0 && x + dx < GRID_SIZE) {
                if (newBoard[y + dy][x + dx].isMine) count++;
              }
            }
          }
          newBoard[y][x].neighborMines = count;
        }
      }
    }
    setBoard(newBoard);
    setGameOver(false);
    setWin(false);
    setFlagsLeft(MINES_COUNT);
  };

  useEffect(() => { initBoard(); }, []);

  const revealCell = (x: number, y: number) => {
    if (gameOver || win || board[y][x].isRevealed || board[y][x].isFlagged) return;

    const newBoard = [...board.map(row => [...row])];
    
    if (newBoard[y][x].isMine) {
      // Game Over: Reveal all mines
      newBoard.forEach(row => row.forEach(c => { if (c.isMine) c.isRevealed = true; }));
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    // Flood fill algorithm for empty cells
    const floodFill = (cx: number, cy: number) => {
      if (cx < 0 || cx >= GRID_SIZE || cy < 0 || cy >= GRID_SIZE || newBoard[cy][cx].isRevealed || newBoard[cy][cx].isFlagged) return;
      newBoard[cy][cx].isRevealed = true;
      if (newBoard[cy][cx].neighborMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) floodFill(cx + dx, cy + dy);
        }
      }
    };

    floodFill(x, y);
    setBoard(newBoard);

    // Check Win Condition
    let unrevealedSafe = 0;
    newBoard.forEach(row => row.forEach(c => { if (!c.isMine && !c.isRevealed) unrevealedSafe++; }));
    if (unrevealedSafe === 0) setWin(true);
  };

  const toggleFlag = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameOver || win || board[y][x].isRevealed) return;

    const newBoard = [...board.map(row => [...row])];
    if (!newBoard[y][x].isFlagged && flagsLeft > 0) {
      newBoard[y][x].isFlagged = true;
      setFlagsLeft(f => f - 1);
    } else if (newBoard[y][x].isFlagged) {
      newBoard[y][x].isFlagged = false;
      setFlagsLeft(f => f + 1);
    }
    setBoard(newBoard);
  };

  const getNumberColor = (num: number) => {
    const colors = ['text-transparent', 'text-blue-400', 'text-emerald-400', 'text-red-400', 'text-purple-400', 'text-yellow-400', 'text-cyan-400', 'text-white', 'text-zinc-400'];
    return colors[num];
  };

  return (
    <div className="w-full h-full bg-[#111] flex flex-col items-center justify-center font-mono text-os-text select-none">
      
      <div className="w-full max-w-[400px] flex justify-between items-center mb-6 px-4">
        <div>
          <h2 className="text-red-500 font-bold tracking-widest uppercase flex items-center gap-2">
            <ShieldAlert size={18} /> Cyber Sweeper
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Clear the corrupt sectors</p>
        </div>
        <div className="text-right flex items-center gap-4">
          <div className="text-xl font-light text-white flex items-center gap-2">
            <Flag size={14} className="text-red-500" /> {flagsLeft}
          </div>
          <button onClick={initBoard} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="relative bg-black border border-os-border rounded-lg p-2 shadow-2xl">
        <div className="grid gap-[1px] bg-zinc-800 border border-zinc-700" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
          {board.map((row, y) => row.map((cell, x) => (
            <div 
              key={`${x}-${y}`}
              onClick={() => revealCell(x, y)}
              onContextMenu={(e) => toggleFlag(e, x, y)}
              className={`w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors duration-150
                ${cell.isRevealed ? (cell.isMine ? 'bg-red-900/50' : 'bg-zinc-900') : 'bg-zinc-700 hover:bg-zinc-600 border-t border-l border-zinc-600'}
              `}
            >
              {cell.isRevealed && cell.isMine && <Bomb size={16} className="text-red-500" />}
              {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
                <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span>
              )}
              {!cell.isRevealed && cell.isFlagged && <Flag size={14} className="text-red-500" />}
            </div>
          )))}
        </div>

        {(gameOver || win) && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className={`font-bold text-xl mb-4 tracking-widest ${win ? 'text-emerald-500' : 'text-red-500'}`}>
                {win ? 'SYSTEM SECURED' : 'SYSTEM COMPROMISED'}
              </div>
              <button onClick={initBoard} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 mx-auto">
                <RotateCcw size={16} /> Reboot
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-zinc-600 flex gap-4">
        <span>[ CLICK ] Reveal</span>
        <span>[ RIGHT-CLICK ] Flag</span>
      </div>
    </div>
  );
}