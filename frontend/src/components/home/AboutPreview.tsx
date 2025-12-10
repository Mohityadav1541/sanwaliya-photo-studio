import roshanImage from "@/assets/roshan-portrait.jpg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Award, Heart } from "lucide-react";

export function AboutPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={roshanImage}
                alt="Roshan Lal Yadav - Wedding Photographer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-card p-6 rounded-xl shadow-elegant max-w-[200px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold">10+</p>
                  <p className="text-xs text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/30 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              The Artist Behind the Lens
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold">
              Meet Roshan Lal Yadav
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              With over a decade of experience capturing love stories across India,
              Roshan Lal Yadav has become synonymous with emotional, cinematic wedding
              photography. His philosophy is simple: every couple has a unique story,
              and every moment deserves to be told with authenticity and artistry.
            </p>
            <div className="grid grid-cols-2 gap-6 py-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-xl font-medium">500+</p>
                  <p className="text-sm text-muted-foreground">Weddings Captured</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-xl font-medium">1000+</p>
                  <p className="text-sm text-muted-foreground">Happy Families</p>
                </div>
              </div>
            </div>
            <Link to="/about">
              <Button variant="gold" size="lg">
                Read Full Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
