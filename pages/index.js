import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

// --- SVG IKONOK ---
const IconPlate = () => (
  <svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconCamera = () => (
  <svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconGift = () => (
  <svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const IconMap = () => (
   <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
   </svg>
);

// --- SZÓTÁR (HU / EN) ---
const TRANSLATIONS = {
  hu: {
    hero: {
      title1: "A miskolci kocsonya",
      title2: "az asztalhoz ül.",
      subtitle: "A Kocsonyafesztivál élménye idén az éttermekben is folytatódik. Fedezd fel a környék legjobb ízeit, gyűjtsd a pecséteket és nyerj!",
      cta_primary: "Játék és Feltöltés",
      cta_secondary: "Étteremlista"
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
      cta: "Fotó feltöltése most"
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
      btn: "Csatlakozom a játékhoz"
    }
  },
  en: {
    hero: {
      title1: "Miskolc Jelly comes",
      title2: "to the table.",
      subtitle: "The Jelly Festival experience continues in restaurants this year. Discover the best flavors of the region, collect stamps, and win!",
      cta_primary: "Play & Upload",
      cta_secondary: "Restaurant List"
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
      cta: "Upload Photo Now"
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
      btn: "Join the Game"
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

// --- JAVÍTOTT KÁRTYA KOMPONENS (Flip hiba javítva + Kép vágás) ---
const RestaurantCard = ({ restaurant, lang }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative group perspective-1000 w-full h-full min-h-[450px]">
      <div 
        className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* --- ELŐLAP (SZÖVEG + DIZÁJN) --- */}
        <div 
           className="relative w-full h-full [backface-visibility:hidden] bg-white rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col overflow-hidden"
           style={{ zIndex: isFlipped ? 0 : 10 }} // TRÜKK: Ha nincs fordítva, ez van felül
        >
          {/* VÍZJEL HÁTTÉR */}
          <div className="absolute -bottom-8 -right-8 text-[#77b92b] opacity-5 transform rotate-12 pointer-events-none select-none z-0">
             <svg width="180" height="180" viewBox="0 0 24 24" stroke="currentColor" fill="none">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
          </div>

          <div className="p-6 flex flex-col h-full relative z-10">
            {/* Flip gomb */}
            {restaurant.imageUrl && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                className="absolute top-4 right-4 z-20 p-2 bg-green-50 rounded-full text-[#387035] hover:bg-[#387035] hover:text-white transition-colors cursor-pointer"
                title="Kép megtekintése"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}

            <h3 className="text-xl font-bold text-[#387035] mb-2 pr-10">{restaurant.name}</h3>
            <div className="w-12 h-1 bg-[#FDFBF7] rounded-full mb-4"></div>
            
            <div className="space-y-4 mb-4 flex-grow">
              {restaurant.menus.map((item, i) => (
                <div key={i} className="text-slate-700 text-sm border-l-2 border-slate-100 pl-3 leading-snug">
                   <div className="font-bold text-slate-800">{lang === 'hu' ? item.nameHu : item.nameEn}</div>
                   {((lang === 'hu' && item.descHu) || (lang === 'en' && item.descEn)) && (
                     <div className="text-sm text-slate-500 mt-1 leading-relaxed">{lang === 'hu' ? item.descHu : item.descEn}</div>
                   )}
                   {item.price && <div className="text-[#C84C44] font-bold text-xs mt-2">{item.price} Ft</div>}
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-400 mt-auto">
               <a 
                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address + " " + restaurant.name + " Miskolc")}`}
                 target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 hover:text-[#387035] transition-colors z-10"
               >
                 <IconMap /> {restaurant.address}
               </a>
            </div>
          </div>
        </div>

        {/* --- HÁTLAP (KÉP) --- */}
        <div 
           className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-2xl shadow-lg border-2 border-[#77b92b] cursor-pointer overflow-hidden"
           onClick={() => setIsFlipped(false)}
           style={{ 
             zIndex: isFlipped ? 20 : 0, // TRÜKK: Ha fordítva van, ez legyen felül, hogy működjön a klikk
             WebkitMaskImage: '-webkit-radial-gradient(white, black)' // TRÜKK: Ez kényszeríti a lekerekítést Safariban/3D-ben
           }}
        >
          {restaurant.imageUrl ? (
            <img 
              src={restaurant.imageUrl} 
              alt={restaurant.name}
              className="w-full h-full object-cover rounded-2xl"
              onClick={() => setIsFlipped(false)} // Duplán biztosítjuk a kattintást
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
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
      {/* HERO SZEKCIÓ */}
      <section className="relative rounded-3xl bg-white overflow-hidden shadow-sm">
        <div className="w-full">
           <img src="/kocsonya/banner.jpg" alt="Kocsonya Útlevél 2026 Miskolc" className="w-full h-auto object-contain" />
        </div>
        <div className="px-6 py-8 sm:px-12 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#387035] mb-4">{t.hero.title1} {t.hero.title2}</h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/feltoltes" className="inline-flex items-center justify-center rounded-full bg-[#387035] text-white px-8 py-4 font-bold text-lg hover:bg-[#2a5528] transition-colors shadow-lg">
              {t.hero.cta_primary}
            </Link>
            <a href="#etteremlista" className="inline-flex items-center justify-center rounded-full border-2 border-[#77b92b] text-[#77b92b] hover:bg-[#77b92b] hover:text-white px-8 py-4 font-bold text-lg transition-colors">
              {t.hero.cta_secondary}
            </a>
          </div>
        </div>
      </section>

      {/* STORY, QUOTES, RULES SZEKCIÓK (Változatlanok) */}
      <section className="mt-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-bold text-[#387035] mb-6">{t.story.title}</h2>
        <div className="prose prose-lg mx-auto text-slate-700 leading-relaxed">
          <p className="mb-4">{t.story.p1}</p>
          <p className="font-semibold text-[#387035] text-xl italic mb-6">{t.story.quote}</p>
          <p>{t.story.p2}</p>
        </div>
      </section>

      <section className="mt-16 bg-[#FDFBF7] py-10 rounded-3xl border border-slate-100">
        <div className="px-6 text-center mb-8"><h3 className="text-2xl font-serif font-bold text-[#387035]">{t.quotes.title}</h3></div>
        <div className="px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUOTES.slice(0, 4).map((quote, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-600 italic mb-4">"{quote.text[lang]}"</p>
              <div className="font-semibold text-[#387035]">{quote.name}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{quote.role[lang]}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6"><p className="text-sm text-slate-400">{t.quotes.more}</p></div>
      </section>

      <section className="mt-16">
        <div className="bg-[#387035] rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">{t.rules.title}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4"><div className="p-3 bg-white/10 rounded-2xl text-[#77b92b]"><IconPlate /></div><div><h4 className="font-bold text-lg">{t.rules.step1_title}</h4><p className="text-green-100 text-sm">{t.rules.step1_desc}</p></div></div>
                <div className="flex items-start gap-4"><div className="p-3 bg-white/10 rounded-2xl text-[#77b92b]"><IconCamera /></div><div><h4 className="font-bold text-lg">{t.rules.step2_title}</h4><p className="text-green-100 text-sm">{t.rules.step2_desc}</p></div></div>
                <div className="flex items-start gap-4"><div className="p-3 bg-white/10 rounded-2xl text-[#77b92b]"><IconGift /></div><div><h4 className="font-bold text-lg">{t.rules.step3_title}</h4><p className="text-green-100 text-sm">{t.rules.step3_desc}</p></div></div>
              </div>
              <div className="mt-8"><Link href="/feltoltes" className="inline-block w-full sm:w-auto text-center bg-[#77b92b] hover:bg-[#68a325] text-white font-bold py-3 px-8 rounded-full transition-colors">{t.rules.cta}</Link></div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
              <h3 className="text-2xl font-serif font-bold text-[#77b92b] mb-4">{t.prizes.title}</h3>
              <ul className="space-y-3 text-green-50">
                <li className="flex items-center gap-2"><span className="text-[#77b92b]">★</span> {t.prizes.item1}</li>
                <li className="flex items-center gap-2"><span className="text-[#77b92b]">★</span> {t.prizes.item2}</li>
                <li className="flex items-center gap-2"><span className="text-[#77b92b]">★</span> {t.prizes.item3}</li>
              </ul>
              <p className="mt-6 text-sm text-green-200 italic">"{t.prizes.quote}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* ÉTTEREMLISTA */}
      <section id="etteremlista" className="mt-20 mb-20">
        <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#387035]">{t.restaurants.title}</h2><p className="mt-3 text-slate-600">{t.restaurants.disclaimer}</p></div>
        {loading ? (
          <div className="text-center py-20 text-slate-400"><p>{t.restaurants.loading}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (<RestaurantCard key={index} restaurant={restaurant} lang={lang} />))}
          </div>
        )}
      </section>

      {/* CTA Footer */}
      <section className="bg-[#FDFBF7] border-t border-slate-200 py-12 text-center rounded-3xl mb-12">
        <h2 className="text-2xl font-serif font-bold text-[#387035] mb-4">{t.footer_cta.title}</h2>
        <Link href="/feltoltes" className="inline-flex items-center justify-center rounded-full bg-[#387035] text-white px-8 py-3 font-bold hover:bg-[#2a5528] transition-colors">{t.footer_cta.btn}</Link>
      </section>
    </Layout>
  );
}