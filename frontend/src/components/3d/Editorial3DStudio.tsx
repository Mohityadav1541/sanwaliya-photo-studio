import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { WebGLResourceManager } from "@/core/3d/WebGLResourceManager";
import ErrorBoundary from "@/components/ErrorBoundary";
import { WebGLDetector } from "@/core/3d/webglDetection";

// Photography assets
import heroWedding from "@/assets/hero-wedding.jpg";
import portfolioWedding from "@/assets/portfolio-wedding.jpg";
import portfolioCandid from "@/assets/portfolio-candid.jpg";
import preweddingImg from "@/assets/prewedding-2.jpg";
import candidImg from "@/assets/candid-1.jpg";
import roshanPortrait from "@/assets/roshan-portrait.jpg";

interface PhotoCardData {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  initialPos: [number, number, number];
  size: [number, number, number]; // width, height, depth
}

const PHOTO_ITEMS: PhotoCardData[] = [
  {
    id: "card-1",
    title: "Eternal Vows",
    category: "Royal Wedding",
    imageUrl: heroWedding,
    initialPos: [-2.2, 2.5, 0],
    size: [1.8, 2.4, 0.08],
  },
  {
    id: "card-2",
    title: "Sanctuary",
    category: "Pre-Wedding",
    imageUrl: preweddingImg,
    initialPos: [0, 4.0, -0.5],
    size: [2.0, 1.4, 0.08],
  },
  {
    id: "card-3",
    title: "Unscripted Joy",
    category: "Candid Series",
    imageUrl: candidImg,
    initialPos: [2.3, 3.2, 0.2],
    size: [1.7, 2.3, 0.08],
  },
  {
    id: "card-4",
    title: "Golden Hour",
    category: "Bridal Portrait",
    imageUrl: portfolioWedding,
    initialPos: [-1.4, 5.2, -0.2],
    size: [1.6, 2.2, 0.08],
  },
  {
    id: "card-5",
    title: "Monochrome Soul",
    category: "Editorial B&W",
    imageUrl: portfolioCandid,
    initialPos: [1.5, 5.8, -0.4],
    size: [1.9, 1.4, 0.08],
  },
  {
    id: "card-6",
    title: "The Artist",
    category: "Roshan Lal Yadav",
    imageUrl: roshanPortrait,
    initialPos: [0.2, 1.8, 0.4],
    size: [1.6, 2.1, 0.08],
  },
];

