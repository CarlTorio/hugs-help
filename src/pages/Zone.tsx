import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getSetting } from "@/lib/settings";

const DEFAULT_PHOTOS = [
  "https://i.imgur.com/0Dhizhi.jpeg",
  "https://i.imgur.com/OY2szyb.jpeg",
  "https://i.imgur.com/x8R9AKQ.jpeg",
  "https://i.imgur.com/6XUaBES.jpeg",
  "https://i.imgur.com/KM3bpwp.jpeg",
  "https://i.imgur.com/YIKG10V.jpeg",
  "https://i.imgur.com/grk9EHX.jpeg",
  "https://i.imgur.com/b3eCPi0.jpeg",
  "https://i.imgur.com/iN0I9Qu.jpeg",
  "https://i.imgur.com/Xjt2UbG.jpeg",
];

const Zone = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const raw = await getSetting("zone_photos");
      if (raw) {
        setPhotos(JSON.parse(raw));
      } else {
        setPhotos(DEFAULT_PHOTOS);
      }
    } catch {
      setPhotos(DEFAULT_PHOTOS);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0D0000" }}>
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-body font-semibold text-[11px] tracking-[2px] uppercase transition-colors duration-200"
          style={{ color: "rgba(240,235,227,0.6)", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#CC0000")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,235,227,0.6)")}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      <section className="py-[50px] px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>
              LIFE AT AUXILIARY
            </p>
            <h2 className="font-display text-[40px] max-[768px]:text-[30px] mt-2" style={{ color: "#FFFFFF" }}>
              The Zone
            </h2>
            <div className="mx-auto mt-3" style={{ width: 60, height: 1, background: "#8B0000" }} />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((src, i) => {
              const isFeature = i === 0 || i === 4;
              return (
                <motion.div
                  key={i}
                  className={`relative overflow-hidden group cursor-pointer ${
                    isFeature ? "md:col-span-2 min-h-[280px] md:min-h-[380px] col-span-2" : "aspect-[3/4]"
                  }`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                >
                  <img
                    src={src}
                    alt={`Zone ${i + 1}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] group-hover:brightness-100 brightness-[0.8]"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(80,0,0,0.7) 0%, transparent 60%)" }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(139,0,0,0.5)" }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Zone;
