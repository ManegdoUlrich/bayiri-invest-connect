import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function CGU() {
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

        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-sm text-muted-foreground mb-10">Dernière mise à jour : mai 2025</p>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et l'utilisation de la plateforme
              Bayiri Invest Connect (ci-après "la Plateforme"), éditée par Bayiri Invest. En accédant à la Plateforme, vous acceptez
              sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser toute utilisation de la Plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Description du service</h2>
            <p>
              Bayiri Invest Connect est une plateforme de suivi de projets immobiliers et commerciaux destinée aux membres de la
              diaspora africaine souhaitant investir dans leur pays d'origine. Elle permet notamment :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Le suivi en temps réel de l'avancement des projets via des rapports terrain</li>
              <li>La communication sécurisée entre le client, son agent local et l'équipe Bayiri Invest</li>
              <li>La gestion documentaire et contractuelle des projets d'investissement</li>
              <li>Le suivi des paiements et des étapes financières</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Inscription et compte utilisateur</h2>
            <p>
              L'accès à la Plateforme nécessite la création d'un compte personnel. Vous vous engagez à fournir des informations
              exactes, complètes et à jour lors de votre inscription. Vous êtes seul responsable de la confidentialité de vos
              identifiants de connexion et de toutes les activités effectuées depuis votre compte.
            </p>
            <p className="mt-2">
              Bayiri Invest se réserve le droit de suspendre ou de supprimer tout compte en cas de violation des présentes CGU,
              d'informations frauduleuses ou de comportement préjudiciable à d'autres utilisateurs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Obligations de l'utilisateur</h2>
            <p>En utilisant la Plateforme, vous vous engagez à :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Ne pas utiliser la Plateforme à des fins illicites ou contraires aux bonnes mœurs</li>
              <li>Ne pas tenter d'accéder à des données ou fonctionnalités qui ne vous sont pas destinées</li>
              <li>Ne pas transmettre de contenu diffamatoire, trompeur ou portant atteinte aux droits de tiers</li>
              <li>Respecter la confidentialité des informations des autres utilisateurs</li>
              <li>Ne pas perturber le bon fonctionnement de la Plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments de la Plateforme (logo, textes, images, interface, code source) est la propriété exclusive
              de Bayiri Invest et est protégé par les lois applicables en matière de propriété intellectuelle. Toute reproduction,
              distribution ou utilisation sans autorisation préalable écrite est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Données personnelles</h2>
            <p>
              Dans le cadre de l'utilisation de la Plateforme, Bayiri Invest collecte et traite des données personnelles vous
              concernant. Ces traitements sont effectués conformément à notre Politique de Confidentialité et aux réglementations
              en vigueur. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant
              à <span className="text-primary">contact@bayiri-invest.com</span>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Responsabilité</h2>
            <p>
              Bayiri Invest s'engage à fournir un service de qualité mais ne peut garantir une disponibilité ininterrompue de la
              Plateforme. En aucun cas, Bayiri Invest ne saurait être tenu responsable des dommages indirects résultant de
              l'utilisation ou de l'impossibilité d'utiliser la Plateforme.
            </p>
            <p className="mt-2">
              Les informations et rapports fournis sur la Plateforme constituent des comptes rendus de suivi et ne constituent pas
              des conseils en investissement au sens réglementaire.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Modification des CGU</h2>
            <p>
              Bayiri Invest se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de
              toute modification substantielle par notification sur la Plateforme ou par email. La poursuite de l'utilisation de
              la Plateforme après notification vaut acceptation des nouvelles CGU.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Résiliation</h2>
            <p>
              Vous pouvez résilier votre compte à tout moment en contactant notre support. Bayiri Invest peut également résilier
              votre accès sans préavis en cas de violation des présentes CGU. La résiliation entraîne la suppression de votre
              accès à la Plateforme, mais les données relatives à vos projets pourront être conservées conformément aux obligations
              légales applicables.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit applicable dans le pays de résidence de l'utilisateur, en complément du
              droit burkinabè pour les projets localisés au Burkina Faso. Tout litige relatif à l'interprétation ou l'exécution
              des présentes sera soumis à la juridiction compétente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Contact</h2>
            <p>
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter à :<br />
              <span className="text-primary">contact@bayiri-invest.com</span>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-6 text-sm text-muted-foreground">
          <Link to="/mentions-legales" className="hover:text-foreground transition-colors">Mentions légales</Link>
          <button onClick={() => navigate(-1)} className="hover:text-foreground transition-colors underline">Retour</button>
        </div>
      </div>
    </div>
  )
}