// Physical 3D Photo Plaque Component
function PhysicalPhotoPlate({
  item,
  world,
  texture,
  onHit,
}: {
  item: PhotoCardData;
  world: CANNON.World;
  texture: THREE.Texture;
  onHit?: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Configure texture
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture]);

  // Create CANNON physical rigid body
  const body = useMemo(() => {
    const [w, h, d] = item.size;
    const halfExtents = new CANNON.Vec3(w / 2, h / 2, d / 2);
    const boxShape = new CANNON.Box(halfExtents);

    const b = new CANNON.Body({
      mass: 1.2,
      shape: boxShape,
      position: new CANNON.Vec3(item.initialPos[0], item.initialPos[1], item.initialPos[2]),
      material: new CANNON.Material({ restitution: 0.35, friction: 0.4 }),
      linearDamping: 0.15,
      angularDamping: 0.25,
    });

    // Random slight rotation
    b.quaternion.setFromEuler(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.2
    );

    return b;
  }, [item]);

  // Add to CANNON world
  useEffect(() => {
    world.addBody(body);
    return () => {
      world.removeBody(body);
    };
  }, [world, body]);

  // Sync mesh with physics body every frame
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(body.position.x, body.position.y, body.position.z);
    meshRef.current.quaternion.set(
      body.quaternion.x,
      body.quaternion.y,
      body.quaternion.z,
      body.quaternion.w
    );
  });

  // Apply impulse on click / tap
  const handleClick = (e: any) => {
    e.stopPropagation();
    const upForce = 5 + Math.random() * 3.5;
    const xForce = (Math.random() - 0.5) * 4;
    const zForce = (Math.random() - 0.5) * 3;

    body.velocity.set(body.velocity.x * 0.2, 0, body.velocity.z * 0.2);
    body.applyImpulse(new CANNON.Vec3(xForce, upForce, zForce), body.position);
    body.angularVelocity.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 4
    );

    if (onHit) onHit();
  };

  const [w, h, d] = item.size;
  const frameBorder = 0.09;

  return (
    <group
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      cursor="pointer"
    >
      {/* Outer Editorial Frame (Deep Charcoal / Ivory Matte) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={hovered ? "#F5F3EF" : "#181818"}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Warm Ivory Inset Mat */}
      <mesh position={[0, 0, d / 2 + 0.002]}>
        <planeGeometry args={[w - frameBorder, h - frameBorder]} />
        <meshStandardMaterial color="#F5F3EF" roughness={0.9} />
      </mesh>

      {/* Photographic Print Layer */}
      <mesh position={[0, 0, d / 2 + 0.004]} castShadow>
        <planeGeometry args={[w - frameBorder * 2, h - frameBorder * 2.4]} />
        <meshBasicMaterial map={texture} toneMapped={true} />
      </mesh>

      {/* Editorial Title Ribbon on Bottom of Frame */}
      <mesh position={[0, -h / 2 + frameBorder * 1.1, d / 2 + 0.005]}>
        <planeGeometry args={[w - frameBorder * 2, 0.16]} />
        <meshBasicMaterial color="#121212" />
      </mesh>
      <Text
        position={[0, -h / 2 + frameBorder * 1.1, d / 2 + 0.007]}
        fontSize={0.075}
        color="#F5F3EF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter.woff"
      >
        {item.title.toUpperCase()}
      </Text>
    </group>
  );
}

// 3D Physical Aperture / Camera Lens Ring
function PhysicalCameraLens({ world }: { world: CANNON.World }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const radius = 0.7;
  const height = 0.45;

  const body = useMemo(() => {
    const cylinderShape = new CANNON.Cylinder(radius, radius, height, 16);
    const b = new CANNON.Body({
      mass: 1.8,
      shape: cylinderShape,
      position: new CANNON.Vec3(0, 6.5, 0),
      material: new CANNON.Material({ restitution: 0.4, friction: 0.3 }),
      linearDamping: 0.1,
      angularDamping: 0.2,
    });
    b.quaternion.setFromEuler(Math.PI / 4, 0.3, 0);
    return b;
  }, []);

  useEffect(() => {
    world.addBody(body);
    return () => {
      world.removeBody(body);
    };
  }, [world, body]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(body.position.x, body.position.y, body.position.z);
    meshRef.current.quaternion.set(
      body.quaternion.x,
      body.quaternion.y,
      body.quaternion.z,
      body.quaternion.w
    );
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    body.applyImpulse(
      new CANNON.Vec3((Math.random() - 0.5) * 3, 5 + Math.random() * 3, (Math.random() - 0.5) * 3),
      body.position
    );
    body.angularVelocity.set(4, 3, 2);
  };

  return (
    <group
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer Metallic Lens Barrel */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 32, 1, true]} />
        <meshStandardMaterial
          color={hovered ? "#C2A676" : "#222222"}
          metalness={0.85}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Gold/Bronze Editorial Focus Ring Accent */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[radius + 0.015, radius + 0.015, 0.08, 32, 1, true]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Optical Glass Element */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius * 0.9, radius * 0.9, 0.06, 32]} />
        <meshPhysicalMaterial
          color="#F5F3EF"
          transmission={0.9}
          opacity={1}
          transparent
          roughness={0.05}
          ior={1.52}
          reflectivity={0.9}
        />
      </mesh>
    </group>
  );
}

