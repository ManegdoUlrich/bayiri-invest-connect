import { useState, useEffect } from "react";
import { missionsApi } from "@/api/missions";
import { reportsApi } from "@/api/reports";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { MapPin, FileText, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StatCard from "../../components/StatCard";

const priorityColors = {
  basse: "text-blue-600 bg-blue-500/10",
  normale: "text-green-600 bg-green-500/10",
  haute: "text-orange-600 bg-orange-500/10",
  urgente: "text-red-600 bg-red-500/10",
};

export default function AgentDashboard() {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [m, r] = await Promise.all([
          missionsApi.list(),
          reportsApi.list(),
        ]);
        setMissions(m);
        setReports(r);
      } catch (err) {
        console.error("Erreur de chargement du tableau de bord agent :", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todayMissions = missions.filter(m => {
    const mDate = new Date(m.date).toISOString().split("T")[0];
    return mDate === today;
  });
  const pending = missions.filter(m => m.status === "planifiee");
  const completed = missions.filter(m => m.status === "terminee");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Bonjour{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""} 🌍
        </h1>
        <p className="text-muted-foreground mt-1">Votre espace agent terrain</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MapPin} label="Missions du jour" value={todayMissions.length} />
        <StatCard icon={Clock} label="Planifiées" value={pending.length} />
        <StatCard icon={CheckCircle} label="Terminées" value={completed.length} />
        <StatCard icon={FileText} label="Rapports soumis" value={reports.filter(r => r.status === "soumis" || r.status === "valide").length} />
      </div>

      {/* Today's missions */}
      <div>
        <h2 className="text-xl font-heading font-bold mb-4">Missions du jour</h2>
        {todayMissions.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-8 text-center text-muted-foreground">
            Aucune mission planifiée pour aujourd'hui.
          </div>
        ) : (
          <div className="space-y-3">
            {todayMissions.map((mission) => (
              <Link key={mission.id} to="/agent/missions" className="block bg-card rounded-xl border border-border/50 p-5 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${priorityColors[mission.priority] || ""}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{mission.title}</h4>
                    <p className="text-sm text-muted-foreground">{mission.address} · {mission.time || "Horaire non défini"}</p>
                  </div>
                  <Badge variant="outline">{mission.priority}</Badge>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}