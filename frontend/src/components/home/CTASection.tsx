import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-romantic relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            Ready to Begin?
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-semibold mt-4 mb-6">
            Let Us Capture Your Love Story
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Your wedding day comes only once. Make sure every precious moment is
            captured beautifully. Contact us today to check availability for your
            special date.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="gold" size="xl" className="gap-2">
                Book Your Date
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="elegant" size="xl">
                View Our Work
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
