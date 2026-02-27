import { motion } from "framer-motion";

const events = [
  {
    img: "https://i.imgur.com/YCOVP70.png",
    date: "FEBRUARY 7, 2025",
    title: "Cupid's Choice — A Pink Affair",
    desc: "The wildest Valentine's event in Novaliches. Featuring DJ Tricia Cosio and Shy Dee Wong together with Dan, Azi, MC Pain, and Usake Girls. No date? No problem. IYKYK.",
  },
  {
    img: "https://i.imgur.com/HyINqXX.png",
    date: "EVERY WEEKEND",
    title: "DJ Nights at Auxiliary",
    desc: "Lose yourself in the beat. Our resident and guest DJs keep the energy alive every Friday and Saturday night. Come early, stay late.",
  },
  {
    img: "https://i.imgur.com/g22R9eh.png",
    date: "OPEN FOR BOOKINGS",
    title: "Private Events & Celebrations",
    desc: "Birthdays, debuts, company parties — we host it all. Message us to customize your perfect night at Auxiliary.",
  },
];

const EventsSection = () => (
  <section id="events" className="py-[90px] px-4" style={{ background: "#0D0000" }}>
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>
          UPCOMING & PAST EVENTS
        </p>
        <h2 className="font-display text-[40px] max-[768px]:text-[30px] mt-2" style={{ color: "#FFFFFF" }}>
          Where The Night Lives
        </h2>
        <p className="font-body font-light text-[13px] mt-3" style={{ color: "rgba(240,235,227,0.6)" }}>
          Featuring the hottest DJs in the metro and exclusive themed nights.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((ev, i) => (
          <motion.div
            key={i}
            className="overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group"
            style={{
              background: "#1C0000",
              border: "1px solid rgba(139,0,0,0.2)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(200,0,0,0.5)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(139,0,0,0.2)")}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <div className="h-[220px] overflow-hidden">
              <img
                src={ev.img}
                alt={ev.title}
                className="w-full h-full object-cover brightness-[0.8] group-hover:brightness-100 transition-all duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <p className="font-body font-bold text-[9px] tracking-[3px]" style={{ color: "#CC0000" }}>
                {ev.date}
              </p>
              <h3 className="font-display text-[26px] mt-2" style={{ color: "#FFFFFF" }}>
                {ev.title}
              </h3>
              <p className="font-body font-light text-[12px] leading-[1.8] mt-2" style={{ color: "rgba(240,235,227,0.6)" }}>
                {ev.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-14">
        <p className="font-body font-light text-[13px] mb-4" style={{ color: "rgba(240,235,227,0.7)" }}>
          Want to host your own event?
        </p>
        <a
          href="https://www.facebook.com/messages/t/853504411170602"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-body font-bold text-[12px] tracking-[2.5px] uppercase rounded-full px-10 py-3 transition-all duration-200"
          style={{ background: "#8B0000", color: "#FFFFFF" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#A80000";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(139,0,0,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#8B0000";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          INQUIRE NOW
        </a>
      </div>
    </div>
  </section>
);

export default EventsSection;
