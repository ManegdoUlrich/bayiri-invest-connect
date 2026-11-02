import { Link } from "react-router-dom";
import { useLang } from "@/lib/LangContext";
import { Shield, MapPin, TrendingUp, Building2, ArrowRight, CheckCircle, Star, ChevronRight } from "lucide-react";

const t = {
  fr: {
    nav: { login: "Se connecter", start: "Ouvrir un compte" },
    hero: {
      line1: "Investissez",
      line2: "au pays",
      line3: "en confiance.",
      subtitle: "Bayiri Invest accompagne la diaspora africaine dans ses projets immobiliers et commerciaux. Agents certifiés sur le terrain, suivi temps réel, contrats sécurisés.",
      cta: "Démarrer mon projet",
      trust: "4,8 sur 5",
      trustLabel: "Trustpilot",
    },
    trust: [
      { value: "500+", label: "Clients accompagnés" },
      { value: "3", label: "Villes couvvertes" },
      { value: "98%", label: "Satisfaction client" },
      { value: "8 ans", label: "D'expérience terrain" },
    ],
    featuresTitle: "Tout ce dont vous avez besoin, au même endroit.",
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
      line1: "Invest",
      line2: "back home",
      line3: "with confidence.",
      subtitle: "Bayiri Invest guides the African diaspora through real estate and commercial projects. Certified local agents, real-time tracking, secure contracts.",
      cta: "Start my project",
      trust: "4.8 out of 5",
      trustLabel: "Trustpilot",
    },
    trust: [
      { value: "500+", label: "Clients supported" },
      { value: "3", label: "Cities covered" },
      { value: "98%", label: "Client satisfaction" },
      { value: "8 yrs", label: "Field experience" },
    ],
    featuresTitle: "Everything you need, in one place.",
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

// Styles as constants to keep JSX clean
const S = {
  btnPrimary: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "12px 24px", borderRadius: "8px",
    background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))",
    fontSize: "14px", fontWeight: 600, cursor: "pointer", border: "none",
    transition: "opacity 0.15s",
  },
  btnGold: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "12px 24px", borderRadius: "8px",
    background: "hsl(38,65%,52%)", color: "hsl(15,25%,12%)",
    fontSize: "14px", fontWeight: 600, cursor: "pointer", border: "none",
    transition: "opacity 0.15s",
  },
  btnGhost: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "12px 24px", borderRadius: "8px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "rgba(255,255,255,0.85)",
    fontSize: "14px", fontWeight: 600, cursor: "pointer",
    transition: "background 0.15s",
  },
};

