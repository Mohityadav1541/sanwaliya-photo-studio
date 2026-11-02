import React, { useState } from "react";
import { X, Trash2, ArrowRight, Sparkles, Printer, Layers, Maximize, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryPhotoItem } from "@/components/3d/AntigravityGallery";

interface ClientLightTableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPhotos: GalleryPhotoItem[];
  onRemovePhoto: (id: string) => void;
  onRequestQuote: (photos: GalleryPhotoItem[]) => void;
}

export type PrintSize = '16x20"' | '24x36"' | '40x60"';
export type FrameFinish = "champagne" | "rawOak" | "espresso";

export function ClientLightTableDrawer({
  isOpen,
  onClose,
  savedPhotos,
  onRemovePhoto,
  onRequestQuote,
}: ClientLightTableDrawerProps) {
  const [selectedSize, setSelectedSize] = useState<PrintSize>('24x36"');
  const [selectedFinish, setSelectedFinish] = useState<FrameFinish>("champagne");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-Up Frosted Archival Glass Light Table */}
      <div className="w-full max-h-[85vh] overflow-y-auto atelier-glass rounded-t-3xl shadow-2xl border-t border-[#181817]/15 p-6 sm:p-8 text-[#181817]">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#181817]/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181817]/5 border border-[#181817]/10 text-[#D9381E] text-[10px] font-mono uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" />
                <span>Virtual Client Light Table &middot; Contact Sheet</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#181817] font-normal">
                Curated Print &amp; Wedding Archive
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#6E6A63]">
                {savedPhotos.length} {savedPhotos.length === 1 ? "Frame" : "Frames"} Pinned
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#181817]/5 hover:bg-[#181817]/10 flex items-center justify-center text-[#181817] transition-colors"
                aria-label="Close Light Table"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* If no photos pinned yet */}
          {savedPhotos.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Printer className="w-10 h-10 text-[#C5A880] mx-auto opacity-70" />
              <h4 className="font-serif text-xl text-[#181817]">Your Light Table is Empty</h4>
              <p className="text-xs text-[#6E6A63] max-w-md mx-auto font-light leading-relaxed">
                Click the &ldquo;Pin to Light Table&rdquo; icon on any floating 3D photo or in the detailed inspection view to assemble your personalized collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Pinned Photo Frames on Illuminated Lightbox */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/70 border border-[#181817]/10 shadow-inner">
                  {savedPhotos.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl overflow-hidden bg-white shadow-md border border-[#181817]/10 p-2 flex flex-col justify-between"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#EFECE6]">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          onClick={() => onRemovePhoto(item.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-red-600 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove from light table"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="pt-2">
                        <h5 className="font-serif text-xs font-medium text-[#181817] truncate">
                          {item.title}
                        </h5>
                        <p className="text-[10px] font-mono text-[#6E6A63]">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Print Size & Finish Calibrator */}
              <div className="space-y-5 p-6 rounded-2xl bg-white/80 border border-[#181817]/10 shadow-sm text-xs font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9381E]">
                    Museum Archival Specification
                  </span>
                  <h4 className="font-serif text-lg text-[#181817]">Print &amp; Framing Configurator</h4>
                </div>

                {/* Print Size Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#6E6A63] block">
                    Museum Scale
                  </label>
                  <div className="grid grid-cols-3 gap-2 font-mono">
                    {(['16x20"', '24x36"', '40x60"'] as PrintSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-2 rounded-lg text-xs transition-all border ${
                          selectedSize === size
                            ? "bg-[#181817] text-[#FAF8F5] border-[#181817] font-bold shadow-sm"
                            : "bg-white text-[#181817] border-[#181817]/15 hover:border-[#181817]/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Finish Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#6E6A63] block">
                    Frame Moulding Finish
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "champagne", label: "Champagne", color: "bg-[#C5A880]" },
                      { id: "rawOak", label: "Raw Oak", color: "bg-[#D4BE9D]" },
                      { id: "espresso", label: "Espresso", color: "bg-[#1E1D1B]" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFinish(f.id as FrameFinish)}
                        className={`flex items-center gap-1.5 p-2 rounded-lg text-[11px] transition-all border ${
                          selectedFinish === f.id
                            ? "bg-[#181817] text-[#FAF8F5] border-[#181817] font-medium"
                            : "bg-white text-[#181817] border-[#181817]/15"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${f.color}`} />
                        <span className="truncate">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technical Paper Specs */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#181817]/10 space-y-1 text-[11px] text-[#6E6A63]">
                  <p className="font-medium text-[#181817]">Archival Cotton Rag Paper 310gsm</p>
                  <p>Acid-free, 100% cotton base with museum UV-protective anti-reflective glass.</p>
                </div>

                {/* Quote Action */}
                <Button
                  onClick={() => {
                    onClose();
                    onRequestQuote(savedPhotos);
                  }}
                  className="w-full bg-[#181817] text-[#FAF8F5] hover:bg-[#282826] text-xs uppercase tracking-widest font-semibold h-12 shadow-lg gap-2"
                >
                  <span>Request Quote For {savedPhotos.length} Works</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientLightTableDrawer;

