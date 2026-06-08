"use client";
import { useRef, useState } from "react";

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hint}>
        Tip: type <code>@cipher</code> to ask Cipher
      </div>
      <div style={styles.inputRow}>
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
          rows={1}
          disabled={disabled}
          style={{
            resize: "none",
            flex: 1,
            maxHeight: "100px",
            overflow: "auto",
          }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          style={{ flexShrink: 0, height: 42, padding: "0 20px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "16px 20px",
    borderTop: "1px solid var(--border)",
    background: "var(--surface)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  hint: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-end",
  },
};