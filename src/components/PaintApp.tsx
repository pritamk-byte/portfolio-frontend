'use client';
import { useRef, useState, useEffect } from 'react';
import { Trash2, Download, Square, Circle } from 'lucide-react';

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  const colors = [
    '#ffffff', '#ff453a', '#ff9f0a', '#ffd60a', 
    '#30d158', '#64d2ff', '#0a84ff', '#bf5af2', '#5e5ce6'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the actual display size of the element
    const rect = canvas.getBoundingClientRect();
    
    // Set internal canvas resolution to match its actual layout size
    canvas.width = rect.width;
    canvas.height = rect.height;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Premium anti-aliasing configurations
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Fill background with native dark canvas tone
    context.fillStyle = '#141414';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Track state adjustments dynamically
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#141414' : color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize, tool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    context.fillStyle = '#141414';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'studio-masterpiece.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="w-full h-full bg-os-window flex flex-col font-sans select-none">
      {/* Top Engineering Toolbar */}
      <div className="h-12 border-b border-white/5 bg-[#161616] px-4 flex items-center justify-between gap-4">
        
        {/* Tool Selectors */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setTool('brush')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${tool === 'brush' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-os-text'}`}
          >
            Brush
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${tool === 'eraser' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-os-text'}`}
          >
            Eraser
          </button>
        </div>

        {/* Dynamic Canvas Color Swatches */}
        <div className="flex items-center gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('brush'); }}
              className={`w-5 h-5 rounded-full border transition-transform duration-150 relative flex items-center justify-center
                ${color === c && tool === 'brush' ? 'scale-110 border-white' : 'border-black/40 hover:scale-105'}
              `}
              style={{ backgroundColor: c }}
            >
              {color === c && tool === 'brush' && (
                <div className="w-1.5 h-1.5 bg-black rounded-full mix-blend-difference" />
              )}
            </button>
          ))}
        </div>

        {/* Brush Size Adjustment Slider */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Size</span>
          <input 
            type="range" 
            min="2" 
            max="30" 
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <span className="text-xs font-mono text-zinc-400 w-4 text-right">{brushSize}</span>
        </div>

        {/* Utility Functions */}
        <div className="flex items-center gap-1">
          <button 
            onClick={clearCanvas}
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-white/5 rounded-md transition-colors"
            title="Clear Canvas"
          >
            <Trash2 size={15} />
          </button>
          <button 
            onClick={downloadImage}
            className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-white/5 rounded-md transition-colors"
            title="Download Canvas Image"
          >
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* The Native HTML5 Interactive Drawing Area */}
      <div className="flex-1 bg-os-panel relative overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block cursor-crosshair"
        />
      </div>
    </div>
  );
}