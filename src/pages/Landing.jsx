import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/LangContext";
import { Shield, MapPin, TrendingUp, Building2, ArrowRight, CheckCircle, Star, Users, Handshake, Flag, Zap, Eye, Mail, Phone } from "lucide-react";

const HERO_IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3Ecsq627sStwKzm5HgcVNMBPKAy/hf_20261102_231909_7e626f56-7232-44de-b0c2-bcc0bc859ec0.png";

const USE_CASE_IMGS = [
  "https://d8j0ntlcm91z4.cloudfront.net/user_3Ecsq627sStwKzm5HgcVNMBPKAy/hf_20261103_000728_30219a73-4744-4f98-95c5-9b0e80de814e.png",
  "https://d8j0ntlcm91z4.cloudfront.net/user_3Ecsq627sStwKzm5HgcVNMBPKAy/hf_20261103_000734_03d71880-ae8e-4345-a44a-4fbda008d0cd.png",
  "https://d8j0ntlcm91z4.cloudfront.net/user_3Ecsq627sStwKzm5HgcVNMBPKAy/hf_20261103_000740_7e4d3b3e-dc52-409d-a3e1-b180f26069ad.png",
];

const t = {
  fr: {
    nav: {
      solutions: "Solutions",
      howItWorks: "Comment ça marche",
      testimonials: "Témoignages",
      contact: "Nous contacter",
      login: "Se connecter",
      start: "Ouvrir un compte",
    },
    hero: {
      trustpilot: "4,8 sur 5 · Trustpilot",
      line1: "Investissez",
      line2: "au pays",
      line3: "en confiance.",
      subtitle: "Bayiri Invest accompagne la diaspora africaine dans ses projets immobiliers et commerciaux. Agents certifiés sur le terrain, suivi temps réel, contrats sécurisés.",
      cta: "Démarrer mon projet",
      ctaSub: "Comment ça marche",
    },
    trust: [
      { label: "Entreprise 100% Burkinabè", desc: "Fondée, gérée et ancrée au Burkina Faso" },
      { label: "Burkina & Diaspora réunis", desc: "Une équipe jeune, locale et internationale" },
      { label: "Réseau de partenaires solide", desc: "Artisans, notaires, architectes et banques" },
    ],
    featuresTitle: "Le terrain, géré.\nVous, informé.",
    features: [
      { icon: MapPin, title: "Agent local dédié", desc: "Un représentant certifié sur le terrain pour défendre vos intérêts et coordonner chaque intervenant." },
      { icon: Building2, title: "Suivi de chantier", desc: "Photos géolocalisées, rapports hebdomadaires et mises à jour en temps réel directement sur votre tableau de bord." },
      { icon: TrendingUp, title: "Opportunités business", desc: "Identification de terrains, commerces et opportunités d'investissement adaptés à votre budget et vos objectifs." },
      { icon: Shield, title: "Sécurité juridique", desc: "Vérification des titres fonciers, accompagnement administratif et contrats électroniques sécurisés." },
    ],
    howTitle: "Investir depuis l'étranger,\nsimple comme bonjour.",
    steps: [
      { num: "01", title: "Créez votre compte", desc: "Inscription en 2 minutes. Décrivez votre projet et votre budget." },
      { num: "02", title: "Un agent vous est assigné", desc: "Nous sélectionnons un agent certifié dans votre ville cible." },
      { num: "03", title: "Suivez en temps réel", desc: "Rapports, photos, documents : tout est dans votre espace." },
      { num: "04", title: "Investissement sécurisé", desc: "Contrats électroniques et paiements gérés en toute sécurité." },
    ],
    platformTitle: "Votre chantier,\nlisible depuis Paris.",
    platformFeatures: [
      "Tableau de bord par projet",
      "Photos terrain géolocalisées",
      "Signature électronique",
      "Suivi des paiements",
      "Notifications instantanées",
    ],
    platformCta: "Voir la plateforme",
    testimonialsTitle: "Ils l'ont fait.",
    testimonials: [
      { name: "Kofi Mensah", origin: "Londres, UK", text: "J'ai pu construire ma villa sans jamais me déplacer. Les rapports photo hebdomadaires m'ont donné une tranquillité d'esprit totale.", stars: 4 },
      { name: "Aminata Diallo", origin: "Paris, France", text: "Professionnalisme et transparence à chaque étape. Leur équipe a géré l'achat de mon terrain et toutes les démarches administratives.", stars: 5 },
      { name: "Jean-Baptiste Nkomo", origin: "Bruxelles, Belgique", text: "Avec Bayiri Invest, j'ai enfin trouvé un partenaire de confiance. Mon commerce tourne très bien depuis 6 mois.", stars: 5 },
    ],
    finalCta: "Votre projet commence ici.",
    finalCtaSub: "Un compte, un agent dédié, un suivi complet. La diaspora mérite mieux que les promesses.",
    finalCtaBtn: "Ouvrir un compte",
    footer: "© 2026 Bayiri Invest. Tous droits réservés.",
  },
  en: {
    nav: {
      solutions: "Solutions",
      howItWorks: "How it works",
      testimonials: "Testimonials",
      contact: "Contact us",
      login: "Log in",
      start: "Open an account",
    },
    hero: {
      trustpilot: "4.8 out of 5 · Trustpilot",
      line1: "Invest",
      line2: "back home",
      line3: "with confidence.",
      subtitle: "Bayiri Invest guides the African diaspora through real estate and commercial projects. Certified local agents, real-time tracking, secure contracts.",
      cta: "Start my project",
      ctaSub: "How it works",
    },
    trust: [
      { label: "100% Burkinabè company", desc: "Founded, operated and rooted in Burkina Faso" },
      { label: "Burkina & Diaspora together", desc: "A young, local and international team" },
      { label: "Strong partner network", desc: "Builders, notaries, architects and banks" },
    ],
    featuresTitle: "The ground, managed.\nYou, informed.",
    features: [
      { icon: MapPin, title: "Dedicated local agent", desc: "A certified representative on the ground to defend your interests and coordinate every party." },
      { icon: Building2, title: "Construction tracking", desc: "Geolocated photos, weekly reports and real-time updates directly on your dashboard." },
      { icon: TrendingUp, title: "Business opportunities", desc: "Land, shops and investment opportunities matched to your budget and goals." },
      { icon: Shield, title: "Legal protection", desc: "Land title verification, administrative support and secure electronic contracts." },
    ],
    howTitle: "Investing from abroad,\nmade simple.",
    steps: [
      { num: "01", title: "Create your account", desc: "Sign up in 2 minutes. Describe your project and budget." },
      { num: "02", title: "Agent assigned", desc: "We select a certified agent in your target city." },
      { num: "03", title: "Track in real time", desc: "Reports, photos, documents: all in your personal space." },
      { num: "04", title: "Secured investment", desc: "Electronic contracts and payments managed securely." },
    ],
    platformTitle: "Your site,\nreadable from London.",
    platformFeatures: [
      "Per-project dashboard",
      "Geolocated field photos",
      "Electronic signing",
      "Payment tracking",
      "Instant notifications",
    ],
    platformCta: "See the platform",
    testimonialsTitle: "They did it.",
    testimonials: [
      { name: "Kofi Mensah", origin: "London, UK", text: "I built my villa without ever traveling. The weekly photo reports gave me total peace of mind.", stars: 5 },
      { name: "Aminata Diallo", origin: "Paris, France", text: "Professionalism and transparency at every step. Their team handled the land purchase and all admin.", stars: 5 },
      { name: "Jean-Baptiste Nkomo", origin: "Brussels, Belgium", text: "I finally found a trustworthy partner. My business has been running great for 6 months.", stars: 5 },
    ],
    finalCta: "Your project starts here.",
    finalCtaSub: "One account, one dedicated agent, full tracking. The diaspora deserves better than promises.",
    finalCtaBtn: "Open an account",
    footer: "© 2026 Bayiri Invest. All rights reserved.",
  },
};

