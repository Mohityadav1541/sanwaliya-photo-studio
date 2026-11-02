import React, { useRef, useState, useMemo, useEffect } from "react";
import { Text } from "@react-three/drei";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { FrameMaterialFactory, FrameFinishType } from "@/core/3d/FrameMaterialFactory";
import { ProgressiveTextureManager } from "@/core/3d/ProgressiveTextureManager";
import { WebGLResourceManager } from "@/core/3d/WebGLResourceManager";

export interface FloatingPhotoFrameProps {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  title: string;
  category: string;
  finish?: FrameFinishType;
  onSelect?: () => void;
  onPin?: () => void;
}

export function FloatingPhotoFrame({
  url,
  position,
  rotation = [0, 0, 0],
  width = 1.8,
  height = 2.4,
  title,
  category,
  finish = "champagne",
  onSelect,
  onPin,
}: FloatingPhotoFrameProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [hovered, setHovered] = useState(false);
  const [activeTexture, setActiveTexture] = useState<THREE.Texture | null>(null);
  const depth = 0.12;
  const matBorder = 0.12;

  // Progressive Texture Streaming
  useEffect(() => {
    const cancelProgressive = ProgressiveTextureManager.loadProgressive(url, (tex) => {
      setActiveTexture(tex);
    });
    return () => {
      cancelProgressive();
    };
  }, [url]);

  // Moulding material from shared factory
  const mouldingMaterial = useMemo(() => {
    return FrameMaterialFactory.getMouldingMaterial({
      finish,
      isHovered: hovered,
      isSelected: false,
    });
  }, [finish, hovered]);

  const matteMaterial = useMemo(() => FrameMaterialFactory.getMatteMaterial(), []);
  const glassMaterial = useMemo(() => FrameMaterialFactory.getGlassMaterial(), []);
  const kraftMaterial = useMemo(() => FrameMaterialFactory.getKraftBackMaterial(), []);

  // Photo face material with disposal tracking
  const photoMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      roughness: 0.35,
      metalness: 0.05,
      toneMapped: true,
    });
    WebGLResourceManager.registerMaterial(mat);
    return mat;
  }, []);

  useEffect(() => {
    if (activeTexture && photoMaterial) {
      photoMaterial.map = activeTexture;
      photoMaterial.needsUpdate = true;
    }
  }, [activeTexture, photoMaterial]);

  useEffect(() => {
    return () => {
      WebGLResourceManager.disposeMaterial(photoMaterial);
    };
  }, [photoMaterial]);

  // Pointer impulse in zero-gravity space
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (rigidBodyRef.current) {
      const impulse = {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
        z: (Math.random() - 0.5) * 1.2,
      };
      rigidBodyRef.current.applyImpulse(impulse, true);

      const torque = {
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.2,
      };
      rigidBodyRef.current.applyTorqueImpulse(torque, true);
    }

    if (onSelect) {
      onSelect();
    }
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      rotation={rotation}
      linearDamping={0.8}
      angularDamping={0.8}
      restitution={0.65}
      friction={0.3}
      colliders="cuboid"
    >
      <group
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Outer Frame Moulding Box */}
        <mesh castShadow receiveShadow material={mouldingMaterial}>
          <boxGeometry args={[width, height, depth]} />
        </mesh>

        {/* Gallery Museum White Passepartout Matte */}
        <mesh position={[0, 0, depth / 2 + 0.002]} receiveShadow material={matteMaterial}>
          <planeGeometry args={[width - 0.06, height - 0.06]} />
        </mesh>

        {/* Front Photographic Print Face */}
        <mesh
          position={[0, 0.06, depth / 2 + 0.004]}
          castShadow
          receiveShadow
          material={photoMaterial}
        >
          <planeGeometry args={[width - matBorder * 2, height - matBorder * 2.4]} />
        </mesh>

        {/* Outer Optical Glass Refraction Pane */}
        <mesh position={[0, 0, depth / 2 + 0.006]} material={glassMaterial}>
          <planeGeometry args={[width - 0.04, height - 0.04]} />
        </mesh>

        {/* Editorial Title Ribbon in Leica Obsidian */}
        <mesh position={[0, -height / 2 + matBorder * 0.9, depth / 2 + 0.007]}>
          <planeGeometry args={[width - matBorder * 1.8, 0.2]} />
          <meshBasicMaterial color="#FAF8F5" />
        </mesh>

        <Text
          position={[0, -height / 2 + matBorder * 1.05, depth / 2 + 0.009]}
          fontSize={0.075}
          color="#181817"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_ad06nG.woff"
        >
          {title.toUpperCase()}
        </Text>

        <Text
          position={[0, -height / 2 + matBorder * 0.78, depth / 2 + 0.009]}
          fontSize={0.05}
          color="#D9381E"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_ad06nG.woff"
        >
          {category.toUpperCase()}
        </Text>

        {/* Archival Kraft Back */}
        <mesh
          position={[0, 0, -depth / 2 - 0.001]}
          rotation={[0, Math.PI, 0]}
          material={kraftMaterial}
        >
          <planeGeometry args={[width - 0.02, height - 0.02]} />
        </mesh>
      </group>
    </RigidBody>
  );
}

export default FloatingPhotoFrame;
