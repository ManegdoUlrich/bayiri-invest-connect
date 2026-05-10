import { useState } from "react";
import { projectsApi } from "@/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle, ArrowRight, ArrowLeft,
  CreditCard, Smartphone, Calendar, Zap,
  Building2, MapPin, TrendingUp, Shield, Truck, HelpCircle
} from "lucide-react";

const projectTypes = [
  { v: "construction", label: "Construction", icon: Building2 },
  { v: "terrain", label: "Terrain / Foncier", icon: MapPin },
  { v: "commerce", label: "Commerce", icon: TrendingUp },
  { v: "representation", label: "Représentation", icon: Shield },
  { v: "logistique", label: "Logistique", icon: Truck },
  { v: "autre", label: "Autre", icon: HelpCircle },
];

const STEPS = ["Type de projet", "Abonnement", "Détails", "Récapitulatif"];

export default function CreateProjectFlow({ open, onClose, onCreated }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    project_duration: "",
    type: "",
    subscription_type: "",
    payment_method: "",
    title: "",
    description: "",
    city: "",
    country: "Burkina Faso",
    budget: "",
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.project_duration && form.type;
    if (step === 1) return form.subscription_type && form.payment_method;
    if (step === 2) return form.title.trim().length > 2;
    return true;
  };

  const submit = async () => {
    setSaving(true);
    await projectsApi.create({
      title: form.title,
      description: form.description,
      type: form.type,
      project_duration: form.project_duration,
      subscriptionType: form.subscription_type,
      paymentMethod: form.payment_method,
      city: form.city,
      country: form.country,
      budget: form.budget ? Number(form.budget) : undefined,
      status: "soumis",
    });
    setSaving(false);
    setDone(true);
    if (onCreated) onCreated();
  };

  const handleClose = () => {
    setStep(0);
    setForm({ project_duration: "", type: "", subscription_type: "", payment_method: "", title: "", description: "", city: "", country: "Burkina Faso", budget: "" });
    setDone(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {done ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold">Demande envoyée !</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Votre projet a été soumis. Notre équipe vous recontactera sous 48h pour organiser le suivi et rendre le projet officiel.
            </p>
            <Button onClick={handleClose} className="mt-2">Fermer</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">Nouveau projet</DialogTitle>
              {/* Progress */}
              <div className="flex items-center gap-2 pt-3">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`h-1.5 w-full rounded-full transition-all ${i <= step ? "bg-primary" : "bg-border"}`} />
                    <span className={`text-[10px] hidden sm:block ${i === step ? "text-primary font-medium" : "text-muted-foreground"}`}>{s}</span>
                  </div>
                ))}
              </div>
            </DialogHeader>

            <div className="py-2 space-y-5">

              {/* Step 0: Type */}
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <Label className="mb-3 block text-base font-semibold">Quelle est la durée de votre projet ?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { v: "ponctuel", label: "Prestation ponctuelle", icon: Zap, desc: "Un besoin précis, une mission ciblée." },
                        { v: "long_terme", label: "Projet long terme", icon: Calendar, desc: "Suivi continu sur plusieurs mois." },
                      ].map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.v}
                            onClick={() => update("project_duration", opt.v)}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${form.project_duration === opt.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                          >
                            <Icon className="w-6 h-6 mb-2 text-primary" />
                            <p className="font-semibold text-sm">{opt.label}</p>
                            <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block text-base font-semibold">Type de projet</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {projectTypes.map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.v}
                            onClick={() => update("type", opt.v)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${form.type === opt.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                          >
                            <Icon className="w-5 h-5 mx-auto mb-1.5 text-primary" />
                            <p className="text-xs font-medium">{opt.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Subscription */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <Label className="mb-3 block text-base font-semibold">Choisissez votre formule</Label>
                    <div className="space-y-3">
                      {[
                        {
                          v: "mensuel_engagement",
                          label: "Mensuel avec engagement",
                          badge: "Économique",
                          badgeColor: "bg-green-100 text-green-700",
                          desc: "Engagement minimum 3 mois. Tarif préférentiel. Paiement par carte bancaire uniquement.",
                          methods: ["carte"],
                          icon: CreditCard,
                          forDuration: ["long_terme"],
                        },
                        {
                          v: "mensuel_sans_engagement",
                          label: "Mensuel sans engagement",
                          badge: "Flexible",
                          badgeColor: "bg-blue-100 text-blue-700",
                          desc: "Sans engagement de durée. Résiliable à tout moment. Carte bancaire ou Mobile Money.",
                          methods: ["carte", "mobile_money"],
                          icon: CreditCard,
                          forDuration: ["long_terme"],
                        },
                        {
                          v: "forfait",
                          label: "Prestation forfaitaire",
                          badge: "Ponctuel",
                          badgeColor: "bg-orange-100 text-orange-700",
                          desc: "Tarif fixe pour une mission précise. Idéal pour les projets ponctuels.",
                          methods: ["carte", "mobile_money"],
                          icon: Zap,
                          forDuration: ["ponctuel", "long_terme"],
                        },
                      ]
                        .filter(s => s.forDuration.includes(form.project_duration))
                        .map(sub => {
                          const Icon = sub.icon;
                          const isSelected = form.subscription_type === sub.v;
                          return (
                            <button
                              key={sub.v}
                              onClick={() => {
                                update("subscription_type", sub.v);
                                if (sub.methods.length === 1) update("payment_method", sub.methods[0]);
                                else update("payment_method", "");
                              }}
                              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <Icon className="w-5 h-5 text-primary" />
                                  <span className="font-semibold">{sub.label}</span>
                                </div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sub.badgeColor}`}>{sub.badge}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{sub.desc}</p>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Payment method */}
                  {form.subscription_type && (
                    <div>
                      <Label className="mb-3 block text-base font-semibold">Mode de paiement</Label>
                      {form.subscription_type === "mensuel_engagement" ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm font-medium">Carte bancaire (prélèvement automatique)</span>
                          <Badge variant="outline" className="ml-auto">Sélectionné</Badge>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { v: "carte", label: "Carte bancaire", sub: "Prélèvement automatique", icon: CreditCard },
                            { v: "mobile_money", label: "Mobile Money", sub: "Virement à valider manuellement", icon: Smartphone },
                          ].map(m => {
                            const Icon = m.icon;
                            return (
                              <button
                                key={m.v}
                                onClick={() => update("payment_method", m.v)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${form.payment_method === m.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                              >
                                <Icon className="w-5 h-5 mb-2 text-primary" />
                                <p className="font-semibold text-sm">{m.label}</p>
                                <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {form.payment_method === "mobile_money" && (
                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                          ⚠️ Les paiements par Mobile Money nécessitent une validation manuelle par notre équipe avant activation.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label>Titre du projet *</Label>
                    <Input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Ex: Construction villa Ouagadougou" className="mt-1" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={form.description}
                      onChange={e => update("description", e.target.value)}
                      placeholder="Décrivez votre projet en détail : superficie, matériaux souhaités, contraintes particulières..."
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Ville / Localité</Label>
                      <Input value={form.city} onChange={e => update("city", e.target.value)} placeholder="Ex: Ouagadougou" className="mt-1" />
                    </div>
                    <div>
                      <Label>Budget estimé (EUR)</Label>
                      <Input value={form.budget} type="number" onChange={e => update("budget", e.target.value)} placeholder="Ex: 25000" className="mt-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Summary */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-xl p-5 space-y-3 text-sm">
                    {[
                      { label: "Projet", value: form.title },
                      { label: "Type", value: projectTypes.find(p => p.v === form.type)?.label },
                      { label: "Durée", value: form.project_duration === "ponctuel" ? "Prestation ponctuelle" : "Long terme" },
                      { label: "Formule", value: form.subscription_type === "mensuel_engagement" ? "Mensuel avec engagement" : form.subscription_type === "mensuel_sans_engagement" ? "Mensuel sans engagement" : "Forfait" },
                      { label: "Paiement", value: form.payment_method === "carte" ? "Carte bancaire" : "Mobile Money" },
                      { label: "Localisation", value: [form.city, form.country].filter(Boolean).join(", ") },
                      { label: "Budget estimé", value: form.budget ? `${Number(form.budget).toLocaleString("fr-FR")} €` : "Non précisé" },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium text-right">{row.value || "—"}</span>
                      </div>
                    ))}
                  </div>
                  {form.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{form.description}</p>
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                    <strong>Prochaine étape :</strong> Après soumission, notre équipe vous contactera sous 48h pour valider les détails et lancer officiellement le suivi de votre projet.
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
                  Suivant <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={saving || !canNext()}>
                  {saving ? "Envoi en cours..." : "Soumettre le projet"}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}