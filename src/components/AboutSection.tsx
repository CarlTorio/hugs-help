import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { number: 7, suffix: "+", label: "YEARS SERVING QC" },
  { number: 50, suffix: "+", label: "SIGNATURE COCKTAILS" },
  { number: 500, suffix: "+", label: "EVENTS HOSTED" },
];

const CountUp = ({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = duration / (target / step);

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [inView, target]);

  return <>{count}{suffix}</>;
};

const AboutSection = () => {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  return (
    <section id="about" className="relative py-[90px]" style={{ background: "#130000" }}>
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Label & Heading */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>
            OUR STORY
          </p>
          <div style={{ width: 60, height: 1, background: "#8B0000" }} />
          <h2 className="font-display text-[52px] max-[768px]:text-[34px] tracking-[2px] leading-tight" style={{ color: "#FFFFFF" }}>
            More Than Just A Bar
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div
          className="flex flex-col gap-4 mt-8 max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <p className="font-body font-light text-[14px] leading-[2]" style={{ color: "rgba(240,235,227,0.75)" }}>
            Auxiliary Bar and Lounge is Novaliches' premier destination for unforgettable nights. We blend premium spirits, handcrafted cocktails, and world-class DJ performances into one electrifying experience.
          </p>
          <p className="font-body font-light text-[14px] leading-[2]" style={{ color: "rgba(240,235,227,0.75)" }}>
            Nestled in the heart of Novaliches Proper, Quezon City, we've created a space where locals come to unwind, celebrate, and lose themselves in the music.
          </p>
          <p className="font-body font-light text-[14px] leading-[2]" style={{ color: "rgba(240,235,227,0.75)" }}>
            Whether you're here for an intimate night out or a full-blown celebration, Auxiliary promises an atmosphere that hits different every single time.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 w-full max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="border p-4 sm:p-6 text-center transition-all duration-300"
              style={{ borderColor: "rgba(139,0,0,0.25)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderTopColor = "#8B0000")}
              onMouseLeave={(e) => (e.currentTarget.style.borderTopColor = "rgba(139,0,0,0.25)")}
            >
              <p className="font-display text-[36px] sm:text-[40px]" style={{ color: "#CC0000" }}>
                <CountUp target={s.number} suffix={s.suffix} inView={statsInView} />
              </p>
              <p className="font-body font-semibold text-[8px] sm:text-[9px] tracking-[2.5px]" style={{ color: "rgba(240,235,227,0.6)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Video */}
        <motion.div
          className="relative w-full mt-12 overflow-hidden rounded-sm"
          style={{ aspectRatio: "16/9" }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="https://i.imgur.com/LfCkDP6.mp4"
          />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.25)" }} />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
