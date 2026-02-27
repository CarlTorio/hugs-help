import { motion } from "framer-motion";

const info = [
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "ADDRESS",
    text: "No. 7 Buenamar Road, Dona Isaura Village, Brgy. Novaliches Proper, Quezon City 1123",
    sub: "(Across Novaliches Proper Barangay Hall)",
  },
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "CONTACT",
    text: "0951 081 5806",
    href: "tel:09510815806",
  },
  {
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z",
    label: "INSTAGRAM",
    text: "@auxiliarybar_lounge",
    href: "https://www.instagram.com/auxiliarybar_lounge",
    external: true,
  },
  {
    icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
    label: "FACEBOOK",
    text: "Auxiliary Bar and Lounge",
    href: "https://www.facebook.com/profile.php?id=61581380972061",
    external: true,
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    label: "HOURS",
    text: "Open Daily · 5:00 PM – 2:00 AM",
  },
];

const LocationSection = () => (
  <section id="contact" className="py-[90px] px-4" style={{ background: "#0D0000" }}>
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>
          FIND US
        </p>
        <h2 className="font-display text-[56px] max-[768px]:text-[38px] mt-2" style={{ color: "#FFFFFF" }}>
          Where To Find Us
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left info */}
        <motion.div
          className="w-full md:w-1/2 space-y-7"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {info.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded"
                style={{ border: "1px solid rgba(139,0,0,0.2)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </div>
              <div>
                <p className="font-body font-bold text-[9px] tracking-[3px]" style={{ color: "#CC0000" }}>
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="font-body font-light text-[13px] hover:underline"
                    style={{ color: "rgba(240,235,227,0.8)" }}
                  >
                    {item.text}
                  </a>
                ) : (
                  <p className="font-body font-light text-[13px]" style={{ color: "rgba(240,235,227,0.8)" }}>
                    {item.text}
                  </p>
                )}
                {item.sub && (
                  <p className="font-body font-light text-[11px]" style={{ color: "rgba(240,235,227,0.5)" }}>
                    {item.sub}
                  </p>
                )}
              </div>
            </div>
          ))}

          <a
            href="https://share.google/JQiUAJQYR01e2kkXN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-body font-bold text-[12px] tracking-[2.5px] uppercase rounded-full px-8 py-3 mt-4 transition-all duration-200"
            style={{
              background: "transparent",
              color: "#FFFFFF",
              border: "1.5px solid #8B0000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#8B0000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            GET DIRECTIONS
          </a>
        </motion.div>

        {/* Right map */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <iframe
            src="https://www.google.com/maps?q=No+7+Buenamar+Road+Novaliches+Proper+Quezon+City&output=embed"
            className="w-full"
            style={{
              height: 380,
              border: "1px solid rgba(139,0,0,0.3)",
              filter: "grayscale(100%) invert(85%) contrast(85%)",
              opacity: 0.85,
            }}
            loading="lazy"
            title="Auxiliary Bar Location"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default LocationSection;
