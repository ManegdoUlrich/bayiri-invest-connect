import { useState, useEffect } from "react";
import { tasksApi } from "@/api/tasks";
import { projectsApi } from "@/api/projects";
import { usersApi } from "@/api/users";
import { Plus, Pencil, Trash2, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatCard from "../../components/StatCard";

const priorityConfig = {
  basse:    { label: "Basse",   color: "bg-slate-100 text-slate-600 border-slate-300" },
  normale:  { label: "Normale", color: "bg-blue-50 text-blue-600 border-blue-200" },
  haute:    { label: "Haute",   color: "bg-orange-50 text-orange-600 border-orange-200" },
  urgente:  { label: "Urgente", color: "bg-red-50 text-red-600 border-red-200" },
};

const statusConfig = {
  a_faire:  { label: "À faire",   color: "bg-slate-100 text-slate-600 border-slate-300", icon: Clock },
  en_cours: { label: "En cours",  color: "bg-blue-50 text-blue-600 border-blue-200",     icon: Clock },
  terminee: { label: "Terminée",  color: "bg-green-50 text-green-600 border-green-200",  icon: CheckCircle },
};

const empty = { project_id: "", project_title: "", agent_email: "", title: "", description: "", priority: "normale", status: "a_faire", due_date: "" };

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      tasksApi.list(),
      projectsApi.list(),
      usersApi.list({ role: "agent" }),
    ]).then(([t, p, u]) => {
      setTasks(t);
      setProjects(p);
      setAgents(u);
      setLoading(false);
    });
  }, []);

  const filtered = tasks.filter(t => {
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.agent_email?.toLowerCase().includes(search.toLowerCase()) ||
      t.agentId?.toString().toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCreate = () => { setForm(empty); setDialogOpen(true); };
  const openEdit = (t) => { setForm({ ...t }); setDialogOpen(true); };

  const handleProjectChange = (id) => {
    const proj = projects.find(p => p.id === id);
    setForm(f => ({ ...f, project_id: id, project_title: proj?.title || "" }));
  };

  const save = async () => {
    setSaving(true);
    if (form.id) {
      const updated = await tasksApi.update(form.id, form);
      setTasks(prev => prev.map(t => t.id === form.id ? updated : t));
    } else {
      const created = await tasksApi.create(form);
      setTasks(prev => [created, ...prev]);
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const remove = async (id) => {
    if (!confirm("Supprimer cette tâche ?")) return;
    await tasksApi.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  const done = tasks.filter(t => t.status === "terminee").length;
  const overdue = tasks.filter(t => t.status !== "terminee" && t.due_date && new Date(t.due_date) < new Date()).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-heading font-bold">Tâches</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Nouvelle tâche</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Clock} label="Total tâches" value={tasks.length} />
        <StatCard icon={CheckCircle} label="Terminées" value={done} />
        <StatCard icon={AlertCircle} label="En retard" value={overdue} />
      </div>

      <div className="flex gap-3 flex-wrap">
        <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="a_faire">À faire</SelectItem>
            <SelectItem value="en_cours">En cours</SelectItem>
            <SelectItem value="terminee">Terminées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">Aucune tâche trouvée.</div>}
        {filtered.map(task => {
          const sc = statusConfig[task.status] || statusConfig.a_faire;
          const pc = priorityConfig[task.priority] || priorityConfig.normale;
          const isOverdue = task.status !== "terminee" && task.due_date && new Date(task.due_date) < new Date();
          const StatusIcon = sc.icon;
          return (
            <div key={task.id} className="bg-card rounded-xl border border-border/50 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{task.title}</p>
                  <Badge variant="outline" className={sc.color}><StatusIcon className="w-3 h-3 mr-1" />{sc.label}</Badge>
                  <Badge variant="outline" className={pc.color}>{pc.label}</Badge>
                  {isOverdue && <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">En retard</Badge>}
                </div>
                {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span>Agent : <span className="font-medium text-foreground">{task.agent_email}</span></span>
                  {task.project_title && <span>Projet : <span className="font-medium text-foreground">{task.project_title}</span></span>}
                  {task.due_date && (
                    <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600" : ""}`}>
                      <Calendar className="w-3 h-3" />
                      {new Date(task.due_date).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
                {task.completion_comment && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                    <span className="font-medium">Commentaire agent : </span>{task.completion_comment}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => openEdit(task)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => remove(task.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">{form.id ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Titre *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Projet</Label>
              <Select value={form.project_id} onValueChange={handleProjectChange}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un projet" /></SelectTrigger>
                <SelectContent>
                  {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Agent assigné *</Label>
              <Select value={form.agent_email} onValueChange={v => setForm(f => ({ ...f, agent_email: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un agent" /></SelectTrigger>
                <SelectContent>
                  {agents.map(a => <SelectItem key={a.id} value={a.email}>{a.fullName || a.email}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Priorité</Label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basse">Basse</SelectItem>
                    <SelectItem value="normale">Normale</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_faire">À faire</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="terminee">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date limite</Label>
                <Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={save} disabled={saving || !form.title || !form.agent_email}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}