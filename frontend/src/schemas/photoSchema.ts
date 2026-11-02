/**
 * Zod Schema Validation for Photo Entities
 * Enforces runtime contract validation so corrupted API or state data cannot crash WebGL render loops.
 */

import { z } from "zod";

export const ExifTelemetrySchema = z.object({
  camera: z.string().default("Sony A7 IV"),
  lens: z.string().default("FE 50mm f/1.2 GM"),
  aperture: z.string().default("f/1.4"),
  iso: z.string().default("ISO 100"),
  shutter: z.string().default("1/1600s"),
});

export const FrameConfigSchema = z.object({
  finish: z.enum(["champagne", "rawOak", "espresso", "floatingGlass"]).default("champagne"),
  matteBorder: z.number().min(0.01).max(0.3).default(0.09),
  scale: z.number().min(0.5).max(3.0).default(1.0),
  depth: z.number().min(0.02).max(0.5).default(0.1),
  physicsWeight: z.number().min(0.1).max(10.0).default(1.2),
});

export const GalleryPhotoItemSchema = z.object({
  id: z.string().min(1),
  url: z.string().min(1),
  rawUrl: z.string().optional(),
  placeholderUrl: z.string().optional(),
  title: z.string().min(1).max(120),
  category: z.string().min(1),
  dominantMood: z.enum(["All", "Amber", "Crimson", "Emerald", "Monochrome"]).default("All"),
  location: z.string().default("Rajasthan, India"),
  year: z.string().default("2024"),
  story: z.string().default(""),
  exif: ExifTelemetrySchema,
  initialPos: z.tuple([z.number(), z.number(), z.number()]).default([0, 1.5, 0]),
  initialRot: z.tuple([z.number(), z.number(), z.number()]).default([0, 0, 0]),
  width: z.number().positive().default(1.8),
  height: z.number().positive().default(2.4),
  frameConfig: FrameConfigSchema.optional(),
});

export type ValidatedGalleryPhotoItem = z.infer<typeof GalleryPhotoItemSchema>;
export type ValidatedExif = z.infer<typeof ExifTelemetrySchema>;
export type ValidatedFrameConfig = z.infer<typeof FrameConfigSchema>;

/**
 * Validates and safely normalizes a photo item, applying defaults if missing optional properties.
 */
export function validatePhotoItem(rawItem: unknown): ValidatedGalleryPhotoItem | null {
  const result = GalleryPhotoItemSchema.safeParse(rawItem);
  if (!result.success) {
    console.warn("[SchemaValidator] Photo item failed validation:", result.error.format());
    return null;
  }
  return result.data;
}

/**
 * Validates an array of photos, filtering out any invalid records.
 */
export function validatePhotoCollection(rawItems: unknown[]): ValidatedGalleryPhotoItem[] {
  return rawItems
    .map(validatePhotoItem)
    .filter((item): item is ValidatedGalleryPhotoItem => item !== null);
}

