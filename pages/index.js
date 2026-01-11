import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";
// A régi adatfájlokat nem használjuk a szövegekhez, mert a promptban újak érkeztek,
// de a Layout miatt meghagyjuk az importokat, ha szükségesek lennének.
import { TEXTS } from "../data/texts";

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

// --- ADATOK (A prompt alapján) ---
const RESTAURANT_DATA = [
  {
    name: "Renomé Cafe & Bistro",
    menu: [
      "Klasszikus Renomé kocsonya (sertés körömmel és füstölt marhanyelvvel)",
      "Csülkös kocsonya",
      "Tájvani kacsa kocsonya"
    ]
  },
  {
    name: "Lignum Bistro & Café",
    menu: [
      "Újévi malackocsonya tormás pofahús terrine-nel, rántott békacombbal, málnaecetes lilahagymával"
    ]
  },
  {
    name: "Pizza, Kávé, Világbéke",
    menu: ["Kocsonya by Anyukám Mondta"]
  },
  {
    name: "Rockabilly Chicken",
    menu: [
      "Pork & Jelly (Pulled Pork kocsonya)",
      "Fried Chicken Jelly (Rántott csirkés kocsonya)",
      "Joe odaverős hagyományőrző kocsonyája"
    ]
  },
  {
    name: "Öreg Miskolcz Hotel & Étterem",
    menu: [
      "Klasszikus kocsonya sertéshúsból",
      "Füstölt tarjás kocsonya",
      "Halkocsonya afrikai harcsával"
    ]
  },
  {
    name: "A LEVES és BURGER",
    menu: [
      "Vadkeleti mangalica kocsonya (ázsiai alaplé, mangalica fül, pácolt tojás, savanyított keleti zöldségek, friss koriander, lime, chili olaj)",
      "24 órás sertéskocsonya (házi disznósajt, savanyított téli zöldségek, fürj tojás)"
    ]
  },
  {
    name: "Creppy PalacsintaHáz Étterem & Center",
    menu: [
      "Creppy palacsintás kocsonya (könnyed, tiszta kocsonya csirke- és borjúalapléből, palacsintametélttel)"
    ]
  },
  {
    name: "Babylon Pizzéria, Vendégház",
    menu: [
      "Babylon aszpikos aranykocsonya",
      "Babylon ízei (füstölt csülkös sertéskocsonya tormával, fürj tojással)"
    ]
  },
  {
    name: "Vendéglő a Pisztrángoshoz",
    menu: [
      "Halkocsonya (Irdalt, grillezett ponty, füstölt pisztráng, harcsa kockák)"
    ]
  },
  {
    name: "Rossita Étterem",
    menu: [
      "Füstölt húsos kocsonya",
      "Csülkös kocsonya",
      "Üres kocsonya"
    ]
  }
];

const QUOTES = [
  {
    name: "Varga Henriett",
    role: "ötletgazda, Végállomás Bistro & Wine",
    text: "Számunkra a kocsonya nemcsak hagyományos étel, hanem alapanyag, forma és gondolkodás kérdése is. ...miskolci, őszinte és szerethető."
  },
  {
    name: "Vass László",
    role: "főszervező, Rockabilly Chicken",
    text: "Számomra a szervezés nemcsak feladat, hanem öröm is: az egység megteremtése, a közös cél és az egymást erősítő jelenlét az, ami igazán értéket ad ennek a kezdeményezésnek."
  },
  {
    name: "Fekete-Angyal Enikő",
    role: "ügyvezető, Visit Miskolc",
    text: "Miskolc akkor működik igazán desztinációként, ha az élmények összeérnek... Ez a kezdeményezés pontosan ebbe az irányba lép."
  },
  {
    name: "Lipták Ádám",
    role: "főszervező, Kocsonyafesztivál",
    text: "Ez az együttműködés egyértelműen win-win helyzet: értéket teremt a fesztiválnak, miközben valódi lehetőséget ad a helyi vendéglátóhelyeknek."
  },
  {
    name: "Oszlánczi Réka",
    role: "tulajdonos, Creppy PalacsintaHáz",
    text: "Ha a kocsonya nemcsak a faházak pultjain, hanem asztalainkon is helyet kapna. Ez az összefogás hozzátesz a fesztiválhoz..."
  },
  {
    name: "Szendrei Mihály",
    role: "tulajdonos, Aranykorona Történelmi Étterem",
    text: "A Kocsonya legendája az avasi pincékhez kötődik, ezért igyekszünk ezt megismertetni a vendégekkel saját stílusú kocsonyáinkkal."
  }
];

