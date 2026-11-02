import React, { useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PhysicsEngine } from "@/core/3d/PhysicsEngine";

export type LightingPreset = "goldenHour" | "studioWhite" | "noir" | "darkroomRed";

interface StudioLightingRigProps {
  preset: LightingPreset;
}

export function StudioLightingRig({ preset }: StudioLightingRigProps) {
  const { pointer, viewport } = useThree();
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  // Lighting configuration based on preset
  const config = useMemo(() => {
    switch (preset) {
      case "goldenHour":
        return {
          spotColor: "#FFE0B2",
          spotIntensity: 3.5,
          ambientColor: "#FAF8F5",
          ambientIntensity: 0.9,
          rimColor: "#C5A880",
          rimIntensity: 1.2,
        };
      case "noir":
        return {
          spotColor: "#DCE5F0",
          spotIntensity: 3.8,
          ambientColor: "#2A2A2A",
          ambientIntensity: 0.45,
          rimColor: "#8FA3B8",
          rimIntensity: 1.0,
        };
      case "darkroomRed":
        return {
          spotColor: "#FF202B",
          spotIntensity: 4.2,
          ambientColor: "#2A0005",
          ambientIntensity: 0.5,
          rimColor: "#8B0000",
          rimIntensity: 1.6,
        };
      case "studioWhite":
      default:
        return {
          spotColor: "#FFFFFF",
          spotIntensity: 2.8,
          ambientColor: "#FAF8F5",
          ambientIntensity: 1.0,
          rimColor: "#C5A880",
          rimIntensity: 0.9,
        };
    }
  }, [preset]);

  // Smoothly track mouse cursor in 3D space with clamped delta
  useFrame((_, delta) => {
    if (!spotLightRef.current || !targetRef.current) return;

    const safeDelta = PhysicsEngine.clampDelta(delta, 0.1);
    const lerpSpeed = Math.min(safeDelta * 5, 0.15);

    // Convert pointer to world coordinates at frame plane
    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;

    // Smoothly lerp spotlight position with offset
    spotLightRef.current.position.x = THREE.MathUtils.lerp(
      spotLightRef.current.position.x,
      mouseX * 1.15,
      lerpSpeed
    );
    spotLightRef.current.position.y = THREE.MathUtils.lerp(
      spotLightRef.current.position.y,
      mouseY * 1.15,
      lerpSpeed
    );
    spotLightRef.current.position.z = 3.6;

    // Lerp target position toward cursor focus
    targetRef.current.position.x = THREE.MathUtils.lerp(
      targetRef.current.position.x,
      mouseX * 0.85,
      lerpSpeed * 1.2
    );
    targetRef.current.position.y = THREE.MathUtils.lerp(
      targetRef.current.position.y,
      mouseY * 0.85,
      lerpSpeed * 1.2
    );
    targetRef.current.position.z = 0;

    spotLightRef.current.target = targetRef.current;
  });

  return (
    <>
      {/* Target object for spotlight tracking */}
      <object3D ref={targetRef} position={[0, 0, 0]} />

      {/* Primary Key Light attached to cursor position */}
      <spotLight
        ref={spotLightRef}
        color={config.spotColor}
        intensity={config.spotIntensity}
        angle={Math.PI / 4.2}
        penumbra={0.6}
        distance={14}
        decay={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Subtle Rim Backlight */}
      <directionalLight
        position={[-4, -3, -2]}
        intensity={config.rimIntensity}
        color={config.rimColor}
      />
    </>
  );
}

export default StudioLightingRig;
