import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

const TRANSLATIONS = {
  hu: {
    title: "Játékszabályzat",
    intro: "A KocsonyaÚtlevél Nyereményjáték (a továbbiakban: Játék) szervezője „A miskolci kocsonya az asztalhoz ül” program (a továbbiakban: Szervező).",
    sections: [
      {
        title: "1. A játékban való részvétel feltételei",
        text: "A Játékban részt vehet minden 18. életévét betöltött természetes személy, aki a játék időtartama alatt:",
        list: [
          "legalább három különböző vendéglátóhelyen kocsonyát fogyaszt,",
          "a fogyasztást igazoló legalább három pecsétet összegyűjti a KocsonyaÚtlevélben,",
          "az elkészült KocsonyaÚtlevelet lefényképezi és feltölti a Szervező által megjelölt online felületen."
        ],
        footer: "A részvételhez minden feltétel együttes teljesítése szükséges."
      },
      {
        title: "2. A nyeremények",
        text: "A Játék során három nyertes kerül kisorsolásra. Mindhárom nyeremény az alábbiakat tartalmazza:",
        list: [
          "2 éjszaka szállás 2 fő részére az alábbi helyszínek egyikén: Belvárosi Luxusapartman / Bükk Penthouse / Lillafüredi Hotel Palota",
          "Teljes ellátás az élményhétvége ideje alatt, amely magában foglal 2 reggelit, 2 ebédet és 2 vacsorát válogatott miskolci éttermekben",
          "2 db Miskolc Pass, a Visit Miskolc jóvoltából, a város turisztikai attrakcióinak felfedezéséhez"
        ]
      },
      {
        title: "3. Sorsolás és értesítés",
        text: "A nyertesek kiválasztása sorsolás útján történik a szabályosan feltöltött pályázatok közül. A nyertesek értesítése a megadott elérhetőségen történik."
      },
      {
        title: "4. Egyéb rendelkezések",
        list: [
          "Egy személy több feltöltést is benyújthat, azonban egy nyereményre jogosult.",
          "A nyeremény készpénzre nem váltható át.",
          "A Szervező fenntartja a jogot a Játék szabályainak módosítására vagy a Játék megszüntetésére indokolt esetben."
        ]
      },
      {
        title: "5. Adatkezelés",
        text: "A Játék során megadott adatokat a Szervező kizárólag a Játék lebonyolítása céljából kezeli, az adatvédelmi jogszabályok betartásával.",
        email: "laszlo.vass@huszonhat.hu"
      }
    ]
  },
  en: {
    title: "Game Rules",
    intro: "The organizer of the KocsonyaÚtlevél Prize Game (hereinafter: Game) is the 'Miskolc Jelly Takes a Seat at the Table' program (hereinafter: Organizer).",
    sections: [
      {
        title: "1. Conditions for Participation",
        text: "Any natural person over the age of 18 who during the duration of the game can participate:",
        list: [
          "consumes jelly at least at three different catering establishments,",
          "collects at least three stamps certifying consumption in the KocsonyaÚtlevél,",
          "takes a photo of the completed KocsonyaÚtlevél and uploads it to the online interface designated by the Organizer."
        ],
        footer: "To participate, all conditions must be met collectively."
      },
      {
        title: "2. Prizes",
        text: "Three winners will be selected during the Game. All three prizes include:",
        list: [
          "2 nights accommodation for 2 people at one of the following locations: Downtown Luxury Apartment / Bükk Penthouse / Lillafüred Hotel Palota",
          "Full board during the experience weekend, which includes 2 breakfasts, 2 lunches, and 2 dinners at selected Miskolc restaurants",
          "2 Miskolc Passes, courtesy of Visit Miskolc, to discover the city's tourist attractions"
        ]
      },
      {
        title: "3. Drawing and Notification",
        text: "Winners are selected by drawing from the correctly uploaded entries. Winners will be notified via the provided contact information."
      },
      {
        title: "4. Other Provisions",
        list: [
          "One person can submit multiple uploads, but is eligible for only one prize.",
          "The prize cannot be converted into cash.",
          "The Organizer reserves the right to modify the rules of the Game or terminate the Game in justified cases."
        ]
      },
      {
        title: "5. Data Management",
        text: "Data provided during the Game is processed by the Organizer exclusively for the purpose of conducting the Game, in compliance with data protection laws.",
        email: "laszlo.vass@huszonhat.hu"
      }
    ]
  }
};

export default function RulesPage() {
  const { lang, setLang } = useLanguage();
  const t = TRANSLATIONS[lang];

  return (
    <Layout lang={lang} setLang={setLang}>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        {/* Header Card */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-16 soft-shadow border border-slate-100 mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#387035] mb-8 leading-tight">
            {t.title}
          </h1>
          <div className="h-1 w-20 bg-[#77b92b] rounded-full mb-8"></div>
          <p className="text-lg text-slate-600 font-light leading-relaxed italic">
            {t.intro}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12 bg-white rounded-[2.5rem] p-8 sm:p-16 soft-shadow border border-slate-100">
          {t.sections.map((section, idx) => (
            <div key={idx} className="border-b border-slate-50 last:border-0 pb-10 last:pb-0">
              <h2 className="text-2xl font-serif font-bold text-[#387035] mb-4">
                {section.title}
              </h2>
              {section.text && (
                <p className="text-slate-700 leading-relaxed mb-4">
                  {section.text}
                </p>
              )}
              {section.list && (
                <ul className="list-disc pl-6 space-y-3 text-slate-600">
                  {section.list.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              )}
              {section.footer && (
                <p className="mt-4 font-bold text-[#387035] text-sm italic">
                  {section.footer}
                </p>
              )}
              {section.email && (
                <a 
                  href={`mailto:${section.email}`}
                  className="inline-block mt-4 text-[#77b92b] font-bold hover:underline"
                >
                  {section.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}