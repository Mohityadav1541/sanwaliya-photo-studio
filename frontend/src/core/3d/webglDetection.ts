/**
 * WebGL Detection & Progressive Enhancement Service
 * Detects GPU acceleration, WebGL2 support, and memory constraints.
 * Enables graceful automatic fallback to the 2D Editorial Classic Grid on unsupported or disabled devices.
 */

import { eventBus } from "@/core/eventBus";

export interface WebGLDiagnosticResult {
  isSupported: boolean;
  isHardwareAccelerated: boolean;
  rendererString: string;
  vendorString: string;
  maxTextureSize: number;
  reason?: string;
}

export class WebGLDetector {
  private static cachedResult: WebGLDiagnosticResult | null = null;

  public static diagnose(): WebGLDiagnosticResult {
    if (this.cachedResult) return this.cachedResult;

    if (typeof window === "undefined" || !window.document) {
      return {
        isSupported: false,
        isHardwareAccelerated: false,
        rendererString: "SSR",
        vendorString: "Server",
        maxTextureSize: 0,
        reason: "Server-side rendering environment",
      };
    }

    try {
      const canvas = document.createElement("canvas");
      // Try WebGL2 first, then WebGL1
      const gl = (canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

      if (!gl) {
        this.cachedResult = {
          isSupported: false,
          isHardwareAccelerated: false,
          rendererString: "None",
          vendorString: "None",
          maxTextureSize: 0,
          reason: "WebGL context creation failed (GPU disabled or unsupported)",
        };
        return this.cachedResult;
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const vendorString = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || ""
        : gl.getParameter(gl.VENDOR) || "";
      const rendererString = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ""
        : gl.getParameter(gl.RENDERER) || "";
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;

      // Software rendering detection (SwiftShader, llvmpipe, software rasterizer)
      const isSoftware =
        /swiftshader|llvmpipe|software rasterizer|mesa|virtualbox/i.test(rendererString) ||
        /google/i.test(vendorString);

      const isHardwareAccelerated = !isSoftware && maxTextureSize >= 4096;

      this.cachedResult = {
        isSupported: true,
        isHardwareAccelerated,
        rendererString,
        vendorString,
        maxTextureSize,
      };

      return this.cachedResult;
    } catch (err: any) {
      this.cachedResult = {
        isSupported: false,
        isHardwareAccelerated: false,
        rendererString: "Error",
        vendorString: "Error",
        maxTextureSize: 0,
        reason: err.message || "Exception while probing WebGL",
      };
      return this.cachedResult;
    }
  }

  public static isWebGLSupported(): boolean {
    return this.diagnose().isSupported;
  }

  public static checkAndTriggerFallbackIfNeeded(): boolean {
    const diag = this.diagnose();
    if (!diag.isSupported) {
      console.warn("[WebGLDetector] WebGL not supported:", diag.reason);
      eventBus.emit("WEBGL_FALLBACK_TRIGGERED", {
        reason: diag.reason || "Hardware acceleration unavailable",
      });
      return true;
    }
    return false;
  }
}

export default WebGLDetector;

