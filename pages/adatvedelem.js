import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";
import { TEXTS } from "../data/texts";

export default function PrivacyPage() {
  const { lang, setLang } = useLanguage();
  const t = TEXTS[lang];

  return (
    <Layout t={t} lang={lang} setLang={setLang}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {t.nav.privacy}
        </h1>
        <h2 className="mt-6 text-xl font-semibold">{t.placeholder.soonTitle}</h2>
        <p className="mt-2 text-slate-700">{t.placeholder.soonText}</p>
      </section>
    </Layout>
  );
}
