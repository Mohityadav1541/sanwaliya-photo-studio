import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isHomePage = location.pathname === "/";
  const headerBg = isScrolled || !isHomePage
    ? "bg-background/95 backdrop-blur-md shadow-soft"
    : "bg-transparent";

  const textColor = isScrolled || !isHomePage
    ? "text-foreground"
    : "text-primary-foreground";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        headerBg
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span
              className={cn(
                "font-serif text-2xl md:text-3xl font-semibold tracking-wide transition-colors duration-300",
                textColor
              )}
            >
              Sanwaliya
            </span>
            <span
              className={cn(
                "text-xs tracking-[0.3em] uppercase transition-colors duration-300",
                isScrolled || !isHomePage ? "text-muted-foreground" : "text-primary-foreground/80"
              )}
            >
              Photo Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-all duration-300 hover:text-primary relative group",
                  textColor,
                  location.pathname === link.href && "text-primary"
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                    location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919829128594"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors duration-300",
                textColor
              )}
            >
              <Phone className="w-4 h-4" />
              <span>+91 98291 28594</span>
            </a>
            <Link to="/contact">
              <Button variant={isScrolled || !isHomePage ? "gold" : "hero"} size="lg">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn("lg:hidden p-2 transition-colors duration-300", textColor)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-500",
            isMobileMenuOpen ? "max-h-[400px] pb-6" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-base font-medium py-2 transition-colors duration-300",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/contact" className="mt-2">
              <Button variant="gold" size="lg" className="w-full">
                Book Your Wedding
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
