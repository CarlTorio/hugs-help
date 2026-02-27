import { motion } from "framer-motion";
import { Wine, Sofa, Music } from "lucide-react";
import { Link } from "react-router-dom";

const zones = [
  {
    icon: Wine,
    title: "THE BAR",
    desc: "Pull up a seat and enjoy our premium lineup of cocktails, whiskeys, and ice-cold beers. The bar is where conversations flow and the drinks never stop.",
    link: "/the-bar",
  },
  {
    icon: Sofa,
    title: "THE LOUNGE",
    desc: "Kick back in our lounge area with your crew. The perfect spot to chill, vibe to the music, and enjoy bottle service in a more relaxed setting.",
    link: "/the-lounge",
  },
  {
    icon: Music,
    title: "EVENTS & PARTIES",
    desc: "From themed nights to private celebrations, Auxiliary transforms into the ultimate party venue. Birthdays, holidays, and everything in between.",
    link: "/events",
  },
];

const ExploreSection = () => (
  <section className="py-[90px] px-4" style={{ background: "#130000" }}>
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <p
          className="font-body font-semibold text-[9px] tracking-[5px] uppercase"
          style={{ color: "#CC0000" }}
        >
          DISCOVER AUXILIARY
        </p>
        <h2
          className="font-display text-[56px] max-[768px]:text-[38px] mt-2"
          style={{ color: "#FFFFFF" }}
        >
          Explore Our Experience
        </h2>
        <p
          className="font-body font-light text-[13px] mt-3"
          style={{ color: "rgba(240,235,227,0.6)" }}
        >
          Auxiliary offers different vibes for every kind of night.
        </p>
        <div
          className="mx-auto mt-4"
          style={{ width: 60, height: 1, background: "#8B0000" }}
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {zones.map((zone, i) => {
          const Icon = zone.icon;
          return (
            <motion.div
              key={zone.title}
              className="p-8 text-center flex flex-col items-center gap-5 transition-all duration-300 group"
              style={{
                background: "#1C0000",
                border: "1px solid rgba(139,0,0,0.25)",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{
                borderColor: "rgba(200,0,0,0.7)",
                boxShadow: "0 0 25px rgba(139,0,0,0.4)",
              }}
            >
              <Icon size={48} color="#FFFFFF" strokeWidth={1.5} />
              <h3
                className="font-display text-[28px] tracking-[2px]"
                style={{ color: "#FFFFFF" }}
              >
                {zone.title}
              </h3>
              <p
                className="font-body font-light text-[13px] leading-[1.9]"
                style={{ color: "rgba(240,235,227,0.65)" }}
              >
                {zone.desc}
              </p>
              <Link
                to={zone.link}
                className="inline-block font-body font-bold text-[11px] tracking-[2.5px] uppercase rounded-full px-8 py-2.5 mt-2 transition-all duration-200"
                style={{
                  border: "1px solid #8B0000",
                  color: "#FFFFFF",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#8B0000";
                  e.currentTarget.style.boxShadow =
                    "0 0 15px rgba(139,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                MORE
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default ExploreSection;
