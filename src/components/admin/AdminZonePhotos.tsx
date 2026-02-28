import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Save } from "lucide-react";
import { getZonePhotos } from "@/pages/Zone";

const MAX_PHOTOS = 20;

const AdminZonePhotos = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    setPhotos(getZonePhotos());
  }, []);

  const save = (updated: string[]) => {
    setPhotos(updated);
    localStorage.setItem("zone_photos", JSON.stringify(updated));
    toast({ title: "Zone photos saved!" });
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-body font-semibold text-[10px] tracking-[3px] uppercase" style={{ color: "rgba(240,235,227,0.5)" }}>
          {photos.length}/{MAX_PHOTOS} photos
        </p>
      </div>

      {/* Add new photo */}
      <div className="flex gap-2 mb-6">
        <input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Paste image URL..."
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
