import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// --- STÍLUSOK (Tisztított, 3D nélkül) ---
const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    
    body {
      font-family: 'DM Sans', sans-serif;
      background-color: #FDFBF7;
      /* Smooth scroll kikapcsolva az iOS crash elkerülésére */
      scroll-behavior: auto !important;
    }
    h1, h2, h3, .font-serif {
      font-family: 'Playfair Display', serif;
    }
    .soft-shadow {
      box-shadow: 0 15px 50px -10px rgba(0,0,0,0.05);
    }
    /* Enyhébb hover effekt */
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -12px rgba(56, 112, 53, 0.12);
    }
    
    .gm-style-iw {
      border-radius: 24px !important;
      padding: 0 !important;
      background: #FCFBF9 !important;
    }
    .gm-style-iw-ch, .gm-ui-header-button, button[aria-label="Close"] {
      display: none !important;
    }
    
    /* Új animáció a játék gombhoz */
    .game-btn-hover:hover {
      transform: scale(1.02);
      transition: transform 0.3s ease;
    }
  `}</style>
);

// --- IKONOK (Változatlan) ---
const IconMeal = () => (<svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth={1.2} /><path d="M8 7v3M7 7v2.5a1 1 0 002 0V7M8 10v7M16 7v10M16 7a2 2 0 012 2v3a2 2 0 01-2 2" /></svg>);
const IconBook = () => (<svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const IconCamera = () => (<svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" strokeWidth={1.5} /></svg>);
const IconMap = () => (<svg className="w-4 h-4 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);

// --- SZÓTÁR (Minden elem átmentve + ÚJ JÁTÉK RÉSZ FRISSÍTVE) ---
const TRANSLATIONS = {
  hu: {
    hero: { title1: "A miskolci kocsonya", title2: "az asztalhoz ül.", subtitle: "Ha Miskolcra érkezel, van egy étel, amit nem lehet kihagyni. Ez a Bükk városának ikonikus fogása: a miskolci kocsonya.", cta_primary: "Játék és Feltöltés", cta_secondary: "Étteremlista" },
    story: { p1: "A legendás Miskolci Kocsonyafesztivál most az éttermekben is zajlik, így nem csak az utcán, nem csak papírtálcán, hanem asztalhoz ülve, vendégként is megkóstolhatod a híres fogást.", p2: "Ez a projekt a Kocsonyafesztivál kiegészítő gasztroélménye, és azoknak szól, akik szeretnék megismerni Miskolc történetét a helyi vendéglátósok kocsonyáin keresztül.", p3: "Ha betérsz egy étterembe, asztalhoz ülsz és kocsonyát rendelsz, a fogással együtt megkapod a KocsonyaÚtleveledet is.", p4: "Nincs két egyforma fogás. Van klasszikus miskolci kocsonya, van újragondolt és van egészen meglepő is.", closing: "Indulhat a felfedezés." },
    restaurants: { title: "Résztvevő éttermek és menük", loading: "Éttermek betöltése...", location_btn: "Térkép" },
    transition: { title: "Fedezz fel több ízt, ismerd meg Miskolcot.", text: "Vedd a nyakadba a várost, ismerd meg a Bükk vidékének különleges gasztronómiáját, és tapasztald meg a KocsonyaÚtlevél segítségével, milyen sokszínű tud lenni ez a legendás étel." },
    map_section: { title: "Kocsonya Térkép", subtitle: "Keresd meg Miskolc ízeit a térképen!", view_menu: "Megnézem a menüt" },
    rules: { title: "Kocsonyából élmény!", subtitle: "Vegyél részt a KocsonyaÚtlevél nyereményjátékban!", step1: "Kóstolj kocsonyát legalább három különböző helyen Miskolcon!", step2: "Gyűjts legalább három pecsétet a KocsonyaÚtleveledbe!", step3: "Fotózd le a lepecsételt oldalt, és töltsd fel!", cta: "FOTÓ FELTÖLTÉSE MOST" },
    prizes: { title: "Nyerd meg a három nyeremény egyikét!", desc: "A három nyeremény minden esetben tartalmaz:", item1: "Szállást két fő részére két éjszakára (Belvárosi Luxusapartman, Bükk Penthouse, Lillafüredi Hotel Palota)", item2: "Az élményhétvégére teljes ellátást: két reggelit, két ebédet és két vacsorát válogatott miskolci éttermekben.", item3: "Két Miskolc Pass-t a Visit Miskolc jóvoltából, amellyel felfedezheted a város attrakcióit." },
    organizers: { title: "Akik mögötte állnak", p1: "„A miskolci kocsonya az asztalhoz ül” a miskolci vendéglátók közös ügye.", p2: "Az önszerveződő projekt a helyi éttermek, a Visit Miskolc és a Bükki Kör együttműködésével jött létre, azzal a céllal, hogy Miskolc gasztronómiáját megmutassa és élménnyé formálja." },
    footer_cta: { title: "Indulhatunk?", subtitle: "A miskolci kocsonya az asztalhoz ül. Te is?", btn: "CSATLAKOZOM A JÁTÉKHOZ" },
    game_promo: { text: "Már csak egy kérdés maradt: a béka vagy a séfek nyernek?" }
  },
  en: {
    hero: { title1: "Miskolc Aspic comes", title2: "to the table.", subtitle: "If you arrive in Miskolc, there is one dish you cannot miss. This is the iconic dish of the city of Bükk: the aspic.", cta_primary: "Play & Upload", cta_secondary: "Restaurant List" },
    story: { p1: "The legendary Miskolc Aspic Festival is now taking place in restaurants too, so you can taste the famous dish not only on the street, but also sitting at a table as a guest.", p2: "This project is a complementary gastro-experience of the Aspic Festival, for those who want to get to know the city's history through local gastronomy.", p3: "If you enter a restaurant, sit at a table and order aspic, you will receive your AspicPass along with the dish.", p4: "No two dishes are alike. There are classic, reimagined, and quite surprising ones.", closing: "Let the discovery begin." },
    restaurants: { title: "Participating Restaurants & Menus", loading: "Loading restaurants...", location_btn: "Map" },
    transition: { title: "Discover more flavors, get to know Miskolc.", text: "Take Miskolc into your own hands, get to know the special gastronomy of the Bükk region, and experience how diverse this legendary dish can be with your AspicPass." },
    map_section: { title: "Aspic Map", subtitle: "Discover the flavors of Miskolc on the map!", view_menu: "View Menu" },
    rules: { title: "Make an experience out of Aspic!", subtitle: "Participate in the AspicPass prize game!", step1: "Taste aspic in at least three different places in Miskolc!", step2: "Collect at least three stamps in your AspicPass!", step3: "Take a photo and upload it!", cta: "UPLOAD PHOTO NOW" },
    prizes: { title: "Win one of the three prizes!", desc: "The three prizes always include:", item1: "Accommodation for two people for two nights in Miskolc (Downtown Luxury Apartment, Bükk Penthouse, Lillafüred Hotel Palota)", item2: "Full board for the experience weekend: two breakfasts, two lunches, and two dinners at selected restaurants.", item3: "Two Miskolc Passes courtesy of Visit Miskolc to discover the city's attractions." },
    organizers: { title: "The People Behind It", p1: "“Miskolc Aspic takes a seat at the table” is the common cause of Miskolc caterers.", p2: "The self-organized project was created in cooperation with local restaurants, Visit Miskolc, and the Bükk Circle." },
    footer_cta: { title: "Shall we start?", subtitle: "The Aspic takes a seat. Will you?", btn: "JOIN THE GAME" },
    game_promo: { text: "Only one question remains: do the frog or the chefs win?" }
  }
};

const getOptimizedImageUrl = (url) => {
  if (!url) return null;
  const idMatch = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
  const id = idMatch ? (idMatch[1] || idMatch[2]) : null;
  return id ? `https://lh3.googleusercontent.com/d/${id}=w600` : url;
};

