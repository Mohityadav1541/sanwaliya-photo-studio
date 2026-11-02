import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  AntigravityGallery,
  GalleryPhotoItem,
  PORTFOLIO_GALLERY_ITEMS,
  MoodType,
} from "@/components/3d/AntigravityGallery";
import { GalleryHUDOverlay } from "@/components/gallery/GalleryHUDOverlay";
import { ClassicEditorialGrid } from "@/components/gallery/ClassicEditorialGrid";
import { PhotoLightboxModal } from "@/components/gallery/PhotoLightboxModal";
import { ContactModal } from "@/components/gallery/ContactModal";
import { EXIFViewfinderBar } from "@/components/gallery/EXIFViewfinderBar";
import { ClientLightTableDrawer } from "@/components/gallery/ClientLightTableDrawer";
import { LightingPreset } from "@/components/3d/StudioLightingRig";
import { WebGLDetector } from "@/core/3d/webglDetection";
import { PortfolioService } from "@/services/portfolioService";
import { eventBus } from "@/core/eventBus";
import { useToast } from "@/hooks/use-toast";

const Portfolio = () => {
  const [layoutMode, setLayoutMode] = useState<"3d" | "2d">("3d");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMood, setActiveMood] = useState<MoodType>("All");
  const [apertureValue, setApertureValue] = useState<number>(2.8);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>("goldenHour");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryPhotoItem[]>(PORTFOLIO_GALLERY_ITEMS);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [inquirySubject, setInquirySubject] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  // Client Light Table state (starts with 2 featured frames for immediate curation)
  const [savedLightTablePhotos, setSavedLightTablePhotos] = useState<GalleryPhotoItem[]>([
    PORTFOLIO_GALLERY_ITEMS[0],
    PORTFOLIO_GALLERY_ITEMS[1],
  ]);
  const [isLightTableOpen, setIsLightTableOpen] = useState(false);

  // Progressive Enhancement: WebGL Fallback Detection
  useEffect(() => {
    const diag = WebGLDetector.diagnose();
    if (!diag.isSupported) {
      setLayoutMode("2d");
      toast({
        title: "2D Classic View Active",
        description: "Hardware acceleration is restricted. Switched automatically to the Archival 2D Grid.",
      });
    }

    const unsubFallback = eventBus.on("WEBGL_FALLBACK_TRIGGERED", (info) => {
      setLayoutMode("2d");
      toast({
        title: "Switched to 2D Editorial View",
        description: info.reason,
      });
    });

    return () => {
      unsubFallback();
    };
  }, [toast]);

  // Load portfolio data from PortfolioService
  useEffect(() => {
    PortfolioService.getPortfolioItems().then((items) => {
      if (items && items.length > 0) {
        setGalleryItems(items);
      }
    });
  }, []);

  // EventBus Subscriptions (Decoupled 2D UI / 3D Canvas)
  useEffect(() => {
    const unsubPhotoSelected = eventBus.on("PHOTO_SELECTED", (photo) => {
      setSelectedPhoto(photo);
    });

    const unsubPinToggled = eventBus.on("PHOTO_PIN_TOGGLED", (photo) => {
      handleTogglePin(photo);
    });

    return () => {
      unsubPhotoSelected();
      unsubPinToggled();
    };
  }, []);

  const handleToggleLayout = () => {
    const nextMode = layoutMode === "3d" ? "2d" : "3d";
    setLayoutMode(nextMode);
    eventBus.emit("LAYOUT_MODE_TOGGLED", nextMode);
  };

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    eventBus.emit("CATEGORY_SELECTED", cat);
  };

  const handleSelectMood = (mood: MoodType) => {
    setActiveMood(mood);
    eventBus.emit("MOOD_SELECTED", mood);
  };

  const handleApertureChange = (ap: number) => {
    setApertureValue(ap);
    eventBus.emit("APERTURE_CHANGED", ap);
  };

  const handleLightingPresetChange = (preset: LightingPreset) => {
    setLightingPreset(preset);
    eventBus.emit("LIGHTING_PRESET_CHANGED", preset);
  };

  const handleOpenContact = (subject?: string) => {
    setInquirySubject(subject);
    setIsContactOpen(true);
  };

  const handleTogglePin = (photo: GalleryPhotoItem) => {
    setSavedLightTablePhotos((prev) => {
      const exists = prev.some((p) => p.id === photo.id);
      if (exists) {
        return prev.filter((p) => p.id !== photo.id);
      } else {
        return [...prev, photo];
      }
    });
  };

  const handleRemovePin = (id: string) => {
    setSavedLightTablePhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLightTableQuote = (photos: GalleryPhotoItem[]) => {
    setIsLightTableOpen(false);
    const titles = photos.map((p) => p.title).join(", ");
    handleOpenContact(`Print & Wedding Archive Quote for [${photos.length} frames]: ${titles}`);
  };

  // Active photo for EXIF viewfinder: selected photo or fallback to first item
  const activeExifPhoto = selectedPhoto || galleryItems[0] || PORTFOLIO_GALLERY_ITEMS[0];
  const isSelectedPhotoPinned = selectedPhoto
    ? savedLightTablePhotos.some((p) => p.id === selectedPhoto.id)
    : false;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181817] flex flex-col justify-between selection:bg-[#D9381E] selection:text-white">
      <Header />

      <main className="flex-1 relative pt-24 pb-28 flex flex-col">
        {/* Minimalist Glassmorphism HUD Overlay at top of stage */}
        <div className="container mx-auto px-4 md:px-8 mb-4 relative z-30">
          <GalleryHUDOverlay
            layoutMode={layoutMode}
            onToggleLayout={handleToggleLayout}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            activeMood={activeMood}
            onSelectMood={handleSelectMood}
            apertureValue={apertureValue}
            onApertureChange={handleApertureChange}
            lightingPreset={lightingPreset}
            onSelectLightingPreset={handleLightingPresetChange}
            onOpenContact={() => handleOpenContact()}
            photoCount={galleryItems.length}
          />
        </div>

        {/* Dynamic Layout Switcher: 3D Antigravity Space vs 2D Editorial Masonry */}
        <div className="flex-1 w-full relative">
          {layoutMode === "3d" ? (
            <div className="w-full h-[74vh] md:h-[80vh] relative rounded-3xl overflow-hidden border border-[#181817]/10 bg-[#FAF8F5] shadow-2xl container mx-auto px-0">
              <AntigravityGallery
                items={galleryItems}
                activeCategory={activeCategory}
                activeMood={activeMood}
                apertureValue={apertureValue}
                lightingPreset={lightingPreset}
                selectedPhoto={selectedPhoto}
                onSelectPhoto={(photo) => setSelectedPhoto(photo)}
              />

              {/* In-Canvas Instruction Cues */}
              <div className="absolute top-5 left-6 pointer-events-none hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#181817]/10 backdrop-blur-md text-[11px] font-mono text-[#6E6A63] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E] animate-pulse" />
                <span>Move cursor to cast studio keylight &middot; Dial f-stop for bokeh</span>
              </div>
            </div>
          ) : (
            <ClassicEditorialGrid
              activeCategory={activeCategory}
              onSelectPhoto={(photo) => setSelectedPhoto(photo)}
              savedPhotos={savedLightTablePhotos}
              onTogglePin={handleTogglePin}
            />
          )}
        </div>
      </main>

      {/* Live EXIF Telemetry Bar Fixed at Bottom Viewport */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-5xl mx-auto pointer-events-none">
        <EXIFViewfinderBar
          photo={activeExifPhoto}
          onOpenInspect={() => {
            if (activeExifPhoto) setSelectedPhoto(activeExifPhoto);
          }}
          onOpenLightTable={() => setIsLightTableOpen(true)}
          lightTableCount={savedLightTablePhotos.length}
        />
      </div>

      {/* Client Light Table Contact Sheet Drawer */}
      <ClientLightTableDrawer
        isOpen={isLightTableOpen}
        onClose={() => setIsLightTableOpen(false)}
        savedPhotos={savedLightTablePhotos}
        onRemovePhoto={handleRemovePin}
        onRequestQuote={handleLightTableQuote}
      />

      {/* Lightbox High-Res Inspection Modal with 3D Loupe, 2.5D Parallax & Darkroom RAW Slider */}
      <PhotoLightboxModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onOpenContact={handleOpenContact}
        isPinned={isSelectedPhotoPinned}
        onTogglePin={selectedPhoto ? () => handleTogglePin(selectedPhoto) : undefined}
      />

      {/* Minimalist Glassmorphic Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultSubject={inquirySubject}
      />

      <Footer />
    </div>
  );
};

export default Portfolio;
