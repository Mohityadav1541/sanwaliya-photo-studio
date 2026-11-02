import React, { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Text, ContactShadows } from "@react-three/drei";
import { Physics, CuboidCollider, RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { StudioLightingRig, LightingPreset } from "./StudioLightingRig";
import { BokehEffectComposer } from "./BokehEffectComposer";
import { WebGLResourceManager } from "@/core/3d/WebGLResourceManager";
import { FrameMaterialFactory, FrameFinishType } from "@/core/3d/FrameMaterialFactory";
import { PhysicsEngine } from "@/core/3d/PhysicsEngine";
import { ProgressiveTextureManager } from "@/core/3d/ProgressiveTextureManager";
import { eventBus } from "@/core/eventBus";
import ErrorBoundary from "@/components/ErrorBoundary";

// Image assets
import heroWedding from "@/assets/hero-wedding.jpg";
import portfolioWedding from "@/assets/portfolio-wedding.jpg";
import portfolioPrewedding from "@/assets/portfolio-prewedding.jpg";
import portfolioCandid from "@/assets/portfolio-candid.jpg";
import prewedding2 from "@/assets/prewedding-2.jpg";
import candid1 from "@/assets/candid-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import portfolioAlbum from "@/assets/portfolio-album.jpg";

export type MoodType = "All" | "Amber" | "Crimson" | "Emerald" | "Monochrome";

export interface GalleryPhotoItem {
  id: string;
  url: string;
  rawUrl?: string;
  title: string;
  category: string;
  dominantMood: MoodType;
  location: string;
  year: string;
  story: string;
  exif: {
    camera: string;
    lens: string;
    aperture: string;
    iso: string;
    shutter: string;
  };
  initialPos: [number, number, number];
  initialRot: [number, number, number];
  width: number;
  height: number;
  finish?: FrameFinishType;
}

export const PORTFOLIO_GALLERY_ITEMS: GalleryPhotoItem[] = [
  {
    id: "g-1",
    url: heroWedding,
    rawUrl: heroWedding,
    title: "Eternal Vows at Sunset",
    category: "Weddings",
    dominantMood: "Amber",
    location: "Udaipur, Rajasthan",
    year: "2024",
    story: "Captured amidst the amber glow of the Lake Palace. Natural warmth and timeless royal composition.",
    exif: {
      camera: "Sony A7 IV",
      lens: "FE 50mm f/1.2 GM",
      aperture: "f/1.4",
      iso: "ISO 100",
      shutter: "1/1600s",
    },
    initialPos: [-2.8, 1.2, 0.4],
    initialRot: [0.08, 0.22, -0.04],
    width: 1.8,
    height: 2.4,
    finish: "champagne",
  },
  {
    id: "g-2",
    url: portfolioWedding,
    rawUrl: portfolioWedding,
    title: "The Golden Ghunghat",
    category: "Weddings",
    dominantMood: "Crimson",
    location: "Jaipur, Rajasthan",
    year: "2024",
    story: "Subtle play of light through traditional zari embroidery, highlighting unposed bridal introspection.",
    exif: {
      camera: "Canon EOS R5",
      lens: "RF 85mm f/1.2L USM",
      aperture: "f/1.8",
      iso: "ISO 160",
      shutter: "1/800s",
    },
    initialPos: [0.2, 1.6, -0.5],
    initialRot: [-0.05, -0.15, 0.06],
    width: 1.7,
    height: 2.3,
    finish: "rawOak",
  },
  {
    id: "g-3",
    url: portfolioPrewedding,
    rawUrl: portfolioPrewedding,
    title: "Echoes of the Aravalli",
    category: "Pre-Wedding",
    dominantMood: "Emerald",
    location: "Kumbhalgarh Fort",
    year: "2023",
    story: "Dramatic mist descending upon ancient bastion walls, casting high-contrast architectural silhouettes.",
    exif: {
      camera: "Sony A1",
      lens: "FE 24-70mm f/2.8 GM II",
      aperture: "f/2.8",
      iso: "ISO 200",
      shutter: "1/2000s",
    },
    initialPos: [2.6, 1.0, 0.2],
    initialRot: [0.06, -0.2, -0.05],
    width: 2.0,
    height: 1.5,
    finish: "champagne",
  },
  {
    id: "g-4",
    url: portfolioCandid,
    rawUrl: portfolioCandid,
    title: "The Laughter of Baraat",
    category: "Candid",
    dominantMood: "Amber",
    location: "Pushkar, Rajasthan",
    year: "2024",
    story: "Unfiltered celebration frozen at 1/2000s shutter speed with authentic atmospheric movement.",
    exif: {
      camera: "Leica Q2",
      lens: "Summilux 28mm f/1.7 ASPH",
      aperture: "f/2.0",
      iso: "ISO 400",
      shutter: "1/2000s",
    },
    initialPos: [-2.1, -1.2, -0.2],
    initialRot: [-0.07, 0.18, 0.05],
    width: 1.7,
    height: 2.2,
    finish: "espresso",
  },
  {
    id: "g-5",
    url: prewedding2,
    rawUrl: prewedding2,
    title: "Sanctuary of Dunes",
    category: "Pre-Wedding",
    dominantMood: "Monochrome",
    location: "Sam Sand Dunes, Jaisalmer",
    year: "2023",
    story: "Geometric ripples of sand meeting desert twilight, framed with editorial restraint.",
    exif: {
      camera: "Hasselblad X2D 100C",
      lens: "XCD 55mm f/2.5 V",
      aperture: "f/5.6",
      iso: "ISO 64",
      shutter: "1/500s",
    },
    initialPos: [2.2, -1.3, -0.4],
    initialRot: [0.09, -0.16, -0.04],
    width: 2.1,
    height: 1.4,
    finish: "floatingGlass",
  },
  {
    id: "g-6",
    url: candid1,
    rawUrl: candid1,
    title: "Tears of Vidai",
    category: "Candid",
    dominantMood: "Monochrome",
    location: "Bikaner Palace",
    year: "2024",
    story: "Raw emotional gravity as twilight lanterns illuminate a sacred farewell ritual.",
    exif: {
      camera: "Sony A7S III",
      lens: "FE 35mm f/1.4 GM",
      aperture: "f/1.4",
      iso: "ISO 800",
      shutter: "1/400s",
    },
    initialPos: [-0.2, -1.5, 0.5],
    initialRot: [0.04, 0.08, -0.06],
    width: 1.6,
    height: 2.3,
    finish: "rawOak",
  },
  {
    id: "g-7",
    url: wedding1,
    rawUrl: wedding1,
    title: "Sacred Saptapadi Fire",
    category: "Weddings",
    dominantMood: "Crimson",
    location: "Chittorgarh Heritage Resort",
    year: "2024",
    story: "Seven sacred circumambulations captured through dancing flames and incense smoke.",
    exif: {
      camera: "Canon EOS R5",
      lens: "RF 50mm f/1.2L USM",
      aperture: "f/1.2",
      iso: "ISO 320",
      shutter: "1/1000s",
    },
    initialPos: [1.5, 2.1, 0.3],
    initialRot: [0.08, -0.12, 0.04],
    width: 1.8,
    height: 2.4,
    finish: "champagne",
  },
  {
    id: "g-8",
    url: portfolioAlbum,
    rawUrl: portfolioAlbum,
    title: "Bound for Eternity",
    category: "Albums",
    dominantMood: "Emerald",
    location: "Sanwaliya Studio Archive",
    year: "2024",
    story: "Hand-stitched leatherette heirloom album preserving over five hundred wedding memories.",
    exif: {
      camera: "Sony A7R V",
      lens: "FE 90mm f/2.8 Macro",
      aperture: "f/4.0",
      iso: "ISO 100",
      shutter: "1/125s",
    },
    initialPos: [-1.2, 2.2, -0.8],
    initialRot: [-0.1, -0.08, 0.06],
    width: 2.0,
    height: 1.4,
    finish: "espresso",
  },
];

// Single 3D Floating Frame with Magnetic Clustering & Mouse Repulsion
function InteractivePhotoBody({
  item,
  activeCategory,
  activeMood,
  onSelect,
  isTargeted,
}: {
  item: GalleryPhotoItem;
  activeCategory: string;
  activeMood: MoodType;
  onSelect: (item: GalleryPhotoItem) => void;
  isTargeted: boolean;
}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [activeTexture, setActiveTexture] = useState<THREE.Texture | null>(null);
  const { viewport, pointer } = useThree();

  // Progressive Texture Loading via Manager
  useEffect(() => {
    const cancelProgressive = ProgressiveTextureManager.loadProgressive(
      item.url,
      (texture) => {
        setActiveTexture(texture);
      }
    );
    return () => {
      cancelProgressive();
    };
  }, [item.url]);

  // Check matching status
  const matchesCategory =
    activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase();
  const matchesMood = activeMood === "All" || item.dominantMood === activeMood;
  const isTargetMatch = matchesCategory && matchesMood;

  // Frame Moulding Material from Factory (Flyweight pattern)
  const finishType = item.finish || "champagne";
  const mouldingMaterial = useMemo(() => {
    return FrameMaterialFactory.getMouldingMaterial({
      finish: finishType,
      isHovered: hovered,
      isSelected: isTargeted,
    });
  }, [finishType, hovered, isTargeted]);

  const matteMaterial = useMemo(() => FrameMaterialFactory.getMatteMaterial(), []);
  const glassMaterial = useMemo(() => FrameMaterialFactory.getGlassMaterial(), []);
  const kraftMaterial = useMemo(() => FrameMaterialFactory.getKraftBackMaterial(), []);

  // Shared photo plane material instance for this frame
  const photoMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      roughness: 0.35,
      metalness: 0.05,
      toneMapped: true,
      transparent: !isTargetMatch,
      opacity: isTargetMatch ? 1 : 0.3,
    });
    WebGLResourceManager.registerMaterial(mat);
    return mat;
  }, [isTargetMatch]);

  useEffect(() => {
    if (activeTexture && photoMaterial) {
      photoMaterial.map = activeTexture;
      photoMaterial.needsUpdate = true;
    }
  }, [activeTexture, photoMaterial]);

  // Cleanup photoMaterial on unmount
  useEffect(() => {
    return () => {
      WebGLResourceManager.disposeMaterial(photoMaterial);
    };
  }, [photoMaterial]);

  // Physics loop: Clamped Magnetic Clustering + Mouse Repulsion
  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;

    // Clamped safe delta to prevent tab switch explosions
    const safeDelta = PhysicsEngine.clampDelta(delta, 0.1);

    const currentPos = rigidBodyRef.current.translation();
    const linvel = rigidBodyRef.current.linvel();

    // 1. Magnetic Color & Mood Clustering
    const magneticForce = PhysicsEngine.calculateMagneticForce({
      currentPos,
      currentVel: linvel,
      isTargetMatch,
      activeMood,
      activeCategory,
    });

    if (magneticForce) {
      rigidBodyRef.current.applyImpulse(
        {
          x: magneticForce.x * (safeDelta / 0.016),
          y: magneticForce.y * (safeDelta / 0.016),
          z: magneticForce.z * (safeDelta / 0.016),
        },
        true
      );
    }

    // 2. Mouse Repulsion Physics
    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;

    const repulsionResult = PhysicsEngine.calculatePointerRepulsion({
      currentPos,
      pointerPos: { x: mouseX, y: mouseY },
      repulsionRadius: 2.4,
      maxForce: 0.065,
    });

    if (repulsionResult) {
      rigidBodyRef.current.applyImpulse(repulsionResult.impulse, true);
      rigidBodyRef.current.applyTorqueImpulse(repulsionResult.torque, true);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(item);
    eventBus.emit("PHOTO_SELECTED", item);
  };

  const depth = 0.1;
  const matBorder = 0.08;

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={item.initialPos}
      rotation={item.initialRot}
      linearDamping={0.8}
      angularDamping={0.8}
      restitution={0.65}
      friction={0.3}
      colliders="cuboid"
    >
      <group
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          eventBus.emit("PHOTO_HOVERED", item);
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
          eventBus.emit("PHOTO_HOVERED", null);
        }}
        scale={isTargetMatch ? 1 : 0.82}
      >
        {/* Outer Frame Moulding Box */}
        <mesh castShadow receiveShadow material={mouldingMaterial}>
          <boxGeometry args={[item.width, item.height, depth]} />
        </mesh>

        {/* Gallery Museum White Thick Bevel-Cut Passepartout Matte */}
        <mesh position={[0, 0, depth / 2 + 0.002]} receiveShadow material={matteMaterial}>
          <planeGeometry args={[item.width - 0.06, item.height - 0.06]} />
        </mesh>

        {/* Front Photographic Print Face */}
        <mesh
          position={[0, 0.06, depth / 2 + 0.004]}
          castShadow
          receiveShadow
          material={photoMaterial}
        >
          <planeGeometry args={[item.width - matBorder * 2, item.height - matBorder * 2.4]} />
        </mesh>

        {/* Outer Optical Glass Pane (FIXED: item.height used instead of out-of-scope height) */}
        <mesh position={[0, 0, depth / 2 + 0.006]} material={glassMaterial}>
          <planeGeometry args={[item.width - 0.04, item.height - 0.04]} />
        </mesh>

        {/* Editorial Label Ribbon in Leica Obsidian (#181817) */}
        <mesh position={[0, -item.height / 2 + matBorder * 0.9, depth / 2 + 0.007]}>
          <planeGeometry args={[item.width - matBorder * 1.8, 0.2]} />
          <meshBasicMaterial color="#FAF8F5" />
        </mesh>

        <Text
          position={[0, -item.height / 2 + matBorder * 1.05, depth / 2 + 0.009]}
          fontSize={0.075}
          color="#181817"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          font="/fonts/JetBrainsMono.ttf"
        >
          {item.title.toUpperCase()}
        </Text>

        <Text
          position={[0, -item.height / 2 + matBorder * 0.78, depth / 2 + 0.009]}
          fontSize={0.05}
          color="#D9381E"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          font="/fonts/JetBrainsMono.ttf"
        >
          {item.category.toUpperCase()} &middot; {item.year}
        </Text>

        {/* Archival Kraft Back */}
        <mesh
          position={[0, 0, -depth / 2 - 0.001]}
          rotation={[0, Math.PI, 0]}
          material={kraftMaterial}
        >
          <planeGeometry args={[item.width - 0.02, item.height - 0.02]} />
        </mesh>
      </group>
    </RigidBody>
  );
}

