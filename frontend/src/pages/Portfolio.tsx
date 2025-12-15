import { useState, useEffect } from "react";
import api from "@/services/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

// Wedding images
import portfolioWedding from "@/assets/portfolio-wedding.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import wedding2 from "@/assets/wedding-2.jpg";
import wedding3 from "@/assets/wedding-3.jpg";

// Pre-wedding images
import portfolioPrewedding from "@/assets/portfolio-prewedding.jpg";
import prewedding1 from "@/assets/prewedding-1.jpg";
import prewedding2 from "@/assets/prewedding-2.jpg";
import prewedding3 from "@/assets/prewedding-3.jpg";

// Candid images
import portfolioCandid from "@/assets/portfolio-candid.jpg";
import candid1 from "@/assets/candid-1.jpg";
import candid2 from "@/assets/candid-2.jpg";
import candid3 from "@/assets/candid-3.jpg";

// Album images
import portfolioAlbum from "@/assets/portfolio-album.jpg";
import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";

// Video thumbnails
import videoThumb1 from "@/assets/video-thumb-1.jpg";
import videoThumb2 from "@/assets/video-thumb-2.jpg";
import videoThumb3 from "@/assets/video-thumb-3.jpg";

const categories = [
  "All",
  "Weddings",
  "Pre-Wedding",
  "Cinematic Videos",
  "Candid",
  "Albums",
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/media?limit=100');
        const mappedItems = res.data.items.map((item: any) => ({
          id: item.id,
          image: item.fileUrl ? (item.fileUrl.startsWith('http') ? item.fileUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.fileUrl}`) : '',
          title: item.title,
          category: item.category,
          location: item.location || 'Jaipur', // Default if missing
          date: item.eventDate ? new Date(item.eventDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024',
          type: item.type === 'VIDEO' ? 'video' : 'photo',
          videoUrl: item.externalUrl,
        }));
        setPortfolioItems(mappedItems);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-romantic">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Our Portfolio
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold mt-4 mb-6">
              Wedding Stories
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every wedding we capture is unique. Browse through our collection
              of beautiful love stories from across India.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-background border-b border-border sticky top-20 z-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer relative aspect-[4/5] rounded-xl overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-elegant group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-sm text-primary mb-1">{item.category}</p>
                    <h3 className="font-serif text-xl text-primary-foreground font-medium mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-primary-foreground/70">
                      {item.location} • {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lightbox */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              {selectedItem.type === "video" ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={selectedItem.videoUrl}
                    title={selectedItem.title}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent rounded-b-lg">
                <h3 className="font-serif text-2xl text-primary-foreground font-medium mb-1">
                  {selectedItem.title}
                </h3>
                <p className="text-primary-foreground/70">
                  {selectedItem.location} • {selectedItem.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
