import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

// Sample images for each category
import portfolioWedding from "@/assets/portfolio-wedding.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import portfolioPrewedding from "@/assets/portfolio-prewedding.jpg";
import prewedding2 from "@/assets/prewedding-2.jpg";
import portfolioCandid from "@/assets/portfolio-candid.jpg";
import candid1 from "@/assets/candid-1.jpg";
import portfolioAlbum from "@/assets/portfolio-album.jpg";
import videoThumb1 from "@/assets/video-thumb-1.jpg";

const portfolioItems = [
  {
    image: portfolioWedding,
    title: "Sacred Ceremonies",
    category: "Wedding",
    type: "photo",
  },
  {
    image: wedding1,
    title: "Traditional Vows",
    category: "Wedding",
    type: "photo",
  },
  {
    image: portfolioPrewedding,
    title: "Palace Romance",
    category: "Pre-Wedding",
    type: "photo",
  },
  {
    image: prewedding2,
    title: "Garden Dance",
    category: "Pre-Wedding",
    type: "photo",
  },
  {
    image: portfolioCandid,
    title: "Joyful Moments",
    category: "Candid",
    type: "photo",
  },
  {
    image: candid1,
    title: "Bridesmaids Fun",
    category: "Candid",
    type: "photo",
  },
  {
    image: videoThumb1,
    title: "Cinematic Film",
    category: "Video",
    type: "video",
  },
  {
    image: portfolioAlbum,
    title: "Premium Albums",
    category: "Albums",
    type: "photo",
  },
];

export function PortfolioPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Our Work
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-4">
              Latest Wedding Stories
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all duration-300"
          >
            View All Stories
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Grid - 8 items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioItems.map((item, index) => (
            <Link
              key={`${item.title}-${index}`}
              to="/portfolio"
              className="group relative aspect-[3/4] rounded-xl overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-elegant group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 text-primary-foreground ml-1" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-sm text-primary-foreground/70 mb-1">
                  {item.category}
                </p>
                <h3 className="font-serif text-xl text-primary-foreground font-medium">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
