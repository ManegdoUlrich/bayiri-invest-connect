import { useState, useEffect, useRef } from "react";
import { notificationsApi } from "@/api/notifications";
import { Bell, Check, X, FileText, CreditCard, PenLine, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const typeIcons = {
  status_change:      AlertCircle,
  new_report:         FileText,
  payment_due:        CreditCard,
  signature_request:  PenLine,
  signature_done:     Check,
  milestone_validated: CheckCircle,
};

const typeColors = {
  status_change:      "text-blue-600 bg-blue-500/10",
  new_report:         "text-green-600 bg-green-500/10",
  payment_due:        "text-orange-600 bg-orange-500/10",
  signature_request:  "text-purple-600 bg-purple-500/10",
  signature_done:     "text-green-600 bg-green-500/10",
  milestone_validated: "text-emerald-600 bg-emerald-500/10",
};

export default function NotificationBell() {
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen]     = useState(false);
  const ref = useRef(null);

  const fetchNotifs = () =>
    notificationsApi.list().then(setNotifs).catch(() => {})

  useEffect(() => {
    fetchNotifs()
    // Polling toutes les 30 secondes (remplace le subscribe() base44)
    const interval = setInterval(fetchNotifs, 30_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const unread = notifs.filter(n => !n.read).length

  const markRead = async (notif) => {
    if (notif.read) return
    await notificationsApi.markRead(notif.id)
    setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))
  }

  const markAllRead = async () => {
    await notificationsApi.markAllRead()
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div ref={ref} className="relative">
      <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(o => !o)}>
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h3 className="font-heading font-semibold text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  Tout marquer lu
                </button>
              )}
              <button onClick={() => setOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto divide-y divide-border/30">
            {notifs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">Aucune notification</div>
            ) : (
              notifs.map(notif => {
                const Icon = typeIcons[notif.type] || Bell
                const colorClass = typeColors[notif.type] || "text-muted-foreground bg-muted"
                return (
                  <button
                    key={notif.id}
                    onClick={() => markRead(notif)}
                    className={cn(
                      "w-full text-left flex gap-3 p-4 transition-colors hover:bg-muted/30",
                      !notif.read && "bg-primary/5"
                    )}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium", !notif.read && "font-semibold")}>{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                      {notif.project?.title && (
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.project.title}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground/50 mt-1">
                        {new Date(notif.createdAt).toLocaleString("fr-FR", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
