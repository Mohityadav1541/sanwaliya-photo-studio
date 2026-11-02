import React, { useRef, useState } from "react";
import { APERTURE_STOPS } from "./BokehEffectComposer";
import { Aperture, Disc, Info } from "lucide-react";

interface ApertureFocusRingProps {
  currentValue: number;
  onChange: (value: number) => void;
  className?: string;
}

export function ApertureFocusRing({
  currentValue,
  onChange,
  className = "",
}: ApertureFocusRingProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentIndex = APERTURE_STOPS.findIndex((s) => s.value === currentValue);
  const activeStop = APERTURE_STOPS[currentIndex] || APERTURE_STOPS[2];

  // Handle wheel scrolling to adjust aperture stops
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      // Step towards f/16 (narrower)
      const nextIdx = Math.min(APERTURE_STOPS.length - 1, currentIndex + 1);
      onChange(APERTURE_STOPS[nextIdx].value);
    } else {
      // Step towards f/1.4 (wider)
      const prevIdx = Math.max(0, currentIndex - 1);
      onChange(APERTURE_STOPS[prevIdx].value);
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`select-none pointer-events-auto flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#161616]/85 border border-[#2e2e2e] backdrop-blur-xl shadow-2xl text-[#F5F3EF] font-sans ${className}`}
    >
      {/* Aperture Iris Icon & Current Readout */}
      <div className="flex items-center gap-2.5 pl-1.5 pr-2 border-r border-[#2a2a2a]">
        <div className="w-8 h-8 rounded-full bg-[#121212] border border-[#333333] flex items-center justify-center text-[#D4AF37] shadow-inner">
          <Aperture className="w-4 h-4 animate-spin-slow" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-sm font-semibold text-[#D4AF37] tracking-wider">
            {activeStop.f}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-[#F5F3EF]/50 font-sans hidden sm:inline">
            {activeStop.label}
          </span>
        </div>
      </div>

      {/* Tactile Rotary Lens Knurl Stops */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {APERTURE_STOPS.map((stop, idx) => {
          const isSelected = stop.value === currentValue;
          return (
            <button
              key={stop.f}
              onClick={() => onChange(stop.value)}
              className={`group relative flex flex-col items-center justify-center px-2 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                isSelected
                  ? "bg-[#D4AF37] text-[#121212] font-bold shadow-md scale-105"
                  : "bg-[#1f1f1f]/80 text-[#F5F3EF]/60 hover:text-[#F5F3EF] hover:bg-[#282828] border border-transparent hover:border-[#383838]"
              }`}
              title={`${stop.f} - ${stop.label} (Scroll or click)`}
            >
              <span>{stop.f.replace("f/", "")}</span>
              {/* Tick Mark */}
              <div
                className={`w-1 h-1 rounded-full mt-0.5 ${
                  isSelected ? "bg-[#121212]" : "bg-[#F5F3EF]/30 group-hover:bg-[#D4AF37]"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="hidden md:flex items-center text-[10px] text-[#F5F3EF]/40 font-mono pl-1">
        <span>Scroll to dial DOF</span>
      </div>
    </div>
  );
}

export default ApertureFocusRing;

