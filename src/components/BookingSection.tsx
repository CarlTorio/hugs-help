import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(139,0,0,0.3)",
  color: "#FFFFFF",
  padding: "13px 16px",
  borderRadius: 0,
  width: "100%",
  fontSize: 12,
  fontFamily: "Montserrat",
  fontWeight: 300,
  outline: "none",
};

const inputStyleMobile: React.CSSProperties = {
  ...inputStyle,
  padding: "10px 12px",
  fontSize: 11,
};

const labelStyle: React.CSSProperties = {
  color: "#CC0000",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "2.5px",
  textTransform: "uppercase" as const,
  fontFamily: "Montserrat",
  marginBottom: 6,
  display: "block",
};

const BookingSection = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
    guests: "",
    occasion: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#8B0000";
    e.target.style.boxShadow = "0 0 8px rgba(139,0,0,0.3)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "rgba(139,0,0,0.3)";
    e.target.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save to database
    const { error } = await supabase.from("bookings").insert([{
      name: form.name.trim(),
      contact: form.contact.trim(),
      date: form.date,
      time: form.time,
      guests: form.guests,
      occasion: form.occasion,
      notes: form.notes.trim(),
    }]);

    if (error) {
      console.error("Booking error:", error);
      toast({ title: "Booking failed", description: "Please try again later.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Also send to Messenger
    const msg = `Hi! I'd like to make a reservation at Auxiliary Bar and Lounge. 🍾\n\n📋 Name: ${form.name}\n📞 Contact: ${form.contact}\n📅 Date: ${form.date}\n🕐 Time: ${form.time}\n👥 Guests: ${form.guests}\n🎉 Occasion: ${form.occasion}\n📝 Special Requests: ${form.notes || "None"}`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://www.facebook.com/messages/t/853504411170602?text=${encoded}`, "_blank");

    toast({ title: "Reservation sent!", description: "We'll confirm your booking shortly." });
    setForm({ name: "", contact: "", date: "", time: "", guests: "", occasion: "", notes: "" });
    setSubmitting(false);
  };

  return (
    <section id="booking" className="py-[90px] max-[768px]:py-[40px] px-4 max-[768px]:px-3" style={{ background: "#130000" }}>
      <div className="max-w-[680px] mx-auto">
        <motion.div className="text-center mb-10 max-[768px]:mb-5" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>RESERVATIONS</p>
          <h2 className="font-display text-[40px] max-[768px]:text-[24px] mt-2 max-[768px]:mt-1" style={{ color: "#FFFFFF" }}>Book Your Table</h2>
          <p className="font-body font-light text-[13px] max-[768px]:text-[11px] mt-2 max-[768px]:mt-1" style={{ color: "rgba(240,235,227,0.6)" }}>Reserve your spot at Auxiliary. Fill out the form and we'll confirm via Messenger.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5 max-[768px]:space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-[768px]:gap-3">
            <div>
              <label style={labelStyle}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required placeholder="Juan Dela Cruz" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contact Number</label>
              <input name="contact" value={form.contact} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required placeholder="+63 9XX XXX XXXX" style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-[768px]:gap-3">
            <div>
              <label style={labelStyle}>Date of Reservation</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required style={{ ...inputStyle, colorScheme: "dark" }} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <select name="time" value={form.time} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required style={inputStyle}>
                <option value="">Select time</option>
                {["5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM","12:00 AM","1:00 AM","2:00 AM"].map(t => (
                  <option key={t} value={t} style={{ background: "#1C0000" }}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-[768px]:gap-3">
            <div>
              <label style={labelStyle}>Number of Guests</label>
              <select name="guests" value={form.guests} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required style={inputStyle}>
                <option value="">Select</option>
                {["1–2","3–5","6–10","10–20","20+ Private"].map(g => (
                  <option key={g} value={g} style={{ background: "#1C0000" }}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Occasion</label>
              <select name="occasion" value={form.occasion} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required style={inputStyle}>
                <option value="">Select</option>
                {["Regular Night Out","Birthday","Debut","Anniversary","Company Party","Barkada Night","Private Event","Other"].map(o => (
                  <option key={o} value={o} style={{ background: "#1C0000" }}>{o}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Special Requests / Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} rows={4} placeholder="Any special requests..." style={inputStyle} />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full font-body font-bold text-[12px] max-[768px]:text-[10px] tracking-[3px] max-[768px]:tracking-[2px] uppercase rounded-full py-4 max-[768px]:py-3 transition-all duration-200 disabled:opacity-50"
            style={{ background: "#8B0000", color: "#FFFFFF" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#A80000"; e.currentTarget.style.boxShadow = "0 0 30px rgba(139,0,0,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#8B0000"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {submitting ? "SENDING..." : "SEND RESERVATION VIA MESSENGER"}
          </button>
        </form>
        <p className="text-center mt-6 font-body font-light text-[11px]" style={{ color: "rgba(240,235,227,0.5)" }}>
          Your booking details will be sent directly to our Messenger. We'll confirm your reservation shortly.
        </p>
      </div>
    </section>
  );
};

export default BookingSection;
