import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import { usersApi } from "@/api/users";
import { paymentsApi } from "@/api/payments";
import { reportsApi } from "@/api/reports";
import { Users, FolderOpen, CreditCard, FileText, TrendingUp, MapPin, Activity } from "lucide-react";
import StatCard from "../../components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie, Legend,
} from "recharts";

// Chart palette — matches design tokens (chart-1…5)
const CHART_COLORS = [
  "hsl(25,62%,55%)",
  "hsl(145,45%,42%)",
  "hsl(36,55%,65%)",
  "hsl(200,45%,45%)",
  "hsl(340,50%,58%)",
];

const TYPE_LABELS = {
  construction: "Construction",
  terrain: "Terrain",
  commerce: "Commerce",
  representation: "Représentation",
  logistique: "Logistique",
  autre: "Autre",
};

const PIPELINE = [
  { value: "soumis",           label: "Soumis",    color: "hsl(217,91%,60%)" },
  { value: "accepte",          label: "Accepté",   color: "hsl(245,80%,62%)" },
  { value: "prise_de_contact", label: "Contact",   color: "hsl(270,70%,58%)" },
  { value: "contrat",          label: "Contrat",   color: "hsl(300,55%,52%)" },
  { value: "paiement",         label: "Paiement",  color: "hsl(36,90%,52%)"  },
];

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/60 rounded-xl shadow-xl px-4 py-3 text-sm">
      {label && <p className="text-muted-foreground text-xs mb-1 font-medium">{label}</p>}
      <p className="font-heading font-bold text-foreground text-base">
        {typeof payload[0].value === "number"
          ? payload[0].value.toLocaleString("fr-FR") + (unit || "")
          : payload[0].value}
      </p>
    </div>
  );
};

const PipelineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/60 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">{payload[0].value} projet{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
};

const EmptyChart = () => (
  <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
    <Activity className="w-8 h-8 opacity-20" />
    <p className="text-sm">Aucune donnée disponible</p>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [projects, users, payments, reports] = await Promise.all([
        projectsApi.list(),
        usersApi.list(),
        paymentsApi.list(),
        reportsApi.list(),
      ]);

      const clients = users.filter(u => u.role === "client");
      const agents  = users.filter(u => u.role === "agent");
      const validPayments = payments.filter(p => p.status === "a_jour");
      const totalRevenue  = validPayments.reduce((s, p) => s + (p.amount || 0), 0);

      // Projects by type for donut
      const byType = {};
      projects.forEach(p => { byType[p.type] = (byType[p.type] || 0) + 1; });
      const typeData = Object.entries(byType).map(([name, value]) => ({
        name: TYPE_LABELS[name] || name,
        value,
      }));

      // Revenue by month (last 6 months)
      const byMonth = {};
      validPayments.forEach(p => {
        const month = p.paidAt?.slice(0, 7) || p.createdAt?.slice(0, 7) || "N/A";
        byMonth[month] = (byMonth[month] || 0) + (p.amount || 0);
      });
      const revenueData = Object.entries(byMonth).sort().slice(-6).map(([month, amount]) => ({
        month: new Date(month + "-01").toLocaleDateString("fr-FR", { month: "short" }),
        amount,
      }));

      // Pipeline funnel
      const pipelineData = PIPELINE.map(stage => ({
        label: stage.label,
        count: projects.filter(p => p.status === stage.value).length,
        color: stage.color,
      }));

      setStats({
        totalClients:   clients.length,
        totalAgents:    agents.length,
        totalProjects:  projects.length,
        activeProjects: projects.filter(p => ["soumis","accepte","prise_de_contact","contrat","paiement"].includes(p.status)).length,
        reportingCount: projects.filter(p => p.status === "reporting").length,
        totalRevenue,
        totalReports:   reports.length,
        typeData,
        revenueData,
        pipelineData,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Vue d'ensemble</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={Users}      label="Clients"        value={stats.totalClients}   color="blue" />
        <StatCard icon={MapPin}     label="Agents"         value={stats.totalAgents}    color="cyan" />
        <StatCard icon={FolderOpen} label="Projets"        value={stats.totalProjects}  subtitle={`${stats.activeProjects} en pipeline`} color="default" />
        <StatCard icon={TrendingUp} label="Revenus"        value={`${stats.totalRevenue.toLocaleString("fr-FR")} €`} color="green" />
        <StatCard icon={FileText}   label="Rapports"       value={stats.totalReports}   color="violet" />
        <StatCard icon={Activity}   label="En reporting"   value={stats.reportingCount} color="amber" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue bar chart */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="mb-5">
            <h3 className="font-heading font-semibold text-lg">Revenus mensuels</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Paiements validés — 6 derniers mois</p>
          </div>
          <div className="h-[220px]">
            {stats.revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.revenueData} barCategoryGap="35%">
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={38} />
                  <Tooltip content={<CustomTooltip unit=" €" />} cursor={{ fill: "hsl(var(--muted))", radius: 6 }} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </div>
        </div>

        {/* Donut chart — projects by type */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="mb-5">
            <h3 className="font-heading font-semibold text-lg">Répartition des projets</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Par type de prestation</p>
          </div>
          <div className="h-[220px]">
            {stats.typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.typeData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {stats.typeData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip unit=" projet(s)" />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </div>
        </div>
      </div>

      {/* Pipeline funnel */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="mb-5">
          <h3 className="font-heading font-semibold text-lg">Pipeline commercial</h3>
          <p className="text-muted-foreground text-xs mt-0.5">Nombre de dossiers à chaque étape</p>
        </div>
        <div className="h-[160px]">
          {stats.pipelineData.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.pipelineData} layout="vertical" barCategoryGap="30%">
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 500 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<PipelineTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {stats.pipelineData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </div>
      </div>
    </div>
  );
}
