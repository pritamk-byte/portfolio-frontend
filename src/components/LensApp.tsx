'use client';
import { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, XCircle } from 'lucide-react';

export default function LensApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("Camera access denied or unavailable.");
  const [snapshots, setSnapshots] = useState<string[]>([]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      // Check if the API is even supported (fails on HTTP non-localhost)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Camera API is blocked. HTTPS is required.");
        setHasPermission(false);
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err: any) {
        console.error("Camera access denied:", err);
        if (err.name === 'NotAllowedError') setErrorMessage("Permission denied. Please allow camera access in browser settings.");
        else if (err.name === 'NotFoundError') setErrorMessage("No camera device found on this system.");
        else if (err.name === 'NotReadableError') setErrorMessage("Camera is already in use by another application.");
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSnapshots(prev => [dataUrl, ...prev]);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-white overflow-hidden relative select-none">
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center bg-[#111]">
        {hasPermission === null ? (
          <div className="animate-pulse text-zinc-500 font-mono text-[11px] sm:text-sm">Requesting Camera Access...</div>
        ) : hasPermission === false ? (
          <div className="flex flex-col items-center text-zinc-500 text-center px-6">
            <XCircle size={40} className="mb-4 text-red-500/50 sm:w-12 sm:h-12" />
            <p className="text-xs sm:text-sm font-medium">{errorMessage}</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted // <-- CRITICAL for iOS Safari AutoPlay
            className="w-full h-full object-cover transform -scale-x-100" 
          />
        )}
      </div>

      {/* Controls Area */}
      <div className="h-20 sm:h-24 bg-zinc-900/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl border border-white/20 bg-zinc-800 overflow-hidden flex items-center justify-center relative group shrink-0">
          {snapshots.length > 0 ? (
            <>
              <img src={snapshots[0]} alt="Recent snap" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <span className="text-[10px] font-bold">{snapshots.length}</span>
              </div>
            </>
          ) : (
            <ImageIcon size={20} className="text-zinc-600 sm:w-6 sm:h-6" />
          )}
        </div>

        <button 
          onClick={takeSnapshot}
          disabled={!hasPermission}
          className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full border-[3px] sm:border-4 border-white/80 p-1 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          <div className="w-full h-full bg-white rounded-full"></div>
        </button>

        <div className="w-12 sm:w-16 flex justify-end shrink-0">
          <Camera size={20} className="text-zinc-500 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}