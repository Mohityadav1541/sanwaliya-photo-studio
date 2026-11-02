import React, { useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics, CuboidCollider } from "@react-three/rapier";
import { Button } from "@/components/ui/button";
import { FloatingPhotoFrame } from "@/components/3d/FloatingPhotoFrame";
import { Sparkles, ArrowUpRight, Eye, RefreshCw, ChevronDown, Layers } from "lucide-react";

// Portfolio Image Assets
import heroWedding from "@/assets/hero-wedding.jpg";
import portfolioWedding from "@/assets/portfolio-wedding.jpg";
import portfolioPrewedding from "@/assets/portfolio-prewedding.jpg";
import portfolioCandid from "@/assets/portfolio-candid.jpg";
import prewedding2 from "@/assets/prewedding-2.jpg";
import candid1 from "@/assets/candid-1.jpg";

interface FrameConfig {
  id: string;
  url: string;
  title: string;
  category: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
}

const HERO_PORTFOLIO_FRAMES: FrameConfig[] = [
  {
    id: "hero-f1",
    url: heroWedding,
    title: "Eternal Vows",
    category: "Royal Wedding",
    position: [-2.6, 1.1, 0.2],
    rotation: [0.08, 0.25, -0.04],
    width: 1.7,
    height: 2.3,
  },
  {
    id: "hero-f2",
    url: portfolioWedding,
    title: "Golden Hour Glow",
    category: "Bridal Portrait",
    position: [2.5, 1.3, -0.3],
    rotation: [-0.05, -0.22, 0.06],
    width: 1.6,
    height: 2.2,
  },
  {
    id: "hero-f3",
    url: portfolioPrewedding,
    title: "Palace Romance",
    category: "Pre-Wedding",
    position: [-2.2, -1.4, -0.4],
    rotation: [-0.1, 0.18, 0.08],
    width: 1.9,
    height: 1.4,
  },
  {
    id: "hero-f4",
    url: candid1,
    title: "Unscripted Joy",
    category: "Candid Moments",
    position: [2.4, -1.3, 0.3],
    rotation: [0.12, -0.15, -0.06],
    width: 1.6,
    height: 2.1,
  },
  {
    id: "hero-f5",
    url: prewedding2,
    title: "Heritage Garden",
    category: "Cinematic Film",
    position: [0.1, -1.8, 0.5],
    rotation: [0.05, 0.05, -0.04],
    width: 1.8,
    height: 1.3,
  },
  {
    id: "hero-f6",
    url: portfolioCandid,
    title: "Soulful Silhouette",
    category: "Editorial B&W",
    position: [0.2, 2.0, -0.5],
    rotation: [-0.12, -0.05, 0.05],
    width: 1.6,
    height: 2.1,
  },
];

// Invisible Bounding Walls keeping frames within visible viewport
function ViewportColliders() {
  const { viewport } = useThree();
  const depth = 5.5;
  const wallThickness = 1.0;

  return (
    <>
      {/* Top Edge Wall */}
      <CuboidCollider
        position={[0, viewport.height / 2 + wallThickness / 2, 0]}
        args={[viewport.width / 2 + 1, wallThickness / 2, depth / 2]}
      />

      {/* Bottom Edge Wall */}
      <CuboidCollider
        position={[0, -viewport.height / 2 - wallThickness / 2, 0]}
        args={[viewport.width / 2 + 1, wallThickness / 2, depth / 2]}
      />

      {/* Left Edge Wall */}
      <CuboidCollider
        position={[-viewport.width / 2 - wallThickness / 2, 0, 0]}
        args={[wallThickness / 2, viewport.height / 2 + 1, depth / 2]}
      />

      {/* Right Edge Wall */}
      <CuboidCollider
        position={[viewport.width / 2 + wallThickness / 2, 0, 0]}
        args={[wallThickness / 2, viewport.height / 2 + 1, depth / 2]}
      />

      {/* Back Boundary */}
      <CuboidCollider
        position={[0, 0, -depth / 2 - wallThickness / 2]}
        args={[viewport.width / 2 + 1, viewport.height / 2 + 1, wallThickness / 2]}
      />

      {/* Front Boundary */}
      <CuboidCollider
        position={[0, 0, depth / 2 + wallThickness / 2]}
        args={[viewport.width / 2 + 1, viewport.height / 2 + 1, wallThickness / 2]}
      />
    </>
  );
}

