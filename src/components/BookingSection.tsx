import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const reservationTypes = [
  "Regular Table",
  "VIP Table",
  "Birthday Celebration",
  "Event/Party",
];

const timeOptions = ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"];
const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11-15", "16-20", "20+"];

const BookingSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    date: undefined as Date | undefined,
    time: "",
    guests: "",
    type: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [redirecting, setRedirecting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (value) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validate = () => {
    const required: (keyof typeof form)[] = ["name", "contact", "date", "time", "guests", "type"];
    const newErrors: Record<string, boolean> = {};
    let valid = true;
    for (const field of required) {
      if (!form[field]) {
        newErrors[field] = true;
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dateStr = form.date ? format(form.date, "MMMM d, yyyy") : "";
    const msg = `RESERVATION REQUEST\n━━━━━━━━━━━━━━━━━━\nName: ${form.name.trim()}\nContact: ${form.contact.trim()}\nDate: ${dateStr}\nTime: ${form.time}\nGuests: ${form.guests}\nType: ${form.type}\nSpecial Requests: ${form.notes.trim() || "None"}\n━━━━━━━━━━━━━━━━━━\nSent via Auxiliary Bar Website`;
    const encoded = encodeURIComponent(msg);

    setRedirecting(true);
    toast({ title: "Redirecting to Messenger...", description: "Please wait a moment." });

    setTimeout(() => {
      window.open(`https://www.messenger.com/t/853504411170602?text=${encoded}`, "_blank");
      setForm({ name: "", contact: "", date: undefined, time: "", guests: "", type: "", notes: "" });
      setErrors({});
      setRedirecting(false);
    }, 1500);
  };

  const labelClass = "block font-body font-bold text-[9px] tracking-[2.5px] uppercase mb-1.5 text-[hsl(var(--primary))]";
  const inputClass = (field: string) =>
    cn(
      "w-full bg-[#1A1A1A] border px-4 py-3 text-[12px] font-body font-light text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:border-[hsl(var(--primary))] focus:shadow-[0_0_8px_rgba(139,0,0,0.3)]",
      errors[field] ? "border-red-500" : "border-white/10"
    );
  const errorMsg = (field: string) =>
    errors[field] ? <p className="text-red-500 text-[10px] font-body mt-1">This field is required</p> : null;

  return (
    <section id="booking" className="py-[90px] max-[768px]:py-[40px] px-4 max-[768px]:px-3" style={{ background: "#130000" }}>
      <div className="max-w-[600px] mx-auto">
        <motion.div className="text-center mb-10 max-[768px]:mb-5" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase text-[hsl(var(--primary))]">RESERVATIONS</p>
          <h2 className="font-display text-[40px] max-[768px]:text-[24px] mt-2 max-[768px]:mt-1 text-white">Book Your Table</h2>
          <p className="font-body font-light text-[13px] max-[768px]:text-[11px] mt-2 max-[768px]:mt-1 text-white/50">Reserve your spot at Auxiliary. Fill out the form and we'll confirm via Messenger.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5 max-[768px]:space-y-3">
          {/* Name & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-[768px]:gap-3">
            <div>
              <label className={labelClass}>Full Name</label>
              <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Juan Dela Cruz" className={inputClass("name")} />
              {errorMsg("name")}
            </div>
            <div>
              <label className={labelClass}>Contact Number</label>
              <input value={form.contact} onChange={(e) => handleChange("contact", e.target.value)} placeholder="09XX XXX XXXX" className={inputClass("contact")} />
              {errorMsg("contact")}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-[768px]:gap-3">
            <div>
              <label className={labelClass}>Date of Visit</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      inputClass("date"),
                      "flex items-center justify-between text-left",
                      !form.date && "text-white/30"
                    )}
                  >
                    {form.date ? format(form.date, "MMMM d, yyyy") : "Pick a date"}
                    <CalendarIcon className="h-4 w-4 text-white/40" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-white/10" align="start">
                  <Calendar
                    mode="single"
                    selected={form.date}
                    onSelect={(d) => { setForm((p) => ({ ...p, date: d })); if (d) setErrors((p) => ({ ...p, date: false })); }}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errorMsg("date")}
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <select value={form.time} onChange={(e) => handleChange("time", e.target.value)} className={inputClass("time")}>
                <option value="">Select time</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t} style={{ background: "#1A1A1A" }}>{t}</option>
                ))}
              </select>
              {errorMsg("time")}
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className={labelClass}>Number of Guests</label>
            <select value={form.guests} onChange={(e) => handleChange("guests", e.target.value)} className={inputClass("guests")}>
              <option value="">Select</option>
              {guestOptions.map((g) => (
                <option key={g} value={g} style={{ background: "#1A1A1A" }}>{g}</option>
              ))}
            </select>
            {errorMsg("guests")}
          </div>

          {/* Reservation Type */}
          <div>
            <label className={labelClass}>Reservation Type</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {reservationTypes.map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer group">
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                      form.type === t
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]"
                        : errors.type
                        ? "border-red-500"
                        : "border-white/20 group-hover:border-white/40"
                    )}
                  >
                    {form.type === t && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="font-body text-[12px] text-white/70 group-hover:text-white/90 transition-colors">{t}</span>
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={form.type === t}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
            {errorMsg("type")}
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Special Requests</label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={4}
              placeholder="Any special requests or notes..."
              className={inputClass("notes")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={redirecting}
            className="w-full font-body font-bold text-[12px] max-[768px]:text-[10px] tracking-[3px] max-[768px]:tracking-[2px] uppercase rounded-full py-4 max-[768px]:py-3 transition-all duration-200 disabled:opacity-50 text-white animate-[pulseGlow_2s_ease-in-out_infinite]"
            style={{ background: "#8B0000" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#A80000"; e.currentTarget.style.boxShadow = "0 0 30px rgba(139,0,0,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#8B0000"; e.currentTarget.style.boxShadow = ""; }}
          >
            {redirecting ? "REDIRECTING TO MESSENGER..." : "SEND RESERVATION"}
          </button>
        </form>

        <p className="text-center mt-6 font-body font-light text-[11px] text-white/40">
          Your booking details will be sent directly to our Messenger. We'll confirm your reservation shortly.
        </p>
      </div>
    </section>
  );
};

export default BookingSection;
