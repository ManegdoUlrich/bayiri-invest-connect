import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { useLang } from "@/lib/LangContext";
import CreateProjectFlow from "../components/CreateProjectFlow";
import { translations } from "@/lib/i18n";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectCard from "../components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProjectsList() {
  const { lang } = useLang();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const tx = translations[lang].projects;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const projs = await projectsApi.list();
      setProjects(projs);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">{tx.title}</h1>
        <Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-2" /> Nouveau projet</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={tx.search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tx.all_statuses}</SelectItem>
            <SelectItem value="en_attente">{tx.status_en_attente}</SelectItem>
            <SelectItem value="en_cours">{tx.status_en_cours}</SelectItem>
            <SelectItem value="pause">{tx.status_pause}</SelectItem>
            <SelectItem value="termine">{tx.status_termine}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {tx.no_result}
        </div>
      )}
      <CreateProjectFlow open={showCreate} onClose={() => setShowCreate(false)} onCreated={() => setShowCreate(false)} />
    </div>
  );
}