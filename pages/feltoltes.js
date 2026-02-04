import { useState } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

// --- SVG IKONOK ---
const IconMeal = () => (
  <svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth={1.2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 7v3M7 7v2.5a1 1 0 002 0V7M8 10v7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7v10M16 7a2 2 0 012 2v3a2 2 0 01-2 2" />
  </svg>
);

const IconBook = () => (
  <svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconCamera = () => (
  <svg className="w-8 h-8 text-[#77b92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// --- STÍLUS ÉS BETŰTÍPUS ---
const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    
    body {
      font-family: 'DM Sans', sans-serif;
      background-color: #FDFBF7;
      scroll-behavior: smooth;
    }
    h1, h2, h3, h4, .font-serif {
      font-family: 'Playfair Display', serif;
    }
    .soft-shadow {
      box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
    }
  `}</style>
);

// --- SZÓTÁR ---
const FORM_TEXTS = {
  hu: {
    title: "KocsonyaÚtlevél Feltöltése",
    note: "A miskolci kocsonya az asztalhoz ül! Töltsd ki az adataidat és csatold a fotót a lepecsételt KocsonyaÚtleveledről, hogy részt vehess nyereményjátékban!",
    fields: {
      name: "Teljes név",
      address: "Lakcím",
      phone: "Telefonszám",
      file: "Fotó feltöltése (min. 1, max. 2)",
      selected: "Kiválasztott fájlok",
      click: "Kattints a kiválasztáshoz"
    },
    submit: "Beküldés és játék",
    loading: "Küldés folyamatban...",
    successTitle: "Sikeres feltöltés!",
    successText: "Köszönjük a játékot! A fotó(ka)t megkaptuk. Reméljük, ízlett a miskolci kocsonya! Sok szerencsét a sorsoláshoz.",
    rules: {
      title: "Kocsonyából élmény!",
      subtitle: "Vegyél részt a KocsonyaÚtlevél nyereményjátékban!",
      step1: "Kóstolj kocsonyát legalább három különböző helyen Miskolcon!",
      step2: "Gyűjts legalább három pecsétet a KocsonyaÚtleveledbe!",
      step3: "Fotózd le a lepecsételt oldalt, és töltsd fel!",
      cta: "FOTÓ FELTÖLTÉSE MOST"
    },
    prizes: {
      title: "Nyerd meg a három nyeremény egyikét!",
      desc: "A három nyeremény minden esetben tartalmaz:",
      item1: "Szállást két fő részére két éjszakára (Belvárosi Luxusapartman, Bükk Penthouse, Lillafüredi Hotel Palota)",
      item2: "Az élményhétvégére teljes ellátást: két reggelit, két ebédet és két vacsorát válogatott miskolci éttermekben.",
      item3: "Két Miskolc Pass-t a Visit Miskolc jóvoltából, amellyel felfedezheted a város attrakcióit."
    }
  },
  en: {
    title: "Upload AspicPass",
    note: "Miskolc aspic is served! Fill in your details and attach the photo of your stamped AspicPass to participate in the prize game!",
    fields: {
      name: "Full Name",
      address: "Address",
      phone: "Phone Number",
      file: "Upload photo (min 1, max 2)",
      selected: "Selected files",
      click: "Click to select"
    },
    submit: "Submit & Play",
    loading: "Sending...",
    successTitle: "Upload Successful!",
    successText: "Thank you for playing! We received your photo(s). We hope you enjoyed the Miskolc aspic! Good luck with the draw.",
    rules: {
      title: "Make an experience out of Aspic!",
      subtitle: "Participate in the AspicPass prize game!",
      step1: "Taste aspic in at least three different places in Miskolc!",
      step2: "Collect at least three stamps in your AspicPass!",
      step3: "Take a photo and upload it!",
      cta: "UPLOAD PHOTO NOW"
    },
    prizes: {
      title: "Win one of the three prizes!",
      desc: "The three prizes always include:",
      item1: "Accommodation for two people for two nights in Miskolc (Downtown Luxury Apartment, Bükk Penthouse, Lillafüred Hotel Palota)",
      item2: "Full board for the experience weekend: two breakfasts, two lunches, and two dinners at selected restaurants.",
      item3: "Two Miskolc Passes courtesy of Visit Miskolc to discover the city's attractions."
    }
  }
};

// --- segédfüggvény: File -> base64 (csak a "tiszta" rész, prefix nélkül) ---
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("FileReader error"));
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.split(",")[1] || "";
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}

export default function UploadPage() {
  const { lang, setLang } = useLanguage();
  const t = FORM_TEXTS[lang];

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState([]); // <= MOST: tömb (max 2)
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollToForm = (e) => {
    e.preventDefault();
    const formElement = document.getElementById("upload-form");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  };

  const onFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    // max 2 fájl
    const limited = selected.slice(0, 2);
    setFiles(limited);
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!files || files.length < 1) {
      alert(lang === "hu" ? "Kérlek válassz legalább 1 fotót!" : "Please select at least 1 photo!");
      return;
    }

    setLoading(true);

    try {
      // 1-2 fájl -> base64
      const encoded = await Promise.all(
        files.map(async (f) => {
          const base64 = await fileToBase64(f);
          return {
            file: base64,
            fileName: f.name,
            mimeType: f.type,
          };
        })
      );

      const payload = {
        name,
        address,
        phone,
        lang,
        files: encoded, // <= ÚJ
      };

     const res = await fetch(
  "https://script.google.com/macros/s/AKfycbwb9pNmcfO1G-Ylt_GLEpTh7ac8_lMSo_lcjVwBJBf9YD5rpAUjEiw8z7-tVPz1VE0zdg/exec",
  {
    method: "POST",
    body: new URLSearchParams({
      data: JSON.stringify(payload),
    }),
  }
);


      // ha a script nem JSON-t ad vissza, ez hibázna – de nálad eddig működött, szóval marad
      await res.json();

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert(lang === "hu" ? "Hiba történt a küldéskor. Kérlek próbáld újra!" : "Error sending data. Please try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout lang={lang} setLang={setLang}>
      <GlobalStyles />

      {/* --- 1. SZEKCIÓ: ZÖLD INFORMÁCIÓS RÉSZ (FELÜL) --- */}
      <section className="mb-16 mt-8 px-4 sm:px-6">
        <div className="bg-[#387035] rounded-[2.5rem] p-8 sm:p-16 text-white shadow-2xl shadow-green-900/20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-2">{t.rules.title}</h2>
              <p className="text-[#aadd77] text-xl font-medium mb-10">{t.rules.subtitle}</p>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-white/10 rounded-2xl text-[#aadd77] backdrop-blur-sm"><IconMeal /></div>
                  <div><h4 className="font-bold text-xl mb-1">1.</h4><p className="text-green-100 text-base leading-relaxed opacity-90">{t.rules.step1}</p></div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-white/10 rounded-2xl text-[#aadd77] backdrop-blur-sm"><IconBook /></div>
                  <div><h4 className="font-bold text-xl mb-1">2.</h4><p className="text-green-100 text-base leading-relaxed opacity-90">{t.rules.step2}</p></div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-white/10 rounded-2xl text-[#aadd77] backdrop-blur-sm"><IconCamera /></div>
                  <div><h4 className="font-bold text-xl mb-1">3.</h4><p className="text-green-100 text-base leading-relaxed opacity-90">{t.rules.step3}</p></div>
                </div>
              </div>

              <div className="mt-12">
                <a
                  href="#upload-form"
                  onClick={scrollToForm}
                  className="inline-block w-full sm:w-auto text-center bg-white text-[#387035] hover:bg-green-50 font-bold text-sm uppercase tracking-[0.1em] py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  {t.rules.cta}
                </a>
              </div>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-md">
              <h3 className="text-2xl font-serif font-bold text-[#aadd77] mb-4">{t.prizes.title}</h3>
              <p className="text-white/80 mb-6 text-sm">{t.prizes.desc}</p>
              <ul className="space-y-5 text-white">
                <li className="flex items-start gap-3"><span className="text-[#aadd77] text-xl mt-1">★</span><span className="text-base leading-relaxed">{t.prizes.item1}</span></li>
                <li className="flex items-start gap-3"><span className="text-[#aadd77] text-xl mt-1">★</span><span className="text-base leading-relaxed">{t.prizes.item2}</span></li>
                <li className="flex items-start gap-3"><span className="text-[#aadd77] text-xl mt-1">★</span><span className="text-base leading-relaxed">{t.prizes.item3}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. SZEKCIÓ: FORM RÉSZ (ALUL) --- */}
      <section id="upload-form" className="max-w-2xl mx-auto rounded-[2.5rem] border border-slate-100 bg-white soft-shadow overflow-hidden mb-24 scroll-mt-12">
        <div className="bg-[#387035] px-8 py-10 sm:px-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight relative z-10">{t.title}</h1>
          <p className="mt-3 text-green-100 text-sm sm:text-base font-light relative z-10 max-w-lg mx-auto leading-relaxed">{t.note}</p>
        </div>

        <div className="p-8 sm:p-12">
          {submitted ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-green-50 text-[#387035] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#387035] mb-4">{t.successTitle}</h2>
              <p className="text-slate-600 leading-relaxed max-w-md mx-auto">{t.successText}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.fields.name}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-[#FDFBF7] px-5 py-4 text-slate-800 focus:outline-none focus:border-[#387035] focus:ring-1 focus:ring-[#387035] transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.fields.address}</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-[#FDFBF7] px-5 py-4 text-slate-800 focus:outline-none focus:border-[#387035] focus:ring-1 focus:ring-[#387035] transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.fields.phone}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-[#FDFBF7] px-5 py-4 text-slate-800 focus:outline-none focus:border-[#387035] focus:ring-1 focus:ring-[#387035] transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.fields.file}</label>

                  <div className={`relative border border-dashed rounded-3xl p-8 text-center transition-all group ${files.length ? "border-[#387035] bg-green-50/50" : "border-slate-300 hover:border-[#387035] hover:bg-slate-50"}`}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={onFilesChange}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                      disabled={loading}
                    />

                    {files.length ? (
                      <div className="flex flex-col items-center text-[#387035]">
                        <svg className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-serif font-bold text-lg mb-2">{t.fields.selected} ({files.length}/2)</span>

                        <div className="space-y-2 w-full max-w-xs">
                          {files.map((f, idx) => (
                            <div key={idx} className="text-sm font-medium opacity-90 truncate bg-white px-3 py-2 rounded-full shadow-sm">
                              {idx + 1}. {f.name}
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 text-xs text-slate-600">
                          {lang === "hu" ? "Tipp: ha 3-at választasz, csak az első 2 kerül mentésre." : "Tip: If you select 3, only the first 2 will be kept."}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-[#387035] transition-colors">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:shadow-md transition-shadow">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="font-medium text-sm">{t.fields.click}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center py-5 px-6 rounded-full font-bold text-sm uppercase tracking-[0.1em] transition-all shadow-xl 
                  ${loading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#387035] text-white hover:bg-[#2a5528] hover:shadow-2xl hover:-translate-y-1"}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.loading}
                    </>
                  ) : (
                    t.submit
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
