import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/LangContext";
import { Shield, MapPin, TrendingUp, Building2, ArrowRight, CheckCircle, Star, ChevronRight, Users, Handshake, Flag } from "lucide-react";

const HERO_IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3Ecsq627sStwKzm5HgcVNMBPKAy/hf_20261102_231909_7e626f56-7232-44de-b0c2-bcc0bc859ec0.png";

const t = {
  fr: {
    nav: { login: "Se connecter", start: "Ouvrir un compte" },
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
    nav: { login: "Log in", start: "Open an account" },
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
        <div style={{ ...WRAP, height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img
            src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png"
            alt="Bayiri Invest"
            style={{ height: 38, objectFit: "contain", filter: scrolled ? "none" : "brightness(10)" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => switchLang(lang === "fr" ? "en" : "fr")}
              style={{
                fontSize: 13, fontWeight: 500, padding: "6px 12px", borderRadius: 6,
                border: "none", cursor: "pointer",
                background: scrolled ? "hsl(var(--muted))" : "rgba(255,255,255,0.12)",
                color: scrolled ? "hsl(var(--muted-foreground))" : "rgba(255,255,255,0.85)",
                transition: "background 0.3s, color 0.3s",
              }}>
              {lang === "fr" ? "EN" : "FR"}
            </button>
            <Link to="/dashboard">
              <button style={{
                fontSize: 14, fontWeight: 500, padding: "8px 18px", borderRadius: 8,
                border: `1px solid ${scrolled ? "hsl(var(--border))" : "rgba(255,255,255,0.3)"}`,
                background: "transparent",
                color: scrolled ? "hsl(var(--foreground))" : "rgba(255,255,255,0.9)",
                cursor: "pointer", transition: "all 0.3s",
              }}>
                {tx.nav.login}
              </button>
            </Link>
            <Link to="/onboarding">
              <button style={{
                fontSize: 14, fontWeight: 600, padding: "8px 20px", borderRadius: 8,
                background: "hsl(38,65%,52%)", color: "hsl(15,25%,12%)",
                border: "none", cursor: "pointer", transition: "opacity 0.15s",
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
        {/* Gradient directionnel — gauche opaque, droite transparente */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, hsl(15,22%,7%) 40%, rgba(15,8,5,0.55) 100%)" }} />
        {/* Gradient bas pour transition douce */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, hsl(15,22%,7%), transparent)" }} />

        {/* Contenu */}
        <div style={{ position: "relative", ...WRAP, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 160, paddingBottom: 80 }}>
          {/* Badge Trustpilot */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => <Star key={i} style={{ width: 14, height: 14, fill: "#00b67a", color: "#00b67a" }} />)}
            </div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500, letterSpacing: "0.01em" }}>
              {tx.hero.trustpilot}
            </span>
          </div>

          {/* Titre massif — style Qonto */}
          <h1 style={{
            fontFamily: "var(--font-heading)", fontWeight: 400,
            fontSize: "clamp(3.5rem, 7.5vw, 6.5rem)",
            lineHeight: 1.0, letterSpacing: "-0.025em",
            margin: "0 0 28px 0", maxWidth: 760,
          }}>
            {tx.hero.line1}<br />
            <span style={{ color: "hsl(38,72%,60%)" }}>{tx.hero.line2}</span><br />
            {tx.hero.line3}
          </h1>

          <p style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "rgba(255,255,255,0.58)", maxWidth: 480, lineHeight: 1.7, margin: "0 0 44px 0" }}>
            {tx.hero.subtitle}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link to="/onboarding">
              <button
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 8, background: "hsl(38,65%,52%)", color: "hsl(15,25%,12%)", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                {tx.hero.cta} <ArrowRight style={{ width: 17, height: 17 }} />
              </button>
            </Link>
            <a href="#comment">
              <button
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.88)", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
                {tx.hero.ctaSub}
              </button>
            </a>
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

      {/* ── Features ─────────────────────────────────────────── */}
      <section style={{ background: "hsl(var(--background))", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", marginBottom: 64, maxWidth: 560, lineHeight: 1.12, whiteSpace: "pre-line" }}>
            {tx.featuresTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {tx.features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border)/0.5)", borderRadius: 14, padding: "32px 28px", boxShadow: "var(--shadow-sm)", transition: "box-shadow 0.2s, transform 0.2s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "hsl(var(--primary)/0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Icon style={{ width: 21, height: 21, color: "hsl(var(--primary))" }} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.15rem", marginBottom: 10, color: "hsl(var(--foreground))", lineHeight: 1.2 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.72, color: "hsl(var(--muted-foreground))", margin: 0 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="comment" style={{ background: "hsl(var(--muted))", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", marginBottom: 64, lineHeight: 1.12, whiteSpace: "pre-line" }}>
            {tx.howTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
            {tx.steps.map((step, i) => (
              <div key={step.num}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "hsl(var(--primary))", letterSpacing: "0.1em" }}>{step.num}</span>
                  {i < tx.steps.length - 1 && <div style={{ flex: 1, height: 1, background: "hsl(var(--border))" }} />}
                </div>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <ChevronRight style={{ width: 18, height: 18 }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.1rem", color: "hsl(var(--foreground))", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "hsl(var(--muted-foreground))", margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform ─────────────────────────────────────────── */}
      <section style={{ background: "hsl(var(--background))", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 72, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", marginBottom: 36, lineHeight: 1.12, whiteSpace: "pre-line" }}>
              {tx.platformTitle}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column", gap: 14 }}>
              {tx.platformFeatures.map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "hsl(var(--foreground))" }}>
                  <CheckCircle style={{ width: 17, height: 17, color: "hsl(var(--secondary))", flexShrink: 0 }} />
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
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=620&fit=crop"
              alt="Plateforme Bayiri Invest"
              style={{ width: "100%", borderRadius: 16, boxShadow: "var(--shadow-xl)", border: "1px solid hsl(var(--border)/0.4)", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section style={{ background: "hsl(var(--muted))", paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ ...WRAP }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", marginBottom: 64 }}>
            {tx.testimonialsTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {tx.testimonials.map(t => (
              <div key={t.name} style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border)/0.5)", borderRadius: 14, padding: "32px 28px", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[...Array(t.stars)].map((_, i) => <Star key={i} style={{ width: 14, height: 14, fill: "hsl(38,72%,52%)", color: "hsl(38,72%,52%)" }} />)}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.72, color: "hsl(var(--foreground))", fontStyle: "italic", flex: 1, margin: 0 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "hsl(var(--primary)/0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "hsl(var(--primary))", flexShrink: 0 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "hsl(var(--foreground))", margin: "0 0 2px 0" }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", margin: 0 }}>{t.origin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section style={{ background: "hsl(15,22%,8%)", color: "white", paddingTop: 120, paddingBottom: 120, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, hsl(38,65%,42%,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.025em", marginBottom: 20, lineHeight: 1.05 }}>
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
