import { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }: {onComplete: () => void;}) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 2200;
    const interval = 20;
    const steps = duration / interval;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setProgress(Math.min(Math.round(eased * 100), 100));
      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => setFadeOut(true), 200);
        setTimeout(() => onComplete(), 700);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{
        backgroundColor: "#0D0000",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: fadeOut ? "none" : "all"
      }}>

      {/* Laser lines */}
      <div className="laser-lines">
        <div className="line" style={{ top: "20%", transform: "rotate(25deg)" }} />
        <div className="line" style={{ top: "40%", transform: "rotate(-18deg)" }} />
        <div className="line" style={{ top: "60%", transform: "rotate(32deg)" }} />
        <div className="line" style={{ top: "80%", transform: "rotate(-12deg)" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <img
          src="https://i.imgur.com/yM9hN27.png"
          alt="Auxiliary Logo"
          className="animate-logo-pulse"
          style={{
            width: 160,
            filter: "drop-shadow(0 0 20px rgba(139,0,0,0.8))"
          }} />

        






        {/* Loading bar */}
        <div
          className="mt-7"
          style={{
            width: 220,
            height: 2,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 1,
            overflow: "hidden"
          }}>

          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #8B0000 80%, #CC0000 100%)",
              transition: "width 0.02s linear"
            }} />

        </div>

        <p
          className="mt-[10px] font-body text-[11px] font-light tracking-[3px]"
          style={{ color: "rgba(255,255,255,0.5)" }}>

          {progress}%
        </p>
      </div>
    </div>);

};

export default LoadingScreen;