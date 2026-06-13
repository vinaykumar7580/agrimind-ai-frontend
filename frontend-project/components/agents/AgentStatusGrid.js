"use client";

const STATUS_COLORS = {
  active: "green",
  idle: "orange",
  processing: "blue",
  error: "red",
};

const STATUS_LABELS = {
  active: "Active",
  idle: "Idle",
  processing: "Processing…",
  error: "Error",
};

// 🔥 local dummy data (replaces store)
const agents = [
  { name: "agent_1", label: "Agent 1", status: "active" },
  { name: "agent_2", label: "Agent 2", status: "idle" },
  { name: "agent_3", label: "Agent 3", status: "processing" },
  { name: "agent_4", label: "Agent 4", status: "error" },
];

const activeAgents = ["agent_1", "agent_3"];

export function AgentStatusGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
      {agents.map((agent) => {
        const isHighlighted = activeAgents.includes(agent.name);

        return (
          <div
            key={agent.name}
            style={{
              border: isHighlighted ? "1px solid #22c55e" : "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              background: isHighlighted ? "#ecfdf5" : "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: STATUS_COLORS[agent.status],
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: "12px", fontWeight: "600" }}>
                {agent.label}
              </span>
            </div>

            <p style={{ fontSize: "10px", color: "#666", marginLeft: "14px" }}>
              {STATUS_LABELS[agent.status]}
            </p>
          </div>
        );
      })}
    </div>
  );
}