import { CONFIG } from "./config";

export const TEXTS = {
  hu: {
    langLabel: "Nyelv",
    hu: "HU",
    en: "EN",
    nav: {
      home: "Kezdőlap",
      upload: "Részvétel / Feltöltés",
      privacy: "Adatvédelem",
      rules: "Játékszabályok",
    },
    hero: {
      title: CONFIG.eventName.hu,
      subtitle:
        "Járd végig a résztvevő helyeket, kóstolj kocsonyát, gyűjts pecséteket, és vegyél részt a nyereményjátékban!",
      cta: "Részt veszek a játékban",
    },
    restaurants: {
      title: "Résztvevő éttermek",
      note: "A lista és az árak tájékoztató jellegűek. (Később véglegesítjük.)",
      columns: {
        name: "Étterem",
        address: "Cím",
        product: "Kocsonya",
        price: "Ár",
      },
    },
    promo: {
      title: "Nyereményjáték",
      text:
        `Ha összegyűjtesz legalább ${CONFIG.requiredStamps} pecsétet a „Kocsonya útlevélben”, ` +
        "feltöltöd az útlevél fotóját, és megadod az adataidat, jogosulttá válsz a nyereményjátékban való részvételre.",
      prize:
        `A játékban ${CONFIG.prizeText.hu} nyerhetsz. (Később pontosítjuk.)`,
      cta: "Ugrás a feltöltéshez",
    },
    form: {
      title: "Részvétel / Feltöltés",
      note:
        "A feltöltés végleges beküldése a Google Drive bekötése után lesz éles. Most a felépítést és a működő oldalt rakjuk össze.",
      fields: {
        name: "Név",
        address: "Cím",
        phone: "Telefonszám",
        file: "Kocsonya útlevél fotó",
      },
      chooseFile: "Fájl kiválasztása",
      selected: "Kiválasztva",
      submit: "Beküldés (hamarosan)",
      successTitle: "Köszönjük!",
      successText:
        "A beküldés funkció hamarosan éles lesz. Addig is a felépítés és a tartalom véglegesíthető.",
    },
    placeholder: {
      soonTitle: "Hamarosan",
      soonText:
        "A tartalom hamarosan elérhető lesz. Amint megvan a végleges szöveg, ide beillesztjük.",
    },
    footer: {
      privacy: "Adatvédelem",
      rules: "Játékszabályok",
      copyright: "Minden jog fenntartva.",
    },
  },

  en: {
    langLabel: "Language",
    hu: "HU",
    en: "EN",
    nav: {
      home: "Home",
      upload: "Participate / Upload",
      privacy: "Privacy",
      rules: "Game Rules",
    },
    hero: {
      title: CONFIG.eventName.en,
      subtitle:
        "Visit the participating places, taste aspic, collect stamps, and enter the prize draw!",
      cta: "Join the game",
    },
    restaurants: {
      title: "Participating restaurants",
      note: "The list and prices are indicative. (We will finalize later.)",
      columns: {
        name: "Restaurant",
        address: "Address",
        product: "Aspic",
        price: "Price",
      },
    },
    promo: {
      title: "Prize draw",
      text:
        `If you collect at least ${CONFIG.requiredStamps} stamps in the “Aspic Passport”, ` +
        "upload a photo of the passport, and provide your details, you can enter the prize draw.",
      prize:
        `You can win ${CONFIG.prizeText.en}. (Details to be finalized.)`,
      cta: "Go to upload",
    },
    form: {
      title: "Participate / Upload",
      note:
        "Final submission will go live after we connect Google Drive. For now we build the structure and working pages.",
      fields: {
        name: "Name",
        address: "Address",
        phone: "Phone number",
        file: "Aspic Passport photo",
      },
      chooseFile: "Choose file",
      selected: "Selected",
      submit: "Submit (coming soon)",
      successTitle: "Thank you!",
      successText:
        "Submission will be enabled soon. Meanwhile we can finalize the structure and content.",
    },
    placeholder: {
      soonTitle: "Coming soon",
      soonText:
        "Content will be available soon. Once the final text is ready, we will paste it here.",
    },
    footer: {
      privacy: "Privacy",
      rules: "Game Rules",
      copyright: "All rights reserved.",
    },
  },
};
