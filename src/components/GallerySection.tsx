import { motion } from "framer-motion";

const images = [
  "https://i.imgur.com/YCOVP70.png",
  "https://i.imgur.com/HyINqXX.png",
  "https://i.imgur.com/g22R9eh.png",
  "https://i.imgur.com/HZrOG31.png",
  "https://i.imgur.com/Gydbp0P.png",
  "https://i.imgur.com/JcJOMeV.png",
  "https://i.imgur.com/soWv41b.png",
  "https://i.imgur.com/rAoRzxP.png",
];

const GallerySection = () => (
  <section id="gallery" className="py-[50px] px-4" style={{ background: "#0D0000" }}>
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>
          LIFE AT AUXILIARY
        </p>
        <h2 className="font-display text-[40px] max-[768px]:text-[30px] mt-2" style={{ color: "#FFFFFF" }}>
          A Night To Remember
        </h2>
        <div className="mx-auto mt-3" style={{ width: 60, height: 1, background: "#8B0000" }} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((src, i) => {
          const isFeature = i === 0 || i === 4;
          return (
            <motion.div
              key={i}
              className={`relative overflow-hidden group cursor-pointer ${
                isFeature ? "md:col-span-2 min-h-[280px] md:min-h-[380px]" : "aspect-[3/4]"
              } ${isFeature ? "col-span-2" : ""}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] group-hover:brightness-100 brightness-[0.8]"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(to top, rgba(80,0,0,0.7) 0%, transparent 60%)",
                }}
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
);

export default GallerySection;
