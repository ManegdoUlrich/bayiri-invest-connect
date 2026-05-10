import { useState, useEffect } from "react";
import { missionsApi } from "@/api/missions";
import { projectsApi } from "@/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { sendNotification } from "@/lib/notifications";
import { MapPin, Clock, CheckCircle, Play, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusLabels = { planifiee: "Planifiée", en_cours: "En cours", terminee: "Terminée", reportee: "Reportée" };
const statusIcons = { planifiee: Clock, en_cours: Play, terminee: CheckCircle, reportee: Calendar };

export default function AgentMissions() {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      const m = await missionsApi.list();
      setMissions(m);
      setLoading(false);
    }
    load();
  }, []);

  const updateStatus = async (mission, newStatus) => {
    await missionsApi.update(mission.id, { status: newStatus });
    setMissions(prev => prev.map(m => m.id === mission.id ? { ...m, status: newStatus } : m));
    setSelected(null);

    // Notify client when a mission/milestone is completed
    if (newStatus === "terminee" && mission.projectId) {
      const project = await projectsApi.get(mission.projectId);
      if (project?.client?.email) {
        await sendNotification({
          userId: project.clientId,
          type: "milestone_validated",
          title: "Étape clé validée sur votre projet",
          message: `Une étape clé a été validée par votre agent sur le terrain : "${mission.title}".`,
          projectId: mission.projectId,
          projectTitle: project.title,
        });
      }
    }
  };

  const filtered = missions.filter(m => filter === "all" || m.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Missions</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="planifiee">Planifiées</SelectItem>
            <SelectItem value="en_cours">En cours</SelectItem>
            <SelectItem value="terminee">Terminées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((mission) => {
          const Icon = statusIcons[mission.status] || Clock;
          return (
            <button
              key={mission.id}
              onClick={() => setSelected(mission)}
              className="w-full text-left bg-card rounded-xl border border-border/50 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{mission.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{mission.address || "Adresse non définie"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mission.date && new Date(mission.date).toLocaleDateString("fr-FR")} · {mission.time || ""}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  <Icon className="w-3 h-3 mr-1" />
                  {statusLabels[mission.status]}
                </Badge>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Aucune mission trouvée.</div>
        )}
      </div>

      {/* Mission detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm space-y-2">
              <p><span className="text-muted-foreground">Adresse:</span> {selected?.address || "Non définie"}</p>
              <p><span className="text-muted-foreground">Date:</span> {selected?.date && new Date(selected.date).toLocaleDateString("fr-FR")}</p>
              <p><span className="text-muted-foreground">Heure:</span> {selected?.time || "Non définie"}</p>
              <p><span className="text-muted-foreground">Priorité:</span> {selected?.priority}</p>
              {selected?.description && <p className="pt-2">{selected.description}</p>}
              {selected?.notes && <p className="text-muted-foreground italic">{selected.notes}</p>}
            </div>
            <div className="flex gap-2 pt-4">
              {selected?.status === "planifiee" && (
                <Button onClick={() => updateStatus(selected, "en_cours")} className="flex-1">
                  <Play className="w-4 h-4 mr-2" /> Démarrer
                </Button>
              )}
              {selected?.status === "en_cours" && (
                <Button onClick={() => updateStatus(selected, "terminee")} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" /> Terminer
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}