import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function MentionsLegales() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Mentions Légales</h1>
        <p className="text-sm text-muted-foreground mb-10">Dernière mise à jour : mai 2025</p>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Éditeur de la plateforme</h2>
            <div className="bg-muted/50 rounded-xl p-5 space-y-1">
              <p><span className="font-medium text-foreground">Raison sociale :</span> Bayiri Invest</p>
              <p><span className="font-medium text-foreground">Forme juridique :</span> [À compléter]</p>
              <p><span className="font-medium text-foreground">Siège social :</span> [Adresse à compléter]</p>
              <p><span className="font-medium text-foreground">Numéro d'immatriculation :</span> [RCCM / IFU à compléter]</p>
              <p><span className="font-medium text-foreground">Email :</span> <span className="text-primary">contact@bayiri-invest.com</span></p>
              <p><span className="font-medium text-foreground">Directeur de la publication :</span> [Nom du responsable à compléter]</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Hébergement</h2>
            <div className="bg-muted/50 rounded-xl p-5 space-y-1">
              <p><span className="font-medium text-foreground">Hébergeur :</span> Railway (backend) / Vercel (frontend)</p>
              <p><span className="font-medium text-foreground">Railway :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p><span className="font-medium text-foreground">Vercel Inc. :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p><span className="font-medium text-foreground">Stockage des fichiers :</span> Cloudinary Inc., 3400 Central Expressway, Santa Clara, CA 95051, États-Unis</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur la plateforme Bayiri Invest Connect (textes, images, graphismes, logo,
              icônes, sons, logiciels, base de données, etc.) est la propriété exclusive de Bayiri Invest, sauf mentions
              contraires. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des
              éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Données personnelles</h2>
            <p>
              Les informations recueillies sur la plateforme font l'objet d'un traitement informatique destiné à la gestion
              des comptes utilisateurs, au suivi des projets d'investissement et à la communication entre les parties.
            </p>
            <p className="mt-2">
              Conformément aux réglementations applicables, vous disposez des droits suivants sur vos données :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement ("droit à l'oubli")</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous à <span className="text-primary">contact@bayiri-invest.com</span>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Cookies</h2>
            <p>
              La plateforme utilise des données de session stockées localement dans votre navigateur (localStorage) pour
              maintenir votre connexion sécurisée. Aucun cookie de traçage publicitaire n'est utilisé. Des cookies fonctionnels
              peuvent être utilisés pour mémoriser vos préférences de langue et d'interface.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Liens hypertextes</h2>
            <p>
              La plateforme peut contenir des liens vers des sites tiers. Bayiri Invest n'exerce aucun contrôle sur ces sites
              et décline toute responsabilité quant à leur contenu, leurs pratiques de confidentialité ou leur disponibilité.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Limitation de responsabilité</h2>
            <p>
              Bayiri Invest ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès à la
              plateforme ou de son utilisation, notamment en cas d'interruption de service, de perte de données, d'intrusion
              malveillante ou de défaillance technique indépendante de notre volonté.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Droit applicable et juridiction</h2>
            <p>
              Les présentes mentions légales sont soumises au droit burkinabè. En cas de litige, les tribunaux compétents
              seront ceux du lieu du siège social de Bayiri Invest, sauf disposition légale contraire applicable dans le pays
              de résidence de l'utilisateur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales :<br />
              <span className="text-primary">contact@bayiri-invest.com</span>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-6 text-sm text-muted-foreground">
          <Link to="/cgu" className="hover:text-foreground transition-colors">CGU</Link>
          <button onClick={() => navigate(-1)} className="hover:text-foreground transition-colors underline">Retour</button>
        </div>
      </div>
    </div>
  )
}