// 3D Antigravity Scene Content with Mobile Adaptive Frame Count & Touch Drag
function AntigravityHeroScene({ onFrameSelect }: { onFrameSelect: (f: FrameConfig) => void }) {
  const { camera } = useThree();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const activeFrames = isMobile ? HERO_PORTFOLIO_FRAMES.slice(0, 4) : HERO_PORTFOLIO_FRAMES;

  useEffect(() => {
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = (e.touches[0].clientX - prevX) * 0.007;
      const dy = (e.touches[0].clientY - prevY) * 0.007;

      camera.position.x = Math.max(-2, Math.min(2, camera.position.x - dx));
      camera.position.y = Math.max(-1.5, Math.min(1.5, camera.position.y + dy));

      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [camera]);

  return (
    <>
      {/* Daylight Atelier: Warm Gallery Skylight & Environmental Reflections */}
      <Environment preset="apartment" />

      {/* Sunlit Gallery Directional Light & Soft Ambient Key */}
      <ambientLight intensity={0.75} color="#FAF8F5" />
      <directionalLight
        position={[7, 11, 6]}
        intensity={2.1}
        color="#FFFBF5"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, -3, -4]} intensity={0.4} color="#C5A880" />

      {/* Soft Real-Time Contact Shadows */}
      <ContactShadows
        position={[0, -2.7, 0]}
        opacity={0.35}
        scale={18}
        blur={2.4}
        far={5}
        color="#6E6A63"
      />

      {/* Full-screen Physics with Antigravity: gravity={[0, 0, 0]} */}
      <Physics gravity={[0, 0, 0]}>
        {/* Invisible <CuboidCollider> walls around the viewport edges */}
        <ViewportColliders />

        {/* Floating Photo Frames (Optimized count on mobile for 60fps) */}
        {activeFrames.map((frame) => (
          <FloatingPhotoFrame
            key={frame.id}
            url={frame.url}
            title={frame.title}
            category={frame.category}
            position={frame.position}
            rotation={frame.rotation}
            width={frame.width}
            height={frame.height}
            finish="champagne"
            onSelect={() => onFrameSelect(frame)}
          />
        ))}
      </Physics>
    </>
  );
}

function CanvasFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF8F5] text-[#181817]">
      <div className="w-10 h-10 rounded-full border-2 border-[#D9381E] border-t-transparent animate-spin mb-3" />
      <span className="font-serif text-lg tracking-wider text-[#181817]">Initializing Daylight Atelier Studio</span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6A63] font-mono mt-1">
        Loading Museum Skylight &amp; Rapier Physics...
      </span>
    </div>
  );
}

