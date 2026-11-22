import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projectsApi } from "@/api/projects";
import { reportsApi } from "@/api/reports";
import { paymentsApi } from "@/api/payments";
import { partnersApi } from "@/api/partners";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, MapPin, Calendar, CreditCard, Image, MessageCircle, FileText, PenLine, CheckCircle, Shield, Globe, Hash, User, Camera, Mic, CheckSquare, Building2, Scale, Home, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectTimeline from "../components/ProjectTimeline";
import PhotoGallery from "../components/PhotoGallery";
import ChatBox from "../components/ChatBox";
import ContractSignModal from "../components/ContractSignModal";
import ContractTab from "../components/ContractTab";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusLabels = {
  brouillon: "Brouillon", soumis: "Soumis", accepte: "Accepté",
  prise_de_contact: "En contact", en_discussion: "Discussion",
  contrat: "Contrat", paiement: "Paiement", reporting: "Suivi terrain",
  en_attente: "En attente", en_cours: "En cours", pause: "En pause",
  termine: "Terminé", annule: "Annulé",
  recherche_bien: "Recherche", selection_bien: "Sélection", procuration: "Procuration", notaire: "Notaire",
  choix_partenaire: "Choix partenaire", reunion_cadrage: "Cadrage",
};

const PIPELINES = {
  achat_immobilier: [
    { status: "soumis",           label: "Dossier soumis",         desc: "Votre demande a été envoyée à l'équipe." },
    { status: "accepte",          label: "Dossier accepté",         desc: "L'équipe a validé votre projet." },
    { status: "prise_de_contact", label: "Premier contact",         desc: "Un agent prend contact avec vous." },
    { status: "en_discussion",    label: "Discussion",              desc: "Échanges sur votre projet et vos critères." },
    { status: "recherche_bien",   label: "Recherche de bien",       desc: "L'agent recherche des biens correspondants." },
    { status: "selection_bien",   label: "Sélection du bien",       desc: "Un bien a été identifié et présenté." },
    { status: "procuration",      label: "Procuration",             desc: "Établissement de la procuration pour acte." },
    { status: "notaire",          label: "Chez le notaire",         desc: "Signature de l'acte authentique." },
    { status: "termine",          label: "Terminé",                 desc: "Votre bien vous appartient." },
  ],
  construction: [
    { status: "soumis",           label: "Dossier soumis",          desc: "Votre demande a été envoyée à l'équipe." },
    { status: "accepte",          label: "Dossier accepté",         desc: "L'équipe a validé votre projet." },
    { status: "choix_partenaire", label: "Choix du partenaire",     desc: "Sélectionnez l'expert BTP pour votre projet." },
    { status: "reunion_cadrage",  label: "Réunion de cadrage",      desc: "Réunion avec le partenaire pour définir le projet." },
    { status: "contrat",          label: "Contrat",                 desc: "Signature du contrat de prestation." },
    { status: "paiement",         label: "Paiement",                desc: "Mise en place du plan de financement." },
    { status: "reporting",        label: "Suivi chantier",          desc: "Rapports hebdomadaires et photos terrain." },
    { status: "termine",          label: "Terminé",                 desc: "Votre projet est livré." },
  ],
  default: [
    { status: "soumis",           label: "Dossier soumis",          desc: "Votre demande a été envoyée à l'équipe." },
    { status: "accepte",          label: "Dossier accepté",         desc: "L'équipe a validé votre projet." },
    { status: "prise_de_contact", label: "Premier contact",         desc: "Un agent prend contact avec vous." },
    { status: "en_discussion",    label: "Discussion",              desc: "Échanges sur les modalités." },
    { status: "contrat",          label: "Contrat",                 desc: "Signature du contrat." },
    { status: "paiement",         label: "Paiement",                desc: "Mise en place du financement." },
    { status: "reporting",        label: "Suivi",                   desc: "Suivi actif du projet." },
    { status: "termine",          label: "Terminé",                 desc: "Projet livré." },
  ],
};

