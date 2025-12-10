import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
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
