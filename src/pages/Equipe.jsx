import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/LangContext";
import { ArrowLeft, ArrowRight, Linkedin, MapPin } from "lucide-react";

const G = "clamp(20px, 5vw, 60px)";
const WRAP = { maxWidth: 1200, margin: "0 auto", paddingLeft: G, paddingRight: G };

const t = {
  fr: {
    back: "Retour à l'accueil",
    label: "L'équipe",
    hero: "Une équipe ancrée sur le terrain.",
    heroSub: "Voici qui nous sommes, ce que nous faisons, et les partenaires avec qui nous travaillons pour protéger vos investissements.",
    teamLabel: "Équipe dirigeante",
    teamSub: "Les fondateurs et responsables qui portent la vision Bayiri Invest au quotidien.",
    fieldLabel: "Équipe terrain",
    fieldSub: "Nos agents certifiés sur le terrain à Ouagadougou et dans les villes secondaires.",
    partnersLabel: "Réseau partenaire",
    partnersSub: "Nous travaillons avec des experts juridiques, notariaux et techniques sélectionnés pour leur rigueur et leur ancrage local.",
    joinLabel: "Rejoindre l'équipe",
    joinTitle: "Vous voulez contribuer au développement de la diaspora ?",
    joinDesc: "Bayiri Invest recrute régulièrement des agents terrain, des juristes et des professionnels de l'immobilier. Si vous partagez nos valeurs, contactez-nous.",
    joinCta: "Envoyer une candidature",
    valuesCta: "Lire nos valeurs",
    valuesCtaSub: "Ce qui guide chacune de nos décisions.",
    team: [
      {
        initials: "MU",
        name: "Manegdo Ulrich Doamba",
        role: "Co-fondateur & Directeur Général",
        location: "Burkina Faso / Europe",
        bio: "Ulrich a fondé Bayiri Invest après avoir constaté le manque criant de solutions fiables pour les membres de la diaspora souhaitant investir au pays. Expert en développement commercial et en stratégie d'entreprise, il pilote la vision globale de la plateforme et les relations institutionnelles.",
        bio2: "Il est convaincu que la technologie, couplée à une présence terrain sérieuse, peut transformer radicalement l'expérience d'investissement à distance.",
        linkedin: null,
      },
      {
        initials: "OA",
        name: "Ouattara Abdoul Razack",
        role: "Co-fondateur & Directeur des Opérations",
        location: "Ouagadougou, Burkina Faso",
        bio: "Abdoul Razack supervise l'ensemble des opérations terrain : coordination des agents certifiés, suivi de la qualité des rapports, gestion des relations avec les prestataires. Son ancrage local est ce qui permet à Bayiri Invest d'être réellement présent sur chaque chantier.",
        bio2: "Avec une expérience en gestion de projets dans le secteur immobilier burkinabè, il connaît les acteurs du marché, les contraintes réglementaires et les réalités du terrain.",
        linkedin: null,
      },
      {
        initials: "SF",
        name: "Salimata Fofana",
        role: "Responsable Relations Clients Diaspora",
        location: "Paris, France",
        bio: "Salimata est l'interlocutrice principale des clients diaspora. Elle accompagne chaque investisseur de l'onboarding jusqu'à la clôture de son projet : questions, documents, inquiétudes ou demandes spécifiques — elle est le pont entre la plateforme et les réalités humaines de l'investissement à distance.",
        bio2: "Bilingue français-anglais, elle gère également les clients établis au Royaume-Uni, en Belgique et au Canada.",
        linkedin: null,
      },
      {
        initials: "BI",
        name: "Boubacar Ibrahim Sawadogo",
        role: "Responsable Terrain & Qualité",
        location: "Ouagadougou, Burkina Faso",
        bio: "Boubacar coordonne directement les agents terrain et garantit la conformité des rapports de suivi. Chaque photo, chaque compte-rendu, chaque évaluation technique passe par son contrôle avant d'être transmis au client.",
        bio2: "Technicien BTP de formation, il apporte une expertise technique qui lui permet d'évaluer l'avancement réel des chantiers, au-delà des déclarations des prestataires.",
        linkedin: null,
      },
    ],
    field: [
      {
        initials: "AT",
        name: "Agents terrain certifiés",
        role: "Ouagadougou & régions",
        desc: "Nos agents terrain sont sélectionnés, formés à nos protocoles de reporting et évalués en continu. Ils se déplacent sur les chantiers, prennent les photos horodatées, rédigent les comptes-rendus et vérifient la conformité des travaux aux plans validés.",
      },
      {
        initials: "RC",
        name: "Réseau de contrôleurs",
        role: "Supervision qualité",
        desc: "Un contrôleur indépendant intervient à chaque étape clé du projet pour valider l'avancement et certifier la conformité. Cette double vérification garantit que ce que vous voyez sur votre tableau de bord correspond exactement à la réalité du terrain.",
      },
    ],
    partners: [
      {
        label: "Juridique",
        title: "Cabinet d'avocats partenaire",
        desc: "Conseil en droit immobilier et commercial burkinabè. Rédaction et révision des contrats d'investissement. Protection des intérêts de l'investisseur en cas de litige.",
      },
      {
        label: "Notarial",
        title: "Étude notariale partenaire",
        desc: "Authentification des actes fonciers, transferts de propriété et sécurisation des transactions. Expertise sur le droit foncier burkinabè et les procédures de titre foncier.",
      },
      {
        label: "BTP",
        title: "Bureaux d'études et entreprises BTP",
        desc: "Un réseau de bureaux d'études agréés et d'entreprises de construction vérifiées. Suivi technique, contrôle qualité, devis contradictoires et maîtrise d'oeuvre pour les projets de construction.",
      },
      {
        label: "Financier",
        title: "Partenaires bancaires",
        desc: "Comptes séquestres, financement de projet et services bancaires pour les transactions immobilières. Nos partenaires bancaires opèrent sous supervision de la BCEAO.",
      },
    ],
  },
  en: {
    back: "Back to home",
    label: "The team",
    hero: "A team rooted on the ground.",
    heroSub: "Here is who we are, what we do, and the partners we work with to protect your investments.",
    teamLabel: "Leadership team",
    teamSub: "The founders and managers who carry the Bayiri Invest vision every day.",
    fieldLabel: "Field team",
    fieldSub: "Our certified agents on the ground in Ouagadougou and secondary cities.",
    partnersLabel: "Partner network",
    partnersSub: "We work with legal, notarial and technical experts selected for their rigor and local grounding.",
    joinLabel: "Join the team",
    joinTitle: "Want to contribute to diaspora development?",
    joinDesc: "Bayiri Invest regularly recruits field agents, lawyers and real estate professionals. If you share our values, get in touch.",
    joinCta: "Send an application",
    valuesCta: "Read our values",
    valuesCtaSub: "What guides each of our decisions.",
    team: [
      {
        initials: "MU",
        name: "Manegdo Ulrich Doamba",
        role: "Co-founder & CEO",
        location: "Burkina Faso / Europe",
        bio: "Ulrich founded Bayiri Invest after witnessing the glaring lack of reliable solutions for diaspora members wishing to invest back home. An expert in business development and corporate strategy, he drives the platform's overall vision and institutional relationships.",
        bio2: "He believes that technology, coupled with serious field presence, can radically transform the remote investment experience.",
        linkedin: null,
      },
      {
        initials: "OA",
        name: "Ouattara Abdoul Razack",
        role: "Co-founder & COO",
        location: "Ouagadougou, Burkina Faso",
        bio: "Abdoul Razack oversees all field operations: coordination of certified agents, monitoring of report quality, management of contractor relationships. His local grounding is what allows Bayiri Invest to be genuinely present on every site.",
        bio2: "With experience in project management in the Burkinabè real estate sector, he knows the market players, regulatory constraints and field realities.",
        linkedin: null,
      },
      {
        initials: "SF",
        name: "Salimata Fofana",
        role: "Head of Diaspora Client Relations",
        location: "Paris, France",
        bio: "Salimata is the primary contact for diaspora clients. She accompanies every investor from onboarding to project closure: questions, documents, concerns or specific requests — she is the bridge between the platform and the human realities of remote investment.",
        bio2: "Bilingual in French and English, she also manages clients based in the UK, Belgium and Canada.",
        linkedin: null,
      },
      {
        initials: "BI",
        name: "Boubacar Ibrahim Sawadogo",
        role: "Head of Field Operations & Quality",
        location: "Ouagadougou, Burkina Faso",
        bio: "Boubacar directly coordinates field agents and ensures the compliance of monitoring reports. Every photo, every report, every technical assessment goes through his review before being sent to the client.",
        bio2: "With a background in construction engineering, he brings technical expertise that allows him to assess actual construction progress, beyond contractors' declarations.",
        linkedin: null,
      },
    ],
    field: [
      {
        initials: "AT",
        name: "Certified field agents",
        role: "Ouagadougou & regions",
        desc: "Our field agents are selected, trained in our reporting protocols and continuously evaluated. They visit construction sites, take timestamped photos, write progress reports and verify that work complies with approved plans.",
      },
      {
        initials: "RC",
        name: "Quality controllers",
        role: "Quality supervision",
        desc: "An independent controller intervenes at each key project milestone to validate progress and certify compliance. This double verification ensures that what you see on your dashboard corresponds exactly to field reality.",
      },
    ],
    partners: [
      {
        label: "Legal",
        title: "Partner law firm",
        desc: "Counsel in Burkinabè real estate and commercial law. Drafting and reviewing investment contracts. Protection of investor interests in case of dispute.",
      },
      {
        label: "Notarial",
        title: "Partner notarial office",
        desc: "Authentication of land deeds, property transfers and transaction security. Expertise in Burkinabè land law and title deed procedures.",
      },
      {
        label: "Construction",
        title: "Engineering firms and contractors",
        desc: "A network of approved engineering firms and verified construction companies. Technical monitoring, quality control, competitive quotes and project management for construction projects.",
      },
      {
        label: "Financial",
        title: "Banking partners",
        desc: "Escrow accounts, project financing and banking services for real estate transactions. Our banking partners operate under BCEAO supervision.",
      },
    ],
  },
};

