import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import AdminEventEditor from "@/components/admin/AdminEventEditor";
import AdminReservations from "@/components/admin/AdminReservations";
import AdminZonePhotos from "@/components/admin/AdminZonePhotos";
import AdminContactInfo from "@/components/admin/AdminContactInfo";
import AdminSettings from "@/components/admin/AdminSettings";

const ADMIN_PASSWORD = "AUXILIARY";
const REMEMBER_KEY = "auxiliary_admin_remember";

const Admin = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem(REMEMBER_KEY) === "true";
  });
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem(REMEMBER_KEY));
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "reservations" | "zone" | "contact" | "settings">("events");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError(false);
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, "true");
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
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
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              className="w-full font-body text-[13px] outline-none pr-12"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: error ? "1px solid #CC0000" : "1px solid rgba(139,0,0,0.3)",
                color: "#FFFFFF",
                padding: "14px 18px",
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "rgba(240,235,227,0.4)", background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "rgba(240,235,227,0.7)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(240,235,227,0.4)"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p className="font-body text-[11px]" style={{ color: "#CC0000" }}>Incorrect password</p>}
          <label className="flex items-center gap-2 cursor-pointer self-start">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#8B0000] w-4 h-4"
            />
            <span className="font-body text-[11px]" style={{ color: "rgba(240,235,227,0.6)" }}>Remember me</span>
          </label>
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
    { key: "reservations" as const, label: "RESERVATIONS" },
    { key: "zone" as const, label: "ZONE PHOTOS" },
    { key: "contact" as const, label: "CONTACT INFO" },
    { key: "settings" as const, label: "SETTINGS" },
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="font-body font-bold text-[10px] md:text-[11px] tracking-[2px] uppercase py-3 px-4 rounded-sm transition-all duration-200"
              style={{
                color: activeTab === tab.key ? "#FFFFFF" : "rgba(240,235,227,0.5)",
                background: activeTab === tab.key ? "rgba(139,0,0,0.4)" : "rgba(255,255,255,0.04)",
                border: activeTab === tab.key ? "1px solid rgba(139,0,0,0.6)" : "1px solid rgba(139,0,0,0.15)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "events" && <AdminEventEditor />}
        {activeTab === "reservations" && <AdminReservations />}
        {activeTab === "zone" && <AdminZonePhotos />}
        {activeTab === "contact" && <AdminContactInfo />}
        {activeTab === "settings" && <AdminSettings />}

      </div>
    </div>
  );
};

export default Admin;
