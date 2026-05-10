import { createContext, useContext, useState } from "react";

const LangContext = createContext({ lang: "fr", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("bayiri_lang") || "fr");

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem("bayiri_lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: switchLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}