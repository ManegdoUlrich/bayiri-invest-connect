import { useState, useEffect } from "react";
import { usersApi } from "@/api/users";
import { useAuth } from "@/lib/AuthContext";
import { User, Save, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ phone: "", country: "", city: "", countryResidence: "", bio: "", preferredLanguage: "fr" });
  const [notifForm, setNotifForm] = useState({ notifEmail: true, notifWhatsapp: false, whatsappNumber: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingNotif, setSavingNotif] = useState(false);
  const [savedNotif, setSavedNotif] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        phone: user.phone || "",
        country: user.country || "",
        city: user.city || "",
        countryResidence: user.countryResidence || "",
        bio: user.bio || "",
        preferredLanguage: user.preferredLanguage || "fr",
      });
      setNotifForm({
        notifEmail: user.notifEmail !== undefined ? user.notifEmail : true,
        notifWhatsapp: user.notifWhatsapp || false,
        whatsappNumber: user.whatsappNumber || "",
      });
    }
  }, [user]);

  const save = async () => {
    setSaving(true);
    try {
      await usersApi.update(user.id, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des paramètres :", err);
    }
    setSaving(false);
  };

  const saveNotif = async () => {
    setSavingNotif(true);
    try {
      await usersApi.update(user.id, {
        notifEmail: notifForm.notifEmail,
        notifWhatsapp: notifForm.notifWhatsapp,
        whatsappNumber: notifForm.whatsappNumber || null,
      });
      setSavedNotif(true);
      setTimeout(() => setSavedNotif(false), 3000);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des préférences de notifications :", err);
    }
    setSavingNotif(false);
  };

  if (!user) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-heading font-bold">Paramètres</h1>

      {/* Informations personnelles */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border/50">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
            {user.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || <User className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user.fullName}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Téléphone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
          <div><Label>Pays de résidence</Label><Input value={form.countryResidence} onChange={e => setForm(p => ({ ...p, countryResidence: e.target.value }))} /></div>
          <div><Label>Pays d'origine</Label><Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} /></div>
          <div><Label>Ville</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} /></div>
        </div>

        <div><Label>Langue préférée</Label>
          <Select value={form.preferredLanguage} onValueChange={v => setForm(p => ({ ...p, preferredLanguage: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={save} disabled={saving}>
          <Save className="w-4 h-4 mr-2" /> {saving ? "Enregistrement..." : saved ? "Sauvegardé ✓" : "Enregistrer"}
        </Button>
      </div>

      {/* Préférences de notifications */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Préférences de notifications</h2>
        </div>

        {/* Toggle email */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notifications par email</p>
            <p className="text-sm text-muted-foreground">Recevoir les alertes importantes par email</p>
          </div>
          <Switch
            checked={notifForm.notifEmail}
            onCheckedChange={v => setNotifForm(p => ({ ...p, notifEmail: v }))}
          />
        </div>

        {/* Toggle WhatsApp */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notifications par WhatsApp</p>
            <p className="text-sm text-muted-foreground">Recevoir les alertes importantes par WhatsApp</p>
          </div>
          <Switch
            checked={notifForm.notifWhatsapp}
            onCheckedChange={v => setNotifForm(p => ({ ...p, notifWhatsapp: v }))}
          />
        </div>

        {/* Champ numéro WhatsApp — affiché uniquement si activé */}
        {notifForm.notifWhatsapp && (
          <div>
            <Label>Numéro WhatsApp</Label>
            <Input
              value={notifForm.whatsappNumber}
              onChange={e => setNotifForm(p => ({ ...p, whatsappNumber: e.target.value }))}
              placeholder="+226 XX XX XX XX"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Format international requis, ex : +22670123456</p>
          </div>
        )}

        <Button onClick={saveNotif} disabled={savingNotif}>
          <Save className="w-4 h-4 mr-2" /> {savingNotif ? "Enregistrement..." : savedNotif ? "Sauvegardé ✓" : "Enregistrer les préférences"}
        </Button>
      </div>
    </div>
  );
}
