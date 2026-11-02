/**
 * FrameMaterialFactory - Flyweight & Factory Pattern (OCP / Draw Call Optimization)
 * Produces and caches shared Three.js materials for frame mouldings, passe-partout mattes, and glass panes.
 * Allows adding new finishes without altering core mesh rendering logic.
 */

import * as THREE from "three";
import { WebGLResourceManager } from "./WebGLResourceManager";

export type FrameFinishType = "champagne" | "rawOak" | "espresso" | "floatingGlass";

export interface FrameMaterialOptions {
  finish: FrameFinishType;
  isHovered?: boolean;
  isSelected?: boolean;
}

export class FrameMaterialFactory {
  private static cache = new Map<string, THREE.Material>();

  // Shared passe-partout matte material (Flyweight)
  private static sharedMatteMaterial: THREE.MeshPhysicalMaterial | null = null;
  // Shared outer glass pane material (Flyweight)
  private static sharedGlassMaterial: THREE.MeshPhysicalMaterial | null = null;
  // Shared Kraft back material
  private static sharedKraftMaterial: THREE.MeshStandardMaterial | null = null;

  /**
   * Get or create shared museum white passe-partout matte.
   */
  public static getMatteMaterial(): THREE.MeshPhysicalMaterial {
    if (!this.sharedMatteMaterial) {
      this.sharedMatteMaterial = new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        roughness: 0.95,
        metalness: 0.02,
      });
      WebGLResourceManager.registerMaterial(this.sharedMatteMaterial);
    }
    return this.sharedMatteMaterial;
  }

  /**
   * Get or create shared optical refraction glass material.
   */
  public static getGlassMaterial(): THREE.MeshPhysicalMaterial {
    if (!this.sharedGlassMaterial) {
      this.sharedGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        transmission: 0.9,
        ior: 1.5,
        roughness: 0.08,
        reflectivity: 0.85,
        transparent: true,
        opacity: 0.85,
      });
      WebGLResourceManager.registerMaterial(this.sharedGlassMaterial);
    }
    return this.sharedGlassMaterial;
  }

  /**
   * Get or create shared archival Kraft back material.
   */
  public static getKraftBackMaterial(): THREE.MeshStandardMaterial {
    if (!this.sharedKraftMaterial) {
      this.sharedKraftMaterial = new THREE.MeshStandardMaterial({
        color: "#E5E1D8",
        roughness: 0.9,
        metalness: 0.0,
      });
      WebGLResourceManager.registerMaterial(this.sharedKraftMaterial);
    }
    return this.sharedKraftMaterial;
  }

  /**
   * Get or create frame moulding material according to finish and interaction state.
   */
  public static getMouldingMaterial(options: FrameMaterialOptions): THREE.Material {
    const { finish, isHovered = false, isSelected = false } = options;
    const cacheKey = `${finish}_h${isHovered ? 1 : 0}_s${isSelected ? 1 : 0}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let material: THREE.Material;

    if (isSelected) {
      // Focus lock: classic Rangefinder Vermilion accent
      material = new THREE.MeshPhysicalMaterial({
        color: "#D9381E",
        roughness: 0.25,
        metalness: 0.5,
        clearcoat: 0.4,
      });
    } else if (isHovered) {
      // Hover feedback: illuminated pure white highlight
      material = new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 0.6,
      });
    } else {
      switch (finish) {
        case "rawOak":
          material = new THREE.MeshStandardMaterial({
            color: "#D4BE9D",
            roughness: 0.8,
            metalness: 0.05,
          });
          break;
        case "espresso":
          material = new THREE.MeshStandardMaterial({
            color: "#1E1D1B",
            roughness: 0.45,
            metalness: 0.15,
          });
          break;
        case "floatingGlass":
          material = new THREE.MeshPhysicalMaterial({
            color: "#FFFFFF",
            transmission: 0.92,
            roughness: 0.05,
            ior: 1.52,
            transparent: true,
            opacity: 0.8,
          });
          break;
        case "champagne":
        default:
          material = new THREE.MeshPhysicalMaterial({
            color: "#C5A880",
            roughness: 0.35,
            metalness: 0.75,
            clearcoat: 0.3,
          });
          break;
      }
    }

    WebGLResourceManager.registerMaterial(material);
    this.cache.set(cacheKey, material);
    return material;
  }

  public static clearCache(): void {
    this.cache.forEach((mat) => WebGLResourceManager.disposeMaterial(mat));
    this.cache.clear();

    if (this.sharedMatteMaterial) {
      WebGLResourceManager.disposeMaterial(this.sharedMatteMaterial);
      this.sharedMatteMaterial = null;
    }
    if (this.sharedGlassMaterial) {
      WebGLResourceManager.disposeMaterial(this.sharedGlassMaterial);
      this.sharedGlassMaterial = null;
    }
    if (this.sharedKraftMaterial) {
      WebGLResourceManager.disposeMaterial(this.sharedKraftMaterial);
      this.sharedKraftMaterial = null;
    }
  }
}

export default FrameMaterialFactory;

