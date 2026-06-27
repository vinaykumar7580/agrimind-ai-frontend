"use client";

import {
  Microscope,
  AlertTriangle,
  CheckCircle,
  Bug,
  Droplets,
} from "lucide-react";

const findings = [
  {
    icon: AlertTriangle,
    label: "Early Blight Detected",
    desc: "Alternaria solani — 73% confidence",
    color: "#E8A020",
  },
  {
    icon: CheckCircle,
    label: "Plant Structure Healthy",
    desc: "No stunting or wilting observed",
    color: "#52C455",
  },
  {
    icon: Bug,
    label: "Aphid Risk — Medium",
    desc: "Environmental conditions favour infestation",
    color: "#E8A020",
  },
  {
    icon: Droplets,
    label: "Mild Water Stress",
    desc: "Leaf curl pattern suggests slight dryness",
    color: "#6B9FD4",
  },
];

export default function CropAnalysisPanel({
  isAnalyzing,
  hasImage,
}) {
  if (!hasImage) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: "rgba(61,154,64,0.08)",
            border: "1px solid rgba(61,154,64,0.15)",
          }}
        >
          <Microscope size={28} style={{ color: "#3D5A3E" }} />
        </div>

        <p
          className="font-semibold mb-2"
          style={{ color: "#6B8F6B" }}
        >
          No image uploaded yet
        </p>

        <p className="text-sm" style={{ color: "#3D5A3E" }}>
          Upload a crop photo to see AI diagnosis
        </p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="shimmer rounded-xl h-16"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Crop Details */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-xs font-semibold"
            style={{ color: "#6B8F6B" }}
          >
            CROP IDENTIFIED
          </p>

          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(82,196,85,0.1)",
              color: "#52C455",
              border: "1px solid rgba(82,196,85,0.2)",
            }}
          >
            94% confidence
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-xl font-bold font-display"
              style={{ color: "#F0EBE0" }}
            >
              Solanum lycopersicum
            </p>

            <p
              className="text-sm"
              style={{ color: "#6B8F6B" }}
            >
              Tomato · Growth stage: Flowering (BBCH 60–69)
            </p>
          </div>

          <div className="text-3xl">🍅</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Health Score",
            value: "68",
            color: "#E8A020",
          },
          {
            label: "Disease Risk",
            value: "Medium",
            color: "#E8A020",
          },
          {
            label: "Yield Impact",
            value: "-15%",
            color: "#E84040",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="card p-3 text-center"
          >
            <p
              className="text-xs mb-1"
              style={{ color: "#6B8F6B" }}
            >
              {label}
            </p>

            <p
              className="text-lg font-bold"
              style={{ color }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* AI Findings */}
      <div>
        <p
          className="text-xs font-semibold mb-3"
          style={{ color: "#6B8F6B" }}
        >
          AI FINDINGS
        </p>

        <div className="space-y-2">
          {findings.map(({ icon: Icon, label, desc, color }) => (
            <div
              key={label}
              className="card p-3 flex items-start gap-3"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${color}18`,
                  border: `1px solid ${color}35`,
                }}
              >
                <Icon size={15} style={{ color }} />
              </div>

              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#F0EBE0" }}
                >
                  {label}
                </p>

                <p
                  className="text-xs"
                  style={{ color: "#6B8F6B" }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Plan */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(61,154,64,0.08)",
          border: "1px solid rgba(61,154,64,0.2)",
        }}
      >
        <p
          className="text-xs font-semibold mb-3"
          style={{ color: "#52C455" }}
        >
          TREATMENT PLAN
        </p>

        <div className="space-y-2.5">
          {[
            {
              step: "Immediate",
              action:
                "Spray Mancozeb 75 WP @ 2g/litre. Remove infected leaves and burn.",
              urgent: true,
            },
            {
              step: "In 3 days",
              action:
                "Apply Imidacloprid 17.8 SL for aphid prevention @ 0.3ml/litre.",
              urgent: false,
            },
            {
              step: "In 10 days",
              action:
                "Follow-up spray with Copper Oxychloride 50 WP @ 3g/litre.",
              urgent: false,
            },
          ].map(({ step, action, urgent }) => (
            <div
              key={step}
              className="flex items-start gap-3"
            >
              <span
                className="text-xs px-2 py-1 rounded-lg flex-shrink-0 font-medium"
                style={{
                  background: urgent
                    ? "rgba(232,64,64,0.15)"
                    : "rgba(61,154,64,0.12)",
                  color: urgent ? "#E84040" : "#52C455",
                }}
              >
                {step}
              </span>

              <p
                className="text-xs"
                style={{
                  color: "#8FAF8F",
                  lineHeight: "1.6",
                }}
              >
                {action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}