import { useState, useEffect } from "react";
import { reportsApi } from "@/api/reports";
import { FileText, CheckCircle, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    reportsApi.list().then(r => { setReports(r); setLoading(false); });
  }, []);

  const validate = async (id) => {
    await reportsApi.update(id, { status: "valide" });
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "valide" } : r));
  };

  const filtered = reports.filter(r => !search || r.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-heading font-bold">Rapports</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher un rapport..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-3">
        {filtered.map(report => (
          <div key={report.id} className="bg-card rounded-xl border border-border/50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold">{report.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.content}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span>Agent: {report.agent?.email || "—"}</span>
                  <span>{new Date(report.created_date).toLocaleDateString("fr-FR")}</span>
                  <Badge variant="outline">{report.type}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={report.status === "valide" ? "default" : "outline"} className={report.status === "valide" ? "bg-green-500" : ""}>
                  {report.status === "valide" ? "Validé" : report.status === "soumis" ? "Soumis" : "Brouillon"}
                </Badge>
                {report.status === "soumis" && (
                  <Button size="sm" variant="outline" onClick={() => validate(report.id)}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Valider
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Aucun rapport trouvé.</div>
        )}
      </div>
    </div>
  );
}