const parseCSV = (text) => {
  const lines = text.split("\n");
  const grouped = {};
  const csvRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = lines[i].split(csvRegex).map(c => c.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    if (row.length < 2 || !row[0] || row[7]?.toLowerCase() !== 'x') continue;
    if (!grouped[row[0]]) {
      grouped[row[0]] = { name: row[0], address: row[1], imageUrl: getOptimizedImageUrl(row[8]), lat: parseFloat(row[9]), lng: parseFloat(row[10]), menus: [] };
    }
    grouped[row[0]].menus.push({ nameHu: row[2], descHu: row[3], nameEn: row[4] || row[2], descEn: row[5], price: row[6] });
  }
  return Object.values(grouped);
};

const getRestaurantId = (name) => name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

// --- KÁRTYA KOMPONENS ---
const RestaurantCard = ({ restaurant, lang, isAutoFlipped }) => {
  const [manualFlip, setManualFlip] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const isFlipped = userInteracted ? manualFlip : isAutoFlipped;

  const handleToggle = (state) => {
    setManualFlip(state);
    setUserInteracted(true);
  };

  return (
    <div id={getRestaurantId(restaurant.name)} className="relative w-full h-full min-h-[520px] scroll-mt-32">
      <div className="relative w-full h-full bg-[#FCFBF9] rounded-3xl soft-shadow border border-slate-100 overflow-hidden card-hover transition-all">
        
        {/* INFO OLDAL */}
        <div className={`p-10 flex flex-col h-full transition-opacity duration-500 ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
           <h3 className="text-3xl font-serif font-bold text-[#2a5528] mb-5 pr-12">{restaurant.name}</h3>
           <div className="w-12 h-0.5 bg-[#aadd77] opacity-40 mb-10"></div>
           <div className="space-y-6 flex-grow">
              {restaurant.menus.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-slate-900">{lang === 'hu' ? m.nameHu : m.nameEn}</span>
                    {m.price && <span className="text-xs font-bold bg-[#f4f9f2] text-[#2F5E2B] px-2 py-1 rounded-full">{m.price} </span>}
                  </div>
                  <p className="text-sm text-slate-600 italic">{lang === 'hu' ? m.descHu : m.descEn}</p>
                </div>
              ))}
           </div>
           <div className="pt-6 border-t border-[#f0f5ed] mt-auto">
             <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address + " " + restaurant.name)}`} target="_blank" rel="noreferrer" className="flex items-center text-sm text-slate-400 hover:text-[#387035]">
               <IconMap /> <span>{restaurant.address}</span>
             </a>
           </div>
           {restaurant.imageUrl && (
              <button onClick={() => handleToggle(true)} className="absolute top-8 right-8 p-2 bg-white rounded-full text-[#387035] shadow-sm"><IconCamera /></button>
           )}
        </div>

        {/* KÉP OLDAL */}
        {restaurant.imageUrl && (
          <div onClick={() => handleToggle(false)} className={`absolute inset-0 bg-white transition-opacity duration-500 cursor-pointer ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};

const MapSection = ({ restaurants, lang }) => {
  const mapRef = useRef(null);
  const infoRef = useRef(null);
  const t = TRANSLATIONS[lang].map_section;

  useEffect(() => {
    window.scrollToRes = (id) => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'auto' }); infoRef.current?.close(); }
    };
    if (!window.google) {
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      s.onload = init; document.head.appendChild(s);
    } else init();

    function init() {
      const m = new window.google.maps.Map(mapRef.current, { center: { lat: 48.103, lng: 20.785 }, zoom: 14, disableDefaultUI: false });
      const iw = new window.google.maps.InfoWindow();
      infoRef.current = iw;
      restaurants.forEach(r => {
        if (!r.lat) return;
        const mark = new window.google.maps.Marker({ position: { lat: r.lat, lng: r.lng }, map: m, icon: { path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, fillColor: "#387035", fillOpacity: 1, scale: 7, strokeWeight: 0 } });
        mark.addListener("click", () => {
          iw.setContent(`<div style="padding:10px; width:180px; cursor:pointer" onclick="window.scrollToRes('${getRestaurantId(r.name)}')">
            <h4 style="margin:0;color:#2a5528">${r.name}</h4><p style="font-size:11px;margin:5px 0">${r.address}</p>
            <b style="font-size:10px;color:#387035">${t.view_menu} →</b></div>`);
          iw.open(m, mark);
        });
      });
    }
  }, [restaurants, lang]);

  return (
    <section className="mb-24 px-4">
      <div className="text-center mb-12"><h2 className="text-4xl font-serif font-bold text-[#387035]">{t.title}</h2></div>
      <div className="max-w-7xl mx-auto h-[500px] rounded-[2.5rem] overflow-hidden soft-shadow"><div ref={mapRef} className="w-full h-full" /></div>
    </section>
  );
};

export default function HomePage() {
  const { lang, setLang } = useLanguage();
  const t = TRANSLATIONS[lang];
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoFlipIndex, setAutoFlipIndex] = useState(null);

  useEffect(() => {
    fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRSM975tF3jWF7WhR90O9LQrGuDb-FKJwA9GrSe3wbnuEYVRl9Y_DNYH364g-hkHBYazm3SH-OUXe28/pub?gid=666430223&single=true&output=csv&t=${Date.now()}`)
      .then(r => r.text()).then(txt => { setRestaurants(parseCSV(txt)); setLoading(false); });
  }, []);

  useEffect(() => {
    if (loading || restaurants.length === 0 || window.innerWidth < 1024) return;
    const itv = setInterval(() => {
      setAutoFlipIndex(Math.floor(Math.random() * restaurants.length));
      setTimeout(() => setAutoFlipIndex(null), 3000);
    }, 7000);
    return () => clearInterval(itv);
  }, [loading, restaurants]);

  return (
    <Layout lang={lang} setLang={setLang}>
      <GlobalStyles />
      <section className="rounded-[2.5rem] bg-white overflow-hidden soft-shadow mb-12">
        <img src="/kocsonya/banner.jpg" className="w-full h-auto" alt="Banner" />
        <div className="p-12 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-[#387035] mb-6">{t.hero.title1} {t.hero.title2}</h1>
          <p className="text-lg text-slate-600 mb-10">{t.hero.subtitle}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/feltoltes" className="bg-[#387035] text-white px-8 py-4 rounded-full font-bold uppercase">{t.hero.cta_primary}</Link>
            <a href="#etteremlista" className="border border-[#387035] text-[#387035] px-8 py-4 rounded-full font-bold uppercase">{t.hero.cta_secondary}</a>
          </div>
        </div>
      </section>

      <section className="mb-20 px-6 max-w-3xl mx-auto text-center">
        <p className="text-xl font-medium text-[#387035] mb-6">{t.story.p1}</p>
        <p className="mb-4 text-slate-600">{t.story.p2}</p>
        <p className="mb-4 text-slate-600">{t.story.p3}</p>
        <p className="font-serif font-bold text-2xl text-[#387035] italic">{t.story.closing}</p>
      </section>

      {/* LOGO GRID */}
      {!loading && (
        <section className="mb-20 px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {restaurants.map((r, i) => (
              <a key={i} href={`#${getRestaurantId(r.name)}`} className="aspect-[2/3] bg-white rounded-xl overflow-hidden border border-slate-100 soft-shadow">
                <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </section>
      )}

      <section id="etteremlista" className="mb-24 px-4">
        <h2 className="text-4xl font-serif font-bold text-center text-[#387035] mb-12">{t.restaurants.title}</h2>
        {loading ? <div className="text-center py-20 animate-pulse">{t.restaurants.loading}</div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {restaurants.map((r, i) => <RestaurantCard key={i} restaurant={r} lang={lang} isAutoFlipped={i === autoFlipIndex} />)}
          </div>
        )}
      </section>

      <section className="bg-[#387035] rounded-[2.5rem] p-12 text-white mb-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-4">{t.rules.title}</h2>
            <div className="space-y-6 mt-8">
              <div className="flex gap-4"><IconMeal /> <p>{t.rules.step1}</p></div>
              <div className="flex gap-4"><IconBook /> <p>{t.rules.step2}</p></div>
              <div className="flex gap-4"><IconCamera /> <p>{t.rules.step3}</p></div>
            </div>
          </div>
          <div className="bg-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-serif font-bold mb-4 text-[#aadd77]">{t.prizes.title}</h3>
            <ul className="space-y-4 text-sm">
              <li>★ {t.prizes.item1}</li>
              <li>★ {t.prizes.item2}</li>
              <li>★ {t.prizes.item3}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ÚJ JÁTÉK SZEKCIÓ (MODIFIED) */}
      <section className="mb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Diszkrétebb szöveg: nincs uppercase, nincs bold, kisebb méret */}
          <h2 className="text-xl md:text-2xl font-serif text-[#387035] mb-8">
            {t.game_promo.text}
          </h2>
          
          <a href="https://www.kocsonyautlevel.hu/kocsonya/pacman" className="inline-block game-btn-hover">
            {/* Dupla méretű gomb (md:h-80), de max-w-full a mobilos biztonságért */}
            <img 
              src="/kocsonya/game.png" 
              alt="Játék indítása" 
              className="h-64 md:h-80 w-auto mx-auto drop-shadow-xl max-w-full" 
            />
          </a>
        </div>
      </section>

      {!loading && <MapSection restaurants={restaurants} lang={lang} />}

      <section className="py-16 text-center bg-white rounded-[2.5rem] soft-shadow mb-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-[#387035] mb-2">{t.footer_cta.title}</h2>
        <p className="mb-8">{t.footer_cta.subtitle}</p>
        <Link href="/feltoltes" className="bg-[#387035] text-white px-10 py-4 rounded-full font-bold uppercase">{t.footer_cta.btn}</Link>
      </section>
    </Layout>
  );
}