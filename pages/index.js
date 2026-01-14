import { useState, useEffect, useRef } from "react";
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
    /* Finomított, szélesebb árnyék a prémium hatáshoz */
    .soft-shadow {
      box-shadow: 0 15px 50px -10px rgba(0,0,0,0.05);
    }
    .card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px -12px rgba(56, 112, 53, 0.12);
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
      subtitle: "Ha Miskolcra érkezel, van egy étel, amit nem lehet kihagyni. Ez a Bükk városának ikonikus fogása: a kocsonya.",
      cta_primary: "Játék és Feltöltés",
      cta_secondary: "Étteremlista"
    },
    story: {
      p1: "A legendás Miskolci Kocsonyafesztivál most az éttermekben is zajlik, így nem csak az utcán, nem csak papírtálcán, hanem asztalhoz ülve, vendégként is megkóstolhatod a híres fogást.",
      p2: "Ez a projekt a Kocsonyafesztivál kiegészítő gasztroélménye, és azoknak szól, akik szeretnék megismerni a város történetét a helyi vendéglátósok kocsonyáin keresztül.",
      p3: "Ha betérsz egy étterembe, asztalhoz ülsz, kocsonyát rendelsz, a fogással együtt megkapod a Kocsonya Útleveledet is.",
      p4: "Nincs két egyforma fogás. Van klasszikus, van újragondolt és van egészen meglepő.",
      closing: "Indulhat a felfedezés."
    },
    restaurants: {
      title: "Résztvevő éttermek és menük",
      disclaimer: "A lista és az árak tájékoztató jellegűek.",
      loading: "Éttermek betöltése...",
      location_btn: "Térkép"
    },
    transition: {
      title: "Fedezz fel több ízt, ismerd meg a várost.",
      text: "Vedd a nyakadba Miskolcot, ismerd meg a Bükk városának különleges gasztronómiáját, és tapasztald meg, milyen sokszínű tud lenni ez a legendás étel."
    },
    rules: {
      title: "Kocsonyából élmény!",
      subtitle: "Vegyél részt a nyereményjátékban!",
      step1: "Kóstolj kocsonyát legalább három különböző helyen!",
      step2: "Gyűjts legalább három pecsétet a Kocsonya Útleveledbe!",
      step3: "Fotózd le, és töltsd fel!",
      cta: "FOTÓ FELTÖLTÉSE MOST"
    },
    prizes: {
      title: "Nyerd meg a három nyeremény egyikét!",
      desc: "A három nyeremény minden esetben tartalmaz:",
      item1: "Szállást két fő részére két éjszakára (Belvárosi Luxusapartman, Bükk Penthouse, Lillafüredi Hotel Palota)",
      item2: "Az élményhétvégére teljes ellátást: két reggelit, két ebédet és két vacsorát válogatott éttermekben.",
      item3: "Két Miskolc Pass-t a Visit Miskolc jóvoltából, amellyel felfedezheted a város attrakcióit."
    },
    organizers: {
      title: "Akik mögötte állnak",
      p1: "„A miskolci kocsonya az asztalhoz ül” a miskolci vendéglátók közös ügye.",
      p2: "Az önszerveződő projekt a helyi éttermek, a Visit Miskolc és a Bükki Kör együttműködésével jött létre, azzal a céllal, hogy Miskolc gasztronómiáját megmutassa és élménnyé formálja."
    },
    footer_cta: {
      title: "Indulhatunk?",
      subtitle: "A miskolci kocsonya az asztalhoz ül. Te is?",
      btn: "CSATLAKOZOM A JÁTÉKHOZ"
    }
  },
  en: {
    hero: {
      title1: "Miskolc Jelly comes",
      title2: "to the table.",
      subtitle: "If you arrive in Miskolc, there is one dish you cannot miss. This is the iconic dish of the city of Bükk: the jelly.",
      cta_primary: "Play & Upload",
      cta_secondary: "Restaurant List"
    },
    story: {
      p1: "The legendary Miskolc Jelly Festival is now taking place in restaurants too, so you can taste the famous dish not only on the street, not only on paper trays, but also sitting at a table as a guest.",
      p2: "This project is a complementary gastro-experience of the Jelly Festival, for those who want to get to know the city's history through the jellies of local restaurateurs.",
      p3: "If you enter a restaurant, sit at a table, order jelly, you will receive your Jelly Passport along with the dish.",
      p4: "No two dishes are alike. There are classic, reimagined, and quite surprising ones.",
      closing: "Let the discovery begin."
    },
    restaurants: {
      title: "Participating Restaurants & Menus",
      disclaimer: "The list and prices are for information purposes. Click the camera icon to see the dish.",
      loading: "Loading restaurants...",
      location_btn: "Map"
    },
    transition: {
      title: "Discover more flavors, get to know the city.",
      text: "Take Miskolc into your own hands, get to know the special gastronomy of the city of Bükk, and experience how diverse this legendary dish can be."
    },
    rules: {
      title: "Make an experience out of Jelly!",
      subtitle: "Participate in the prize game!",
      step1: "Taste jelly in at least three different places!",
      step2: "Collect at least three stamps in your Jelly Passport!",
      step3: "Take a photo and upload it!",
      cta: "UPLOAD PHOTO NOW"
    },
    prizes: {
      title: "Win one of the three prizes!",
      desc: "The three prizes always include:",
      item1: "Accommodation for two people for two nights (Downtown Luxury Apartment, Bükk Penthouse, Lillafüred Hotel Palota)",
      item2: "Full board for the experience weekend: two breakfasts, two lunches, and two dinners at selected restaurants.",
      item3: "Two Miskolc Passes courtesy of Visit Miskolc to discover the city's attractions."
    },
    organizers: {
      title: "The People Behind It",
      p1: "“Miskolc Jelly takes a seat at the table” is the common cause of Miskolc caterers.",
      p2: "The self-organized project was created in cooperation with local restaurants, Visit Miskolc, and the Bükk Circle, with the aim of showing Miskolc's gastronomy and turning it into an experience."
    },
    footer_cta: {
      title: "Shall we start?",
      subtitle: "The Jelly takes a seat. Will you?",
      btn: "JOIN THE GAME"
    }
  }
};

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

