import React from "react";
import { GalleryPhotoItem } from "@/components/3d/AntigravityGallery";
import { Camera, Focus, BarChart2, Zap, Sliders, ChevronUp } from "lucide-react";

interface EXIFViewfinderBarProps {
  photo: GalleryPhotoItem | null;
  onOpenInspect?: () => void;
  onOpenLightTable?: () => void;
  lightTableCount?: number;
  className?: string;
}

export function EXIFViewfinderBar({
  photo,
  onOpenInspect,
  onOpenLightTable,
  lightTableCount = 0,
  className = "",
}: EXIFViewfinderBarProps) {
  const defaultExif = {
    camera: "Sony A7 IV",
    lens: "FE 50mm f/1.2 GM",
    aperture: "f/1.4",
    iso: "ISO 100",
    shutter: "1/1600s",
  };

  const exif = photo?.exif || defaultExif;

  return (
    <div
      className={`atelier-glass pointer-events-auto rounded-2xl shadow-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-[#181817] font-mono text-xs ${className}`}
    >
      {/* Left: Rangefinder Vermilion Focus Confirmation & Selected Item Title */}
      <div className="flex items-center gap-3">
        {/* Classic Rangefinder Vermilion Red Dot Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D9381E]/10 border border-[#D9381E]/30 text-[#D9381E]">
          <span className="w-2 h-2 rounded-full bg-[#D9381E] animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            AF-C &middot; FOCUS LOCKED
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-serif text-sm font-medium text-[#181817] truncate max-w-[200px] sm:max-w-xs">
            {photo ? photo.title : "Hover or Select Any Floating Frame"}
          </span>
          <span className="text-[10px] text-[#6E6A63] font-sans">
            {photo ? `${photo.location} &middot; ${photo.category}` : "Live Atelier Telemetry"}
          </span>
        </div>
      </div>

      {/* Center: Camera Optical Telemetry Strip (Viewfinder Style) */}
      <div className="flex items-center gap-3 sm:gap-6 bg-[#FAF8F5]/80 px-3.5 py-1.5 rounded-xl border border-[#181817]/10">
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider text-[#6E6A63] font-sans">Aperture</span>
          <span className="font-bold text-[#181817]">{exif.aperture}</span>
        </div>
        <div className="w-[1px] h-5 bg-[#181817]/10" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider text-[#6E6A63] font-sans">Shutter</span>
          <span className="font-bold text-[#181817]">{exif.shutter}</span>
        </div>
        <div className="w-[1px] h-5 bg-[#181817]/10" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider text-[#6E6A63] font-sans">ISO</span>
          <span className="font-bold text-[#181817]">{exif.iso.replace("ISO ", "")}</span>
        </div>
        <div className="w-[1px] h-5 bg-[#181817]/10" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider text-[#6E6A63] font-sans">Focal Length</span>
          <span className="font-bold text-[#181817]">{exif.lens.split(" ")[1] || "50mm"}</span>
        </div>
      </div>

      {/* Right: Live Dynamic Mini RGB Waveform & Light-Table Trigger */}
      <div className="flex items-center gap-3">
        {/* Mini Luminance Meter */}
        <div className="hidden md:flex items-center gap-1 bg-[#FAF8F5]/90 px-2.5 py-1.5 rounded-lg border border-[#181817]/10">
          <BarChart2 className="w-3.5 h-3.5 text-[#C5A880]" />
          <div className="flex items-end gap-0.5 h-4 w-12">
            {[30, 60, 90, 75, 45, 85, 95, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-[#181817]/70 rounded-t-[1px]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <span className="text-[9px] text-[#6E6A63]">+0.3 EV</span>
        </div>

        {/* Client Light Table Drawer Button */}
        {onOpenLightTable && (
          <button
            onClick={onOpenLightTable}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181817] text-[#FAF8F5] hover:bg-[#282826] transition-all shadow-md text-xs font-sans tracking-wide"
          >
            <span>Light Table</span>
            {lightTableCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#D9381E] text-white text-[10px] font-mono flex items-center justify-center font-bold">
                {lightTableCount}
              </span>
            )}
            <ChevronUp className="w-3.5 h-3.5 text-[#C5A880]" />
          </button>
        )}
      </div>
    </div>
  );
}

export default EXIFViewfinderBar;

