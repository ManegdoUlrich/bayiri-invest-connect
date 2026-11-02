import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersApi } from "@/api/users";
import { useAuth } from "@/lib/AuthContext";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/lib/LangContext";
import { translations } from "@/lib/i18n";

export default function Onboarding() {
  const { lang } = useLang();
  const tx = translations[lang].onboarding;
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const nameParts = (user?.fullName || "").trim().split(/\s+/);
  const [form, setForm] = useState({
    first_name: nameParts[0] || "",
    last_name: nameParts.slice(1).join(" ") || "",
    profession: "",
    phone: "", country_residence: "", country: "", city: "",
    project_type: "construction", project_description: "", budget_range: "",
  });
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const next = () => setStep(s => Math.min(s + 1, tx.steps.length - 1));
  const prev = () => {
    if (step === 0) { navigate('/login'); return; }
    setStep(s => s - 1);
  };

  const finish = async () => {
    setSaving(true);
    try {
      await usersApi.update(user.id, {
        fullName: `${form.first_name} ${form.last_name}`.trim(),
        phone: form.phone,
        countryResidence: form.country_residence,
        country: form.country,
        city: form.city,
        onboardingComplete: true,
      });
      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur lors de la soumission de l'onboarding :", err);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png"
            alt="Bayiri Invest"
            className="h-16 object-contain mx-auto mb-3"
          />
          <p className="text-muted-foreground mt-1">{tx.tagline}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {tx.steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {/* Step header */}
        <div className="mb-6">
          <h2 className="text-xl font-heading font-bold">{tx.steps[step].title}</h2>
          <p className="text-muted-foreground text-sm">{tx.steps[step].subtitle}</p>
        </div>

        {/* Step content */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{tx.first_name}</Label><Input value={form.first_name} onChange={e => update("first_name", e.target.value)} placeholder={tx.first_name_placeholder} /></div>
                <div><Label>{tx.last_name}</Label><Input value={form.last_name} onChange={e => update("last_name", e.target.value)} placeholder={tx.last_name_placeholder} /></div>
              </div>
              <div><Label>{tx.profession}</Label><Input value={form.profession} onChange={e => update("profession", e.target.value)} placeholder={tx.profession_placeholder} /></div>
              <div><Label>{tx.phone}</Label><Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+33 6 12 34 56 78" /></div>
              <div><Label>{tx.country_residence}</Label>
                <Select value={form.country_residence} onValueChange={v => update("country_residence", v)}>
                  <SelectTrigger><SelectValue placeholder={tx.select} /></SelectTrigger>
                  <SelectContent>
                    {["France", "Belgique", "Suisse", "Canada", "USA", "Allemagne", "UK", "Autre"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <Label className="mb-3 block">{tx.project_type}</Label>
                <RadioGroup value={form.project_type} onValueChange={v => update("project_type", v)} className="grid grid-cols-2 gap-3">
                  {tx.project_types.map(opt => (
                    <label key={opt.v} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${form.project_type === opt.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <RadioGroupItem value={opt.v} />
                      <span className="text-sm font-medium">{opt.l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label>{tx.project_description}</Label>
                <Textarea value={form.project_description} onChange={e => update("project_description", e.target.value)} placeholder={tx.project_description_placeholder} rows={4} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div><Label>{tx.project_country}</Label>
                <Select value={form.country} onValueChange={v => update("country", v)}>
                  <SelectTrigger><SelectValue placeholder={tx.select} /></SelectTrigger>
                  <SelectContent>
                    {["Burkina Faso"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>{tx.city}</Label><Input value={form.city} onChange={e => update("city", e.target.value)} placeholder={tx.city_placeholder} /></div>
            </>
          )}

          {step === 3 && (
            <div>
              <Label className="mb-3 block">{tx.budget}</Label>
              <RadioGroup value={form.budget_range} onValueChange={v => update("budget_range", v)} className="space-y-3">
                {tx.budget_options.map(opt => (
                  <label key={opt.v} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${form.budget_range === opt.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <RadioGroupItem value={opt.v} />
                    <span className="text-sm font-medium">{opt.l}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{tx.summary_name}</span><span className="font-medium">{form.first_name} {form.last_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{tx.summary_profession}</span><span className="font-medium">{form.profession || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{tx.summary_residence}</span><span className="font-medium">{form.country_residence || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{tx.summary_type}</span><span className="font-medium">{form.project_type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{tx.summary_location}</span><span className="font-medium">{form.city}, {form.country}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{tx.summary_budget}</span><span className="font-medium">{form.budget_range || "—"}</span></div>
              </div>
              {form.project_description && (
                <div><p className="text-sm text-muted-foreground">{tx.summary_description}</p><p className="text-sm">{form.project_description}</p></div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={prev}>
            <ArrowLeft className="w-4 h-4 mr-2" /> {step === 0 ? "Retour" : tx.prev}
          </Button>
          {step < tx.steps.length - 1 ? (
            <Button onClick={next}>
              {tx.next} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={finish} disabled={saving}>
              <CheckCircle className="w-4 h-4 mr-2" /> {saving ? tx.saving : tx.finish}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}