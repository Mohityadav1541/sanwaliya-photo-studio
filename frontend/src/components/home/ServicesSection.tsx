import { Camera, Video, Heart, Image, BookOpen, Film } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Camera,
    title: "Wedding Photography",
    description:
      "Capturing every sacred ritual, every joyful tear, every loving glance with artistic precision.",
  },
  {
    icon: Video,
    title: "Cinematic Videos",
    description:
      "Movie-style wedding films that tell your unique love story with emotion and elegance.",
  },
  {
    icon: Heart,
    title: "Pre-Wedding Shoots",
    description:
      "Romantic photo sessions in stunning locations, capturing your chemistry before the big day.",
  },
  {
    icon: Image,
    title: "Candid Photography",
    description:
      "Natural, unposed moments that reveal the true emotions and joy of your celebration.",
  },
  {
    icon: BookOpen,
    title: "Album Designing",
    description:
      "Premium handcrafted albums that preserve your memories in luxurious, timeless style.",
  },
  {
    icon: Film,
    title: "Video Mixing",
    description:
      "Creative edits, song mixes, and social reels that bring your moments to life.",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-romantic">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            What We Offer
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-4 mb-6">
            Our Premium Services
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            From the first click to the final edit, we pour our heart into every
            frame to create memories that last forever.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to="/services"
              className="group bg-card rounded-xl p-8 shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-medium mb-3 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
