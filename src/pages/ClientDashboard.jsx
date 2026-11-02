import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import { paymentsApi } from "@/api/payments";
import { useAuth } from "@/lib/AuthContext";
import { useLang } from "@/lib/LangContext";
import CreateProjectFlow from "../components/CreateProjectFlow";
import { translations } from "@/lib/i18n";
import { FolderOpen, CreditCard, AlertCircle, MapPin, Plus, ArrowRight, TrendingUp } from "lucide-react";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import { Button } from "@/components/ui/button";

const PIPELINE_LABEL = {
  soumis:           { text: "En cours d'analyse",   color: "text-blue-600 bg-blue-500/10"   },
  accepte:          { text: "Accepté",               color: "text-indigo-600 bg-indigo-500/10" },
  prise_de_contact: { text: "En contact",            color: "text-violet-600 bg-violet-500/10" },
  contrat:          { text: "Contrat en préparation",color: "text-purple-600 bg-purple-500/10" },
  paiement:         { text: "En attente de paiement",color: "text-amber-600 bg-amber-500/10"  },
  reporting:        { text: "Suivi terrain actif",   color: "text-cyan-600 bg-cyan-500/10"   },
  termine:          { text: "Terminé",               color: "text-emerald-600 bg-emerald-500/10" },
  annule:           { text: "Annulé",                color: "text-rose-600 bg-rose-500/10"   },
};

function PipelineStatusBadge({ status }) {
  const cfg = PIPELINE_LABEL[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
      {cfg.text}
    </span>
  );
}

function ProjectPipelineCard({ project }) {
  const isActive = ["soumis","accepte","prise_de_contact","contrat","paiement","reporting"].includes(project.status);
  return (
    <div className={`bg-card rounded-2xl border p-5 space-y-3 transition-shadow hover:shadow-md ${isActive ? "border-primary/20" : "border-border/50"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-heading font-semibold truncate">{project.title}</h4>
          {(project.city || project.country) && (
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />{project.city}{project.country ? `, ${project.country}` : ""}
            </p>
          )}
        </div>
        <PipelineStatusBadge status={project.status} />
      </div>
      {project.budget && (
        <div className="flex items-center justify-between text-sm pt-2 border-t border-border/40">
          <span className="text-muted-foreground">Budget</span>
          <span className="font-heading font-bold">{project.budget.toLocaleString("fr-FR")} €</span>
        </div>
      )}
    </div>
  );
}

export default function ClientDashboard() {
  const { lang }   = useLang();
  const { user }   = useAuth();
  const tx         = translations[lang].dashboard;
  const [showCreate, setShowCreate] = useState(false);
  const [projects, setProjects]     = useState([]);
  const [payments, setPayments]     = useState([]);
  const [loading,  setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([projectsApi.list(), paymentsApi.list()])
      .then(([projs, pays]) => { setProjects(projs); setPayments(pays); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const activeProjects  = projects.filter(p => ["soumis","accepte","prise_de_contact","contrat","paiement","reporting"].includes(p.status));
  const completedCount  = projects.filter(p => p.status === "termine").length;
  const totalPaid       = payments.filter(p => p.status === "a_jour").reduce((s, p) => s + (p.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.status === "en_attente_validation" || p.status === "en_retard");
  const countries       = [...new Set(projects.map(p => p.country).filter(Boolean))];

  const firstName = user?.fullName?.split(" ")[0] || "";
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="relative overflow-hidden bg-card rounded-2xl border border-border/50 p-6 lg:p-8">
        {/* Decorative background circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/5 pointer-events-none" />
        <div className="absolute -bottom-6 -right-4 w-28 h-28 rounded-full bg-secondary/5 pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
              {greeting}{firstName ? `, ${firstName}` : ""} 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-sm max-w-sm">
              {activeProjects.length > 0
                ? `${activeProjects.length} projet${activeProjects.length > 1 ? "s" : ""} en cours de traitement`
                : "Soumettez votre premier projet pour commencer"}
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="shrink-0 hidden sm:flex">
            <Plus className="w-4 h-4 mr-2" /> Nouveau projet
          </Button>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden">
        <Button onClick={() => setShowCreate(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Nouveau projet
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={FolderOpen}
          label={tx.active_projects}
          value={activeProjects.length}
          subtitle={`${completedCount} terminé${completedCount > 1 ? "s" : ""}`}
          color="default"
        />
        <StatCard
          icon={MapPin}
          label={tx.countries}
          value={countries.length || "—"}
          subtitle={countries[0] || ""}
          color="cyan"
        />
        <StatCard
          icon={TrendingUp}
          label={tx.invested}
          value={totalPaid > 0 ? `${totalPaid.toLocaleString("fr-FR")} €` : "—"}
          color="green"
        />
        <StatCard
          icon={pendingPayments.length > 0 ? AlertCircle : CreditCard}
          label={tx.pending}
          value={pendingPayments.length}
          subtitle={pendingPayments.length > 0 ? tx.action_required : tx.up_to_date}
          color={pendingPayments.length > 0 ? "rose" : "amber"}
        />
      </div>

      {/* Active projects — pipeline view */}
      {activeProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-xl">Projets en cours</h2>
            <button
              onClick={() => document.getElementById("all-projects")?.scrollIntoView({ behavior: "smooth" })}
              className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
            >
              Tout voir <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.slice(0, 3).map(p => <ProjectPipelineCard key={p.id} project={p} />)}
          </div>
        </div>
      )}

      {/* All projects grid */}
      <div id="all-projects">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold">{tx.my_projects}</h2>
          <span className="text-sm text-muted-foreground">{projects.length} projet{projects.length > 1 ? "s" : ""}</span>
        </div>
        {projects.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">{tx.no_project_title}</h3>
            <p className="text-muted-foreground text-sm mb-6">{tx.no_project_sub}</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" /> Créer mon premier projet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>

      <CreateProjectFlow
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => { setShowCreate(false); }}
      />
    </div>
  );
}
