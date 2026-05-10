import { useState, useEffect } from "react";
import { usersApi } from "@/api/users";
import { useAuth } from "@/lib/AuthContext";
import { User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ phone: "", country: "", city: "", countryResidence: "", bio: "", preferred_language: "fr" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        phone: user.phone || "",
        country: user.country || "",
        city: user.city || "",
        countryResidence: user.countryResidence || "",
        bio: user.bio || "",
        preferred_language: user.preferred_language || "fr",
      });
    }
  }, [user]);

  const save = async () => {
    setSaving(true);
    await usersApi.update(user.id, form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-heading font-bold">Paramètres</h1>

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
          <Select value={form.preferred_language} onValueChange={v => setForm(p => ({ ...p, preferred_language: v }))}>
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
    </div>
  );
}