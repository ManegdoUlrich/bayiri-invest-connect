import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { partnersApi } from "@/api/partners";
import { Search, Plus, Pencil, Trash2, Building2, Scale, FileText, Home, HelpCircle, Image, X, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SPECIALTY_LABEL = {
  btp:        { label: "Bureau BTP",       Icon: Building2, color: "text-orange-600 bg-orange-500/10" },
  juridique:  { label: "Cabinet juridique", Icon: Scale,     color: "text-blue-600 bg-blue-500/10" },
  notarial:   { label: "Étude notariale",  Icon: FileText,  color: "text-purple-600 bg-purple-500/10" },
  immobilier: { label: "Agence immobilière",Icon: Home,      color: "text-green-600 bg-green-500/10" },
  autre:      { label: "Autre",            Icon: HelpCircle,color: "text-muted-foreground bg-muted" },
};

const EMPTY_FORM = { name: "", specialty: "btp", description: "", photoUrl: "", city: "", country: "Burkina Faso", phone: "", email: "", website: "", active: true };
const EMPTY_REAL = { title: "", description: "", year: "", city: "", photoUrls: [] };

export default function AdminPartners() {
  const navigate = useNavigate();
  const [partners, setPartners]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  // Réalisations
  const [realTab, setRealTab]       = useState(false); // true = on est sur l'onglet réalisations
  const [detailPartner, setDetailPartner] = useState(null); // partenaire chargé avec ses réalisations
  const [showRealForm, setShowRealForm]   = useState(false);
  const [editingReal, setEditingReal]     = useState(null);
  const [realForm, setRealForm]           = useState(EMPTY_REAL);
  const [savingReal, setSavingReal]       = useState(false);
  const [newPhotoUrl, setNewPhotoUrl]     = useState("");

  useEffect(() => {
    partnersApi.list({ active: "all" })
      .then(setPartners)
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit   = (p) => { setEditing(p); setForm({ ...EMPTY_FORM, ...p, photoUrl: p.photoUrl || "" }); setShowForm(true); };

  const openRealizations = async (p) => {
    const full = await partnersApi.get(p.id);
    setDetailPartner(full);
  };
  const closeRealizations = () => setDetailPartner(null);

  const openRealCreate = () => { setEditingReal(null); setRealForm(EMPTY_REAL); setNewPhotoUrl(""); setShowRealForm(true); };
  const openRealEdit   = (r) => { setEditingReal(r); setRealForm({ ...r, year: r.year || "", photoUrls: r.photoUrls || [] }); setNewPhotoUrl(""); setShowRealForm(true); };

  const saveReal = async () => {
    if (!realForm.title) return;
    setSavingReal(true);
    try {
      const payload = { ...realForm, year: realForm.year ? Number(realForm.year) : null };
      if (editingReal) {
        const updated = await partnersApi.updateRealization(detailPartner.id, editingReal.id, payload);
        setDetailPartner(d => ({ ...d, realizations: d.realizations.map(r => r.id === updated.id ? updated : r) }));
      } else {
        const created = await partnersApi.addRealization(detailPartner.id, payload);
        setDetailPartner(d => ({ ...d, realizations: [created, ...(d.realizations || [])] }));
      }
      setShowRealForm(false);
    } catch (e) {
      alert(e.message || "Erreur");
    } finally {
      setSavingReal(false);
    }
  };

  const removeReal = async (rid) => {
    if (!confirm("Supprimer cette réalisation ?")) return;
    await partnersApi.deleteRealization(detailPartner.id, rid);
    setDetailPartner(d => ({ ...d, realizations: d.realizations.filter(r => r.id !== rid) }));
  };

  const addPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setRealForm(f => ({ ...f, photoUrls: [...(f.photoUrls || []), newPhotoUrl.trim()] }));
    setNewPhotoUrl("");
  };
  const removePhoto = (idx) => setRealForm(f => ({ ...f, photoUrls: f.photoUrls.filter((_, i) => i !== idx) }));

  const save = async () => {
    if (!form.name || !form.specialty) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await partnersApi.update(editing.id, form);
        setPartners(prev => prev.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await partnersApi.create(form);
        setPartners(prev => [created, ...prev]);
      }
      setShowForm(false);
    } catch (e) {
      alert(e.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Supprimer ce partenaire ?")) return;
    try {
      await partnersApi.delete(id);
      setPartners(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert(e.message || "Erreur");
    }
  };

  const toggleActive = async (p) => {
    const updated = await partnersApi.update(p.id, { active: !p.active });
    setPartners(prev => prev.map(x => x.id === updated.id ? updated : x));
  };

  const filtered = partners.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Partenaires</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{partners.length} partenaire{partners.length > 1 ? "s" : ""} enregistré{partners.length > 1 ? "s" : ""}</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Ajouter</Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => {
          const spec = SPECIALTY_LABEL[p.specialty] || SPECIALTY_LABEL.autre;
          const Icon = spec.Icon;
          return (
            <div key={p.id} className={`bg-card rounded-2xl border border-border/50 p-5 space-y-4 ${!p.active ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-3">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.name} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-muted" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-heading font-semibold truncate">{p.name}</h3>
                  <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${spec.color}`}>{spec.label}</span>
                </div>
              </div>

              {p.description && <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>}

              <div className="text-xs text-muted-foreground space-y-1">
                {p.city && <p>{p.city}{p.country ? `, ${p.country}` : ""}</p>}
                {p.email && <p>{p.email}</p>}
                {p._count?.projects > 0 && <p className="font-medium text-foreground">{p._count.projects} projet{p._count.projects > 1 ? "s" : ""}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/40 flex-wrap">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(p)}>
                  <Pencil className="w-3.5 h-3.5 mr-1" />Modifier
                </Button>
                <Button size="sm" variant="outline" onClick={() => openRealizations(p)} title="Gérer les réalisations">
                  <Image className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate(`/partners/${p.id}`)} title="Voir le profil">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleActive(p)} className="text-xs">
                  {p.active ? "Désactiver" : "Activer"}
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(p.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted-foreground">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>Aucun partenaire trouvé.</p>
          </div>
        )}
      </div>

      {/* Réalisations dialog */}
      <Dialog open={!!detailPartner} onOpenChange={v => { if (!v) closeRealizations(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Réalisations — {detailPartner?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Button size="sm" onClick={openRealCreate}><Plus className="w-3.5 h-3.5 mr-1.5" />Ajouter une réalisation</Button>
            {detailPartner?.realizations?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune réalisation.</p>
            )}
            {detailPartner?.realizations?.map(r => (
              <div key={r.id} className="border border-border/50 rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{[r.year, r.city].filter(Boolean).join(" · ")}</p>
                    {r.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => openRealEdit(r)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeReal(r.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
                {r.photoUrls?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {r.photoUrls.slice(0, 5).map((url, i) => (
                      <img key={i} src={url} alt="" className="w-14 h-14 rounded-lg object-cover" />
                    ))}
                    {r.photoUrls.length > 5 && <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">+{r.photoUrls.length - 5}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Réalisation form dialog */}
      <Dialog open={showRealForm} onOpenChange={setShowRealForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingReal ? "Modifier la réalisation" : "Nouvelle réalisation"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Titre *</Label>
              <Input className="mt-1" value={realForm.title} onChange={e => setRealForm(f => ({ ...f, title: e.target.value }))} placeholder="Construction villa Ouaga 2000" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Année</Label>
                <Input className="mt-1" type="number" value={realForm.year} onChange={e => setRealForm(f => ({ ...f, year: e.target.value }))} placeholder="2023" />
              </div>
              <div>
                <Label>Ville</Label>
                <Input className="mt-1" value={realForm.city || ""} onChange={e => setRealForm(f => ({ ...f, city: e.target.value }))} placeholder="Ouagadougou" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                rows={3}
                value={realForm.description || ""}
                onChange={e => setRealForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Détails du projet réalisé..."
              />
            </div>
            <div>
              <Label>Photos (URLs)</Label>
              <div className="flex gap-2 mt-1">
                <Input value={newPhotoUrl} onChange={e => setNewPhotoUrl(e.target.value)} placeholder="https://..." onKeyDown={e => e.key === "Enter" && addPhoto()} />
                <Button size="sm" type="button" onClick={addPhoto}>Ajouter</Button>
              </div>
              {realForm.photoUrls?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {realForm.photoUrls.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <img src={url} alt="" className="w-10 h-10 rounded object-cover" onError={e => { e.target.style.display = "none"; }} />
                      <span className="flex-1 truncate text-muted-foreground">{url}</span>
                      <button className="text-destructive hover:opacity-70" onClick={() => removePhoto(i)}><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowRealForm(false)}>Annuler</Button>
              <Button onClick={saveReal} disabled={savingReal || !realForm.title}>
                {savingReal ? "Enregistrement..." : editingReal ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le partenaire" : "Nouveau partenaire"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nom *</Label>
              <Input className="mt-1" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Cabinet Dupont & Associés" />
            </div>
            <div>
              <Label>Spécialité *</Label>
              <Select value={form.specialty} onValueChange={v => setForm(f => ({ ...f, specialty: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SPECIALTY_LABEL).map(([v, { label }]) => (
                    <SelectItem key={v} value={v}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                rows={3}
                value={form.description || ""}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Spécialités, années d'expérience..."
              />
            </div>
            <div>
              <Label>URL photo</Label>
              <Input className="mt-1" value={form.photoUrl || ""} onChange={e => setForm(f => ({ ...f, photoUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ville</Label>
                <Input className="mt-1" value={form.city || ""} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Ouagadougou" />
              </div>
              <div>
                <Label>Pays</Label>
                <Input className="mt-1" value={form.country || ""} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Téléphone</Label>
                <Input className="mt-1" value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1" type="email" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Site web</Label>
              <Input className="mt-1" value={form.website || ""} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button onClick={save} disabled={saving || !form.name || !form.specialty}>
                {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
