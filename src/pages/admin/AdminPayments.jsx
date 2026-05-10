import { useState, useEffect } from "react";
import { paymentsApi } from "@/api/payments";
import { CheckCircle, AlertCircle, Repeat, FileText, Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import StatCard from "../../components/StatCard";

const typeLabels = { abonnement_mensuel: "Abonnement mensuel", forfait: "Forfait" };
const statusConfig = {
  a_jour: { label: "À jour", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  en_retard: { label: "En retard", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  suspendu: { label: "Suspendu", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
};

const empty = { clientId: "", type: "abonnement_mensuel", status: "a_jour", amount: "", nextDueDate: "", description: "" };

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    paymentsApi.list().then(p => { setPayments(p); setLoading(false); });
  }, []);

  const filtered = payments.filter(p =>
    p.clientId?.toString().toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(empty); setDialogOpen(true); };
  const openEdit = (p) => { setForm({ ...p, amount: p.amount || "" }); setDialogOpen(true); };

  const save = async () => {
    setSaving(true);
    const data = { ...form, amount: form.amount ? parseFloat(form.amount) : undefined };
    if (form.id) {
      const updated = await paymentsApi.update(form.id, data);
      setPayments(prev => prev.map(p => p.id === form.id ? updated : p));
    } else {
      const created = await paymentsApi.create(data);
      setPayments(prev => [created, ...prev]);
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const remove = async (id) => {
    if (!confirm("Supprimer cet engagement ?")) return;
    // NOTE: paymentsApi does not expose delete — remove locally only
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const aJour = payments.filter(p => p.status === "a_jour").length;
  const enRetard = payments.filter(p => p.status === "en_retard").length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-heading font-bold">Engagements clients</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Nouvel engagement</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={CheckCircle} label="À jour" value={aJour} />
        <StatCard icon={AlertCircle} label="En retard" value={enRetard} />
        <StatCard icon={Repeat} label="Total engagements" value={payments.length} />
      </div>

      <Input placeholder="Rechercher par client ou description..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left p-4 font-medium">Client</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Statut</th>
                <th className="text-left p-4 font-medium">Prochaine échéance</th>
                <th className="text-right p-4 font-medium">Montant</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const sc = statusConfig[p.status] || statusConfig.a_jour;
                return (
                  <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-muted-foreground">{p.clientId}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5">
                        {p.type === "abonnement_mensuel" ? <Repeat className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-secondary" />}
                        {typeLabels[p.type]}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={sc.color}>{sc.label}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {p.nextDueDate ? new Date(p.nextDueDate).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="p-4 text-right font-heading font-bold">
                      {p.amount ? `${p.amount.toLocaleString("fr-FR")} €` : "—"}
                      {p.type === "abonnement_mensuel" && p.amount && <span className="text-xs text-muted-foreground font-normal"> /mois</span>}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Aucun engagement trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">{form.id ? "Modifier l'engagement" : "Nouvel engagement"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>ID client</Label>
              <Input value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} placeholder="ID du client" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abonnement_mensuel">Abonnement mensuel</SelectItem>
                    <SelectItem value="forfait">Forfait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_jour">À jour</SelectItem>
                    <SelectItem value="en_retard">En retard</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Montant (€)</Label>
                <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div>
                <Label>Prochaine échéance</Label>
                <Input type="date" value={form.nextDueDate} onChange={e => setForm(f => ({ ...f, nextDueDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Description / Notes</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={save} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}