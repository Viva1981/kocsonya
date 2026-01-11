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
      title1: "",
      title2: "",
      subtitle: "A Kocsonyafesztivál élménye idén az éttermekben is folytatódik. Fedezd fel a környék legjobb ízeit, gyűjtsd a pecséteket és nyerj!",
      cta_primary: "Játék és Feltöltés",
      cta_secondary: "Étteremlista"
    },
    story: {
      title: "Kocsonya Túra 2026",
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
      disclaimer: "A lista és az árak tájékoztató jellegűek.",
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
      title1: "Miskolc Aspic comes",
      title2: "to the table.",
      subtitle: "The Aspic Festival experience continues in restaurants this year. Discover the best flavors of the region, collect stamps, and win!",
      cta_primary: "Play & Upload",
      cta_secondary: "Restaurant List"
    },
    story: {
      title: "Aspic Tour 2026",
      p1: "This year, a new collaboration joins the festival. Several Miskolc restaurants are working together to bring the Aspic Festival experience into their dining rooms.",
      quote: "“The Miskolc Aspic takes a seat at the table.”",
      p2: "The goal is to show as many faces of the aspic – the symbol of the festival – as possible: traditional, modern, reimagined, but always with a Miskolc connection."
    },
    quotes: {
      title: "Words from the Organizers",
      more: "...and many others for the city."
    },
    rules: {
      title: "How to Participate",
      step1_title: "1. Eat",
      step1_desc: "Choose a special aspic from the participating restaurants.",
      step2_title: "2. Snap",
      step2_desc: "Collect a stamp or take a photo of your Aspic Passport.",
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
      disclaimer: "The list and prices are for information purposes.",
      loading: "Loading restaurants...",
      location_btn: "Map"
    },
    footer_cta: {
      title: "The Aspic takes a seat. Will you?",
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
      en: "For us, aspic is not just a traditional dish, but a question of ingredient, form, and mentality." 
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

// --- SEGÉDFÜGGVÉNY: CSV PARSOLÁS ---
// Ez alakítja a CSV szöveget használható objektumokká
const parseCSV = (text) => {
  const lines = text.split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, '')); // Fejléc tisztítás
  
  // Egy ideiglenes tároló, ahol név alapján csoportosítunk
  const groupedRestaurants = {};

  for (let i = 1; i < lines.length; i++) {
    // Vessző mentén vágás, de figyelünk az idézőjelekre (bár egyszerű CSV-nél ritka)
    // Egyszerű split elég most, feltételezve, hogy nincs vessző a szövegekben
    const row = lines[i].split(",").map(cell => cell.trim().replace(/"/g, ''));
    
    if (row.length < 2 || !row[0]) continue; // Üres sorok kihagyása

    // Fejléc alapján adatkinyerés (sorrendtől függetlenül, ha a fejléc neve stimmel)
    // De a te esetedben fix sorrendet feltételezünk a biztonság kedvéért:
    // 0: Név, 1: Cím, 2: Menü HU, 3: Menü EN, 4: Ár, 5: Aktív
    const name = row[0];
    const address = row[1];
    const menuHu = row[2];
    const menuEn = row[3];
    const price = row[4];
    const active = row[5]?.toLowerCase();

    // Csak azt jelenítjük meg, ami "aktiv" (x van a végén)
    if (active === 'x') {
      if (!groupedRestaurants[name]) {
        // Ha még nincs ilyen étterem, létrehozzuk
        groupedRestaurants[name] = {
          name: name,
          address: address,
          menus: []
        };
      }
      
      // Hozzáadjuk a menüt a listához
      groupedRestaurants[name].menus.push({
        nameHu: menuHu,
        nameEn: menuEn || menuHu, // Ha nincs angol, marad a magyar
        price: price
      });
    }
  }

  return Object.values(groupedRestaurants);
};

export default function HomePage() {
  const { lang, setLang } = useLanguage();
  const t = TRANSLATIONS[lang]; 
  
  // State az étterem adatokhoz
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adatok betöltése a Google Sheetből
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRSM975tF3jWF7WhR90O9LQrGuDb-FKJwA9GrSe3wbnuEYVRl9Y_DNYH364g-hkHBYazm3SH-OUXe28/pub?gid=666430223&single=true&output=csv");
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
      {/* 1. HERO SZEKCIÓ */}
      <section className="relative rounded-3xl bg-white overflow-hidden shadow-sm">
        <div className="w-full">
           <img 
             src="/banner.jpg" 
             alt="Kocsonya Túra 2026 Miskolc" 
             className="w-full h-auto object-contain"
           />
        </div>

        <div className="px-6 py-8 sm:px-12 text-center max-w-4xl mx-auto">
          {lang === 'en' && (
             <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#387035] mb-4">
               {t.hero.title1} {t.hero.title2}
             </h1>
          )}
          <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/feltoltes"
              className="inline-flex items-center justify-center rounded-full bg-[#387035] text-white px-8 py-4 font-bold text-lg hover:bg-[#2a5528] transition-colors shadow-lg"
            >
              {t.hero.cta_primary}
            </Link>
            <a
              href="#etteremlista"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#77b92b] text-[#77b92b] hover:bg-[#77b92b] hover:text-white px-8 py-4 font-bold text-lg transition-colors"
            >
              {t.hero.cta_secondary}
            </a>
          </div>
        </div>
      </section>

      {/* 2. STORY */}
      <section className="mt-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-bold text-[#387035] mb-6">
          {t.story.title}
        </h2>
        <div className="prose prose-lg mx-auto text-slate-700 leading-relaxed">
          <p className="mb-4">{t.story.p1}</p>
          <p className="font-semibold text-[#387035] text-xl italic mb-6">
            {t.story.quote}
          </p>
          <p>{t.story.p2}</p>
        </div>
      </section>

      {/* 3. QUOTES */}
      <section className="mt-16 bg-[#FDFBF7] py-10 rounded-3xl border border-slate-100">
        <div className="px-6 text-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-[#387035]">
            {t.quotes.title}
          </h3>
        </div>
        <div className="px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUOTES.slice(0, 4).map((quote, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-600 italic mb-4">"{quote.text[lang]}"</p>
              <div className="font-semibold text-[#387035]">{quote.name}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{quote.role[lang]}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
           <p className="text-sm text-slate-400">{t.quotes.more}</p>
        </div>
      </section>

      {/* 4. RULES */}
      <section className="mt-16">
        <div className="bg-[#387035] rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">{t.rules.title}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-[#77b92b]">
                    <IconPlate />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t.rules.step1_title}</h4>
                    <p className="text-green-100 text-sm">{t.rules.step1_desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-[#77b92b]">
                    <IconCamera />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t.rules.step2_title}</h4>
                    <p className="text-green-100 text-sm">{t.rules.step2_desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-[#77b92b]">
                    <IconGift />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t.rules.step3_title}</h4>
                    <p className="text-green-100 text-sm">{t.rules.step3_desc}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                 <Link href="/feltoltes" className="inline-block w-full sm:w-auto text-center bg-[#77b92b] hover:bg-[#68a325] text-white font-bold py-3 px-8 rounded-full transition-colors">
                   {t.rules.cta}
                 </Link>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
              <h3 className="text-2xl font-serif font-bold text-[#77b92b] mb-4">{t.prizes.title}</h3>
              <ul className="space-y-3 text-green-50">
                <li className="flex items-center gap-2">
                  <span className="text-[#77b92b]">★</span> {t.prizes.item1}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#77b92b]">★</span> {t.prizes.item2}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#77b92b]">★</span> {t.prizes.item3}
                </li>
              </ul>
              <p className="mt-6 text-sm text-green-200 italic">"{t.prizes.quote}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ÉTTEREMLISTA (DINAMIKUS) */}
      <section id="etteremlista" className="mt-20 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#387035]">
            {t.restaurants.title}
          </h2>
          <p className="mt-3 text-slate-600">
            {t.restaurants.disclaimer}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <svg className="animate-spin h-8 w-8 text-[#387035] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>{t.restaurants.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl border-2 border-slate-100 hover:border-[#77b92b] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Étterem Név */}
                  <h3 className="text-xl font-bold text-[#387035] mb-2 group-hover:text-[#77b92b] transition-colors">
                    {restaurant.name}
                  </h3>
                  <div className="w-12 h-1 bg-[#FDFBF7] rounded-full mb-4 group-hover:bg-[#77b92b]"></div>
                  
                  {/* Menük felsorolása */}
                  <div className="space-y-4 flex-grow">
                    {restaurant.menus.map((item, i) => (
                      <div key={i} className="text-slate-700 text-sm border-l-2 border-slate-100 pl-3 leading-snug">
                         <div className="font-medium">
                           {lang === 'hu' ? item.nameHu : item.nameEn}
                         </div>
                         {item.price && (
                           <div className="text-[#C84C44] font-bold text-xs mt-1">
                             {item.price}
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Lábléc: Térkép Link */}
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-400">
                     <a 
                       href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address + " " + restaurant.name + " Miskolc")}`}
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center gap-1 hover:text-[#387035] transition-colors"
                       title="Megnyitás Google Térképen"
                     >
                       <IconMap />
                       {restaurant.address}
                     </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Footer */}
      <section className="bg-[#FDFBF7] border-t border-slate-200 py-12 text-center rounded-3xl mb-12">
        <h2 className="text-2xl font-serif font-bold text-[#387035] mb-4">
          {t.footer_cta.title}
        </h2>
        <Link
          href="/feltoltes"
          className="inline-flex items-center justify-center rounded-full bg-[#387035] text-white px-8 py-3 font-bold hover:bg-[#2a5528] transition-colors"
        >
          {t.footer_cta.btn}
        </Link>
      </section>
    </Layout>
  );
}