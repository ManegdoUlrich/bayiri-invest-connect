import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projectsApi } from "@/api/projects";
import { reportsApi } from "@/api/reports";
import { paymentsApi } from "@/api/payments";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, MapPin, Calendar, CreditCard, Image, MessageCircle, FileText, PenLine, CheckCircle, Shield, Globe, Hash, User, Camera, Mic, CheckSquare } from "lucide-react";
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
  en_attente: "En attente", en_cours: "En cours", pause: "En pause", termine: "Terminé", annule: "Annulé",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [reports, setReports] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContract, setShowContract] = useState(false);
  const [reportDetail, setReportDetail] = useState(null);

  useEffect(() => {
    async function load() {
      const proj = await projectsApi.get(id);
      setProject(proj);
      if (proj) {
        const [reps, pays] = await Promise.all([
          reportsApi.list({ projectId: proj.id }),
          paymentsApi.list(),
        ]);
        setReports(reps);
        setPayments(pays);
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
          <ProjectTimeline milestones={project.milestones} />
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