// Dynamic Invisible Boundary Colliders
function ViewportEdgeColliders() {
  const { viewport } = useThree();
  const depth = 6.0;
  const wallThickness = 1.0;

  return (
    <>
      <CuboidCollider
        position={[0, viewport.height / 2 + wallThickness / 2, 0]}
        args={[viewport.width / 2 + 1, wallThickness / 2, depth / 2]}
      />
      <CuboidCollider
        position={[0, -viewport.height / 2 - wallThickness / 2, 0]}
        args={[viewport.width / 2 + 1, wallThickness / 2, depth / 2]}
      />
      <CuboidCollider
        position={[-viewport.width / 2 - wallThickness / 2, 0, 0]}
        args={[wallThickness / 2, viewport.height / 2 + 1, depth / 2]}
      />
      <CuboidCollider
        position={[viewport.width / 2 + wallThickness / 2, 0, 0]}
        args={[wallThickness / 2, viewport.height / 2 + 1, depth / 2]}
      />
      <CuboidCollider
        position={[0, 0, -depth / 2 - wallThickness / 2]}
        args={[viewport.width / 2 + 1, viewport.height / 2 + 1, wallThickness / 2]}
      />
      <CuboidCollider
        position={[0, 0, depth / 2 + wallThickness / 2]}
        args={[viewport.width / 2 + 1, viewport.height / 2 + 1, wallThickness / 2]}
      />
    </>
  );
}

