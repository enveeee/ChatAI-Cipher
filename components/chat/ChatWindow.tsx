"use client";
import { connectSocket } from "@/lib/socket-client";
import { Message, Room } from "@/types";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Props {
  room: Room;
}

export default function ChatWindow({ room }: Props) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const user = session?.user as { id: string; name: string } | undefined;

  // Fetch history
  useEffect(() => {
    if (!room) return;
    setLoading(true);
    fetch(`/api/messages?roomId=${room.id}`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      });
  }, [room.id]);

  // Socket setup
  useEffect(() => {
    if (!user) return;

    const socket = connectSocket(user.id, user.name);
    socketRef.current = socket;

    socket.emit("join_room", room.id);

    socket.on("receive_message", (msg: Message) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("ai_typing", (isTyping: boolean) => setAiTyping(isTyping));

    socket.on("user_typing", ({ userName, isTyping }: { userName: string; isTyping: boolean }) => {
      setTypingUsers((prev) =>
        isTyping ? [...new Set([...prev, userName])] : prev.filter((u) => u !== userName)
      );
    });

    return () => {
      socket.emit("leave_room", room.id);
      socket.off("receive_message");
      socket.off("ai_typing");
      socket.off("user_typing");
    };
  }, [room.id, user]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!user || !socketRef.current) return;

      const tempId = `temp-${Date.now()}`;

      // Save to DB
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, roomId: room.id, userId: user.id }),
      });
      const saved = await res.json();

      // Emit via socket
      socketRef.current.emit("send_message", {
        roomId: room.id,
        content,
        userId: user.id,
        userName: user.name,
        messageId: saved.id || tempId,
      });
    },
    [room.id, user]
  );

  const handleTyping = useCallback(() => {
    if (!user || !socketRef.current) return;
    socketRef.current.emit("typing", { roomId: room.id, userName: user.name, isTyping: true });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", { roomId: room.id, userName: user.name, isTyping: false });
    }, 1500);
  }, [room.id, user]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={{ fontSize: "18px", color: "var(--text-muted)" }}>#</span>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "16px" }}>
            {room.name}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Type <code style={{ color: "var(--ai-accent)" }}>@cipher</code> to summon Cipher
          </div>
        </div>
      </div>

      <div style={styles.messages} onKeyDown={handleTyping}>
        {loading ? (
          <div style={styles.loading}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={styles.loading}>No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.userId === user?.id}
            />
          ))
        )}

        {aiTyping && (
          <div style={styles.typingIndicator}>
            <span style={{ color: "var(--ai-accent)", fontFamily: "Syne, sans-serif", fontSize: "12px" }}>
              ✦ AI Assistant is thinking
            </span>
            <span style={styles.dots}>
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        )}

        {typingUsers.length > 0 && (
          <div style={{ fontSize: "11px", color: "var(--text-muted)", padding: "0 4px 8px" }}>
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .dots span { animation: blink 1.2s infinite; }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <MessageInput onSend={handleSend} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    flexShrink: 0,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
  },
  loading: {
    color: "var(--text-muted)",
    textAlign: "center",
    paddingTop: "40px",
    fontSize: "14px",
  },
  typingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 0 8px",
  },
  dots: {
    display: "flex",
    gap: "2px",
    fontSize: "18px",
    color: "var(--ai-accent)",
  },
};