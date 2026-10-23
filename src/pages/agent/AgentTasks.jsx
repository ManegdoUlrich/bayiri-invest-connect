import { useState, useEffect } from "react";
import { tasksApi } from "@/api/tasks";
import { useAuth } from "@/lib/AuthContext";
import { CheckCircle, Clock, Calendar, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import StatCard from "../../components/StatCard";

const priorityConfig = {
  basse:    { label: "Basse",   color: "bg-slate-100 text-slate-600 border-slate-300" },
  normale:  { label: "Normale", color: "bg-blue-50 text-blue-600 border-blue-200" },
  haute:    { label: "Haute",   color: "bg-orange-50 text-orange-600 border-orange-200" },
  urgente:  { label: "Urgente", color: "bg-red-50 text-red-600 border-red-200" },
};

export default function AgentTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const t = await tasksApi.list();
      setTasks(t);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = tasks.filter(t => filterStatus === "all" || t.status === filterStatus);

  const openComplete = (task) => {
    setSelected(task);
    setComment(task.completionComment || "");
  };

  const markDone = async () => {
    setSaving(true);
    const updated = await tasksApi.update(selected.id, {
      status: "terminee",
      completionComment: comment,
    });
    setTasks(prev => prev.map(t => t.id === selected.id ? updated : t));
    setSaving(false);
    setSelected(null);
  };

  const markInProgress = async (task) => {
    const updated = await tasksApi.update(task.id, { status: "en_cours" });
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  const done = tasks.filter(t => t.status === "terminee").length;
  const pending = tasks.filter(t => t.status !== "terminee").length;
  const overdue = tasks.filter(t => t.status !== "terminee" && t.dueDate && new Date(t.dueDate) < new Date()).length;

  const statuses = ["all", "a_faire", "en_cours", "terminee"];
  const statusLabels = { all: "Toutes", a_faire: "À faire", en_cours: "En cours", terminee: "Terminées" };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-heading font-bold">Mes tâches</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Clock} label="En attente" value={pending} />
        <StatCard icon={CheckCircle} label="Terminées" value={done} />
        <StatCard icon={AlertCircle} label="En retard" value={overdue} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">Aucune tâche.</div>}
        {filtered.map(task => {
          const pc = priorityConfig[task.priority] || priorityConfig.normale;
          const isOverdue = task.status !== "terminee" && task.dueDate && new Date(task.dueDate) < new Date();
          const isDone = task.status === "terminee";
          return (
            <div key={task.id} className={`bg-card rounded-xl border p-5 space-y-3 transition-shadow hover:shadow-md ${isDone ? "border-green-200 opacity-80" : isOverdue ? "border-red-200" : "border-border/50"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isDone && <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />}
                    <p className={`font-semibold ${isDone ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
                    <Badge variant="outline" className={pc.color}>{pc.label}</Badge>
                    {isOverdue && <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">En retard</Badge>}
                  </div>
                  {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {task.project?.title && <span>Projet : <span className="font-medium text-foreground">{task.project?.title}</span></span>}
                    {task.dueDate && (
                      <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </div>
                </div>
                {!isDone && (
                  <div className="flex gap-2 shrink-0">
                    {task.status === "a_faire" && (
                      <Button size="sm" variant="outline" onClick={() => markInProgress(task)}>
                        <Clock className="w-3.5 h-3.5 mr-1" /> Démarrer
                      </Button>
                    )}
                    <Button size="sm" onClick={() => openComplete(task)}>
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Terminer
                    </Button>
                  </div>
                )}
              </div>
              {task.completionComment && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{task.completionComment}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Marquer comme terminée</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Tâche : <span className="font-medium text-foreground">{selected?.title}</span></p>
            <div>
              <Label>Commentaire de clôture</Label>
              <Textarea
                rows={3}
                placeholder="Décrivez ce qui a été réalisé, les observations importantes..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>Annuler</Button>
              <Button onClick={markDone} disabled={saving}>
                <CheckCircle className="w-4 h-4 mr-2" />{saving ? "Enregistrement..." : "Confirmer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}