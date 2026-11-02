import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  X,
  MapPin,
  Calendar,
  Camera,
  ArrowRight,
  Sparkles,
  Layers,
  Sliders,
  Eye,
  Search,
  Bookmark,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryPhotoItem } from "@/components/3d/AntigravityGallery";
import { ParallaxPhotoPlane } from "@/components/3d/ParallaxDepthShader";
import { DarkroomReveal } from "@/components/3d/DarkroomReveal";
import { OpticalLoupeMagnifier } from "@/components/gallery/OpticalLoupeMagnifier";
import { WebGLResourceManager } from "@/core/3d/WebGLResourceManager";

interface PhotoLightboxModalProps {
  photo: GalleryPhotoItem | null;
  onClose: () => void;
  onOpenContact: (photoTitle?: string) => void;
  isPinned?: boolean;
  onTogglePin?: (photo: GalleryPhotoItem) => void;
}

type InspectionView = "loupe" | "parallax" | "darkroom" | "standard";

export function PhotoLightboxModal({
  photo,
  onClose,
  onOpenContact,
  isPinned = false,
  onTogglePin,
}: PhotoLightboxModalProps) {
  const [activeView, setActiveView] = useState<InspectionView>("loupe");
  const [isDarkroomSafeLight, setIsDarkroomSafeLight] = useState(false);
  const [loadedTexture, setLoadedTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Load Three.js texture for 2.5D Parallax Shader with explicit lifecycle disposal
  useEffect(() => {
    let activeTexture: THREE.Texture | null = null;
    if (photo?.url) {
      const loader = new THREE.TextureLoader();
      loader.load(photo.url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        activeTexture = tex;
        WebGLResourceManager.registerTexture(tex);
        setLoadedTexture(tex);
      });
    }
    return () => {
      if (activeTexture) {
        WebGLResourceManager.disposeTexture(activeTexture);
        setLoadedTexture(null);
      }
    };
  }, [photo?.url]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/50 backdrop-blur-xl animate-fade-in font-sans">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Daylight Atelier Frosted Archival Glass Modal Box */}
      <div className="relative z-10 max-w-6xl w-full max-h-[94vh] overflow-y-auto rounded-3xl atelier-glass border border-[#181817]/15 shadow-2xl text-[#181817] flex flex-col lg:flex-row overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#181817]/10 flex items-center justify-center text-[#181817] transition-colors shadow-md"
          aria-label="Close high-res view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Interactive 3D Optical Loupe / Parallax / Darkroom Split Wipe Viewport */}
        <div className="w-full lg:w-3/5 bg-[#FAF8F5]/60 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#181817]/10">
          {/* Mode Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => setActiveView("loupe")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase transition-all ${
                activeView === "loupe"
                  ? "bg-[#D9381E] text-white font-semibold shadow-md"
                  : "bg-white/80 text-[#6E6A63] hover:text-[#181817] border border-[#181817]/10"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>3D Optical Loupe</span>
            </button>

            <button
              onClick={() => setActiveView("parallax")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase transition-all ${
                activeView === "parallax"
                  ? "bg-[#C5A880] text-[#181817] font-semibold shadow-md"
                  : "bg-white/80 text-[#6E6A63] hover:text-[#181817] border border-[#181817]/10"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2.5D Parallax</span>
            </button>

            <button
              onClick={() => setActiveView("darkroom")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase transition-all ${
                activeView === "darkroom"
                  ? "bg-[#181817] text-white font-semibold shadow-md"
                  : "bg-white/80 text-[#6E6A63] hover:text-[#181817] border border-[#181817]/10"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Darkroom Wipe</span>
            </button>

            <button
              onClick={() => setActiveView("standard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase transition-all ${
                activeView === "standard"
                  ? "bg-[#181817] text-white font-semibold shadow-md"
                  : "bg-white/80 text-[#6E6A63] hover:text-[#181817] border border-[#181817]/10"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Archival Print</span>
            </button>
          </div>

          {/* Active View Container */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#181817]/10 bg-[#EFECE6]/50 flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
            {activeView === "loupe" && (
              <div className="p-4 w-full flex flex-col items-center justify-center">
                <OpticalLoupeMagnifier
                  imageUrl={photo.url}
                  altText={photo.title}
                  zoomLevel={2.5}
                  loupeSize={170}
                  className="max-h-[62vh] max-w-full shadow-lg"
                />
              </div>
            )}

            {activeView === "parallax" && (
              <div className="relative w-full h-[460px]">
                {loadedTexture ? (
                  <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }}>
                    <color attach="background" args={["#FAF8F5"]} />
                    <ambientLight intensity={1.2} />
                    <Suspense fallback={null}>
                      <ParallaxPhotoPlane
                        texture={loadedTexture}
                        width={2.2 * (photo.width / photo.height)}
                        height={2.2}
                        intensity={0.05}
                      />
                    </Suspense>
                  </Canvas>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-[#6E6A63] font-mono">
                    Generating 2.5D Depth Displacement Shader...
                  </div>
                )}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#181817]/10 text-[10px] font-mono text-[#D9381E] uppercase tracking-wider pointer-events-none">
                  Tilt cursor to displace foreground depth
                </div>
              </div>
            )}

            {activeView === "darkroom" && (
              <DarkroomReveal
                finalImageUrl={photo.url}
                rawImageUrl={photo.rawUrl}
                photoTitle={photo.title}
                category={photo.category}
                isDarkroomActive={isDarkroomSafeLight}
                onToggleDarkroom={() => setIsDarkroomSafeLight(!isDarkroomSafeLight)}
              />
            )}

            {activeView === "standard" && (
              <div className="p-6 flex items-center justify-center">
                {/* Thick Passe-Partout Mat Border around high-res photo */}
                <div className="bg-white p-6 shadow-2xl rounded-sm border border-[#181817]/10 max-h-[65vh]">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="max-h-[55vh] w-auto object-contain shadow-inner"
                  />
                  <div className="text-center pt-3 font-mono text-[10px] text-[#6E6A63] uppercase tracking-widest">
                    Archival Cotton Rag &middot; 310gsm Matte
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Editorial Story & Technical EXIF Pane */}
        <div className="w-full lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white/60">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181817]/5 border border-[#181817]/10 text-[#D9381E] text-[10px] font-mono uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" />
                <span>{photo.category} &middot; {photo.dominantMood} Tone</span>
              </div>

              {onTogglePin && (
                <button
                  type="button"
                  onClick={() => onTogglePin(photo)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    isPinned
                      ? "bg-[#D9381E] text-white"
                      : "bg-white border border-[#181817]/15 text-[#181817] hover:bg-[#FAF8F5]"
                  }`}
                >
                  {isPinned ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>On Light Table</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3 h-3" />
                      <span>Pin to Table</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#181817] leading-tight">
              {photo.title}
            </h3>

            {/* Location & Year Badges */}
            <div className="flex items-center gap-4 text-xs font-sans text-[#6E6A63] border-t border-b border-[#181817]/10 py-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D9381E]" />
                <span>{photo.location}</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{photo.year}</span>
              </div>
            </div>

            {/* Story Paragraph */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D9381E] block">
                The Narrative
              </span>
              <p className="font-sans text-sm text-[#181817]/80 leading-relaxed font-light">
                {photo.story}
              </p>
            </div>

            {/* Technical EXIF Diagnostics Viewfinder */}
            <div className="p-4 rounded-xl bg-white/80 border border-[#181817]/10 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#D9381E] uppercase">
                <Camera className="w-3.5 h-3.5" />
                <span>Viewfinder Calibration &amp; EXIF</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#181817]">
                <div>
                  <span className="text-[10px] text-[#6E6A63] block uppercase font-sans">Body</span>
                  <span>{photo.exif.camera}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E6A63] block uppercase font-sans">Lens</span>
                  <span>{photo.exif.lens}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E6A63] block uppercase font-sans">Aperture</span>
                  <span>{photo.exif.aperture}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E6A63] block uppercase font-sans">Exposure</span>
                  <span>{photo.exif.shutter} &middot; {photo.exif.iso}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-3">
            <Button
              onClick={() => {
                onClose();
                onOpenContact(photo.title);
              }}
              className="w-full bg-[#181817] text-[#FAF8F5] hover:bg-[#2b2b29] tracking-widest uppercase text-xs font-semibold h-12 shadow-md gap-2"
            >
              <span>Inquire For Your Wedding</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </Button>

            <button
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-[#6E6A63] hover:text-[#181817] tracking-wider uppercase font-sans transition-colors"
            >
              Return to 3D Antigravity Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoLightboxModal;
