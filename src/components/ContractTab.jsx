import { Shield, CheckCircle, Clock, PenLine, Globe, Calendar, User, Hash, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const defaultContract = (project) => `CONTRAT DE PRESTATION DE SERVICES
Bayiri Invest – Service d'Accompagnement Investissement Afrique
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENTRE LES PARTIES :
• Bayiri Invest, société de conseil et accompagnement d'investissement
• Le Client, désigné ci-dessous comme "Mandant"

OBJET DU CONTRAT :
Le présent contrat porte sur l'accompagnement et le suivi du projet intitulé :
« ${project?.title || ""} »
situé à ${project?.city || ""}${project?.country ? ", " + project.country : ""}.

Type de projet : ${project?.type || ""}
Budget prévu : ${project?.budget?.toLocaleString("fr-FR") || "À définir"} €
${project?.subscriptionType ? `Formule choisie : ${project.subscriptionType === "mensuel_engagement" ? "Mensuel avec engagement" : project.subscriptionType === "mensuel_sans_engagement" ? "Mensuel sans engagement" : "Forfait"}` : ""}

PRESTATIONS INCLUSES :
1. Identification et vérification des prestataires locaux
2. Suivi hebdomadaire du chantier ou projet avec rapport photo géolocalisé
3. Représentation du client auprès des administrations locales
4. Gestion et supervision des paiements aux intervenants locaux
5. Reporting régulier et accès à la plateforme de suivi en temps réel

ENGAGEMENTS DU MANDATAIRE (Bayiri Invest) :
— Diligence et transparence dans la gestion du projet
— Communication régulière et réactive avec le mandant
— Respect des délais contractuels convenus
— Confidentialité des informations du client

ENGAGEMENTS DU MANDANT (Client) :
— Règlement des honoraires selon l'échéancier convenu
— Fourniture des documents nécessaires en temps voulu
— Coopération dans les décisions importantes du projet

DURÉE :
Du ${project?.startDate ? new Date(project.startDate).toLocaleDateString("fr-FR") : "date de début"} au ${project?.endDate ? new Date(project.endDate).toLocaleDateString("fr-FR") : "date de fin prévue"}

DISPOSITIONS LÉGALES :
La signature électronique du présent contrat a valeur juridique contraignante conformément au Règlement eIDAS (UE) n°910/2014 et à la législation applicable.`.trim();

export default function ContractTab({ project, onSign }) {
  const contractText = project?.contractContent || defaultContract(project);
  const isSigned = project?.signatureStatus === "signe";
  const isPending = project?.signatureStatus === "en_attente";
  const isNotRequested = !project?.signatureStatus || project?.signatureStatus === "non_demande";

  return (
    <div className="space-y-6">
      {/* Status banner */}
      {isSigned && (
        <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/20 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-700 text-sm">Contrat signé</p>
            <p className="text-xs text-green-600">
              Signé le {new Date(project.signatureDate).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "medium" })}
            </p>
          </div>
          <Badge className="ml-auto bg-green-500 text-white">Signé</Badge>
        </div>
      )}
      {isPending && (
        <div className="flex items-center justify-between gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Signature requise</p>
              <p className="text-xs text-muted-foreground">Votre contrat est prêt à signer électroniquement</p>
            </div>
          </div>
          <Button onClick={onSign}>
            <PenLine className="w-4 h-4 mr-2" /> Signer maintenant
          </Button>
        </div>
      )}
      {isNotRequested && (
        <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-2xl">
          <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Le contrat sera disponible à la signature une fois votre projet validé par notre équipe.
          </p>
        </div>
      )}

      {/* Contract text */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Contrat de prestation — {project?.title}</span>
          </div>
          {isSigned && <Badge variant="outline" className="text-green-700 border-green-500/30 bg-green-500/5">Signé</Badge>}
          {isPending && <Badge variant="outline" className="text-amber-700 border-amber-500/30 bg-amber-500/5">En attente de signature</Badge>}
        </div>
        <ScrollArea className="h-72 p-5">
          <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap text-foreground/80">{contractText}</pre>
        </ScrollArea>
      </div>

      {/* Certificate (only if signed) */}
      {isSigned && (
        <div className="bg-card rounded-2xl border-2 border-green-500/30 overflow-hidden">
          <div className="px-5 py-4 bg-green-500/5 border-b border-green-500/20 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-sm text-green-700">Certificat de signature électronique</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
              <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Date et heure de signature</p>
                <p className="font-semibold text-sm">
                  {new Date(project.signatureDate).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "medium" })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
              <Globe className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Adresse IP signataire</p>
                <p className="font-semibold text-sm font-mono">{project.signatureIp || "Enregistrée"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
              <User className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Signataire</p>
                <p className="font-semibold text-sm">{project.client?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
              <Hash className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Référence du contrat</p>
                <p className="font-mono text-xs break-all text-foreground/70">{project.id}</p>
              </div>
            </div>
          </div>
          {/* Signature image */}
          {project.signatureUrl && (
            <div className="px-5 pb-5">
              <p className="text-xs text-muted-foreground mb-2">Signature manuscrite numérisée</p>
              <div className="border border-green-500/20 rounded-xl p-4 bg-white flex justify-center">
                <img src={project.signatureUrl} alt="Signature" className="max-h-24 object-contain" />
              </div>
            </div>
          )}
          <div className="px-5 pb-5">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Signature électronique conforme au Règlement eIDAS (UE) n°910/2014. Valeur juridique contraignante.
            </p>
          </div>
        </div>
      )}

      {/* Sign button at bottom if pending */}
      {isPending && (
        <div className="text-center">
          <Button size="lg" onClick={onSign} className="px-8">
            <PenLine className="w-4 h-4 mr-2" /> Signer le contrat maintenant
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Signature sécurisée — votre IP et la date seront enregistrées
          </p>
        </div>
      )}
    </div>
  );
}