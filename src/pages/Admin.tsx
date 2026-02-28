import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminEventEditor from "@/components/admin/AdminEventEditor";
import AdminBookings from "@/components/admin/AdminBookings";
import AdminZonePhotos from "@/components/admin/AdminZonePhotos";
import AdminContactInfo from "@/components/admin/AdminContactInfo";

const ADMIN_PASSWORD = "AUXILIARY";

const Admin = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "bookings" | "zone" | "contact">("events");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0A0000" }}>
        <form onSubmit={handleLogin} className="w-full max-w-[360px] flex flex-col items-center gap-6">
          <img src="https://i.imgur.com/HKLn00w.png" alt="Logo" className="w-32 object-contain" />
          <p className="font-body font-semibold text-[9px] tracking-[4px] uppercase" style={{ color: "#CC0000" }}>ADMIN ACCESS</p>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Enter password"
            className="w-full font-body text-[13px] outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: error ? "1px solid #CC0000" : "1px solid rgba(139,0,0,0.3)",
              color: "#FFFFFF",
              padding: "14px 18px",
            }}
            autoFocus
          />
          {error && <p className="font-body text-[11px]" style={{ color: "#CC0000" }}>Incorrect password</p>}
          <button
            type="submit"
            className="w-full font-body font-bold text-[11px] tracking-[3px] uppercase py-3 transition-all duration-200"
            style={{ background: "#8B0000", color: "#FFFFFF" }}
          >
            ENTER
          </button>
        </form>
      </div>
    );
  }

  const tabs = [
    { key: "events" as const, label: "EVENT CARDS" },
    { key: "bookings" as const, label: "BOOKINGS" },
    { key: "zone" as const, label: "ZONE PHOTOS" },
    { key: "contact" as const, label: "CONTACT INFO" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0A0000" }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-body font-semibold text-[11px] tracking-[2px] uppercase transition-colors duration-200"
            style={{ color: "rgba(240,235,227,0.6)", background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#CC0000"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(240,235,227,0.6)"}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <p className="font-body font-semibold text-[9px] tracking-[4px] uppercase" style={{ color: "#CC0000" }}>ADMIN PANEL</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 md:gap-6 mb-8 overflow-x-auto" style={{ borderBottom: "1px solid rgba(139,0,0,0.2)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="font-body font-bold text-[9px] md:text-[10px] tracking-[2px] md:tracking-[3px] uppercase pb-3 transition-colors duration-200 whitespace-nowrap"
              style={{
                color: activeTab === tab.key ? "#CC0000" : "rgba(240,235,227,0.5)",
                background: "none",
                border: "none",
                borderBottomWidth: 2,
                borderBottomStyle: "solid",
                borderBottomColor: activeTab === tab.key ? "#CC0000" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "events" && <AdminEventEditor />}
        {activeTab === "bookings" && <AdminBookings />}
        {activeTab === "zone" && <AdminZonePhotos />}
        {activeTab === "contact" && <AdminContactInfo />}
      </div>
    </div>
  );
};

export default Admin;
