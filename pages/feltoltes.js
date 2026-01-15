import { useState } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

// --- STÍLUS ÉS BETŰTÍPUS (Hogy itt is biztosan betöltődjön) ---
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
  `}</style>
);

// --- SZÓTÁR ---
const FORM_TEXTS = {
  hu: {
    title: "Kocsonya Útlevél Feltöltése",
    note: "Töltsd ki az adataidat és csatold a fotót a pecsétekről!",
    fields: {
      name: "Teljes név",
      address: "Lakcím",
      phone: "Telefonszám",
      file: "Fotó feltöltése",
      selected: "Kiválasztott fájl",
      click: "Kattints a kiválasztáshoz"
    },
    submit: "Beküldés és játék",
    loading: "Küldés folyamatban...",
    successTitle: "Sikeres feltöltés!",
    successText: "Köszönjük a játékot! A fotódat megkaptuk, sok szerencsét a sorsoláshoz."
  },
  en: {
    title: "Upload Jelly Passport",
    note: "Fill in your details and attach the photo of your stamps!",
    fields: {
      name: "Full Name",
      address: "Address",
      phone: "Phone Number",
      file: "Upload Photo",
      selected: "Selected file",
      click: "Click to select"
    },
    submit: "Submit & Play",
    loading: "Sending...",
    successTitle: "Upload Successful!",
    successText: "Thank you for playing! We received your photo, good luck with the draw."
  }
};

export default function UploadPage() {
  const { lang, setLang } = useLanguage();
  const t = FORM_TEXTS[lang]; 

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!file) {
      alert(lang === 'hu' ? "Kérlek válassz egy fotót!" : "Please select a photo!");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64 = reader.result.split(",")[1];

        const payload = {
          name,
          address,
          phone,
          lang,
          file: base64,
          fileName: file.name,
          mimeType: file.type,
        };

        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbxOzy93QkZghcHsl3Vxsk_MOeqzPyvf4YLJsAH7PZL__YUTzmvTgO0KUc01Q9UwKqOJ/exec",
          {
            method: "POST",
            body: new URLSearchParams({
              data: JSON.stringify(payload),
            }),
          }
        );

        const json = await res.json();
        setSubmitted(true);
      } catch (error) {
        console.error(error);
        alert(lang === 'hu' ? "Hiba történt a küldéskor. Kérlek próbáld újra!" : "Error sending data. Please try again!");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <Layout lang={lang} setLang={setLang}>
      <GlobalStyles />
      <section className="max-w-2xl mx-auto rounded-[2.5rem] border border-slate-100 bg-white soft-shadow overflow-hidden mb-12">
        
        {/* Header */}
        <div className="bg-[#387035] px-8 py-10 sm:px-12 text-center relative overflow-hidden">
           {/* Díszítő háttér elem */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
           </div>
           
           <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight relative z-10">
            {t.title}
          </h1>
          <p className="mt-3 text-green-100 text-sm sm:text-base font-light relative z-10 max-w-lg mx-auto leading-relaxed">
            {t.note}
          </p>
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
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    {t.fields.name}
                  </label>
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
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    {t.fields.address}
                  </label>
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
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    {t.fields.phone}
                  </label>
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
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    {t.fields.file}
                  </label>

                  <div className={`relative border border-dashed rounded-3xl p-8 text-center transition-all group ${file ? 'border-[#387035] bg-green-50/50' : 'border-slate-300 hover:border-[#387035] hover:bg-slate-50'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                      disabled={loading}
                    />
                    
                    {file ? (
                      <div className="flex flex-col items-center text-[#387035]">
                        <svg className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-serif font-bold text-lg mb-1">{t.fields.selected}</span>
                        <span className="text-sm font-medium opacity-80 truncate max-w-xs bg-white px-3 py-1 rounded-full shadow-sm">{file.name}</span>
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
                    ${loading 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-[#387035] text-white hover:bg-[#2a5528] hover:shadow-2xl hover:-translate-y-1"
                    }`}
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