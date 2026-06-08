import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  isAI?: boolean;
  size?: number;
}

export default function Avatar({ name, isAI = false, size = 36 }: AvatarProps) {
  const bg = isAI
    ? "linear-gradient(135deg, #1a3a3a, #0f2a2a)"
    : `hsl(${name.charCodeAt(0) * 7}deg 50% 25%)`;

  const color = isAI ? "var(--ai-accent)" : "var(--text)";

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.35,
      fontFamily: "Syne, sans-serif",
      fontWeight: 700,
      color,
      border: isAI ? "1.5px solid var(--ai-accent)" : "1.5px solid var(--border)",
      flexShrink: 0,
    }}>
      {isAI ? "✦" : getInitials(name)}
    </div>
  );
}