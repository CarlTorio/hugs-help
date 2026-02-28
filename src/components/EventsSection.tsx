import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EventData {
  id: string;
  slot: number;
  image_url: string | null;
  date_label: string;
  title: string;
  description: string;
}

const fallbackEvents: EventData[] = [
  { id: "1", slot: 1, image_url: "https://i.imgur.com/YCOVP70.png", date_label: "FEBRUARY 7, 2025", title: "Cupid's Choice — A Pink Affair", description: "The wildest Valentine's event in Novaliches." },
  { id: "2", slot: 2, image_url: "https://i.imgur.com/HyINqXX.png", date_label: "EVERY WEEKEND", title: "DJ Nights at Auxiliary", description: "Our resident and guest DJs keep the energy alive." },
  { id: "3", slot: 3, image_url: "https://i.imgur.com/g22R9eh.png", date_label: "OPEN FOR BOOKINGS", title: "Private Events & Celebrations", description: "Birthdays, debuts, company parties — we host it all." },
];

const EventsSection = () => {
  const [events, setEvents] = useState<EventData[]>(fallbackEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("slot", { ascending: true });
      if (!error && data && data.length > 0) {
        setEvents(data as EventData[]);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section id="events" className="py-[50px] px-4" style={{ background: "#0D0000" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>
            UPCOMING & PAST EVENTS
          </p>
          <h2 className="font-display text-[40px] max-[768px]:text-[30px] mt-2" style={{ color: "#FFFFFF" }}>
            Where The Night Lives
          </h2>
          <p className="font-body font-light text-[13px] mt-3" style={{ color: "rgba(240,235,227,0.6)" }}>
            Featuring the hottest DJs in the metro and exclusive themed nights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              className="overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group"
              style={{ background: "#1C0000", border: "1px solid rgba(139,0,0,0.2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(200,0,0,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(139,0,0,0.2)")}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="aspect-square overflow-hidden">
                {ev.image_url ? (
                  <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover brightness-[0.8] group-hover:brightness-100 transition-all duration-300" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "#2A0000" }}>
                    <span className="font-body text-[11px]" style={{ color: "rgba(240,235,227,0.3)" }}>No image</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="font-body font-bold text-[9px] tracking-[3px]" style={{ color: "#CC0000" }}>{ev.date_label}</p>
                <h3 className="font-display text-[26px] mt-2" style={{ color: "#FFFFFF" }}>{ev.title}</h3>
                <p className="font-body font-light text-[12px] leading-[1.8] mt-2" style={{ color: "rgba(240,235,227,0.6)" }}>{ev.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