export default function Landing() {
  const { lang, setLang: switchLang } = useLang();
  const tx = t[lang];

  return (
    <div style={{ background: "hsl(var(--background))", color: "hsl(var(--foreground))", fontFamily: "var(--font-body)" }}>

      {/* ── Navbar ───────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "hsla(var(--background)/0.88)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid hsl(var(--border)/0.6)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png" alt="Bayiri Invest" style={{ height: 40, objectFit: "contain" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => switchLang(lang === "fr" ? "en" : "fr")}
              style={{ fontSize: 13, fontWeight: 500, padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
              {lang === "fr" ? "EN" : "FR"}
            </button>
            <Link to="/dashboard">
              <button style={{ fontSize: 14, fontWeight: 500, padding: "8px 16px", borderRadius: 8, border: "1px solid hsl(var(--border))", background: "transparent", color: "hsl(var(--foreground))", cursor: "pointer" }}>
                {tx.nav.login}
              </button>
            </Link>
            <Link to="/onboarding">
              <button style={{ ...S.btnPrimary, padding: "8px 20px" }}>
                {tx.nav.start}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "hsl(15,22%,9%)", color: "white", minHeight: "90vh", display: "flex", flexDirection: "column" }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=1600&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center right",
          opacity: 0.18,
        }} />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, hsl(15,22%,8%) 45%, transparent 100%)" }} />

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "80px 24px 60px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Trustpilot badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => <Star key={i} style={{ width: 14, height: 14, fill: "#00b67a", color: "#00b67a" }} />)}
            </div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              {tx.hero.trust} · {tx.hero.trustLabel}
            </span>
          </div>

          {/* Big title — Qonto style: each phrase on its own line */}
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 32, maxWidth: 700 }}>
            {tx.hero.line1}<br />
            <span style={{ color: "hsl(38,72%,62%)" }}>{tx.hero.line2}</span><br />
            {tx.hero.line3}
          </h1>

          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.62)", maxWidth: 520, lineHeight: 1.65, marginBottom: 40 }}>
            {tx.hero.subtitle}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link to="/onboarding">
              <button style={{ ...S.btnGold, padding: "14px 32px", fontSize: 15 }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                {tx.hero.cta} <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </Link>
            <a href="#comment">
              <button style={{ ...S.btnGhost, padding: "14px 32px", fontSize: 15 }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                Comment ça marche
              </button>
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.25)", backdropFilter: "blur(8px)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px 32px", textAlign: "center" }}>
            {tx.trust.map(s => (
              <div key={s.label}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 400, color: "hsl(38,72%,62%)", lineHeight: 1.1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section style={{ background: "hsl(var(--background))", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.015em", marginBottom: 64, maxWidth: 600, lineHeight: 1.15 }}>
            {tx.featuresTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {tx.features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border)/0.5)", borderRadius: 12, padding: "32px 28px", boxShadow: "var(--shadow-sm)", transition: "box-shadow 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "hsl(var(--primary)/0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Icon style={{ width: 22, height: 22, color: "hsl(var(--primary))" }} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.2rem", marginBottom: 10, color: "hsl(var(--foreground))" }}>{f.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "hsl(var(--muted-foreground))" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="comment" style={{ background: "hsl(var(--muted))", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.015em", marginBottom: 64, lineHeight: 1.15, whiteSpace: "pre-line" }}>
            {tx.howTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {tx.steps.map((step, i) => (
              <div key={step.num} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "hsl(var(--primary))", letterSpacing: "0.08em" }}>{step.num}</span>
                  {i < tx.steps.length - 1 && <div style={{ flex: 1, height: 1, background: "hsl(var(--border))" }} />}
                </div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight style={{ width: 18, height: 18 }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "1.1rem", color: "hsl(var(--foreground))" }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "hsl(var(--muted-foreground))" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform ─────────────────────────────────────────── */}
      <section style={{ background: "hsl(var(--background))", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.015em", marginBottom: 40, lineHeight: 1.15, whiteSpace: "pre-line" }}>
              {tx.platformTitle}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column", gap: 16 }}>
              {tx.platformFeatures.map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "hsl(var(--foreground))" }}>
                  <CheckCircle style={{ width: 18, height: 18, color: "hsl(var(--secondary))", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/dashboard">
              <button style={{ ...S.btnPrimary }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                {tx.platformCta} <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </Link>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=560&fit=crop"
              alt="Dashboard"
              style={{ width: "100%", borderRadius: 16, boxShadow: "var(--shadow-xl)", border: "1px solid hsl(var(--border)/0.4)" }}
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section style={{ background: "hsl(var(--muted))", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.015em", marginBottom: 64 }}>
            {tx.testimonialsTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {tx.testimonials.map(t => (
              <div key={t.name} style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border)/0.5)", borderRadius: 12, padding: "32px 28px", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[...Array(t.stars)].map((_, i) => <Star key={i} style={{ width: 14, height: 14, fill: "hsl(38,75%,52%)", color: "hsl(38,75%,52%)" }} />)}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "hsl(var(--foreground))", fontStyle: "italic", flex: 1 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "hsl(var(--primary)/0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: "hsl(var(--primary))", flexShrink: 0 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "hsl(var(--foreground))" }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{t.origin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section style={{ background: "hsl(15,22%,9%)", color: "white", padding: "96px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.1 }}>
            {tx.finalCta}
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 40, lineHeight: 1.65 }}>{tx.finalCtaSub}</p>
          <Link to="/onboarding">
            <button style={{ ...S.btnGold, padding: "16px 40px", fontSize: 16 }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              {tx.finalCtaBtn} <ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ background: "hsl(15,20%,7%)", color: "rgba(255,255,255,0.4)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <img src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png" alt="Bayiri Invest" style={{ height: 36, objectFit: "contain", filter: "brightness(1.6)" }} />
          <p style={{ fontSize: 13 }}>{tx.footer}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", fontSize: 13 }}>
            <Link to="/dashboard" style={{ color: "inherit", textDecoration: "none" }} onMouseEnter={e => e.target.style.color = "white"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>{tx.nav.login}</Link>
            <Link to="/cgu" style={{ color: "inherit", textDecoration: "none" }} onMouseEnter={e => e.target.style.color = "white"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>CGU</Link>
            <Link to="/mentions-legales" style={{ color: "inherit", textDecoration: "none" }} onMouseEnter={e => e.target.style.color = "white"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>Mentions légales</Link>
            <button onClick={() => switchLang(lang === "fr" ? "en" : "fr")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 13, padding: 0 }}>
              {lang === "fr" ? "EN" : "FR"}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
