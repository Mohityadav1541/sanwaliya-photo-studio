import React, { Suspense, useState, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Physics, CuboidCollider, RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { FloatingPhotoFrame } from "./FloatingPhotoFrame";
import { Sparkles, Maximize2, Minimize2, RefreshCw, Compass } from "lucide-react";

// Portfolio Image Assets
import heroWedding from "@/assets/hero-wedding.jpg";
import portfolioWedding from "@/assets/portfolio-wedding.jpg";
import portfolioPrewedding from "@/assets/portfolio-prewedding.jpg";
import portfolioCandid from "@/assets/portfolio-candid.jpg";
import prewedding2 from "@/assets/prewedding-2.jpg";
import candid1 from "@/assets/candid-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import portfolioAlbum from "@/assets/portfolio-album.jpg";

interface FrameData {
  id: string;
  url: string;
  title: string;
  category: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
}

const PORTFOLIO_FRAMES: FrameData[] = [
  {
    id: "f-1",
    url: heroWedding,
    title: "The Royal Vow",
    category: "Palace Wedding",
    position: [-2.6, 1.2, 0.4],
    rotation: [0.1, 0.25, -0.05],
    width: 1.8,
    height: 2.4,
  },
  {
    id: "f-2",
    url: portfolioWedding,
    title: "Golden Hour Glow",
    category: "Bridal Elegance",
    position: [0.3, 1.8, -0.6],
    rotation: [-0.1, -0.15, 0.08],
    width: 1.7,
    height: 2.3,
  },
  {
    id: "f-3",
    url: portfolioPrewedding,
    title: "Desert Serenade",
    category: "Pre-Wedding",
    position: [2.8, 0.8, 0.2],
    rotation: [0.15, -0.3, 0.05],
    width: 2.1,
    height: 1.5,
  },
  {
    id: "f-4",
    url: candid1,
    title: "Unfiltered Laughter",
    category: "Candid Series",
    position: [-1.8, -1.4, -0.3],
    rotation: [-0.08, 0.18, 0.12],
    width: 1.6,
    height: 2.2,
  },
  {
    id: "f-5",
    url: prewedding2,
    title: "Heritage Romance",
    category: "Cinematic Shoot",
    position: [0.9, -1.2, 0.5],
    rotation: [0.12, 0.1, -0.08],
    width: 2.0,
    height: 1.4,
  },
  {
    id: "f-6",
    url: portfolioCandid,
    title: "Soulful Eyes",
    category: "Editorial Portrait",
    position: [2.5, -1.5, -0.4],
    rotation: [-0.15, -0.2, -0.05],
    width: 1.6,
    height: 2.1,
  },
];

// Invisible Bounding Walls keeping frames within visible viewport
function ViewportBounds() {
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

// Gentle Ambient Zero-G Micro Drift Controller
function AntigravityMicroDrift() {
  useFrame(({ clock }) => {
    // Soft subtle time-based harmonic variation
    const t = clock.getElapsedTime() * 0.2;
  });
  return null;
}

// Physical Scene Interior
function AntigravityScene({ onSelectFrame }: { onSelectFrame?: (frame: FrameData) => void }) {
  return (
    <>
      {/* Subtle Studio Environment Lighting */}
      <Environment preset="studio" />

      {/* Editorial Key & Rim Lights (#F5F3EF / #D4AF37) */}
      <ambientLight intensity={0.7} color="#F5F3EF" />
      <directionalLight
        position={[6, 8, 8]}
        intensity={1.5}
        color="#FAF8F5"
        castShadow
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, -4, -4]} intensity={0.5} color="#D4AF37" />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#F5F3EF" />

      {/* Antigravity Physics with zero downward gravity: [0, 0, 0] */}
      <Physics gravity={[0, 0, 0]}>
        {/* Invisible Boundary Colliders */}
        <ViewportBounds />

        {/* Micro Drift Controller */}
        <AntigravityMicroDrift />

        {/* Floating Photo Frames */}
        {PORTFOLIO_FRAMES.map((frame) => (
          <FloatingPhotoFrame
            key={frame.id}
            url={frame.url}
            title={frame.title}
            category={frame.category}
            position={frame.position}
            rotation={frame.rotation}
            width={frame.width}
            height={frame.height}
            onSelect={() => onSelectFrame && onSelectFrame(frame)}
          />
        ))}
      </Physics>
    </>
  );
}

// Fullscreen Loading Fallback
function AntigravityFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] text-[#F5F3EF] z-20">
      <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mb-4" />
      <p className="font-serif text-xl tracking-wide text-[#F5F3EF]">Preparing Zero-G Space</p>
      <p className="text-xs font-sans uppercase tracking-[0.25em] text-[#F5F3EF]/50 mt-1">
        Loading Portfolio Textures &amp; Rapier Physics Engine
      </p>
    </div>
  );
}

// Full-screen Antigravity Canvas Export
export function AntigravityCanvas({
  className = "",
  fullScreen = true,
}: {
  className?: string;
  fullScreen?: boolean;
}) {
  const [selectedFrame, setSelectedFrame] = useState<FrameData | null>(null);
  const [sceneKey, setSceneKey] = useState(0);

  const handleReset = () => {
    setSceneKey((k) => k + 1);
  };

  return (
    <div
      className={`relative w-full ${
        fullScreen ? "h-screen" : "h-[640px]"
      } overflow-hidden bg-[#121212] select-none ${className}`}
    >
      {/* Editorial Top Overlay Banner */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
        <div className="flex flex-col">
          <span className="font-serif text-sm tracking-widest text-[#F5F3EF] uppercase font-semibold">
            Sanwaliya Antigravity Studio
          </span>
          <span className="text-[10px] font-sans tracking-wider uppercase text-[#F5F3EF]/60">
            Full-Screen Rapier Physics &middot; Zero Gravity
          </span>
        </div>
      </div>

      {/* Interaction Hint Badge */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818]/80 border border-[#2e2e2e] backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="text-[11px] font-sans tracking-widest uppercase text-[#F5F3EF]/80">
          Nudge or click frames to float &amp; tumble
        </span>
      </div>

      {/* Selected Frame Detail Flyout (if clicked) */}
      {selectedFrame && (
        <div className="absolute bottom-20 left-6 z-30 max-w-sm p-4 rounded-xl bg-[#181818]/90 border border-[#333333] backdrop-blur-lg animate-fade-in shadow-2xl">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">
              {selectedFrame.category}
            </span>
            <button
              onClick={() => setSelectedFrame(null)}
              className="text-[#F5F3EF]/50 hover:text-[#F5F3EF] text-xs px-1"
            >
              ✕
            </button>
          </div>
          <h4 className="font-serif text-lg text-[#F5F3EF]">{selectedFrame.title}</h4>
          <p className="text-xs font-sans text-[#F5F3EF]/70 mt-1">
            Immersed in weightless zero-gravity space. Click and nudge to transfer kinetic energy.
          </p>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181818]/80 hover:bg-[#222222] border border-[#2e2e2e] text-[#F5F3EF] text-xs uppercase tracking-widest font-sans backdrop-blur-md transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Reset Floating Positions</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-sans text-[#F5F3EF]/50 hidden sm:flex">
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Rapier &middot; linearDamping: 0.8 &middot; angularDamping: 0.8</span>
        </div>
      </div>

      {/* Full-Screen 3D Canvas */}
      <Suspense fallback={<AntigravityFallback />}>
        <Canvas
          key={sceneKey}
          camera={{ position: [0, 0, 7.2], fov: 48 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#121212"]} />
          <AntigravityScene onSelectFrame={(f) => setSelectedFrame(f)} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default AntigravityCanvas;

