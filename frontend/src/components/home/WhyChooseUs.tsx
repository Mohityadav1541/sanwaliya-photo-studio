import { CheckCircle, Clock, Award, Heart } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Emotional Storytelling",
    description:
      "We capture not just moments, but the feelings, the love, and the joy that make your day special.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Using top-of-the-line equipment and techniques, we deliver cinema-grade photos and videos.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "We understand how eager you are to relive your memories. We always deliver on schedule.",
  },
  {
    icon: CheckCircle,
    title: "Complete Package",
    description:
      "From photography to albums to video mixing, we provide everything under one roof.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Why Choose Us
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-4 mb-6">
              Creating Memories That Last Forever
            </h2>
            <p className="text-primary-foreground/70 leading-relaxed mb-8">
              At Sanwaliya Photo Studio, we believe every wedding is unique, and
              every love story deserves to be told with authenticity and artistry.
              Here is why couples across India trust us with their most precious
              moments.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-primary-foreground/5 rounded-xl p-6 border border-primary-foreground/10 hover:border-primary/50 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-primary-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
