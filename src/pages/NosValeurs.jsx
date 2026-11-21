import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/LangContext";
import { Shield, Zap, CheckCircle, Eye, ArrowRight, ArrowLeft } from "lucide-react";

const G = "clamp(20px, 5vw, 60px)";
const WRAP = { maxWidth: 1200, margin: "0 auto", paddingLeft: G, paddingRight: G };

const t = {
  fr: {
    back: "Retour à l'accueil",
    label: "Nos valeurs",
    hero: "Ce que nous défendons.",
    heroSub: "Bayiri Invest est né d'une conviction : la diaspora burkinabè mérite un partenaire de confiance, ancré sur le terrain, pour concrétiser ses projets au pays. Chaque choix que nous faisons, chaque process que nous construisons, chaque partenariat que nous forgeons est guidé par ces principes fondamentaux.",
    storyLabel: "Notre histoire",
    storyTitle: "Né d'un manque. Construit pour durer.",
    storyP1: "Comme beaucoup de membres de la diaspora burkinabè, les fondateurs de Bayiri Invest ont vécu de près la frustration d'investir à distance. Projets abandonnés, fonds mal utilisés, interlocuteurs peu fiables : les obstacles étaient nombreux, et les solutions, quasi inexistantes.",
    storyP2: "En 2024, Manegdo Ulrich Doamba et Ouattara Abdoul Razack décident de changer cela. Leur idée : créer une plateforme qui met la technologie au service de la confiance. Pas un simple outil de gestion, mais un véritable partenaire de bout en bout, capable d'accompagner chaque investisseur depuis la signature jusqu'à la remise des clés.",
    storyP3: "Bayiri Invest, c'est le Burkina Faso vu de près, suivi de loin. Une promesse simple : vos projets avancent, vous êtes informé, votre argent est protégé.",
    valuesLabel: "Les 4 piliers",
    valuesTitle: "Quatre principes, une plateforme.",
    valuesSub: "Chaque décision, chaque interaction, chaque rapport est évalué à l'aune de ces quatre valeurs. Elles ne sont pas des mots sur une page : elles sont le filtre à travers lequel nous choisissons nos agents, nos partenaires, nos processus.",
    values: [
      {
        title: "Intégrité",
        tagline: "La vérité, même quand elle est inconfortable.",
        desc: "Nous ne promettons pas ce que nous ne pouvons pas tenir. Si un chantier prend du retard, vous l'apprenez en premier. Si un prestataire ne tient pas ses engagements, nous vous le signalons et nous prenons les mesures qui s'imposent. L'honnêteté n'est pas un avantage concurrentiel pour nous : c'est un minimum.",
        detail: "Chaque rapport que vous recevez est vérifié par notre équipe avant envoi. Nos contrats sont rédigés pour protéger l'investisseur, pas pour nous protéger nous. Aucun frais caché, aucune clause ambiguë.",
      },
      {
        title: "Efficacité",
        tagline: "Votre temps est précieux. Vos projets avancent.",
        desc: "La diaspora investit depuis l'étranger, souvent sans pouvoir se déplacer. Chaque semaine sans nouvelle est une semaine de doute. C'est pourquoi nous avons construit une cadence de suivi rigoureuse : rapports hebdomadaires, photos horodatées, alertes en temps réel.",
        detail: "Nos agents terrain sont certifiés, formés à nos protocoles de reporting et évalués en continu. Les délais sont négociés avec des prestataires partenaires que nous connaissons et dont nous suivons le travail. Quand un projet prend du retard, nous activons nos plans B avant que vous ayez à demander.",
      },
      {
        title: "Confiance",
        tagline: "Vos fonds sont protégés. Vos intérêts, aussi.",
        desc: "Investir à distance, c'est faire confiance. Nous le savons. C'est pourquoi nous avons mis en place des mécanismes de protection à chaque étape : comptes séquestres pour les versements, partenaires notariaux pour les actes fonciers, assurances chantier pour les constructions.",
        detail: "Tous nos partenaires sont vérifiés, référencés et soumis à un audit initial. Nos contrats cadres prévoient des pénalités en cas de défaillance. Et si un prestataire disparaît, Bayiri Invest prend en charge la continuité du projet. Vous ne gérez pas les imprévus seul.",
      },
      {
        title: "Transparence",
        tagline: "Votre tableau de bord ne cache rien.",
        desc: "L'accès à l'information ne devrait pas être un privilège. Avec Bayiri Invest, vous avez une visibilité complète et en temps réel sur l'état de votre projet : avancement des travaux, dépenses réalisées versus budget, documents contractuels, photos et vidéos de chantier.",
        detail: "Nous n'envoyons pas de belles photos quand tout va bien et rien quand ça coince. Vous voyez tout, tout le temps. Notre plateforme est conçue pour que vous puissiez, à n'importe quel moment, expliquer à votre famille ou à votre banque exactement où en est votre investissement.",
      },
    ],
    cta: "Voir l'équipe",
    ctaSub: "Découvrez les personnes qui portent ces valeurs au quotidien.",
  },
  en: {
    back: "Back to home",
    label: "Our values",
    hero: "What we stand for.",
    heroSub: "Bayiri Invest was born from a conviction: the Burkinabè diaspora deserves a trusted partner, grounded on the field, to realize their projects back home. Every choice we make, every process we build, every partnership we forge is guided by these core principles.",
    storyLabel: "Our story",
    storyTitle: "Born from a gap. Built to last.",
    storyP1: "Like many members of the Burkinabè diaspora, Bayiri Invest's founders experienced firsthand the frustration of investing from abroad. Abandoned projects, misused funds, unreliable contacts: the obstacles were many, and the solutions, nearly nonexistent.",
    storyP2: "In 2024, Manegdo Ulrich Doamba and Ouattara Abdoul Razack decided to change that. Their idea: build a platform that puts technology at the service of trust. Not just a management tool, but a true end-to-end partner, capable of accompanying every investor from signing to handover.",
    storyP3: "Bayiri Invest is Burkina Faso seen up close, followed from afar. A simple promise: your projects move forward, you stay informed, your money is protected.",
    valuesLabel: "The 4 pillars",
    valuesTitle: "Four principles, one platform.",
    valuesSub: "Every decision, every interaction, every report is evaluated against these four values. They are not words on a page: they are the filter through which we choose our agents, our partners, our processes.",
    values: [
      {
        title: "Integrity",
        tagline: "The truth, even when it's uncomfortable.",
        desc: "We don't promise what we can't deliver. If a construction is delayed, you hear it first. If a contractor fails to meet their commitments, we flag it and take the necessary steps. Honesty isn't a competitive advantage for us: it's a minimum.",
        detail: "Every report you receive is verified by our team before sending. Our contracts are written to protect the investor, not to protect ourselves. No hidden fees, no ambiguous clauses.",
      },
      {
        title: "Efficiency",
        tagline: "Your time is precious. Your projects move forward.",
        desc: "The diaspora invests from abroad, often without being able to travel. Every week without news is a week of doubt. That's why we built a rigorous follow-up cadence: weekly reports, timestamped photos, real-time alerts.",
        detail: "Our field agents are certified, trained to our reporting protocols and continuously evaluated. Deadlines are negotiated with partner contractors we know and whose work we monitor. When a project falls behind, we activate our backup plans before you have to ask.",
      },
      {
        title: "Trust",
        tagline: "Your funds are protected. Your interests too.",
        desc: "Investing from a distance means trusting. We know that. That's why we've put protection mechanisms in place at every stage: escrow accounts for payments, notarial partners for land deeds, construction insurance for builds.",
        detail: "All our partners are verified, referenced and subject to an initial audit. Our framework contracts include penalties for failure. And if a contractor disappears, Bayiri Invest takes over project continuity. You don't manage unexpected events alone.",
      },
      {
        title: "Transparency",
        tagline: "Your dashboard hides nothing.",
        desc: "Access to information shouldn't be a privilege. With Bayiri Invest, you have complete, real-time visibility into your project's status: construction progress, actual spending versus budget, contractual documents, site photos and videos.",
        detail: "We don't send beautiful photos when things are going well and nothing when they aren't. You see everything, all the time. Our platform is designed so that at any moment, you can explain to your family or your bank exactly where your investment stands.",
      },
    ],
    cta: "Meet the team",
    ctaSub: "Discover the people who embody these values every day.",
  },
};

