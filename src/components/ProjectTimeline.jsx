import { CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectTimeline({ milestones = [] }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Aucun jalon défini pour ce projet.
      </div>
    );
  }

  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />

      <div className="space-y-6">
        {milestones.map((milestone, i) => {
          const completed = milestone.completed;
          return (
            <div key={i} className="relative flex gap-4">
              {/* Dot */}
              <div className={cn(
                "absolute -left-8 top-0.5 w-8 h-8 rounded-full flex items-center justify-center z-10",
                completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div className={cn(
                "flex-1 bg-card rounded-xl p-4 border border-border/50 ml-4",
                completed && "border-primary/20"
              )}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                  {milestone.date && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(milestone.date).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
                {milestone.description && (
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}