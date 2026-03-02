import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { format, getDay } from "date-fns";
import { CalendarIcon, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import {
  TABLE_TYPES,
  TIME_OPTIONS,
  PAX_OPTIONS,
  PRICING,
  isWeekend,
  validatePaxForTable,
  formatPeso,
  type ReservationInsert,
} from "@/lib/reservations";

const BookingSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    number_of_pax: "",
    date_of_visit: undefined as Date | undefined,
    time_of_arrival: "",
    table_type: "",
    special_requests: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (value) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.full_name.trim()) newErrors.full_name = "This field is required";
    if (!form.email.trim()) newErrors.email = "This field is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email address";
    if (!form.contact_number.trim()) newErrors.contact_number = "This field is required";
    if (!form.number_of_pax) newErrors.number_of_pax = "This field is required";
    if (!form.date_of_visit) newErrors.date_of_visit = "This field is required";
    if (!form.time_of_arrival) newErrors.time_of_arrival = "This field is required";
    if (!form.table_type) newErrors.table_type = "This field is required";

    // Validate pax vs table
    if (form.number_of_pax && form.table_type) {
      const warning = validatePaxForTable(parseInt(form.number_of_pax), form.table_type);
      if (warning) newErrors.table_type = warning;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data: ReservationInsert = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        contact_number: form.contact_number.trim(),
        number_of_pax: parseInt(form.number_of_pax),
        date_of_visit: format(form.date_of_visit!, "yyyy-MM-dd"),
        time_of_arrival: form.time_of_arrival,
        table_type: TABLE_TYPES.find((t) => t.value === form.table_type)?.label || form.table_type,
        special_requests: form.special_requests.trim() || null,
      };

      const { error } = await supabase.from("reservations" as any).insert(data as any);
      if (error) throw error;

      setShowSuccess(true);
      setForm({ full_name: "", email: "", contact_number: "", number_of_pax: "", date_of_visit: undefined, time_of_arrival: "", table_type: "", special_requests: "" });
      setErrors({});
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit reservation.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDayIsWeekend = form.date_of_visit ? isWeekend(form.date_of_visit) : null;

  const labelClass = "block font-body font-bold text-[9px] tracking-[2.5px] uppercase mb-1.5 text-[hsl(var(--primary))]";
  const inputClass = (field: string) =>
    cn(
      "w-full bg-[#1A1A1A] border px-4 py-3 text-[12px] font-body font-light text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:border-[hsl(var(--primary))] focus:shadow-[0_0_8px_rgba(139,0,0,0.3)]",
      errors[field] ? "border-red-500" : "border-white/10"
    );

  return (
    <section id="booking" className="py-[90px] max-[768px]:py-[40px] px-4 max-[768px]:px-3" style={{ background: "#130000" }}>
      <div className="max-w-[650px] mx-auto">
        <motion.div className="text-center mb-10 max-[768px]:mb-5" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase text-[hsl(var(--primary))]">RESERVATIONS</p>
          <h2 className="font-display text-[40px] max-[768px]:text-[24px] mt-2 max-[768px]:mt-1 text-white">Book Your Table</h2>
          <p className="font-body font-light text-[13px] max-[768px]:text-[11px] mt-2 max-[768px]:mt-1 text-white/50">Reserve your spot at Auxiliary. Fill out the form and we'll confirm your reservation.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5 max-[768px]:space-y-3">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-[768px]:gap-3">
            <div>
              <label className={labelClass}>Full Name</label>
              <input value={form.full_name} onChange={(e) => handleChange("full_name", e.target.value)} placeholder="Juan Dela Cruz" className={inputClass("full_name")} />
              {errors.full_name && <p className="text-red-500 text-[10px] font-body mt-1">{errors.full_name}</p>}
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="your@email.com" className={inputClass("email")} />
              {errors.email && <p className="text-red-500 text-[10px] font-body mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Contact & Pax */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-[768px]:gap-3">
            <div>
              <label className={labelClass}>Contact Number</label>
              <input value={form.contact_number} onChange={(e) => handleChange("contact_number", e.target.value)} placeholder="09XX XXX XXXX" className={inputClass("contact_number")} />
              {errors.contact_number && <p className="text-red-500 text-[10px] font-body mt-1">{errors.contact_number}</p>}
            </div>
            <div>
              <label className={labelClass}>Number of Pax</label>
              <select value={form.number_of_pax} onChange={(e) => handleChange("number_of_pax", e.target.value)} className={inputClass("number_of_pax")}>
                <option value="">Select</option>
                {PAX_OPTIONS.map((p) => (
                  <option key={p} value={p} style={{ background: "#1A1A1A" }}>{p}</option>
                ))}
              </select>
              {errors.number_of_pax && <p className="text-red-500 text-[10px] font-body mt-1">{errors.number_of_pax}</p>}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-[768px]:gap-3">
            <div>
              <label className={labelClass}>Date of Visit</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={cn(inputClass("date_of_visit"), "flex items-center justify-between text-left", !form.date_of_visit && "text-white/30")}>
                    {form.date_of_visit ? format(form.date_of_visit, "MMMM d, yyyy") : "Pick a date"}
                    <CalendarIcon className="h-4 w-4 text-white/40" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-white/10" align="start">
                  <Calendar
                    mode="single"
                    selected={form.date_of_visit}
                    onSelect={(d) => { setForm((p) => ({ ...p, date_of_visit: d })); if (d) setErrors((p) => { const n = { ...p }; delete n.date_of_visit; return n; }); }}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.date_of_visit && <p className="text-red-500 text-[10px] font-body mt-1">{errors.date_of_visit}</p>}
            </div>
            <div>
              <label className={labelClass}>Time of Arrival</label>
              <select value={form.time_of_arrival} onChange={(e) => handleChange("time_of_arrival", e.target.value)} className={inputClass("time_of_arrival")}>
                <option value="">Select time</option>
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t} style={{ background: "#1A1A1A" }}>{t}</option>
                ))}
              </select>
              {errors.time_of_arrival && <p className="text-red-500 text-[10px] font-body mt-1">{errors.time_of_arrival}</p>}
            </div>
          </div>

          {/* Table Type */}
          <div>
            <label className={labelClass}>Table Type</label>
            <div className="flex flex-col gap-3 mt-2">
              {TABLE_TYPES.map((t) => (
                <label key={t.value} className="flex items-center gap-3 cursor-pointer group">
                  <span className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    form.table_type === t.value ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]" : errors.table_type ? "border-red-500" : "border-white/20 group-hover:border-white/40"
                  )}>
                    {form.table_type === t.value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="font-body text-[12px] text-white/70 group-hover:text-white/90 transition-colors">{t.label}</span>
                  <input type="radio" name="table_type" value={t.value} checked={form.table_type === t.value} onChange={(e) => handleChange("table_type", e.target.value)} className="sr-only" />
                </label>
              ))}
            </div>
            {errors.table_type && <p className="text-red-500 text-[10px] font-body mt-1">{errors.table_type}</p>}
          </div>

          {/* Dynamic Pricing Card */}
          {form.date_of_visit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-sm"
              style={{ background: "#151515", border: "1px solid rgba(139,0,0,0.3)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-body font-bold text-[9px] tracking-[2px] uppercase text-[hsl(var(--primary))]">
                  Table Rates — {format(form.date_of_visit, "EEEE")}
                </p>
                {!selectedDayIsWeekend && (
                  <span className="font-body font-bold text-[8px] tracking-[1px] uppercase px-2 py-1 rounded-sm" style={{ background: "rgba(139,0,0,0.25)", color: "#FF4444" }}>
                    50% OFF ON CONSUMABLE RATES
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="font-body text-[10px] tracking-[1px] uppercase text-white/40 mt-2">Standing Tables</p>
                <div className="flex justify-between font-body text-[12px] text-white/70">
                  <span>Small (2-4 pax)</span>
                  <span className="text-white">{formatPeso(PRICING["standing-small"])}</span>
                </div>
                <div className="flex justify-between font-body text-[12px] text-white/70">
                  <span>Big (4-8 pax)</span>
                  <span className="text-white">{formatPeso(PRICING["standing-big"])}</span>
                </div>
                <p className="font-body text-[10px] tracking-[1px] uppercase text-white/40 mt-3">VIP Tables</p>
                <div className="flex justify-between font-body text-[12px] text-white/70">
                  <span>VIP 1-3 (5-7 pax)</span>
                  <span className="text-white">{formatPeso(PRICING["vip-1-3"])}</span>
                </div>
                <div className="flex justify-between font-body text-[12px] text-white/70">
                  <span>VIP 4-9 (8-10 pax)</span>
                  <span className="text-white">{formatPeso(PRICING["vip-4-9"])}</span>
                </div>
                <div className="flex justify-between font-body text-[12px] text-white/70">
                  <span>VIP 10 (10-12 pax)</span>
                  <span className="text-white">{formatPeso(PRICING["vip-10"])}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Special Requests */}
          <div>
            <label className={labelClass}>Special Requests</label>
            <textarea value={form.special_requests} onChange={(e) => handleChange("special_requests", e.target.value)} rows={3} placeholder="Birthday setup, special occasion, etc." className={inputClass("special_requests")} />
          </div>

          {/* Reminders */}
          <div className="p-4 rounded-sm" style={{ background: "rgba(30,25,10,0.6)", borderLeft: "3px solid #CC9900" }}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-body text-[11px] text-yellow-200/80">Send reservation before 10PM.</p>
                <p className="font-body text-[11px] text-yellow-200/80">Guests must arrive before 12MN or table will be given to walk-ins.</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full font-body font-bold text-[12px] max-[768px]:text-[10px] tracking-[3px] max-[768px]:tracking-[2px] uppercase rounded-full py-4 max-[768px]:py-3 transition-all duration-200 disabled:opacity-50 text-white animate-[pulseGlow_2s_ease-in-out_infinite]"
            style={{ background: "#8B0000" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#A80000"; e.currentTarget.style.boxShadow = "0 0 30px rgba(139,0,0,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#8B0000"; e.currentTarget.style.boxShadow = ""; }}
          >
            {submitting ? "SUBMITTING..." : "SEND RESERVATION"}
          </button>
        </form>

        <p className="text-center mt-6 font-body font-light text-[11px] text-white/40">
          Your reservation will be reviewed and confirmed. You'll receive a confirmation email.
        </p>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-lg p-8 max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              </motion.div>
              <h3 className="font-display text-2xl text-white mb-2">Reservation Submitted!</h3>
              <p className="font-body text-[13px] text-white/60 mb-6">
                Check your email for confirmation. We'll see you at Auxiliary!
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="font-body font-bold text-[11px] tracking-[2px] uppercase px-6 py-3 rounded-full transition-all duration-200 text-white"
                style={{ background: "#8B0000" }}
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BookingSection;
