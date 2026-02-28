import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  contact: string;
  date: string;
  time: string;
  guests: string;
  occasion: string;
  notes: string;
  status: string;
  created_at: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (!error && data) setBookings(data as Booking[]);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const cellStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: 11,
    fontFamily: "Montserrat",
    fontWeight: 300,
    color: "rgba(240,235,227,0.8)",
    borderBottom: "1px solid rgba(139,0,0,0.1)",
    whiteSpace: "nowrap",
  };

  const headStyle: React.CSSProperties = {
    ...cellStyle,
    color: "#CC0000",
    fontWeight: 700,
    fontSize: 9,
    letterSpacing: "2px",
    textTransform: "uppercase",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-body font-semibold text-[10px] tracking-[3px] uppercase" style={{ color: "rgba(240,235,227,0.5)" }}>
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-1.5 font-body text-[9px] tracking-[2px] uppercase transition-colors duration-200"
          style={{ color: "#8B0000", background: "none", border: "none", cursor: "pointer" }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="font-body text-[12px]" style={{ color: "rgba(240,235,227,0.5)" }}>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="font-body text-[12px]" style={{ color: "rgba(240,235,227,0.5)" }}>No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto" style={{ border: "1px solid rgba(139,0,0,0.2)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#1C0000" }}>
                <th style={headStyle}>Name</th>
                <th style={headStyle}>Contact</th>
                <th style={headStyle}>Date</th>
                <th style={headStyle}>Time</th>
                <th style={headStyle}>Guests</th>
                <th style={headStyle}>Occasion</th>
                <th style={headStyle}>Notes</th>
                <th style={headStyle}>Status</th>
                <th style={headStyle}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[rgba(139,0,0,0.06)] transition-colors">
                  <td style={cellStyle}>{b.name}</td>
                  <td style={cellStyle}>{b.contact}</td>
                  <td style={cellStyle}>{b.date}</td>
                  <td style={cellStyle}>{b.time}</td>
                  <td style={cellStyle}>{b.guests}</td>
                  <td style={cellStyle}>{b.occasion}</td>
                  <td style={{ ...cellStyle, whiteSpace: "normal", maxWidth: 200 }}>{b.notes || "—"}</td>
                  <td style={cellStyle}>
                    <span className="font-body font-bold text-[9px] tracking-[1px] uppercase px-2 py-1" style={{
                      background: b.status === "confirmed" ? "rgba(0,139,0,0.2)" : "rgba(139,139,0,0.2)",
                      color: b.status === "confirmed" ? "#00CC00" : "#CCCC00",
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={cellStyle}>{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
