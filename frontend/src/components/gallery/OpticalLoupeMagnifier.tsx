import React, { useState, useRef } from "react";
import { Search, ZoomIn, Eye } from "lucide-react";

interface OpticalLoupeProps {
  imageUrl: string;
  altText: string;
  zoomLevel?: number;
  loupeSize?: number;
  className?: string;
}

export function OpticalLoupeMagnifier({
  imageUrl,
  altText,
  zoomLevel = 2.5,
  loupeSize = 160,
  className = "",
}: OpticalLoupeProps) {
  const [isActive, setIsActive] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [backgroundPos, setBackgroundPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setIsHovering(false);
      return;
    }

    setIsHovering(true);
    setCoords({ x: e.clientX, y: e.clientY });

    // Calculate background magnification position
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    setBackgroundPos({ x: bgX, y: bgY });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative overflow-hidden select-none cursor-none ${className}`}
    >
      {/* Base High-Res Photographic Print */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt={altText}
        className="w-full h-auto object-contain rounded-xl"
      />

      {/* Mode Status Pill */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none px-2.5 py-1 rounded-full bg-white/80 border border-[#181817]/10 backdrop-blur-md text-[10px] font-mono text-[#181817] flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E] animate-pulse" />
        <span>3D Archival Loupe {zoomLevel}x</span>
      </div>

      {/* Physical 3D Optical Glass Loupe (Follows Cursor) */}
      {isActive && isHovering && (
        <div
          className="fixed pointer-events-none z-50 rounded-full shadow-2xl transition-transform duration-75"
          style={{
            width: `${loupeSize}px`,
            height: `${loupeSize}px`,
            left: `${coords.x - loupeSize / 2}px`,
            top: `${coords.y - loupeSize / 2}px`,
            border: "3px solid #C5A880",
            boxShadow:
              "0 15px 35px -5px rgba(24, 24, 23, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.6), inset 0 0 25px rgba(24, 24, 23, 0.25)",
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: `${backgroundPos.x}% ${backgroundPos.y}%`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Outer Knurled Metal Loupe Barrel Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#181817]/80" />

          {/* Optical Glass Glare Reflection Highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Medium-Format Reticle Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-full h-[1px] bg-[#181817]" />
            <div className="h-full w-[1px] bg-[#181817] absolute" />
            <div className="w-10 h-10 rounded-full border border-[#181817] absolute" />
          </div>

          {/* Lens Spec Engraving on Loupe Barrel */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-white uppercase tracking-widest bg-[#181817]/90 px-2 py-0.5 rounded-full shadow">
            Schneider 2.5x &middot; Fine Art
          </div>
        </div>
      )}
    </div>
  );
}

export default OpticalLoupeMagnifier;

