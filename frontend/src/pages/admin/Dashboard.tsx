import { useEffect, useState } from "react";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mini3DPreview } from "@/components/admin/Mini3DPreview";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Box,
  Layers,
  Sun,
} from "lucide-react";
import heroWedding from "@/assets/hero-wedding.jpg";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMedia: 0,
    totalInquiries: 0,
    newInquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const mediaRes = await api.get("/media?limit=1");
        const inquiriesRes = await api.get("/contact/admin");
        const inquiries = inquiriesRes.data || [];

        setStats({
          totalMedia: mediaRes.data.total || 8,
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter((i: any) => i.status === "NEW").length,
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 font-sans text-[#181817]">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#181817]/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D9381E] block mb-1">
            Studio Command Center
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-[#181817]">
            Dashboard Overview
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/media">
            <Button className="bg-[#181817] text-[#FAF8F5] hover:bg-[#2b2b29] text-xs font-semibold uppercase tracking-wider h-10 shadow-md gap-2">
              <ImageIcon className="w-4 h-4 text-[#C5A880]" />
              <span>Manage 3D Media</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Daylight Atelier Metric Stat Cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
        <Card className="bg-white/85 border-[#181817]/10 shadow-sm text-[#181817] rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-[#6E6A63] font-mono font-medium">
              Portfolio Media Indexed
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#181817]/10 flex items-center justify-center text-[#D9381E]">
              <ImageIcon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-serif text-[#181817]">{stats.totalMedia}</div>
            <p className="text-[11px] text-[#6E6A63]">3D Antigravity &amp; 2D Masonry</p>
          </CardContent>
        </Card>

        <Card className="bg-white/85 border-[#181817]/10 shadow-sm text-[#181817] rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-[#6E6A63] font-mono font-medium">
              Client Inquiries
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#181817]/10 flex items-center justify-center text-[#C5A880]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-serif text-[#181817]">{stats.totalInquiries}</div>
            <p className="text-[11px] text-[#6E6A63]">Total wedding leads received</p>
          </CardContent>
        </Card>

        <Card className="bg-white/85 border-[#181817]/10 shadow-sm text-[#181817] rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-[#6E6A63] font-mono font-medium">
              New Leads Pending
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#181817]/10 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-serif text-[#181817]">{stats.newInquiries}</div>
            <p className="text-[11px] text-[#6E6A63]">Requires studio follow-up</p>
          </CardContent>
        </Card>
      </div>

      {/* Sun-Angle & Frame Studio Live Calibration Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white/85 border border-[#181817]/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D9381E]">
                  Architectural Daylight Engine
                </span>
                <h3 className="font-serif text-2xl text-[#181817]">
                  Real-Time 3D Frame &amp; Sunlight Calibration
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D9381E] animate-ping" />
                <span className="text-xs font-mono text-[#6E6A63]">Live Engine Active</span>
              </div>
            </div>
            <p className="text-xs text-[#6E6A63] leading-relaxed font-light">
              This live 3D viewport simulates the exact optical appearance of custom frames inside the user gallery.
              Test frame finishes (Champagne Gold, Raw Oak, Matte Espresso), adjust passe-partout matte margins,
              and preview how sunlit shadows shift across fine-art cotton-rag prints.
            </p>
          </div>

          <Mini3DPreview
            imagePreviewUrl={heroWedding}
            initialTitle="Royal Courtyard Vows"
            initialCategory="Weddings"
          />
        </div>

        {/* Quick Help & Guidelines */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white/85 border border-[#181817]/10 shadow-sm space-y-4">
            <h4 className="font-serif text-lg text-[#181817]">Daylight Atelier Standards</h4>
            <div className="space-y-3 text-xs text-[#6E6A63] font-light">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#181817]/10 flex items-center justify-center text-[10px] font-mono text-[#D9381E] font-semibold shrink-0">
                  1
                </span>
                <p>
                  <strong>Color Calibration:</strong> Upload sRGB/Display-P3 photographs. Shaders preserve tonal range and paper grain.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#181817]/10 flex items-center justify-center text-[10px] font-mono text-[#C5A880] font-semibold shrink-0">
                  2
                </span>
                <p>
                  <strong>Matte Borders:</strong> Standard 80mm-100mm museum passe-partout provides archival presence on large displays.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#181817]/10 flex items-center justify-center text-[10px] font-mono text-emerald-600 font-semibold shrink-0">
                  3
                </span>
                <p>
                  <strong>EXIF Telemetry:</strong> Automatic extraction populates camera, lens, f-stop, and shutter speed for the live viewfinder bar.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#181817]/10">
              <Link to="/admin/media">
                <Button className="w-full bg-[#FAF8F5] hover:bg-white text-[#181817] border border-[#181817]/15 text-xs font-mono uppercase tracking-wider h-10 gap-2">
                  <span>Upload New Portfolio Piece</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9381E]" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