// Smooth Camera Animator & Touch Drag Controller with Clamped Delta Time
function CameraController({ targetItem }: { targetItem: GalleryPhotoItem | null }) {
  const { camera } = useThree();
  const defaultPos = useMemo(() => new THREE.Vector3(0, 0, 7.5), []);
  const defaultLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const isTouchDragging = useRef(false);
  const prevTouch = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && !targetItem) {
        isTouchDragging.current = true;
        prevTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchDragging.current || e.touches.length !== 1 || targetItem) return;
      const touch = e.touches[0];
      const deltaX = (touch.clientX - prevTouch.current.x) * 0.007;
      const deltaY = (touch.clientY - prevTouch.current.y) * 0.007;

      camera.position.x = THREE.MathUtils.clamp(camera.position.x - deltaX, -2.5, 2.5);
      camera.position.y = THREE.MathUtils.clamp(camera.position.y + deltaY, -2, 2);

      prevTouch.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      isTouchDragging.current = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera, targetItem]);

  useFrame((_, delta) => {
    const safeDelta = PhysicsEngine.clampDelta(delta, 0.1);

    if (targetItem) {
      const targetPos = new THREE.Vector3(
        targetItem.initialPos[0] * 0.4,
        targetItem.initialPos[1] * 0.4,
        3.8
      );
      camera.position.lerp(targetPos, Math.min(safeDelta * 4, 0.15));
      camera.lookAt(targetItem.initialPos[0] * 0.4, targetItem.initialPos[1] * 0.4, 0);
    } else if (!isTouchDragging.current) {
      camera.position.lerp(defaultPos, Math.min(safeDelta * 2.5, 0.08));
      camera.lookAt(defaultLookAt);
    }
  });

  return null;
}

