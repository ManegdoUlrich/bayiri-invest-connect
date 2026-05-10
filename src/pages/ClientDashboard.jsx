import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import { paymentsApi } from "@/api/payments";
import { useAuth } from "@/lib/AuthContext";
import { useLang } from "@/lib/LangContext";
import CreateProjectFlow from "../components/CreateProjectFlow";
import { translations } from "@/lib/i18n";
import { FolderOpen, CreditCard, FileText, MapPin } from "lucide-react";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ClientDashboard() {
  const { lang } = useLang();
  const [showCreate, setShowCreate] = useState(false);
  const tx = translations[lang].dashboard;
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectsApi.list(), paymentsApi.list()])
      .then(([projs, pays]) => { setProjects(projs); setPayments(pays); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.status === "en_cours");
  const totalPaid = payments.filter(p => p.status === "a_jour").reduce((s, p) => s + (p.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.status === "en_attente_validation" || p.status === "en_retard");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
          {tx.welcome}{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">{tx.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderOpen} label={tx.active_projects} value={activeProjects.length} subtitle={`${projects.length} ${tx.total}`} />
        <StatCard icon={MapPin} label={tx.countries} value={[...new Set(projects.map(p => p.country).filter(Boolean))].length} />
        <StatCard icon={CreditCard} label={tx.invested} value={`${totalPaid.toLocaleString("fr-FR")} €`} />
        <StatCard icon={FileText} label={tx.pending} value={pendingPayments.length} subtitle={pendingPayments.length > 0 ? tx.action_required : tx.up_to_date} />
      </div>

      {/* Active projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold">{tx.my_projects}</h2>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" /> Nouveau projet
          </Button>
        </div>
        {projects.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">{tx.no_project_title}</h3>
            <p className="text-muted-foreground">{tx.no_project_sub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
      <CreateProjectFlow open={showCreate} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); }} />
    </div>
  );
}