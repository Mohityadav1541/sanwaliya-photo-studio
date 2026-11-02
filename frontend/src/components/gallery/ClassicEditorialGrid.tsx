import React from "react";
import { GalleryPhotoItem, PORTFOLIO_GALLERY_ITEMS } from "@/components/3d/AntigravityGallery";
import { MapPin, Calendar, ArrowUpRight, Sparkles, Bookmark, Check } from "lucide-react";

interface ClassicEditorialGridProps {
  activeCategory: string;
  onSelectPhoto: (photo: GalleryPhotoItem) => void;
  savedPhotos?: GalleryPhotoItem[];
  onTogglePin?: (photo: GalleryPhotoItem) => void;
}

export function ClassicEditorialGrid({
  activeCategory,
  onSelectPhoto,
  savedPhotos = [],
  onTogglePin,
}: ClassicEditorialGridProps) {
  const filteredItems = PORTFOLIO_GALLERY_ITEMS.filter(
    (item) => activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const isPhotoPinned = (id: string) => savedPhotos.some((p) => p.id === id);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in font-sans">
      {/* Header bar of 2D Grid */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#181817]/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D9381E] block mb-2">
            Editorial Masonry &middot; Archival Print View
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#181817] font-normal tracking-tight">
            Curated Atelier Collection
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#6E6A63] font-sans max-w-md font-light">
          Browsing {filteredItems.length} archival plates under &ldquo;{activeCategory}&rdquo;. Select any plate to inspect optical sharpness or pin to your Client Light Table.
        </p>
      </div>

      {/* Masonry / Grid Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, index) => {
          const isTall = index % 3 === 0;
          const pinned = isPhotoPinned(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectPhoto(item)}
              className="group relative cursor-pointer rounded-2xl bg-white border border-[#181817]/10 hover:border-[#C5A880] overflow-hidden transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Outer Museum Passe-partout Padding */}
              <div className="p-4 sm:p-5 bg-[#FAF8F5]">
                <div
                  className={`relative overflow-hidden rounded-xl border border-[#181817]/10 bg-white p-2.5 shadow-inner ${
                    isTall ? "aspect-[3/4]" : "aspect-[4/3]"
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#181817]/10 text-[10px] font-mono text-[#181817] uppercase tracking-wider">
                    {item.category}
                  </div>

                  {/* Pin to Light Table Quick Action */}
                  {onTogglePin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(item);
                      }}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                        pinned
                          ? "bg-[#D9381E] text-white"
                          : "bg-white/90 text-[#181817] hover:bg-[#181817] hover:text-white"
                      }`}
                      aria-label={pinned ? "Remove from light table" : "Pin to light table"}
                    >
                      {pinned ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {/* Hover Inspect Cue */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[#181817] text-[#FAF8F5] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight className="w-4 h-4 text-[#C5A880]" />
                  </div>
                </div>
              </div>

              {/* Editorial Description Plaque */}
              <div className="px-5 pb-5 pt-3 space-y-2 bg-white">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6A63]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#D9381E]" />
                    {item.location}
                  </span>
                  <span>{item.year}</span>
                </div>

                <h4 className="font-serif text-xl text-[#181817] font-normal group-hover:text-[#D9381E] transition-colors">
                  {item.title}
                </h4>

                <p className="font-sans text-xs text-[#6E6A63] line-clamp-2 font-light leading-relaxed">
                  {item.story}
                </p>

                <div className="pt-2 border-t border-[#181817]/5 flex items-center justify-between text-[10px] font-mono text-[#6E6A63]">
                  <span>{item.exif.lens}</span>
                  <span className="text-[#D9381E] font-semibold">{item.exif.aperture}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClassicEditorialGrid;
