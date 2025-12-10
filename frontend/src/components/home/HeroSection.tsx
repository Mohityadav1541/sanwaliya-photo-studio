import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful Indian wedding couple at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 opacity-0 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground tracking-wide">
              Award-Winning Wedding Photography
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary-foreground font-semibold leading-tight opacity-0 animate-fade-up delay-100">
            Capturing Your
            <span className="block text-gradient-gold">Love Story</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-up delay-200">
            Where every frame tells a story, every moment becomes a timeless memory.
            Premium wedding photography by Roshan Lal Yadav.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 opacity-0 animate-fade-up delay-300">
            <Link to="/portfolio">
              <Button variant="heroSolid" size="xl">
                View Wedding Stories
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="hero" size="xl" className="gap-2">
                <Play className="w-5 h-5" />
                Hire Roshan Lal Yadav
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-12 opacity-0 animate-fade-up delay-400">
            {[
              { value: "500+", label: "Weddings" },
              { value: "10+", label: "Years" },
              { value: "1000+", label: "Happy Couples" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-3xl md:text-4xl text-primary-foreground font-semibold">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/60 tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up delay-500">
        <div className="flex flex-col items-center gap-2 text-primary-foreground/60">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
