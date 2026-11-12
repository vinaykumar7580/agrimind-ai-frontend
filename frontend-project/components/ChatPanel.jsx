"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Send,
  Leaf,
  Sparkles,
  User,
  Trash2,
  RotateCw,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

const suggestions = [
  "What disease is affecting my crop?",
  "How to increase wheat yield?",
  "Best fertilizer schedule for kharif",
  "When should I harvest my soybeans?",
];

const API_BASE = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;
const PAGE_SIZE = 50;

// History pages backwards: skip=0 is the newest page, each page oldest-first.
const fetchHistoryPage = async (skip) => {
  const response = await fetch(
    `${API_BASE}/api/chat/history?skip=${skip}&limit=${PAGE_SIZE}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "History fetch failed");
  }

  return data.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    time: parseTime(m.created_at),
  }));
};

// The backend stores UTC timestamps without a timezone suffix.
const parseTime = (iso) =>
  new Date(/Z$|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);

const formatTime = (date) => {
  if (!date || Number.isNaN(date.getTime())) return "";

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return date.toDateString() === new Date().toDateString()
    ? time
    : `${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${time}`;
};

// Light formatting for AI replies: "* " / "- " bullets and **bold**.
const renderContent = (text) =>
  text
    .replace(/^\s*[*-]\s+/gm, "• ")
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );

function Avatar({ role }) {
  return (
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: "rgba(61,154,64,0.2)",
        border: "1px solid rgba(61,154,64,0.3)",
      }}
    >
      {role === "user" ? (
        <User size={13} style={{ color: "#52C455" }} />
      ) : (
        <Leaf size={13} style={{ color: "#52C455" }} />
      )}
    </div>
  );
}

export default function ChatPanel({ scanId, active }) {
  const [messages, setMessages] = useState([]);
  const [historyStatus, setHistoryStatus] = useState("loading");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasOlder, setHasOlder] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const listRef = useRef(null);
  const historyRequested = useRef(false);
  // Set before older messages are prepended, so the list keeps its position.
  const scrollAnchor = useRef(null);

  const loadHistory = async () => {
    setHistoryStatus("loading");

    try {
      const page = await fetchHistoryPage(0);
      setMessages(page);
      setHasOlder(page.length === PAGE_SIZE);
      setHistoryStatus("ready");
    } catch (err) {
      console.error(err);
      setHistoryStatus("error");
    }
  };

  const loadOlder = async () => {
    // Messages sent this session are on the server too and shift the pages, so
    // skip every saved message on screen. Unsent (failed) ones were not saved.
    const skip = messages.filter((m) => !m.failed).length;

    setLoadingOlder(true);

    try {
      const page = await fetchHistoryPage(skip);
      const list = listRef.current;

      if (list) {
        scrollAnchor.current = {
          height: list.scrollHeight,
          top: list.scrollTop,
        };
      }

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        return [...page.filter((m) => !ids.has(m.id)), ...prev];
      });
      setHasOlder(page.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
      toast.error("Could not load older messages. Please try again.");
    } finally {
      setLoadingOlder(false);
    }
  };

  // The ref keeps this to one request, including under StrictMode.
  useEffect(() => {
    if (historyRequested.current) return;
    historyRequested.current = true;
    loadHistory();
  }, []);

  // Scroll only the message list, not the whole page. After older messages are
  // prepended, keep the view where it was; otherwise follow the newest message.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const anchor = scrollAnchor.current;
    if (anchor) {
      scrollAnchor.current = null;
      list.scrollTop = list.scrollHeight - anchor.height + anchor.top;
      return;
    }

    if (active) list.scrollTop = list.scrollHeight;
  }, [messages, isTyping, active]);

  const sendMessage = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;

    const localId = `local-${Date.now()}`;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: localId, role: "user", content: msg, time: new Date() },
    ]);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, scan_id: scanId ?? null }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || data?.message || "Message failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.message_id,
          role: "assistant",
          content: data.response,
          time: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
      // The backend saves nothing when the reply fails, so mark it unsent.
      setMessages((prev) =>
        prev.map((m) => (m.id === localId ? { ...m, failed: true } : m))
      );
    } finally {
      setIsTyping(false);
    }
  };

  const retryMessage = (failed) => {
    setMessages((prev) => prev.filter((m) => m.id !== failed.id));
    sendMessage(failed.content);
  };

  const clearHistory = async () => {
    if (!window.confirm("Clear your whole chat history? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/chat/history`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Clear history failed");

      setMessages([]);
      setHasOlder(false);
    } catch (err) {
      console.error(err);
      toast.error("Could not clear chat history. Please try again.");
    }
  };

  const canSend =
    historyStatus !== "loading" && !isTyping && input.trim().length > 0;

  return (
    <div className="flex flex-col" style={{ minHeight: "500px" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 pb-4 mb-4"
        style={{ borderBottom: "1px solid rgba(61,154,64,0.15)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(61,154,64,0.3), rgba(82,196,85,0.2))",
            border: "1px solid rgba(61,154,64,0.3)",
          }}
        >
          <Sparkles size={16} style={{ color: "#52C455" }} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "#F0EBE0" }}>
            AgriMind Chat
          </p>

          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#52C455" }}
            />
            <p className="text-xs" style={{ color: "#6B8F6B" }}>
              {scanId
                ? "Powered by AI · using your latest scan"
                : "Powered by AI"}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            disabled={isTyping}
            title="Clear chat history"
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid rgba(61,154,64,0.15)" }}
          >
            <Trash2 size={14} style={{ color: "#6B8F6B" }} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4"
        style={{ maxHeight: "380px" }}
      >
        {hasOlder ? (
          <div className="flex justify-center">
            <button
              onClick={loadOlder}
              disabled={loadingOlder || isTyping}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(61,154,64,0.1)",
                border: "1px solid rgba(61,154,64,0.2)",
                color: "#8FAF8F",
              }}
            >
              <ChevronUp size={12} />
              {loadingOlder ? "Loading…" : "Load older messages"}
            </button>
          </div>
        ) : (
          // The greeting marks the start of the conversation, so it only
          // appears once there is nothing older to load.
          <div className="flex items-start gap-2.5">
            <Avatar role="assistant" />
            <div className="max-w-[80%] chat-ai px-4 py-3">
              <p className="text-sm" style={{ color: "#F0EBE0", lineHeight: "1.6" }}>
                Hello! I&apos;m AgriMind AI. Upload a crop or soil image to get
                personalized analysis, or ask me anything about your farm.
              </p>
            </div>
          </div>
        )}

        {historyStatus === "loading" && (
          <div className="shimmer rounded-xl h-12" />
        )}

        {historyStatus === "error" && (
          <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "#6B8F6B" }}>
            Could not load earlier messages.
            <button
              onClick={loadHistory}
              className="underline"
              style={{ color: "#52C455" }}
            >
              Retry
            </button>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar role={msg.role} />

            <div
              className={`max-w-[80%] ${
                msg.role === "user" ? "chat-user" : "chat-ai"
              } px-4 py-3`}
            >
              <p
                className="text-sm whitespace-pre-wrap"
                style={{ color: "#F0EBE0", lineHeight: "1.6" }}
              >
                {msg.role === "user" ? msg.content : renderContent(msg.content)}
              </p>

              {msg.failed ? (
                <button
                  onClick={() => retryMessage(msg)}
                  disabled={isTyping}
                  className="flex items-center gap-1 text-xs mt-1.5"
                  style={{ color: "#E84040" }}
                >
                  <RotateCw size={11} />
                  Not sent — tap to retry
                </button>
              ) : (
                <p className="text-xs mt-1.5" style={{ color: "#6B8F6B" }}>
                  {formatTime(msg.time)}
                </p>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2.5">
            <Avatar role="assistant" />
            <div className="chat-ai px-4 py-3">
              <div className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: "#52C455" }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {historyStatus !== "loading" && messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              disabled={isTyping}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(61,154,64,0.1)",
                border: "1px solid rgba(61,154,64,0.2)",
                color: "#8FAF8F",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSend) sendMessage();
          }}
          placeholder="Ask about crops, soil, weather, or market..."
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(61,154,64,0.2)",
            color: "#F0EBE0",
            fontFamily: "Inter, sans-serif",
          }}
        />

        <button
          onClick={() => sendMessage()}
          disabled={!canSend}
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: canSend
              ? "rgba(61,154,64,0.25)"
              : "rgba(61,154,64,0.08)",
            border: `1px solid ${
              canSend ? "rgba(61,154,64,0.5)" : "rgba(61,154,64,0.15)"
            }`,
          }}
        >
          <Send size={16} style={{ color: canSend ? "#52C455" : "#3D5A3E" }} />
        </button>
      </div>
    </div>
  );
}
