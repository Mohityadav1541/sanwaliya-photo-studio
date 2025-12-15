import { useState } from "react";
import api from "@/services/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast({
        title: "Required Fields",
        description: "Please fill in your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
        await api.post('/contact', formData);
        toast({
            title: "Inquiry Sent!",
            description: "Thank you for reaching out. We will contact you within 24 hours.",
        });

        setFormData({
            name: "",
            phone: "",
            email: "",
            eventType: "",
            eventDate: "",
            eventLocation: "",
            message: "",
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to send inquiry. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-romantic">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Get in Touch
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold mt-4 mb-6">
              Book Your Date
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ready to capture your love story? Fill out the form below and we
              will get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-semibold mb-6">
                    Contact Information
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Reach out to us through any of these channels. We are always
                    happy to discuss your wedding photography needs.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-gold-light flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Call Us</p>
                      <a href="tel:+919829128594" className="block text-muted-foreground hover:text-primary transition-colors">
                        +91 98291 28594
                      </a>
                      <a href="tel:+918619053741" className="block text-muted-foreground hover:text-primary transition-colors">
                        +91 86190 53741
                      </a>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/message/HEA455SLBBD7L1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-gold-light flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">WhatsApp</p>
                      <p className="text-muted-foreground">
                        Chat with us
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:roshanlalyadav30408@gmail.com"
                    className="flex items-start gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-gold-light flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Email Us</p>
                      <p className="text-muted-foreground">
                        roshanlalyadav30408@gmail.com
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-gold-light flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Visit Us</p>
                      <p className="text-muted-foreground">
                        Seemliyawas Village, Near Vatika, 303903,
                        <br />
                        Jaipur, Rajasthan, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl p-8 shadow-soft">
                  <h2 className="font-serif text-2xl font-semibold mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Your Name{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone Number{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="h-12"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Event Type
                        </label>
                        <Select
                          value={formData.eventType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, eventType: value })
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="pre-wedding">
                              Pre-Wedding
                            </SelectItem>
                            <SelectItem value="engagement">
                              Engagement
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Event Date
                        </label>
                        <Input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              eventDate: e.target.value,
                            })
                          }
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Event Location
                      </label>
                      <Input
                        type="text"
                        placeholder="City, Venue Name"
                        value={formData.eventLocation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventLocation: e.target.value,
                          })
                        }
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message / Requirements
                      </label>
                      <Textarea
                        placeholder="Tell us about your wedding plans and requirements..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={5}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      size="xl"
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Inquiry
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="h-[400px] bg-muted relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Google Maps integration will be added here
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
