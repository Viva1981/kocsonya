import Head from "next/head";
import Link from "next/link";
import Script from "next/script"; // --- ÚJ IMPORT ---

export default function Layout({ children, lang, setLang }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FDFBF7] text-slate-800">
      <Head>
        <title>KocsonyaÚtlevél 2026 - Miskolci Kocsonyafesztivál</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="KocsonyaÚtlevél 2026: A miskolci kocsonya az asztalhoz ül. Fedezd fel a Kocsonyafesztivál legjobb éttermeit Miskolcon, gyűjtsd a pecséteket és nyerj!" />
        <meta name="keywords" content="Kocsonyafesztivál, Kocsonya, KocsonyaÚtlevél, Miskolc, A kocsonya az asztalhoz ül, gasztronómia, fesztivál" />
        
        {/* Open Graph / Facebook SEO */}
        <meta property="og:title" content="KocsonyaÚtlevél 2026" />
        <meta property="og:description" content="A miskolci kocsonya az asztalhoz ül. Vegyél részt a játékban!" />
        <meta property="og:type" content="website" />
        
        {/* --- FAVICON BEÁLLÍTÁSOK --- */}
        <link rel="icon" href="/kocsonya/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/kocsonya/favicon.ico" />
      </Head>

      {/* --- GOOGLE ANALYTICS (G-VRLENCLSF5) --- */}
      {/* 1. A külső script betöltése */}
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-VRLENCLSF5" 
        strategy="afterInteractive" 
      />
      {/* 2. A konfigurációs kód futtatása */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-VRLENCLSF5');
        `}
      </Script>

      {/* --- FEJLÉC (FIXED & MODERN) --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-24 flex items-center justify-between">
          
          {/* Logó / Főcím */}
          <Link href="/" className="group flex flex-col items-start">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-[#387035] leading-none group-hover:opacity-90 transition-opacity">
              KocsonyaÚtlevél
            </span>
            <span className="text-[10px] sm:text-xs text-[#77b92b] font-bold tracking-[0.2em] uppercase mt-1 pl-1">
              Miskolc 2026
            </span>
          </Link>

          {/* Navigáció és Nyelvválasztó */}
          <div className="flex items-center gap-6 sm:gap-10">
            <nav className="hidden md:flex items-center gap-8">
              <a 
                href="/kocsonya#etteremlista" 
                className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-[#387035] transition-colors"
              >
                {lang === 'hu' ? 'Éttermek' : 'Restaurants'}
              </a>
              {/* Kiemelt CTA Gomb a menüben */}
              <Link 
                href="/feltoltes" 
                className="text-xs font-bold uppercase tracking-[0.15em] bg-[#387035] text-white px-6 py-3 rounded-full hover:bg-[#2a5528] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                {lang === 'hu' ? 'Játék' : 'Game'}
              </Link>
            </nav>

            {/* Nyelvválasztó - Kapszula stílus */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setLang("hu")}
                className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all uppercase tracking-wider ${
                  lang === "hu"
                    ? "bg-[#387035] text-white shadow-md transform scale-105"
                    : "text-slate-400 hover:text-[#387035]"
                }`}
              >
                HU
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all uppercase tracking-wider ${
                  lang === "en"
                    ? "bg-[#387035] text-white shadow-md transform scale-105"
                    : "text-slate-400 hover:text-[#387035]"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- FŐ TARTALOM --- */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        {children}
      </main>

      {/* --- LÁBLÉC --- */}
      <footer className="bg-[#1a1a1a] text-slate-400 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
             <span className="font-serif text-2xl text-slate-600 font-bold opacity-30">KocsonyaÚtlevél</span>
          </div>
          <p className="mb-8 text-sm font-light tracking-wide opacity-80">
            © 2026 Kocsonyafesztivál Miskolc. 
            {lang === 'hu' ? ' Minden jog fenntartva.' : ' All rights reserved.'}
          </p>
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-[0.15em]">
            <Link href="/adatvedelem" className="hover:text-white transition-colors">
              {lang === 'hu' ? 'Adatvédelem' : 'Privacy'}
            </Link>
            <Link href="/jatekszabaly" className="hover:text-white transition-colors">
              {lang === 'hu' ? 'Játékszabályok' : 'Rules'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}