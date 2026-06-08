"use client";

import { Room } from "@/types";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface Props {
  rooms: Room[];
  activeRoomId: string;
  onSelectRoom: (id: string) => void;
  onCreateRoom: (name: string) => void;
  userName: string;
}

export default function RoomSidebar({
  rooms,
  activeRoomId,
  onSelectRoom,
  onCreateRoom,
  userName,
}: Props) {
  const [newRoom, setNewRoom] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    if (!newRoom.trim()) return;

    onCreateRoom(
      newRoom.trim().toLowerCase().replace(/\s+/g, "-")
    );

    setNewRoom("");
    setCreating(false);
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logo}>✦ ChatAI</div>

        <div
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
          }}
        >
          @{userName}
        </div>
      </div>

      <div style={styles.section}>

        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          style={{
            display: "block",
            padding: "8px 10px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "var(--text-muted)",
            textDecoration: "none",
            marginBottom: "12px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
          }}
        >
          📊 Dashboard
        </Link>

        {/* Rooms Header */}
        <div style={styles.sectionLabel}>
          Rooms

          <button
            style={styles.addBtn}
            onClick={() => setCreating(!creating)}
          >
            +
          </button>
        </div>

        {/* Create Room Input */}
        {creating && (
          <div
            style={{
              padding: "8px 0",
              display: "flex",
              gap: "6px",
            }}
          >
            <input
              placeholder="room-name"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleCreate()
              }
              style={{
                fontSize: "13px",
              }}
            />

            <button
              className="btn btn-primary"
              onClick={handleCreate}
              style={{
                padding: "8px 12px",
                fontSize: "12px",
              }}
            >
              Add
            </button>
          </div>
        )}

        {/* Rooms List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            marginTop: "4px",
          }}
        >
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              style={{
                ...styles.roomBtn,
                background:
                  room.id === activeRoomId
                    ? "var(--surface2)"
                    : "transparent",

                color:
                  room.id === activeRoomId
                    ? "var(--text)"
                    : "var(--text-muted)",

                borderLeft:
                  room.id === activeRoomId
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
              }}
            >
              # {room.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button
        className="btn btn-ghost"
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{
          margin: "auto 16px 16px",
          fontSize: "13px",
        }}
      >
        Sign out
      </button>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 240,
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    height: "100vh",
    position: "sticky",
    top: 0,
  },

  header: {
    padding: "20px 16px 16px",
    borderBottom: "1px solid var(--border)",
  },

  logo: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 800,
    fontSize: "18px",
    color: "var(--accent)",
    marginBottom: "4px",
  },

  section: {
    padding: "16px",
    flex: 1,
    overflowY: "auto",
  },

  sectionLabel: {
    fontSize: "11px",
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },

  addBtn: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "6px",
    width: "22px",
    height: "22px",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  roomBtn: {
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    padding: "8px 10px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
    fontFamily: "DM Sans, sans-serif",
    transition: "all 0.15s",
    width: "100%",
  },
};