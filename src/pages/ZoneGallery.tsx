import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const zoneData: Record<string, { title: string; images: string[] }> = {
  "the-bar": {
    title: "The Bar",
    images: [
      "https://i.imgur.com/YCOVP70.png",
      "https://i.imgur.com/HyINqXX.png",
      "https://i.imgur.com/g22R9eh.png",
      "https://i.imgur.com/HZrOG31.png",
      "https://i.imgur.com/Gydbp0P.png",
      "https://i.imgur.com/JcJOMeV.png",
    ],
  },
  "the-lounge": {
    title: "The Lounge",
    images: [
      "https://i.imgur.com/soWv41b.png",
      "https://i.imgur.com/rAoRzxP.png",
      "https://i.imgur.com/YCOVP70.png",
      "https://i.imgur.com/HyINqXX.png",
      "https://i.imgur.com/g22R9eh.png",
      "https://i.imgur.com/HZrOG31.png",
    ],
  },
  events: {
    title: "Events & Parties",
    images: [
      "https://i.imgur.com/Gydbp0P.png",
      "https://i.imgur.com/JcJOMeV.png",
      "https://i.imgur.com/soWv41b.png",
      "https://i.imgur.com/rAoRzxP.png",
      "https://i.imgur.com/YCOVP70.png",
      "https://i.imgur.com/HyINqXX.png",
    ],
  },
};

const ZoneGallery = () => {
  const location = useLocation();
  const zone = location.pathname.replace("/", "");
  const data = zoneData[zone] || null;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0000", color: "#FFF" }}>
        <p>Zone not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0D0000" }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-[12px] tracking-[2px] uppercase transition-colors duration-200"
          style={{ color: "rgba(240,235,227,0.6)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#CC0000")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,235,227,0.6)")}
        >
          <ArrowLeft size={16} />
          BACK TO HOME
        </Link>
        <h1 className="font-display text-[56px] max-[768px]:text-[38px] mt-4" style={{ color: "#FFFFFF" }}>
          {data.title}
        </h1>
        <div className="mt-3" style={{ width: 60, height: 1, background: "#8B0000" }} />
      </div>

      {/* Gallery grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {data.images.map((src, i) => (
            <motion.div
              key={i}
              className="break-inside-avoid overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <img
                src={src}
                alt={`${data.title} ${i + 1}`}
                className="w-full object-cover brightness-[0.85] hover:brightness-100 transition-all duration-300"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZoneGallery;
