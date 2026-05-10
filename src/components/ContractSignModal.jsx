import { useState } from "react";
import { projectsApi } from "@/api/projects";
import { sendNotification, notifMessages } from "@/lib/notifications";
import { useAuth } from "@/lib/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import SignaturePad from "./SignaturePad";
import { Shield, CheckCircle, PenLine, Globe, Calendar, User, Hash } from "lucide-react";

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
${project?.subscription_type ? `Formule choisie : ${project.subscription_type === "mensuel_engagement" ? "Mensuel avec engagement" : project.subscription_type === "mensuel_sans_engagement" ? "Mensuel sans engagement" : "Forfait"}` : ""}

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
Du ${project?.start_date || "date de début"} au ${project?.end_date || "date de fin prévue"}

DISPOSITIONS LÉGALES :
La signature électronique du présent contrat a valeur juridique contraignante conformément au Règlement eIDAS (UE) n°910/2014 et à la législation applicable. La date, l'heure et l'adresse IP du signataire sont enregistrées et conservées comme preuve d'engagement.`.trim();

export default function ContractSignModal({ project, open, onClose, onSigned }) {
  const [step, setStep] = useState("read"); // read | sign | done
  const { user } = useAuth();
  const [signing, setSigning] = useState(false);
  const [certInfo, setCertInfo] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const contractText = project?.contract_content || defaultContract(project);

  const handleSign = async (signatureDataUrl) => {
    setSigning(true);
    try {
      // Convertir le dataURL base64 en Blob PNG pour l'upload Cloudinary
      const res = await fetch(signatureDataUrl);
      const blob = await res.blob();

      const updated = await projectsApi.sign(project.id, blob);

      await sendNotification({
        userId: user.id,
        type: "signature_done",
        title: "Contrat signé avec succès",
        message: notifMessages.signature_done(),
        projectId: project.id,
      });

      setCertInfo({
        signature_date: updated.signatureDate,
        signature_ip:   updated.signatureIp,
        signature_url:  updated.signatureUrl,
      });
      setStep("done");
      onSigned?.({ ...project, ...updated });
    } finally {
      setSigning(false);
    }
  };

  const handleClose = () => {
    setStep("read");
    setAgreed(false);
    setCertInfo(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              {step === "done" ? "Signature confirmée" : step === "sign" ? "Apposez votre signature" : "Contrat de prestation"}
            </DialogTitle>
          </DialogHeader>
          {/* Step indicator */}
          {step !== "done" && (
            <div className="flex items-center gap-2 mt-3">
              {["read", "sign"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s === step ? "bg-primary text-white" :
                    (i === 1 && step === "sign") || (i === 0 && step !== "read") ? "bg-green-500 text-white" :
                    "bg-muted text-muted-foreground"
                  }`}>{i + 1}</div>
                  <span className={`text-xs ${s === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {i === 0 ? "Lire le contrat" : "Signer"}
                  </span>
                  {i < 1 && <div className="w-8 h-px bg-border mx-1" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === "done" && certInfo ? (
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-heading font-bold">Contrat signé avec succès</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Votre signature a été enregistrée. Une confirmation vous a été envoyée par email.
                </p>
              </div>

              {/* Certificate */}
              <div className="border-2 border-green-500/30 rounded-2xl p-5 bg-green-500/5 space-y-4">
                <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                  <Shield className="w-4 h-4" /> Certificat de signature électronique
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-green-500/20">
                    <Calendar className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date et heure de signature</p>
                      <p className="font-semibold">{new Date(certInfo.signature_date).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "medium"})}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-green-500/20">
                    <Globe className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Adresse IP du signataire</p>
                      <p className="font-semibold font-mono">{certInfo.signature_ip}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-green-500/20">
                    <User className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Projet</p>
                      <p className="font-semibold">{project?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-green-500/20">
                    <Hash className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Référence contrat</p>
                      <p className="font-mono text-xs break-all">{project?.id}</p>
                    </div>
                  </div>
                </div>
                {/* Signature preview */}
                {certInfo.signature_url && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Signature apposée</p>
                    <div className="bg-white rounded-xl border border-green-500/20 p-3 flex justify-center">
                      <img src={certInfo.signature_url} alt="Signature" className="max-h-20 object-contain" />
                    </div>
                  </div>
                )}
              </div>
              <Button onClick={handleClose} className="w-full">Fermer</Button>
            </div>
          ) : step === "read" ? (
            <div className="p-6 space-y-4">
              <ScrollArea className="h-64 border border-border rounded-xl p-4 bg-muted/20 text-sm font-mono leading-relaxed whitespace-pre-line">
                {contractText}
              </ScrollArea>
              {/* Agreement checkbox */}
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-border hover:border-primary/40 transition-colors">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  J'ai lu et j'accepte l'intégralité des termes du présent contrat. Je comprends que ma signature électronique a valeur juridique contraignante.
                </span>
              </label>
              <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/30 rounded-xl p-3">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                Signature sécurisée — date, heure et adresse IP enregistrées comme preuve juridique
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <strong>Attention :</strong> En validant votre signature, vous acceptez définitivement les termes du contrat. Cette action est irréversible.
              </div>
              <p className="text-sm font-medium">Dessinez votre signature dans le cadre ci-dessous :</p>
              <SignaturePad onSave={handleSign} disabled={signing} />
              {signing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Enregistrement de la signature en cours...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        {step !== "done" && (
          <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
            {step === "sign" ? (
              <Button variant="ghost" size="sm" onClick={() => setStep("read")}>
                ← Relire le contrat
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleClose}>Annuler</Button>
            )}
            {step === "read" && (
              <Button onClick={() => setStep("sign")} disabled={!agreed}>
                <PenLine className="w-4 h-4 mr-2" /> Procéder à la signature
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}