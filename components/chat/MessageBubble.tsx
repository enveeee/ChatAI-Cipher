import { formatTime } from "@/lib/utils";
import { Message } from "@/types";
import Avatar from "../ui/Avatar";

interface Props {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: Props) {
  const name = message.isAI ? "AI Assistant" : message.user?.name || "Unknown";

  return (
    <div style={{
      display: "flex",
      flexDirection: isOwn ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: "10px",
      marginBottom: "16px",
      animation: "fadeUp 0.2s ease",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Avatar name={name} isAI={message.isAI} size={32} />

      <div style={{ maxWidth: "65%", display: "flex", flexDirection: "column", gap: "4px", alignItems: isOwn ? "flex-end" : "flex-start" }}>
        <span style={{
          fontSize: "11px",
          color: message.isAI ? "var(--ai-accent)" : "var(--text-muted)",
          fontFamily: "Syne, sans-serif",
          fontWeight: 600,
          paddingLeft: "4px",
        }}>
          {name}
        </span>

        <div style={{
          background: message.isAI
            ? "var(--ai-bg)"
            : isOwn
            ? "var(--accent)"
            : "var(--surface2)",
          border: message.isAI
            ? "1px solid rgba(86,207,178,0.25)"
            : isOwn
            ? "none"
            : "1px solid var(--border)",
          borderRadius: isOwn ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          padding: "10px 14px",
          color: message.isAI
            ? "var(--text)"
            : "var(--text)",
          fontSize: "14px",
          lineHeight: 1.6,
          wordBreak: "break-word",
        }}>
          {message.content}
        </div>

        <span style={{ fontSize: "10px", color: "var(--text-muted)", paddingLeft: "4px" }}>
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}