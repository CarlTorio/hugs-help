import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { CalendarIcon, AlertTriangle, CheckCircle2, Clock, Users, ChevronDown, Copy, Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import {
  TABLE_TYPES,
  TIME_SLOTS,
  isWeekend,
  validatePaxForTable,
  formatPeso,
  toBookingInsert,
} from "@/lib/reservations";
import { fetchTableRates, isBookingClosed } from "@/lib/settings";
import PaymentStep from "@/components/PaymentStep";

type TableType = { value: string; label: string; minPax: number; maxPax: number; price: number };

const BookingSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [copied, setCopied] = useState(false);
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
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Dynamic settings
  const [closed, setClosed] = useState(false);
  const [closedMessage, setClosedMessage] = useState("");
  const [dynamicTableTypes, setDynamicTableTypes] = useState<TableType[]>([...TABLE_TYPES]);

  useEffect(() => {
    // Fetch booking status and table rates
    isBookingClosed().then(({ closed: c, message }) => {
      setClosed(c);
      setClosedMessage(message);
    });
    fetchTableRates().then((rates) => {
      if (Object.keys(rates).length > 0) {
        setDynamicTableTypes(
          TABLE_TYPES.map((t) => ({
            ...t,
            price: rates[t.value] ?? t.price,
          }))
        );
      }
    });
  }, []);

  const actualDate = useMemo(() => {
    if (!form.date_of_visit) return undefined;
    const slot = TIME_SLOTS.find((t) => t.value === form.time_of_arrival);
    if (slot?.isNextDay) return addDays(form.date_of_visit, 1);
    return form.date_of_visit;
  }, [form.date_of_visit, form.time_of_arrival]);

  const selectedTable = dynamicTableTypes.find((t) => t.value === form.table_type);
  const selectedTimeSlot = TIME_SLOTS.find((t) => t.value === form.time_of_arrival);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (value) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleTimeChange = (value: string) => {
    setForm((prev) => ({ ...prev, time_of_arrival: value }));
    if (value) setErrors((prev) => { const n = { ...prev }; delete n.time_of_arrival; return n; });
  };

  const handlePaxChange = (value: string) => {
    const num = parseInt(value);
    if (value === "" || (num >= 1 && num <= 12)) {
      handleChange("number_of_pax", value);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.full_name.trim()) newErrors.full_name = "Required";
    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.contact_number.trim()) newErrors.contact_number = "Required";
    if (!form.number_of_pax) newErrors.number_of_pax = "Required";
    else if (parseInt(form.number_of_pax) < 1 || parseInt(form.number_of_pax) > 12) newErrors.number_of_pax = "1-12 pax only";
    if (!form.date_of_visit) newErrors.date_of_visit = "Required";
    if (!form.time_of_arrival) newErrors.time_of_arrival = "Required";
    if (!form.table_type) newErrors.table_type = "Required";

    if (form.number_of_pax && form.table_type) {
      const warning = validatePaxForTable(parseInt(form.number_of_pax), form.table_type);
      if (warning) newErrors.table_type = warning;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep("payment");
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePaymentSubmit = async (receiptUrl: string) => {
    setSubmitting(true);
    try {
      const dateToSubmit = actualDate || form.date_of_visit!;
      const bookingData = toBookingInsert({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        contact_number: form.contact_number.trim(),
        number_of_pax: parseInt(form.number_of_pax),
        date_of_visit: format(dateToSubmit, "yyyy-MM-dd"),
        time_of_arrival: form.time_of_arrival,
        table_type: dynamicTableTypes.find((t) => t.value === form.table_type)?.label || form.table_type,
        special_requests: form.special_requests.trim() || null,
        receipt_url: receiptUrl,
      });

      const { error } = await (supabase.from as any)("bookings").insert(bookingData);
      if (error) throw error;

      // Send email notification (fire-and-forget, don't block success)
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        await fetch(`https://${projectId}.supabase.co/functions/v1/send-booking-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking: {
              full_name: form.full_name.trim(),
              email: form.email.trim(),
              contact_number: form.contact_number.trim(),
              number_of_pax: parseInt(form.number_of_pax),
              date_of_visit: format(dateToSubmit, "MMMM d, yyyy"),
              time_of_arrival: form.time_of_arrival,
              table_type: dynamicTableTypes.find((t) => t.value === form.table_type)?.label || form.table_type,
              special_requests: form.special_requests.trim() || null,
            },
          }),
        });
      } catch (notifErr) {
        console.warn("Booking notification email failed:", notifErr);
      }

      setStep("success");
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit reservation.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const dateIsWeekday = useMemo(() => {
    if (!actualDate) return true;
    return !isWeekend(actualDate);
  }, [actualDate]);

  const labelClass = "block font-body font-semibold text-[10px] md:text-[9px] tracking-[2px] uppercase mb-2 text-[#CC0000]";
  const inputClass = (field: string) =>
    cn(
      "w-full bg-[#0F0000] border rounded-sm px-4 py-3.5 md:py-3 text-[13px] md:text-[12px] font-body text-white/90 placeholder:text-white/25 outline-none transition-all duration-300",
      "focus:border-[#CC0000] focus:shadow-[0_0_12px_rgba(204,0,0,0.2)]",
      errors[field] ? "border-red-600/60" : "border-white/8"
    );

  return (
    <section id="booking" className="py-16 md:py-[90px] px-4">
      <div className="max-w-[600px] mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-10 md:mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-body font-bold text-[9px] tracking-[5px] uppercase text-[#CC0000]">RESERVATIONS</p>
          <h2 className="font-display text-[28px] md:text-[40px] mt-2 text-white">Book Your Table</h2>
          <div className="w-8 h-[2px] bg-[#CC0000] mx-auto mt-3" />
          <p className="font-body font-light text-[12px] md:text-[13px] mt-4 text-white/40 max-w-[400px] mx-auto">
            Reserve your spot at Auxiliary. Fill out the form below and we'll confirm your reservation.
          </p>
        </motion.div>

        {/* Closed Banner */}
        {closed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <XCircle className="w-14 h-14 mx-auto mb-4 text-[#CC0000]/60" />
            <h3 className="font-display text-xl text-white mb-3">Booking Unavailable</h3>
            <p className="font-body text-[13px] text-white/50 max-w-[400px] mx-auto">
              {closedMessage}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-body text-[11px] font-bold", step === "form" ? "bg-[#8B0000] text-white" : "bg-green-700 text-white")}>1</div>
                <span className={cn("font-body text-[10px] tracking-[1px] uppercase", step === "form" ? "text-white/80" : "text-white/30")}>Details</span>
              </div>
              <div className="w-8 h-[1px] bg-white/10" />
              <div className="flex items-center gap-2">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-body text-[11px] font-bold", step === "payment" ? "bg-[#8B0000] text-white" : step === "success" ? "bg-green-700 text-white" : "bg-white/10 text-white/40")}>2</div>
                <span className={cn("font-body text-[10px] tracking-[1px] uppercase", step === "payment" ? "text-white/80" : "text-white/30")}>Payment</span>
              </div>
              <div className="w-8 h-[1px] bg-white/10" />
              <div className="flex items-center gap-2">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-body text-[11px] font-bold", step === "success" ? "bg-[#8B0000] text-white" : "bg-white/10 text-white/40")}>3</div>
                <span className={cn("font-body text-[10px] tracking-[1px] uppercase", step === "success" ? "text-white/80" : "text-white/30")}>Done</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === "success" ? (
                <motion.div key="success" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                  <div className="text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
                      <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-green-500" />
                    </motion.div>
                    <h3 className="font-display text-2xl text-white mb-2">Reservation Submitted!</h3>
                    <p className="font-body text-[13px] text-white/50 mb-5">
                      Your payment receipt has been received. Your reservation is now being reviewed.
                    </p>
                  </div>

                  <div className="p-4 rounded-sm border border-[#CC0000]/15 text-left" style={{ background: "rgba(139,0,0,0.06)" }}>
                    <p className="font-body font-bold text-[9px] tracking-[2px] uppercase text-[#CC0000] mb-2">📌 IMPORTANT REMINDER</p>
                    <p className="font-body text-[11px] text-white/60 leading-relaxed">
                      To speed up your confirmation, please send us a message on <span className="text-white/80 font-semibold">Messenger</span> letting us know that you've paid and reserved. You can also call us directly.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-sm border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div>
                      <p className="font-body text-[9px] tracking-[2px] uppercase text-white/40">Contact Number</p>
                      <p className="font-body text-[14px] text-white font-semibold">0951 081 5806</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("09510815806");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="flex items-center gap-1.5 font-body text-[9px] tracking-[1px] uppercase px-3 py-2 rounded-sm transition-all duration-200"
                      style={{ background: copied ? "rgba(45,125,45,0.2)" : "rgba(255,255,255,0.06)", color: copied ? "#4ade80" : "rgba(240,235,227,0.6)", border: copied ? "1px solid rgba(45,125,45,0.4)" : "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>

                  <a
                    href="https://www.messenger.com/t/100005803967842/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 font-body font-bold text-[11px] tracking-[2px] uppercase py-3.5 rounded-full transition-all duration-200 text-white"
                    style={{ background: "#0084FF" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#0099FF"; e.currentTarget.style.boxShadow = "0 0 25px rgba(0,132,255,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#0084FF"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    💬 MESSAGE US ON MESSENGER
                  </a>

                  <a
                    href="tel:09510815806"
                    className="w-full flex items-center justify-center gap-2 font-body font-bold text-[11px] tracking-[2px] uppercase py-3.5 rounded-full transition-all duration-200 text-white"
                    style={{ background: "#2D7D2D" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#38A038"; e.currentTarget.style.boxShadow = "0 0 25px rgba(45,125,45,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#2D7D2D"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    📞 CALL 0951 081 5806
                  </a>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full font-body text-[11px] tracking-[1px] uppercase text-white/40 hover:text-white/70 transition-colors py-3"
                  >
                    Close
                  </button>
                </motion.div>
              ) : step === "form" ? (
                <motion.div key="form" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                  <form onSubmit={handleProceedToPayment} className="space-y-5 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className={labelClass}>Contact Number</label>
                        <input value={form.contact_number} onChange={(e) => handleChange("contact_number", e.target.value)} placeholder="09XX XXX XXXX" className={inputClass("contact_number")} />
                        {errors.contact_number && <p className="text-red-500 text-[10px] font-body mt-1">{errors.contact_number}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Number of Pax</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input type="number" min={1} max={12} value={form.number_of_pax} onChange={(e) => handlePaxChange(e.target.value)} placeholder="Max 12" className={cn(inputClass("number_of_pax"), "pl-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none")} />
                        </div>
                        {errors.number_of_pax && <p className="text-red-500 text-[10px] font-body mt-1">{errors.number_of_pax}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className={labelClass}>Date of Visit</label>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                          <PopoverTrigger asChild>
                            <button type="button" className={cn(inputClass("date_of_visit"), "flex items-center justify-between text-left", !form.date_of_visit && "text-white/25")}>
                              {form.date_of_visit ? format(form.date_of_visit, "MMMM d, yyyy") : "Pick a date"}
                              <CalendarIcon className="h-4 w-4 text-white/30" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-[#0F0000] border-white/10" align="start">
                            <Calendar
                              mode="single"
                              selected={form.date_of_visit}
                              onSelect={(d) => {
                                setForm((p) => ({ ...p, date_of_visit: d, time_of_arrival: "" }));
                                if (d) setErrors((p) => { const n = { ...p }; delete n.date_of_visit; return n; });
                                setCalendarOpen(false);
                              }}
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
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 z-10" />
                          <select value={form.time_of_arrival} onChange={(e) => handleTimeChange(e.target.value)} disabled={!form.date_of_visit} className={cn(inputClass("time_of_arrival"), "pl-10 appearance-none cursor-pointer", !form.date_of_visit && "opacity-40 cursor-not-allowed")}>
                            <option value="">{form.date_of_visit ? "Select time" : "Pick a date first"}</option>
                            {TIME_SLOTS.map((t) => (
                              <option key={t.value} value={t.value} style={{ background: "#0F0000" }}>
                                {t.label}{t.isNextDay && form.date_of_visit ? ` (${format(addDays(form.date_of_visit, 1), "MMM d")})` : ""}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                        {errors.time_of_arrival && <p className="text-red-500 text-[10px] font-body mt-1">{errors.time_of_arrival}</p>}
                        {selectedTimeSlot?.isNextDay && form.date_of_visit && (
                          <p className="text-[10px] font-body mt-1.5 text-[#CC0000]/70">ⓘ Actual date: {format(addDays(form.date_of_visit, 1), "MMMM d, yyyy")}</p>
                        )}
                      </div>
                    </div>

                    {/* Table Type */}
                    <div>
                      <label className={labelClass}>Table Type</label>
                      <div className="relative">
                        <select value={form.table_type} onChange={(e) => handleChange("table_type", e.target.value)} className={cn(inputClass("table_type"), "appearance-none cursor-pointer")}>
                          <option value="">Select table type</option>
                          {dynamicTableTypes.map((t) => (
                            <option key={t.value} value={t.value} style={{ background: "#0F0000" }}>
                              {t.label} — {formatPeso(t.price)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                      {errors.table_type && <p className="text-red-500 text-[10px] font-body mt-1">{errors.table_type}</p>}
                    </div>

                    {/* Pricing Info Card */}
                    <div className="p-4 md:p-5 rounded-sm border border-white/5" style={{ background: "#0A0000" }}>
                      <p className="font-body font-bold text-[9px] tracking-[2px] uppercase text-[#CC0000] mb-3">Table Rates — Friday to Sunday</p>
                      <div className="space-y-1">
                        <p className="font-body text-[10px] tracking-[1px] uppercase text-white/30 mb-1">Standing Tables</p>
                        {dynamicTableTypes.filter(t => t.value.startsWith("standing")).map(t => (
                          <div key={t.value} className="flex justify-between font-body text-[12px] text-white/60">
                            <span>{t.label.split("—")[1]?.trim() || t.label}</span>
                            <span className="text-white/80">{formatPeso(t.price)}</span>
                          </div>
                        ))}
                        <p className="font-body text-[10px] tracking-[1px] uppercase text-white/30 mt-3 mb-1">VIP Tables</p>
                        {dynamicTableTypes.filter(t => t.value.startsWith("vip")).map(t => (
                          <div key={t.value} className="flex justify-between font-body text-[12px] text-white/60">
                            <span>{t.label.split("—")[0]?.trim().replace("Table ", "") || t.label}</span>
                            <span className="text-white/80">{formatPeso(t.price)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <p className="font-body font-semibold text-[10px] text-[#CC0000]/80">📌 Monday – Thursday → 50% OFF sa Consumable Rates</p>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className={labelClass}>Special Requests <span className="text-white/20 font-normal">(optional)</span></label>
                      <textarea value={form.special_requests} onChange={(e) => handleChange("special_requests", e.target.value)} rows={3} placeholder="Birthday setup, special occasion, etc." className={cn(inputClass("special_requests"), "resize-none")} />
                    </div>

                    {/* Reminders */}
                    <div className="flex items-start gap-3 p-4 rounded-sm border border-[#CC0000]/10" style={{ background: "rgba(139,0,0,0.06)" }}>
                      <AlertTriangle className="w-4 h-4 text-[#CC0000]/60 mt-0.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-body text-[11px] text-white/50">Send reservation before <span className="text-white/70 font-semibold">10PM</span>.</p>
                        <p className="font-body text-[11px] text-white/50">Arrive before <span className="text-white/70 font-semibold">12MN</span> or table goes to walk-ins.</p>
                      </div>
                    </div>

                    {/* Proceed to Payment */}
                    <button
                      type="submit"
                      className="w-full font-body font-bold text-[11px] md:text-[12px] tracking-[3px] uppercase rounded-full py-4 transition-all duration-300 text-white"
                      style={{ background: "#8B0000" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#A80000"; e.currentTarget.style.boxShadow = "0 0 30px rgba(139,0,0,0.4)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#8B0000"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      PROCEED TO PAYMENT
                    </button>
                  </form>
                </motion.div>
              ) : (
                <PaymentStep
                  key="payment"
                  bookingData={{
                    full_name: form.full_name,
                    table_type_label: selectedTable?.label || form.table_type,
                    price: selectedTable?.price || 0,
                    isWeekday: dateIsWeekday,
                  }}
                  onSubmit={handlePaymentSubmit}
                  onBack={() => setStep("form")}
                  submitting={submitting}
                />
              )}
            </AnimatePresence>

            {step !== "success" && (
              <p className="text-center mt-5 font-body font-light text-[11px] text-white/30">
                Your reservation will be reviewed and confirmed via email.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BookingSection;