const ICONS = [Shield, Zap, CheckCircle, Eye];

export default function NosValeurs() {
  const { lang } = useLang();
  const tx = t[lang] || t.fr;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)", minHeight: "100vh", background: "white" }}>

      {/* Nav légère */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid hsl(0,0%,91%)" }}>
        <div style={{ ...WRAP, height: 60, display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "rgb(80,80,80)", fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} />
            {tx.back}
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: "rgb(5,5,5)", paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ ...WRAP }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 20px" }}>{tx.label}</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "white", margin: "0 0 24px", maxWidth: 700 }}>
            {tx.hero}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: 640, margin: 0 }}>
            {tx.heroSub}
          </p>
        </div>
      </section>

      {/* Histoire */}
      <section style={{ paddingTop: 100, paddingBottom: 100, background: "white" }}>
        <div style={{ ...WRAP }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(100,100,100)", margin: "0 0 16px" }}>{tx.storyLabel}</p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem, 2.5vw, 2.6rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "rgb(5,5,5)", margin: "0 0 32px" }}>
                {tx.storyTitle}
              </h2>
              {/* Timeline */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0, borderLeft: "2px solid hsl(0,0%,88%)", paddingLeft: 24 }}>
                {[tx.storyP1, tx.storyP2, tx.storyP3].map((p, i) => (
                  <div key={i} style={{ position: "relative", paddingBottom: i < 2 ? 32 : 0 }}>
                    <div style={{ position: "absolute", left: -31, top: 6, width: 10, height: 10, borderRadius: "50%", background: "rgb(5,5,5)", border: "2px solid white", outline: "2px solid hsl(0,0%,88%)" }} />
                    <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgb(60,60,60)", margin: 0 }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Encart citation */}
            <div style={{ background: "rgb(5,5,5)", borderRadius: 24, padding: "48px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ width: 2, height: 40, background: "rgba(255,255,255,0.15)" }} />
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.2rem, 2vw, 1.5rem)", lineHeight: 1.5, color: "white", margin: 0, fontWeight: 500, fontStyle: "italic" }}>
                {lang === "fr"
                  ? "\"L'investissement à distance ne devrait pas être un acte de foi. Il devrait être un acte documenté, suivi, et sécurisé.\""
                  : "\"Investing from abroad shouldn't be an act of faith. It should be a documented, monitored, and secured act.\""}
              </p>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "white", margin: "0 0 4px" }}>Manegdo Ulrich Doamba</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                  {lang === "fr" ? "Co-fondateur & Directeur Général" : "Co-founder & CEO"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Les 4 valeurs */}
      <section style={{ paddingTop: 100, paddingBottom: 100, background: "rgb(248,248,248)" }}>
        <div style={{ ...WRAP }}>
          <div style={{ maxWidth: 640, marginBottom: 72 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(100,100,100)", margin: "0 0 16px" }}>{tx.valuesLabel}</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "rgb(5,5,5)", margin: "0 0 20px" }}>
              {tx.valuesTitle}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgb(80,80,80)", margin: 0 }}>{tx.valuesSub}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {tx.values.map((v, i) => {
              const Icon = ICONS[i];
              return (
                <div key={v.title} style={{ background: "white", borderRadius: 20, border: "1px solid hsl(0,0%,91%)", padding: "40px 40px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr", gap: 32, alignItems: "start" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgb(5,5,5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon style={{ width: 22, height: 22, color: "white" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgb(160,160,160)", margin: "0 0 8px" }}>0{i + 1}</p>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.4rem", letterSpacing: "-0.01em", color: "rgb(5,5,5)", margin: "0 0 10px" }}>{v.title}</h3>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "rgb(100,100,100)", margin: "0 0 16px", lineHeight: 1.5 }}>{v.tagline}</p>
                      <p style={{ fontSize: 15, lineHeight: 1.75, color: "rgb(60,60,60)", margin: 0 }}>{v.desc}</p>
                    </div>
                    <div style={{ background: "rgb(248,248,248)", borderRadius: 14, padding: "20px 24px", borderLeft: "3px solid rgb(5,5,5)" }}>
                      <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgb(80,80,80)", margin: 0 }}>{v.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA vers équipe */}
      <section style={{ background: "white", paddingTop: 80, paddingBottom: 80, borderTop: "1px solid hsl(0,0%,91%)" }}>
        <div style={{ ...WRAP, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.6rem", letterSpacing: "-0.02em", color: "rgb(5,5,5)", margin: "0 0 8px" }}>{tx.cta}</h3>
            <p style={{ fontSize: 16, color: "rgb(80,80,80)", margin: 0 }}>{tx.ctaSub}</p>
          </div>
          <Link to="/equipe" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgb(5,5,5)", color: "white", padding: "14px 24px", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
            {tx.cta} <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </section>

      {/* Footer minimal */}
      <div style={{ background: "rgb(5,5,5)", paddingTop: 32, paddingBottom: 32 }}>
        <div style={{ ...WRAP, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <img src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png" alt="Bayiri Invest" style={{ height: 32, objectFit: "contain" }} />
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>
            {lang === "fr" ? "Bayiri Invest. Tous droits réservés." : "Bayiri Invest. All rights reserved."}
          </p>
        </div>
      </div>
    </div>
  );
}
