import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WebGLResourceManager } from "@/core/3d/WebGLResourceManager";

interface ParallaxPhotoPlaneProps {
  texture: THREE.Texture;
  depthMapTexture?: THREE.Texture | null;
  width: number;
  height: number;
  intensity?: number;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform sampler2D uDepthMap;
  uniform bool uHasDepthMap;
  uniform vec2 uMouse;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    float depth = 0.5;

    if (uHasDepthMap) {
      depth = texture2D(uDepthMap, vUv).r;
    } else {
      // Analytical high-precision depth calculated from luminance and radial depth
      vec4 baseColor = texture2D(uTexture, vUv);
      float lum = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));
      float centerWeight = 1.0 - distance(vUv, vec2(0.5, 0.45)) * 1.2;
      depth = clamp(lum * 0.6 + centerWeight * 0.4, 0.0, 1.0);
    }

    // Dynamic 2.5D displacement vector based on mouse tilt
    vec2 offset = uMouse * (depth - 0.5) * uIntensity;
    vec2 uv = clamp(vUv + offset, vec2(0.001), vec2(0.999));

    vec4 color = texture2D(uTexture, uv);

    // Subtle chromatic dispersion at edges
    float r = texture2D(uTexture, uv + offset * 0.15).r;
    float b = texture2D(uTexture, uv - offset * 0.15).b;
    color.r = mix(color.r, r, 0.4);
    color.b = mix(color.b, b, 0.4);

    gl_FragColor = color;
  }
`;

export function ParallaxPhotoPlane({
  texture,
  depthMapTexture = null,
  width,
  height,
  intensity = 0.045,
}: ParallaxPhotoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uDepthMap: { value: depthMapTexture },
      uHasDepthMap: { value: !!depthMapTexture },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: intensity },
    }),
    [texture, depthMapTexture, intensity]
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTexture.value = texture;
      materialRef.current.uniforms.uDepthMap.value = depthMapTexture;
      materialRef.current.uniforms.uHasDepthMap.value = !!depthMapTexture;
      materialRef.current.uniforms.uIntensity.value = intensity;
    }
  }, [texture, depthMapTexture, intensity]);

  // Clean disposal on unmount
  useEffect(() => {
    return () => {
      if (materialRef.current) {
        WebGLResourceManager.disposeMaterial(materialRef.current);
      }
      if (geometryRef.current) {
        WebGLResourceManager.disposeGeometry(geometryRef.current);
      }
    };
  }, []);

  // Smooth mouse tilt tracking for the 2.5D holographic window with delta-clamped lerp
  useFrame((_, delta) => {
    if (materialRef.current) {
      const safeDelta = Math.min(Math.max(delta, 0.001), 0.1);
      const lerpFactor = safeDelta * 4;
      const currentMouse = materialRef.current.uniforms.uMouse.value;
      currentMouse.x = THREE.MathUtils.lerp(currentMouse.x, pointer.x, lerpFactor);
      currentMouse.y = THREE.MathUtils.lerp(currentMouse.y, pointer.y, lerpFactor);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry ref={geometryRef} args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default ParallaxPhotoPlane;
