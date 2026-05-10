import { useState, useEffect, useRef } from "react";
import { messagesApi } from "@/api/messages";
import { useAuth } from "@/lib/AuthContext";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatBox({ projectId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg]     = useState("");
  const [sending, setSending]   = useState(false);
  const scrollRef = useRef(null);

  const fetchMessages = () => {
    if (!projectId) return
    messagesApi.list(projectId).then(setMessages).catch(() => {})
  }

  useEffect(() => {
    fetchMessages()
    // Polling toutes les 10s pour récupérer les nouveaux messages
    const interval = setInterval(fetchMessages, 10_000)
    return () => clearInterval(interval)
  }, [projectId])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!newMsg.trim() || sending) return;
    setSending(true);
    const msg = await messagesApi.send(projectId, newMsg.trim());
    setMessages(prev => [...prev, msg]);
    setNewMsg("");
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-card rounded-2xl border border-border/50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-12">
            Démarrez la conversation...
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender?.id === user?.id;
          const initials = msg.sender?.fullName?.slice(0, 2)?.toUpperCase()
                        || msg.sender?.email?.slice(0, 2)?.toUpperCase()
                        || "?";
          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className={`text-xs ${isMe ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p className="text-sm">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-border/50 flex gap-2">
        <Input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écrire un message..."
          className="flex-1"
        />
        <Button onClick={send} disabled={sending || !newMsg.trim()} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
