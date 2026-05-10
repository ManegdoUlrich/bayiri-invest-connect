import { Link } from "react-router-dom";
import { useLang } from "@/lib/LangContext";
import { Shield, MapPin, TrendingUp, Star, ArrowRight, CheckCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-white font-body">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png"
              alt="Bayiri Invest"
              className="h-14 object-contain"
            />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#solutions" className="hover:text-[#7B1818] transition-colors">{tx.nav.solutions}</a>
            <a href="#comment" className="hover:text-[#7B1818] transition-colors">{tx.nav.how}</a>
            <a href="#avis" className="hover:text-[#7B1818] transition-colors">{tx.nav.reviews}</a>
          </div>
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => switchLang(lang === "fr" ? "en" : "fr")}
            >
              {lang === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
            </button>
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="border-[#7B1818] text-[#7B1818] hover:bg-[#7B1818] hover:text-white">
                {tx.nav.login}
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button size="sm" className="bg-[#7B1818] hover:bg-[#5e1010] text-white">
                {tx.nav.start}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7B1818] via-[#5e1010] to-[#3d0a0a] text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1627392346640-2af29b2a2e8e?w=1600&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-36 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm text-sm px-4 py-1.5">
              {tx.hero.badge}
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              {tx.hero.title1}<br />
              <span className="text-[#4ade80]">{tx.hero.title2}</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed">
              {tx.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/onboarding">
                <Button size="lg" className="bg-[#4ade80] hover:bg-[#22c55e] text-black font-semibold px-8">
                  {tx.hero.cta1} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="#comment">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8">
                  {tx.hero.cta2}
                </Button>
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end">
            <img
              src="https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=600&h=500&fit=crop"
              alt="Chantier"
              className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
            />
          </div>
        </div>
        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {tx.stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-heading font-bold text-[#4ade80]">{s.value}</p>
                <p className="text-sm text-white/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#7B1818]/10 text-[#7B1818] border-[#7B1818]/20">{tx.solutionsSection.badge}</Badge>
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">{tx.solutionsSection.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{tx.solutionsSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tx.solutions.map((s, i) => {
              const Icon = solutionIcons[i];
              return (
                <div key={s.title} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-[#7B1818]/10 flex items-center justify-center mb-5 group-hover:bg-[#7B1818] transition-colors">
                    <Icon className="w-7 h-7 text-[#7B1818] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#4ade80]/20 text-green-700 border-green-200">{tx.howSection.badge}</Badge>
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">{tx.howSection.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{tx.howSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tx.steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < tx.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#7B1818]/20 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-full bg-[#7B1818] text-white text-xl font-heading font-bold flex items-center justify-center mx-auto mb-5 shadow-lg">
                  {step.num}
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2 text-lg">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Platform preview */}
          <div className="mt-20 bg-gradient-to-br from-gray-900 to-[#3d0a0a] rounded-3xl p-8 lg:p-12 text-white flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-3xl font-heading font-bold mb-4">{tx.platform.title}</h3>
              <ul className="space-y-3">
                {tx.platform.features.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-[#4ade80] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/onboarding" className="inline-block mt-8">
                <Button size="lg" className="bg-[#4ade80] hover:bg-[#22c55e] text-black font-semibold">
                  {tx.platform.cta} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                alt="Dashboard"
                className="rounded-2xl shadow-2xl w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="avis" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#7B1818]/10 text-[#7B1818] border-[#7B1818]/20">{tx.reviewsSection.badge}</Badge>
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">{tx.reviewsSection.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{tx.reviewsSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tx.testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7B1818]/10 flex items-center justify-center text-[#7B1818] font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#7B1818] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-heading font-bold mb-6">{tx.cta.title}</h2>
          <p className="text-white/70 text-lg mb-10">{tx.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/onboarding">
              <Button size="lg" className="bg-[#4ade80] hover:bg-[#22c55e] text-black font-semibold px-10">
                {tx.cta.cta1} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-10">
                {tx.cta.cta2}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <img
            src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png"
            alt="Bayiri Invest"
            className="h-10 object-contain brightness-200"
          />
          <p className="text-sm text-center">{tx.footer}</p>
          <div className="flex gap-6 text-sm">
            <a href="#solutions" className="hover:text-white transition-colors">{tx.nav.solutions}</a>
            <a href="#avis" className="hover:text-white transition-colors">{tx.nav.reviews}</a>
            <Link to="/dashboard" className="hover:text-white transition-colors">{tx.nav.login}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}