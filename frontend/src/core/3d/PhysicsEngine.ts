/**
 * PhysicsEngine - Zero-Gravity Physics, Forces & Clamped Simulation Ticks
 * Decoupled physics calculation logic for AntigravityGallery and 3D Studio.
 * Clamps requestAnimationFrame delta time (Math.min(delta, 0.1)) to prevent physics explosions on tab switch.
 */

import * as THREE from "three";

export interface Vector3Like {
  x: number;
  y: number;
  z: number;
}

export interface MagneticClusterParams {
  currentPos: Vector3Like;
  currentVel: Vector3Like;
  isTargetMatch: boolean;
  activeMood: string;
  activeCategory: string;
}

export interface PointerRepulsionParams {
  currentPos: Vector3Like;
  pointerPos: { x: number; y: number };
  repulsionRadius?: number;
  maxForce?: number;
}

export class PhysicsEngine {
  /**
   * Clamps delta time to prevent physics simulation instability or off-screen explosion when tabs switch.
   */
  public static clampDelta(delta: number, maxDelta: number = 0.1): number {
    return Math.min(Math.max(delta, 0.001), maxDelta);
  }

  /**
   * Calculates magnetic clustering spring and tangential forces.
   * Pulls matching photos towards view center while repelling non-matches to periphery.
   */
  public static calculateMagneticForce(params: MagneticClusterParams): Vector3Like | null {
    const { currentPos, currentVel, isTargetMatch, activeMood, activeCategory } = params;

    if (activeMood === "All" && activeCategory === "All") {
      return null;
    }

    if (isTargetMatch) {
      // Attractive critically damped harmonic spring pulling towards center
      const springK = 0.055;
      const damping = 0.08;
      const fx = -springK * currentPos.x - damping * currentVel.x;
      const fy = -springK * currentPos.y - damping * currentVel.y;
      const fz = -springK * (currentPos.z - 0.2) - damping * currentVel.z;

      // Subtle celestial tangential swirl around z-axis
      const swirl = 0.012;
      const tx = -currentPos.y * swirl;
      const ty = currentPos.x * swirl;

      return { x: fx + tx, y: fy + ty, z: fz };
    } else {
      // Gentle centrifugal repulsive force pushing non-matching items to periphery
      const signX = currentPos.x !== 0 ? Math.sign(currentPos.x) : 1;
      const signY = currentPos.y !== 0 ? Math.sign(currentPos.y) : 1;
      return {
        x: signX * 0.025,
        y: signY * 0.025,
        z: -0.015,
      };
    }
  }

  /**
   * Calculates dynamic pointer repulsion impulses and torque when cursor approaches a frame.
   */
  public static calculatePointerRepulsion(params: PointerRepulsionParams): {
    impulse: Vector3Like;
    torque: Vector3Like;
  } | null {
    const { currentPos, pointerPos, repulsionRadius = 2.4, maxForce = 0.065 } = params;

    const dx = currentPos.x - pointerPos.x;
    const dy = currentPos.y - pointerPos.y;
    const distSq = dx * dx + dy * dy;
    const radiusSq = repulsionRadius * repulsionRadius;

    if (distSq >= radiusSq || distSq < 0.0025) {
      return null;
    }

    const dist = Math.sqrt(distSq);
    const normalizedStrength = (1 - dist / repulsionRadius) * maxForce;
    const dirX = dx / dist;
    const dirY = dy / dist;

    return {
      impulse: {
        x: dirX * normalizedStrength,
        y: dirY * normalizedStrength,
        z: (Math.random() - 0.5) * normalizedStrength * 0.4,
      },
      torque: {
        x: dy * normalizedStrength * 0.1,
        y: -dx * normalizedStrength * 0.1,
        z: (Math.random() - 0.5) * normalizedStrength * 0.05,
      },
    };
  }
}

export default PhysicsEngine;

