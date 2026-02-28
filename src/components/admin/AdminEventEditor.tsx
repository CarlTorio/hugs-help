import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Save } from "lucide-react";

interface EventSlot {
  id: string;
  slot: number;
  image_url: string | null;
  date_label: string;
  title: string;
  description: string;
}

const AdminEventEditor = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<EventSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*").order("slot", { ascending: true });
    if (!error && data) setEvents(data as EventSlot[]);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleChange = (slot: number, field: keyof EventSlot, value: string) => {
    setEvents((prev) => prev.map((e) => (e.slot === slot ? { ...e, [field]: value } : e)));
  };

  const handleImageUpload = async (slot: number, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `slot-${slot}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("event-images").upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      return;
    }

    const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(path);
    handleChange(slot, "image_url", urlData.publicUrl);
  };

  const handleDeleteImage = async (slot: number) => {
    const ev = events.find((e) => e.slot === slot);
    if (!ev?.image_url) return;

    // Try to delete from storage if it's our bucket
    if (ev.image_url.includes("event-images")) {
      const pathParts = ev.image_url.split("/event-images/");
      if (pathParts[1]) {
        await supabase.storage.from("event-images").remove([pathParts[1]]);
      }
    }

    handleChange(slot, "image_url", "");
    // Save immediately
    await supabase.from("events").update({ image_url: null }).eq("slot", slot);
    toast({ title: "Image deleted" });
  };

  const handleSave = async (slot: number) => {
    setSaving(slot);
    const ev = events.find((e) => e.slot === slot);
    if (!ev) return;

    const { error } = await supabase.from("events").update({
      image_url: ev.image_url || null,
      date_label: ev.date_label,
      title: ev.title,
      description: ev.description,
    }).eq("slot", slot);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Slot ${slot} saved!` });
    }
    setSaving(null);
  };

  if (loading) {
    return <p className="font-body text-[12px]" style={{ color: "rgba(240,235,227,0.5)" }}>Loading events...</p>;
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(139,0,0,0.3)",
    color: "#FFFFFF",
    padding: "10px 14px",
    width: "100%",
    fontSize: 12,
    fontFamily: "Montserrat",
    fontWeight: 300,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    color: "#CC0000",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    fontFamily: "Montserrat",
    marginBottom: 4,
    display: "block",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {events.map((ev) => (
        <div key={ev.slot} className="p-5" style={{ background: "#1C0000", border: "1px solid rgba(139,0,0,0.2)" }}>
          <p className="font-body font-bold text-[10px] tracking-[3px] mb-4" style={{ color: "#CC0000" }}>
            SLOT {ev.slot}
          </p>

          {/* Image */}
          <div className="h-[160px] mb-4 overflow-hidden relative group" style={{ background: "#2A0000" }}>
            {ev.image_url ? (
              <>
                <img src={ev.image_url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDeleteImage(ev.slot)}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(200,0,0,0.9)" }}
                >
                  <Trash2 size={14} color="#fff" />
                </button>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-2">
                <Upload size={20} color="#8B0000" />
                <span className="font-body text-[10px]" style={{ color: "rgba(240,235,227,0.4)" }}>Upload image</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(ev.slot, e.target.files[0]); }} />
              </label>
            )}
          </div>

          {/* If has image, show upload replacement */}
          {ev.image_url && (
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <Upload size={12} color="#8B0000" />
              <span className="font-body text-[9px] tracking-[1px] uppercase" style={{ color: "#8B0000" }}>Replace image</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(ev.slot, e.target.files[0]); }} />
            </label>
          )}

          <div className="space-y-3">
            <div>
              <label style={labelStyle}>Date Label</label>
              <input value={ev.date_label} onChange={(e) => handleChange(ev.slot, "date_label", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Title</label>
              <input value={ev.title} onChange={(e) => handleChange(ev.slot, "title", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={ev.description} onChange={(e) => handleChange(ev.slot, "description", e.target.value)} rows={3} style={inputStyle} />
            </div>
          </div>

          <button
            onClick={() => handleSave(ev.slot)}
            disabled={saving === ev.slot}
            className="mt-4 w-full flex items-center justify-center gap-2 font-body font-bold text-[10px] tracking-[2px] uppercase py-2.5 transition-all duration-200 disabled:opacity-50"
            style={{ background: "#8B0000", color: "#FFFFFF" }}
          >
            <Save size={14} />
            {saving === ev.slot ? "SAVING..." : "SAVE"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminEventEditor;
