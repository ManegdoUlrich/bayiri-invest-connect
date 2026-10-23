import { useState, useEffect, useRef } from "react";
import { reportsApi } from "@/api/reports";
import { projectsApi } from "@/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { FileText, Plus, Upload, MapPin, Camera, Mic, MicOff, CheckSquare, ChevronDown, ChevronUp, X, Play, Square } from "lucide-react";
import { sendNotification, notifMessages } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const EMPTY_FORM = {
  title: "", content: "", type: "visite", projectId: "",
  photos: [], pendingPhotos: [],
  checklistItems: [],   // [{ item: "", checked: false, note: "" }]
  pendingAudio: null,   // File | null
};

const statusBadge = (s) => {
  if (s === "valide")   return { label: "Validé",   cls: "bg-green-500/10 text-green-700 border-green-500/30" };
  if (s === "soumis")   return { label: "Soumis",   cls: "bg-blue-500/10 text-blue-700 border-blue-500/30" };
  return                        { label: "Brouillon", cls: "text-muted-foreground border-border" };
};

export default function AgentReports() {
  const { user } = useAuth();
  const [reports, setReports]   = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showNew, setShowNew]   = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState("");

  // Enregistrement audio
  const [recording, setRecording]   = useState(false);
  const [audioBlob, setAudioBlob]   = useState(null); // recorded blob
  const [audioUrl, setAudioUrl]     = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Vue détail
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    async function load() {
      const [r, p] = await Promise.all([reportsApi.list(), projectsApi.list()]);
      setReports(r);
      setProjects(p);
      setLoading(false);
    }
    load();
  }, []);

  /* ---------- Photos ---------- */
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 20);
    const previews = files.map(file => ({ file, preview: URL.createObjectURL(file), caption: "" }));
    setForm(prev => ({ ...prev, pendingPhotos: [...(prev.pendingPhotos || []), ...previews] }));
  };

  /* ---------- Checklist ---------- */
  const addChecklistItem = () =>
    setForm(prev => ({ ...prev, checklistItems: [...prev.checklistItems, { item: "", checked: false, note: "" }] }));

  const updateChecklist = (i, field, value) =>
    setForm(prev => ({
      ...prev,
      checklistItems: prev.checklistItems.map((c, idx) => idx === i ? { ...c, [field]: value } : c),
    }));

  const removeChecklist = (i) =>
    setForm(prev => ({ ...prev, checklistItems: prev.checklistItems.filter((_, idx) => idx !== i) }));

  /* ---------- Enregistrement audio ---------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url  = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setForm(prev => ({ ...prev, pendingAudio: new File([blob], "note-audio.webm", { type: "audio/webm" }) }));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch {
      alert("Microphone non disponible ou permission refusée.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const removeAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setForm(prev => ({ ...prev, pendingAudio: null }));
  };

  /* ---------- Soumission ---------- */
  const saveReport = async () => {
    setSaving(true);
    setSaveError("");
    let lat, lng;
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {}
    }
    const project = projects.find(p => p.id === form.projectId);
    try {
      const { pendingPhotos, pendingAudio, ...reportData } = form;
      // Filtrer les items vides de la checklist
      const checklist = reportData.checklistItems.filter(c => c.item.trim());

      const report = await reportsApi.create({
        ...reportData,
        checklistItems: checklist.length ? checklist : undefined,
        status: "soumis",
        latitude: lat,
        longitude: lng,
      });

      // Upload photos
      for (const p of (pendingPhotos || [])) {
        await reportsApi.addPhoto(report.id, p.file, p.caption).catch(console.error);
      }
      // Upload note audio
      if (pendingAudio) {
        await reportsApi.addAudio(report.id, pendingAudio).catch(console.error);
      }

      setReports(prev => [report, ...prev]);

      // Notification client
      if (project?.clientId) {
        sendNotification({
          userId: project.clientId,
          type: "new_report",
          title: "Nouveau rapport disponible",
          message: notifMessages.new_report(form.title),
          projectId: form.projectId,
          projectTitle: project.title,
        }).catch(console.error);
      }

      setForm(EMPTY_FORM);
      setAudioBlob(null);
      setAudioUrl(null);
      setShowNew(false);
    } catch (err) {
      console.error("Erreur lors de la création du rapport :", err);
      setSaveError(err.message || "Erreur lors de la soumission.");
    }
    setSaving(false);
  };

  /* ---------- Vue détail ---------- */
  const openDetail = async (report) => {
    try {
      const full = await reportsApi.get(report.id);
      setDetail(full);
    } catch {
      setDetail(report);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Rapports</h1>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau rapport
        </Button>
      </div>

      {/* Liste des rapports */}
      <div className="space-y-3">
        {reports.map((report) => {
          const { label, cls } = statusBadge(report.status);
          return (
            <div
              key={report.id}
              className="bg-card rounded-xl border border-border/50 p-5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openDetail(report)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold">{report.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.content}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                    <span>{new Date(report.createdAt).toLocaleDateString("fr-FR")}</span>
                    <Badge variant="outline" className="text-xs">{report.type}</Badge>
                    {report._count?.photos > 0 && (
                      <span className="flex items-center gap-1"><Camera className="w-3 h-3" /> {report._count.photos} photo{report._count.photos > 1 ? "s" : ""}</span>
                    )}
                    {report._count?.checklistItems > 0 && (
                      <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" /> {report._count.checklistItems} élément{report._count.checklistItems > 1 ? "s" : ""}</span>
                    )}
                    {report.audioNotesUrl && (
                      <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Audio</span>
                    )}
                    {report.latitude && (
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> GPS</span>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={`shrink-0 ml-3 ${cls}`}>{label}</Badge>
              </div>
            </div>
          );
        })}
        {reports.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
            Aucun rapport. Créez votre premier rapport.
          </div>
        )}
      </div>

      {/* ===== Dialog : Nouveau rapport ===== */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Nouveau rapport</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Projet + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Projet</Label>
                <Select value={form.projectId} onValueChange={(v) => setForm(prev => ({ ...prev, projectId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
            </div>

            {/* Titre + Contenu */}
            <div>
              <Label>Titre</Label>
              <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Titre du rapport" />
            </div>
            <div>
              <Label>Contenu</Label>
              <Textarea value={form.content} onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))} placeholder="Décrivez votre visite..." rows={4} />
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Checklist de vérification</Label>
                <Button type="button" size="sm" variant="outline" onClick={addChecklistItem} className="h-7 text-xs gap-1">
                  <Plus className="w-3 h-3" /> Ajouter
                </Button>
              </div>
              {form.checklistItems.length === 0 && (
                <p className="text-xs text-muted-foreground">Aucun élément — cliquez sur « Ajouter » pour créer une checklist.</p>
              )}
              <div className="space-y-2 mt-2">
                {form.checklistItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => updateChecklist(i, "checked", e.target.checked)}
                      className="w-4 h-4 rounded accent-primary shrink-0"
                    />
                    <Input
                      value={item.item}
                      onChange={(e) => updateChecklist(i, "item", e.target.value)}
                      placeholder="Élément à vérifier…"
                      className="flex-1 h-7 text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 px-0"
                    />
                    <Input
                      value={item.note}
                      onChange={(e) => updateChecklist(i, "note", e.target.value)}
                      placeholder="Note…"
                      className="w-28 h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 text-muted-foreground"
                    />
                    <button type="button" onClick={() => removeChecklist(i)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <Label>Photos ({form.pendingPhotos?.length ?? 0}/20)</Label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-5 cursor-pointer hover:border-primary/50 transition-colors mt-2">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Ajouter des photos</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
              </label>
              {(form.pendingPhotos?.length ?? 0) > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {form.pendingPhotos.map((p, i) => (
                    <div key={i} className="relative group">
                      <img src={p.preview} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, pendingPhotos: prev.pendingPhotos.filter((_, j) => j !== i) }))}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white rounded-full text-xs items-center justify-center hidden group-hover:flex"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Note audio */}
            <div>
              <Label>Note audio</Label>
              <div className="mt-2 space-y-2">
                {!audioUrl ? (
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant={recording ? "destructive" : "outline"}
                      size="sm"
                      onClick={recording ? stopRecording : startRecording}
                      className="gap-2"
                    >
                      {recording ? <><Square className="w-3.5 h-3.5" /> Arrêter</> : <><Mic className="w-3.5 h-3.5" /> Enregistrer</>}
                    </Button>
                    {recording && <span className="text-xs text-destructive animate-pulse">● Enregistrement en cours…</span>}
                    <span className="text-xs text-muted-foreground">ou</span>
                    <label className="cursor-pointer text-xs text-primary underline underline-offset-2">
                      Importer un fichier audio
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setAudioUrl(URL.createObjectURL(f));
                            setForm(prev => ({ ...prev, pendingAudio: f }));
                          }
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-3">
                    <Mic className="w-4 h-4 text-primary shrink-0" />
                    <audio src={audioUrl} controls className="flex-1 h-8" style={{ minWidth: 0 }} />
                    <button type="button" onClick={removeAudio} className="text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {saveError && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{saveError}</p>
            )}

            <Button onClick={saveReport} disabled={saving || !form.title || !form.projectId} className="w-full">
              {saving ? "Envoi en cours…" : "Soumettre le rapport"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog : Vue détail rapport ===== */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">{detail.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 mt-2">
                {/* Meta */}
                <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                  <Badge variant="outline">{detail.type}</Badge>
                  <Badge variant="outline" className={statusBadge(detail.status).cls}>{statusBadge(detail.status).label}</Badge>
                  <span>{new Date(detail.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  {detail.latitude && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{detail.latitude.toFixed(4)}, {detail.longitude?.toFixed(4)}</span>}
                </div>

                {/* Contenu */}
                {detail.content && (
                  <div className="bg-muted/30 rounded-xl p-4 text-sm whitespace-pre-wrap">{detail.content}</div>
                )}

                {/* Checklist */}
                {detail.checklistItems?.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-primary" /> Checklist</p>
                    <div className="space-y-2">
                      {detail.checklistItems.map((c) => (
                        <div key={c.id} className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm ${c.checked ? "bg-green-500/5 border border-green-500/20" : "bg-muted/30 border border-border/50"}`}>
                          <span className={`mt-0.5 shrink-0 ${c.checked ? "text-green-600" : "text-muted-foreground"}`}>
                            {c.checked ? "✓" : "○"}
                          </span>
                          <div className="flex-1">
                            <span className={c.checked ? "line-through text-muted-foreground" : ""}>{c.item}</span>
                            {c.note && <p className="text-xs text-muted-foreground mt-0.5">{c.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photos */}
                {detail.photos?.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><Camera className="w-4 h-4 text-primary" /> Photos ({detail.photos.length})</p>
                    <div className="grid grid-cols-3 gap-2">
                      {detail.photos.map((ph) => (
                        <div key={ph.id} className="relative aspect-square rounded-xl overflow-hidden">
                          <img src={ph.url} alt={ph.caption || ""} className="w-full h-full object-cover" />
                          {ph.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5 truncate">{ph.caption}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note audio */}
                {detail.audioNotesUrl && (
                  <div>
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><Mic className="w-4 h-4 text-primary" /> Note audio</p>
                    <audio src={detail.audioNotesUrl} controls className="w-full" />
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
