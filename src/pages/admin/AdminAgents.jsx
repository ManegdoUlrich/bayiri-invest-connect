import { useState, useEffect } from "react";
import { usersApi } from "@/api/users";
import { missionsApi } from "@/api/missions";
import { reportsApi } from "@/api/reports";
import { Search, UserPlus, MapPin, FileText, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [missions, setMissions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    async function load() {
      const [u, m, r] = await Promise.all([
        usersApi.list({ role: "agent" }),
        missionsApi.list(),
        reportsApi.list(),
      ]);
      setAgents(u);
      setMissions(m);
      setReports(r);
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
    !search || a.fullName?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

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
          const agentMissions = missions.filter(m => m.agent?.email === agent.email);
          const agentReports = reports.filter(r => r.agent?.email === agent.email);
          const completed = agentMissions.filter(m => m.status === "terminee").length;
          return (
            <div key={agent.id} className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {agent.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{agent.fullName || "Sans nom"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{agent.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{agentMissions.length} missions</span>
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{agentReports.length} rapports</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-green-600 border-green-500/30">{completed} terminées</Badge>
                {agent.city && <Badge variant="outline">{agent.city}</Badge>}
              </div>
            </div>
          );
        })}
      </div>

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