// --- PRÉMIUM KÁRTYA KOMPONENS (Változatlan) ---
const RestaurantCard = ({ restaurant, lang, isAutoFlipped }) => {
  const [manualFlip, setManualFlip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [delayedReveal, setDelayedReveal] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (isMobile && !userInteracted) {
      if (isInView) {
        timer = setTimeout(() => {
          setDelayedReveal(true);
        }, 1000); 
      } else {
        setDelayedReveal(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isInView, isMobile, userInteracted]);

  let isFlipped = false;

  if (isMobile) {
    if (userInteracted) {
      isFlipped = manualFlip;
    } else {
      isFlipped = !delayedReveal; 
    }
  } else {
    isFlipped = manualFlip || isAutoFlipped;
  }

  const handleInteraction = (flippedState) => {
    setManualFlip(flippedState);
    if (isMobile) {
      setUserInteracted(true);
    }
  };

  return (
    <div ref={cardRef} className="relative group perspective-1000 w-full h-full min-h-[500px]">
      <div 
        className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* --- ELŐLAP --- */}
        <div 
           className="relative w-full h-full [backface-visibility:hidden] bg-[#FCFBF9] rounded-3xl soft-shadow card-hover transition-all duration-300 flex flex-col overflow-hidden border border-slate-100"
           style={{ zIndex: isFlipped ? 0 : 10 }}
        >
          <div className="absolute -bottom-10 -right-10 text-[#77b92b] opacity-[0.02] transform rotate-12 pointer-events-none select-none z-0">
             <svg width="250" height="250" viewBox="0 0 24 24" stroke="currentColor" fill="none">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
          </div>

          <div className="p-10 flex flex-col h-full relative z-10">
            {restaurant.imageUrl && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleInteraction(true); }}
                className="absolute top-8 right-8 z-20 p-2.5 bg-white border border-slate-100 rounded-full text-[#387035] hover:bg-[#387035] hover:text-white transition-all shadow-sm hover:shadow-md active:scale-95 group-hover:animate-pulse"
                title="Kép megtekintése"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}

            <h3 className="text-3xl font-serif font-bold text-[#2a5528] mb-5 pr-12 leading-tight">
              {restaurant.name}
            </h3>
            <div className="w-12 h-0.5 bg-[#aadd77] opacity-40 rounded-full mb-10"></div>
            
            <div className="space-y-8 mb-6 flex-grow">
              {restaurant.menus.map((item, i) => (
                <div key={i} className="group">
                   <div className="flex justify-between items-baseline mb-2">
                      <div className="font-bold text-slate-900 text-lg leading-snug pr-4">
                        {lang === 'hu' ? item.nameHu : item.nameEn}
                      </div>
                      
                      {item.price && (
                        <span className="flex-shrink-0 bg-[#f4f9f2] text-[#2F5E2B] text-xs font-bold px-3 py-1 rounded-full border border-[#e6f0e4] uppercase tracking-wide">
                          {item.price} Ft
                        </span>
                      )}
                   </div>

                   {((lang === 'hu' && item.descHu) || (lang === 'en' && item.descEn)) && (
                     <div className="text-[15px] text-slate-600 font-serif italic font-light leading-relaxed opacity-90">
                       {lang === 'hu' ? item.descHu : item.descEn}
                     </div>
                   )}
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-[#f0f5ed] flex items-center justify-between mt-auto">
               <a 
                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address + " " + restaurant.name + " Miskolc")}`}
                 target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#387035] transition-colors font-medium group/link"
               >
                 <IconMap /> 
                 <span className="group-hover/link:underline decoration-[#aadd77] decoration-1 underline-offset-4">{restaurant.address}</span>
               </a>
            </div>
          </div>
        </div>

        {/* --- HÁTLAP --- */}
        <div 
           className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-3xl shadow-xl border border-slate-100 cursor-pointer overflow-hidden"
           onClick={() => handleInteraction(false)}
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
              onClick={() => handleInteraction(false)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-serif italic">Kép hamarosan...</div>
          )}
          
          {isMobile && !userInteracted && (
              <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                  Görgesd tovább!
              </div>
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
  
  const [autoFlipIndex, setAutoFlipIndex] = useState(null);

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

  useEffect(() => {
    if (loading || restaurants.length === 0) return;
    if (window.innerWidth < 1024) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      setAutoFlipIndex(randomIndex);

      setTimeout(() => {
        setAutoFlipIndex(null);
      }, 3000);
      
    }, 6000); 

    return () => clearInterval(interval);
  }, [loading, restaurants]);


  return (
    <Layout lang={lang} setLang={setLang}>
      <GlobalStyles />
      
      {/* 1. HERO SZEKCIÓ */}
      <section className="relative rounded-[2.5rem] bg-white overflow-hidden soft-shadow mb-12">
        <div className="w-full">
           <img src="/kocsonya/banner.jpg" alt="Kocsonya Útlevél 2026 Miskolc" className="w-full h-auto object-contain" />
        </div>
        <div className="px-6 py-12 sm:px-12 text-center max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl lg:whitespace-nowrap font-serif font-bold text-[#387035] mb-8 leading-tight tracking-tight">
            {t.hero.title1} {t.hero.title2}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/feltoltes" className="inline-flex items-center justify-center rounded-full bg-[#387035] text-white px-8 py-4 font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a5528] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              {t.hero.cta_primary}
            </Link>
            <a href="#etteremlista" className="inline-flex items-center justify-center rounded-full border border-[#387035] text-[#387035] bg-transparent hover:bg-[#387035] hover:text-white px-8 py-4 font-bold text-sm uppercase tracking-[0.1em] transition-all">
              {t.hero.cta_secondary}
            </a>
          </div>
        </div>
      </section>

      {/* 2. BEVEZETŐ STORY */}
      <section className="mt-16 mb-20 px-4 sm:px-6 max-w-3xl mx-auto text-center">
        {/* Story tartalom */}
        <div className="prose prose-lg mx-auto text-slate-700 leading-8 font-light">
          <p className="mb-6 font-medium text-xl text-[#387035]">{t.story.p1}</p>
          <p className="mb-6">{t.story.p2}</p>
          <p className="mb-6">{t.story.p3}</p>
          <p className="mb-8">{t.story.p4}</p>
          <p className="font-serif font-bold text-[#387035] text-2xl italic relative inline-block">
             {t.story.closing}
          </p>
        </div>
      </section>

      {/* 3. ÉTTEREMLISTA (Feljebb hozva) */}
      <section id="etteremlista" className="mb-24">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#387035] mb-4">{t.restaurants.title}</h2>
          <div className="h-1 w-20 bg-[#77b92b] mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500">{t.restaurants.disclaimer}</p>
        </div>
        {loading ? (
          <div className="text-center py-24 text-slate-400 font-light text-xl animate-pulse"><p>{t.restaurants.loading}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant, index) => (
              <RestaurantCard 
                key={index} 
                restaurant={restaurant} 
                lang={lang} 
                isAutoFlipped={index === autoFlipIndex} 
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. ÁTVEZETŐ SZÖVEG */}
      <section className="mb-24 px-6 text-center max-w-4xl mx-auto">
         <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#387035] mb-6">{t.transition.title}</h3>
         <p className="text-lg text-slate-600 font-light leading-relaxed">{t.transition.text}</p>
      </section>

      {/* 5. JÁTÉK SZABÁLYOK ÉS NYEREMÉNYEK */}
      <section className="mb-24">
        <div className="bg-[#387035] rounded-[2.5rem] p-8 sm:p-16 text-white shadow-2xl shadow-green-900/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Játék menete */}
            <div>
              <h2 className="text-4xl font-serif font-bold mb-2">{t.rules.title}</h2>
              <p className="text-[#aadd77] text-xl font-medium mb-10">{t.rules.subtitle}</p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6"><div className="p-4 bg-white/10 rounded-2xl text-[#aadd77] backdrop-blur-sm"><IconPlate /></div><div><h4 className="font-bold text-xl mb-1">1.</h4><p className="text-green-100 text-base leading-relaxed opacity-90">{t.rules.step1}</p></div></div>
                <div className="flex items-start gap-6"><div className="p-4 bg-white/10 rounded-2xl text-[#aadd77] backdrop-blur-sm"><IconGift /></div><div><h4 className="font-bold text-xl mb-1">2.</h4><p className="text-green-100 text-base leading-relaxed opacity-90">{t.rules.step2}</p></div></div>
                <div className="flex items-start gap-6"><div className="p-4 bg-white/10 rounded-2xl text-[#aadd77] backdrop-blur-sm"><IconCamera /></div><div><h4 className="font-bold text-xl mb-1">3.</h4><p className="text-green-100 text-base leading-relaxed opacity-90">{t.rules.step3}</p></div></div>
              </div>
              <div className="mt-12">
                <Link href="/feltoltes" className="inline-block w-full sm:w-auto text-center bg-white text-[#387035] hover:bg-green-50 font-bold text-sm uppercase tracking-[0.1em] py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-xl">
                  {t.rules.cta}
                </Link>
              </div>
            </div>

            {/* Nyeremények */}
            <div className="bg-white/10 border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-md">
              <h3 className="text-2xl font-serif font-bold text-[#aadd77] mb-4">{t.prizes.title}</h3>
              <p className="text-white/80 mb-6 text-sm">{t.prizes.desc}</p>
              <ul className="space-y-5 text-white">
                <li className="flex items-start gap-3">
                    <span className="text-[#aadd77] text-xl mt-1">★</span> 
                    <span className="text-base leading-relaxed">{t.prizes.item1}</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-[#aadd77] text-xl mt-1">★</span> 
                    <span className="text-base leading-relaxed">{t.prizes.item2}</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-[#aadd77] text-xl mt-1">★</span> 
                    <span className="text-base leading-relaxed">{t.prizes.item3}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SZERVEZŐK (Új szekció a Quotes helyett) */}
      <section className="mb-24 bg-white py-16 rounded-[2.5rem] soft-shadow text-center px-6">
        <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-serif font-bold text-[#387035] mb-8">{t.organizers.title}</h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed font-light">{t.organizers.p1}</p>
            <p className="text-base text-slate-500 leading-relaxed">{t.organizers.p2}</p>
        </div>
      </section>

      {/* 7. CTA Footer */}
      <section className="bg-white border border-slate-100 soft-shadow py-16 text-center rounded-[2.5rem] mb-12">
        <h2 className="text-3xl font-serif font-bold text-[#387035] mb-2">{t.footer_cta.title}</h2>
        <p className="text-xl text-slate-600 mb-8">{t.footer_cta.subtitle}</p>
        <Link href="/feltoltes" className="inline-flex items-center justify-center rounded-full bg-[#387035] text-white px-10 py-4 font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a5528] transition-all shadow-lg hover:shadow-green-900/20 hover:-translate-y-1">
          {t.footer_cta.btn}
        </Link>
      </section>
    </Layout>
  );
}