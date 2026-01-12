import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

// --- STÍLUS ÉS BETŰTÍPUS IMPORTÁLÁS (INLINE) ---
const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    
    body {
      font-family: 'DM Sans', sans-serif;
      background-color: #FDFBF7;
    }
    h1, h2, h3, .font-serif {
      font-family: 'Playfair Display', serif;
    }
    .soft-shadow {
      box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
    }
    .card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px -10px rgba(56, 112, 53, 0.15);
    }
  `}</style>
);

// --- SVG IKONOK ---
const IconPlate = () => (
  <svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconCamera = () => (
  <svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconGift = () => (
  <svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const IconMap = () => (
   <svg className="w-4 h-4 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
   </svg>
);

// --- SZÓTÁR (HU / EN) ---
const TRANSLATIONS = {
  hu: {
    hero: {
      title1: "A miskolci kocsonya",
      title2: "az asztalhoz ül.",
      subtitle: "A Kocsonyafesztivál élménye idén az éttermekben is folytatódik. Fedezd fel a környék legjobb ízeit, gyűjtsd a pecséteket és nyerj!",
      cta_primary: "Játék és feltöltés",
      cta_secondary: "Étteremlista megtekintése"
    },
    story: {
      title: "Kocsonya Útlevél 2026",
      p1: "Idén egy új összefogás csatlakozik a fesztiválhoz. Több miskolci étterem közösen azon dolgozik, hogy a Kocsonyafesztivál élménye a vendéglátóterekben is megjelenjen.",
      quote: "„A miskolci kocsonya az asztalhoz ül.”",
      p2: "A cél az, hogy a kocsonya – mint a Kocsonyafesztivál szimbóluma – minél több arcát mutathassa meg: hagyományosan, modernül, újragondolva, de minden esetben miskolci kötődéssel."
    },
    quotes: {
      title: "Megszólalnak a szervezők",
      more: "...és még sokan mások a városért."
    },
    rules: {
      title: "Így vehetsz részt a játékban",
      step1_title: "1. Egyél",
      step1_desc: "Válassz egyet a résztvevő éttermek különleges kocsonyái közül.",
      step2_title: "2. Fotózz",
      step2_desc: "Gyűjts pecsétet vagy fotózd le a kocsonya útleveledet.",
      step3_title: "3. Nyerj",
      step3_desc: "Töltsd fel a fotót itt az oldalon és nyerj értékes ajándékokat!",
      cta: "FOTÓ FELTÖLTÉSE MOST"
    },
    prizes: {
      title: "Nyeremények",
      item1: "3× 2 éjszakás miskolci hétvége",
      item2: "Szállás + Teljes ellátás",
      item3: "Miskolc Pass turisztikai kártya",
      quote: "Ez nem csak egy vacsora. Ez egy miskolci élménycsomag."
    },
    restaurants: {
      title: "Résztvevő éttermek és menük",
      disclaimer: "A lista és az árak tájékoztató jellegűek. A fényképezőgép ikonra kattintva megnézheted az ételt.",
      loading: "Éttermek betöltése...",
      location_btn: "Térkép"
    },
    footer_cta: {
      title: "A kocsonya az asztalhoz ül. Te is?",
      btn: "CSATLAKOZOM A JÁTÉKHOZ"
    }
  },
  en: {
    hero: {
      title1: "Miskolc Jelly comes",
      title2: "to the table.",
      subtitle: "The Jelly Festival experience continues in restaurants this year. Discover the best flavors of the region, collect stamps, and win!",
      cta_primary: "Play & Upload",
      cta_secondary: "View Restaurant List"
    },
    story: {
      title: "Jelly Passport 2026",
      p1: "This year, a new collaboration joins the festival. Several Miskolc restaurants are working together to bring the Jelly Festival experience into their dining rooms.",
      quote: "“The Miskolc Jelly takes a seat at the table.”",
      p2: "The goal is to show as many faces of the jelly – the symbol of the festival – as possible: traditional, modern, reimagined, but always with a Miskolc connection."
    },
    quotes: {
      title: "Words from the Organizers",
      more: "...and many others for the city."
    },
    rules: {
      title: "How to Participate",
      step1_title: "1. Eat",
      step1_desc: "Choose a special jelly from the participating restaurants.",
      step2_title: "2. Snap",
      step2_desc: "Collect a stamp or take a photo of your Jelly Passport.",
      step3_title: "3. Win",
      step3_desc: "Upload the photo on this page and win valuable prizes!",
      cta: "UPLOAD PHOTO NOW"
    },
    prizes: {
      title: "Prizes",
      item1: "3× 2-night weekend in Miskolc",
      item2: "Accommodation + Full Board",
      item3: "Miskolc Pass tourist card",
      quote: "It's not just a dinner. It's a Miskolc experience package."
    },
    restaurants: {
      title: "Participating Restaurants & Menus",
      disclaimer: "The list and prices are for information purposes. Click the camera icon to see the dish.",
      loading: "Loading restaurants...",
      location_btn: "Map"
    },
    footer_cta: {
      title: "The Jelly takes a seat. Will you?",
      btn: "JOIN THE GAME"
    }
  }
};

const QUOTES = [
  {
    name: "Varga Henriett",
    role: { hu: "ötletgazda", en: "Founder of the idea" },
    text: { 
      hu: "Számunkra a kocsonya nemcsak hagyományos étel, hanem alapanyag, forma és gondolkodás kérdése is.", 
      en: "For us, jelly is not just a traditional dish, but a question of ingredient, form, and mentality." 
    }
  },
  {
    name: "Vass László",
    role: { hu: "főszervező", en: "Main Organizer" },
    text: { 
      hu: "Az egység megteremtése, a közös cél és az egymást erősítő jelenlét az, ami igazán értéket ad.", 
      en: "Creating unity, a common goal, and a mutually reinforcing presence is what truly adds value." 
    }
  },
  {
    name: "Fekete-Angyal Enikő",
    role: { hu: "ügyvezető, Visit Miskolc", en: "CEO, Visit Miskolc" },
    text: { 
      hu: "Miskolc akkor működik igazán desztinációként, ha az élmények összeérnek.", 
      en: "Miskolc truly works as a destination when experiences come together." 
    }
  },
  {
    name: "Lipták Ádám",
    role: { hu: "főszervező", en: "Festival Organizer" },
    text: { 
      hu: "Ez az együttműködés egyértelműen win-win helyzet: értéket teremt a fesztiválnak.", 
      en: "This cooperation is clearly a win-win situation: it creates value for the festival." 
    }
  }
];

// --- SEGÉDFÜGGVÉNY: Google Drive Linkek átalakítása ---
const getOptimizedImageUrl = (url) => {
  if (!url) return null;
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    const idMatch = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
    const id = idMatch ? (idMatch[1] || idMatch[2]) : null;
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}=w800`;
    }
  }
  return url;
};

