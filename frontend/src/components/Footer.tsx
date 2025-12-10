import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-3xl font-semibold">Sanwaliya</h3>
              <p className="text-xs tracking-[0.3em] uppercase text-primary-foreground/60">
                Photo Studio
              </p>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Capturing your love story in timeless frames. Every moment, every
              emotion, preserved forever.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/reel/DHyqKe3TKe0/?igsh=MXB4MjBkYm1qYWRleg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@sanwaliya-photo-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-medium mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Portfolio", href: "/portfolio" },
                { name: "Services", href: "/services" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-xl font-medium mb-6">Our Services</h4>
            <ul className="space-y-3">
              {[
                "Wedding Photography",
                "Pre-Wedding Shoots",
                "Cinematic Videos",
                "Candid Photography",
                "Album Designing",
                "Video Mixing",
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-primary-foreground/70">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xl font-medium mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex flex-col">
                  <p className="text-sm text-primary-foreground/70">Call us</p>
                  <a
                    href="tel:+919829128594"
                    className="text-sm font-medium hover:text-primary transition-colors duration-300"
                  >
                    +91 98291 28594
                  </a>
                  <a
                    href="tel:+918619053741"
                    className="text-sm font-medium hover:text-primary transition-colors duration-300"
                  >
                    +91 86190 53741
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-primary-foreground/70">Email us</p>
                  <a
                    href="mailto:roshanlalyadav30408@gmail.com"
                    className="text-sm font-medium hover:text-primary transition-colors duration-300"
                  >
                    roshanlalyadav30408@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-primary-foreground/70">Visit us</p>
                  <p className="text-sm font-medium">
                    Seemliyawas Village, Near Vatika, 303903,
                    <br />
                    Jaipur, Rajasthan, India
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Sanwaliya Photo Studio. All rights reserved.
          </p>
          <p className="text-sm text-primary-foreground/50">
            Crafted with ♥ by Roshan Lal Yadav
          </p>
        </div>
      </div>
    </footer>
  );
}
