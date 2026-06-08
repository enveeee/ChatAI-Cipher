"use client";
import ChatWindow from "@/components/chat/ChatWindow";
import RoomSidebar from "@/components/chat/RoomSidebar";
import { Room } from "@/types";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/rooms")
      .then((r) => r.json())
      .then((data: Room[]) => {
        if (!data || !Array.isArray(data)) return;
        setRooms(data);

        // Find by id OR by name (handles /chat/general)
        const found =
          data.find((r) => r.id === roomId) ||
          data.find((r) => r.name === roomId) ||
          data[0];

        if (found) {
          setActiveRoom(found);
          // Always use the real id in the URL
          if (found.id !== roomId) {
            router.replace(`/chat/${found.id}`);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load rooms:", err);
        setLoading(false);
      });
  }, [status, roomId]);

  const handleSelectRoom = (id: string) => {
    const room = rooms.find((r) => r.id === id);
    if (room) {
      setActiveRoom(room);
      router.push(`/chat/${id}`);
    }
  };

  const handleCreateRoom = async (name: string) => {
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const room: Room = await res.json();
    setRooms((prev) => [...prev, room]);
    setActiveRoom(room);
    router.push(`/chat/${room.id}`);
  };

  if (status === "loading" || loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text-muted)",
        fontFamily: "Syne, sans-serif",
      }}>
        Loading Cipher...
      </div>
    );
  }

  if (!activeRoom) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text-muted)",
      }}>
        No rooms found. <button onClick={() => router.push("/login")} style={{ marginLeft: 8, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>Re-login</button>
      </div>
    );
  }

  const user = session?.user as { id: string; name: string };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <RoomSidebar
        rooms={rooms}
        activeRoomId={activeRoom.id}
        onSelectRoom={handleSelectRoom}
        onCreateRoom={handleCreateRoom}
        userName={user?.name || "User"}
      />
      <ChatWindow room={activeRoom} />
    </div>
  );
}