export function HeroSection() {
  const [hideTextOverlay, setHideTextOverlay] = useState(false);
  const [activeFrame, setActiveFrame] = useState<FrameConfig | null>(null);
  const [canvasKey, setCanvasKey] = useState(0);

  const scrollToNextSection = () => {
    const el = document.getElementById("services-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#FAF8F5] text-[#181817] select-none">
      {/* Full-Screen 3D Antigravity Canvas */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<CanvasFallback />}>
          <Canvas
            key={canvasKey}
            camera={{ position: [0, 0, 7.2], fov: 46 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          >
            <color attach="background" args={["#FAF8F5"]} />
            <AntigravityHeroScene onFrameSelect={(f) => setActiveFrame(f)} />
          </Canvas>
        </Suspense>
      </div>

      {/* Decorative Archival Border Frame */}
      <div className="absolute inset-4 md:inset-8 border border-[#181817]/8 pointer-events-none z-10" />

      {/* Top Floating Editorial Metadata Bar */}
      <div className="absolute top-24 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full atelier-glass text-[#181817]">
          <span className="w-2 h-2 rounded-full bg-[#D9381E] animate-pulse" />
          <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[#181817]">
            Daylight Atelier &middot; Skylight Mode
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setHideTextOverlay(!hideTextOverlay)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full atelier-glass hover:bg-white text-[11px] font-mono uppercase tracking-wider text-[#181817] transition-all shadow-sm"
            title="Toggle text overlay visibility"
          >
            <Eye className="w-3.5 h-3.5 text-[#D9381E]" />
            <span className="hidden sm:inline">
              {hideTextOverlay ? "Show Viewfinder" : "Sunlit Space"}
            </span>
          </button>

          <button
            onClick={() => setCanvasKey((k) => k + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full atelier-glass hover:bg-white text-[11px] font-mono uppercase tracking-wider text-[#181817] transition-all shadow-sm"
            title="Reset frame positions"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Center Editorial Hero Content (Passes clicks to 3D Canvas) */}
      <div
        className={`relative z-10 container mx-auto h-full flex flex-col justify-center items-center px-6 text-center pointer-events-none transition-opacity duration-500 ${
          hideTextOverlay ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full atelier-glass text-[#181817]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]" />
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.22em] text-[#181817]">
              Daylight Atelier &middot; Roshan Lal Yadav
            </span>
          </div>

          {/* High-Contrast Cormorant Garamond Heading in Leica Obsidian (#181817) */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#181817] font-normal tracking-tight leading-[1.02]">
            Sunlit{" "}
            <span className="italic font-normal text-gradient-gold block md:inline">
              Emotions
            </span>
          </h1>

          {/* Clean Sans-Serif Body Text */}
          <p className="font-sans text-base sm:text-lg md:text-xl text-[#6E6A63] max-w-xl mx-auto leading-relaxed font-light">
            Every moment floats freely in sun-drenched museum space. Click and nudge the archival cotton-rag framed prints to explore our daylight collection.
          </p>

          {/* Interactive CTAs (Pointer Events Enabled) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 pointer-events-auto">
            <Link to="/portfolio">
              <Button className="bg-[#181817] text-[#FAF8F5] hover:bg-[#282826] text-xs uppercase tracking-widest font-semibold h-14 px-8 shadow-xl">
                Enter Atelier Gallery
                <ArrowUpRight className="w-4 h-4 ml-1.5 text-[#C5A880]" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="h-14 px-8 text-xs uppercase tracking-widest border-[#181817]/20 hover:bg-white text-[#181817]">
                Commission a Story
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Frame Popover (if user clicked a 3D frame) */}
      {activeFrame && (
        <div className="absolute bottom-20 left-8 z-30 max-w-xs p-5 rounded-2xl atelier-glass shadow-2xl animate-fade-in pointer-events-auto text-[#181817]">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-mono text-[#D9381E] uppercase tracking-wider font-semibold">
              {activeFrame.category} &middot; Archival Edition
            </span>
            <button
              onClick={() => setActiveFrame(null)}
              className="text-[#181817]/50 hover:text-[#181817] text-xs px-1"
            >
              ✕
            </button>
          </div>
          <h4 className="font-serif text-lg text-[#181817]">{activeFrame.title}</h4>
          <p className="text-xs font-sans text-[#6E6A63] mt-1 font-light">
            Brushed champagne moulding with museum white matte &amp; real-time sun refraction.
          </p>
        </div>
      )}

      {/* Bottom Scroll Cue */}
      <button
        onClick={scrollToNextSection}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-[#6E6A63] hover:text-[#181817] transition-colors duration-300 pointer-events-auto"
        aria-label="Scroll down to services"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase font-mono">Explore Exhibition</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#D9381E]" />
      </button>
    </section>
  );
}

export default HeroSection;
