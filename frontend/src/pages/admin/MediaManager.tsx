import { useState, useEffect } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Mini3DPreview, FrameFinish, FrameSettings } from "@/components/admin/Mini3DPreview";
import { Plus, Trash2, Box, Image as ImageIcon, Video, Sparkles, Loader2 } from "lucide-react";

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Weddings");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState("IMAGE");
  const [videoUrl, setVideoUrl] = useState("");

  // 3D Physics & Frame Customization State
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
  const [custom3DSettings, setCustom3DSettings] = useState<FrameSettings>({
    frameFinish: "champagne",
    scale: 1.0,
    depth: 0.1,
    weight: 1.2,
    matteBorder: 0.09,
    sunAngle: 45,
  });

  const fetchMedia = async () => {
    try {
      const res = await api.get("/media?limit=100");
      setMedia(res.data.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Update image preview for mini 3D viewport when user picks file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    if (selectedFiles && selectedFiles.length > 0) {
      const objectUrl = URL.createObjectURL(selectedFiles[0]);
      setPreviewImageUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (type === "VIDEO" && videoUrl && (!files || files.length === 0)) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("type", type);
        formData.append("externalUrl", videoUrl);

        await api.post("/media/admin", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", files.length > 1 ? `${title} (${i + 1})` : title);
          formData.append("category", category);
          formData.append("description", description);
          formData.append("type", type);
          formData.append("frameFinish", custom3DSettings.frameFinish);
          formData.append("matteBorder", custom3DSettings.matteBorder.toString());

          await api.post("/media/admin", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      toast({
        title: "Photographic Asset Published",
        description: `Successfully added to the Daylight Atelier 3D collection.`,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFiles(null);
      setVideoUrl("");
      setPreviewImageUrl(undefined);
      setOpen(false);
      fetchMedia();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.response?.data?.error || "Error uploading media asset.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this piece from the 3D Atelier?")) return;

    // Optimistic UI Update: snapshot previous media and remove immediately from view
    const previousMedia = [...media];
    setMedia((prev) => prev.filter((item: any) => item.id !== id));

    try {
      await api.delete(`/media/admin/${id}`);
      toast({
        title: "Media Deleted",
        description: "The photographic asset was removed from the 3D collection.",
      });
    } catch (error: any) {
      // Automatic Rollback on failure
      setMedia(previousMedia);
      toast({
        title: "Deletion Reverted",
        description: error.response?.data?.error || "Network error. Restoring photographic asset.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#181817]">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#181817]/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D9381E] block mb-1">
            Daylight Atelier &middot; Media Registry
          </span>
          <h2 className="font-serif text-3xl font-normal text-[#181817]">
            Media &amp; 3D Studio Manager
          </h2>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#181817] text-[#FAF8F5] hover:bg-[#2b2b29] text-xs font-semibold uppercase tracking-wider h-11 px-5 shadow-md gap-2">
              <Plus className="w-4 h-4 text-[#D9381E]" />
              <span>Publish New 3D Frame</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-[#181817]/15 shadow-2xl text-[#181817] rounded-3xl p-6 sm:p-8">
            <DialogHeader className="pb-4 border-b border-[#181817]/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D9381E] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D9381E]">
                  Studio Publishing Suite
                </span>
              </div>
              <DialogTitle className="font-serif text-2xl font-normal text-[#181817]">
                Calibrate &amp; Publish 3D Photographic Frame
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              {/* Step 1: Live 3D Sunlit Viewport with Finish & Matte Calibration */}
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase tracking-wider text-[#6E6A63] block">
                  Step 1: Real-Time 3D Frame &amp; Sun-Angle Calibration
                </Label>
                <Mini3DPreview
                  imagePreviewUrl={previewImageUrl}
                  initialTitle={title || "Untitled Frame"}
                  initialCategory={category}
                  onSettingsChange={(settings) => setCustom3DSettings(settings)}
                />
              </div>

              {/* Step 2: Photographic Metadata & Files */}
              <div className="space-y-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[#181817]/10">
                <Label className="text-xs font-mono uppercase tracking-wider text-[#6E6A63] block">
                  Step 2: Photographic Metadata &amp; Files
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#181817]">Photo / Shoot Title *</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Royal Courtyard Vows"
                      required
                      className="bg-white border-[#181817]/15 text-[#181817]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#181817]">Portfolio Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-white border-[#181817]/15 text-[#181817]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#181817]/15 text-[#181817]">
                        <SelectItem value="Weddings">Weddings</SelectItem>
                        <SelectItem value="Pre-Wedding">Pre-Wedding</SelectItem>
                        <SelectItem value="Cinematic Videos">Cinematic Videos</SelectItem>
                        <SelectItem value="Candid">Candid</SelectItem>
                        <SelectItem value="Albums">Albums</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#181817]">Asset Type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="bg-white border-[#181817]/15 text-[#181817]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#181817]/15 text-[#181817]">
                        <SelectItem value="IMAGE">Still Photograph (3D Frame)</SelectItem>
                        <SelectItem value="VIDEO">Cinematic Video / Reel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {type === "IMAGE" ? (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-[#181817]">High-Res Color-Graded Photo *</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        required
                        className="bg-white border-[#181817]/15 text-[#181817] file:text-[#D9381E] file:bg-transparent file:border-0 font-mono text-xs"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-[#181817]">Video URL (YouTube/Vimeo)</Label>
                      <Input
                        placeholder="https://youtube.com/..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="bg-white border-[#181817]/15 text-[#181817]"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-[#181817]">Editorial Narrative / Story</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details about the lighting, couple, location, or rituals captured..."
                    rows={2}
                    className="bg-white border-[#181817]/15 text-[#181817]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#181817] text-[#FAF8F5] hover:bg-[#2b2b29] uppercase tracking-widest text-xs font-semibold h-12 shadow-xl"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
                    <span>Publishing &amp; Calibrating Physics...</span>
                  </span>
                ) : (
                  <span>Publish to User Antigravity Gallery</span>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Media Records Table */}
      <div className="rounded-2xl border border-[#181817]/10 bg-white/85 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAF8F5] border-b border-[#181817]/10">
            <TableRow className="border-[#181817]/10 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono">
                3D Plate
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono">
                Title
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono">
                Category
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono">
                Medium
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-[#6E6A63] font-mono text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-[#181817]/10">
                <TableCell colSpan={5} className="text-center py-12 text-[#6E6A63]">
                  <div className="flex items-center justify-center gap-2 font-mono text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-[#D9381E]" />
                    <span>Querying Media Registry...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : media.length === 0 ? (
              <TableRow className="border-[#181817]/10">
                <TableCell colSpan={5} className="text-center py-12 text-[#6E6A63] font-mono text-xs">
                  No custom items uploaded yet. Default 3D archive active.
                </TableCell>
              </TableRow>
            ) : (
              media.map((item: any) => (
                <TableRow key={item.id} className="border-[#181817]/10 hover:bg-[#FAF8F5]/50">
                  <TableCell className="w-16">
                    {item.type === "IMAGE" ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#181817]/10 bg-[#FAF8F5] p-1">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#181817]/10 flex items-center justify-center text-[#D9381E]">
                        <Video className="w-5 h-5" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-serif text-base text-[#181817]">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#181817]/10 text-[#6E6A63]">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-[#6E6A63]">
                    {item.type}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MediaManager;
