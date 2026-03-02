import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Search, Eye, ChevronLeft, ChevronRight, Archive, Trash2 } from "lucide-react";
import { format, startOfWeek, endOfWeek, isToday, parseISO } from "date-fns";
import { Reservation, STATUS_COLORS, fromBookingRow } from "@/lib/reservations";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PER_PAGE = 15;

const AdminReservations = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setReservations(data.map(fromBookingRow));
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const stats = useMemo(() => ({
    total: reservations.length,
    today: reservations.filter((r) => r.date_of_visit === todayStr).length,
    pending: reservations.filter((r) => r.status === "pending").length,
    thisWeek: reservations.filter((r) => {
      const d = parseISO(r.date_of_visit);
      return d >= weekStart && d <= weekEnd;
    }).length,
  }), [reservations]);

  const filtered = useMemo(() => {
    let list = reservations;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.contact_number.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reservations, statusFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Reservation ${newStatus}.` });
      fetchReservations();
      if (selectedReservation?.id === id) setSelectedReservation((p) => p ? { ...p, status: newStatus } : null);
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this reservation?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Reservation permanently deleted." });
      fetchReservations();
      if (selectedReservation?.id === id) setSelectedReservation(null);
    }
  };

  const saveNotes = async () => {
    if (!selectedReservation) return;
    const { error } = await supabase.from("bookings").update({ notes: adminNotes }).eq("id", selectedReservation.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Notes saved" });
      fetchReservations();
      setSelectedReservation((p) => p ? { ...p, admin_notes: adminNotes } : null);
    }
  };

  const openDetails = (r: Reservation) => {
    setSelectedReservation(r);
    setAdminNotes(r.admin_notes || "");
  };

  const cellStyle: React.CSSProperties = { padding: "10px 14px", fontSize: 11, fontFamily: "Montserrat", fontWeight: 300, color: "rgba(240,235,227,0.8)", borderBottom: "1px solid rgba(139,0,0,0.1)", whiteSpace: "nowrap" };
  const headStyle: React.CSSProperties = { ...cellStyle, color: "#CC0000", fontWeight: 700, fontSize: 9, letterSpacing: "2px", textTransform: "uppercase" };

  const statuses = ["all", "pending", "confirmed", "cancelled", "completed", "archived"];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total },
          { label: "Today", value: stats.today },
          { label: "Pending", value: stats.pending },
          { label: "This Week", value: stats.thisWeek },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-sm" style={{ background: "#151515", border: "1px solid rgba(139,0,0,0.15)" }}>
            <p className="font-body text-[9px] tracking-[2px] uppercase text-white/40">{s.label}</p>
            <p className="font-display text-2xl text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className="font-body font-bold text-[9px] tracking-[1.5px] uppercase px-3 py-1.5 rounded-sm transition-all duration-200"
              style={{
                background: statusFilter === s ? "rgba(139,0,0,0.3)" : "rgba(255,255,255,0.04)",
                color: statusFilter === s ? "#CC0000" : "rgba(240,235,227,0.5)",
                border: statusFilter === s ? "1px solid rgba(139,0,0,0.5)" : "1px solid transparent",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,0,0,0.15)" }}>
          <Search size={14} className="text-white/30" />
          <input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search by name, contact, or email..."
            className="flex-1 bg-transparent text-[12px] font-body text-white/80 placeholder:text-white/30 outline-none"
          />
        </div>
        <button onClick={fetchReservations} className="flex items-center gap-1.5 font-body text-[9px] tracking-[2px] uppercase px-3 py-2" style={{ color: "#8B0000", background: "none", border: "1px solid rgba(139,0,0,0.3)", cursor: "pointer" }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Count */}
      <p className="font-body font-semibold text-[10px] tracking-[3px] uppercase mb-3" style={{ color: "rgba(240,235,227,0.5)" }}>
        {filtered.length} reservation{filtered.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <p className="font-body text-[12px]" style={{ color: "rgba(240,235,227,0.5)" }}>Loading reservations...</p>
      ) : filtered.length === 0 ? (
        <p className="font-body text-[12px]" style={{ color: "rgba(240,235,227,0.5)" }}>No reservations found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto" style={{ border: "1px solid rgba(139,0,0,0.2)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#1C0000" }}>
                  <th style={headStyle}>Date</th>
                  <th style={headStyle}>Time</th>
                  <th style={headStyle}>Name</th>
                  <th style={headStyle}>Contact</th>
                  <th style={headStyle}>Pax</th>
                  <th style={headStyle}>Table</th>
                  <th style={headStyle}>Status</th>
                  <th style={headStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }} className="hover:bg-[rgba(139,0,0,0.06)] transition-colors">
                    <td style={cellStyle}>{format(parseISO(r.date_of_visit), "MMM d, yyyy")}</td>
                    <td style={cellStyle}>{r.time_of_arrival}</td>
                    <td style={cellStyle}>{r.full_name}</td>
                    <td style={cellStyle}>{r.contact_number}</td>
                    <td style={cellStyle}>{r.number_of_pax}</td>
                    <td style={{ ...cellStyle, whiteSpace: "normal", maxWidth: 160, fontSize: 10 }}>{r.table_type}</td>
                    <td style={cellStyle}>
                      <span className="font-body font-bold text-[9px] tracking-[1px] uppercase px-2 py-1 rounded-sm" style={{ background: STATUS_COLORS[r.status]?.bg, color: STATUS_COLORS[r.status]?.text }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <div className="flex gap-1.5">
                        {r.status === "pending" && (
                          <>
                            <ActionBtn label="Confirm" color="#00AA00" onClick={() => updateStatus(r.id, "confirmed")} />
                            <ActionBtn label="Cancel" color="#CC0000" onClick={() => updateStatus(r.id, "cancelled")} />
                          </>
                        )}
                        {r.status === "confirmed" && (
                          <ActionBtn label="Complete" color="#0088CC" onClick={() => updateStatus(r.id, "completed")} />
                        )}
                        {r.status !== "archived" && (
                          <button onClick={() => updateStatus(r.id, "archived")} className="p-1 rounded hover:bg-white/10 transition-colors" title="Archive">
                            <Archive size={14} className="text-amber-500/60" />
                          </button>
                        )}
                        <button onClick={() => deleteReservation(r.id)} className="p-1 rounded hover:bg-white/10 transition-colors" title="Delete">
                          <Trash2 size={14} className="text-red-500/60" />
                        </button>
                        <button onClick={() => openDetails(r)} className="p-1 rounded hover:bg-white/10 transition-colors" title="View">
                          <Eye size={14} className="text-white/50" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {paginated.map((r) => (
              <div key={r.id} className="p-4 rounded-sm" style={{ background: "#151515", border: "1px solid rgba(139,0,0,0.15)" }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-body font-bold text-[13px] text-white">{r.full_name}</p>
                    <p className="font-body text-[11px] text-white/50">{r.contact_number}</p>
                  </div>
                  <span className="font-body font-bold text-[8px] tracking-[1px] uppercase px-2 py-1 rounded-sm" style={{ background: STATUS_COLORS[r.status]?.bg, color: STATUS_COLORS[r.status]?.text }}>
                    {r.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 mb-3">
                  <p className="font-body text-[10px] text-white/40">Date: <span className="text-white/70">{format(parseISO(r.date_of_visit), "MMM d, yyyy")}</span></p>
                  <p className="font-body text-[10px] text-white/40">Time: <span className="text-white/70">{r.time_of_arrival}</span></p>
                  <p className="font-body text-[10px] text-white/40">Pax: <span className="text-white/70">{r.number_of_pax}</span></p>
                  <p className="font-body text-[10px] text-white/40">Table: <span className="text-white/70">{r.table_type}</span></p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {r.status === "pending" && (
                    <>
                      <ActionBtn label="Confirm" color="#00AA00" onClick={() => updateStatus(r.id, "confirmed")} />
                      <ActionBtn label="Cancel" color="#CC0000" onClick={() => updateStatus(r.id, "cancelled")} />
                    </>
                  )}
                  {r.status === "confirmed" && (
                    <ActionBtn label="Complete" color="#0088CC" onClick={() => updateStatus(r.id, "completed")} />
                  )}
                  {r.status !== "archived" && (
                    <ActionBtn label="Archive" color="#D4A017" onClick={() => updateStatus(r.id, "archived")} />
                  )}
                  <ActionBtn label="Delete" color="#CC0000" onClick={() => deleteReservation(r.id)} />
                  <button onClick={() => openDetails(r)} className="font-body text-[9px] tracking-[1px] uppercase px-2 py-1 rounded-sm transition-colors" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(240,235,227,0.6)" }}>
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 text-white/50 disabled:opacity-20 hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="font-body text-[11px] text-white/50">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 text-white/50 disabled:opacity-20 hover:text-white transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">Reservation Details</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Name", selectedReservation.full_name],
                  ["Email", selectedReservation.email],
                  ["Contact", selectedReservation.contact_number],
                  ["Date", format(parseISO(selectedReservation.date_of_visit), "MMMM d, yyyy")],
                  ["Time", selectedReservation.time_of_arrival],
                  ["Pax", String(selectedReservation.number_of_pax)],
                  ["Table", selectedReservation.table_type],
                  ["Status", selectedReservation.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="font-body text-[9px] tracking-[2px] uppercase text-white/40">{label}</p>
                    <p className="font-body text-[12px] text-white/80">{value}</p>
                  </div>
                ))}
              </div>
              {selectedReservation.special_requests && (
                <div>
                  <p className="font-body text-[9px] tracking-[2px] uppercase text-white/40">Special Requests</p>
                  <p className="font-body text-[12px] text-white/80">{selectedReservation.special_requests}</p>
                </div>
              )}
              <div>
                <p className="font-body text-[9px] tracking-[2px] uppercase text-white/40 mb-1">Admin Notes</p>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded p-3 text-[12px] font-body text-white/80 placeholder:text-white/30 outline-none focus:border-[#8B0000]"
                  placeholder="Add internal notes..."
                />
                <button onClick={saveNotes} className="mt-2 font-body font-bold text-[9px] tracking-[2px] uppercase px-4 py-2 rounded-sm transition-all duration-200 text-white" style={{ background: "#8B0000" }}>
                  Save Notes
                </button>
              </div>
              <p className="font-body text-[10px] text-white/30">Submitted: {format(parseISO(selectedReservation.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ActionBtn = ({ label, color, onClick }: { label: string; color: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="font-body font-bold text-[8px] tracking-[1px] uppercase px-2 py-1 rounded-sm transition-all duration-200 hover:opacity-80"
    style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
  >
    {label}
  </button>
);

export default AdminReservations;
