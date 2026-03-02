import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import { getSettings, setSetting } from "@/lib/settings";

export interface SiteInfo {
  address: string;
  address_sub: string;
  contact: string;
  instagram: string;
  instagram_url: string;
  facebook: string;
  facebook_url: string;
  hours: string;
  directions_url: string;
}

export const DEFAULT_SITE_INFO: SiteInfo = {
  address: "No. 7 Buenamar Road, Dona Isaura Village, Brgy. Novaliches Proper, Quezon City 1123",
  address_sub: "(Across Novaliches Proper Barangay Hall)",
  contact: "0951 081 5806",
  instagram: "@auxiliarybar_lounge",
  instagram_url: "https://www.instagram.com/auxiliarybar_lounge",
  facebook: "Auxiliary Bar and Lounge",
  facebook_url: "https://www.facebook.com/profile.php?id=61581380972061",
  hours: "Open Daily · 5:00 PM – 2:00 AM",
  directions_url: "https://share.google/JQiUAJQYR01e2kkXN",
};

const SITE_KEYS: { key: keyof SiteInfo; dbKey: string }[] = [
  { key: "address", dbKey: "site_address" },
  { key: "address_sub", dbKey: "site_address_sub" },
  { key: "contact", dbKey: "site_contact" },
  { key: "instagram", dbKey: "site_instagram" },
  { key: "instagram_url", dbKey: "site_instagram_url" },
  { key: "facebook", dbKey: "site_facebook" },
  { key: "facebook_url", dbKey: "site_facebook_url" },
  { key: "hours", dbKey: "site_hours" },
  { key: "directions_url", dbKey: "site_directions_url" },
];

// Fetch site info from database
export const getSiteInfo = async (): Promise<SiteInfo> => {
  try {
    const dbKeys = SITE_KEYS.map((k) => k.dbKey);
    const settings = await getSettings(dbKeys);
    const info: SiteInfo = { ...DEFAULT_SITE_INFO };
    for (const { key, dbKey } of SITE_KEYS) {
      if (settings[dbKey]) info[key] = settings[dbKey];
    }
    return info;
  } catch {
    return DEFAULT_SITE_INFO;
  }
};

const FIELDS: { key: keyof SiteInfo; label: string }[] = [
  { key: "address", label: "Address" },
  { key: "address_sub", label: "Address Note" },
  { key: "contact", label: "Contact Number" },
  { key: "instagram", label: "Instagram Handle" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "facebook", label: "Facebook Name" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "hours", label: "Operating Hours" },
  { key: "directions_url", label: "Directions URL" },
];

const AdminContactInfo = () => {
  const { toast } = useToast();
  const [info, setInfo] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getSiteInfo();
      setInfo(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (key: keyof SiteInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        SITE_KEYS.map(({ key, dbKey }) => setSetting(dbKey, info[key]))
      );
      toast({ title: "Contact info saved!" });
    } catch {
      toast({ title: "Error saving contact info", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

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
    textTransform: "uppercase",
    fontFamily: "Montserrat",
    marginBottom: 4,
    display: "block",
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/40 font-body text-[12px]">
        <Loader2 size={14} className="animate-spin" /> Loading contact info…
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="space-y-4">
        {FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            <input
              value={info[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 flex items-center justify-center gap-2 font-body font-bold text-[10px] tracking-[2px] uppercase px-8 py-2.5 transition-all duration-200 disabled:opacity-50"
        style={{ background: "#8B0000", color: "#FFFFFF" }}
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saving ? "SAVING..." : "SAVE CHANGES"}
      </button>
    </div>
  );
};

export default AdminContactInfo;
