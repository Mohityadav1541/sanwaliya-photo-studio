import React, { useState } from "react";
import { X, Send, Calendar, Phone, Mail, MapPin, Sparkles, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export function ContactModal({ isOpen, onClose, defaultSubject }: ContactModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "Wedding",
    eventDate: "",
    eventLocation: "",
    message: defaultSubject ? `Inquiring about: "${defaultSubject}"` : "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast({
        title: "Required Information",
        description: "Please provide your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/contact", formData);
      toast({
        title: "Inquiry Received",
        description: "Roshan Lal Yadav and our studio team will contact you promptly.",
      });
      onClose();
      setFormData({
        name: "",
        phone: "",
        email: "",
        eventType: "Wedding",
        eventDate: "",
        eventLocation: "",
        message: "",
      });
    } catch (err) {
      toast({
        title: "Submission Error",
        description: "Unable to deliver inquiry. Please call +91 98291 28594 directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#121212]/85 backdrop-blur-2xl animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-w-xl w-full max-h-[92vh] overflow-y-auto rounded-2xl bg-[#181818]/95 border border-[#2e2e2e] shadow-2xl p-6 sm:p-8 text-[#F5F3EF]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#202020] hover:bg-[#2b2b2b] border border-[#333333] flex items-center justify-center text-[#F5F3EF] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Editorial Heading */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202020] border border-[#333333] text-[#D4AF37] text-[10px] font-sans uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" />
            <span>Direct Studio Commission</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#F5F3EF]">
            Begin Your Chronicle
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#F5F3EF]/70 font-light">
            Tell us about your celebration. Roshan Lal Yadav accepts a limited number of weddings each season to guarantee unhurried editorial excellence.
          </p>
        </div>

        {/* Inquiry Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#F5F3EF]/60">
                Your Full Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ananya & Arjun"
                required
                className="bg-[#141414] border-[#2e2e2e] text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#F5F3EF]/60">
                Phone Number *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                required
                className="bg-[#141414] border-[#2e2e2e] text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#F5F3EF]/60">
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="bg-[#141414] border-[#2e2e2e] text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#F5F3EF]/60">
                Celebration Type
              </label>
              <Select
                value={formData.eventType}
                onValueChange={(val) => setFormData({ ...formData, eventType: val })}
              >
                <SelectTrigger className="bg-[#141414] border-[#2e2e2e] text-[#F5F3EF]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-[#181818] border-[#2e2e2e] text-[#F5F3EF]">
                  <SelectItem value="Wedding">Royal Wedding (Multi-Day)</SelectItem>
                  <SelectItem value="Pre-Wedding">Pre-Wedding Shoot</SelectItem>
                  <SelectItem value="Cinematic Video">Cinematic Film</SelectItem>
                  <SelectItem value="Candid Series">Candid Only</SelectItem>
                  <SelectItem value="Destination">Destination Wedding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#F5F3EF]/60">
                Tentative Date
              </label>
              <Input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="bg-[#141414] border-[#2e2e2e] text-[#F5F3EF] focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#F5F3EF]/60">
                Location / City
              </label>
              <Input
                value={formData.eventLocation}
                onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                placeholder="e.g. Udaipur, Rajasthan"
                className="bg-[#141414] border-[#2e2e2e] text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#F5F3EF]/60">
              Personal Note / Vision
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              placeholder="Tell us about the vibe, rituals, or venues you have in mind..."
              className="bg-[#141414] border-[#2e2e2e] text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:border-[#D4AF37]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F5F3EF] text-[#121212] hover:bg-white tracking-widest uppercase text-xs font-semibold h-12 shadow-lg gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Request Studio Availability</span>
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex items-center justify-between text-[11px] text-[#F5F3EF]/50 font-sans">
          <span>Direct Hotline: +91 98291 28594</span>
          <span>Studio: Nimbahera, Chittorgarh</span>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;

