import React, { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { WebGLResourceManager } from "@/core/3d/WebGLResourceManager";
import { eventBus } from "@/core/eventBus";

export const APERTURE_STOPS = [
  { f: "f/1.4", value: 1.4, blur: 0.025, label: "Creamy Bokeh" },
  { f: "f/2.0", value: 2.0, blur: 0.018, label: "Soft Subject Separation" },
  { f: "f/2.8", value: 2.8, blur: 0.012, label: "Editorial Portrait" },
  { f: "f/4.0", value: 4.0, blur: 0.007, label: "Balanced Depth" },
  { f: "f/5.6", value: 5.6, blur: 0.004, label: "Documentary Crisp" },
  { f: "f/8.0", value: 8.0, blur: 0.002, label: "Architectural Focus" },
  { f: "f/11", value: 11.0, blur: 0.0008, label: "Deep Field" },
  { f: "f/16", value: 16.0, blur: 0.00005, label: "Razor Infinite Focus" },
];

interface BokehEffectComposerProps {
  apertureValue: number;
  focusDistance?: number;
  enabled?: boolean;
}

export function BokehEffectComposer({
  apertureValue = 2.8,
  focusDistance = 7.2,
  enabled = true,
}: BokehEffectComposerProps) {
  const { gl, scene, camera, size } = useThree();
  const isContextLost = useRef(false);

  // Find corresponding blur value
  const currentStop = useMemo(() => {
    return (
      APERTURE_STOPS.find((s) => s.value === apertureValue) ||
      APERTURE_STOPS[2] // default f/2.8
    );
  }, [apertureValue]);

  // Context loss listeners
  useEffect(() => {
    const unsubLost = eventBus.on("WEBGL_CONTEXT_LOST", () => {
      isContextLost.current = true;
    });
    const unsubRestored = eventBus.on("WEBGL_CONTEXT_RESTORED", () => {
      isContextLost.current = false;
    });
    return () => {
      unsubLost();
      unsubRestored();
    };
  }, []);

  // Create post-processing pipeline with guaranteed resource disposal
  const composerRef = useRef<{ composer: EffectComposer; bokehPass: BokehPass } | null>(null);

  useEffect(() => {
    const comp = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    const bp = new BokehPass(scene, camera, {
      focus: focusDistance,
      aperture: currentStop.blur,
      maxblur: 0.028,
      width: Math.max(1, size.width),
      height: Math.max(1, size.height),
    });
    comp.addPass(bp);

    composerRef.current = { composer: comp, bokehPass: bp };

    return () => {
      // Memory Leak Fix: Explicit disposal of composer, render targets and passes
      try {
        if (bp.renderTargetDepth) {
          bp.renderTargetDepth.dispose();
        }
        if (comp.renderTarget1) {
          comp.renderTarget1.dispose();
        }
        if (comp.renderTarget2) {
          comp.renderTarget2.dispose();
        }
      } catch (err) {
        console.warn("[BokehEffectComposer] Cleanup warning:", err);
      }
      composerRef.current = null;
      gl.autoClear = true; // Ensure standard clearing is restored
    };
  }, [gl, scene, camera]);

  // Update sizes on viewport resize
  useEffect(() => {
    if (!composerRef.current) return;
    const { composer, bokehPass } = composerRef.current;
    composer.setSize(Math.max(1, size.width), Math.max(1, size.height));
    if (bokehPass.uniforms && bokehPass.uniforms["aspect"]) {
      bokehPass.uniforms["aspect"].value = size.width / Math.max(1, size.height);
    }
  }, [size]);

  // Update aperture & focal depth in real-time
  useEffect(() => {
    if (!composerRef.current) return;
    const { bokehPass } = composerRef.current;
    if (bokehPass && bokehPass.uniforms) {
      if (bokehPass.uniforms["aperture"]) {
        bokehPass.uniforms["aperture"].value = enabled ? currentStop.blur : 0.00001;
      }
      if (bokehPass.uniforms["focus"]) {
        bokehPass.uniforms["focus"].value = focusDistance;
      }
      if (bokehPass.uniforms["maxblur"]) {
        bokehPass.uniforms["maxblur"].value = enabled && currentStop.value <= 2.8 ? 0.03 : 0.015;
      }
    }
  }, [currentStop, focusDistance, enabled]);

  // Clamped render loop takeover
  useFrame((_, delta) => {
    if (isContextLost.current || !composerRef.current) return;

    // Delta clamping to prevent post-processing glitches after tab switch
    const safeDelta = Math.min(Math.max(delta, 0.001), 0.1);

    if (enabled && currentStop.value < 16) {
      gl.autoClear = false;
      composerRef.current.composer.render(safeDelta);
    } else {
      gl.autoClear = true;
      gl.render(scene, camera);
    }
  }, 1);

  return null;
}

export default BokehEffectComposer;
