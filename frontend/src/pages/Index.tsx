import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { Editorial3DStudio } from "@/components/3d/Editorial3DStudio";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CTASection } from "@/components/home/CTASection";
import { Layers, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181817] selection:bg-[#D9381E] selection:text-white">
      <Header />
      <main>
        {/* Editorial Daylight Atelier Hero Section */}
        <HeroSection />

        {/* 3D Physics & Spatial Gallery Section */}
        <section
          id="editorial-3d-experience"
          className="relative py-20 md:py-28 bg-[#EFECE6]/40 border-t border-b border-[#181817]/10 overflow-hidden"
        >
          {/* Subtle Sunlit Vignette */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C5A880]/10 blur-[150px] pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            {/* Editorial Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#181817]/10 text-[#D9381E] text-[11px] font-mono uppercase tracking-[0.2em] shadow-sm">
                <Layers className="w-3.5 h-3.5" />
                <span>Spatial 3D Gallery &middot; Physics Engine</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#181817] font-normal tracking-tight">
                The Physics of <span className="italic text-[#C5A880]">Tangible Memory</span>
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#6E6A63] max-w-xl mx-auto font-light leading-relaxed">
                Explore our dynamic Three.js &amp; Cannon.js physical environment. Every photographic frame
                carries tangible mass, restitution, and collision inertia. Tap and scatter elements to experience
                tactile craftsmanship in motion.
              </p>
            </div>

            {/* 3D Physics Studio Canvas */}
            <div className="max-w-5xl mx-auto">
              <Editorial3DStudio />
            </div>

            {/* Feature Callouts under 3D Studio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
              <div className="p-6 rounded-2xl bg-white/80 border border-[#181817]/10 shadow-sm space-y-2">
                <span className="text-[11px] font-mono text-[#D9381E] uppercase tracking-wider block font-semibold">
                  01 / Real-Time Physics
                </span>
                <h3 className="font-serif text-xl text-[#181817]">Rigid Body Dynamics</h3>
                <p className="font-sans text-xs text-[#6E6A63] leading-relaxed">
                  Cannon.js calculates gravitational acceleration, angular momentum, and multi-body collisions with authentic physical weight.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 border border-[#181817]/10 shadow-sm space-y-2">
                <span className="text-[11px] font-mono text-[#D9381E] uppercase tracking-wider block font-semibold">
                  02 / Daylight Lighting
                </span>
                <h3 className="font-serif text-xl text-[#181817]">Daylight Atelier Shaders</h3>
                <p className="font-sans text-xs text-[#6E6A63] leading-relaxed">
                  Warm Alabaster (#FAF8F5) ambience illuminated by gallery skylight and directional sun casting realistic contact shadows.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 border border-[#181817]/10 shadow-sm space-y-2">
                <span className="text-[11px] font-mono text-[#D9381E] uppercase tracking-wider block font-semibold">
                  03 / Reactive Interaction
                </span>
                <h3 className="font-serif text-xl text-[#181817]">Direct Pointer Impulse</h3>
                <p className="font-sans text-xs text-[#6E6A63] leading-relaxed">
                  Interactive pointer toss and zero-gravity float states let you disperse and reconstruct the photographic collection in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Existing Sections Preserved */}
        <ServicesSection />
        <AboutPreview />
        <PortfolioPreview />
        <WhyChooseUs />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
