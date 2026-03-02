import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export const getGcashNumber = (): string => {
  return localStorage.getItem("gcash_number") || "0917 123 4567";
};

export const getGcashName = (): string => {
  return localStorage.getItem("gcash_name") || "Auxiliary Bar";
};

const AdminSettings = () => {
  const { toast } = useToast();
  const [gcashNumber, setGcashNumber] = useState("");
  const [gcashName, setGcashName] = useState("");

  useEffect(() => {
    setGcashNumber(getGcashNumber());
    setGcashName(getGcashName());
  }, []);

  const handleSave = () => {
    localStorage.setItem("gcash_number", gcashNumber);
    localStorage.setItem("gcash_name", gcashName);
    toast({ title: "GCash settings saved!" });
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

  return (
    <div className="max-w-2xl">
      <p className="font-body font-bold text-[9px] tracking-[3px] uppercase text-white/40 mb-6">GCASH PAYMENT SETTINGS</p>
      <div className="space-y-4">
        <div>
          <label style={labelStyle}>GCash Account Name</label>
          <input
            value={gcashName}
            onChange={(e) => setGcashName(e.target.value)}
            style={inputStyle}
            placeholder="e.g. Auxiliary Bar"
          />
        </div>
        <div>
          <label style={labelStyle}>GCash Number</label>
          <input
            value={gcashNumber}
            onChange={(e) => setGcashNumber(e.target.value)}
            style={inputStyle}
            placeholder="e.g. 0917 123 4567"
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        className="mt-6 flex items-center justify-center gap-2 font-body font-bold text-[10px] tracking-[2px] uppercase px-8 py-2.5 transition-all duration-200"
        style={{ background: "#8B0000", color: "#FFFFFF" }}
      >
        <Save size={14} />
        SAVE CHANGES
      </button>
    </div>
  );
};

export default AdminSettings;
