import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import { TABLE_TYPES } from "@/lib/reservations";
import { getSettings, setSetting } from "@/lib/settings";

// Async getters for GCash info (used by PaymentStep)
export const getGcashNumber = async (): Promise<string> => {
  const { getSetting } = await import("@/lib/settings");
  const val = await getSetting("gcash_number");
  return val || "0917 123 4567";
};

export const getGcashName = async (): Promise<string> => {
  const { getSetting } = await import("@/lib/settings");
  const val = await getSetting("gcash_name");
  return val || "Auxiliary Bar";
};

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gcashNumber, setGcashNumber] = useState("");
  const [gcashName, setGcashName] = useState("");
  const [bookingClosed, setBookingClosed] = useState(false);
  const [closedMessage, setClosedMessage] = useState("");
  const [tableRates, setTableRates] = useState<Record<string, number>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settings = await getSettings([
        "gcash_number", "gcash_name", "booking_closed", "booking_closed_message", "table_rates"
      ]);
      setGcashNumber(settings.gcash_number || "0917 123 4567");
      setGcashName(settings.gcash_name || "Auxiliary Bar");
      setBookingClosed(settings.booking_closed === "true");
      setClosedMessage(settings.booking_closed_message || "Reservations are currently closed. Please check back later.");
      try {
        setTableRates(JSON.parse(settings.table_rates || "{}"));
      } catch {
        setTableRates({});
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        setSetting("gcash_number", gcashNumber),
        setSetting("gcash_name", gcashName),
        setSetting("booking_closed", bookingClosed ? "true" : "false"),
        setSetting("booking_closed_message", closedMessage),
        setSetting("table_rates", JSON.stringify(tableRates)),
      ]);
      toast({ title: "Settings saved!" });
    } catch {
      toast({ title: "Error saving settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRateChange = (key: string, value: string) => {
    const num = parseInt(value);
    if (value === "" || !isNaN(num)) {
      setTableRates(prev => ({ ...prev, [key]: num || 0 }));
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

  const sectionTitle = "font-body font-bold text-[9px] tracking-[3px] uppercase text-white/40 mb-4";

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/40 font-body text-[12px]">
        <Loader2 size={14} className="animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-10">
      {/* Booking Status */}
      <div>
        <p className={sectionTitle}>BOOKING STATUS</p>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setBookingClosed(!bookingClosed)}
            className="relative w-12 h-6 rounded-full transition-colors duration-200"
            style={{ background: bookingClosed ? "#8B0000" : "#2D7D2D" }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
              style={{ left: bookingClosed ? 26 : 2 }}
            />
          </button>
          <span className="font-body text-[12px] text-white/70">
            {bookingClosed ? "Bookings CLOSED" : "Bookings OPEN"}
          </span>
        </div>
        {bookingClosed && (
          <div>
            <label style={labelStyle}>Closed Message</label>
            <textarea
              value={closedMessage}
              onChange={(e) => setClosedMessage(e.target.value)}
              style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
              placeholder="Message shown when bookings are closed"
            />
          </div>
        )}
      </div>

      {/* Table Rates */}
      <div>
        <p className={sectionTitle}>TABLE RATES</p>
        <div className="space-y-3">
          {TABLE_TYPES.map((t) => (
            <div key={t.value} className="flex items-center gap-4">
              <span className="font-body text-[11px] text-white/60 w-48 shrink-0">{t.label}</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[12px] font-body">₱</span>
                <input
                  type="number"
                  value={tableRates[t.value] ?? t.price}
                  onChange={(e) => handleRateChange(t.value, e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 24 }}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GCash Settings */}
      <div>
        <p className={sectionTitle}>GCASH PAYMENT SETTINGS</p>
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
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 font-body font-bold text-[10px] tracking-[2px] uppercase px-8 py-2.5 transition-all duration-200 disabled:opacity-50"
        style={{ background: "#8B0000", color: "#FFFFFF" }}
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saving ? "SAVING..." : "SAVE CHANGES"}
      </button>
    </div>
  );
};

export default AdminSettings;
