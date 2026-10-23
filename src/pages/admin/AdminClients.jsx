import { useState, useEffect } from "react";
import { usersApi } from "@/api/users";
import { projectsApi } from "@/api/projects";
import { paymentsApi } from "@/api/payments";
import { Search, Mail, UserPlus, FolderOpen, CreditCard, MapPin, Phone, Globe, Calendar, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const subStatusColor = {
  actif:    "text-green-600 border-green-500/30 bg-green-500/5",
  inactif:  "text-muted-foreground border-border",
  essai:    "text-blue-600 border-blue-500/30 bg-blue-500/5",
  suspendu: "text-red-600 border-red-500/30 bg-red-500/5",
};

export default function AdminClients() {
  const [users, setUsers]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [detail, setDetail]     = useState(null); // client sélectionné

  useEffect(() => {
    async function load() {
      const [u, p, pay] = await Promise.all([
        usersApi.list({ role: "client" }),
        projectsApi.list(),
        paymentsApi.list(),
      ]);
      setUsers(u);
      setProjects(p);
      setPayments(pay);
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
    !search ||
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

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
          const clientProjects = projects.filter(p => p.clientId === client.id);
          const clientPayments = payments.filter(p => p.clientId === client.id);
          const aJour = clientPayments.filter(p => p.status === "a_jour").length;
          return (
            <div
              key={client.id}
              className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setDetail(client)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-lg shrink-0">
                  {client.avatarUrl
                    ? <img src={client.avatarUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                    : (client.fullName?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "?")}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{client.fullName || "Sans nom"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">
                  <FolderOpen className="w-3 h-3 mr-1" />{clientProjects.length} projet{clientProjects.length !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline" className={subStatusColor[client.subscriptionStatus] || subStatusColor.inactif}>
                  {client.subscriptionStatus || "inactif"}
                </Badge>
                {aJour > 0 && (
                  <Badge variant="outline" className="text-green-600 border-green-500/30 bg-green-500/5">
                    <CreditCard className="w-3 h-3 mr-1" />{aJour} à jour
                  </Badge>
                )}
                {client.countryResidence && (
                  <Badge variant="outline"><Globe className="w-3 h-3 mr-1" />{client.countryResidence}</Badge>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground">Aucun client trouvé.</div>
        )}
      </div>

      {/* ===== Dialog détail client ===== */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detail && (() => {
            const clientProjects = projects.filter(p => p.clientId === detail.id);
            const clientPayments = payments.filter(p => p.clientId === detail.id);
            const totalInvested  = clientPayments.filter(p => p.status === "a_jour").reduce((s, p) => s + (p.amount || 0), 0);
            const initials = detail.fullName?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "?";
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-heading sr-only">Fiche client</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* En-tête */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-2xl shrink-0 overflow-hidden">
                      {detail.avatarUrl
                        ? <img src={detail.avatarUrl} alt="" className="w-full h-full object-cover" />
                        : initials}
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold">{detail.fullName || "Sans nom"}</h2>
                      <p className="text-muted-foreground text-sm">{detail.email}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className={subStatusColor[detail.subscriptionStatus] || subStatusColor.inactif}>
                          {detail.subscriptionStatus || "inactif"}
                        </Badge>
                        {detail.onboardingComplete && (
                          <Badge variant="outline" className="text-green-600 border-green-500/30">Onboarding ✓</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Infos de contact */}
                  <div className="grid grid-cols-2 gap-3">
                    {detail.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{detail.phone}</span>
                      </div>
                    )}
                    {(detail.countryResidence || detail.country) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{detail.countryResidence || detail.country}</span>
                      </div>
                    )}
                    {detail.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{detail.city}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Membre depuis {new Date(detail.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
                    </div>
                  </div>

                  {/* Stats rapides */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-heading font-bold text-primary">{clientProjects.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">Projet{clientProjects.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-heading font-bold text-secondary">{clientPayments.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">Paiement{clientPayments.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-heading font-bold text-green-600">{totalInvested.toLocaleString("fr-FR")} €</p>
                      <p className="text-xs text-muted-foreground mt-1">Total payé</p>
                    </div>
                  </div>

                  {/* Projets */}
                  {clientProjects.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-primary" /> Projets ({clientProjects.length})
                      </p>
                      <div className="space-y-2">
                        {clientProjects.map(proj => (
                          <div key={proj.id} className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{proj.title}</p>
                              <p className="text-xs text-muted-foreground">{proj.city}{proj.country ? `, ${proj.country}` : ""}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <Progress value={proj.progress || 0} className="w-20 h-1.5 mb-1" />
                              <p className="text-xs text-muted-foreground">{proj.progress || 0}%</p>
                            </div>
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {proj.status === "en_cours" ? "En cours" : proj.status === "termine" ? "Terminé" : proj.status === "en_attente" ? "En attente" : proj.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Paiements */}
                  {clientPayments.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" /> Paiements ({clientPayments.length})
                      </p>
                      <div className="space-y-2">
                        {clientPayments.slice(0, 5).map(pay => (
                          <div key={pay.id} className="flex items-center justify-between bg-muted/30 rounded-xl px-3 py-2 text-sm">
                            <span className="text-muted-foreground truncate">{pay.description || pay.subscriptionType}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              {pay.amount && <span className="font-medium">{pay.amount.toLocaleString("fr-FR")} €</span>}
                              <Badge
                                variant="outline"
                                className={`text-xs ${pay.status === "a_jour" ? "text-green-600 border-green-500/30" : pay.status === "en_retard" ? "text-red-600 border-red-500/30" : "text-muted-foreground"}`}
                              >
                                {pay.status === "a_jour" ? "À jour" : pay.status === "en_retard" ? "En retard" : pay.status === "en_attente_validation" ? "En attente" : pay.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
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