// --- CSV PARSOLÓ ---
const parseCSV = (text) => {
  const lines = text.split("\n");
  const groupedRestaurants = {};
  const csvRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const row = lines[i].split(csvRegex).map(cell => {
      let clean = cell.trim();
      if (clean.startsWith('"') && clean.endsWith('"')) {
        clean = clean.substring(1, clean.length - 1);
      }
      return clean.replace(/""/g, '"');
    });
    
    if (row.length < 2 || !row[0]) continue;

    const name = row[0];
    const address = row[1];
    const menuHu = row[2];
    const descHu = row[3];
    const menuEn = row[4];
    const descEn = row[5];
    const price = row[6];
    const active = row[7]?.toLowerCase().trim();
    const rawImageUrl = row[8] || ""; 
    const imageUrl = getOptimizedImageUrl(rawImageUrl);

    if (active === 'x') {
      if (!groupedRestaurants[name]) {
        groupedRestaurants[name] = {
          name: name,
          address: address,
          imageUrl: imageUrl,
          menus: []
        };
      } else if (!groupedRestaurants[name].imageUrl && imageUrl) {
        groupedRestaurants[name].imageUrl = imageUrl;
      }
      
      groupedRestaurants[name].menus.push({
        nameHu: menuHu,
        descHu: descHu,
        nameEn: menuEn || menuHu,
        descEn: descEn,
        price: price
      });
    }
  }

  return Object.values(groupedRestaurants);
};

