import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const accentMap = {
  default: "bg-primary/10 text-primary",
  green:   "bg-emerald-500/10 text-emerald-600",
  amber:   "bg-amber-500/10 text-amber-600",
  blue:    "bg-blue-500/10 text-blue-600",
  rose:    "bg-rose-500/10 text-rose-600",
  violet:  "bg-violet-500/10 text-violet-600",
  cyan:    "bg-cyan-500/10 text-cyan-600",
};

const borderMap = {
  default: "border-l-primary",
  green:   "border-l-emerald-500",
  amber:   "border-l-amber-500",
  blue:    "border-l-blue-500",
  rose:    "border-l-rose-500",
  violet:  "border-l-violet-500",
  cyan:    "border-l-cyan-500",
};

export default function StatCard({ icon: Icon, label, value, subtitle, trend, color = "default", className }) {
  return (
    <div className={cn(
      "bg-card rounded-2xl p-5 border border-border/50 border-l-4 hover:shadow-lg transition-all duration-300 group",
      borderMap[color] || borderMap.default,
      className
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-heading font-bold mt-1.5 text-foreground leading-none">{value}</p>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 mt-1.5">
              {trend && (
                <span className={cn(
                  "flex items-center gap-0.5 text-xs font-semibold",
                  trend.up ? "text-emerald-600" : "text-rose-500"
                )}>
                  {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {trend.value}
                </span>
              )}
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110", accentMap[color] || accentMap.default)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
