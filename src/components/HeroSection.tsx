import { motion } from "framer-motion";

const SocialIcon = ({ href, label, path }: { href: string; label: string; path: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-200 group"
    style={{ borderColor: "rgba(255,255,255,0.3)" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "#CC0000";
      const svg = e.currentTarget.querySelector("svg");
      if (svg) svg.style.color = "#CC0000";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
      const svg = e.currentTarget.querySelector("svg");
      if (svg) svg.style.color = "#FFFFFF";
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#FFFFFF", transition: "color 0.2s" }}>
      <path d={path} />
    </svg>
  </a>
);

const HeroSection = () => {
  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://i.imgur.com/LfCkDP6.mp4"
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(80,0,0,0.55) 0%, rgba(30,0,0,0.6) 50%, rgba(5,0,0,0.9) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-2xl">
        {/* Logo */}
        <motion.img
          src="https://i.imgur.com/amKfns1.png"
          alt="Auxiliary Logo"
          className="w-[160px] h-[160px] md:w-[160px] md:h-[160px] max-[768px]:w-[130px] max-[768px]:h-[130px]"
          style={{ filter: "drop-shadow(0 0 30px rgba(139,0,0,0.6))" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.7 }}
        />

        {/* Novaliches */}
        <motion.p
          className="mt-3 font-body font-normal text-[11px] tracking-[5px] uppercase"
          style={{ color: "rgba(255,255,255,0.75)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          NOVALICHES
        </motion.p>

        {/* Red accent line */}
        <motion.div
          className="mt-[10px] mx-auto"
          style={{ height: 2, background: "#CC0000" }}
          initial={{ width: 0 }}
          animate={{ width: 20 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        />

        {/* Breathing space */}
        <div className="h-[100px] md:h-[140px]" />

        {/* Description */}
        <motion.p
          className="mt-5 font-body font-bold leading-[1.7] max-w-[520px] max-[768px]:max-w-[90%]"
          style={{ fontSize: "clamp(20px, 4vw, 32px)", color: "rgba(240,235,227,0.9)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Experience the next level of nightlife at Auxiliary, Novaliches' premier bar and lounge. Known for its premium cocktails, electrifying DJ sets, and an atmosphere unlike any other — Auxiliary is a must-visit destination.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <button
            onClick={scrollToBooking}
            className="font-body font-bold text-[12px] tracking-[2.5px] uppercase rounded-full px-12 py-3 transition-all duration-200 max-[768px]:w-[80%] max-[768px]:max-w-[260px]"
            style={{
              background: "#8B0000",
              color: "#FFFFFF",
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#A80000";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(139,0,0,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#8B0000";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            BOOK NOW
          </button>
          <button
            onClick={scrollToBooking}
            className="font-body font-bold text-[12px] tracking-[2.5px] uppercase rounded-full px-12 py-3 transition-all duration-200 max-[768px]:w-[80%] max-[768px]:max-w-[260px]"
            style={{
              background: "transparent",
              color: "#FFFFFF",
              border: "1.5px solid #FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "#CC0000";
              e.currentTarget.style.color = "#CC0000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#FFFFFF";
              e.currentTarget.style.color = "#FFFFFF";
            }}
          >
            VIP TABLES
          </button>
        </motion.div>

        {/* Social icons */}
        <motion.div
          className="mt-7 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <SocialIcon
            href="https://www.facebook.com/profile.php?id=61581380972061"
            label="Facebook"
            path="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
          <SocialIcon
            href="https://www.instagram.com/auxiliarybar_lounge"
            label="Instagram"
            path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
          />
          <SocialIcon
            href="https://www.facebook.com/messages/t/853504411170602"
            label="Messenger"
            path="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.26 5.886-3.26-6.558 6.763z"
          />
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;
