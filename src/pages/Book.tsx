import { useEffect } from "react";
import BookingSection from "@/components/BookingSection";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Book = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen noise-overlay" style={{ background: "#0A0000" }}>
      <div className="px-4 pt-6 pb-2 max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-body font-semibold text-[11px] tracking-[2px] uppercase transition-colors duration-200"
          style={{ color: "rgba(240,235,227,0.6)", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#CC0000"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(240,235,227,0.6)"}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>
      <BookingSection />
    </div>
  );
};

export default Book;
