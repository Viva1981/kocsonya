import { useEffect, useState } from "react";

const STORAGE_KEY = "kocsonya_lang";

export function useLanguage() {
  const [lang, setLang] = useState("hu");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "hu" || saved === "en") setLang(saved);
    } catch (e) {
      // ignore
    }
  }, []);

  function changeLang(next) {
    setLang(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // ignore
    }
  }

  return { lang, setLang: changeLang };
}
