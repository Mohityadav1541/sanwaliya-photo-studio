// Force update - triggering deployment for image fix
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Play, Loader2 } from "lucide-react";
import api from "@/services/api";

const categories = [
  "All",
  "Weddings",
  "Pre-Wedding",
  "Cinematic Videos",
  "Candid",
  "Albums",
];

interface MediaItem {
  id: string;
  title: string;
  category: string;
  type: string;
  fileUrl?: string; // For images/videos hosted on our server
  externalUrl?: string; // For YouTube, etc.
  thumbnailUrl?: string;
  location?: string;
  eventDate?: string;
  isFeatured?: boolean;
}

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Helper to construct full URL for local images
  const getImageUrl = (item: MediaItem) => {
    if (item.type === 'VIDEO' && item.thumbnailUrl) {
      if (item.thumbnailUrl.startsWith('http')) return item.thumbnailUrl;
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${item.thumbnailUrl}`;
    }

    if (item.fileUrl) {
      if (item.fileUrl.startsWith('http')) return item.fileUrl;
      // Assuming VITE_API_URL is something like http://localhost:5000/api
      // We need just the origin + fileUrl (which starts with /uploads)
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${item.fileUrl}`;
    }

    // Fallback or placeholder could go here
    return '';
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        // Fetch all media items
        const response = await api.get('/media?limit=100');
        setItems(response.data.items);
      } catch (error) {
        console.error("Failed to fetch portfolio items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

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
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p>No items found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group cursor-pointer relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100"
                  >
                    {(item.fileUrl || item.thumbnailUrl) && (
                      <img
                        src={getImageUrl(item)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}

                    {item.type === "VIDEO" && (
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
                      {item.location && (
                        <p className="text-sm text-primary-foreground/70">
                          {item.location} {item.eventDate && `• ${formatDate(item.eventDate)}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              {selectedItem.type === "VIDEO" && selectedItem.externalUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={selectedItem.externalUrl.replace("watch?v=", "embed/")}
                    title={selectedItem.title}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={getImageUrl(selectedItem)}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent rounded-b-lg">
                <h3 className="font-serif text-2xl text-primary-foreground font-medium mb-1">
                  {selectedItem.title}
                </h3>
                <p className="text-primary-foreground/70">
                  {selectedItem.location} {selectedItem.eventDate && `• ${formatDate(selectedItem.eventDate)}`}
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