export default function HomePage() {
  const { lang, setLang } = useLanguage();
  // Alapértelmezett szövegek (hardcoded, mert a kampány szövegezése fix)
  const t = TEXTS[lang]; 

  return (
    <Layout t={t} lang={lang} setLang={setLang}>
      {/* 1. HERO SZEKCIÓ */}
      <section className="relative overflow-hidden rounded-3xl bg-[#387035] text-white shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           {/* Opcionális háttér minta helye */}
           <svg width="100%" height="100%">
             <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
               <circle cx="20" cy="20" r="2" fill="currentColor" />
             </pattern>
             <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
           </svg>
        </div>

        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-20 text-center">
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-[#77b92b] text-white text-sm font-semibold tracking-wide uppercase">
            2026. február 6-8.
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6 leading-tight">
            A miskolci kocsonya <br className="hidden sm:block" /> az asztalhoz ül.
          </h1>
          <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            A Kocsonyafesztivál élménye idén az éttermekben is folytatódik. 
            Fedezd fel a környék legjobb ízeit, gyűjtsd a pecséteket és nyerj!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/feltoltes"
              className="inline-flex items-center justify-center rounded-full bg-white text-[#387035] px-8 py-4 font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Játék és Feltöltés
            </Link>
            <a
              href="#etteremlista"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#77b92b] text-[#77b92b] hover:bg-[#77b92b] hover:text-white px-8 py-4 font-bold text-lg transition-colors"
            >
              Étteremlista
            </a>
          </div>
        </div>
      </section>

      {/* 2. BEMUTATKOZÁS & STORY */}
      <section className="mt-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-bold text-[#387035] mb-6">
          Kocsonya Túra 2026
        </h2>
        <div className="prose prose-lg mx-auto text-slate-700 leading-relaxed">
          <p className="mb-4">
            Idén egy új összefogás csatlakozik a fesztiválhoz. Több miskolci étterem közösen azon dolgozik, hogy a Kocsonyafesztivál élménye a vendéglátóterekben is megjelenjen.
          </p>
          <p className="font-semibold text-[#387035] text-xl italic mb-6">
            „A miskolci kocsonya az asztalhoz ül.”
          </p>
          <p>
            A cél az, hogy a kocsonya – mint a Kocsonyafesztivál szimbóluma – minél több arcát mutathassa meg: hagyományosan, modernül, újragondolva, de minden esetben miskolci kötődéssel.
          </p>
        </div>
      </section>

      {/* 3. SZERVEZŐK IDÉZETEI (Slider helyett grid mobilon) */}
      <section className="mt-16 bg-[#FDFBF7] py-10 rounded-3xl border border-slate-100">
        <div className="px-6 text-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-[#387035]">
            Megszólalnak a szervezők
          </h3>
        </div>
        <div className="px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUOTES.slice(0, 4).map((quote, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-600 italic mb-4">"{quote.text}"</p>
              <div className="font-semibold text-[#387035]">{quote.name}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{quote.role}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
           <p className="text-sm text-slate-400">...és még sokan mások a városért.</p>
        </div>
      </section>

      {/* 4. JÁTÉKSZABÁLY & NYEREMÉNYEK */}
      <section className="mt-16">
        <div className="bg-[#387035] rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Játékszabály */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Így vehetsz részt a játékban</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-[#77b92b]">
                    <IconPlate />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">1. Egyél</h4>
                    <p className="text-green-100 text-sm">Válassz egyet a résztvevő éttermek különleges kocsonyái közül.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-[#77b92b]">
                    <IconCamera />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">2. Fotózz</h4>
                    <p className="text-green-100 text-sm">Gyűjts pecsétet vagy fotózd le a kocsonya útleveledet.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-[#77b92b]">
                    <IconGift />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">3. Nyerj</h4>
                    <p className="text-green-100 text-sm">Töltsd fel a fotót itt az oldalon és nyerj értékes ajándékokat!</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                 <Link href="/feltoltes" className="inline-block w-full sm:w-auto text-center bg-[#77b92b] hover:bg-[#68a325] text-white font-bold py-3 px-8 rounded-full transition-colors">
                   Fotó feltöltése most
                 </Link>
              </div>
            </div>

            {/* Nyeremények Doboz */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
              <h3 className="text-2xl font-serif font-bold text-[#77b92b] mb-4">Nyeremények</h3>
              <ul className="space-y-3 text-green-50">
                <li className="flex items-center gap-2">
                  <span className="text-[#77b92b]">★</span> 3× 2 éjszakás miskolci hétvége
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#77b92b]">★</span> Szállás + Teljes ellátás
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#77b92b]">★</span> Miskolc Pass turisztikai kártya
                </li>
              </ul>
              <p className="mt-6 text-sm text-green-200 italic">
                "Ez nem csak egy vacsora. Ez egy miskolci élménycsomag."
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ÉTTEREMLISTA */}
      <section id="etteremlista" className="mt-20 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#387035]">
            Résztvevő éttermek és menük
          </h2>
          <p className="mt-3 text-slate-600">
            A lista és az árak tájékoztató jellegűek.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESTAURANT_DATA.map((restaurant, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl border-2 border-slate-100 hover:border-[#77b92b] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col"
            >
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-[#387035] mb-2 group-hover:text-[#77b92b] transition-colors">
                  {restaurant.name}
                </h3>
                <div className="w-12 h-1 bg-[#FDFBF7] rounded-full mb-4 group-hover:bg-[#77b92b]"></div>
                
                <div className="space-y-3 flex-grow">
                  {restaurant.menu.map((item, i) => (
                    <div key={i} className="text-slate-700 text-sm border-l-2 border-slate-100 pl-3 leading-snug">
                      {item}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-400">
                   <span className="flex items-center gap-1">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     Miskolc
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer-szerűség */}
      <section className="bg-[#FDFBF7] border-t border-slate-200 py-12 text-center rounded-3xl mb-12">
        <h2 className="text-2xl font-serif font-bold text-[#387035] mb-4">
          A kocsonya az asztalhoz ül. Te is?
        </h2>
        <Link
          href="/feltoltes"
          className="inline-flex items-center justify-center rounded-full bg-[#387035] text-white px-8 py-3 font-bold hover:bg-[#2a5528] transition-colors"
        >
          Csatlakozom a játékhoz
        </Link>
      </section>
    </Layout>
  );
}