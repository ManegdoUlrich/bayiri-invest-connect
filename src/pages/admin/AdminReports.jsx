import { useState, useEffect } from "react";
import { reportsApi } from "@/api/reports";
import { FileText, CheckCircle, Clock, Search, Camera, CheckSquare, Mic, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusBadge = (s) => {
  if (s === "valide") return { label: "Validé",    cls: "bg-green-500/10 text-green-700 border-green-500/30" };
  if (s === "soumis") return { label: "Soumis",    cls: "bg-blue-500/10 text-blue-700 border-blue-500/30" };
  return                      { label: "Brouillon", cls: "text-muted-foreground border-border" };
};

export default function AdminReports() {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [detail, setDetail]     = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    reportsApi.list().then(r => { setReports(r); setLoading(false); });
  }, []);

  const validate = async (id) => {
    try {
      await reportsApi.update(id, { status: "valide" });
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: "valide" } : r));
      if (detail?.id === id) setDetail(d => ({ ...d, status: "valide" }));
    } catch (err) {
      console.error("Erreur lors de la validation :", err);
    }
  };

  const openDetail = async (report) => {
    setDetail(report);
    setDetailLoading(true);
    try {
      const full = await reportsApi.get(report.id);
      setDetail(full);
    } catch {/* keep summary */}
    setDetailLoading(false);
  };

  const filtered = reports.filter(r =>
    !search ||
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.agent?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-heading font-bold">Rapports</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher un rapport ou un agent…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-3">
        {filtered.map(report => {
          const { label, cls } = statusBadge(report.status);
          return (
            <div
              key={report.id}
              className="bg-card rounded-xl border border-border/50 p-5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openDetail(report)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold">{report.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.content}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                    <span>Agent : <span className="font-medium text-foreground">{report.agent?.fullName || "—"}</span></span>
                    <span>{new Date(report.createdAt).toLocaleDateString("fr-FR")}</span>
                    <Badge variant="outline" className="text-xs">{report.type}</Badge>
                    {report._count?.photos > 0 && (
                      <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{report._count.photos}</span>
                    )}
                    {report._count?.checklistItems > 0 && (
                      <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" />{report._count.checklistItems}</span>
                    )}
                    {report.audioNotesUrl && <span className="flex items-center gap-1"><Mic className="w-3 h-3" />Audio</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <Badge variant="outline" className={cls}>{label}</Badge>
                  {report.status === "soumis" && (
                    <Button size="sm" variant="outline" onClick={() => validate(report.id)}>
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Valider
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
            Aucun rapport trouvé.
          </div>
        )}
      </div>

      {/* ===== Dialog détail ===== */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading pr-8">{detail.title}</DialogTitle>
              </DialogHeader>

              {detailLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-5 mt-2">
                  {/* Meta */}
                  <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                    <Badge variant="outline">{detail.type}</Badge>
                    <Badge variant="outline" className={statusBadge(detail.status).cls}>{statusBadge(detail.status).label}</Badge>
                    <span>Agent : <span className="font-medium text-foreground">{detail.agent?.fullName || "—"}</span></span>
                    <span>{new Date(detail.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    {detail.latitude && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{detail.latitude.toFixed(4)}, {detail.longitude?.toFixed(4)}
                      </span>
                    )}
                  </div>

                  {/* Contenu */}
                  {detail.content && (
                    <div className="bg-muted/30 rounded-xl p-4 text-sm whitespace-pre-wrap">{detail.content}</div>
                  )}

                  {/* Checklist */}
                  {detail.checklistItems?.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-primary" /> Checklist
                        <span className="text-xs font-normal text-muted-foreground">
                          ({detail.checklistItems.filter(c => c.checked).length}/{detail.checklistItems.length} validés)
                        </span>
                      </p>
                      <div className="space-y-1.5">
                        {detail.checklistItems.map((c) => (
                          <div key={c.id} className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm ${c.checked ? "bg-green-500/5 border border-green-500/20" : "bg-muted/30 border border-border/50"}`}>
                            <span className={`mt-0.5 shrink-0 font-bold ${c.checked ? "text-green-600" : "text-muted-foreground"}`}>
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
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-primary" /> Photos ({detail.photos.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {detail.photos.map((ph) => (
                          <div key={ph.id} className="relative aspect-square rounded-xl overflow-hidden">
                            <img src={ph.url} alt={ph.caption || ""} className="w-full h-full object-cover" />
                            {ph.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5 truncate">
                                {ph.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Note audio */}
                  {detail.audioNotesUrl && (
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Mic className="w-4 h-4 text-primary" /> Note audio
                      </p>
                      <audio src={detail.audioNotesUrl} controls className="w-full" />
                    </div>
                  )}

                  {/* Action valider */}
                  {detail.status === "soumis" && (
                    <Button
                      onClick={() => validate(detail.id)}
                      className="w-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Valider ce rapport
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