function PersonCard({ person }) {
  return (
    <div style={{ background: "white", borderRadius: 20, border: "1px solid hsl(0,0%,91%)", overflow: "hidden" }}>
      {/* Photo placeholder */}
      <div style={{ background: "rgb(5,5,5)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 48, color: "rgba(255,255,255,0.15)" }}>{person.initials}</span>
        <div style={{ position: "absolute", bottom: 16, left: 20, display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin style={{ width: 12, height: 12, color: "rgba(255,255,255,0.4)" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{person.location}</span>
        </div>
      </div>
      <div style={{ padding: "24px 28px" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem", color: "rgb(5,5,5)", margin: "0 0 4px" }}>{person.name}</h3>
        <p style={{ fontSize: 13, color: "rgb(100,100,100)", fontWeight: 500, margin: "0 0 20px" }}>{person.role}</p>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgb(60,60,60)", margin: "0 0 12px" }}>{person.bio}</p>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgb(100,100,100)", margin: 0 }}>{person.bio2}</p>
        {person.linkedin && (
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 20, fontSize: 13, color: "rgb(5,5,5)", fontWeight: 500, textDecoration: "none" }}>
            <Linkedin style={{ width: 14, height: 14 }} /> LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}

export default function Equipe() {
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
      <section style={{ background: "white", borderBottom: "1px solid hsl(0,0%,91%)", paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ ...WRAP }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(100,100,100)", margin: "0 0 16px" }}>{tx.label}</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "rgb(5,5,5)", margin: "0 0 20px", maxWidth: 640 }}>
            {tx.hero}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgb(80,80,80)", maxWidth: 560, margin: 0 }}>
            {tx.heroSub}
          </p>
        </div>
      </section>

      {/* Équipe dirigeante */}
      <section style={{ paddingTop: 100, paddingBottom: 100, background: "white" }}>
        <div style={{ ...WRAP }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(100,100,100)", margin: "0 0 12px" }}>{tx.teamLabel}</p>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgb(80,80,80)", maxWidth: 560, margin: 0 }}>{tx.teamSub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {tx.team.map(person => (
              <PersonCard key={person.name} person={person} />
            ))}
          </div>
        </div>
      </section>

      {/* Équipe terrain */}
      <section style={{ paddingTop: 80, paddingBottom: 80, background: "rgb(248,248,248)" }}>
        <div style={{ ...WRAP }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(100,100,100)", margin: "0 0 12px" }}>{tx.fieldLabel}</p>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgb(80,80,80)", maxWidth: 560, margin: 0 }}>{tx.fieldSub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            {tx.field.map(f => (
              <div key={f.name} style={{ background: "white", borderRadius: 20, border: "1px solid hsl(0,0%,91%)", padding: "32px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgb(5,5,5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "white", flexShrink: 0 }}>
                  {f.initials}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1rem", color: "rgb(5,5,5)", margin: "0 0 4px" }}>{f.name}</h3>
                  <p style={{ fontSize: 12, color: "rgb(130,130,130)", fontWeight: 500, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.role}</p>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgb(60,60,60)", margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section style={{ paddingTop: 80, paddingBottom: 80, background: "white" }}>
        <div style={{ ...WRAP }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(100,100,100)", margin: "0 0 12px" }}>{tx.partnersLabel}</p>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgb(80,80,80)", maxWidth: 560, margin: 0 }}>{tx.partnersSub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {tx.partners.map(p => (
              <div key={p.title} style={{ background: "rgb(248,248,248)", borderRadius: 20, border: "1px solid hsl(0,0%,91%)", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgb(140,140,140)" }}>{p.label}</span>
                <div>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "rgb(5,5,5)", margin: "0 0 12px" }}>{p.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgb(80,80,80)", margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recrutement */}
      <section style={{ paddingTop: 80, paddingBottom: 80, background: "white", borderTop: "1px solid hsl(0,0%,91%)" }}>
        <div style={{ ...WRAP }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(100,100,100)", margin: "0 0 16px" }}>{tx.joinLabel}</p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", letterSpacing: "-0.02em", lineHeight: 1.2, color: "rgb(5,5,5)", margin: "0 0 20px" }}>
                {tx.joinTitle}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "rgb(80,80,80)", margin: "0 0 32px" }}>{tx.joinDesc}</p>
              <a href="mailto:recrutement@bayiri-invest.com" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgb(5,5,5)", color: "white", padding: "14px 24px", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
                {tx.joinCta} <ArrowRight style={{ width: 16, height: 16 }} />
              </a>
            </div>
            <div style={{ background: "rgb(248,248,248)", borderRadius: 20, padding: "40px 36px", display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(100,100,100)", margin: "0 0 4px" }}>{tx.valuesCta}</p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "rgb(60,60,60)", margin: "0 0 24px" }}>{tx.valuesCtaSub}</p>
              <Link to="/nos-valeurs" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgb(5,5,5)", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                {tx.valuesCta} <ArrowRight style={{ width: 15, height: 15 }} />
              </Link>
            </div>
          </div>
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
