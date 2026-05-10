import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projectsApi } from "@/api/projects";
import { reportsApi } from "@/api/reports";
import { paymentsApi } from "@/api/payments";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, MapPin, Calendar, CreditCard, Image, MessageCircle, FileText, PenLine, CheckCircle, Shield, Globe, Hash, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectTimeline from "../components/ProjectTimeline";
import PhotoGallery from "../components/PhotoGallery";
import ChatBox from "../components/ChatBox";
import ContractSignModal from "../components/ContractSignModal";
import ContractTab from "../components/ContractTab";

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
          <p className="text-sm text-green-700 font-medium">Contrat signé le {new Date(project.signature_date).toLocaleDateString("fr-FR")}</p>
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
                <div key={report.id} className="bg-card rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{report.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{report.content?.slice(0, 150)}...</p>
                    </div>
                    <Badge variant="outline">{report.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(report.created_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
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
                      {pay.due_date ? new Date(pay.due_date).toLocaleDateString("fr-FR") : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-lg">{pay.amount?.toLocaleString("fr-FR")} €</p>
                    <Badge variant={pay.status === "paye" ? "default" : "outline"} className={pay.status === "paye" ? "bg-green-500" : ""}>
                      {pay.status === "paye" ? "Payé" : pay.status === "en_attente" ? "En attente" : pay.status}
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
    </div>
  );
}