const PARTNER_SPECIALTY_LABEL = {
  btp:        { label: "Bureau BTP",       Icon: Building2 },
  juridique:  { label: "Cabinet juridique", Icon: Scale },
  notarial:   { label: "Étude notariale",  Icon: FileText },
  immobilier: { label: "Agence immobilière",Icon: Home },
  autre:      { label: "Autre",            Icon: HelpCircle },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [reports, setReports] = useState([]);
  const [payments, setPayments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectingPartner, setSelectingPartner] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [reportDetail, setReportDetail] = useState(null);

  useEffect(() => {
    async function load() {
      const proj = await projectsApi.get(id);
      setProject(proj);
      if (proj) {
        const fetches = [
          reportsApi.list({ projectId: proj.id }),
          paymentsApi.list(),
        ];
        if (proj.status === "choix_partenaire") {
          const specialty = proj.type === "construction" ? "btp" : undefined;
          fetches.push(partnersApi.list(specialty ? { specialty } : {}));
        }
        const results = await Promise.all(fetches);
        setReports(results[0]);
        setPayments(results[1]);
        if (results[2]) setPartners(results[2]);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Projet introuvable.</p>
        <Link to="/projects"><Button variant="link" className="mt-4">Retour aux projets</Button></Link>
      </div>
    );
  }

  const cover = project.coverImageUrl || project.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=1200&h=400&fit=crop";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux projets
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-56 lg:h-72">
        <img src={cover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            {statusLabels[project.status]}
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-white">{project.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
            {project.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{project.city}, {project.country}</span>}
            {project.startDate && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(project.startDate).toLocaleDateString("fr-FR")}</span>}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Progression globale</span>
          <span className="text-2xl font-heading font-bold text-primary">{project.progress || 0}%</span>
        </div>
        <Progress value={project.progress || 0} className="h-3" />
        {project.budget && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-sm">
            <span className="text-muted-foreground">Budget total</span>
            <span className="font-heading font-bold text-lg">{project.budget?.toLocaleString("fr-FR")} €</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      {/* Contract signature CTA */}
      {project.signatureStatus === "en_attente" && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Votre contrat est prêt à signer</p>
              <p className="text-xs text-muted-foreground">Signature électronique sécurisée et juridiquement valable</p>
            </div>
          </div>
          <Button onClick={() => setShowContract(true)}>
            <PenLine className="w-4 h-4 mr-2" /> Signer maintenant
          </Button>
        </div>
      )}
      {project.signatureStatus === "signe" && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-700 font-medium">Contrat signé le {new Date(project.signatureDate).toLocaleDateString("fr-FR")}</p>
        </div>
      )}

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl flex-wrap h-auto">
          <TabsTrigger value="timeline" className="rounded-lg gap-2">Avancement</TabsTrigger>
          <TabsTrigger value="photos" className="rounded-lg gap-2"><Image className="w-4 h-4" />Photos</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg gap-2"><FileText className="w-4 h-4" />Rapports</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg gap-2"><CreditCard className="w-4 h-4" />Paiements</TabsTrigger>
          <TabsTrigger value="contrat" className="rounded-lg gap-2"><Shield className="w-4 h-4" />Contrat</TabsTrigger>
          <TabsTrigger value="chat" className="rounded-lg gap-2"><MessageCircle className="w-4 h-4" />Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border/50 p-6">
              <h3 className="font-heading font-semibold mb-6">Avancement du projet</h3>
              {(() => {
                const pipeline = PIPELINES[project.type] || PIPELINES.default;
                const currentIdx = project.status === "termine"
                  ? pipeline.length
                  : pipeline.findIndex(s => s.status === project.status);
                const effectiveIdx = currentIdx === -1 ? 0 : currentIdx;
                return (
                  <div>
                    {pipeline.map((step, idx) => {
                      const isDone = idx < effectiveIdx || project.status === "termine";
                      const isCurrent = idx === effectiveIdx && project.status !== "termine";
                      return (
                        <div key={step.status} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                              isDone ? "bg-primary border-primary" : isCurrent ? "bg-primary/10 border-primary" : "bg-muted border-border"
                            }`}>
                              {isDone ? (
                                <CheckCircle className="w-4 h-4 text-primary-foreground" />
                              ) : (
                                <span className={`text-xs font-bold ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>{idx + 1}</span>
                              )}
                            </div>
                            {idx < pipeline.length - 1 && (
                              <div className={`w-0.5 mt-1 ${isCurrent ? "h-12" : "h-8"} ${isDone ? "bg-primary" : "bg-border"}`} />
                            )}
                          </div>
                          <div className={`pb-6 flex-1 pt-1 ${idx === pipeline.length - 1 ? "pb-0" : ""}`}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-semibold text-sm ${isCurrent ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">En cours</span>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 ${isCurrent || isDone ? "text-muted-foreground" : "text-muted-foreground/40"}`}>{step.desc}</p>

                            {isCurrent && step.status === "choix_partenaire" && (
                              <div className="mt-4 space-y-3">
                                <p className="text-sm font-medium">Choisissez votre partenaire :</p>
                                {partners.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">Aucun partenaire disponible pour le moment.</p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {partners.map(partner => {
                                      const spec = PARTNER_SPECIALTY_LABEL[partner.specialty] || PARTNER_SPECIALTY_LABEL.autre;
                                      const SpecIcon = spec.Icon;
                                      return (
                                        <div key={partner.id} className="bg-background rounded-xl border border-border/60 p-4 flex gap-3 hover:border-primary/50 transition-colors group">
                                          <div
                                            className="shrink-0 cursor-pointer"
                                            onClick={() => navigate(`/partners/${partner.id}`)}
                                          >
                                            {partner.photoUrl ? (
                                              <img src={partner.photoUrl} alt={partner.name} className="w-12 h-12 rounded-xl object-cover" />
                                            ) : (
                                              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                                <SpecIcon className="w-6 h-6 text-muted-foreground" />
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <button
                                              className="font-semibold text-sm truncate block hover:text-primary transition-colors text-left w-full"
                                              onClick={() => navigate(`/partners/${partner.id}`)}
                                            >
                                              {partner.name}
                                            </button>
                                            <p className="text-xs text-muted-foreground">{spec.label}</p>
                                            {partner.city && <p className="text-xs text-muted-foreground">{partner.city}</p>}
                                            {partner.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{partner.description}</p>}
                                            <div className="flex gap-2 mt-3">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs"
                                                onClick={() => navigate(`/partners/${partner.id}`)}
                                              >
                                                Voir le profil
                                              </Button>
                                              <Button
                                                size="sm"
                                                className="flex-1"
                                                disabled={selectingPartner}
                                                onClick={async () => {
                                                  setSelectingPartner(true);
                                                  try {
                                                    const updated = await partnersApi.selectForProject(project.id, partner.id);
                                                    setProject(updated);
                                                  } catch (e) {
                                                    alert(e.message || "Erreur lors de la sélection");
                                                  } finally {
                                                    setSelectingPartner(false);
                                                  }
                                                }}
                                              >
                                                {selectingPartner ? "Sélection..." : "Choisir"}
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {project.partner && (
              <div className="bg-card rounded-2xl border border-border/50 p-5">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Partenaire assigné
                </h3>
                {(() => {
                  const p = project.partner;
                  const spec = PARTNER_SPECIALTY_LABEL[p.specialty] || PARTNER_SPECIALTY_LABEL.autre;
                  const SpecIcon = spec.Icon;
                  return (
                    <div className="flex gap-4 items-start">
                      <button
                        className="shrink-0"
                        onClick={() => navigate(`/partners/${p.id}`)}
                      >
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-16 h-16 rounded-xl object-cover hover:opacity-90 transition-opacity" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                            <SpecIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </button>
                      <div className="flex-1">
                        <button
                          className="font-heading font-bold hover:text-primary transition-colors text-left"
                          onClick={() => navigate(`/partners/${p.id}`)}
                        >
                          {p.name}
                        </button>
                        <p className="text-sm text-muted-foreground">{spec.label}</p>
                        {p.city && <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" />{p.city}{p.country ? `, ${p.country}` : ""}</p>}
                        {p.email && <p className="text-sm text-muted-foreground mt-1">{p.email}</p>}
                        {p.phone && <p className="text-sm text-muted-foreground">{p.phone}</p>}
                        {p.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>}
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3"
                          onClick={() => navigate(`/partners/${p.id}`)}
                        >
                          Voir le profil complet →
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {project.milestones?.length > 0 && (
              <ProjectTimeline milestones={project.milestones} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <PhotoGallery photos={project.photos} />
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Aucun rapport disponible.</div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-card rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={async () => {
                    try { setReportDetail(await reportsApi.get(report.id)); }
                    catch { setReportDetail(report); }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{report.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.content}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                        <span>{new Date(report.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                        {report._count?.photos > 0 && <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{report._count.photos}</span>}
                        {report._count?.checklistItems > 0 && <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" />{report._count.checklistItems}</span>}
                        {report.audioNotesUrl && <span className="flex items-center gap-1"><Mic className="w-3 h-3" />Audio</span>}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-3 shrink-0">{report.type}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="space-y-3">
            {payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Aucun paiement enregistré.</div>
            ) : (
              payments.map((pay) => (
                <div key={pay.id} className="bg-card rounded-xl border border-border/50 p-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{pay.description || pay.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {pay.nextDueDate ? new Date(pay.nextDueDate).toLocaleDateString("fr-FR") : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-lg">{pay.amount?.toLocaleString("fr-FR")} €</p>
                    <Badge variant={pay.status === "a_jour" ? "default" : "outline"} className={pay.status === "a_jour" ? "bg-green-500" : ""}>
                      {pay.status === "a_jour" ? "À jour" : pay.status === "en_attente_validation" ? "En attente" : pay.status === "en_retard" ? "En retard" : pay.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="contrat">
          <ContractTab project={project} onSign={() => setShowContract(true)} />
        </TabsContent>

        <TabsContent value="chat">
          <ChatBox projectId={project.id} currentUserEmail={user?.email} />
        </TabsContent>
      </Tabs>

      <ContractSignModal
        project={project}
        open={showContract}
        onClose={() => setShowContract(false)}
        onSigned={(updated) => setProject(updated)}
      />

      {/* Détail rapport */}
      <Dialog open={!!reportDetail} onOpenChange={() => setReportDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {reportDetail && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">{reportDetail.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                  <Badge variant="outline">{reportDetail.type}</Badge>
                  <span>{new Date(reportDetail.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  {reportDetail.latitude && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{reportDetail.latitude.toFixed(4)}, {reportDetail.longitude?.toFixed(4)}</span>}
                </div>
                {reportDetail.content && (
                  <div className="bg-muted/30 rounded-xl p-4 text-sm whitespace-pre-wrap">{reportDetail.content}</div>
                )}
                {reportDetail.checklistItems?.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-primary" /> Checklist
                      <span className="text-xs font-normal text-muted-foreground">
                        ({reportDetail.checklistItems.filter(c => c.checked).length}/{reportDetail.checklistItems.length} validés)
                      </span>
                    </p>
                    <div className="space-y-1.5">
                      {reportDetail.checklistItems.map(c => (
                        <div key={c.id} className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm ${c.checked ? "bg-green-500/5 border border-green-500/20" : "bg-muted/30 border border-border/50"}`}>
                          <span className={`mt-0.5 font-bold ${c.checked ? "text-green-600" : "text-muted-foreground"}`}>{c.checked ? "✓" : "○"}</span>
                          <div>
                            <span className={c.checked ? "line-through text-muted-foreground" : ""}>{c.item}</span>
                            {c.note && <p className="text-xs text-muted-foreground mt-0.5">{c.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {reportDetail.photos?.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><Camera className="w-4 h-4 text-primary" /> Photos ({reportDetail.photos.length})</p>
                    <div className="grid grid-cols-3 gap-2">
                      {reportDetail.photos.map(ph => (
                        <div key={ph.id} className="relative aspect-square rounded-xl overflow-hidden">
                          <img src={ph.url} alt={ph.caption || ""} className="w-full h-full object-cover" />
                          {ph.caption && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5 truncate">{ph.caption}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {reportDetail.audioNotesUrl && (
                  <div>
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><Mic className="w-4 h-4 text-primary" /> Note audio</p>
                    <audio src={reportDetail.audioNotesUrl} controls className="w-full" />
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}