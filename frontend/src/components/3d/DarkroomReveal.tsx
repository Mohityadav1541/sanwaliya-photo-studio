import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Sliders, Camera, BarChart2, Zap, ArrowLeftRight, Eye } from "lucide-react";

interface DarkroomRevealProps {
  finalImageUrl: string;
  rawImageUrl?: string;
  photoTitle: string;
  category: string;
  isDarkroomActive: boolean;
  onToggleDarkroom: () => void;
  className?: string;
}

export function DarkroomReveal({
  finalImageUrl,
  rawImageUrl,
  photoTitle,
  category,
  isDarkroomActive,
  onToggleDarkroom,
  className = "",
}: DarkroomRevealProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle drag wipe across the photo
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  // Keyboard shortcut: Spacebar toggles darkroom safe-light
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        onToggleDarkroom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleDarkroom]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border transition-colors duration-500 font-sans ${
        isDarkroomActive
          ? "bg-[#180507] border-[#8B0000] shadow-[0_0_50px_rgba(255,20,35,0.25)]"
          : "bg-[#161616] border-[#2c2c2c] shadow-2xl"
      } ${className}`}
    >
      {/* Top Darkroom Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 border-b border-inherit">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleDarkroom}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-mono font-medium transition-all ${
              isDarkroomActive
                ? "bg-[#FF202B] text-white shadow-[0_0_20px_rgba(255,32,43,0.5)] font-bold animate-pulse"
                : "bg-[#222222] text-[#F5F3EF] hover:bg-[#2b2b2b] border border-[#333333]"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isDarkroomActive ? "bg-white" : "bg-red-500"}`} />
            <span>{isDarkroomActive ? "Darkroom Safe-Light [ON]" : "Toggle Darkroom (Space)"}</span>
          </button>
          <span className="text-[11px] font-sans text-[#F5F3EF]/60 hidden sm:inline">
            Drag wipe to compare RAW vs Color-Graded
          </span>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#D4AF37]">{sliderPos}% Graded</span>
          <span className="text-[#F5F3EF]/40">&bull;</span>
          <span className="text-[#F5F3EF]/60">{100 - sliderPos}% RAW Capture</span>
        </div>
      </div>

      {/* Main Interactive Split Wipe Canvas */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onClick={(e) => handleMove(e.clientX)}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] overflow-hidden select-none cursor-ew-resize bg-[#101010]"
      >
        {/* Under layer: RAW Flat Negative Capture */}
        <div className="absolute inset-0">
          <img
            src={rawImageUrl || finalImageUrl}
            alt="RAW unedited capture"
            className="w-full h-full object-cover filter contrast-[0.8] brightness-[0.95] saturate-[0.65] sepia-[0.1]"
          />
          {/* Flat RAW Watermark */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#121212]/80 backdrop-blur-md border border-[#333333] text-[10px] font-mono text-[#F5F3EF]/70 uppercase tracking-widest">
            Unedited RAW Frame &middot; Flat Profile
          </div>
        </div>

        {/* Over layer: Final Color-Graded Masterpiece (Clipped by sliderPos) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          <img
            src={finalImageUrl}
            alt="Color graded edit"
            className={`w-full h-full object-cover filter ${
              isDarkroomActive
                ? "brightness-[0.9] sepia-[0.3] contrast-[1.2] hue-rotate-[-10deg]"
                : "contrast-[1.12] brightness-[1.02]"
            }`}
          />
          {/* Graded Watermark */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#D4AF37] text-[#121212] font-mono text-[10px] font-bold uppercase tracking-widest shadow-lg">
            Final Color-Graded Edit
          </div>
        </div>

        {/* Draggable Divider Line & Knob */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#F5F3EF] z-20 shadow-[0_0_15px_rgba(255,255,255,0.7)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#121212] border-2 border-[#D4AF37] shadow-2xl flex items-center justify-center text-[#D4AF37]">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Floating RGB Histogram & EXIF Metadata Drawer */}
      <div className="p-4 sm:p-5 border-t border-inherit grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-[#F5F3EF]/80">
        {/* Dynamic 3D/2D RGB Color Histogram */}
        <div className="space-y-2 p-3.5 rounded-xl bg-[#121212]/80 border border-inherit">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] uppercase">
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Spectral RGB Histogram</span>
            </span>
            <span>Dynamic Channel Curve</span>
          </div>

          {/* Graphical Histogram Waveform */}
          <div className="h-16 w-full flex items-end gap-1 px-1 pt-1 bg-[#0d0d0d] rounded-lg border border-[#222222]">
            {/* Generated RGB curve bars */}
            {[20, 35, 55, 80, 95, 75, 60, 45, 65, 85, 98, 70, 50, 30, 15].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end h-full gap-0.5">
                <div
                  className="w-full bg-red-500/70 rounded-t-sm"
                  style={{ height: `${(val * 0.45 * (sliderPos / 60)).toFixed(0)}%` }}
                />
                <div
                  className="w-full bg-emerald-500/70 rounded-t-sm"
                  style={{ height: `${(val * 0.35).toFixed(0)}%` }}
                />
                <div
                  className="w-full bg-amber-400/70 rounded-t-sm"
                  style={{ height: `${(val * 0.38).toFixed(0)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-mono text-[#F5F3EF]/40 px-1">
            <span>0 (Shadows)</span>
            <span>128 (Midtones)</span>
            <span>255 (Highlights)</span>
          </div>
        </div>

        {/* Camera EXIF Metadata */}
        <div className="space-y-2 p-3.5 rounded-xl bg-[#121212]/80 border border-inherit flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#D4AF37] uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Capture EXIF Diagnostics</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-[#F5F3EF]/40 block uppercase">Camera Body</span>
              <span className="font-mono text-[#F5F3EF]">Sony A7 IV &middot; 33MP</span>
            </div>
            <div>
              <span className="text-[10px] text-[#F5F3EF]/40 block uppercase">Lens Optic</span>
              <span className="font-mono text-[#F5F3EF]">FE 50mm f/1.2 GM</span>
            </div>
            <div>
              <span className="text-[10px] text-[#F5F3EF]/40 block uppercase">Exposure</span>
              <span className="font-mono text-[#F5F3EF]">1/1200s &middot; f/1.4</span>
            </div>
            <div>
              <span className="text-[10px] text-[#F5F3EF]/40 block uppercase">Sensitivity</span>
              <span className="font-mono text-[#F5F3EF]">ISO 100 &middot; 5400K</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#222222] text-[10px] text-[#D4AF37] font-mono">
            Color Matrix: Sanwaliya Royal Film Profile &middot; 16-Bit ProPhoto RGB
          </div>
        </div>
      </div>
    </div>
  );
}

export default DarkroomReveal;

