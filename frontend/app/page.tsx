"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

/**
 * Base URL of the FastAPI backend.
 * - Local dev: set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local
 * - Vercel: leave unset, so requests go to /api/* on the same domain.
 */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

type Message = { role: "user" | "coach"; text: string };
type Health = "checking" | "online" | "offline";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<Health>("checking");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // On first load, ping GET /api/health so the user can see whether the backend is up.
  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((res) => setHealth(res.ok ? "online" : "offline"))
      .catch(() => setHealth("offline"));
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Let the text box grow with what the user types (up to a cap set in CSS).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  /** Send the current message to POST /api/chat and append the coach's reply. */
  async function sendMessage(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // FastAPI puts its error message in `detail`.
        throw new Error(data.detail ?? `Request failed (${res.status})`);
      }
      setMessages((prev) => [...prev, { role: "coach", text: data.reply ?? "" }]);
      setHealth("online");
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Couldn't reach the backend. Is it running?"
          : (err as Error).message
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  /** Enter sends; Shift+Enter adds a new line. */
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="shell">
      <header className="header">
        <div>
          <h1>Mental Coach</h1>
          <p className="subtitle">A supportive space to talk things through.</p>
        </div>
        <span className={`status status-${health}`} aria-live="polite">
          <span className="dot" />
          {health === "checking" ? "Checking…" : health === "online" ? "Online" : "Offline"}
        </span>
      </header>

      <section className="chat" aria-live="polite">
        {messages.length === 0 && (
          <div className="empty">
            <p>What&apos;s on your mind today?</p>
            <p className="hint">Press Enter to send, Shift+Enter for a new line.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.text}
          </div>
        ))}

        {loading && <div className="bubble coach typing">Thinking…</div>}
        {error && <div className="error">⚠️ {error}</div>}
        <div ref={bottomRef} />
      </section>

      <form className="composer" onSubmit={sendMessage}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message…"
          rows={1}
          aria-label="Your message"
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </main>
  );
}
