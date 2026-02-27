import { useState } from "react";
import { motion } from "framer-motion";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi! I'd like to make a reservation at Auxiliary Bar and Lounge. 🍾

📋 Name: ${form.name}
📞 Contact: ${form.contact}
📅 Date: ${form.date}
🕐 Time: ${form.time}
👥 Guests: ${form.guests}
🎉 Occasion: ${form.occasion}
📝 Special Requests: ${form.notes || "None"}`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://www.facebook.com/messages/t/853504411170602?text=${encoded}`, "_blank");
  };

  return (
    <section id="booking" className="py-[90px] px-4" style={{ background: "#130000" }}>
      <div className="max-w-[680px] mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>
            RESERVATIONS
          </p>
          <h2 className="font-display text-[40px] max-[768px]:text-[30px] mt-2" style={{ color: "#FFFFFF" }}>
            Book Your Table
          </h2>
          <p className="font-body font-light text-[13px] mt-2" style={{ color: "rgba(240,235,227,0.6)" }}>
            Reserve your spot at Auxiliary. Fill out the form and we'll confirm via Messenger.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label style={labelStyle}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required placeholder="Juan Dela Cruz" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contact Number</label>
              <input name="contact" value={form.contact} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required placeholder="+63 9XX XXX XXXX" style={inputStyle} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          {/* Row 4 */}
          <div>
            <label style={labelStyle}>Special Requests / Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} rows={4} placeholder="Any special requests..." style={inputStyle} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full font-body font-bold text-[12px] tracking-[3px] uppercase rounded-full py-4 transition-all duration-200"
            style={{ background: "#8B0000", color: "#FFFFFF" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#A80000";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(139,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#8B0000";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            SEND RESERVATION VIA MESSENGER
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
