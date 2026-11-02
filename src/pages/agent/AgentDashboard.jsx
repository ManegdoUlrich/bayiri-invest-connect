import { useState, useEffect } from "react";
import { missionsApi } from "@/api/missions";
import { reportsApi } from "@/api/reports";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { MapPin, FileText, CheckCircle, Clock, ChevronRight, AlertCircle, Calendar, BarChart3 } from "lucide-react";
import StatCard from "../../components/StatCard";

const PRIORITY_CONFIG = {
  basse:   { label: "Basse",   color: "border-l-blue-400",   icon: "bg-blue-500/10 text-blue-600",   dot: "bg-blue-400"   },
  normale: { label: "Normale", color: "border-l-emerald-400", icon: "bg-emerald-500/10 text-emerald-600", dot: "bg-emerald-400" },
  haute:   { label: "Haute",   color: "border-l-amber-400",  icon: "bg-amber-500/10 text-amber-600", dot: "bg-amber-400"  },
  urgente: { label: "Urgente", color: "border-l-rose-500",   icon: "bg-rose-500/10 text-rose-600",   dot: "bg-rose-500"   },
};

const STATUS_LABELS = {
  planifiee: "Planifiée",
  en_cours:  "En cours",
  terminee:  "Terminée",
  reportee:  "Reportée",
};

function MissionCard({ mission }) {
  const cfg = PRIORITY_CONFIG[mission.priority] || PRIORITY_CONFIG.normale;
  return (
    <Link to="/agent/missions" className="group block">
      <div className={`bg-card rounded-xl border border-border/50 border-l-4 ${cfg.color} p-4 hover:shadow-md transition-all duration-200`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.icon}`}>
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-semibold text-sm truncate">{mission.title}</h4>
              <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {mission.address || "Adresse non définie"}
              {mission.time ? ` · ${mission.time}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-muted-foreground hidden sm:block">{cfg.label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ReportRow({ report }) {
  const isValidated = report.status === "valide";
  const isSubmitted = report.status === "soumis";
  return (
    <Link to="/agent/reports" className="group flex items-center gap-3 py-3 border-b border-border/30 last:border-0 hover:bg-muted/20 -mx-1 px-1 rounded transition-colors">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isValidated ? "bg-emerald-500/10 text-emerald-600" : isSubmitted ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground"}`}>
        <FileText className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{report.title}</p>
        <p className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</p>
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isValidated ? "bg-emerald-500/10 text-emerald-600" : isSubmitted ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground"}`}>
        {isValidated ? "Validé" : isSubmitted ? "Soumis" : "Brouillon"}
      </span>
    </Link>
  );
}

export default function AgentDashboard() {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [reports,  setReports]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [m, r] = await Promise.all([missionsApi.list(), reportsApi.list()]);
        setMissions(m);
        setReports(r);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const today = new Date().toISOString().split("T")[0];
  const todayMissions = missions.filter(m => new Date(m.date).toISOString().split("T")[0] === today);
  const urgentMissions = missions.filter(m => m.priority === "urgente" && m.status === "planifiee");
  const pending   = missions.filter(m => m.status === "planifiee");
  const completed = missions.filter(m => m.status === "terminee");
  const recentReports = reports.slice(0, 4);

  const firstName = user?.fullName?.split(" ")[0] || "";
  const todayLabel = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Bonjour{firstName ? `, ${firstName}` : ""} 🌍
          </h1>
          <p className="text-muted-foreground mt-1 text-sm capitalize">{todayLabel}</p>
        </div>
        {urgentMissions.length > 0 && (
          <div className="flex items-center gap-2 bg-rose-500/10 text-rose-600 text-xs font-semibold px-3 py-2 rounded-xl border border-rose-500/20 shrink-0">
            <AlertCircle className="w-4 h-4" />
            {urgentMissions.length} urgente{urgentMissions.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Calendar}     label="Aujourd'hui"   value={todayMissions.length} subtitle={todayMissions.length === 0 ? "Aucune mission" : "mission(s)"} color="blue" />
        <StatCard icon={Clock}        label="Planifiées"    value={pending.length}        color="amber" />
        <StatCard icon={CheckCircle}  label="Terminées"     value={completed.length}      color="green" />
        <StatCard icon={BarChart3}    label="Rapports"      value={reports.filter(r => r.status !== "brouillon").length} color="violet" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Today's missions — wider */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg">Missions du jour</h2>
            <Link to="/agent/missions" className="text-xs text-primary font-medium hover:underline">Tout voir</Link>
          </div>
          {todayMissions.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border/50 p-8 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-medium">Aucune mission aujourd'hui</p>
              <p className="text-xs text-muted-foreground mt-1">Profitez-en pour mettre vos rapports à jour</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayMissions.map(m => <MissionCard key={m.id} mission={m} />)}
            </div>
          )}

          {/* Upcoming missions */}
          {pending.filter(m => new Date(m.date).toISOString().split("T")[0] !== today).slice(0, 3).length > 0 && (
            <>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide pt-2">À venir</h3>
              <div className="space-y-2">
                {pending.filter(m => new Date(m.date).toISOString().split("T")[0] !== today).slice(0, 3).map(m => (
                  <MissionCard key={m.id} mission={m} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Recent reports — narrower */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg">Rapports récents</h2>
            <Link to="/agent/reports" className="text-xs text-primary font-medium hover:underline">Tout voir</Link>
          </div>
          <div className="bg-card rounded-2xl border border-border/50 px-4 py-2">
            {recentReports.length === 0 ? (
              <div className="py-6 text-center">
                <FileText className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucun rapport</p>
              </div>
            ) : (
              recentReports.map(r => <ReportRow key={r.id} report={r} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
