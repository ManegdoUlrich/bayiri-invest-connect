import { Link } from "react-router-dom";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const statusLabels = {
  en_attente: "En attente",
  en_cours: "En cours",
  pause: "En pause",
  termine: "Terminé",
  annule: "Annulé",
};

const statusColors = {
  en_attente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  en_cours: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  pause: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  termine: "bg-green-500/10 text-green-600 border-green-500/20",
  annule: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function ProjectCard({ project, linkPrefix = "/projects" }) {
  const coverImage = project.coverImageUrl || project.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=600&h=400&fit=crop";

  return (
    <Link to={`${linkPrefix}/${project.id}`} className="group block">
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
        {/* Cover image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <Badge className={`absolute top-4 right-4 border ${statusColors[project.status] || ""}`}>
            {statusLabels[project.status] || project.status}
          </Badge>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-heading font-bold text-lg leading-tight">{project.title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {project.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {project.city}, {project.country}
              </span>
            )}
            {project.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(project.startDate).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-semibold text-foreground">{project.progress || 0}%</span>
            </div>
            <Progress value={project.progress || 0} className="h-2" />
          </div>

          {/* Budget */}
          {project.budget && (
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-sm text-muted-foreground">Budget</span>
              <span className="font-heading font-bold text-foreground">
                {project.budget?.toLocaleString("fr-FR")} €
              </span>
            </div>
          )}

          <div className="flex items-center justify-end text-primary text-sm font-medium gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Voir détails <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}