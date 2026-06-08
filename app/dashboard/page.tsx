"use client";
import { formatTime } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RoomStat {
  id: string;
  name: string;
  createdAt: string;
  _count: { members: number; messages: number };
}

interface RecentMessage {
  id: string;
  content: string;
  isAI: boolean;
  createdAt: string;
  user?: { name: string };
  room: { name: string };
}

interface DashboardData {
  totalMessages: number;
  totalRooms: number;
  totalUsers: number;
  recentMessages: RecentMessage[];
  rooms: RoomStat[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner} />
        Loading dashboard...
      </div>
    );
  }

  const user = session?.user as { name: string };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>✦ ChatAI</div>
        <nav style={styles.nav}>
          <Link href="/dashboard" style={{ ...styles.navItem, ...styles.navActive }}>
            📊 Dashboard
          </Link>
          <Link href="/chat/general" style={styles.navItem}>
            💬 Chat
          </Link>
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.userBadge}>
            <div style={styles.userAvatar}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              {user?.name}
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Welcome back, {user?.name} 👋
            </p>
          </div>
          <Link href="/chat/general">
            <button className="btn btn-primary">Open Chat →</button>
          </Link>
        </div>

        {/* Stat Cards */}
        <div style={styles.statsGrid}>
          <StatCard
            icon="💬"
            label="Total Messages"
            value={data?.totalMessages ?? 0}
            color="var(--accent)"
          />
          <StatCard
            icon="🏠"
            label="Active Rooms"
            value={data?.totalRooms ?? 0}
            color="var(--ai-accent)"
          />
          <StatCard
            icon="👥"
            label="Total Users"
            value={data?.totalUsers ?? 0}
            color="#f4a261"
          />
          <StatCard
            icon="✦"
            label="AI Responses"
            value={data?.recentMessages?.filter((m) => m.isAI).length ?? 0}
            color="#e76f51"
          />
        </div>

        {/* Bottom grid */}
        <div style={styles.bottomGrid}>
          {/* Rooms table */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🏠 Rooms Overview</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Room", "Members", "Messages"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.rooms.map((room) => (
                  <tr key={room.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={{ color: "var(--ai-accent)" }}>#</span>{" "}
                      {room.name}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{room._count.members}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{room._count.messages}</span>
                    </td>
                  </tr>
                ))}
                {!data?.rooms.length && (
                  <tr>
                    <td colSpan={3} style={{ ...styles.td, color: "var(--text-muted)", textAlign: "center" }}>
                      No rooms yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent activity */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>⚡ Recent Activity</h2>
            <div style={styles.activityList}>
              {data?.recentMessages.map((msg) => (
                <div key={msg.id} style={styles.activityItem}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: msg.isAI ? "var(--ai-bg)" : "var(--surface2)",
                    border: msg.isAI ? "1px solid var(--ai-accent)" : "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    flexShrink: 0,
                    color: msg.isAI ? "var(--ai-accent)" : "var(--text)",
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                  }}>
                    {msg.isAI ? "✦" : (msg.user?.name?.[0] || "?").toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: msg.isAI ? "var(--ai-accent)" : "var(--text)" }}>
                        {msg.isAI ? "Cipher" : msg.user?.name || "Unknown"}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                        #{msg.room.name} · {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    <p style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: "2px",
                    }}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              {!data?.recentMessages.length && (
                <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                  No activity yet
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      transition: "transform 0.2s",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: "12px",
        background: `${color}18`,
        border: `1px solid ${color}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: "2rem",
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          color,
          lineHeight: 1,
        }}>
          {value.toLocaleString()}
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--bg)",
  },
  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    color: "var(--text-muted)",
    gap: "16px",
    fontFamily: "Syne, sans-serif",
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--accent)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  sidebar: {
    width: 220,
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    position: "sticky",
    top: 0,
    height: "100vh",
    flexShrink: 0,
  },
  logo: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 800,
    fontSize: "20px",
    color: "var(--accent)",
    marginBottom: "32px",
    paddingLeft: "8px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  navItem: {
    display: "block",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "14px",
    color: "var(--text-muted)",
    textDecoration: "none",
    transition: "all 0.15s",
    fontFamily: "DM Sans, sans-serif",
  },
  navActive: {
    background: "var(--surface2)",
    color: "var(--text)",
    borderLeft: "2px solid var(--accent)",
  },
  sidebarFooter: {
    borderTop: "1px solid var(--border)",
    paddingTop: "16px",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    color: "white",
    flexShrink: 0,
  },
  main: {
    flex: 1,
    padding: "32px",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
  },
  title: {
    fontSize: "2rem",
    fontFamily: "Syne, sans-serif",
    fontWeight: 800,
    marginBottom: "4px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "24px",
  },
  cardTitle: {
    fontFamily: "Syne, sans-serif",
    fontSize: "15px",
    fontWeight: 700,
    marginBottom: "16px",
    color: "var(--text)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left" as const,
    fontSize: "11px",
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    paddingBottom: "10px",
    borderBottom: "1px solid var(--border)",
  },
  tr: {
    borderBottom: "1px solid var(--border)",
  },
  td: {
    padding: "10px 0",
    fontSize: "13px",
    color: "var(--text)",
  },
  badge: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "12px",
    fontFamily: "Syne, sans-serif",
    fontWeight: 600,
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  activityItem: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
  },
};