// Bounding Physics Environment Box (Invisible boundaries to keep items in view)
function PhysicsEnclosure({ world }: { world: CANNON.World }) {
  useEffect(() => {
    // Floor
    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(0, -2.6, 0),
    });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(floorBody);

    // Left wall
    const leftWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(-4.8, 0, 0),
    });
    leftWall.quaternion.setFromEuler(0, Math.PI / 2, 0);
    world.addBody(leftWall);

    // Right wall
    const rightWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(4.8, 0, 0),
    });
    rightWall.quaternion.setFromEuler(0, -Math.PI / 2, 0);
    world.addBody(rightWall);

    // Back wall
    const backWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(0, 0, -2.5),
    });
    world.addBody(backWall);

    // Front boundary
    const frontWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(0, 0, 2.8),
    });
    frontWall.quaternion.setFromEuler(0, Math.PI, 0);
    world.addBody(frontWall);

    // Ceiling
    const ceiling = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(0, 8.5, 0),
    });
    ceiling.quaternion.setFromEuler(Math.PI / 2, 0, 0);
    world.addBody(ceiling);

    return () => {
      world.removeBody(floorBody);
      world.removeBody(leftWall);
      world.removeBody(rightWall);
      world.removeBody(backWall);
      world.removeBody(frontWall);
      world.removeBody(ceiling);
    };
  }, [world]);

  return null;
}

// Interactive Studio Physics Scene Coordinator
function StudioPhysicsScene({
  isZeroG,
  onInteraction,
}: {
  isZeroG: boolean;
  onInteraction?: () => void;
}) {
  const { viewport } = useThree();

  // Create persistent physics world
  const world = useMemo(() => {
    const w = new CANNON.World({
      gravity: new CANNON.Vec3(0, isZeroG ? -0.4 : -7.5, 0),
    });
    w.defaultContactMaterial.friction = 0.3;
    w.defaultContactMaterial.restitution = 0.35;
    return w;
  }, []);

  // Update gravity dynamically
  useEffect(() => {
    world.gravity.set(0, isZeroG ? -0.4 : -7.5, 0);
    // Wake all sleeping bodies
    world.bodies.forEach((b) => b.wakeUp());
  }, [isZeroG, world]);

  // Load photo textures
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const textures = useMemo(() => {
    return PHOTO_ITEMS.map((item) => textureLoader.load(item.imageUrl));
  }, [textureLoader]);

  // Physics animation frame step
  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.06);
    world.step(1 / 60, clampedDelta, 3);
  });

  return (
    <>
      {/* Studio Lighting - Daylight Atelier Skylight & Directional Sunlight */}
      <ambientLight intensity={1.2} color="#FAF8F5" />
      <directionalLight
        position={[6, 12, 6]}
        intensity={2.6}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, 4, -3]} intensity={0.8} color="#EFECE6" />
      <pointLight position={[0, -1, 3]} intensity={0.5} color="#FAF8F5" />

      {/* Boundaries */}
      <PhysicsEnclosure world={world} />

      {/* Physical Photo Plates */}
      {PHOTO_ITEMS.map((item, index) => (
        <PhysicalPhotoPlate
          key={item.id}
          item={item}
          world={world}
          texture={textures[index]}
          onHit={onInteraction}
        />
      ))}

      {/* Physical Camera Lens Component */}
      <PhysicalCameraLens world={world} />

      {/* Architectural Studio Stage Pedestal / Floor in Warm Limestone */}
      <mesh position={[0, -2.62, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 5.5, 0.2, 48]} />
        <meshStandardMaterial color="#EFECE6" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Editorial Ground Shadow / Backdrop Rim */}
      <mesh position={[0, 0, -2.48]}>
        <planeGeometry args={[12, 10]} />
        <meshBasicMaterial color="#FAF8F5" />
      </mesh>
    </>
  );
}

