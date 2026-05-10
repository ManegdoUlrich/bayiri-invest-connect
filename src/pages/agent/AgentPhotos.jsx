import { useState, useEffect, useRef } from "react";
import { projectsApi } from "@/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { Camera, Upload, MapPin, CheckCircle, X, Loader2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { sendNotification } from "@/lib/notifications";

export default function AgentPhotos() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [photos, setPhotos] = useState([]); // {file, preview, caption, lat, lng, uploading, done, url}
  const [location, setLocation] = useState(null);
  const [locError, setLocError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    async function load() {
      const p = await projectsApi.list();
      setProjects(p);
    }
    load();
    // Get geolocation on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocError(true),
        { timeout: 8000 }
      );
    }
  }, []);

  const addFiles = (files) => {
    const newPhotos = Array.from(files).slice(0, 20 - photos.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      lat: location?.lat,
      lng: location?.lng,
      uploading: false,
      done: false,
      url: null,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (i) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateCaption = (i, caption) => {
    setPhotos((prev) => prev.map((p, idx) => idx === i ? { ...p, caption } : p));
  };

  const handleSubmit = async () => {
    if (!selectedProjectId || photos.length === 0) return;
    setSubmitting(true);
    setSuccess(false);

    const project = projects.find((p) => p.id === selectedProjectId);

    // Upload chaque photo vers Cloudinary via l'API
    for (let i = 0; i < photos.length; i++) {
      setPhotos((prev) => prev.map((p, idx) => idx === i ? { ...p, uploading: true } : p));
      const meta = {
        caption:  photos[i].caption || "",
        location: photos[i].lat ? `${photos[i].lat.toFixed(5)}, ${photos[i].lng.toFixed(5)}` : "",
        takenAt:  new Date().toISOString().split("T")[0],
      }
      const saved = await projectsApi.addPhoto(selectedProjectId, photos[i].file, meta)
      setPhotos((prev) => prev.map((p, idx) => idx === i ? { ...p, uploading: false, done: true, url: saved.url } : p));
    }

    // Notify client
    if (project?.client?.email) {
      await sendNotification({
        userId: project.clientId,
        type: "new_report",
        title: "Nouvelles photos du terrain",
        message: `${uploaded.length} nouvelle(s) photo(s) ont été ajoutées à votre projet "${project.title}".`,
        projectId: selectedProjectId,
        projectTitle: project.title,
      });
    }

    setPhotos([]);
    setSuccess(true);
    setSubmitting(false);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Photos terrain</h1>
        <p className="text-muted-foreground text-sm mt-1">Prenez ou importez des photos géolocalisées directement associées à un projet client.</p>
      </div>

      {/* Geolocation status */}
      <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border ${location ? "bg-green-500/5 border-green-500/20 text-green-700" : locError ? "bg-red-500/5 border-red-500/20 text-red-600" : "bg-muted border-border text-muted-foreground"}`}>
        <MapPin className="w-4 h-4 shrink-0" />
        {location
          ? `Position capturée : ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
          : locError
          ? "Géolocalisation indisponible — photos sans coordonnées GPS"
          : "Récupération de la position GPS..."}
      </div>

      {/* Project selector */}
      <div>
        <Label>Projet associé</Label>
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Sélectionner un projet" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.title} — {p.city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Photo import zone */}
      <div className="space-y-3">
        <Label>Photos ({photos.length}/20)</Label>
        <div className="grid grid-cols-2 gap-3">
          {/* Camera capture */}
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors bg-card">
            <Camera className="w-7 h-7 text-primary" />
            <span className="text-sm font-medium">Prendre une photo</span>
            <span className="text-xs text-muted-foreground text-center">Ouvre l'appareil photo</span>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => addFiles(e.target.files)} />
          </label>
          {/* File import */}
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors bg-card">
            <Upload className="w-7 h-7 text-muted-foreground" />
            <span className="text-sm font-medium">Importer des photos</span>
            <span className="text-xs text-muted-foreground text-center">Depuis la galerie</span>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
          </label>
        </div>
      </div>

      {/* Photo previews */}
      {photos.length > 0 && (
        <div className="space-y-3">
          {photos.map((photo, i) => (
            <div key={i} className="flex gap-3 bg-card border border-border/50 rounded-xl p-3 items-center">
              <div className="relative shrink-0">
                <img src={photo.preview} alt="" className="w-20 h-20 rounded-lg object-cover" />
                {photo.uploading && (
                  <div className="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
                {photo.done && (
                  <div className="absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <Input
                  placeholder="Légende (optionnel)"
                  value={photo.caption}
                  onChange={(e) => updateCaption(i, e.target.value)}
                  className="text-sm h-8"
                />
                {photo.lat && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {photo.lat.toFixed(4)}, {photo.lng.toFixed(4)}
                  </p>
                )}
              </div>
              <button onClick={() => removePhoto(i)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-700">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Photos envoyées et visibles dans le tableau de bord client !</p>
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={submitting || photos.length === 0 || !selectedProjectId}
        className="w-full"
        size="lg"
      >
        {submitting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi en cours...</>
        ) : (
          <><Image className="w-4 h-4 mr-2" /> Envoyer {photos.length > 0 ? `${photos.length} photo(s)` : "les photos"} au projet</>
        )}
      </Button>
    </div>
  );
}