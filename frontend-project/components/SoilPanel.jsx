"use client";

import {
  Layers,
  FlaskConical,
  Zap,
  AlertTriangle,
  CheckCircle,
  Sprout,
} from "lucide-react";

const NUTRIENT_LABELS = [
  { key: "nitrogen", label: "Nitrogen (N)" },
  { key: "phosphorus", label: "Phosphorus (P)" },
  { key: "potassium", label: "Potassium (K)" },
  { key: "organic_matter", label: "Organic Matter" },
  { key: "moisture", label: "Moisture" },
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

const statusLabel = {
  good: "Optimal",
  low: "Low",
  high: "High",
};

const formatValue = (value, unit) => {
  if (!unit) return value;
  return unit === "%" ? `${value}%` : `${value} ${unit}`;
};

export default function SoilPanel({ isAnalyzing, analysis }) {
  if (isAnalyzing) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="shimmer rounded-xl h-16" />
        ))}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: "rgba(61,154,64,0.08)",
            border: "1px solid rgba(61,154,64,0.15)",
          }}
        >
          <Layers size={28} style={{ color: "#3D5A3E" }} />
        </div>
        <p className="font-semibold mb-2" style={{ color: "#6B8F6B" }}>
          No soil analysis yet
        </p>
        <p className="text-sm" style={{ color: "#3D5A3E" }}>
          Upload a soil photo to see AI analysis
        </p>
      </div>
    );
  }

  const {
    soil_type,
    texture,
    overall_health,
    ph,
    nutrients = {},
    recommendations = [],
    best_crops = [],
    ai_summary,
  } = analysis;

  const { ec } = nutrients;

  const metrics = [
    // The API sends no pct for pH, so place it on the 0-14 scale.
    ph && {
      label: "pH Level",
      ...ph,
      pct: ph.pct ?? (ph.value / 14) * 100,
    },
    ...NUTRIENT_LABELS.filter(({ key }) => nutrients[key]).map(
      ({ key, label }) => ({ label, ...nutrients[key] })
    ),
  ].filter(Boolean);

  const hasScore = overall_health != null;
  const healthColor =
    overall_health >= 75
      ? "#52C455"
      : overall_health >= 50
      ? "#E8A020"
      : "#E84040";
  const HealthIcon = overall_health >= 75 ? CheckCircle : AlertTriangle;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Soil Type", value: soil_type || "—", icon: Layers },
          { label: "Texture", value: texture || "—", icon: FlaskConical },
          {
            label: "EC Level",
            value: ec ? formatValue(ec.value, ec.unit) : "—",
            icon: Zap,
          },
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
        {hasScore && (
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
                  style={{ color: healthColor }}
                >
                  {overall_health}
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
                  stroke={healthColor}
                  strokeWidth="6"
                  strokeDasharray={`${overall_health * 1.508} 150.8`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <HealthIcon
                  size={16}
                  style={{ color: healthColor }}
                />
              </div>
            </div>
          </div>
        )}

        {ai_summary && (
          <p
            className="text-sm"
            style={{ color: "#8FAF8F" }}
          >
            {ai_summary}
          </p>
        )}
      </div>

      {metrics.length > 0 && (
        <div className="space-y-3">
          <p
            className="text-xs font-semibold"
            style={{ color: "#6B8F6B" }}
          >
            NUTRIENT ANALYSIS
          </p>

          {metrics.map(({ label, value, unit, ideal, status, pct }) => {
            const color = statusColor[status] || "#8FAF8F";

            return (
              <div key={label} className="card p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {status !== "good" && (
                      <AlertTriangle
                        size={12}
                        style={{ color }}
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
                      {formatValue(value, unit)}
                    </span>

                    {status && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            statusBg[status] || "rgba(143,175,143,0.1)",
                          color,
                        }}
                      >
                        {statusLabel[status] || status}
                      </span>
                    )}
                  </div>
                </div>

                {pct != null && (
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
                        background: color,
                      }}
                    />
                  </div>
                )}

                {ideal && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "#6B8F6B" }}
                  >
                    Ideal range: {ideal}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {best_crops.length > 0 && (
        <div>
          <p
            className="text-xs font-semibold mb-3"
            style={{ color: "#6B8F6B" }}
          >
            BEST CROPS FOR THIS SOIL
          </p>

          <div className="flex flex-wrap gap-2">
            {best_crops.map((crop) => (
              <span
                key={crop}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(61,154,64,0.1)",
                  color: "#52C455",
                  border: "1px solid rgba(61,154,64,0.2)",
                }}
              >
                <Sprout size={11} />
                {crop}
              </span>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
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
            {recommendations.map((rec, i) => (
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
      )}
    </div>
  );
}
