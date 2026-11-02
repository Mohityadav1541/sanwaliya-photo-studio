/**
 * EventBus - Type-safe Pub/Sub Event System
 * Decouples the 2D React DOM UI layer from the 3D WebGL Canvas (Dependency Inversion Principle).
 * The UI emits semantic events rather than directly mutating Three.js scene meshes.
 */

import { GalleryPhotoItem, MoodType } from "@/components/3d/AntigravityGallery";
import { LightingPreset } from "@/components/3d/StudioLightingRig";

export type EventMap = {
  // Photo selection & hover
  PHOTO_SELECTED: GalleryPhotoItem | null;
  PHOTO_HOVERED: GalleryPhotoItem | null;
  PHOTO_PIN_TOGGLED: GalleryPhotoItem;

  // Camera & Optics
  APERTURE_CHANGED: number;
  LAYOUT_MODE_TOGGLED: "3d" | "2d";

  // Gallery Filters
  CATEGORY_SELECTED: string;
  MOOD_SELECTED: MoodType;

  // Studio Lighting
  LIGHTING_PRESET_CHANGED: LightingPreset;

  // WebGL Lifecycle & Diagnostics
  WEBGL_CONTEXT_LOST: void;
  WEBGL_CONTEXT_RESTORED: void;
  WEBGL_FALLBACK_TRIGGERED: { reason: string };

  // Idle state for adaptive rendering
  RENDER_THROTTLE_CHANGED: boolean; // true = throttled/idle, false = active
};

type EventKey = keyof EventMap;
type EventHandler<T> = (data: T) => void;

class EventBusService {
  private listeners: { [K in EventKey]?: Array<EventHandler<any>> } = {};

  public on<K extends EventKey>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);

    // Return unsubscribe callback
    return () => this.off(event, handler);
  }

  public off<K extends EventKey>(event: K, handler: EventHandler<EventMap[K]>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter((h) => h !== handler);
  }

  public emit<K extends EventKey>(event: K, data: EventMap[K]): void {
    if (!this.listeners[event]) return;
    this.listeners[event]!.forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        console.error(`[EventBus] Error in handler for event "${event}":`, err);
      }
    });
  }

  public clear(): void {
    this.listeners = {};
  }
}

export const eventBus = new EventBusService();
export default eventBus;

