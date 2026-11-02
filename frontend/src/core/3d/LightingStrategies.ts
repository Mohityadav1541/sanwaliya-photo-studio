/**
 * LightingStrategies - Strategy Pattern for Studio Lighting Environments
 * Decouples lighting configurations and shader settings from the rendering components.
 */

export type LightingPresetId = "goldenHour" | "studioWhite" | "noir" | "darkroom";

export interface LightingEnvironmentConfig {
  id: LightingPresetId;
  name: string;
  ambientColor: string;
  ambientIntensity: number;
  keyLightColor: string;
  keyLightIntensity: number;
  cursorLightColor: string;
  cursorLightIntensity: number;
  cursorLightDistance: number;
  cursorLightAngle: number;
  penumbra: number;
}

export const LIGHTING_STRATEGIES: Record<LightingPresetId, LightingEnvironmentConfig> = {
  goldenHour: {
    id: "goldenHour",
    name: "Golden Hour",
    ambientColor: "#FAF8F5",
    ambientIntensity: 0.9,
    keyLightColor: "#FFE6C2",
    keyLightIntensity: 3.2,
    cursorLightColor: "#FFC87A",
    cursorLightIntensity: 4.5,
    cursorLightDistance: 12,
    cursorLightAngle: Math.PI / 4,
    penumbra: 0.65,
  },
  studioWhite: {
    id: "studioWhite",
    name: "Studio 5500K Daylight",
    ambientColor: "#FAF8F5",
    ambientIntensity: 1.1,
    keyLightColor: "#FFFFFF",
    keyLightIntensity: 2.8,
    cursorLightColor: "#F4F7FF",
    cursorLightIntensity: 3.8,
    cursorLightDistance: 14,
    cursorLightAngle: Math.PI / 3.8,
    penumbra: 0.5,
  },
  noir: {
    id: "noir",
    name: "Noir Monochromatic",
    ambientColor: "#2A2A2A",
    ambientIntensity: 0.45,
    keyLightColor: "#FFFFFF",
    keyLightIntensity: 3.8,
    cursorLightColor: "#EAEAEA",
    cursorLightIntensity: 5.5,
    cursorLightDistance: 10,
    cursorLightAngle: Math.PI / 4.5,
    penumbra: 0.35,
  },
  darkroom: {
    id: "darkroom",
    name: "Crimson Safe-Light",
    ambientColor: "#300000",
    ambientIntensity: 0.3,
    keyLightColor: "#FF202B",
    keyLightIntensity: 4.2,
    cursorLightColor: "#FF1A24",
    cursorLightIntensity: 6.0,
    cursorLightDistance: 9,
    cursorLightAngle: Math.PI / 3.5,
    penumbra: 0.7,
  },
};

export class LightingStrategyManager {
  public static getConfig(presetId: LightingPresetId = "goldenHour"): LightingEnvironmentConfig {
    return LIGHTING_STRATEGIES[presetId] || LIGHTING_STRATEGIES.goldenHour;
  }
}

export default LightingStrategyManager;

