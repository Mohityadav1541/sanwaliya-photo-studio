import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Camera, Heart, Award, Users, ArrowRight } from "lucide-react";
import roshanImage from "@/assets/roshan-portrait.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-romantic">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Our Story
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold mt-4 mb-6">
              About Sanwaliya Photo Studio
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A decade of capturing love, emotion, and timeless memories across
              India.
            </p>
          </div>
        </section>

        {/* About Roshan */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-elegant">
                  <img
                    src={roshanImage}
                    alt="Roshan Lal Yadav - Founder and Lead Photographer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/30 rounded-2xl -z-10" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
              </div>

              {/* Content */}
              <div className="space-y-6">
                <h2 className="font-serif text-4xl md:text-5xl font-semibold">
                  Meet Roshan Lal Yadav
                </h2>
                <p className="text-primary font-medium tracking-wide">
                  Founder & Lead Photographer
                </p>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    With over 10 years of experience in wedding photography,
                    Roshan Lal Yadav has established Sanwaliya Photo Studio as
                    one of the most trusted names in wedding documentation
                    across Rajasthan and beyond.
                  </p>
                  <p>
                    His journey began with a simple belief: every love story is
                    unique and deserves to be told with authenticity and
                    artistry. This philosophy has guided him through hundreds of
                    weddings, each one teaching him something new about love,
                    family, and the beauty of human connection.
                  </p>
                  <p>
                    Roshan is not just a photographer; he is a storyteller who
                    uses his camera to capture the emotions, traditions, and
                    joyful moments that make Indian weddings so special. His
                    work is characterized by a blend of cinematic grandeur and
                    intimate candid moments.
                  </p>
                </div>
                <div className="pt-6">
                  <Link to="/contact">
                    <Button variant="gold" size="lg" className="gap-2">
                      Hire Roshan for Your Wedding
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Camera, value: "500+", label: "Weddings Captured" },
                { icon: Users, value: "1000+", label: "Happy Families" },
                { icon: Award, value: "10+", label: "Years Experience" },
                { icon: Heart, value: "50+", label: "Destination Weddings" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-primary to-gold-light flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <p className="font-serif text-4xl font-semibold mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-medium text-primary tracking-widest uppercase">
                Our Philosophy
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-4 mb-8">
                More Than Just Photos
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  At Sanwaliya Photo Studio, we believe that wedding photography
                  is not just about taking pictures—it is about preserving
                  emotions, traditions, and the beautiful chaos of love.
                </p>
                <p>
                  Every wedding we shoot is approached with fresh eyes and an
                  open heart. We take the time to understand your story, your
                  family dynamics, and your vision for the day. This allows us
                  to anticipate moments before they happen and capture them in
                  their most authentic form.
                </p>
                <p>
                  Our commitment is simple: to deliver not just photographs, but
                  a visual legacy that your children and grandchildren will
                  treasure for generations to come.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-foreground text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
              Let Us Be Part of Your Story
            </h2>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-8">
              Ready to create beautiful memories together? Contact us today to
              discuss your wedding photography needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="gold" size="xl" className="gap-2">
                  Book a Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button
                  variant="hero"
                  size="xl"
                >
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
