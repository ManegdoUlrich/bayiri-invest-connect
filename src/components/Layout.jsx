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
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Gold accent bar top */}
        <div className="h-0.5 bg-[hsl(var(--sidebar-ring))] w-full" />

        {/* Logo */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[hsl(var(--sidebar-ring))/0.15] border border-[hsl(var(--sidebar-ring))/0.30]">
              <span className="text-base font-heading font-normal text-[hsl(var(--sidebar-ring))]">B</span>
            </div>
            <div>
              <h1 className="text-base font-heading font-normal text-sidebar-foreground leading-none">Bayiri</h1>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[hsl(var(--sidebar-ring))/0.7] mt-0.5">Invest Connect</p>
            </div>
          </Link>
          <button className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 mb-4">
          <span className="inline-flex items-center text-[9px] uppercase tracking-[0.18em] text-sidebar-foreground/40 font-semibold">
            {role === "client" ? txNav.client : role === "agent" ? txNav.agent : txNav.admin}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                  ${active
                    ? "bg-[hsl(var(--sidebar-ring))/0.14] text-[hsl(var(--sidebar-ring))] font-semibold"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                  }
                `}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[hsl(var(--sidebar-ring))]" : "text-sidebar-foreground/40"}`} />
                <span>{item.label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[hsl(var(--sidebar-ring))]" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-sidebar-border/60">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors group">
            <Avatar className="w-8 h-8">
              {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.fullName} />}
              <AvatarFallback className="bg-[hsl(var(--sidebar-ring))/0.15] text-[hsl(var(--sidebar-ring))] text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.fullName || "..."}</p>
              <p className="text-[10px] text-sidebar-foreground/40 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title={txNav.logout}
              className="text-sidebar-foreground/30 hover:text-sidebar-foreground/80 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
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
