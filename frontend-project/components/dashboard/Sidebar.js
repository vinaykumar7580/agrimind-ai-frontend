"use client";

import { useState } from "react";

// ---------------- MOCK PATH (replaces usePathname) ----------------
function getPath() {
  return window.location.pathname;
}

// ---------------- NAV DATA ----------------
const navItems = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/chat", label: "AI Chat" },
      { href: "/documents", label: "Knowledge Base" },
    ],
  },
  {
    label: "Analysis",
    items: [
      { href: "/weather", label: "Weather" },
      { href: "/soil", label: "Soil Analysis" },
      { href: "/disease", label: "Disease Detection" },
      { href: "/market", label: "Market Intelligence" },
    ],
  },
  {
    label: "Account",
    items: [{ href: "/settings", label: "Settings" }],
  },
];

export function Sidebar() {
  const [path, setPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/dashboard"
  );

  function navigate(href) {
    window.history.pushState({}, "", href);
    setPath(href);
  }

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#0D1F16",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          padding: "18px",
          borderBottom: "1px solid #1e3829",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "#2A6B43",
              borderRadius: "6px",
            }}
          />
          <div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>
              AgriMind
            </p>
            <p style={{ margin: 0, fontSize: "10px", color: "#4A7C5E" }}>
              AI Agriculture Platform
            </p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{ flex: 1, padding: "10px" }}>
        {navItems.map((group) => (
          <div key={group.label} style={{ marginBottom: "15px" }}>
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                color: "#3A6650",
                marginBottom: "6px",
              }}
            >
              {group.label}
            </p>

            {group.items.map((item) => {
              const active = path === item.href;

              return (
                <div
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    marginBottom: "4px",
                    background: active ? "#1A3A2A" : "transparent",
                    color: active ? "#5EBF88" : "#7AAD8A",
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* USER */}
      <div
        style={{
          borderTop: "1px solid #1e3829",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#1A3228",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#2A6B43",
            }}
          />
          <div>
            <p style={{ margin: 0, fontSize: "12px", color: "#9CC0A8" }}>
              Rajesh Joshi
            </p>
            <p style={{ margin: 0, fontSize: "10px", color: "#4A7C5E" }}>
              Nashik, Maharashtra
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}