import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import { sendNotification, notifMessages } from "@/lib/notifications";
import { Shield, Clock, CheckCircle, Send, Edit, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StatCard from "../../components/StatCard";

const sigStatusConfig = {
  non_demande: { label: "Non demandé", color: "text-muted-foreground border-border", icon: Clock },
  en_attente: { label: "En attente de signature", color: "text-orange-600 border-orange-500/30", icon: Clock },
  signe: { label: "Signé", color: "text-green-600 border-green-500/30", icon: CheckCircle },
};

export default function AdminContractManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState(null);
  const [viewSig, setViewSig] = useState(null);
  const [contractText, setContractText] = useState("");
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(null);

  useEffect(() => {
    projectsApi.list().then(p => { setProjects(p); setLoading(false); });
  }, []);

  const openEdit = (project) => {
    setEditProject(project);
    setContractText(project.contractContent || "");
  };

  const saveContract = async () => {
    setSaving(true);
    await projectsApi.update(editProject.id, { contractContent: contractText });
    setProjects(prev => prev.map(p => p.id === editProject.id ? { ...p, contractContent: contractText } : p));
    setSaving(false);
    setEditProject(null);
  };

  const requestSignature = async (project) => {
    setRequesting(project.id);
    await projectsApi.update(project.id, { signatureStatus: "en_attente" });
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, signatureStatus: "en_attente" } : p));

    await sendNotification({
      userId: project.clientId,
      type: "signature_request",
      title: "Votre contrat est prêt à signer",
      message: notifMessages.signature_request(),
      projectId: project.id,
      projectTitle: project.title,
    });
    setRequesting(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  const signed = projects.filter(p => p.signatureStatus === "signe").length;
  const pending = projects.filter(p => p.signatureStatus === "en_attente").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" /> Gestion des contrats
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Shield} label="Total projets" value={projects.length} />
        <StatCard icon={CheckCircle} label="Contrats signés" value={signed} />
        <StatCard icon={Clock} label="En attente de signature" value={pending} />
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 bg-muted/30">
              <th className="text-left p-4 font-medium">Projet</th>
              <th className="text-left p-4 font-medium">Client</th>
              <th className="text-left p-4 font-medium">Statut contrat</th>
              <th className="text-left p-4 font-medium">Date signature</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {projects.map(project => {
                const sigCfg = sigStatusConfig[project.signatureStatus || "non_demande"];
                const SigIcon = sigCfg.icon;
                return (
                  <tr key={project.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold">{project.title}</p>
                      <p className="text-xs text-muted-foreground">{project.city}, {project.country}</p>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">{project.client?.email}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={sigCfg.color}>
                        <SigIcon className="w-3 h-3 mr-1.5" />{sigCfg.label}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {project.signatureDate ? new Date(project.signatureDate).toLocaleString("fr-FR") : "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(project)}>
                          <Edit className="w-3.5 h-3.5 mr-1" /> Contrat
                        </Button>
                        {project.signatureStatus === "signe" && (
                          <Button variant="ghost" size="sm" onClick={() => setViewSig(project)}>
                            <Eye className="w-3.5 h-3.5 mr-1" /> Signature
                          </Button>
                        )}
                        {project.signatureStatus !== "signe" && (
                          <Button size="sm" variant="outline" disabled={requesting === project.id || project.signatureStatus === "en_attente"} onClick={() => requestSignature(project)}>
                            <Send className="w-3.5 h-3.5 mr-1" />
                            {project.signatureStatus === "en_attente" ? "Demandé" : requesting === project.id ? "Envoi..." : "Demander"}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit contract dialog */}
      <Dialog open={!!editProject} onOpenChange={() => setEditProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Modifier le contrat — {editProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Contenu du contrat (laisser vide pour utiliser le modèle par défaut)</Label>
              <Textarea value={contractText} onChange={e => setContractText(e.target.value)} rows={14} className="font-mono text-xs mt-2" placeholder="Contenu du contrat..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditProject(null)}>Annuler</Button>
              <Button onClick={saveContract} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View signature dialog */}
      <Dialog open={!!viewSig} onOpenChange={() => setViewSig(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Signature enregistrée</DialogTitle>
          </DialogHeader>
          {viewSig?.signatureUrl && (
            <div className="space-y-4">
              <div className="border rounded-xl overflow-hidden bg-white p-2">
                <img src={viewSig.signatureUrl} alt="Signature" className="w-full" />
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><span className="font-medium text-foreground">Signataire :</span> {viewSig.client?.email}</p>
                <p><span className="font-medium text-foreground">Date :</span> {new Date(viewSig.signatureDate).toLocaleString("fr-FR")}</p>
              </div>
              <Badge className="bg-green-500 w-fit">
                <CheckCircle className="w-3 h-3 mr-1.5" /> Signature valide
              </Badge>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}