import { motion } from "framer-motion";

const stats = [
  { number: "7+", label: "YEARS SERVING QC" },
  { number: "50+", label: "SIGNATURE COCKTAILS" },
  { number: "500+", label: "EVENTS HOSTED" },
];

const AboutSection = () => (
  <section id="about" className="relative py-[90px]" style={{ background: "#130000" }}>
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-0">
      {/* Left - Video */}
      <div className="relative w-full md:w-1/2 h-[280px] md:h-auto md:min-h-[560px] overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://i.imgur.com/LfCkDP6.mp4"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
        <div
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(to right, transparent 70%, #130000 100%)" }}
        />
      </div>

      {/* Right - Content */}
      <motion.div
        className="w-full md:w-1/2 px-6 md:px-16 py-10 md:py-16 flex flex-col justify-center gap-[22px]"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>
          OUR STORY
        </p>
        <div style={{ width: 60, height: 1, background: "#8B0000" }} />
        <h2 className="font-display text-[52px] max-[768px]:text-[38px] tracking-[2px]" style={{ color: "#FFFFFF" }}>
          More Than Just A Bar
        </h2>
        <div className="flex flex-col gap-4">
          <p className="font-body font-light text-[14px] leading-[2]" style={{ color: "rgba(240,235,227,0.75)" }}>
            Auxiliary Bar and Lounge is Novaliches' premier destination for unforgettable nights. We blend premium spirits, handcrafted cocktails, and world-class DJ performances into one electrifying experience.
          </p>
          <p className="font-body font-light text-[14px] leading-[2]" style={{ color: "rgba(240,235,227,0.75)" }}>
            Nestled in the heart of Novaliches Proper, Quezon City, we've created a space where locals come to unwind, celebrate, and lose themselves in the music.
          </p>
          <p className="font-body font-light text-[14px] leading-[2]" style={{ color: "rgba(240,235,227,0.75)" }}>
            Whether you're here for an intimate night out or a full-blown celebration, Auxiliary promises an atmosphere that hits different every single time.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border p-4 text-center transition-all duration-300 group"
              style={{ borderColor: "rgba(139,0,0,0.25)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderTopColor = "#8B0000")}
              onMouseLeave={(e) => (e.currentTarget.style.borderTopColor = "rgba(139,0,0,0.25)")}
            >
              <p className="font-display text-[40px] max-[768px]:text-[28px]" style={{ color: "#CC0000" }}>
                {s.number}
              </p>
              <p
                className="font-body font-semibold text-[9px] tracking-[2.5px]"
                style={{ color: "rgba(240,235,227,0.6)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
