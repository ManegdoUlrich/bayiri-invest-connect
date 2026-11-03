import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/LangContext";
import { Shield, MapPin, TrendingUp, Building2, ArrowRight, CheckCircle, Star, ChevronRight, Users, Handshake, Flag } from "lucide-react";

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
    featuresTitle: "Tout ce dont vous avez besoin,\nau même endroit.",
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
      { num: "03", title: "Suivez en temps réel", desc: "Rapports, photos, documents — tout est dans votre espace." },
      { num: "04", title: "Investissement sécurisé", desc: "Contrats électroniques et paiements gérés en toute sécurité." },
    ],
    platformTitle: "La plateforme qui\ntravaille pour vous.",
    platformFeatures: [
      "Tableau de bord par projet",
      "Photos terrain géolocalisées",
      "Signature électronique",
      "Suivi des paiements",
      "Notifications instantanées",
    ],
    platformCta: "Voir la plateforme",
    testimonialsTitle: "Ils nous font confiance.",
    testimonials: [
      { name: "Kofi Mensah", origin: "🇬🇧 Londres → Ouagadougou", text: "J'ai pu construire ma villa sans jamais me déplacer. Les rapports photo hebdomadaires m'ont donné une tranquillité d'esprit totale.", stars: 5 },
      { name: "Aminata Diallo", origin: "🇫🇷 Paris → Bobo-Dioulasso", text: "Professionnalisme et transparence à chaque étape. Leur équipe a géré l'achat de mon terrain et toutes les démarches administratives.", stars: 5 },
      { name: "Jean-Baptiste Nkomo", origin: "🇧🇪 Bruxelles → Koudougou", text: "Avec Bayiri Invest, j'ai enfin trouvé un partenaire de confiance. Mon commerce tourne très bien depuis 6 mois.", stars: 5 },
    ],
    finalCta: "Prêt à investir ?",
    finalCtaSub: "Rejoignez des centaines de membres de la diaspora qui font confiance à Bayiri Invest.",
    finalCtaBtn: "Démarrer gratuitement",
    footer: "© 2026 Bayiri Invest — Tous droits réservés.",
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
    featuresTitle: "Everything you need,\nin one place.",
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
      { num: "03", title: "Track in real time", desc: "Reports, photos, documents — all in your personal space." },
      { num: "04", title: "Secured investment", desc: "Electronic contracts and payments managed securely." },
    ],
    platformTitle: "The platform that\nworks for you.",
    platformFeatures: [
      "Per-project dashboard",
      "Geolocated field photos",
      "Electronic signing",
      "Payment tracking",
      "Instant notifications",
    ],
    platformCta: "See the platform",
    testimonialsTitle: "They trust us.",
    testimonials: [
      { name: "Kofi Mensah", origin: "🇬🇧 London → Ouagadougou", text: "I built my villa without ever traveling. The weekly photo reports gave me total peace of mind.", stars: 5 },
      { name: "Aminata Diallo", origin: "🇫🇷 Paris → Bobo-Dioulasso", text: "Professionalism and transparency at every step. Their team handled the land purchase and all admin.", stars: 5 },
      { name: "Jean-Baptiste Nkomo", origin: "🇧🇪 Brussels → Koudougou", text: "I finally found a trustworthy partner. My business has been running great for 6 months.", stars: 5 },
    ],
    finalCta: "Ready to invest?",
    finalCtaSub: "Join hundreds of diaspora members who trust Bayiri Invest.",
    finalCtaBtn: "Get started for free",
    footer: "© 2026 Bayiri Invest — All rights reserved.",
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
            <Link to="/onboarding">
              <button style={{
                fontSize: 14, fontWeight: 600, padding: "8px 20px", borderRadius: 8,
                background: "hsl(38,65%,52%)", color: "hsl(15,25%,12%)",
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
      <section style={{ position: "relative", overflow: "hidden", background: "hsl(15,22%,7%)", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Photo de fond — vue aérienne Ouagadougou */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${HERO_IMG}')`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.28,
        }} />
        {/* Gradient directionnel — 50% gauche opaque, droite transparente */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, hsl(15,22%,7%) 0%, hsl(15,22%,7%) 45%, rgba(15,8,5,0.3) 100%)" }} />
        {/* Gradient bas pour transition douce */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, hsl(15,22%,7%), transparent)" }} />

        {/* Contenu — grille 2 colonnes : texte à gauche, visuel à droite */}
        <div style={{
          position: "relative",
          flex: 1,
          paddingLeft: G, paddingRight: G,
          paddingTop: 140, paddingBottom: 80,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: 40,
        }}>
          {/* Colonne gauche — tout le contenu textuel */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {/* Badge Trustpilot */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, i) => <Star key={i} style={{ width: 13, height: 13, fill: "#00b67a", color: "#00b67a" }} />)}
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500, letterSpacing: "0.01em" }}>
                {tx.hero.trustpilot}
              </span>
            </div>

            {/* Titre — 2 lignes */}
            <h1 style={{
              fontFamily: "var(--font-heading)", fontWeight: 400,
              fontSize: "clamp(2.4rem, 3.8vw, 3.8rem)",
              lineHeight: 1.08, letterSpacing: "-0.02em",
              margin: "0 0 22px 0", textAlign: "left",
            }}>
              {tx.hero.line1} <span style={{ color: "hsl(38,72%,60%)" }}>{tx.hero.line2}</span><br />
              {tx.hero.line3}
            </h1>

            <p style={{ fontSize: "clamp(14px, 1.25vw, 16px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 38px 0", textAlign: "left" }}>
              {tx.hero.subtitle}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link to="/onboarding">
                <button
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 8, background: "hsl(38,65%,52%)", color: "hsl(15,25%,12%)", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}
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

          {/* Colonne droite — vide, laisse le visuel de fond apparaître */}
          <div />
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
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 17, height: 17, color: "hsl(38,65%,58%)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.92)", margin: "0 0 2px 0", lineHeight: 1.3 }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features — bento sombre style Qonto ─────────────── */}
      <section id="solutions" style={{ background: "hsl(15,20%,6%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ paddingLeft: G, paddingRight: G, maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)", letterSpacing: "-0.02em", color: "white", lineHeight: 1.12, margin: 0, whiteSpace: "pre-line", maxWidth: 480 }}>
              {tx.featuresTitle}
            </h2>
            <Link to="/onboarding" style={{ textDecoration: "none", flexShrink: 0 }}>
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
            <div style={{ gridColumn: "1", gridRow: "1", background: "hsl(15,18%,11%)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 18, minHeight: 220 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPin style={{ width: 19, height: 19, color: "hsl(38,65%,58%)" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.2rem", color: "white", margin: "0 0 10px", lineHeight: 1.2 }}>{tx.features[0].title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{tx.features[0].desc}</p>
              </div>
            </div>

            {/* Carte 2 — Suivi chantier — col 2-3, rows 1-2 (grande carte avec mockup) */}
            <div style={{ gridColumn: "2 / 4", gridRow: "1 / 3", background: "hsl(153,50%,10%)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "36px 32px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ marginBottom: "auto" }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Building2 style={{ width: 19, height: 19, color: "hsl(153,52%,48%)" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.4rem", color: "white", margin: "0 0 10px", lineHeight: 1.15 }}>{tx.features[1].title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 380 }}>{tx.features[1].desc}</p>
              </div>
              {/* Mini mockup chantier */}
              <div style={{ background: "hsl(153,45%,8%)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-mono)" }}>bayiri — suivi de chantier</div>
                </div>
                {/* Photo terrain simulée */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
                  {["📸 Fondation", "📸 Murs R+1", "📸 Toiture"].map((label, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                      <p style={{ fontSize: 18, margin: "0 0 4px" }}>📷</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0 }}>{label.split(" ")[1]}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Villa Ouagadougou Nord</span>
                    <span style={{ fontSize: 12, color: "hsl(38,65%,58%)", fontWeight: 700 }}>68%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: "68%", height: "100%", background: "linear-gradient(to right, hsl(38,60%,42%), hsl(38,70%,58%))", borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Carte 3 — Sécurité juridique — col 1, row 2 */}
            <div style={{ gridColumn: "1", gridRow: "2", background: "hsl(15,18%,11%)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield style={{ width: 19, height: 19, color: "hsl(38,65%,58%)" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.2rem", color: "white", margin: "0 0 10px", lineHeight: 1.2 }}>{tx.features[3].title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{tx.features[3].desc}</p>
              </div>
            </div>

          </div>

          {/* Carte large — Opportunités — pleine largeur en bas */}
          <div style={{ marginTop: 12, background: "linear-gradient(135deg, hsl(12,62%,18%) 0%, hsl(15,20%,10%) 100%)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <TrendingUp style={{ width: 19, height: 19, color: "hsl(12,68%,60%)" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.4rem", color: "white", margin: "0 0 10px", lineHeight: 1.15 }}>{tx.features[2].title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0, maxWidth: 480 }}>{tx.features[2].desc}</p>
            </div>
            {/* Stats visuelles */}
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              {[
                { val: "3×", label: lang === "fr" ? "Rendement\nmoyen" : "Average\nyield" },
                { val: "+120", label: lang === "fr" ? "Projets\nréalisés" : "Completed\nprojects" },
                { val: "5 pays", label: lang === "fr" ? "Diaspora\nreprésentée" : "Diaspora\ncountries" },
              ].map(s => (
                <div key={s.val} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "18px 20px", textAlign: "center", minWidth: 90 }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.7rem", color: "hsl(12,68%,62%)", margin: "0 0 6px", lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0, whiteSpace: "pre-line", lineHeight: 1.4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="comment" style={{ background: "hsl(15,18%,9%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", marginBottom: 56, lineHeight: 1.15, whiteSpace: "pre-line", color: "white" }}>
            {tx.howTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
            {tx.steps.map((step, i) => (
              <div key={step.num}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "hsl(38,65%,52%)", letterSpacing: "0.1em" }}>{step.num}</span>
                  {i < tx.steps.length - 1 && <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />}
                </div>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "hsl(38,65%,52%)", color: "hsl(15,25%,10%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <ChevronRight style={{ width: 18, height: 18 }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.1rem", color: "white", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases — 3 grandes cartes photo style Qonto ──── */}
      <section style={{ background: "hsl(15,22%,7%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ paddingLeft: G, paddingRight: G }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, maxWidth: 1200, margin: "0 auto 48px" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", color: "white", lineHeight: 1.15, margin: 0 }}>
              {lang === "fr" ? "Vos projets,\nconcrétisés." : "Your projects,\nrealized."}
            </h2>
            <Link to="/onboarding" style={{ textDecoration: "none", flexShrink: 0 }}>
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
                  <p style={{ fontSize: 12, fontWeight: 600, color: "hsl(38,65%,58%)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>{card.label}</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "white", margin: 0, lineHeight: 1.2 }}>{card.desc}</p>
                </div>
                {/* Overlay hover */}
                <div className="card-overlay" style={{ position: "absolute", inset: 0, background: "rgba(38,65%,42%,0.08)", borderRadius: 16, border: "2px solid hsl(38,65%,52%)", opacity: 0, transition: "opacity 0.25s" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform ─────────────────────────────────────────── */}
      <section style={{ background: "hsl(15,20%,6%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 72, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", marginBottom: 32, lineHeight: 1.15, whiteSpace: "pre-line", color: "white" }}>
              {tx.platformTitle}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column", gap: 14 }}>
              {tx.platformFeatures.map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "rgba(255,255,255,0.75)" }}>
                  <CheckCircle style={{ width: 17, height: 17, color: "hsl(153,52%,48%)", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/dashboard">
              <button
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 8, background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}
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
                background: "hsl(153,50%,14%)",
                borderRadius: 16,
                padding: 24,
                boxShadow: "var(--shadow-xl)",
                border: "1px solid hsl(153,30%,20%)",
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
                    { label: "Projets actifs", val: "3", clr: "hsl(38,65%,58%)" },
                    { label: "Documents", val: "12", clr: "hsl(153,42%,42%)" },
                    { label: "Photos terrain", val: "47", clr: "hsl(12,62%,48%)" },
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
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Villa — Ouagadougou Nord</span>
                    <span style={{ fontSize: 12, color: "hsl(38,65%,58%)", fontWeight: 700 }}>68%</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: "68%", height: "100%", background: "linear-gradient(to right, hsl(38,65%,42%), hsl(38,72%,58%))", borderRadius: 3 }} />
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "8px 0 0" }}>Dernière mise à jour: il y a 2 jours</p>
                </div>
                {/* Liste notifications */}
                {[
                  { icon: "📸", text: "3 nouvelles photos — Fondation coulée", time: "14h32" },
                  { icon: "📋", text: "Rapport hebdomadaire disponible", time: "Hier" },
                ].map(n => (
                  <div key={n.text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 16 }}>{n.icon}</span>
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
      <section id="avis" style={{ background: "hsl(15,18%,9%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", marginBottom: 48, color: "white" }}>
            {tx.testimonialsTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {tx.testimonials.map(t => (
              <div key={t.name} style={{ background: "hsl(15,18%,11%)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[...Array(t.stars)].map((_, i) => <Star key={i} style={{ width: 14, height: 14, fill: "hsl(38,72%,52%)", color: "hsl(38,72%,52%)" }} />)}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.72, color: "rgba(255,255,255,0.7)", fontStyle: "italic", flex: 1, margin: 0 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "hsl(38,65%,58%)", flexShrink: 0 }}>
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

      {/* ── Contact ──────────────────────────────────────────── */}
      <section id="contact" style={{ background: "hsl(15,20%,6%)", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "hsl(38,65%,52%)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Contact</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1.15, color: "white", whiteSpace: "pre-line" }}>
              {lang === "fr" ? "Une question ?\nNous sommes là." : "A question?\nWe're here."}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.45)", marginBottom: 32 }}>
              {lang === "fr"
                ? "Notre équipe est disponible pour répondre à toutes vos questions sur l'investissement au Burkina Faso."
                : "Our team is available to answer all your questions about investing in Burkina Faso."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "✉️", label: lang === "fr" ? "Email" : "Email", val: "contact@bayiri-invest.com" },
                { icon: "📱", label: "WhatsApp", val: "+226 XX XX XX XX" },
                { icon: "🏢", label: lang === "fr" ? "Bureau" : "Office", val: "Ouagadougou, Burkina Faso" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 2px", fontWeight: 500 }}>{c.label}</p>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 600, margin: 0 }}>{c.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "hsl(15,18%,11%)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { label: lang === "fr" ? "Nom complet" : "Full name", type: "text", placeholder: lang === "fr" ? "Votre nom" : "Your name" },
                { label: "Email", type: "email", placeholder: lang === "fr" ? "votre@email.com" : "your@email.com" },
                { label: lang === "fr" ? "Votre message" : "Your message", type: "textarea", placeholder: lang === "fr" ? "Décrivez votre projet..." : "Describe your project..." },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>{f.label}</label>
                  {f.type === "textarea"
                    ? <textarea rows={4} placeholder={f.placeholder} style={{ width: "100%", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-body)", color: "white", background: "rgba(255,255,255,0.05)", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                    : <input type={f.type} placeholder={f.placeholder} style={{ width: "100%", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-body)", color: "white", background: "rgba(255,255,255,0.05)", outline: "none", boxSizing: "border-box" }} />
                  }
                </div>
              ))}
              <button style={{ padding: "12px 24px", borderRadius: 8, background: "hsl(38,65%,52%)", color: "hsl(15,25%,10%)", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                {lang === "fr" ? "Envoyer le message" : "Send message"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section style={{ background: "hsl(15,22%,8%)", color: "white", paddingTop: 120, paddingBottom: 120, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, hsl(38,65%,42%,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2rem, 3.5vw, 3.2rem)", letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.1 }}>
            {tx.finalCta}
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", marginBottom: 44, lineHeight: 1.65 }}>{tx.finalCtaSub}</p>
          <Link to="/onboarding">
            <button
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 44px", borderRadius: 8, background: "hsl(38,65%,52%)", color: "hsl(15,25%,12%)", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              {tx.finalCtaBtn} <ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ background: "hsl(15,18%,5%)", color: "rgba(255,255,255,0.35)", paddingTop: 36, paddingBottom: 36 }}>
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
