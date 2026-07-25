"use client";

import {
  Microscope,
  AlertTriangle,
  CheckCircle,
  Bug,
  Droplets,
  Info,
} from "lucide-react";

const COLOR_MAP = {
  warning: "#E8A020",
  good: "#52C455",
  danger: "#E84040",
  info: "#6B9FD4",
};

const ICON_MAP = {
  warning: AlertTriangle,
  good: CheckCircle,
  danger: Bug,
  info: Droplets,
};

const SEVERITY_COLOR = {
  none: "#52C455",
  low: "#8FAF3F",
  medium: "#E8A020",
  high: "#E84040",
};

export default function CropAnalysisPanel({ isAnalyzing, hasImage, analysis }) {
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
        <p className="font-semibold mb-2" style={{ color: "#6B8F6B" }}>
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
          <div key={i} className="shimmer rounded-xl h-16" />
        ))}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm" style={{ color: "#3D5A3E" }}>
          No analysis data available.
        </p>
      </div>
    );
  }

  const {
    crop_name,
    crop_scientific,
    growth_stage,
    confidence,
    health_score,
    disease,
    severity = "none",
    yield_impact_pct,
    findings = [],
    treatment = [],
    prevention = [],
    ai_summary,
  } = analysis;

  const severityColor = SEVERITY_COLOR[severity] || "#8FAF8F";
  const healthColor =
    health_score >= 75 ? "#52C455" : health_score >= 50 ? "#E8A020" : "#E84040";

  return (
    <div className="space-y-4">
      {/* Crop Details */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold" style={{ color: "#6B8F6B" }}>
            CROP IDENTIFIED
          </p>
          {typeof confidence === "number" && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(82,196,85,0.1)",
                color: "#52C455",
                border: "1px solid rgba(82,196,85,0.2)",
              }}
            >
              {confidence}% confidence
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold font-display" style={{ color: "#F0EBE0" }}>
              {crop_scientific || crop_name}
            </p>
            <p className="text-sm" style={{ color: "#6B8F6B" }}>
              {crop_name}
              {growth_stage ? ` · ${growth_stage}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Health Score",
            value: health_score != null ? health_score : "—",
            color: healthColor,
          },
          {
            label: "Disease Risk",
            value: severity.charAt(0).toUpperCase() + severity.slice(1),
            color: severityColor,
          },
          {
            label: "Yield Impact",
            value:
              yield_impact_pct != null
                ? `${yield_impact_pct > 0 ? "+" : ""}${yield_impact_pct}%`
                : "—",
            color: yield_impact_pct < 0 ? "#E84040" : "#52C455",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-3 text-center">
            <p className="text-xs mb-1" style={{ color: "#6B8F6B" }}>
              {label}
            </p>
            <p className="text-lg font-bold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Disease name, if present */}
      {disease && (
        <div
          className="rounded-xl p-3 flex items-center gap-2"
          style={{
            background: "rgba(232,64,64,0.08)",
            border: "1px solid rgba(232,64,64,0.2)",
          }}
        >
          <AlertTriangle size={16} style={{ color: "#E84040" }} />
          <p className="text-sm font-medium" style={{ color: "#F0EBE0" }}>
            {disease}
          </p>
        </div>
      )}

      {/* AI Findings */}
      {findings.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: "#6B8F6B" }}>
            AI FINDINGS
          </p>
          <div className="space-y-2">
            {findings.map((finding, idx) => {
              const type = finding.color_hint || finding.type || "info";
              const color = COLOR_MAP[type] || "#6B9FD4";
              const Icon = ICON_MAP[type] || Info;
              return (
                <div key={idx} className="card p-3 flex items-start gap-3">
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
                    <p className="text-sm font-medium" style={{ color: "#F0EBE0" }}>
                      {finding.label}
                    </p>
                    <p className="text-xs" style={{ color: "#6B8F6B" }}>
                      {finding.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Treatment Plan */}
      {treatment.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(61,154,64,0.08)",
            border: "1px solid rgba(61,154,64,0.2)",
          }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: "#52C455" }}>
            TREATMENT PLAN
          </p>
          <div className="space-y-2.5">
            {treatment.map(({ step, action, urgent }, idx) => (
              <div key={idx} className="flex items-start gap-3">
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
                <p className="text-xs" style={{ color: "#8FAF8F", lineHeight: "1.6" }}>
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prevention Tips */}
      {prevention.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: "#6B8F6B" }}>
            PREVENTION TIPS
          </p>
          <ul className="space-y-2">
            {prevention.map((tip, idx) => (
              <li key={idx} className="card p-3 text-xs" style={{ color: "#8FAF8F" }}>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Summary */}
      {ai_summary && (
        <div className="card p-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "#6B8F6B" }}>
            AI SUMMARY
          </p>
          <p className="text-xs" style={{ color: "#8FAF8F", lineHeight: "1.6" }}>
            {ai_summary}
          </p>
        </div>
      )}
    </div>
  );
}