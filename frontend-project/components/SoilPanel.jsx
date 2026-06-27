"use client";

import {
  Layers,
  FlaskConical,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const soilMetrics = [
  {
    label: "pH Level",
    value: 6.8,
    unit: "",
    ideal: "6.0–7.0",
    status: "good",
    pct: 68,
  },
  {
    label: "Nitrogen (N)",
    value: 42,
    unit: "kg/ha",
    ideal: "40–60",
    status: "good",
    pct: 55,
  },
  {
    label: "Phosphorus (P)",
    value: 18,
    unit: "kg/ha",
    ideal: "25–40",
    status: "low",
    pct: 35,
  },
  {
    label: "Potassium (K)",
    value: 156,
    unit: "kg/ha",
    ideal: "120–180",
    status: "good",
    pct: 72,
  },
  {
    label: "Organic Matter",
    value: 2.1,
    unit: "%",
    ideal: "3–5%",
    status: "low",
    pct: 28,
  },
  {
    label: "Moisture",
    value: 38,
    unit: "%",
    ideal: "35–45%",
    status: "good",
    pct: 62,
  },
];

const statusColor = {
  good: "#52C455",
  low: "#E8A020",
  high: "#E84040",
};

const statusBg = {
  good: "rgba(82,196,85,0.1)",
  low: "rgba(232,160,32,0.1)",
  high: "rgba(232,64,64,0.1)",
};

export default function SoilPanel() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Soil Type", value: "Alluvial", icon: Layers },
          { label: "Texture", value: "Loamy", icon: FlaskConical },
          { label: "EC Level", value: "0.42 dS/m", icon: Zap },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-3 text-center">
            <Icon
              size={16}
              className="mx-auto mb-2"
              style={{ color: "#52C455" }}
            />

            <p
              className="text-xs mb-0.5"
              style={{ color: "#6B8F6B" }}
            >
              {label}
            </p>

            <p
              className="text-sm font-semibold"
              style={{ color: "#F0EBE0" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p
              className="text-xs mb-1"
              style={{ color: "#6B8F6B" }}
            >
              Overall Soil Health
            </p>

            <div className="flex items-end gap-2">
              <span
                className="font-display text-4xl font-bold"
                style={{ color: "#52C455" }}
              >
                74
              </span>

              <span
                className="text-lg mb-1"
                style={{ color: "#6B8F6B" }}
              >
                /100
              </span>
            </div>
          </div>

          <div className="relative w-16 h-16">
            <svg
              viewBox="0 0 60 60"
              className="transform -rotate-90"
            >
              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="rgba(61,154,64,0.15)"
                strokeWidth="6"
              />

              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="#52C455"
                strokeWidth="6"
                strokeDasharray={`${74 * 1.508} 150.8`}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle
                size={16}
                style={{ color: "#52C455" }}
              />
            </div>
          </div>
        </div>

        <p
          className="text-sm"
          style={{ color: "#8FAF8F" }}
        >
          Good soil health overall. Phosphorus and organic matter
          need attention for optimal yields.
        </p>
      </div>

      <div className="space-y-3">
        <p
          className="text-xs font-semibold"
          style={{ color: "#6B8F6B" }}
        >
          NUTRIENT ANALYSIS
        </p>

        {soilMetrics.map(
          ({ label, value, unit, ideal, status, pct }) => (
            <div key={label} className="card p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {status !== "good" && (
                    <AlertTriangle
                      size={12}
                      style={{
                        color: statusColor[status],
                      }}
                    />
                  )}

                  <span
                    className="text-sm"
                    style={{ color: "#F0EBE0" }}
                  >
                    {label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#F0EBE0" }}
                  >
                    {value}
                    {unit}
                  </span>

                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: statusBg[status],
                      color: statusColor[status],
                    }}
                  >
                    {status === "good"
                      ? "Optimal"
                      : status === "low"
                      ? "Low"
                      : "High"}
                  </span>
                </div>
              </div>

              <div
                className="w-full rounded-full h-1.5"
                style={{
                  background:
                    "rgba(61,154,64,0.1)",
                }}
              >
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: statusColor[status],
                  }}
                />
              </div>

              <p
                className="text-xs mt-1"
                style={{ color: "#6B8F6B" }}
              >
                Ideal range: {ideal}
              </p>
            </div>
          )
        )}
      </div>

      <div
        className="rounded-xl p-4"
        style={{
          background:
            "rgba(200,134,10,0.08)",
          border:
            "1px solid rgba(200,134,10,0.2)",
        }}
      >
        <p
          className="text-xs font-semibold mb-3"
          style={{ color: "#E8A020" }}
        >
          Recommended Actions
        </p>

        <div className="space-y-2">
          {[
            "Apply DAP fertilizer (18:46:0) @ 100 kg/ha to boost phosphorus",
            "Add farmyard manure or compost to improve organic matter content",
            "Test again after 30 days to track improvement",
          ].map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-2"
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                style={{
                  background:
                    "rgba(200,134,10,0.2)",
                  color: "#E8A020",
                }}
              >
                {i + 1}
              </span>

              <p
                className="text-xs"
                style={{
                  color: "#8FAF8F",
                  lineHeight: "1.5",
                }}
              >
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}