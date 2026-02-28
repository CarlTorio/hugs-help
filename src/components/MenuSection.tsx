import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type MenuItem = { name: string; sub?: string; price: string };
type MenuCategory = { label: string; items: MenuItem[] };

const MENU: MenuCategory[] = [
  {
    label: "APPETIZERS",
    items: [
      { name: "Chicken Poppers", sub: "Gravy, Kpop Sauce", price: "₱299" },
      { name: "Orange Chicken", price: "₱299" },
      { name: "Pork Shanghai", price: "₱239" },
      { name: "Fried Siomai", price: "₱239" },
      { name: "Pork Bulaklak", price: "₱239" },
      { name: "Cheesesticks", price: "₱199" },
      { name: "Sizzling Tofu", price: "₱189" },
      { name: "Nachos", sub: "Beef, Tuna", price: "₱279" },
      { name: "Cheesy Fries", price: "₱259" },
      { name: "Chicken Skin", price: "₱239" },
      { name: "Sliced Cucumber in Vinegar", price: "₱189" },
      { name: "Sliced Lemon", price: "₱88" },
    ],
  },
  {
    label: "MAIN DISH",
    items: [
      { name: "Half Fried Chicken", price: "₱449" },
      { name: "Whole Fried Chicken", price: "₱898" },
      { name: "Chicken Wings", sub: "Original, Cheese, BBQ, Sour Cream", price: "₱349" },
      { name: "Sizzling Sisig", price: "₱299" },
      { name: "Crispy Pata", price: "₱949" },
      { name: "Lechon Kawali", price: "₱349" },
      { name: "Spicy Spareribs", price: "₱349" },
      { name: "Sizzling Beef", price: "₱349" },
      { name: "Burger Steak", sub: "5pcs", price: "₱199" },
      { name: "Sizzling Hungarian", price: "₱299" },
      { name: "Sizzling Hotdog", price: "₱239" },
    ],
  },
  {
    label: "BEERS",
    items: [
      { name: "San Mig Pale", price: "₱95 / ₱468" },
      { name: "San Mig Light", price: "₱95 / ₱468" },
      { name: "San Mig Apple", price: "₱95 / ₱468" },
      { name: "Smirnoff Mule", price: "₱95 / ₱468" },
      { name: "Corona Extra", price: "₱159 / ₱788" },
      { name: "Heineken", price: "₱159 / ₱788" },
    ],
  },
  {
    label: "COGNAC",
    items: [
      { name: "Hennessy VSOP", sub: "700ml", price: "₱5,999" },
      { name: "Hennessy VS Cognac", price: "₱4,449" },
    ],
  },
  {
    label: "VODKA/GIN",
    items: [
      { name: "Stoli Vodka", price: "₱999" },
      { name: "Smirnoff Vodka", price: "₱1,899" },
      { name: "Tanqueray", price: "₱1,899" },
    ],
  },
  {
    label: "TEQUILA",
    items: [
      { name: "Jose Cuervo 1L", price: "₱2,399" },
      { name: "Jose Cuervo Per Shot", price: "₱200" },
      { name: "1800 Reposado 750ml", price: "₱2,999" },
      { name: "1800 Reposado Per Shot", price: "₱200" },
      { name: "Mojitos", price: "₱1,199" },
      { name: "El Hombre", price: "₱1,199" },
      { name: "Tequila Rose", price: "₱1,899" },
      { name: "Patron Silver", price: "₱5,499" },
    ],
  },
  {
    label: "RHUM",
    items: [
      { name: "Bacardi Gold", price: "₱1,699" },
      { name: "Bacardi White", price: "₱1,699" },
      { name: "Alfonso w/ Coke 1.5L", price: "₱899" },
      { name: "Fundador w/ Coke 1.5L", price: "₱899" },
      { name: "Zabana w/ Coke 1.5L", price: "₱699" },
      { name: "Chivas (700ml)", price: "₱1,999" },
      { name: "Chivas 1L", price: "₱2,399" },
      { name: "Jameson", price: "₱1,899" },
    ],
  },
  {
    label: "WHISKEY",
    items: [
      { name: "Charles and James 1L", price: "₱869" },
      { name: "Jack Daniels 1L", price: "₱2,899" },
      { name: "Jack Daniels Per Shot", price: "₱200" },
      { name: "J.W. Black Label 1L", price: "₱2,499" },
      { name: "J.W. Black Label Per Shot", price: "₱200" },
      { name: "Red Label", price: "₱1,699" },
      { name: "Gold Label", price: "₱4,999" },
      { name: "Jagermeister", sub: "700ml", price: "₱1,799" },
    ],
  },
  {
    label: "COCKTAILS",
    items: [
      { name: "Cocktail Towers", sub: "Poison Ivy, Bloodmoon, Auxiliary Best, Cheetah, Notorious", price: "₱349 each" },
      { name: "Cocktail Shooters", sub: "Tequila Sunrise, Sex on the Beach, Screw Driver, Cuba Libre, Long Island I.T., Tokyo Iced Tea, Adios MF, Margarita, Mojito, Cosmopolitan, B52, and more", price: "₱150 each" },
    ],
  },
  {
    label: "NON-ALCOHOLIC",
    items: [
      { name: "Bottled Water", price: "₱50" },
      { name: "Coke in Can", price: "₱70" },
      { name: "Sprite in Can", price: "₱70" },
      { name: "Royal in Can", price: "₱70" },
      { name: "Coke 1.5L", price: "₱169" },
      { name: "Coke Zero", price: "₱169" },
      { name: "Cucumber Lemonade Carafe", price: "₱100" },
      { name: "Iced Tea Carafe", price: "₱100" },
      { name: "Blue Lemonade Carafe", price: "₱100" },
    ],
  },
];

