import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = ["ABOUT", "MENU", "GALLERY", "EVENTS", "CONTACT"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_LINKS.map((l) => l.toLowerCase());
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-[1000] transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,0,0,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(139,0,0,0.3)" : "1px solid transparent",
        }}
      >
        <div className="flex items-center justify-center py-5 px-4">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="font-body font-bold text-[11px] tracking-[3px] uppercase transition-colors duration-200"
                style={{
                  color: activeSection === link.toLowerCase() ? "#CC0000" : "#FFFFFF",
                  borderBottom: activeSection === link.toLowerCase() ? "1px solid #CC0000" : "1px solid transparent",
                  paddingBottom: 2,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#CC0000")}
                onMouseLeave={(e) => {
                  if (activeSection !== link.toLowerCase()) e.currentTarget.style.color = "#FFFFFF";
                }}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Mobile links / hamburger */}
          <div className="flex md:hidden items-center justify-between w-full">
            <div className="flex items-center gap-4 mx-auto flex-wrap justify-center">
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="font-body font-bold text-[9px] tracking-[2px] uppercase hidden min-[480px]:inline-block"
                  style={{
                    color: activeSection === link.toLowerCase() ? "#CC0000" : "#FFFFFF",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {link}
                </button>
              ))}
            </div>
            <button
              className="min-[480px]:hidden flex flex-col gap-[5px] p-2 ml-auto"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className="block w-5 h-[1px] bg-foreground" />
              <span className="block w-5 h-[1px] bg-foreground" />
              <span className="block w-5 h-[1px] bg-foreground" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center"
            style={{ background: "rgba(10,0,0,0.97)" }}
          >
            <button
              className="absolute top-5 right-5 text-foreground text-2xl"
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>
            <div className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => scrollTo(link)}
                  className="font-body font-bold text-[14px] tracking-[4px] uppercase"
                  style={{ color: "#FFFFFF", background: "none", border: "none" }}
                >
                  {link}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
