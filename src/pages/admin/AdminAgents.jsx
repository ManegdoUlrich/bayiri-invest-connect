import { useState, useEffect } from "react";
import { usersApi } from "@/api/users";
import { missionsApi } from "@/api/missions";
import { reportsApi } from "@/api/reports";
import { projectsApi } from "@/api/projects";
import { Search, UserPlus, MapPin, FileText, Mail, Phone, CheckCircle, Clock, AlertCircle, ChevronRight, Globe, Calendar, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const missionStatusColor = {
  planifiee: "text-blue-600 bg-blue-500/10",
  en_cours:  "text-orange-600 bg-orange-500/10",
  terminee:  "text-green-600 bg-green-500/10",
  reportee:  "text-muted-foreground bg-muted",
};

const missionStatusLabel = {
  planifiee: "Planifiée",
  en_cours:  "En cours",
  terminee:  "Terminée",
  reportee:  "Reportée",
};

export default function AdminAgents() {
  const [agents, setAgents]     = useState([]);
  const [missions, setMissions] = useState([]);
  const [reports, setReports]   = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [detail, setDetail]     = useState(null); // agent sélectionné

  useEffect(() => {
    async function load() {
      const [u, m, r, p] = await Promise.all([
        usersApi.list({ role: "agent" }),
        missionsApi.list(),
        reportsApi.list(),
        projectsApi.list(),
      ]);
      setAgents(u);
      setMissions(m);
      setReports(r);
      setProjects(p);
      setLoading(false);
    }
    load();
  }, []);

  const invite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    try {
      const { user: newUser, tempPassword } = await usersApi.invite(inviteEmail, "agent");
      setAgents(prev => [newUser, ...prev]);
      alert(`Compte agent créé !\nEmail : ${inviteEmail}\nMot de passe temporaire : ${tempPassword}\n\nCommuniquez ces identifiants à l'agent.`);
    } catch (e) {
      alert(e.message || "Erreur lors de l'invitation");
    } finally {
      setInviteEmail("");
      setShowInvite(false);
      setInviting(false);
    }
  };

  const filtered = agents.filter(a =>
    !search ||
    a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Agents terrain</h1>
        <Button onClick={() => setShowInvite(true)}><UserPlus className="w-4 h-4 mr-2" />Inviter un agent</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher un agent..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(agent => {
          const agentMissions = missions.filter(m => m.agentId === agent.id);
          const agentReports  = reports.filter(r => r.agentId === agent.id);
          const completed     = agentMissions.filter(m => m.status === "terminee").length;
          const inProgress    = agentMissions.filter(m => m.status === "en_cours").length;
          const rate = agentMissions.length ? Math.round(completed / agentMissions.length * 100) : 0;
          return (
            <div
              key={agent.id}
              className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setDetail(agent)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 overflow-hidden">
                  {agent.avatarUrl
                    ? <img src={agent.avatarUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                    : (agent.fullName?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "?")}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{agent.fullName || "Sans nom"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{agent.email}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{agentMissions.length} missions</span>
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{agentReports.length} rapports</span>
              </div>
              {agentMissions.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Taux de complétion</span>
                    <span className="font-medium text-foreground">{rate}%</span>
                  </div>
                  <Progress value={rate} className="h-1.5" />
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <Badge variant="outline" className="text-green-600 border-green-500/30">{completed} terminée{completed !== 1 ? "s" : ""}</Badge>
                {inProgress > 0 && <Badge variant="outline" className="text-orange-600 border-orange-500/30">{inProgress} en cours</Badge>}
                {agent.city && <Badge variant="outline"><MapPin className="w-3 h-3 mr-1" />{agent.city}</Badge>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground">Aucun agent trouvé.</div>
        )}
      </div>

      {/* ===== Dialog détail agent ===== */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detail && (() => {
            const agentMissions  = missions.filter(m => m.agentId === detail.id);
            const agentReports   = reports.filter(r => r.agentId === detail.id);
            const agentProjects  = projects.filter(p => p.agentId === detail.id);
            const completed      = agentMissions.filter(m => m.status === "terminee").length;
            const planifiees     = agentMissions.filter(m => m.status === "planifiee").length;
            const enCours        = agentMissions.filter(m => m.status === "en_cours").length;
            const rate           = agentMissions.length ? Math.round(completed / agentMissions.length * 100) : 0;
            const reportsValides = agentReports.filter(r => r.status === "valide").length;
            const initials = detail.fullName?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "?";

            // 5 missions les plus récentes
            const recentMissions = [...agentMissions]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5);

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-heading sr-only">Fiche agent</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* En-tête */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0 overflow-hidden">
                      {detail.avatarUrl
                        ? <img src={detail.avatarUrl} alt="" className="w-full h-full object-cover" />
                        : initials}
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold">{detail.fullName || "Sans nom"}</h2>
                      <p className="text-muted-foreground text-sm">{detail.email}</p>
                      {detail.bio && <p className="text-sm mt-1 text-foreground/80">{detail.bio}</p>}
                    </div>
                  </div>

                  {/* Infos contact */}
                  <div className="grid grid-cols-2 gap-3">
                    {detail.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{detail.phone}</span>
                      </div>
                    )}
                    {detail.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{detail.city}{detail.country ? `, ${detail.country}` : ""}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Depuis {new Date(detail.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-muted/30 rounded-xl p-3 text-center">
                      <p className="text-xl font-heading font-bold text-primary">{agentProjects.length}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Projets</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 text-center">
                      <p className="text-xl font-heading font-bold">{agentMissions.length}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Missions</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-heading font-bold text-green-600">{completed}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Terminées</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 text-center">
                      <p className="text-xl font-heading font-bold text-secondary">{agentReports.length}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Rapports</p>
                    </div>
                  </div>

                  {/* Taux de complétion */}
                  {agentMissions.length > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Taux de complétion missions</span>
                        <span className="font-semibold">{rate}%</span>
                      </div>
                      <Progress value={rate} className="h-2" />
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{planifiees} planifiée{planifiees !== 1 ? "s" : ""}</span>
                        <span className="flex items-center gap-1 text-orange-600"><AlertCircle className="w-3 h-3" />{enCours} en cours</span>
                        <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-3 h-3" />{completed} terminée{completed !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  )}

                  {/* Projets assignés */}
                  {agentProjects.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" /> Projets assignés
                      </p>
                      <div className="space-y-2">
                        {agentProjects.map(proj => (
                          <div key={proj.id} className="flex items-center gap-3 bg-muted/30 rounded-xl px-3 py-2 text-sm">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{proj.title}</p>
                              <p className="text-xs text-muted-foreground">{proj.client?.fullName || proj.client?.email || "—"}</p>
                            </div>
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {proj.status === "en_cours" ? "En cours" : proj.status === "termine" ? "Terminé" : proj.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missions récentes */}
                  {recentMissions.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Missions récentes
                      </p>
                      <div className="space-y-2">
                        {recentMissions.map(m => (
                          <div key={m.id} className="flex items-center gap-3 bg-muted/30 rounded-xl px-3 py-2 text-sm">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{m.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(m.date).toLocaleDateString("fr-FR")}
                                {m.time ? ` · ${m.time}` : ""}
                                {m.address ? ` · ${m.address}` : ""}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${missionStatusColor[m.status] || ""}`}>
                              {missionStatusLabel[m.status] || m.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rapports */}
                  {agentReports.length > 0 && (
                    <div className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3 text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Rapports soumis
                      </span>
                      <span className="font-semibold">{agentReports.length} <span className="font-normal text-muted-foreground">dont</span> {reportsValides} validé{reportsValides !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ===== Dialog invitation ===== */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading">Inviter un agent</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="agent@email.com" />
            </div>
            <Button onClick={invite} disabled={inviting || !inviteEmail} className="w-full">
              <Mail className="w-4 h-4 mr-2" /> {inviting ? "Envoi..." : "Envoyer l'invitation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
