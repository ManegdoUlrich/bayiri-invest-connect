import { useState, useEffect } from "react";
import { reportsApi } from "@/api/reports";
import { projectsApi } from "@/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { FileText, Plus, Upload, MapPin, Camera } from "lucide-react";
import { sendNotification, notifMessages } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AgentReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "visite", projectId: "", photos: [] });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [r, p] = await Promise.all([
        reportsApi.list(),
        projectsApi.list(),
      ]);
      setReports(r);
      setProjects(p);
      setLoading(false);
    }
    load();
  }, []);

  // Les photos sont stockées temporairement comme fichiers locaux avant soumission du rapport
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 20)
    const previews = files.map(file => ({ file, preview: URL.createObjectURL(file), caption: file.name }))
    setForm(prev => ({ ...prev, pendingPhotos: [...(prev.pendingPhotos || []), ...previews] }))
  };

  const saveReport = async () => {
    setSaving(true);
    let lat, lng;
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {}
    }
    const project = projects.find(p => p.id === form.projectId);
    // Créer le rapport d'abord, puis uploader les photos
    const { pendingPhotos, ...reportData } = form
    const report = await reportsApi.create({
      ...reportData,
      status: "soumis",
      latitude: lat,
      longitude: lng,
    });
    // Uploader chaque photo vers Cloudinary
    for (const p of (pendingPhotos || [])) {
      await reportsApi.addPhoto(report.id, p.file, p.caption)
    }
    setReports(prev => [report, ...prev]);

    // Notify client
    if (project?.client?.email) {
      await sendNotification({
        userId: project.clientId,
        type: "new_report",
        title: "Nouveau rapport disponible",
        message: notifMessages.new_report(form.title),
        projectId: form.projectId,
        projectTitle: project.title,
      });
    }
    setForm({ title: "", content: "", type: "visite", projectId: "", photos: [] });
    setShowNew(false);
    setSaving(false);
  };

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
        <h1 className="text-3xl font-heading font-bold">Rapports</h1>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau rapport
        </Button>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="bg-card rounded-xl border border-border/50 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{report.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.content}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span>{new Date(report.created_date).toLocaleDateString("fr-FR")}</span>
                  {report.photos?.length > 0 && (
                    <span className="flex items-center gap-1"><Camera className="w-3 h-3" /> {report.photos.length} photos</span>
                  )}
                  {report.latitude && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Géolocalisé</span>
                  )}
                </div>
              </div>
              <Badge variant={report.status === "valide" ? "default" : "outline"}>
                {report.status === "brouillon" ? "Brouillon" : report.status === "soumis" ? "Soumis" : "Validé"}
              </Badge>
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Aucun rapport. Créez votre premier rapport.</div>
        )}
      </div>

      {/* New report dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Nouveau rapport</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Projet</Label>
              <Select value={form.projectId} onValueChange={(v) => setForm(prev => ({ ...prev, projectId: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un projet" /></SelectTrigger>
                <SelectContent>
                  {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm(prev => ({ ...prev, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="visite">Visite</SelectItem>
                  <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Titre</Label>
              <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Titre du rapport" />
            </div>
            <div>
              <Label>Contenu</Label>
              <Textarea value={form.content} onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))} placeholder="Décrivez votre visite..." rows={5} />
            </div>
            <div>
              <Label>Photos ({form.photos.length}/20)</Label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors mt-2">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{uploading ? "Upload en cours..." : "Ajouter des photos"}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
              {form.photos.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {form.photos.map((p, i) => (
                    <img key={i} src={p.url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </div>
            <Button onClick={saveReport} disabled={saving || !form.title || !form.projectId} className="w-full">
              {saving ? "Enregistrement..." : "Soumettre le rapport"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}