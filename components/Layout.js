import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Layout({ children, t, lang, setLang }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold tracking-tight">
            {t.hero.title}
          </Link>

          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link className="hover:underline" href="/">
              {t.nav.home}
            </Link>
            <Link className="hover:underline" href="/feltoltes">
              {t.nav.upload}
            </Link>
            <Link className="hover:underline" href="/adatvedelem">
              {t.nav.privacy}
            </Link>
            <Link className="hover:underline" href="/jatekszabaly">
              {t.nav.rules}
            </Link>
          </nav>

          <LanguageSwitcher
            lang={lang}
            setLang={setLang}
            label={t.langLabel}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex gap-4">
            <Link className="hover:underline" href="/adatvedelem">
              {t.footer.privacy}
            </Link>
            <Link className="hover:underline" href="/jatekszabaly">
              {t.footer.rules}
            </Link>
          </div>
          <div className="text-slate-500">{t.footer.copyright}</div>
        </div>
      </footer>
    </div>
  );
}
