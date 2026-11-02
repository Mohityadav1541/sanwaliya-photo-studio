import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Grid, Box, Mail, Sun, Moon, Flame, Aperture } from "lucide-react";
import { ApertureFocusRing } from "@/components/3d/ApertureFocusRing";
import { LightingPreset } from "@/components/3d/StudioLightingRig";
import { MoodType } from "@/components/3d/AntigravityGallery";

interface GalleryHUDOverlayProps {
  layoutMode: "3d" | "2d";
  onToggleLayout: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  activeMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
  apertureValue: number;
  onApertureChange: (value: number) => void;
  lightingPreset: LightingPreset;
  onSelectLightingPreset: (preset: LightingPreset) => void;
  onOpenContact: () => void;
  photoCount?: number;
}

const CATEGORIES = ["All", "Weddings", "Pre-Wedding", "Candid", "Albums"];

const MOOD_SWATCHES: { id: MoodType; label: string; color: string; border: string }[] = [
  { id: "All", label: "All Moods", color: "bg-[#252525]", border: "border-[#383838]" },
  { id: "Amber", label: "Royal Amber", color: "bg-amber-600", border: "border-amber-400" },
  { id: "Crimson", label: "Heritage Crimson", color: "bg-rose-700", border: "border-rose-400" },
  { id: "Emerald", label: "Emerald Courtyard", color: "bg-emerald-700", border: "border-emerald-400" },
  { id: "Monochrome", label: "Monochrome Noir", color: "bg-neutral-800", border: "border-neutral-400" },
];

export function GalleryHUDOverlay({
  layoutMode,
  onToggleLayout,
  activeCategory,
  onSelectCategory,
  activeMood,
  onSelectMood,
  apertureValue,
  onApertureChange,
  lightingPreset,
  onSelectLightingPreset,
  onOpenContact,
  photoCount = 8,
}: GalleryHUDOverlayProps) {
  return (
    <div className="w-full flex flex-col gap-3 pointer-events-auto select-none">
      {/* Top Glassmorphic Navigation Bar */}
      <nav className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#181818]/85 border border-[#2e2e2e] backdrop-blur-xl shadow-2xl text-[#F5F3EF]">
        {/* Brand Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-[#121212] border border-[#333333] flex items-center justify-center text-xs font-serif text-[#D4AF37] group-hover:border-[#D4AF37] transition-colors shadow-inner">
            SP
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-normal tracking-wide text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors">
              Sanwaliya
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-mono">
              Roshan Lal Yadav
            </span>
          </div>
        </Link>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase transition-all duration-300 ${
                  isSelected
                    ? "bg-[#F5F3EF] text-[#121212] font-semibold shadow-md"
                    : "bg-[#1f1f1f]/80 text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-[#282828] border border-[#2f2f2f]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Action Controls: Toggle Gravity & Contact */}
        <div className="flex items-center gap-2">
          {/* Toggle Gravity Button */}
          <button
            onClick={onToggleLayout}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs uppercase tracking-widest font-sans font-medium transition-all duration-300 border ${
              layoutMode === "3d"
                ? "bg-[#D4AF37] text-[#121212] border-[#D4AF37] shadow-lg font-semibold"
                : "bg-[#222222] text-[#F5F3EF] border-[#383838] hover:bg-[#2b2b2b]"
            }`}
            title="Toggle between 3D Antigravity Floating Space and 2D Editorial Masonry Grid"
          >
            {layoutMode === "3d" ? (
              <>
                <Box className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3D Antigravity</span>
              </>
            ) : (
              <>
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">2D Masonry</span>
              </>
            )}
          </button>

          {/* Contact Commission Trigger */}
          <button
            onClick={onOpenContact}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs uppercase tracking-widest font-sans bg-[#F5F3EF] text-[#121212] hover:bg-white font-semibold transition-all shadow-md"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Commission</span>
          </button>
        </div>
      </nav>

      {/* Secondary Photographic Tools Ribbon: Lighting Moods + Magnetic Clustering + Aperture Ring */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#141414]/80 border border-[#262626] backdrop-blur-xl text-xs font-sans text-[#F5F3EF]">
        {/* Lighting Rig Presets Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] pl-1 hidden sm:inline">
            Key Light:
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: "goldenHour", label: "Golden Hour", icon: Flame },
              { id: "studioWhite", label: "Studio White", icon: Sun },
              { id: "noir", label: "Noir Monochrom", icon: Moon },
              { id: "darkroomRed", label: "Darkroom Red", icon: Sparkles },
            ].map((p) => {
              const isCurrent = lightingPreset === p.id;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectLightingPreset(p.id as LightingPreset)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-sans tracking-wide transition-all ${
                    isCurrent
                      ? "bg-[#252525] text-[#D4AF37] border border-[#D4AF37]/50 font-medium shadow-sm"
                      : "text-[#F5F3EF]/60 hover:text-[#F5F3EF] hover:bg-[#1c1c1c]"
                  }`}
                  title={`Switch studio key light to ${p.label}`}
                >
                  <Icon className="w-3 h-3 text-[#D4AF37]" />
                  <span className="hidden md:inline">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Magnetic Mood Swatches */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] hidden sm:inline">
            Magnetic Mood:
          </span>
          <div className="flex items-center gap-1.5">
            {MOOD_SWATCHES.map((swatch) => {
              const isSelected = activeMood === swatch.id;
              return (
                <button
                  key={swatch.id}
                  onClick={() => onSelectMood(swatch.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans transition-all border ${
                    isSelected
                      ? "bg-[#242424] text-[#F5F3EF] border-[#D4AF37] shadow-sm font-medium"
                      : "bg-[#181818] text-[#F5F3EF]/60 border-[#2a2a2a] hover:text-[#F5F3EF]"
                  }`}
                  title={`Cluster ${swatch.label} frames toward the center with magnetic gravity`}
                >
                  <span className={`w-2 h-2 rounded-full ${swatch.color}`} />
                  <span className="hidden sm:inline">{swatch.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Depth-of-Field Aperture Dial (f/1.4 to f/16) */}
        {layoutMode === "3d" && (
          <ApertureFocusRing
            currentValue={apertureValue}
            onChange={onApertureChange}
            className="w-full sm:w-auto justify-between"
          />
        )}
      </div>
    </div>
  );
}

export default GalleryHUDOverlay;
