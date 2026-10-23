import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import { usersApi } from "@/api/users";
import { Plus, Search, Edit, Trash2, PenLine, CheckCircle } from "lucide-react";
import { sendNotification, notifMessages } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const statusLabels = { brouillon: "Brouillon", soumis: "Soumis", en_attente: "En attente", en_cours: "En cours", pause: "En pause", termine: "Terminé", annule: "Annulé" };
const statusColors = { soumis: "bg-blue-100 text-blue-700 border-blue-200", en_attente: "bg-yellow-100 text-yellow-700 border-yellow-200", en_cours: "bg-green-100 text-green-700 border-green-200", pause: "bg-orange-100 text-orange-700 border-orange-200", termine: "bg-gray-100 text-gray-700 border-gray-200", annule: "bg-red-100 text-red-700 border-red-200", brouillon: "bg-muted text-muted-foreground border-border" };
const subLabels = { mensuel_engagement: "Mensuel engagement", mensuel_sans_engagement: "Mensuel flexible", forfait: "Forfait" };

const emptyForm = {
  title: "", description: "", type: "construction", status: "en_attente", clientId: "", agentId: "",
  country: "", city: "", budget: "", startDate: "", endDate: "", progress: 0,
  amountPaid: "", adminNotes: "", tags: [],
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [p, u] = await Promise.all([
        projectsApi.list(),
        usersApi.list(),
      ]);
      setProjects(p);
      setUsers(u);
      setLoading(false);
    }
    load();
  }, []);

  const clients = users.filter(u => u.role === "client");
  const agents = users.filter(u => u.role === "agent");

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      ...emptyForm, ...p,
      budget:     p.budget?.toString()     || "",
      amountPaid: p.amountPaid?.toString() || "",
      tags:       p.tags || [],
      adminNotes: p.adminNotes || "",
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const data = {
      ...form,
      budget:     form.budget     ? parseFloat(form.budget)     : undefined,
      amountPaid: form.amountPaid ? parseFloat(form.amountPaid) : undefined,
      progress:   parseInt(form.progress) || 0,
    };
    if (editId) {
      const oldProject = projects.find(p => p.id === editId);
      await projectsApi.update(editId, data);
      setProjects(prev => prev.map(p => p.id === editId ? { ...p, ...data } : p));
      // Send notification if status changed
      if (oldProject?.status !== data.status && data.clientId) {
        await sendNotification({
          userId: data.clientId,
          type: "status_change",
          title: "Statut de projet mis à jour",
          message: notifMessages.status_change(data.status),
          projectId: editId,
          projectTitle: data.title,
        });
      }
    } else {
      const created = await projectsApi.create(data);
      setProjects(prev => [created, ...prev]);
    }
    setShowForm(false);
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Supprimer ce projet ?")) return;
    await projectsApi.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const requestSignature = async (project) => {
    await projectsApi.update(project.id, { signatureStatus: "en_attente" });
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, signatureStatus: "en_attente" } : p));
    await sendNotification({
      userId: project.clientId,
      type: "signature_request",
      title: "Signature de contrat requise",
      message: `Votre contrat pour le projet « ${project.title} » est prêt à signer. Connectez-vous à votre espace client.`,
      projectId: project.id,
      projectTitle: project.title,
    });
  };

  const filtered = projects.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.client?.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Gestion des projets</h1>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Nouveau projet</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 bg-muted/30">
              <th className="text-left p-4 font-medium">Projet</th>
              <th className="text-left p-4 font-medium">Client</th>
              <th className="text-left p-4 font-medium">Agent</th>
              <th className="text-left p-4 font-medium">Statut</th>
              <th className="text-left p-4 font-medium">Budget</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-muted-foreground text-xs">{p.city}{p.country ? `, ${p.country}` : ""}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {p.tags.map(t => (
                          <span key={t} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">{p.client?.fullName || p.client?.email || "—"}</td>
                  <td className="p-4 text-muted-foreground">{p.agent?.fullName || p.agent?.email || "Non assigné"}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[p.status] || statusColors.brouillon}`}>{statusLabels[p.status] || p.status}</span>
                    {p.subscriptionType && <p className="text-xs text-muted-foreground mt-1">{subLabels[p.subscriptionType]}</p>}
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{p.budget ? `${p.budget.toLocaleString("fr-FR")} €` : "—"}</p>
                    {p.amountPaid > 0 && (
                      <p className="text-xs text-green-600 mt-0.5">Perçu : {p.amountPaid.toLocaleString("fr-FR")} €</p>
                    )}
                    {p.adminNotes && (
                      <p className="text-xs text-orange-600 mt-0.5 max-w-[180px] truncate" title={p.adminNotes}>📌 {p.adminNotes}</p>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Signature request button */}
                      {p.status === "en_cours" && !p.signatureStatus || p.signatureStatus === "non_demande" ? (
                        <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary" title="Demander la signature" onClick={() => requestSignature(p)}>
                          <PenLine className="w-3.5 h-3.5" /> Signer
                        </Button>
                      ) : p.signatureStatus === "signe" ? (
                        <span title="Contrat signé" className="text-green-600 flex items-center gap-1 text-xs mr-1">
                          <CheckCircle className="w-4 h-4" /> Signé
                        </span>
                      ) : null}
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editId ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Titre</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
            {form.subscriptionType && (
              <div className="bg-muted/30 rounded-lg p-3 text-sm">
                <span className="text-muted-foreground">Abonnement demandé :</span> <span className="font-medium">{subLabels[form.subscriptionType]}</span>
                {form.paymentMethod && <> · <span className="font-medium">{form.paymentMethod === "carte" ? "Carte bancaire" : "Mobile Money"}</span></>}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="representation">Représentation</SelectItem>
                    <SelectItem value="logistique">Logistique</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Statut</Label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soumis">Soumis (nouveau)</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="pause">En pause</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Client</Label>
                <Select value={form.clientId} onValueChange={v => setForm(p => ({ ...p, clientId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.fullName || c.email}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Agent</Label>
                <Select value={form.agentId} onValueChange={v => setForm(p => ({ ...p, agentId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{agents.map(a => <SelectItem key={a.id} value={a.id}>{a.fullName || a.email}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Pays</Label><Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} /></div>
              <div><Label>Ville</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Budget (€)</Label><Input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} /></div>
              <div><Label>Progression (%)</Label><Input type="number" min="0" max="100" value={form.progress} onChange={e => setForm(p => ({ ...p, progress: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Date début</Label><Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} /></div>
              <div><Label>Date fin</Label><Input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} /></div>
            </div>

            {/* Champs admin avancés */}
            <div className="border-t border-border/50 pt-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Suivi financier & interne</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Montant perçu (€)</Label>
                  <Input type="number" placeholder="0" value={form.amountPaid} onChange={e => setForm(p => ({ ...p, amountPaid: e.target.value }))} />
                </div>
                <div>
                  <Label>Tags <span className="text-muted-foreground font-normal">(séparés par virgule)</span></Label>
                  <Input
                    placeholder="urgent, vip, suivi-hebdo"
                    value={form.tags?.join(", ") || ""}
                    onChange={e => setForm(p => ({
                      ...p,
                      tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean),
                    }))}
                  />
                </div>
              </div>
              <div>
                <Label>Notes internes <span className="text-muted-foreground font-normal">(non visibles par le client)</span></Label>
                <Textarea
                  rows={3}
                  placeholder="Observations, points de vigilance, contacts locaux..."
                  value={form.adminNotes}
                  onChange={e => setForm(p => ({ ...p, adminNotes: e.target.value }))}
                />
              </div>
            </div>

            <Button onClick={save} disabled={saving || !form.title || !form.clientId} className="w-full">
              {saving ? "Enregistrement..." : editId ? "Mettre à jour" : "Créer le projet"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}