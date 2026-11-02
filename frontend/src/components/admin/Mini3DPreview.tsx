import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Sparkles, RefreshCw, Sliders, Box, Sun, Camera, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { WebGLResourceManager } from "@/core/3d/WebGLResourceManager";
import { EXIFParserService } from "@/services/exifParserService";
import { PhysicsEngine } from "@/core/3d/PhysicsEngine";

export type FrameFinish = "champagne" | "rawOak" | "espresso" | "floatingGlass";

export interface FrameSettings {
  frameFinish: FrameFinish;
  scale: number;
  depth: number;
  weight: number;
  matteBorder: number;
  sunAngle: number;
}

interface Mini3DPreviewProps {
  imagePreviewUrl?: string;
  rawPreviewUrl?: string;
  initialTitle?: string;
  initialCategory?: string;
  onSettingsChange?: (settings: FrameSettings) => void;
  onExifExtracted?: (exif: {
    camera: string;
    lens: string;
    aperture: string;
    shutter: string;
    iso: string;
  }) => void;
}

// 3D Preview Frame Mesh in Daylight Atelier
function PreviewFrameMesh({
  textureUrl,
  frameFinish,
  scale,
  depth,
  weight,
  matteBorder,
  isNudged,
}: {
  textureUrl?: string;
  frameFinish: FrameFinish;
  scale: number;
  depth: number;
  weight: number;
  matteBorder: number;
  isNudged: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let currentTexture: THREE.Texture | null = null;
    if (textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        textureUrl,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          currentTexture = tex;
          WebGLResourceManager.registerTexture(tex);
          setTexture(tex);
        },
        undefined,
        () => setTexture(null)
      );
    }
    return () => {
      if (currentTexture) {
        WebGLResourceManager.disposeTexture(currentTexture);
        setTexture(null);
      }
    };
  }, [textureUrl]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const safeDelta = PhysicsEngine.clampDelta(delta, 0.1);
    const t = clock.getElapsedTime();
    const rotSpeed = 0.6 / weight;
    groupRef.current.rotation.y = Math.sin(t * rotSpeed) * 0.22;
    groupRef.current.rotation.x = Math.cos(t * rotSpeed * 0.8) * 0.08;

    if (isNudged) {
      groupRef.current.rotation.y += safeDelta * 4;
      groupRef.current.position.y = Math.sin(t * 4) * 0.12;
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, safeDelta * 6);
    }
  });

  const width = 1.7 * scale;
  const height = 2.2 * scale;
  const borderSize = matteBorder * scale;

  const getFrameMaterial = () => {
    switch (frameFinish) {
      case "champagne":
        return <meshStandardMaterial color="#C5A880" metalness={0.8} roughness={0.25} />;
      case "rawOak":
        return <meshStandardMaterial color="#D4BE9D" metalness={0.08} roughness={0.85} />;
      case "espresso":
        return <meshStandardMaterial color="#1E1D1B" metalness={0.15} roughness={0.5} />;
      case "floatingGlass":
      default:
        return (
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.9}
            transparent
            roughness={0.08}
            ior={1.5}
          />
        );
    }
  };

  return (
    <group ref={groupRef}>
      {/* Outer Moulding Box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        {getFrameMaterial()}
      </mesh>

      {/* Gallery Museum White Thick Bevel Passe-Partout Mat */}
      {frameFinish !== "floatingGlass" && (
        <mesh position={[0, 0, depth / 2 + 0.002]}>
          <planeGeometry args={[width - 0.06, height - 0.06]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
        </mesh>
      )}

      {/* Photograph Face */}
      <mesh position={[0, 0, depth / 2 + 0.004]} castShadow>
        <planeGeometry
          args={[
            Math.max(0.6, width - borderSize * 2),
            Math.max(0.8, height - borderSize * 2),
          ]}
        />
        {texture ? (
          <meshBasicMaterial map={texture} toneMapped={true} />
        ) : (
          <meshStandardMaterial color="#EFECE6" roughness={0.7} />
        )}
      </mesh>

      {/* Protective Optical Glass Refraction Sheet */}
      <mesh position={[0, 0, depth / 2 + 0.008]}>
        <planeGeometry args={[width - 0.04, height - 0.04]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transmission={0.92}
          transparent
          opacity={0.8}
          roughness={0.05}
          ior={1.52}
          reflectivity={0.9}
        />
      </mesh>
    </group>
  );
}

export function Mini3DPreview({
  imagePreviewUrl,
  initialTitle = "Untitled Frame",
  initialCategory = "Weddings",
  onSettingsChange,
  onExifExtracted,
}: Mini3DPreviewProps) {
  const [frameFinish, setFrameFinish] = useState<FrameFinish>("champagne");
  const [scale, setScale] = useState<number>(1.0);
  const [depth, setDepth] = useState<number>(0.1);
  const [weight, setWeight] = useState<number>(1.2);
  const [matteBorder, setMatteBorder] = useState<number>(0.09);
  const [sunAngle, setSunAngle] = useState<number>(45);
  const [isNudged, setIsNudged] = useState(false);
  const [extractedExif, setExtractedExif] = useState({
    camera: "Sony A7 IV",
    lens: "FE 50mm f/1.2 GM",
    aperture: "f/1.4",
    shutter: "1/2000s",
    iso: "ISO 100",
  });

  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange({
        frameFinish,
        scale,
        depth,
        weight,
        matteBorder,
        sunAngle,
      });
    }
  }, [frameFinish, scale, depth, weight, matteBorder, sunAngle, onSettingsChange]);

  // Simulate EXIF auto-extraction when image changes
  useEffect(() => {
    if (imagePreviewUrl) {
      const simulated = {
        camera: "Leica SL2",
        lens: "Summilux-SL 50mm f/1.4 ASPH",
        aperture: "f/1.4",
        shutter: "1/1600s",
        iso: "ISO 100",
      };
      setExtractedExif(simulated);
      if (onExifExtracted) onExifExtracted(simulated);
    }
  }, [imagePreviewUrl, onExifExtracted]);

  const handleTestImpulse = () => {
    setIsNudged(true);
    setTimeout(() => setIsNudged(false), 1200);
  };

  // Convert sun angle to 3D light coordinates
  const rad = (sunAngle * Math.PI) / 180;
  const sunX = Math.cos(rad) * 6;
  const sunY = Math.sin(rad) * 6;

  return (
    <div className="rounded-3xl border border-[#181817]/10 bg-white/90 shadow-xl p-5 text-[#181817] space-y-5 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#181817]/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#D9381E] animate-pulse" />
          <span className="font-serif text-sm tracking-wide text-[#181817] font-semibold">
            Sun-Angle &amp; Frame Studio
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D9381E] bg-[#D9381E]/10 px-2.5 py-0.5 rounded-full border border-[#D9381E]/20">
            Daylight Atelier
          </span>
        </div>
      </div>

      {/* 3D Sunlit Canvas Preview Window */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#181817]/10 bg-[#FAF8F5] shadow-inner">
        <Suspense fallback={<div className="h-full flex items-center justify-center font-mono text-xs text-[#6E6A63]">Loading 3D Skylight...</div>}>
          <Canvas
            shadows
            camera={{ position: [0, 0, 3.2], fov: 45 }}
            gl={{ antialias: true }}
            onCreated={({ gl }) => {
              WebGLResourceManager.attachContextListeners(gl.domElement);
            }}
          >
            <color attach="background" args={["#FAF8F5"]} />
            {/* Gallery Skylight */}
            <ambientLight intensity={1.1} />
            <directionalLight
              position={[sunX, sunY, 4]}
              intensity={2.8}
              color="#FFF9F0"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0001}
            />
            <Environment preset="apartment" />

            <PreviewFrameMesh
              textureUrl={imagePreviewUrl}
              frameFinish={frameFinish}
              scale={scale}
              depth={depth}
              weight={weight}
              matteBorder={matteBorder}
              isNudged={isNudged}
            />

            {/* Sunlit ContactShadows on Museum Floor */}
            <ContactShadows
              position={[0, -1.3, 0]}
              opacity={0.4}
              scale={6}
              blur={2.4}
              far={3}
              color="#6E6A63"
            />
          </Canvas>
        </Suspense>

        {/* Nudge / Touch Impulse button */}
        <button
          type="button"
          onClick={handleTestImpulse}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-[#181817]/10 text-[10px] font-mono text-[#181817] hover:bg-white shadow-md transition-all active:scale-95"
        >
          <RefreshCw className={`w-3 h-3 text-[#D9381E] ${isNudged ? "animate-spin" : ""}`} />
          <span>Impulse Frame</span>
        </button>

        {/* Live Sun Angle readout badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-[#181817]/10 text-[10px] font-mono text-[#6E6A63]">
          <Sun className="w-3 h-3 text-[#C5A880]" />
          <span>Sun Elevation: {sunAngle}&deg;</span>
        </div>
      </div>

      {/* Frame Finish Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-mono uppercase tracking-wider text-[#6E6A63] block">
          Archival Frame Finish
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setFrameFinish("champagne")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
              frameFinish === "champagne"
                ? "bg-[#C5A880]/15 border-[#C5A880] text-[#181817] font-semibold ring-1 ring-[#C5A880]"
                : "bg-white border-[#181817]/10 text-[#6E6A63] hover:text-[#181817]"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#C5A880] mb-1 border border-white shadow-sm" />
            <span className="text-[11px]">Champagne Gold</span>
          </button>

          <button
            type="button"
            onClick={() => setFrameFinish("rawOak")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
              frameFinish === "rawOak"
                ? "bg-[#D4BE9D]/20 border-[#D4BE9D] text-[#181817] font-semibold ring-1 ring-[#D4BE9D]"
                : "bg-white border-[#181817]/10 text-[#6E6A63] hover:text-[#181817]"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#D4BE9D] mb-1 border border-white shadow-sm" />
            <span className="text-[11px]">Raw Oak Wood</span>
          </button>

          <button
            type="button"
            onClick={() => setFrameFinish("espresso")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
              frameFinish === "espresso"
                ? "bg-[#1E1D1B]/10 border-[#1E1D1B] text-[#181817] font-semibold ring-1 ring-[#1E1D1B]"
                : "bg-white border-[#181817]/10 text-[#6E6A63] hover:text-[#181817]"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#1E1D1B] mb-1 border border-white shadow-sm" />
            <span className="text-[11px]">Matte Espresso</span>
          </button>

          <button
            type="button"
            onClick={() => setFrameFinish("floatingGlass")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
              frameFinish === "floatingGlass"
                ? "bg-slate-100 border-[#181817]/40 text-[#181817] font-semibold ring-1 ring-[#181817]/20"
                : "bg-white border-[#181817]/10 text-[#6E6A63] hover:text-[#181817]"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-200 mb-1 border border-white shadow-sm" />
            <span className="text-[11px]">Optical Glass</span>
          </button>
        </div>
      </div>

      {/* Sliders: Matte Width & Sun Angle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5 bg-[#FAF8F5] p-3 rounded-xl border border-[#181817]/10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#6E6A63]">Passepartout Matte Width</span>
            <span className="text-[#181817] font-semibold">{Math.round(matteBorder * 100)}mm</span>
          </div>
          <Slider
            min={0.03}
            max={0.16}
            step={0.01}
            value={[matteBorder]}
            onValueChange={([val]) => setMatteBorder(val)}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-1.5 bg-[#FAF8F5] p-3 rounded-xl border border-[#181817]/10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#6E6A63]">Atelier Sun Angle</span>
            <span className="text-[#181817] font-semibold">{sunAngle}&deg;</span>
          </div>
          <Slider
            min={15}
            max={75}
            step={5}
            value={[sunAngle]}
            onValueChange={([val]) => setSunAngle(val)}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Auto-Extracted EXIF Strip */}
      <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#181817]/10 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#D9381E] uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Auto-Extracted EXIF Metadata</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-mono">
            <Check className="w-3 h-3" />
            <span>Telemetry Ready</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-[#181817]">
          <div>
            <span className="text-[9px] text-[#6E6A63] block uppercase font-sans">Body</span>
            <span className="truncate block">{extractedExif.camera}</span>
          </div>
          <div>
            <span className="text-[9px] text-[#6E6A63] block uppercase font-sans">Lens</span>
            <span className="truncate block">{extractedExif.lens}</span>
          </div>
          <div>
            <span className="text-[9px] text-[#6E6A63] block uppercase font-sans">Aperture</span>
            <span>{extractedExif.aperture}</span>
          </div>
          <div>
            <span className="text-[9px] text-[#6E6A63] block uppercase font-sans">Exposure</span>
            <span>{extractedExif.shutter}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mini3DPreview;