const VISIBLE_TABS_MOBILE = 4;

const MenuSection = () => {
  const [active, setActive] = useState(0);
  const [showAllTabs, setShowAllTabs] = useState(false);

  const visibleTabs = MENU.slice(0, VISIBLE_TABS_MOBILE);
  const hiddenTabs = MENU.slice(VISIBLE_TABS_MOBILE);

  return (
    <section id="menu" className="py-[50px] px-4" style={{ background: "#130000" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-body font-semibold text-[9px] tracking-[5px] uppercase" style={{ color: "#CC0000" }}>
            WHAT WE SERVE
          </p>
          <h2 className="font-display text-[40px] max-[768px]:text-[30px] mt-2" style={{ color: "#FFFFFF" }}>
            Our Menu
          </h2>
          <p className="font-body font-light text-[13px] mt-2" style={{ color: "rgba(240,235,227,0.6)" }}>
            From handcrafted cocktails to savory pulutan — we've got you covered.
          </p>
        </div>

        {/* Desktop Tabs - unchanged */}
        <div className="hidden md:flex gap-2 pb-3 mb-8 justify-center">
          {MENU.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActive(i)}
              className="font-body font-bold text-[9px] tracking-[2.5px] uppercase whitespace-nowrap px-3 py-2 transition-all duration-200 shrink-0"
              style={{
                color: active === i ? "#CC0000" : "rgba(240,235,227,0.5)",
                borderBottom: active === i ? "2px solid #8B0000" : "2px solid transparent",
                background: "none",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile Tabs - wrapped with collapsible */}
        <div className="md:hidden mb-6">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {visibleTabs.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => { setActive(i); setShowAllTabs(false); }}
                className="font-body font-bold text-[8px] tracking-[2px] uppercase px-2.5 py-1.5 transition-all duration-200"
                style={{
                  color: active === i ? "#CC0000" : "rgba(240,235,227,0.5)",
                  borderBottom: active === i ? "2px solid #8B0000" : "2px solid transparent",
                  background: "none",
                }}
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => setShowAllTabs(!showAllTabs)}
              className="font-body font-bold text-[8px] tracking-[2px] uppercase px-2.5 py-1.5 flex items-center gap-1 transition-all duration-200"
              style={{
                color: active >= VISIBLE_TABS_MOBILE ? "#CC0000" : "rgba(240,235,227,0.5)",
                borderBottom: active >= VISIBLE_TABS_MOBILE ? "2px solid #8B0000" : "2px solid transparent",
                background: "none",
              }}
            >
              MORE
              <ChevronDown
                size={12}
                className="transition-transform duration-200"
                style={{ transform: showAllTabs ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
          </div>
          <AnimatePresence>
            {showAllTabs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                  {hiddenTabs.map((cat, i) => {
                    const realIndex = i + VISIBLE_TABS_MOBILE;
                    return (
                      <button
                        key={cat.label}
                        onClick={() => { setActive(realIndex); setShowAllTabs(false); }}
                        className="font-body font-bold text-[8px] tracking-[2px] uppercase px-2.5 py-1.5 transition-all duration-200"
                        style={{
                          color: active === realIndex ? "#CC0000" : "rgba(240,235,227,0.5)",
                          borderBottom: active === realIndex ? "2px solid #8B0000" : "2px solid transparent",
                          background: "none",
                        }}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8"
          >
            {MENU[active].items.map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between py-2.5 md:py-4 transition-colors duration-200 hover:bg-[rgba(139,0,0,0.06)] px-3"
                style={{ borderBottom: "1px solid rgba(139,0,0,0.1)" }}
              >
                <div>
                  <p className="font-body font-medium text-[11px] md:text-[12px]" style={{ color: "#FFFFFF" }}>
                    {item.name}
                  </p>
                  {item.sub && (
                    <p className="font-body font-light text-[9px] md:text-[10px] mt-0.5" style={{ color: "rgba(240,235,227,0.5)" }}>
                      {item.sub}
                    </p>
                  )}
                </div>
                <p className="font-display text-[18px] md:text-[22px] shrink-0 ml-4" style={{ color: "#CC0000" }}>
                  {item.price}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="font-body font-light text-[13px] mb-4" style={{ color: "rgba(240,235,227,0.7)" }}>
            Want to host your own event?
          </p>
          <a
            href="https://www.facebook.com/messages/t/853504411170602"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-body font-bold text-[12px] tracking-[2.5px] uppercase rounded-full px-10 py-3 transition-all duration-200"
            style={{ background: "#8B0000", color: "#FFFFFF" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#A80000";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(139,0,0,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#8B0000";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            INQUIRE NOW
          </a>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