// --- JAVÍTOTT, MODERN KÁRTYA KOMPONENS ---
const RestaurantCard = ({ restaurant, lang }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative group perspective-1000 w-full h-full min-h-[450px]">
      <div 
        className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* --- ELŐLAP (MODERN DIZÁJN) --- */}
        <div 
           className="relative w-full h-full [backface-visibility:hidden] bg-white rounded-3xl soft-shadow card-hover transition-all duration-300 flex flex-col overflow-hidden"
           style={{ zIndex: isFlipped ? 0 : 10 }}
        >
          {/* VÍZJEL HÁTTÉR */}
          <div className="absolute -bottom-8 -right-8 text-[#77b92b] opacity-[0.03] transform rotate-12 pointer-events-none select-none z-0">
             <svg width="200" height="200" viewBox="0 0 24 24" stroke="currentColor" fill="none">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
          </div>

          <div className="p-8 flex flex-col h-full relative z-10">
            {/* Flip gomb */}
            {restaurant.imageUrl && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                className="absolute top-6 right-6 z-20 p-2.5 bg-green-50 rounded-full text-[#387035] hover:bg-[#387035] hover:text-white transition-all shadow-sm hover:shadow-md active:scale-95 group-hover:animate-pulse"
                title="Kép megtekintése"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}

            {/* Étterem Név */}
            <h3 className="text-2xl font-serif font-bold text-[#387035] mb-3 pr-10 leading-tight">
              {restaurant.name}
            </h3>
            <div className="w-10 h-0.5 bg-[#77b92b] rounded-full mb-6 opacity-60"></div>
            
            <div className="space-y-5 mb-4 flex-grow">
              {restaurant.menus.map((item, i) => (
                <div key={i} className="text-slate-700 text-sm border-l border-slate-200 pl-4 leading-relaxed">
                   <div className="font-bold text-slate-800 text-base">{lang === 'hu' ? item.nameHu : item.nameEn}</div>
                   {((lang === 'hu' && item.descHu) || (lang === 'en' && item.descEn)) && (
                     <div className="text-sm text-slate-500 mt-1.5 font-light tracking-wide">{lang === 'hu' ? item.descHu : item.descEn}</div>
                   )}
                   {item.price && <div className="text-[#C84C44] font-semibold text-xs mt-2 bg-red-50 inline-block px-2 py-0.5 rounded-md">{item.price} Ft</div>}
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-sm text-slate-400 mt-auto">
               <a 
                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address + " " + restaurant.name + " Miskolc")}`}
                 target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1.5 hover:text-[#387035] transition-colors z-10 font-medium"
               >
                 <IconMap /> {restaurant.address}
               </a>
            </div>
          </div>
        </div>

        {/* --- HÁTLAP (KÉP) --- */}
        <div 
           className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-3xl shadow-xl border border-slate-100 cursor-pointer overflow-hidden"
           onClick={() => setIsFlipped(false)}
           style={{ 
             zIndex: isFlipped ? 20 : 0, 
             WebkitMaskImage: '-webkit-radial-gradient(white, black)'
           }}
        >
          {restaurant.imageUrl ? (
            <img 
              src={restaurant.imageUrl} 
              alt={restaurant.name}
              className="w-full h-full object-cover rounded-3xl transition-transform duration-700 hover:scale-105"
              onClick={() => setIsFlipped(false)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-serif italic">Kép hamarosan...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { lang, setLang } = useLanguage();
  const t = TRANSLATIONS[lang]; 
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRSM975tF3jWF7WhR90O9LQrGuDb-FKJwA9GrSe3wbnuEYVRl9Y_DNYH364g-hkHBYazm3SH-OUXe28/pub?gid=666430223&single=true&output=csv&t=${Date.now()}`);
        const csvText = await response.text();
        const data = parseCSV(csvText);
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error("Hiba az adatok betöltésekor:", error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <Layout lang={lang} setLang={setLang}>
      <GlobalStyles />
      
      {/* HERO SZEKCIÓ */}
      <section className="relative rounded-[2.5rem] bg-white overflow-hidden soft-shadow mb-12">
        <div className="w-full">
           <img src="/kocsonya/banner.jpg" alt="Kocsonya Útlevél 2026 Miskolc" className="w-full h-auto object-contain" />
        </div>
        {/* Szélesebb konténer a szövegnek (max-w-7xl) és whitespace-nowrap lg képernyőtől */}
        <div className="px-6 py-12 sm:px-12 text-center max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl lg:whitespace-nowrap font-serif font-bold text-[#387035] mb-8 leading-tight tracking-tight">
            {t.hero.title1} {t.hero.title2}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            {/* ÚJ GOMB DIZÁJN: Editorial stílus */}
            <Link href="/feltoltes" className="inline-flex items-center justify-center rounded-full bg-[#387035] text-white px-8 py-4 font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a5528] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              {t.hero.cta_primary}
            </Link>
            <a href="#etteremlista" className="inline-flex items-center justify-center rounded-full border border-[#387035] text-[#387035] bg-transparent hover:bg-[#387035] hover:text-white px-8 py-4 font-bold text-sm uppercase tracking-[0.1em] transition-all">
              {t.hero.cta_secondary}
            </a>
          </div>
        </div>
      </section>

      {/* STORY SZEKCIÓ */}
      <section className="mt-16 px-4 sm:px-6 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-serif font-bold text-[#387035] mb-8">{t.story.title}</h2>
        <div className="prose prose-lg mx-auto text-slate-700 leading-8 font-light">
          <p className="mb-6">{t.story.p1}</p>
          <p className="font-serif font-medium text-[#387035] text-2xl italic mb-8 relative inline-block">
            <span className="opacity-20 text-6xl absolute -top-4 -left-6">“</span>
            {t.story.quote}
            <span className="opacity-20 text-6xl absolute -bottom-8 -right-6">”</span>
          </p>
          <p>{t.story.p2}</p>
        </div>
      </section>

      {/* QUOTES SZEKCIÓ */}
      <section className="mt-20 bg-white py-16 rounded-[2.5rem] soft-shadow">
        <div className="px-6 text-center mb-10"><h3 className="text-3xl font-serif font-bold text-[#387035]">{t.quotes.title}</h3></div>
        <div className="px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {QUOTES.slice(0, 4).map((quote, idx) => (
            <div key={idx} className="bg-[#FDFBF7] p-8 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow">
              <p className="text-slate-600 italic mb-4 font-serif text-lg">"{quote.text[lang]}"</p>
              <div className="font-bold text-[#387035]">{quote.name}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{quote.role[lang]}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10"><p className="text-sm text-slate-400 font-medium tracking-wide uppercase">{t.quotes.more}</p></div>
      </section>

      {/* RULES SZEKCIÓ */}
      <section className="mt-20">
        <div className="bg-[#387035] rounded-[2.5rem] p-8 sm:p-16 text-white shadow-2xl shadow-green-900/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-8">{t.rules.title}</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6"><div className="p-4 bg-white/10 rounded-2xl text-[#aadd77] backdrop-blur-sm"><IconPlate /></div><div><h4 className="font-bold text-xl mb-1">{t.rules.step1_title}</h4><p className="text-green-100 text-base leading-relaxed opacity-90">{t.rules.step1_desc}</p></div></div>
                <div className="flex items-start gap-6"><div className="p-4 bg-white/10 rounded-2xl text-[#aadd77] backdrop-blur-sm"><IconCamera /></div><div><h4 className="font-bold text-xl mb-1">{t.rules.step2_title}</h4><p className="text-green-100 text-base leading-relaxed opacity-90">{t.rules.step2_desc}</p></div></div>
                <div className="flex items-start gap-6"><div className="p-4 bg-white/10 rounded-2xl text-[#aadd77] backdrop-blur-sm"><IconGift /></div><div><h4 className="font-bold text-xl mb-1">{t.rules.step3_title}</h4><p className="text-green-100 text-base leading-relaxed opacity-90">{t.rules.step3_desc}</p></div></div>
              </div>
              <div className="mt-12">
                <Link href="/feltoltes" className="inline-block w-full sm:w-auto text-center bg-white text-[#387035] hover:bg-green-50 font-bold text-sm uppercase tracking-[0.1em] py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-xl">
                  {t.rules.cta}
                </Link>
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-md">
              <h3 className="text-2xl font-serif font-bold text-[#aadd77] mb-6">{t.prizes.title}</h3>
              <ul className="space-y-4 text-white">
                <li className="flex items-center gap-3"><span className="text-[#aadd77] text-xl">★</span> <span className="text-lg">{t.prizes.item1}</span></li>
                <li className="flex items-center gap-3"><span className="text-[#aadd77] text-xl">★</span> <span className="text-lg">{t.prizes.item2}</span></li>
                <li className="flex items-center gap-3"><span className="text-[#aadd77] text-xl">★</span> <span className="text-lg">{t.prizes.item3}</span></li>
              </ul>
              <p className="mt-8 text-sm text-green-200 italic opacity-80 font-serif">"{t.prizes.quote}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* ÉTTEREMLISTA */}
      <section id="etteremlista" className="mt-24 mb-24">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#387035] mb-4">{t.restaurants.title}</h2>
          <div className="h-1 w-20 bg-[#77b92b] mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500">{t.restaurants.disclaimer}</p>
        </div>
        {loading ? (
          <div className="text-center py-24 text-slate-400 font-light text-xl animate-pulse"><p>{t.restaurants.loading}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant, index) => (<RestaurantCard key={index} restaurant={restaurant} lang={lang} />))}
          </div>
        )}
      </section>

      {/* CTA Footer */}
      <section className="bg-white border border-slate-100 soft-shadow py-16 text-center rounded-[2.5rem] mb-12">
        <h2 className="text-3xl font-serif font-bold text-[#387035] mb-8">{t.footer_cta.title}</h2>
        <Link href="/feltoltes" className="inline-flex items-center justify-center rounded-full bg-[#387035] text-white px-10 py-4 font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a5528] transition-all shadow-lg hover:shadow-green-900/20 hover:-translate-y-1">
          {t.footer_cta.btn}
        </Link>
      </section>
    </Layout>
  );
}