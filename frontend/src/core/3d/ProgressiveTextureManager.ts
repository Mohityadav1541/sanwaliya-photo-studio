/**
 * ProgressiveTextureManager - Asset Delivery Pipeline
 * Progressively loads lightweight placeholder textures into 3D frames first,
 * then lazily upgrades to high-resolution compressed textures.
 * Explicitly tracks and disposes old textures to eradicate memory leaks.
 */

import * as THREE from "three";
import { WebGLResourceManager } from "./WebGLResourceManager";

export interface ProgressiveTextureEntry {
  texture: THREE.Texture;
  isHighRes: boolean;
}

export class ProgressiveTextureManager {
  private static cache = new Map<string, ProgressiveTextureEntry>();
  private static loader = new THREE.TextureLoader();

  /**
   * Generates an analytical low-res procedural placeholder data texture (16x16 pixels)
   * while network textures stream in. Zero bandwidth required.
   */
  public static getProceduralPlaceholder(): THREE.DataTexture {
    const cacheKey = "__procedural_placeholder__";
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!.texture as THREE.DataTexture;
    }

    const width = 16;
    const height = 16;
    const size = width * height * 4;
    const data = new Uint8Array(size);

    // Warm Alabaster placeholder gradient (#FAF8F5 to #EFECE6)
    for (let i = 0; i < size; i += 4) {
      const row = Math.floor(i / 4 / width);
      const ratio = row / height;
      data[i] = Math.round(250 - ratio * 11);     // R
      data[i + 1] = Math.round(248 - ratio * 12); // G
      data[i + 2] = Math.round(245 - ratio * 15); // B
      data[i + 3] = 255;                          // A
    }

    const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    WebGLResourceManager.registerTexture(texture);
    this.cache.set(cacheKey, { texture, isHighRes: false });
    return texture;
  }

  /**
   * Progressively loads a texture, executing a callback when high-res is available.
   */
  public static loadProgressive(
    url: string,
    onLoaded: (texture: THREE.Texture, isHighRes: boolean) => void,
    onError?: (err: any) => void
  ): () => void {
    let isCancelled = false;

    // Check memory cache first
    if (this.cache.has(url)) {
      const entry = this.cache.get(url)!;
      onLoaded(entry.texture, entry.isHighRes);
      return () => {
        isCancelled = true;
      };
    }

    // Immediately return procedural placeholder so frame can render without black flash
    const placeholder = this.getProceduralPlaceholder();
    onLoaded(placeholder, false);

    // Asynchronously stream in the full photographic print
    this.loader.load(
      url,
      (loadedTexture) => {
        if (isCancelled) {
          WebGLResourceManager.disposeTexture(loadedTexture);
          return;
        }

        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.generateMipmaps = true;
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;

        WebGLResourceManager.registerTexture(loadedTexture);
        this.cache.set(url, { texture: loadedTexture, isHighRes: true });

        onLoaded(loadedTexture, true);
      },
      undefined,
      (err) => {
        if (!isCancelled && onError) {
          onError(err);
        }
      }
    );

    return () => {
      isCancelled = true;
    };
  }

  /**
   * Cleanly purge all progressive textures.
   */
  public static clear(): void {
    this.cache.forEach((entry) => WebGLResourceManager.disposeTexture(entry.texture));
    this.cache.clear();
  }
}

export default ProgressiveTextureManager;

