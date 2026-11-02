import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, Sparkles, Loader2, ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Authenticated",
        description: "Welcome back to Sanwaliya Studio Admin.",
      });
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Access Denied",
        description: error.response?.data?.error || "Invalid credentials provided.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4 text-[#181817] font-sans relative overflow-hidden selection:bg-[#D9381E] selection:text-white">
      {/* Sunlit Soft Vignette */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C5A880]/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Back to Site link */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-xs uppercase tracking-widest text-[#6E6A63] hover:text-[#181817] transition-colors font-mono"
      >
        <ArrowLeft className="w-4 h-4 text-[#D9381E]" />
        <span>Return to Live Atelier</span>
      </Link>

      <Card className="w-full max-w-md bg-white/90 border border-[#181817]/10 shadow-2xl backdrop-blur-2xl text-[#181817] z-10 rounded-3xl">
        <CardHeader className="flex flex-col items-center space-y-3 pb-6 border-b border-[#181817]/10">
          <div className="h-14 w-14 rounded-full bg-[#181817] text-white flex items-center justify-center text-sm font-serif font-semibold shadow-md">
            SP
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="font-serif text-3xl font-normal text-[#181817]">
              Studio Portal
            </CardTitle>
            <CardDescription className="text-xs font-mono text-[#6E6A63] uppercase tracking-widest">
              Sanwaliya Photo Studio &middot; 3D Engine Admin
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A63]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sanwaliyastudio.com"
                  required
                  className="pl-10 bg-[#FAF8F5] border-[#181817]/15 text-[#181817] placeholder:text-[#6E6A63]/50 h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono block">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A63]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="pl-10 bg-[#FAF8F5] border-[#181817]/15 text-[#181817] placeholder:text-[#6E6A63]/50 h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#181817] text-[#FAF8F5] hover:bg-[#2b2b29] uppercase tracking-widest text-xs font-semibold h-11 shadow-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
                  <span>Verifying Credentials...</span>
                </span>
              ) : (
                <span>Access Daylight Atelier Suite</span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#181817]/10 text-center">
            <p className="text-[11px] text-[#6E6A63] font-mono">
              Protected by TLS encryption &amp; JWT authentication.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
