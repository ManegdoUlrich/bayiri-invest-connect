import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import { usersApi } from "@/api/users";
import { paymentsApi } from "@/api/payments";
import { reportsApi } from "@/api/reports";
import { Users, FolderOpen, CreditCard, FileText, TrendingUp, MapPin } from "lucide-react";
import StatCard from "../../components/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(25,60%,53%)", "hsl(200,47%,33%)", "hsl(36,55%,70%)", "hsl(160,40%,45%)", "hsl(340,50%,55%)"];

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
      const agents = users.filter(u => u.role === "agent");
      const totalRevenue = payments.filter(p => p.status === "a_jour").reduce((s, p) => s + (p.amount || 0), 0);

      const byType = {};
      projects.forEach(p => { byType[p.type] = (byType[p.type] || 0) + 1; });
      const typeData = Object.entries(byType).map(([name, value]) => ({ name, value }));

      const byMonth = {};
      payments.filter(p => p.status === "a_jour").forEach(p => {
        const month = p.paidAt?.slice(0, 7) || p.createdAt?.slice(0, 7) || "N/A";
        byMonth[month] = (byMonth[month] || 0) + (p.amount || 0);
      });
      const revenueData = Object.entries(byMonth).sort().slice(-6).map(([month, amount]) => ({
        month: month.slice(5),
        amount,
      }));

      setStats({
        totalClients: clients.length,
        totalAgents: agents.length,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === "en_cours").length,
        totalRevenue,
        totalReports: reports.length,
        typeData,
        revenueData,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-heading font-bold">Dashboard Administrateur</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Clients" value={stats.totalClients} />
        <StatCard icon={MapPin} label="Agents" value={stats.totalAgents} />
        <StatCard icon={FolderOpen} label="Projets" value={stats.totalProjects} subtitle={`${stats.activeProjects} actifs`} />
        <StatCard icon={TrendingUp} label="Revenus" value={`${stats.totalRevenue.toLocaleString("fr-FR")} €`} />
        <StatCard icon={FileText} label="Rapports" value={stats.totalReports} />
        <StatCard icon={CreditCard} label="Projets actifs" value={stats.activeProjects} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="text-lg font-heading font-semibold mb-4">Revenus mensuels</h3>
          {stats.revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.revenueData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${v.toLocaleString("fr-FR")} €`} />
                <Bar dataKey="amount" fill="hsl(25,60%,53%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">Aucune donnée</div>
          )}
        </div>

        {/* Projects by type */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="text-lg font-heading font-semibold mb-4">Projets par type</h3>
          {stats.typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats.typeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {stats.typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">Aucune donnée</div>
          )}
        </div>
      </div>
    </div>
  );
}