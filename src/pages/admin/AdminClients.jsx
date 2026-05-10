import { useState, useEffect } from "react";
import { usersApi } from "@/api/users";
import { projectsApi } from "@/api/projects";
import { Search, Mail, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminClients() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    async function load() {
      const [u, p] = await Promise.all([
        usersApi.list({ role: "client" }),
        projectsApi.list(),
      ]);
      setUsers(u);
      setProjects(p);
      setLoading(false);
    }
    load();
  }, []);

  const invite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    try {
      const { user: newUser, tempPassword } = await usersApi.invite(inviteEmail, "client");
      setUsers(prev => [newUser, ...prev]);
      alert(`Compte créé !\nEmail : ${inviteEmail}\nMot de passe temporaire : ${tempPassword}\n\nCommuniquez ces identifiants au client.`);
    } catch (e) {
      alert(e.message || "Erreur lors de l'invitation");
    } finally {
      setInviteEmail("");
      setShowInvite(false);
      setInviting(false);
    }
  };

  const filtered = users.filter(u =>
    !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Clients</h1>
        <Button onClick={() => setShowInvite(true)}><UserPlus className="w-4 h-4 mr-2" />Inviter un client</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(client => {
          const clientProjects = projects.filter(p => p.client?.email === client.email);
          return (
            <div key={client.id} className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                  {client.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{client.fullName || "Sans nom"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">{clientProjects.length} projet{clientProjects.length !== 1 ? "s" : ""}</Badge>
                <Badge variant="outline" className={client.subscriptionStatus === "actif" ? "text-green-600 border-green-500/30" : "text-muted-foreground"}>
                  {client.subscriptionStatus || "inactif"}
                </Badge>
                {client.countryResidence && <Badge variant="outline">{client.countryResidence}</Badge>}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading">Inviter un client</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="client@email.com" />
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