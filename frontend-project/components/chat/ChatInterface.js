"use client";

import { useState, useRef, useEffect } from "react";

// ------------------ MOCK API ------------------
async function sendChatMock({ question }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          answer: "This is a mock response for: " + question,
          agentsUsed: ["crop", "weather"],
          sessionId: "demo-session",
        },
      });
    }, 1000);
  });
}

// ------------------ STYLES ------------------
const AGENT_COLORS = {
  crop: "green",
  weather: "blue",
  soil: "orange",
  disease: "red",
  market: "purple",
  planner: "gray",
};

// ------------------ MESSAGE COMPONENT ------------------
function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "75%",
          margin: "5px",
        }}
      >
        {!isUser && msg.agents?.length > 0 && (
          <div style={{ display: "flex", gap: "5px", marginBottom: "4px" }}>
            {msg.agents.map((a) => (
              <span
                key={a}
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  background: AGENT_COLORS[a] || "#ddd",
                  color: "white",
                }}
              >
                {a}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            padding: "10px",
            borderRadius: "12px",
            background: isUser ? "#1A3A2A" : "#f1f1f1",
            color: isUser ? "#B8D4C0" : "#000",
            fontSize: "14px",
          }}
        >
          {msg.content}
        </div>

        <div style={{ fontSize: "10px", marginTop: "3px", color: "#888" }}>
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

// ------------------ MAIN CHAT ------------------
export function ChatInterface({ location = "Nashik,IN" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(text) {
    const q = (text ?? input).trim();
    if (!q || loading) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: q,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMock({ question: q, location });

      if (res.success) {
        const aiMsg = {
          id: Date.now() + 1,
          role: "assistant",
          content: res.data.answer,
          agents: res.data.agentsUsed,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "Error: something went wrong",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", border: "1px solid #ddd" }}>
      {/* CHAT AREA */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}

        {loading && (
          <div style={{ fontSize: "12px", color: "#666" }}>Typing...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Ask something..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={() => handleSubmit()}
          style={{
            marginLeft: "10px",
            padding: "10px 15px",
            borderRadius: "20px",
            background: "#2A6B43",
            color: "white",
            border: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}