const TRUST_ICONS = [Flag, Users, Handshake];

// Gutter uniforme pour toute la page
const G = "clamp(20px, 5vw, 60px)";
const WRAP = { maxWidth: 1200, margin: "0 auto", paddingLeft: G, paddingRight: G };

export default function Landing() {
  const { lang, setLang: switchLang } = useLang();
  const tx = t[lang];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "hsl(var(--background))", color: "hsl(var(--foreground))", fontFamily: "var(--font-body)" }}>

      {/* ── Navbar — transparente sur le hero ───────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "hsla(var(--background)/0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid hsl(var(--border)/0.5)" : "none",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
      }}>
        <div style={{ ...WRAP, height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          {/* Logo */}
          <img
            src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png"
            alt="Bayiri Invest"
            style={{ height: 38, objectFit: "contain", flexShrink: 0, filter: scrolled ? "none" : "brightness(10)" }}
          />

          {/* Liens de navigation centraux */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" }}>
            {[
              { label: tx.nav.solutions, href: "#solutions" },
              { label: tx.nav.howItWorks, href: "#comment" },
              { label: tx.nav.testimonials, href: "#avis" },
              { label: tx.nav.contact, href: "#contact" },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                fontSize: 14, fontWeight: 500, padding: "7px 14px", borderRadius: 6,
                color: scrolled ? "hsl(var(--foreground)/0.8)" : "rgba(255,255,255,0.8)",
                textDecoration: "none", transition: "color 0.2s, background 0.2s",
                whiteSpace: "nowrap",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = scrolled ? "hsl(var(--foreground))" : "white";
                  e.currentTarget.style.background = scrolled ? "hsl(var(--muted))" : "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = scrolled ? "hsl(var(--foreground)/0.8)" : "rgba(255,255,255,0.8)";
                  e.currentTarget.style.background = "transparent";
                }}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions droites */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button onClick={() => switchLang(lang === "fr" ? "en" : "fr")}
              style={{
                fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 6,
                border: `1px solid ${scrolled ? "hsl(var(--border))" : "rgba(255,255,255,0.2)"}`,
                cursor: "pointer",
                background: "transparent",
                color: scrolled ? "hsl(var(--muted-foreground))" : "rgba(255,255,255,0.7)",
                letterSpacing: "0.05em", transition: "all 0.2s",
              }}>
              {lang === "fr" ? "EN" : "FR"}
            </button>
            <Link to="/dashboard">
              <button style={{
                fontSize: 14, fontWeight: 500, padding: "8px 18px", borderRadius: 8,
                border: `1px solid ${scrolled ? "hsl(var(--border))" : "rgba(255,255,255,0.25)"}`,
                background: "transparent",
                color: scrolled ? "hsl(var(--foreground))" : "rgba(255,255,255,0.9)",
                cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
              }}>
                {tx.nav.login}
              </button>
            </Link>
            <Link to="/register">
              <button style={{
                fontSize: 14, fontWeight: 600, padding: "8px 20px", borderRadius: 8,
                background: "white", color: "hsl(0,0%,5%)",
                border: "none", cursor: "pointer", transition: "opacity 0.15s", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                {tx.nav.start}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "hsl(0,0%,2%)", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Photo de fond — vue aérienne Ouagadougou */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${HERO_IMG}')`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.5,
        }} />
        {/* Overlay doux — laisse la photo respirer partout */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.25) 100%)" }} />
        {/* Gradient bas pour transition douce */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, hsl(0,0%,2%), transparent)" }} />

        {/* Contenu — texte ancré à gauche, photo de fond sur toute la largeur */}
        <div style={{
          position: "relative",
          flex: 1,
          paddingLeft: G, paddingRight: G,
          paddingTop: 160, paddingBottom: 80,
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxWidth: 660 }}>
            {/* Label editorial */}
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>
              {lang === "fr" ? "Investissement · Diaspora · Burkina Faso" : "Investment · Diaspora · Burkina Faso"}
            </p>

            {/* Titre — 2 lignes */}
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 4.5vw, 4.8rem)",
              lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 700,
              margin: "0 0 22px 0", textAlign: "left",
            }}>
              {tx.hero.line1}<br />
              {tx.hero.line2} {tx.hero.line3}
            </h1>

            <p style={{ fontSize: "clamp(15px, 1.3vw, 18px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 38px 0", textAlign: "left", maxWidth: 480 }}>
              {tx.hero.subtitle}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link to="/register">
                <button
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 8, background: "white", color: "hsl(0,0%,5%)", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  {tx.hero.cta} <ArrowRight style={{ width: 17, height: 17 }} />
                </button>
              </Link>
              <a href="#comment">
                <button
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.88)", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
                  {tx.hero.ctaSub}
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* ── Barre de confiance — style Qonto ──────────────── */}
        <div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ ...WRAP, display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {tx.trust.map((item, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  paddingTop: 24, paddingBottom: 24,
                  paddingRight: i < 2 ? 24 : 0,
                  paddingLeft: i > 0 ? 24 : 0,
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}>
                  <div style={{ width: 46, height: 46, borderRadius: 11, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {i === 0
                      ? <Flag style={{ width: 20, height: 20, color: "rgba(255,255,255,0.65)" }} />
                      : <Icon style={{ width: 20, height: 20, color: "rgba(255,255,255,0.65)" }} />}
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "white", margin: "0 0 4px 0", lineHeight: 1.25 }}>{item.label}</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.45 }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features — bento sombre style Qonto ─────────────── */}
      <section id="solutions" style={{ background: "hsl(0,0%,2%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ paddingLeft: G, paddingRight: G, maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 3.2rem)", letterSpacing: "-0.03em", color: "white", lineHeight: 1.1, margin: 0, whiteSpace: "pre-line", maxWidth: 560 }}>
              {tx.featuresTitle}
            </h2>
            <Link to="/register" style={{ textDecoration: "none", flexShrink: 0 }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)", background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}>
                {lang === "fr" ? "Démarrer" : "Get started"} <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </Link>
          </div>

          {/* Bento grid — 3 colonnes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 12 }}>

            {/* Carte 1 — Agent local — col 1, row 1 */}
            <div style={{ gridColumn: "1", gridRow: "1", background: "rgb(26,26,26)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20, minHeight: 220 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPin style={{ width: 18, height: 18, color: "rgba(255,255,255,0.6)" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.35rem", color: "white", margin: "0 0 12px", lineHeight: 1.2 }}>{tx.features[0].title}</h3>
                <p style={{ fontSize: 15, color: "rgb(180,180,180)", lineHeight: 1.65, margin: 0 }}>{tx.features[0].desc}</p>
              </div>
            </div>

            {/* Carte 2 — Suivi chantier — col 2-3, rows 1-2 — carte CLAIRE comme Qonto */}
            <div style={{ gridColumn: "2 / 4", gridRow: "1 / 3", backgroundImage: "radial-gradient(66% 50% at 65% 30%, rgb(218,218,218) 0%, rgb(246,246,246) 100%)", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", padding: "36px 32px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ marginBottom: "auto" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Building2 style={{ width: 18, height: 18, color: "rgba(0,0,0,0.55)" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.55rem", color: "rgb(5,5,5)", margin: "0 0 12px", lineHeight: 1.15 }}>{tx.features[1].title}</h3>
                <p style={{ fontSize: 15, color: "rgb(61,61,61)", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 420 }}>{tx.features[1].desc}</p>
              </div>
              {/* Mini mockup chantier — fond sombre sur carte claire */}
              <div style={{ background: "rgb(26,26,26)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}>bayiri · suivi de chantier</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
                  {[{ label: "Fondation", n: "14 photos" }, { label: "Murs R+1", n: "9 photos" }, { label: "Toiture", n: "6 photos" }].map((item, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: "0 0 3px" }}>{item.n}</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0 }}>{item.label}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Villa Ouagadougou Nord</span>
                    <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>68%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: "68%", height: "100%", background: "linear-gradient(to right, rgba(255,255,255,0.35), white)", borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Carte 3 — Sécurité juridique — col 1, row 2 */}
            <div style={{ gridColumn: "1", gridRow: "2", background: "rgb(26,26,26)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield style={{ width: 18, height: 18, color: "rgba(255,255,255,0.6)" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.35rem", color: "white", margin: "0 0 12px", lineHeight: 1.2 }}>{tx.features[3].title}</h3>
                <p style={{ fontSize: 15, color: "rgb(180,180,180)", lineHeight: 1.65, margin: 0 }}>{tx.features[3].desc}</p>
              </div>
            </div>

          </div>

          {/* Carte large — Opportunités — pleine largeur en bas */}
          <div style={{ marginTop: 12, background: "rgb(26,26,26)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <TrendingUp style={{ width: 18, height: 18, color: "rgba(255,255,255,0.6)" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.55rem", color: "white", margin: "0 0 12px", lineHeight: 1.15 }}>{tx.features[2].title}</h3>
              <p style={{ fontSize: 15, color: "rgb(180,180,180)", lineHeight: 1.65, margin: 0, maxWidth: 520 }}>{tx.features[2].desc}</p>
            </div>
            {/* Types d'investissement */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
              {[
                lang === "fr" ? "Résidentiel & villa" : "Residential & villa",
                lang === "fr" ? "Commercial & PME" : "Commercial & SME",
                lang === "fr" ? "Terrain & foncier" : "Land & property",
              ].map(label => (
                <div key={label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="comment" style={{ background: "white", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", marginBottom: 56, lineHeight: 1.15, whiteSpace: "pre-line", color: "rgb(5,5,5)" }}>
            {tx.howTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
            {tx.steps.map((step, i) => (
              <div key={step.num}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "rgb(160,160,160)", letterSpacing: "0.1em" }}>{step.num}</span>
                  {i < tx.steps.length - 1 && <div style={{ flex: 1, height: 1, background: "hsl(0,0%,91%)" }} />}
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "rgb(5,5,5)", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgb(100,100,100)", margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases — 3 grandes cartes photo style Qonto ──── */}
      <section style={{ background: "hsl(0,0%,2%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ paddingLeft: G, paddingRight: G }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, maxWidth: 1200, margin: "0 auto 48px" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", color: "white", lineHeight: 1.15, margin: 0 }}>
              {lang === "fr" ? "Vos projets,\nconcrétisés." : "Your projects,\nrealized."}
            </h2>
            <Link to="/register" style={{ textDecoration: "none", flexShrink: 0 }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                {lang === "fr" ? "Démarrer" : "Get started"} <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </Link>
          </div>

          {/* 3 cartes photo */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 1200, margin: "0 auto" }}>
            {[
              { img: USE_CASE_IMGS[0], label: lang === "fr" ? "Construction" : "Construction", desc: lang === "fr" ? "Immobilier résidentiel & commercial" : "Residential & commercial real estate" },
              { img: USE_CASE_IMGS[1], label: lang === "fr" ? "Commerce" : "Business", desc: lang === "fr" ? "Boutiques, restaurants, PME" : "Shops, restaurants, SMEs" },
              { img: USE_CASE_IMGS[2], label: lang === "fr" ? "Diaspora" : "Diaspora", desc: lang === "fr" ? "Investir depuis l'étranger" : "Investing from abroad" },
            ].map((card, i) => (
              <div key={i} style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "3/4",
                cursor: "pointer",
              }}
                onMouseEnter={e => e.currentTarget.querySelector('.card-overlay').style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.querySelector('.card-overlay').style.opacity = "0"}
              >
                <img src={card.img} alt={card.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {/* Gradient permanent bas */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,8,5,0.85) 0%, rgba(15,8,5,0.2) 50%, transparent 100%)" }} />
                {/* Texte bas */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>{card.label}</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "white", margin: 0, lineHeight: 1.2 }}>{card.desc}</p>
                </div>
                {/* Overlay hover */}
                <div className="card-overlay" style={{ position: "absolute", inset: 0, borderRadius: 16, border: "2px solid rgba(255,255,255,0.6)", opacity: 0, transition: "opacity 0.25s" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform ─────────────────────────────────────────── */}
      <section style={{ background: "white", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 72, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", marginBottom: 32, lineHeight: 1.15, whiteSpace: "pre-line", color: "rgb(5,5,5)" }}>
              {tx.platformTitle}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column", gap: 0 }}>
              {tx.platformFeatures.map((f, i) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 15, color: "rgb(61,61,61)", padding: "13px 0", borderBottom: "1px solid hsl(0,0%,91%)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgb(180,180,180)", minWidth: 20 }}>0{i + 1}</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/login">
              <button
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 8, background: "rgb(5,5,5)", color: "white", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                {tx.platformCta} <ArrowRight style={{ width: 15, height: 15 }} />
              </button>
            </Link>
          </div>
          <div>
            {/* Mockup plateforme — dashboard illustratif */}
            <div style={{ position: "relative" }}>
              <div style={{
                background: "hsl(0,0%,10%)",
                borderRadius: 16,
                padding: 24,
                boxShadow: "var(--shadow-xl)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                {/* Barre de titre du dashboard */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>
                {/* Lignes du dashboard */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "Projets actifs", val: "3", clr: "rgba(255,255,255,0.55)" },
                    { label: "Documents", val: "12", clr: "white" },
                    { label: "Photos terrain", val: "47", clr: "white" },
                  ].map(s => (
                    <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px 16px" }}>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: 26, color: s.clr, margin: 0, lineHeight: 1 }}>{s.val}</p>
                    </div>
                  ))}
                </div>
                {/* Progress bar suivi de chantier */}
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Villa, Ouagadougou Nord</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>68%</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: "68%", height: "100%", background: "linear-gradient(to right, rgba(255,255,255,0.3), white)", borderRadius: 3 }} />
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "8px 0 0" }}>Dernière mise à jour: il y a 2 jours</p>
                </div>
                {/* Liste notifications */}
                {[
                  { dot: true, text: "3 nouvelles photos · Fondation coulée", time: "14h32" },
                  { dot: false, text: "Rapport hebdomadaire disponible", time: "Hier" },
                ].map(n => (
                  <div key={n.text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.dot ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, flex: 1 }}>{n.text}</p>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section id="avis" style={{ background: "hsl(0,0%,6%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", marginBottom: 48, color: "white" }}>
            {tx.testimonialsTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {tx.testimonials.map(t => (
              <div key={t.name} style={{ background: "hsl(0,0%,10%)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[...Array(t.stars)].map((_, i) => <Star key={i} style={{ width: 14, height: 14, fill: "rgba(255,255,255,0.6)", color: "rgba(255,255,255,0.6)" }} />)}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.72, color: "rgba(255,255,255,0.7)", flex: 1, margin: 0 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.55)", flexShrink: 0 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "white", margin: "0 0 2px 0" }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>{t.origin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Missions & Valeurs ───────────────────────────────── */}
      <section style={{ background: "white", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP }}>
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(100,100,100)", marginBottom: 14, margin: "0 0 14px" }}>
              {lang === "fr" ? "Nos valeurs" : "Our values"}
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "rgb(5,5,5)", margin: "0 0 18px" }}>
              {lang === "fr" ? "Ce qui nous anime." : "What drives us."}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgb(80,80,80)", margin: 0 }}>
              {lang === "fr"
                ? "Bayiri Invest est né d'une conviction simple : la diaspora mérite un partenaire de confiance pour concrétiser ses projets au pays. Chaque décision, chaque process, chaque interaction reflète ces valeurs fondamentales."
                : "Bayiri Invest was born from a simple belief: the diaspora deserves a trusted partner to realize their projects back home. Every decision, every process, every interaction reflects these core values."}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, gap: 16, flexWrap: "wrap" }}>
            <div />
            <Link to="/nos-valeurs" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "rgb(5,5,5)", textDecoration: "none", border: "1px solid hsl(0,0%,85%)", borderRadius: 8, padding: "9px 16px" }}>
              {lang === "fr" ? "Lire nos valeurs" : "Read our values"} <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              {
                Icon: Shield,
                title: lang === "fr" ? "Intégrité" : "Integrity",
                desc: lang === "fr" ? "Chaque transaction, chaque rapport, chaque décision est guidée par l'honnêteté et la transparence, sans exception." : "Every transaction, every report, every decision is guided by honesty and transparency, without exception.",
              },
              {
                Icon: Zap,
                title: lang === "fr" ? "Efficacité" : "Efficiency",
                desc: lang === "fr" ? "Vos projets avancent. Nos agents terrain sont réactifs, nos rapports ponctuels, nos délais tenus." : "Your projects move forward. Our field agents are responsive, our reports timely, our deadlines met.",
              },
              {
                Icon: CheckCircle,
                title: lang === "fr" ? "Confiance" : "Trust",
                desc: lang === "fr" ? "Contrats sécurisés, fonds protégés, partenaires vérifiés. Vous investissez, nous veillons." : "Secure contracts, protected funds, verified partners. You invest, we watch over it.",
              },
              {
                Icon: Eye,
                title: lang === "fr" ? "Transparence" : "Transparency",
                desc: lang === "fr" ? "Accès en temps réel à l'état de votre projet. Aucune surprise, aucun frais caché." : "Real-time access to your project status. No surprises, no hidden fees.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ background: "rgb(248,248,248)", borderRadius: 20, border: "1px solid hsl(0,0%,91%)", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgb(5,5,5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 20, height: 20, color: "white" }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.25rem", color: "rgb(5,5,5)", margin: "0 0 10px", lineHeight: 1.2 }}>{title}</h3>
                  <p style={{ fontSize: 15, color: "rgb(80,80,80)", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Équipe & Partenaires ─────────────────────────────── */}
      <section id="equipe" style={{ background: "hsl(0,0%,2%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP }}>
          <div style={{ maxWidth: 640, marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 14px" }}>
              {lang === "fr" ? "L'équipe" : "The team"}
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "white", margin: "0 0 18px" }}>
              {lang === "fr" ? "Une équipe à votre service." : "A team at your service."}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>
              {lang === "fr"
                ? "Derrière chaque projet suivi, il y a des personnes engagées, formées et ancrées dans la réalité du terrain burkinabè."
                : "Behind every followed project, there are committed people, trained and rooted in the reality of the Burkinabè field."}
            </p>
            <Link to="/equipe" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "white", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "9px 16px" }}>
              {lang === "fr" ? "Voir l'équipe" : "Meet the team"} <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>

          {/* Équipe dirigeante */}
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 20px" }}>
            {lang === "fr" ? "Équipe dirigeante" : "Leadership team"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 64 }}>
            {[
              {
                initials: "MU",
                name: "Manegdo Ulrich Doamba",
                role: lang === "fr" ? "Co-fondateur & Directeur Général" : "Co-founder & CEO",
                desc: lang === "fr" ? "Expert en développement commercial et investissement immobilier au Burkina Faso. Vision stratégique, relations internationales." : "Expert in business development and real estate investment in Burkina Faso. Strategic vision, international relations.",
              },
              {
                initials: "OA",
                name: "Ouattara Abdoul Razack",
                role: lang === "fr" ? "Co-fondateur & Directeur des Opérations" : "Co-founder & COO",
                desc: lang === "fr" ? "Spécialiste en gestion de projets et coordination terrain. Coordination des agents certifiés et suivi de qualité." : "Specialist in project management and field coordination. Coordination of certified agents and quality tracking.",
              },
            ].map(person => (
              <div key={person.name} style={{ background: "rgb(26,26,26)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "32px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "white", flexShrink: 0 }}>
                  {person.initials}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem", color: "white", margin: "0 0 4px" }}>{person.name}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 12px", fontWeight: 500 }}>{person.role}</p>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{person.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Partenaires */}
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 20px" }}>
            {lang === "fr" ? "Nos partenaires" : "Our partners"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {[
              {
                label: lang === "fr" ? "Juridique" : "Legal",
                title: lang === "fr" ? "Cabinet juridique" : "Legal firm",
                desc: lang === "fr" ? "Conseil en droit immobilier et commercial. Protection de vos intérêts à chaque étape de la transaction." : "Counsel in real estate and commercial law. Protection of your interests at every stage of the transaction.",
              },
              {
                label: lang === "fr" ? "Notarial" : "Notarial",
                title: lang === "fr" ? "Étude notariale" : "Notarial office",
                desc: lang === "fr" ? "Authentification des actes fonciers et sécurisation de vos transactions. Conformité avec le droit burkinabè." : "Authentication of land deeds and securing your transactions. Compliance with Burkinabè law.",
              },
              {
                label: "BTP",
                title: lang === "fr" ? "Bureaux d'études BTP" : "Construction firms",
                desc: lang === "fr" ? "Suivi technique, contrôle qualité et réalisation de vos projets de construction. Experts certifiés sur le terrain." : "Technical monitoring, quality control and completion of your construction projects. Certified field experts.",
              },
            ].map(partner => (
              <div key={partner.title} style={{ background: "rgb(26,26,26)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{partner.label}</span>
                <div>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "white", margin: "0 0 10px" }}>{partner.title}</h4>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>{partner.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section id="contact" style={{ background: "white", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "rgb(5,5,5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Contact</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1.15, color: "rgb(5,5,5)", whiteSpace: "pre-line" }}>
              {lang === "fr" ? "Une question ?\nNous sommes là." : "A question?\nWe're here."}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgb(61,61,61)", marginBottom: 32 }}>
              {lang === "fr"
                ? "Notre équipe est disponible pour répondre à toutes vos questions sur l'investissement au Burkina Faso."
                : "Our team is available to answer all your questions about investing in Burkina Faso."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { Icon: Mail, label: lang === "fr" ? "Email" : "Email", val: "contact@bayiri-invest.com" },
                { Icon: Phone, label: "WhatsApp", val: "+226 XX XX XX XX" },
                { Icon: MapPin, label: lang === "fr" ? "Bureau" : "Office", val: "Ouagadougou, Burkina Faso" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <c.Icon style={{ width: 18, height: 18, color: "rgb(5,5,5)", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 12, color: "rgb(120,120,120)", margin: "0 0 2px", fontWeight: 500 }}>{c.label}</p>
                    <p style={{ fontSize: 14, color: "rgb(5,5,5)", fontWeight: 600, margin: 0 }}>{c.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "hsl(0,0%,97%)", border: "1px solid hsl(0,0%,90%)", borderRadius: 20, padding: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { label: lang === "fr" ? "Nom complet" : "Full name", type: "text", placeholder: lang === "fr" ? "Votre nom" : "Your name" },
                { label: "Email", type: "email", placeholder: lang === "fr" ? "votre@email.com" : "your@email.com" },
                { label: lang === "fr" ? "Votre message" : "Your message", type: "textarea", placeholder: lang === "fr" ? "Décrivez votre projet..." : "Describe your project..." },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgb(5,5,5)", marginBottom: 8 }}>{f.label}</label>
                  {f.type === "textarea"
                    ? <textarea rows={4} placeholder={f.placeholder} style={{ width: "100%", borderRadius: 8, border: "1px solid hsl(0,0%,86%)", padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-body)", color: "rgb(5,5,5)", background: "white", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                    : <input type={f.type} placeholder={f.placeholder} style={{ width: "100%", borderRadius: 8, border: "1px solid hsl(0,0%,86%)", padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-body)", color: "rgb(5,5,5)", background: "white", outline: "none", boxSizing: "border-box" }} />
                  }
                </div>
              ))}
              <button style={{ padding: "12px 24px", borderRadius: 8, background: "rgb(5,5,5)", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                {lang === "fr" ? "Envoyer le message" : "Send message"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", color: "white", paddingTop: 130, paddingBottom: 130, textAlign: "center", background: "hsl(0,0%,3%)" }}>
        {/* Photo background */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${HERO_IMG}')`, backgroundSize: "cover", backgroundPosition: "center 35%", opacity: 0.32 }} />
        {/* Radial darkening at edges */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />

        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto", paddingLeft: G, paddingRight: G }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)", letterSpacing: "-0.03em", marginBottom: 18, lineHeight: 1.06 }}>
            {tx.finalCta}
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", marginBottom: 52, lineHeight: 1.7, maxWidth: 460, margin: "0 auto 52px" }}>{tx.finalCtaSub}</p>

          {/* CTA button */}
          <div style={{ display: "inline-block", marginBottom: 48 }}>
            <Link to="/register">
              <button
                style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, padding: "18px 52px", borderRadius: 10, background: "white", color: "hsl(0,0%,5%)", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 8px 40px rgba(0,0,0,0.5)", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 50px rgba(0,0,0,0.6)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.5)"; }}>
                {tx.finalCtaBtn} <ArrowRight style={{ width: 18, height: 18 }} />
              </button>
            </Link>
          </div>

          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.01em" }}>
            {lang === "fr" ? "Inscription gratuite · Aucun engagement" : "Free sign-up · No commitment"}
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ background: "hsl(0,0%,2%)", color: "rgba(255,255,255,0.35)", paddingTop: 36, paddingBottom: 36 }}>
        <div style={{ ...WRAP, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <img src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png" alt="Bayiri Invest" style={{ height: 34, objectFit: "contain", filter: "brightness(1.5)" }} />
          <p style={{ fontSize: 13, margin: 0 }}>{tx.footer}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 13 }}>
            {[
              { to: "/dashboard", label: tx.nav.login },
              { to: "/cgu", label: "CGU" },
              { to: "/mentions-legales", label: "Mentions légales" },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ color: "inherit", textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>
                {l.label}
              </Link>
            ))}
            <button onClick={() => switchLang(lang === "fr" ? "en" : "fr")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 13, padding: 0 }}>
              {lang === "fr" ? "EN" : "FR"}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
