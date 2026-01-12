import Head from "next/head";
import Link from "next/link";

export default function Layout({ children, lang, setLang }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FDFBF7] text-slate-800">
      <Head>
        <title>Kocsonya Útlevél 2026</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="A miskolci kocsonya az asztalhoz ül. Fedezd fel az éttermeket és nyerj!" />
        
        {/* --- FAVICON BEÁLLÍTÁSOK (JAVÍTVA) --- */}
        {/* Most már a helyes .ico fájlra mutat, a /kocsonya előtaggal */}
        <link rel="icon" href="/kocsonya/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/kocsonya/favicon.ico" />
      </Head>

      {/* --- FEJLÉC (FIXED) --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logó / Főcím */}
          <Link href="/" className="flex flex-col">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#387035] leading-none">
              Kocsonya Útlevél
            </span>
            <span className="text-xs text-[#77b92b] font-medium tracking-wider uppercase">
              Miskolc 2026
            </span>
          </Link>

          {/* Navigáció és Nyelvválasztó */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="/kocsonya#etteremlista" className="hover:text-[#387035] transition-colors">
                {lang === 'hu' ? 'Éttermek' : 'Restaurants'}
              </a>
              <Link href="/feltoltes" className="hover:text-[#387035] transition-colors">
                {lang === 'hu' ? 'Játék' : 'Game'}
              </Link>
            </nav>

            {/* Nyelvválasztó Gombok */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setLang("hu")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  lang === "hu"
                    ? "bg-white text-[#387035] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                HU
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  lang === "en"
                    ? "bg-white text-[#387035] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- FŐ TARTALOM --- */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-12">
        {children}
      </main>

      {/* --- LÁBLÉC --- */}
      <footer className="bg-[#1F1F1F] text-slate-400 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4 text-sm">
            © 2026 Kocsonyafesztivál Miskolc. 
            {lang === 'hu' ? ' Minden jog fenntartva.' : ' All rights reserved.'}
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium">
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