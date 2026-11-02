import { Link } from "react-router-dom";
import { useLang } from "@/lib/LangContext";
import { Shield, MapPin, TrendingUp, Star, ArrowRight, CheckCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const t = {
  fr: {
    nav: { solutions: "Solutions", how: "Comment ça marche", reviews: "Avis clients", login: "Se connecter", start: "Commencer" },
    hero: {
      badge: "🌍 Vos projets, sécurisés de partout dans le monde",
      title1: "Investissez",
      title2: "en toute confiance",
      subtitle: "Bayiri Invest accompagne la diaspora dans ses projets immobiliers et commerciaux. Agents locaux certifiés, suivi en temps réel, contrats sécurisés.",
      cta1: "Démarrer mon projet",
      cta2: "Comment ça marche",
    },
    stats: [
      { value: "500+", label: "Clients accompagnés" },
      { value: "3", label: "Villes d'intervention" },
      { value: "98%", label: "Taux de satisfaction" },
      { value: "8 ans", label: "D'expérience" },
    ],
    solutionsSection: {
      badge: "Nos services",
      title: "Des solutions complètes pour votre investissement",
      subtitle: "De la recherche de terrain à la remise des clés, nous gérons chaque étape de votre projet depuis l'étranger.",
    },
    solutions: [
      { title: "Représentation locale", desc: "Un agent de confiance sur le terrain pour défendre vos intérêts, coordonner les artisans et surveiller l'avancement de vos projets." },
      { title: "Construction & Immobilier", desc: "Supervision de vos chantiers : sélection des prestataires, suivi de l'avancement et reporting photo hebdomadaire en temps réel." },
      { title: "Investissement & Commerce", desc: "Identification d'opportunités commerciales, étude de faisabilité et accompagnement dans la création ou reprise d'activités." },
      { title: "Sécurisation juridique", desc: "Vérification des titres fonciers, accompagnement administratif et contrats électroniques sécurisés pour protéger votre investissement." },
    ],
    howSection: {
      badge: "Processus simple",
      title: "Comment ça marche ?",
      subtitle: "4 étapes pour sécuriser votre investissement depuis n'importe où dans le monde.",
    },
    steps: [
      { num: "01", title: "Inscription gratuite", desc: "Créez votre espace en 2 minutes et décrivez votre projet d'investissement." },
      { num: "02", title: "Affectation d'un agent", desc: "Nous vous assignons un agent local certifié dans votre pays cible." },
      { num: "03", title: "Suivi en temps réel", desc: "Accédez aux rapports, photos géolocalisées et mises à jour depuis votre tableau de bord." },
      { num: "04", title: "Investissement sécurisé", desc: "Signez vos contrats électroniquement et gérez vos paiements en toute sécurité." },
    ],
    platform: {
      title: "Une plateforme puissante à votre service",
      features: [
        "Tableau de bord personnalisé par projet",
        "Photos terrain géolocalisées en temps réel",
        "Signature électronique des contrats",
        "Suivi des paiements et des échéances",
        "Notifications et alertes instantanées",
      ],
      cta: "Accéder à la plateforme",
    },
    reviewsSection: {
      badge: "Témoignages",
      title: "Ce que disent nos clients",
      subtitle: "Des centaines de clients nous font déjà confiance pour leurs projets.",
    },
    testimonials: [
      { name: "Kofi Mensah", country: "🇬🇧 Londres → Ouagadougou", text: "Grâce à Bayiri Invest, j'ai pu construire ma villa sans jamais me déplacer. Les rapports photo hebdomadaires et le suivi en temps réel m'ont donné une tranquillité d'esprit totale.", stars: 5 },
      { name: "Aminata Diallo", country: "🇫🇷 Paris → Bobo-Dioulasso", text: "Leur équipe a géré l'achat de mon terrain et la totalité des démarches administratives. Professionnalisme et transparence à chaque étape. Je recommande vivement.", stars: 5 },
      { name: "Jean-Baptiste Nkomo", country: "🇧🇪 Bruxelles → Koudougou", text: "J'avais eu de mauvaises expériences par le passé. Avec Bayiri Invest, j'ai enfin trouvé un partenaire de confiance. Mon commerce tourne très bien depuis 6 mois.", stars: 5 },
      { name: "Fatou Camara", country: "🇺🇸 New York → Ouahigouya", text: "La plateforme est excellente. Je vois les photos du chantier en temps réel et je signe mes contrats en ligne. Révolutionnaire !", stars: 5 },
    ],
    cta: {
      title: "Prêt à sécuriser votre investissement ?",
      subtitle: "Rejoignez des centaines de clients qui font confiance à Bayiri Invest.",
      cta1: "Démarrer gratuitement",
      cta2: "Accéder à mon espace",
    },
    footer: "© 2026 Bayiri Invest — Tous droits réservés.",
  },
  en: {
    nav: { solutions: "Solutions", how: "How it works", reviews: "Reviews", login: "Log in", start: "Get started" },
    hero: {
      badge: "🌍 Your projects, secured anywhere in the world",
      title1: "Invest",
      title2: "with confidence",
      subtitle: "Bayiri Invest supports the diaspora in real estate and commercial projects. Certified local agents, real-time tracking, secure contracts.",
      cta1: "Start my project",
      cta2: "How it works",
    },
    stats: [
      { value: "500+", label: "Clients supported" },
      { value: "3", label: "Cities" },
      { value: "98%", label: "Satisfaction rate" },
      { value: "8 yrs", label: "Of experience" },
    ],
    solutionsSection: {
      badge: "Our services",
      title: "Complete solutions for your investment",
      subtitle: "From land search to key handover, we manage every step of your project from abroad.",
    },
    solutions: [
      { title: "Local representation", desc: "A trusted on-the-ground agent to defend your interests, coordinate contractors and monitor project progress." },
      { title: "Construction & Real Estate", desc: "Full site supervision: contractor selection, progress tracking and weekly photo reporting in real time." },
      { title: "Investment & Commerce", desc: "Identification of commercial opportunities, feasibility studies and support in creating or acquiring businesses." },
      { title: "Legal security", desc: "Land title verification, administrative support and secure electronic contracts to protect your investment." },
    ],
    howSection: {
      badge: "Simple process",
      title: "How it works?",
      subtitle: "4 steps to secure your investment from anywhere in the world.",
    },
    steps: [
      { num: "01", title: "Free registration", desc: "Create your account in 2 minutes and describe your investment project." },
      { num: "02", title: "Agent assignment", desc: "We assign a certified local agent in your target country." },
      { num: "03", title: "Real-time tracking", desc: "Access reports, geolocated photos and updates from your dashboard." },
      { num: "04", title: "Secured investment", desc: "Sign contracts electronically and manage your payments securely." },
    ],
    platform: {
      title: "A powerful platform at your service",
      features: [
        "Personalized dashboard per project",
        "Geolocated field photos in real time",
        "Electronic contract signing",
        "Payment and deadline tracking",
        "Instant notifications and alerts",
      ],
      cta: "Access the platform",
    },
    reviewsSection: {
      badge: "Testimonials",
      title: "What our clients say",
      subtitle: "Hundreds of clients already trust us with their projects.",
    },
    testimonials: [
      { name: "Kofi Mensah", country: "🇬🇧 London → Ouagadougou", text: "Thanks to Bayiri Invest, I was able to build my villa without ever traveling. The weekly photo reports and real-time tracking gave me total peace of mind.", stars: 5 },
      { name: "Aminata Diallo", country: "🇫🇷 Paris → Bobo-Dioulasso", text: "Their team handled the purchase of my land and all the administrative steps. Professionalism and transparency every step of the way. Highly recommend.", stars: 5 },
      { name: "Jean-Baptiste Nkomo", country: "🇧🇪 Brussels → Koudougou", text: "I'd had bad experiences before. With Bayiri Invest, I finally found a trustworthy partner. My business has been running smoothly for 6 months.", stars: 5 },
      { name: "Fatou Camara", country: "🇺🇸 New York → Ouahigouya", text: "The platform is excellent. I see construction photos in real time and sign my contracts online. Revolutionary!", stars: 5 },
    ],
    cta: {
      title: "Ready to secure your investment?",
      subtitle: "Join hundreds of clients who trust Bayiri Invest.",
      cta1: "Get started for free",
      cta2: "Access my account",
    },
    footer: "© 2026 Bayiri Invest — All rights reserved.",
  },
};

const solutionIcons = [MapPin, Building2, TrendingUp, Shield];

export default function Landing() {
  const { lang, setLang: switchLang } = useLang();
  const tx = t[lang];

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>

      {/* Navbar */}
      <nav style={{ background: "hsla(var(--background)/0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid hsl(var(--border))" }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png"
              alt="Bayiri Invest"
              className="h-11 object-contain"
            />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
            <a href="#solutions" className="hover:text-foreground transition-colors" style={{ "--tw-text-opacity": 1 }}
               onMouseEnter={e => e.target.style.color = "hsl(var(--primary))"}
               onMouseLeave={e => e.target.style.color = "hsl(var(--muted-foreground))"}
            >{tx.nav.solutions}</a>
            <a href="#comment"
               onMouseEnter={e => e.target.style.color = "hsl(var(--primary))"}
               onMouseLeave={e => e.target.style.color = "hsl(var(--muted-foreground))"}
            >{tx.nav.how}</a>
            <a href="#avis"
               onMouseEnter={e => e.target.style.color = "hsl(var(--primary))"}
               onMouseLeave={e => e.target.style.color = "hsl(var(--muted-foreground))"}
            >{tx.nav.reviews}</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => switchLang(lang === "fr" ? "en" : "fr")}
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))" }}
            >
              {lang === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
            </button>
            <Link to="/dashboard">
              <button className="text-sm font-semibold px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: "hsl(var(--primary)/0.4)", color: "hsl(var(--primary))" }}
                onMouseEnter={e => { e.currentTarget.style.background = "hsl(var(--primary))"; e.currentTarget.style.color = "hsl(var(--primary-foreground))"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(var(--primary))"; }}
              >
                {tx.nav.login}
              </button>
            </Link>
            <Link to="/onboarding">
              <button className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {tx.nav.start}
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(12,62%,22%) 0%, hsl(15,55%,16%) 50%, hsl(153,50%,10%) 100%)", color: "white" }}>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1627392346640-2af29b2a2e8e?w=1600&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
        {/* Gold grain */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, hsl(38,65%,60%) 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-36 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}
            >
              {tx.hero.badge}
            </span>
            <h1 className="font-heading leading-tight mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 400 }}>
              {tx.hero.title1}<br />
              <span style={{ color: "hsl(38,72%,68%)" }}>{tx.hero.title2}</span>
            </h1>
            <p className="text-lg mb-10 leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
              {tx.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/onboarding">
                <button className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold transition-opacity"
                  style={{ background: "hsl(38,65%,52%)", color: "hsl(15,25%,12%)" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {tx.hero.cta1} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="#comment">
                <button className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.85)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {tx.hero.cta2}
                </button>
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end">
            <img
              src="https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=600&h=500&fit=crop"
              alt="Chantier"
              className="rounded-2xl w-full max-w-md object-cover"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)" }}
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)" }}>
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {tx.stats.map((s) => (
              <div key={s.label}>
                <p className="font-heading text-3xl" style={{ color: "hsl(38,72%,68%)", fontWeight: 400 }}>{s.value}</p>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-24" style={{ background: "hsl(var(--muted))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary)/0.2)" }}
            >{tx.solutionsSection.badge}</span>
            <h2 className="font-heading text-4xl mb-4" style={{ fontWeight: 400, color: "hsl(var(--foreground))" }}>{tx.solutionsSection.title}</h2>
            <p className="max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>{tx.solutionsSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tx.solutions.map((s, i) => {
              const Icon = solutionIcons[i];
              return (
                <div key={s.title} className="rounded-xl p-8 transition-all duration-300 group"
                  style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border)/0.6)", boxShadow: "var(--shadow-sm)" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-colors"
                    style={{ background: "hsl(var(--primary)/0.1)" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <h3 className="font-heading text-xl mb-3" style={{ fontWeight: 400, color: "hsl(var(--foreground))" }}>{s.title}</h3>
                  <p className="leading-relaxed text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment" className="py-24" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{ background: "hsl(var(--secondary)/0.1)", color: "hsl(var(--secondary))", border: "1px solid hsl(var(--secondary)/0.2)" }}
            >{tx.howSection.badge}</span>
            <h2 className="font-heading text-4xl mb-4" style={{ fontWeight: 400, color: "hsl(var(--foreground))" }}>{tx.howSection.title}</h2>
            <p className="max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>{tx.howSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tx.steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < tx.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[58%] w-full h-px" style={{ background: "linear-gradient(to right, hsl(var(--primary)/0.3), transparent)" }} />
                )}
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 font-heading text-lg"
                  style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", fontWeight: 400, boxShadow: "var(--shadow-md)" }}
                >
                  {step.num}
                </div>
                <h3 className="font-heading text-lg mb-2" style={{ fontWeight: 400, color: "hsl(var(--foreground))" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Platform preview */}
          <div className="mt-20 rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10"
            style={{ background: "linear-gradient(135deg, hsl(15,22%,11%) 0%, hsl(153,45%,9%) 100%)", color: "white" }}
          >
            <div className="flex-1">
              <h3 className="font-heading text-3xl mb-4" style={{ fontWeight: 400 }}>{tx.platform.title}</h3>
              <ul className="space-y-3">
                {tx.platform.features.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
                    <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "hsl(38,65%,52%)" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/onboarding" className="inline-block mt-8">
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-opacity"
                  style={{ background: "hsl(38,65%,52%)", color: "hsl(15,25%,12%)" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {tx.platform.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                alt="Dashboard"
                className="rounded-xl w-full max-w-md"
                style={{ boxShadow: "0 20px 48px rgba(0,0,0,0.5)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="avis" className="py-24" style={{ background: "hsl(var(--muted))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary)/0.2)" }}
            >{tx.reviewsSection.badge}</span>
            <h2 className="font-heading text-4xl mb-4" style={{ fontWeight: 400, color: "hsl(var(--foreground))" }}>{tx.reviewsSection.title}</h2>
            <p className="max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>{tx.reviewsSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tx.testimonials.map((t) => (
              <div key={t.name} className="rounded-xl p-8 transition-all"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border)/0.6)", boxShadow: "var(--shadow-sm)" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4" style={{ fill: "hsl(38,75%,52%)", color: "hsl(38,75%,52%)" }} />
                  ))}
                </div>
                <p className="leading-relaxed mb-6 italic text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading text-4xl mb-6" style={{ fontWeight: 400 }}>{tx.cta.title}</h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.7)" }}>{tx.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/onboarding">
              <button className="flex items-center gap-2 px-10 py-3 rounded-lg text-sm font-semibold transition-opacity"
                style={{ background: "hsl(38,65%,52%)", color: "hsl(15,25%,12%)" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {tx.cta.cta1} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="flex items-center gap-2 px-10 py-3 rounded-lg text-sm font-semibold transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.9)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {tx.cta.cta2}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "hsl(15,22%,9%)", color: "hsl(var(--muted-foreground))" }} className="py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <img
            src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png"
            alt="Bayiri Invest"
            className="h-10 object-contain brightness-[1.8]"
          />
          <p className="text-sm text-center">{tx.footer}</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#solutions" className="hover:text-white transition-colors">{tx.nav.solutions}</a>
            <a href="#avis" className="hover:text-white transition-colors">{tx.nav.reviews}</a>
            <Link to="/dashboard" className="hover:text-white transition-colors">{tx.nav.login}</Link>
            <Link to="/cgu" className="hover:text-white transition-colors">CGU</Link>
            <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
