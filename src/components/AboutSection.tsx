import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

const stats = [
  { number: "7+", label: "YEARS SERVING QC" },
  { number: "50+", label: "SIGNATURE COCKTAILS" },
  { number: "500+", label: "EVENTS HOSTED" },
];

const childFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AboutSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasPlayedRef = useRef(false);
  const isInViewRef = useRef(false);
  const userInteractedRef = useRef(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const tryPlay = () => {
      if (hasPlayedRef.current || !videoRef.current || !isInViewRef.current || !userInteractedRef.current) return;
      hasPlayedRef.current = true;
      const video = videoRef.current;
      video.loop = false;
      video.currentTime = 0;
      video.muted = false;
      video.play().then(() => {
        setIsMuted(false);
      }).catch(() => {
        video.muted = true;
        video.play();
      });
    };

    const markInteracted = () => {
      userInteractedRef.current = true;
      tryPlay();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) tryPlay();
      },
      { threshold: 0.3 }
    );

    const events = ["click", "touchstart", "scroll", "keydown"] as const;
    events.forEach(e => window.addEventListener(e, markInteracted, { passive: true }));
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      events.forEach(e => window.removeEventListener(e, markInteracted));
      observer.disconnect();
    };
  }, []);

  const handleEnded = () => {
    setIsEnded(true);
    if (videoRef.current) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.loop = false;
      videoRef.current.play();
      setIsMuted(false);
      setIsEnded(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section id="about" className="relative py-[90px]" style={{ background: "#130000" }}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-0">
        {/* Left - Content */}
        <motion.div
          className="w-full md:w-1/2 px-6 md:px-16 py-10 md:py-16 flex flex-col justify-center gap-[22px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.p
            className="font-body font-semibold text-[9px] tracking-[5px] uppercase"
            style={{ color: "#CC0000" }}
            variants={childFade}
          >
            OUR STORY
          </motion.p>
          <motion.div
            style={{ width: 60, height: 1, background: "#8B0000" }}
            variants={{ hidden: { scaleX: 0, originX: 0 }, visible: { scaleX: 1, transition: { duration: 0.6 } } }}
          />
          <motion.h2
            className="font-display text-[40px] max-[768px]:text-[30px] tracking-[2px]"
            style={{ color: "#FFFFFF" }}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            More Than Just A Bar
          </motion.h2>
          <motion.div className="flex flex-col gap-4" variants={childFade}>
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
            className="grid grid-cols-3 gap-3 mt-4"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                className="border p-4 text-center transition-all duration-300 group"
                style={{ borderColor: "rgba(139,0,0,0.25)" }}
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } } }}
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
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right - Video */}
        <div ref={sectionRef} className="relative w-full md:w-1/2 h-[280px] md:h-auto md:min-h-[560px] overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleEnded}
            className="absolute inset-0 w-full h-full object-cover"
            src="https://i.imgur.com/7zTw3OG.mp4"
          />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
          <div
            className="absolute inset-0 hidden md:block"
            style={{ background: "linear-gradient(to left, transparent 70%, #130000 100%)" }}
          />

          {/* Controls overlay */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            {isEnded && (
              <button
                onClick={handleReplay}
                className="p-2 rounded-full backdrop-blur-sm transition-opacity hover:opacity-100 opacity-70"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                <Play size={20} color="#fff" />
              </button>
            )}
            {!isEnded && (
              <button
                onClick={toggleMute}
                className="p-2 rounded-full backdrop-blur-sm transition-opacity hover:opacity-100 opacity-70"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                {isMuted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