// Main Antigravity 3D Gallery Component
export function AntigravityGallery({
  activeCategory = "All",
  activeMood = "All",
  apertureValue = 2.8,
  lightingPreset = "goldenHour",
  onSelectPhoto,
  selectedPhoto,
  items = PORTFOLIO_GALLERY_ITEMS,
}: {
  activeCategory: string;
  activeMood?: MoodType;
  apertureValue?: number;
  lightingPreset?: LightingPreset;
  onSelectPhoto: (item: GalleryPhotoItem | null) => void;
  selectedPhoto: GalleryPhotoItem | null;
  items?: GalleryPhotoItem[];
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const displayItems = useMemo(() => {
    return isMobile ? items.slice(0, 5) : items;
  }, [isMobile, items]);

  return (
    <div className="relative w-full h-full select-none">
      <ErrorBoundary
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F5] text-[#181817]">
            <div className="flex flex-col items-center gap-2">
              <span className="font-serif text-sm tracking-widest text-[#181817]/70 uppercase">
                Hardware acceleration restricted. Switch to 2D Editorial Grid above.
              </span>
            </div>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F5] text-[#181817]">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#D9381E] border-t-transparent animate-spin" />
                <span className="font-serif text-sm tracking-widest text-[#181817]/70 uppercase">
                  Loading Daylight Atelier Canvas...
                </span>
              </div>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 48 }}
            dpr={[1, typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.75) : 1]}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              // Attach WebGL context loss and restoration listeners
              WebGLResourceManager.attachContextListeners(gl.domElement);
            }}
          >
            <color attach="background" args={["#FAF8F5"]} />

            {/* Warm Gallery Skylight & Environmental Reflections */}
            <Environment preset="apartment" />
            <ambientLight intensity={0.75} color="#FAF8F5" />
            <directionalLight
              position={[7, 11, 6]}
              intensity={2.1}
              color="#FFFBF5"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0001}
            />

            {/* Soft-Edged Museum Floor Contact Shadows */}
            <ContactShadows
              position={[0, -2.75, 0]}
              opacity={0.38}
              scale={18}
              blur={2.4}
              far={5}
              color="#6E6A63"
            />

            {/* Dynamic Studio Lighting Rig with Cursor-Following Key Light */}
            <StudioLightingRig preset={lightingPreset} />

            {/* Depth of Field Postprocessing (BokehPass) */}
            <BokehEffectComposer
              apertureValue={apertureValue}
              focusDistance={selectedPhoto ? 3.8 : 7.2}
              enabled={true}
            />

            {/* Smooth Camera Animation on Selection */}
            <CameraController targetItem={selectedPhoto} />

            {/* Antigravity Physics with Magnetic Clustering in zero gravity: [0, 0, 0] */}
            <Physics gravity={[0, 0, 0]}>
              <ViewportEdgeColliders />

              {displayItems.map((item) => (
                <InteractivePhotoBody
                  key={item.id}
                  item={item}
                  activeCategory={activeCategory}
                  activeMood={activeMood}
                  onSelect={(selected) => onSelectPhoto(selected)}
                  isTargeted={selectedPhoto?.id === item.id}
                />
              ))}
            </Physics>
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default AntigravityGallery;
