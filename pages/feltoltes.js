import { useState } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

// --- SZÓTÁR (Helyi definíció a biztonság kedvéért) ---
const FORM_TEXTS = {
  hu: {
    title: "Kocsonya Útlevél Feltöltése",
    note: "Töltsd ki az adataidat és csatold a fotót a pecsétekről vagy a kocsonyáról!",
    fields: {
      name: "Teljes név",
      address: "Lakcím",
      phone: "Telefonszám",
      file: "Fotó kiválasztása",
      selected: "Kiválasztott fájl"
    },
    submit: "Beküldés és Játék",
    loading: "Küldés folyamatban...",
    successTitle: "Sikeres feltöltés!",
    successText: "Köszönjük a játékot! A fotódat megkaptuk, sok szerencsét a sorsoláshoz."
  },
  en: {
    title: "Upload Aspic Passport",
    note: "Fill in your details and attach the photo of your stamps or the aspic!",
    fields: {
      name: "Full Name",
      address: "Address",
      phone: "Phone Number",
      file: "Choose Photo",
      selected: "Selected file"
    },
    submit: "Submit & Play",
    loading: "Sending...",
    successTitle: "Upload Successful!",
    successText: "Thank you for playing! We received your photo, good luck with the draw."
  }
};

export default function UploadPage() {
  const { lang, setLang } = useLanguage();
  const t = FORM_TEXTS[lang]; // Itt a helyi szótárat használjuk

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  // ÚJ: Töltés állapot figyelése
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    // HA már tölt, ne engedjük újra lefutni
    if (loading) return;

    if (!file) {
      alert(lang === 'hu' ? "Kérlek válassz egy fotót!" : "Please select a photo!");
      return;
    }

    // Bekapcsoljuk a "homokórát" -> Gomb letiltva
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

        // A te GAS URL-ed
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

        // Feltételezzük, hogy a GAS visszadob egy JSON-t. 
        // Ha "ok" vagy nincs hiba, akkor sikeresnek vesszük.
        setSubmitted(true);
      } catch (error) {
        console.error(error);
        alert(lang === 'hu' ? "Hiba történt a küldéskor. Kérlek próbáld újra!" : "Error sending data. Please try again!");
      } finally {
        // Akár sikerült, akár nem, a töltést leállítjuk, 
        // de ha sikerült, úgyis eltűnik a gomb a "submitted" állapot miatt.
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <Layout lang={lang} setLang={setLang}>
      <section className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        
        {/* Fejléc sáv */}
        <div className="bg-[#387035] px-6 py-8 sm:px-10 text-center">
           <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            {t.title}
          </h1>
          <p className="mt-2 text-green-100 text-sm sm:text-base">
            {t.note}
          </p>
        </div>

        <div className="p-6 sm:p-10">
          {submitted ? (
            <div className="text-center py-10">
              <div className="mx-auto w-20 h-20 bg-green-100 text-[#387035] rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#387035] mb-2">{t.successTitle}</h2>
              <p className="text-slate-600">{t.successText}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              
              {/* Név Mező */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t.fields.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 focus:outline-none focus:border-[#77b92b] focus:ring-2 focus:ring-green-100 transition-all"
                  placeholder={lang === 'hu' ? "pl. Kiss János" : "e.g. John Doe"}
                  required
                  disabled={loading}
                />
              </div>

              {/* Cím Mező */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t.fields.address}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 focus:outline-none focus:border-[#77b92b] focus:ring-2 focus:ring-green-100 transition-all"
                  placeholder={lang === 'hu' ? "pl. 3530 Miskolc, Fő út 1." : ""}
                  required
                  disabled={loading}
                />
              </div>

              {/* Telefon Mező */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t.fields.phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 focus:outline-none focus:border-[#77b92b] focus:ring-2 focus:ring-green-100 transition-all"
                  placeholder="+36 30 123 4567"
                  required
                  disabled={loading}
                />
              </div>

              {/* Fájl feltöltés (Dizájnosabb) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t.fields.file}
                </label>

                <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${file ? 'border-[#387035] bg-green-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    required
                    disabled={loading}
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center text-[#387035]">
                      <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">{t.fields.selected}:</span>
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium text-[#387035]">Kattints a fotó feltöltéséhez</span>
                      <span className="text-xs mt-1">vagy húzd ide a fájlt</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Gomb - Loading állapottal */}
              <button
                type="submit"
                disabled={loading} // Ez akadályozza meg a duplázást
                className={`w-full flex items-center justify-center py-4 px-6 rounded-full font-bold text-lg transition-all shadow-md 
                  ${loading 
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                    : "bg-[#387035] text-white hover:bg-[#2a5528] hover:shadow-lg transform active:scale-95"
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.loading}
                  </>
                ) : (
                  t.submit
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
