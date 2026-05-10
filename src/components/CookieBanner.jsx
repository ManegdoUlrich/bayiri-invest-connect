import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/LangContext";

const text = {
  fr: {
    message: "Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. En continuant, vous acceptez notre utilisation des cookies.",
    accept: "Tout accepter",
    decline: "Refuser",
    policy: "Politique de confidentialité",
  },
  en: {
    message: "We use cookies to improve your experience, analyze traffic and personalize content. By continuing, you agree to our use of cookies.",
    accept: "Accept all",
    decline: "Decline",
    policy: "Privacy policy",
  },
};

export default function CookieBanner() {
  const { lang } = useLang();
  const tx = text[lang] || text.fr;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("bayiri_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("bayiri_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("bayiri_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-900 text-white px-6 py-4 shadow-2xl border-t border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
          {tx.message}{" "}
          <button className="underline text-white hover:text-gray-300 transition-colors">
            {tx.policy}
          </button>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={decline}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
            {tx.decline}
          </Button>
          <Button size="sm" onClick={accept}
            className="bg-[#4ade80] hover:bg-[#22c55e] text-black font-semibold">
            {tx.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}