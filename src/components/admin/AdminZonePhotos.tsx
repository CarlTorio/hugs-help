import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSetting, setSetting } from "@/lib/settings";

const MAX_PHOTOS = 20;

const DEFAULT_PHOTOS = [
  "https://i.imgur.com/0Dhizhi.jpeg",
  "https://i.imgur.com/OY2szyb.jpeg",
  "https://i.imgur.com/x8R9AKQ.jpeg",
  "https://i.imgur.com/6XUaBES.jpeg",
  "https://i.imgur.com/KM3bpwp.jpeg",
  "https://i.imgur.com/YIKG10V.jpeg",
  "https://i.imgur.com/grk9EHX.jpeg",
  "https://i.imgur.com/b3eCPi0.jpeg",
  "https://i.imgur.com/iN0I9Qu.jpeg",
  "https://i.imgur.com/Xjt2UbG.jpeg",
];

const AdminZonePhotos = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const raw = await getSetting("zone_photos");
      if (raw) {
        setPhotos(JSON.parse(raw));
      } else {
        setPhotos(DEFAULT_PHOTOS);
      }
    } catch {
      setPhotos(DEFAULT_PHOTOS);
    } finally {
      setLoading(false);
    }
  };

  const save = async (updated: string[]) => {
    setPhotos(updated);
    const ok = await setSetting("zone_photos", JSON.stringify(updated));
    if (ok) {
      toast({ title: "Zone photos saved!" });
    } else {
      toast({ title: "Error saving photos", variant: "destructive" });
    }
  };

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    if (photos.length >= MAX_PHOTOS) {
      toast({ title: "Maximum 20 photos", variant: "destructive" });
      return;
    }
    save([...photos, newUrl.trim()]);
    setNewUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      toast({ title: "Maximum 20 photos reached", variant: "destructive" });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of filesToUpload) {
        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from("zone-photos")
          .upload(fileName, file, { contentType: file.type });

        if (error) {
          console.error("Upload error:", error);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("zone-photos")
          .getPublicUrl(fileName);

        newUrls.push(urlData.publicUrl);
      }

      if (newUrls.length > 0) {
        await save([...photos, ...newUrls]);
        toast({ title: `${newUrls.length} photo(s) uploaded!` });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = (index: number) => {
    save(photos.filter((_, i) => i !== index));
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(139,0,0,0.3)",
    color: "#FFFFFF",
    padding: "10px 14px",
    fontSize: 12,
    fontFamily: "Montserrat",
    fontWeight: 300,
    outline: "none",
    flex: 1,
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/40 font-body text-[12px]">
        <Loader2 size={14} className="animate-spin" /> Loading photos…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-body font-semibold text-[10px] tracking-[3px] uppercase" style={{ color: "rgba(240,235,227,0.5)" }}>
          {photos.length}/{MAX_PHOTOS} photos
        </p>
      </div>

      {/* Upload photos */}
      <div className="flex gap-2 mb-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || photos.length >= MAX_PHOTOS}
          className="flex items-center gap-1.5 font-body font-bold text-[10px] tracking-[2px] uppercase px-5 py-2.5 transition-all duration-200 disabled:opacity-50"
          style={{ background: "#8B0000", color: "#FFFFFF" }}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "UPLOADING..." : "UPLOAD PHOTOS"}
        </button>
      </div>

      {/* Add by URL */}
      <div className="flex gap-2 mb-6">
        <input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Or paste image URL..."
          style={inputStyle}
        />
        <button
          onClick={handleAdd}
          disabled={photos.length >= MAX_PHOTOS}
          className="flex items-center gap-1.5 font-body font-bold text-[10px] tracking-[2px] uppercase px-4 py-2.5 transition-all duration-200 disabled:opacity-50"
          style={{ background: "#8B0000", color: "#FFFFFF" }}
        >
          <Plus size={14} />
          ADD
        </button>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((url, i) => (
          <div key={i} className="relative group aspect-square overflow-hidden" style={{ background: "#2A0000", border: "1px solid rgba(139,0,0,0.2)" }}>
            <img src={url} alt={`Zone ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => handleDelete(i)}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(200,0,0,0.9)" }}
            >
              <Trash2 size={14} color="#fff" />
            </button>
            <div className="absolute bottom-1 left-1 font-body text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.7)", color: "rgba(240,235,227,0.6)" }}>
              #{i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminZonePhotos;
