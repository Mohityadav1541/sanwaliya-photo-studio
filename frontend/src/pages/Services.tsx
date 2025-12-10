import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Camera,
  Video,
  Heart,
  Image,
  BookOpen,
  Film,
  Check,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    id: "wedding-photography",
    icon: Camera,
    title: "Wedding Photography & Videography",
    description:
      "Your wedding day is filled with countless precious moments—from the sacred rituals to the joyful celebrations. Our team captures every tear of joy, every loving glance, and every blessing with artistic precision and emotional depth.",
    features: [
      "Full-day coverage from getting ready to reception",
      "Multiple photographers for different angles",
      "Drone photography for venue shots",
      "Same-day teaser edits",
      "High-resolution digital files",
    ],
  },
  {
    id: "pre-wedding",
    icon: Heart,
    title: "Pre-Wedding Shoots",
    description:
      "Create magical memories before the big day with a romantic pre-wedding photoshoot. We scout the most beautiful locations—from palace gardens to desert dunes—to capture your chemistry and love story in stunning frames.",
    features: [
      "Location scouting and recommendations",
      "Outfit guidance and styling tips",
      "Multiple location shoots",
      "Creative concepts and themes",
      "Cinematic video highlights",
    ],
  },
  {
    id: "cinematic-videos",
    icon: Video,
    title: "Cinematic Wedding Videos",
    description:
      "Turn your wedding into a Bollywood-worthy film. Our cinematic videos blend emotion, music, and artistry to tell your love story in a way that will move you to tears every time you watch.",
    features: [
      "Movie-style storytelling",
      "Professional audio recording",
      "Color grading and visual effects",
      "Licensed background music",
      "4K Ultra HD quality",
    ],
  },
  {
    id: "candid-photography",
    icon: Image,
    title: "Candid Photography",
    description:
      "The best moments are often unplanned. Our candid photography captures the natural emotions, spontaneous laughter, and genuine interactions that make your wedding truly special.",
    features: [
      "Unobtrusive shooting style",
      "Emotion-focused storytelling",
      "Natural lighting expertise",
      "Quick turnaround time",
      "Social media ready images",
    ],
  },
  {
    id: "album-designing",
    icon: BookOpen,
    title: "Premium Album Designing",
    description:
      "Preserve your memories in a luxurious, handcrafted photo album. Our premium albums feature museum-quality printing, elegant layouts, and durable binding that will last generations.",
    features: [
      "Italian leather covers",
      "Lay-flat page design",
      "Archival quality printing",
      "Custom layout design",
      "Multiple size options",
    ],
  },
  {
    id: "video-mixing",
    icon: Film,
    title: "Video Mixing & Reels",
    description:
      "From Instagram reels to full-length highlight films, we create engaging video content that is perfect for sharing with family and friends. Our creative edits bring your moments to life with trending music and effects.",
    features: [
      "Instagram and YouTube optimized",
      "Trending music integration",
      "Creative transitions and effects",
      "Multiple format delivery",
      "Quick turnaround time",
    ],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-romantic">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              What We Offer
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold mt-4 mb-6">
              Our Services
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From the first click to the final edit, we offer comprehensive
              wedding photography and videography services tailored to your
              needs.
            </p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-24">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  id={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-gold-light flex items-center justify-center mb-6">
                      <service.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact">
                      <Button variant="gold" size="lg" className="gap-2">
                        Book This Service
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                  <div
                    className={`relative ${index % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden shadow-elegant">
                      <service.icon className="w-32 h-32 text-primary/30" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-primary/30 rounded-xl -z-10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-foreground text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
              Ready to Create Magic Together?
            </h2>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-8">
              Contact us today to discuss your requirements and check
              availability for your special day.
            </p>
            <Link to="/contact">
              <Button variant="gold" size="xl" className="gap-2">
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
