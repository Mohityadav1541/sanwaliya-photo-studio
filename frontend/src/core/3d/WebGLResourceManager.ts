/**
 * WebGLResourceManager - Lifecycle & GPU Memory Leak Eradication
 * Ensures all Three.js BufferGeometries, Materials, Textures, and RenderTargets are explicitly disposed.
 * Handles webglcontextlost and webglcontextrestored events gracefully.
 */

import * as THREE from "three";
import { eventBus } from "@/core/eventBus";

export class WebGLResourceManager {
  private static registeredGeometries = new Set<THREE.BufferGeometry>();
  private static registeredMaterials = new Set<THREE.Material>();
  private static registeredTextures = new Set<THREE.Texture>();
  private static registeredRenderTargets = new Set<THREE.WebGLRenderTarget>();

  /**
   * Register a geometry to track for disposal.
   */
  public static registerGeometry(geo: THREE.BufferGeometry): THREE.BufferGeometry {
    this.registeredGeometries.add(geo);
    return geo;
  }

  /**
   * Register a material to track for disposal.
   */
  public static registerMaterial<T extends THREE.Material>(mat: T): T {
    this.registeredMaterials.add(mat);
    return mat;
  }

  /**
   * Register a texture to track for disposal.
   */
  public static registerTexture(tex: THREE.Texture): THREE.Texture {
    this.registeredTextures.add(tex);
    return tex;
  }

  /**
   * Register a render target to track for disposal.
   */
  public static registerRenderTarget(target: THREE.WebGLRenderTarget): THREE.WebGLRenderTarget {
    this.registeredRenderTargets.add(target);
    return target;
  }

  /**
   * Safely disposes of a texture.
   */
  public static disposeTexture(texture?: THREE.Texture | null): void {
    if (!texture) return;
    try {
      texture.dispose();
      this.registeredTextures.delete(texture);
    } catch (e) {
      console.warn("[WebGLResourceManager] Failed to dispose texture:", e);
    }
  }

  /**
   * Safely disposes of a material and all associated texture maps.
   */
  public static disposeMaterial(material?: THREE.Material | null): void {
    if (!material) return;
    try {
      // Traverse standard texture slots
      const mat = material as any;
      const textureSlots = [
        "map",
        "alphaMap",
        "aoMap",
        "bumpMap",
        "displacementMap",
        "emissiveMap",
        "envMap",
        "lightMap",
        "metalnessMap",
        "normalMap",
        "roughnessMap",
        "clearcoatMap",
        "clearcoatNormalMap",
        "clearcoatRoughnessMap",
        "transmissionMap",
        "thicknessMap",
      ];

      for (const slot of textureSlots) {
        if (mat[slot] && mat[slot] instanceof THREE.Texture) {
          mat[slot].dispose();
          this.registeredTextures.delete(mat[slot]);
        }
      }

      material.dispose();
      this.registeredMaterials.delete(material);
    } catch (e) {
      console.warn("[WebGLResourceManager] Failed to dispose material:", e);
    }
  }

  /**
   * Safely disposes of a BufferGeometry.
   */
  public static disposeGeometry(geometry?: THREE.BufferGeometry | null): void {
    if (!geometry) return;
    try {
      geometry.dispose();
      this.registeredGeometries.delete(geometry);
    } catch (e) {
      console.warn("[WebGLResourceManager] Failed to dispose geometry:", e);
    }
  }

  /**
   * Recursively traverses an Object3D / Group and disposes of all geometries, materials, and textures.
   */
  public static disposeHierarchy(object?: THREE.Object3D | null): void {
    if (!object) return;

    object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        if (mesh.geometry) {
          this.disposeGeometry(mesh.geometry);
        }

        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => this.disposeMaterial(mat));
          } else {
            this.disposeMaterial(mesh.material);
          }
        }
      }
    });

    if (object.parent) {
      object.parent.remove(object);
    }
  }

  /**
   * Binds WebGL context loss and restoration listeners to a canvas or WebGLRenderer.
   */
  public static attachContextListeners(
    domElement: HTMLCanvasElement,
    onRestored?: () => void
  ): () => void {
    const handleContextLost = (event: Event) => {
      event.preventDefault(); // Required by WebGL spec to allow context restoration!
      console.warn("[WebGLResourceManager] WebGL context lost! Pausing render loop...");
      eventBus.emit("WEBGL_CONTEXT_LOST", undefined);
    };

    const handleContextRestored = () => {
      console.info("[WebGLResourceManager] WebGL context restored! Re-initializing shaders & textures...");
      eventBus.emit("WEBGL_CONTEXT_RESTORED", undefined);
      if (onRestored) onRestored();
    };

    domElement.addEventListener("webglcontextlost", handleContextLost, false);
    domElement.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      domElement.removeEventListener("webglcontextlost", handleContextLost);
      domElement.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }

  /**
   * Master cleanup of all tracked resources.
   */
  public static purgeAll(): void {
    this.registeredGeometries.forEach((g) => {
      try {
        g.dispose();
      } catch {}
    });
    this.registeredMaterials.forEach((m) => {
      try {
        m.dispose();
      } catch {}
    });
    this.registeredTextures.forEach((t) => {
      try {
        t.dispose();
      } catch {}
    });
    this.registeredRenderTargets.forEach((rt) => {
      try {
        rt.dispose();
      } catch {}
    });

    this.registeredGeometries.clear();
    this.registeredMaterials.clear();
    this.registeredTextures.clear();
    this.registeredRenderTargets.clear();
  }
}

export default WebGLResourceManager;

