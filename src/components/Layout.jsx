import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { translations } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, FolderOpen, Users, MapPin, FileText, CreditCard,
  Settings, LogOut, Menu, X, ChevronRight, Shield, CheckSquare, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationBell from "./NotificationBell";

function getNavItems(txNav) {
  return {
    client: [
      { path: "/dashboard",  icon: LayoutDashboard, label: txNav.dashboard },
      { path: "/projects",   icon: FolderOpen,      label: txNav.projects },
      { path: "/payments",   icon: CreditCard,      label: txNav.payments },
      { path: "/messages",   icon: FileText,        label: txNav.messages },
    ],
    agent: [
      { path: "/agent",          icon: LayoutDashboard, label: txNav.dashboard },
      { path: "/agent/missions", icon: MapPin,          label: txNav.missions },
      { path: "/agent/reports",  icon: FileText,        label: txNav.reports },
      { path: "/agent/photos",   icon: Camera,          label: txNav.photos },
      { path: "/agent/tasks",    icon: CheckSquare,     label: txNav.tasks },
    ],
    admin: [
      { path: "/admin",           icon: LayoutDashboard, label: txNav.admin_dashboard },
      { path: "/admin/projects",  icon: FolderOpen,      label: txNav.admin_projects },
      { path: "/admin/clients",   icon: Users,           label: txNav.admin_clients },
      { path: "/admin/agents",    icon: MapPin,          label: txNav.admin_agents },
      { path: "/admin/payments",  icon: CreditCard,      label: txNav.admin_payments },
      { path: "/admin/reports",   icon: FileText,        label: txNav.admin_reports },
      { path: "/admin/contracts", icon: Shield,          label: txNav.admin_contracts },
      { path: "/admin/tasks",     icon: CheckSquare,     label: txNav.admin_tasks },
    ],
  };
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { lang } = useLang();
  const txNav = translations[lang].nav;

  const role  = user?.role || "client";
  const items = getNavItems(txNav)[role] || getNavItems(txNav).client;
  const initials = user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

  const isActive = (path) => {
    if (path === "/dashboard" && role === "client") return location.pathname === "/dashboard";
    if (path === "/agent"     && role === "agent")  return location.pathname === "/agent";
    if (path === "/admin"     && role === "admin")  return location.pathname === "/admin";
    return location.pathname.startsWith(path) && path !== "/" && path !== "/agent" && path !== "/admin";
  };

  return (
    <div className="min-h-screen flex bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-sidebar flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white">
              <span className="text-xl font-bold text-primary">B</span>
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-sidebar-foreground">Bayiri</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/50">Invest</p>
            </div>
          </Link>
          <button className="lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 mb-4">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-sidebar-border text-sidebar-foreground/60">
            {role === "client" ? txNav.client : role === "agent" ? txNav.agent : txNav.admin}
          </Badge>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="w-9 h-9">
              {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.fullName} />}
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.fullName || "..."}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title={txNav.logout}
              className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
