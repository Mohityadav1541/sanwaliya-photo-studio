/**
 * PortfolioService - Dedicated Data Layer (Single Responsibility Principle)
 * Manages photo queries, caching, Zod validation, and mock fallback.
 * Strictly decoupled from WebGL/3D rendering logic.
 */

import api from "./api";
import { GalleryPhotoItem, PORTFOLIO_GALLERY_ITEMS } from "@/components/3d/AntigravityGallery";
import { validatePhotoCollection } from "@/schemas/photoSchema";

export class PortfolioService {
  private static cache: GalleryPhotoItem[] = [];
  private static cacheTimestamp = 0;
  private static CACHE_TTL = 60 * 1000; // 1 minute in-memory cache

  /**
   * Fetches all published portfolio photos, validating records against Zod schema.
   */
  public static async getPortfolioItems(forceRefresh = false): Promise<GalleryPhotoItem[]> {
    const now = Date.now();
    if (!forceRefresh && this.cache.length > 0 && now - this.cacheTimestamp < this.CACHE_TTL) {
      return this.cache;
    }

    try {
      const response = await api.get("/media?limit=50");
      if (response.data && response.data.items && response.data.items.length > 0) {
        // Transform backend models to GalleryPhotoItem format
        const transformed = response.data.items.map((item: any, index: number) => ({
          id: item.id || `remote-${index}`,
          url: item.url,
          rawUrl: item.rawUrl || item.url,
          title: item.title,
          category: item.category || "Weddings",
          dominantMood: item.dominantMood || "Amber",
          location: item.location || "Rajasthan, India",
          year: item.year || "2024",
          story: item.description || item.story || "Handcrafted wedding composition.",
          exif: {
            camera: item.exifCamera || "Sony A7 IV",
            lens: item.exifLens || "FE 50mm f/1.2 GM",
            aperture: item.exifAperture || "f/1.4",
            iso: item.exifIso || "ISO 100",
            shutter: item.exifShutter || "1/1600s",
          },
          initialPos: [
            ((index % 3) - 1) * 2.2,
            1.2 + Math.floor(index / 3) * 0.4,
            ((index % 2) - 0.5) * 0.6,
          ],
          initialRot: [0, (index % 2 === 0 ? 1 : -1) * 0.1, 0],
          width: 1.8,
          height: 2.4,
        }));

        const validated = validatePhotoCollection(transformed);
        if (validated.length > 0) {
          this.cache = validated as GalleryPhotoItem[];
          this.cacheTimestamp = now;
          return this.cache;
        }
      }
    } catch (err) {
      console.warn("[PortfolioService] Backend unavailable, using local Daylight Atelier collection:", err);
    }

    // High-quality static atelier fallback
    this.cache = PORTFOLIO_GALLERY_ITEMS;
    this.cacheTimestamp = now;
    return this.cache;
  }

  /**
   * Optimistically deletes a photo from cache and backend.
   */
  public static async deletePhoto(id: string): Promise<void> {
    await api.delete(`/media/admin/${id}`);
    this.cache = this.cache.filter((item) => item.id !== id);
  }
}

export default PortfolioService;

