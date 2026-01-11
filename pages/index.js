import Link from "next/link";
import Layout from "../components/Layout";
import RestaurantList from "../components/RestaurantList";
import { useLanguage } from "../components/useLanguage";
import { TEXTS } from "../data/texts";
import { RESTAURANTS } from "../data/restaurants";

export default function HomePage() {
  const { lang, setLang } = useLanguage();
  const t = TEXTS[lang];

  return (
    <Layout t={t} lang={lang} setLang={setLang}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {t.hero.title}
        </h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          {t.hero.subtitle}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/feltoltes"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-white font-medium hover:bg-slate-800"
          >
            {t.hero.cta}
          </Link>

          <a
            href="#etteremlista"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
          >
            {t.restaurants.title}
          </a>
        </div>
      </section>

      <div id="etteremlista">
        <RestaurantList t={t} restaurants={RESTAURANTS} lang={lang} />
      </div>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
        <h2 className="text-xl font-semibold">{t.promo.title}</h2>
        <p className="mt-2 text-slate-700 leading-relaxed">{t.promo.text}</p>
        <p className="mt-2 text-slate-700 leading-relaxed">{t.promo.prize}</p>

        <div className="mt-6">
          <Link
            href="/feltoltes"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-white font-medium hover:bg-slate-800"
          >
            {t.promo.cta}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
