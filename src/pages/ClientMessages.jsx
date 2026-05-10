import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { useLang } from "@/lib/LangContext";
import { translations } from "@/lib/i18n";
import { MessageCircle } from "lucide-react";
import ChatBox from "../components/ChatBox";

export default function ClientMessages() {
  const { lang } = useLang();
  const { user } = useAuth();
  const tx = translations[lang].messages;
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const projs = await projectsApi.list();
      setProjects(projs);
      if (projs.length > 0) setSelectedProject(projs[0]);
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
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-heading font-bold">{tx.title}</h1>

      {projects.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">{tx.no_project}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Project list */}
          <div className="space-y-2">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedProject?.id === p.id
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card border-border/50 hover:border-primary/20"
                }`}
              >
                <p className="font-medium text-sm truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.city}</p>
              </button>
            ))}
          </div>

          {/* Chat */}
          <div className="lg:col-span-3">
            {selectedProject ? (
              <ChatBox projectId={selectedProject.id} currentUserEmail={user?.email} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">{tx.select_project}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}