// Fallback when WebGL is unavailable or initializing
function WebGLFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 bg-[#FAF8F5] text-[#181817]">
      <div className="w-8 h-8 rounded-full border-2 border-[#D9381E] border-t-transparent animate-spin mb-3" />
      <p className="font-serif text-2xl mb-1 text-[#181817]">Daylight Atelier 3D Studio</p>
      <p className="text-xs uppercase tracking-widest text-[#6E6A63] font-mono">
        Loading physics canvas &amp; fine-art textures...
      </p>
    </div>
  );
}

// 2D Editorial Showcase fallback when WebGL hardware is disabled/restricted
function Editorial2DFallback() {
  return (
    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-center bg-[#FAF8F5]">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-full max-h-[500px] overflow-hidden">
        {PHOTO_ITEMS.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl overflow-hidden border border-[#181817]/10 bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
                {item.category}
              </span>
              <h4 className="font-serif text-sm font-normal">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Exported Component
export function Editorial3DStudio({
  className = "",
  showControls = true,
}: {
  className?: string;
  showControls?: boolean;
}) {
  const [isZeroG, setIsZeroG] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [key, setKey] = useState(0);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(WebGLDetector.isWebGLSupported());
  }, []);

  const handleReset = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-[#181817]/10 bg-[#FAF8F5] select-none shadow-xl ${className}`}
    >
      {/* Editorial Watermark / Header */}
      <div className="absolute top-4 left-5 z-20 pointer-events-none flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#D9381E] animate-pulse" />
        <div className="flex flex-col">
          <span className="font-serif text-sm tracking-widest text-[#181817] uppercase font-semibold">
            Daylight Atelier Experience
          </span>
          <span className="text-[10px] tracking-wider uppercase text-[#6E6A63] font-mono">
            {webglSupported ? "Three.js · Cannon.js Physics Engine" : "Archival 2D Exhibition View"}
          </span>
        </div>
      </div>

      {/* Floating Interaction Prompt */}
      {webglSupported && (
        <div className="absolute top-4 right-5 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#181817]/10 backdrop-blur-md shadow-sm">
          <span className="text-[11px] tracking-widest uppercase text-[#181817] font-mono">
            Click or drag frames to impulse
          </span>
        </div>
      )}

      {/* 3D Canvas or 2D Fallback */}
      <div className="w-full h-[450px] sm:h-[540px] md:h-[620px]">
        {!webglSupported ? (
          <Editorial2DFallback />
        ) : (
          <ErrorBoundary fallback={<Editorial2DFallback />}>
            <Suspense fallback={<WebGLFallback />}>
              <Canvas
                key={key}
                shadows
                camera={{ position: [0, 1.5, 6.8], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: false }}
                onCreated={({ gl }) => {
                  WebGLResourceManager.attachContextListeners(gl.domElement);
                }}
              >
                <color attach="background" args={["#FAF8F5"]} />
                <fog attach="fog" args={["#FAF8F5", 7, 14]} />
                <StudioPhysicsScene
                  isZeroG={isZeroG}
                  onInteraction={() => setInteractionCount((c) => c + 1)}
                />
              </Canvas>
            </Suspense>
          </ErrorBoundary>
        )}
      </div>

      {/* Minimalist Editorial Controls Footer */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl atelier-glass border border-[#181817]/10 shadow-lg text-[#181817]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#6E6A63] font-mono hidden sm:inline">
              Mode:
            </span>
            <button
              onClick={() => setIsZeroG(!isZeroG)}
              className={`px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase font-medium transition-all duration-300 ${
                isZeroG
                  ? "bg-[#D9381E] text-white font-semibold shadow-md"
                  : "bg-white text-[#181817] hover:bg-[#FAF8F5] border border-[#181817]/15 shadow-sm"
              }`}
            >
              {isZeroG ? "Zero-G Active (Float)" : "Standard Gravity"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase font-medium bg-white text-[#181817] hover:bg-[#FAF8F5] border border-[#181817]/15 shadow-sm transition-all duration-300"
            >
              Reset Simulation
            </button>
            <span className="text-[11px] font-mono text-[#6E6A63] px-2">
              Collisions: {interactionCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Editorial3DStudio;

