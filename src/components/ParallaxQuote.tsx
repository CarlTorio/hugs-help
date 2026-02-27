import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ParallaxQuote = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className="relative h-[420px] overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute inset-0 w-full h-[140%] -top-[20%]"
        style={{ y }}
      >
        <img
          src="https://i.imgur.com/YCOVP70.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "rgba(20,0,0,0.78)" }} />

      <div className="relative z-10 text-center px-6 max-w-[720px]">
        <span
          className="font-display text-[140px] absolute -top-12 left-1/2 -translate-x-1/2 select-none pointer-events-none"
          style={{ color: "rgba(139,0,0,0.12)" }}
        >
          "
        </span>
        <p
          className="font-body font-light italic leading-[1.6]"
          style={{
            fontSize: "clamp(22px, 3.5vw, 44px)",
            color: "#FFFFFF",
          }}
        >
          "The night is still young, and so are we."
        </p>
        <p
          className="mt-5 font-body font-bold text-[10px] tracking-[4px]"
          style={{ color: "#CC0000" }}
        >
          — AUXILIARY BAR & LOUNGE, NOVALICHES
        </p>
      </div>
    </section>
  );
};

export default ParallaxQuote;
