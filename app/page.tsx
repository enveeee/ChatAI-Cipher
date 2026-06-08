import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/chat/general");

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      gap: "24px",
      padding: "24px",
    }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div style={{
          display: "inline-block",
          background: "var(--surface2)",
          border: "1px solid var(--border)",
          borderRadius: "100px",
          padding: "6px 16px",
          fontSize: "12px",
          color: "var(--ai-accent)",
          fontFamily: "Syne, sans-serif",
          fontWeight: 600,
          marginBottom: "24px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          Real-time • AI-powered
        </div>

        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.1, marginBottom: "16px" }}>
          Chat smarter.<br />
          <span style={{ color: "var(--accent)" }}>Think together.</span>
        </h1>

        <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "36px" }}>
          A real-time chat app with rooms, live typing indicators,
          and a built-in AI named{" "}
          <code style={{
            background: "var(--surface2)",
            padding: "2px 8px",
            borderRadius: "6px",
            color: "var(--ai-accent)",
          }}>Cipher</code>{" "}
          you can summon with{" "}
          <code style={{
            background: "var(--surface2)",
            padding: "2px 8px",
            borderRadius: "6px",
            color: "var(--ai-accent)",
          }}>@cipher</code>
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/register">
            <button className="btn btn-primary">Get Started</button>
          </Link>
          <Link href="/login">
            <button className="btn btn-ghost">Sign In</button>
          </Link>
        </div>
      </div>
    </main>
  );
}