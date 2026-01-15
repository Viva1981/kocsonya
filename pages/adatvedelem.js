import Layout from "../components/Layout";
import { useLanguage } from "../components/useLanguage";

const TRANSLATIONS = {
  hu: {
    title: "Adatvédelmi tájékoztató",
    intro: "A Kocsonya Útlevél Nyereményjáték (a továbbiakban: Játék) során a „A miskolci kocsonya az asztalhoz ül” program (a továbbiakban: Adatkezelő) kiemelt figyelmet fordít a személyes adatok védelmére.",
    sections: [
      {
        title: "1. Az adatkezelés célja",
        text: "A Játék során megadott személyes adatok kezelése kizárólag az alábbi célokból történik:",
        list: [
          "a nyereményjáték lebonyolítása,",
          "a jogosultság ellenőrzése,",
          "a nyertesek kiválasztása és értesítése,",
          "a nyeremények átadása."
        ]
      },
      {
        title: "2. A kezelt adatok köre",
        text: "A Játékban való részvétel során az alábbi személyes adatokat kérjük be:",
        list: ["név", "lakcím", "telefonszám", "feltöltött fénykép (Kocsonya Útlevélről)"]
      },
      {
        title: "3. Az adatkezelés jogalapja",
        text: "Az adatkezelés jogalapja az érintett önkéntes hozzájárulása, amely a Játékban való részvétellel jön létre."
      },
      {
        title: "4. Az adatok tárolása és védelme",
        text: "Az Adatkezelő a személyes adatokat biztonságos, korlátozott hozzáférésű rendszerben tárolja, és minden ésszerű technikai és szervezési intézkedést megtesz azok védelme érdekében. Az adatokhoz kizárólag a Játék lebonyolításában részt vevő jogosult személyek férhetnek hozzá."
      },
      {
        title: "5. Az adatkezelés időtartama",
        text: "A személyes adatokat az Adatkezelő a Játék lezárását és a nyeremények átadását követően, de legkésőbb a jogszabályban meghatározott időn belül törli."
      },
      {
        title: "6. Adattovábbítás",
        text: "Az Adatkezelő a személyes adatokat harmadik fél részére nem továbbítja, kivéve jogszabályi kötelezettség esetén."
      },
      {
        title: "7. Az érintettek jogai",
        text: "Az érintettek jogosultak:",
        list: [
          "tájékoztatást kérni személyes adataik kezeléséről,",
          "kérni adataik helyesbítését vagy törlését,",
          "hozzájárulásukat bármikor visszavonni."
        ]
      },
      {
        title: "8. Kapcsolat",
        text: "Adatkezeléssel kapcsolatos kérdések esetén az érintettek a Szervezőnél érdeklődhetnek a Játék hivatalos elérhetőségén:",
        email: "laszlo.vass@huszonhat.hu"
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    intro: "During the Jelly Passport Prize Game (hereinafter: Game), the 'Miskolc Jelly Takes a Seat at the Table' program (hereinafter: Data Controller) pays special attention to the protection of personal data.",
    sections: [
      {
        title: "1. Purpose of Data Processing",
        text: "Personal data provided during the Game is processed exclusively for the following purposes:",
        list: [
          "conducting the prize game,",
          "verifying eligibility,",
          "selecting and notifying winners,",
          "delivering prizes."
        ]
      },
      {
        title: "2. Scope of Processed Data",
        text: "The following personal data is requested during participation in the Game:",
        list: ["name", "address", "phone number", "uploaded photo (of the Jelly Passport)"]
      },
      {
        title: "3. Legal Basis for Data Processing",
        text: "The legal basis for data processing is the voluntary consent of the data subject, which is established by participating in the Game."
      },
      {
        title: "4. Data Storage and Protection",
        text: "The Data Controller stores personal data in a secure system with limited access and takes all reasonable technical and organizational measures to protect it. Only authorized persons involved in the administration of the Game have access to the data."
      },
      {
        title: "5. Duration of Data Processing",
        text: "The Data Controller deletes personal data after the conclusion of the Game and the delivery of prizes, or at the latest within the period specified by law."
      },
      {
        title: "6. Data Transfer",
        text: "The Data Controller does not transfer personal data to third parties, except in case of legal obligation."
      },
      {
        title: "7. Rights of Data Subjects",
        text: "Data subjects are entitled to:",
        list: [
          "request information about the processing of their personal data,",
          "request the correction or deletion of their data,",
          "withdraw their consent at any time."
        ]
      },
      {
        title: "8. Contact",
        text: "In case of questions regarding data processing, subjects may inquire with the Organizer at the official contact of the Game:",
        email: "laszlo.vass@huszonhat.hu"
      }
    ]
  }
};

export default function PrivacyPage() {
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
              <p className="text-slate-700 leading-relaxed mb-4">
                {section.text}
              </p>
              {section.list && (
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.email && (
                <a 
                  href={`mailto:${section.email}`}
                  className="inline-block mt-2 text-[#77b92b] font-bold hover:underline"
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