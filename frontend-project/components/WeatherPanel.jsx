"use client";

import {
  Cloud,
  Droplets,
  Wind,
  Sun,
  Thermometer,
  Eye,
  CloudRain,
  Umbrella,
} from "lucide-react";

const weekDays = [
  { day: "Mon", icon: Sun, temp: 32, rain: 5 },
  { day: "Tue", icon: Cloud, temp: 28, rain: 30 },
  { day: "Wed", icon: CloudRain, temp: 24, rain: 75 },
  { day: "Thu", icon: CloudRain, temp: 22, rain: 85 },
  { day: "Fri", icon: Cloud, temp: 27, rain: 20 },
  { day: "Sat", icon: Sun, temp: 31, rain: 5 },
  { day: "Sun", icon: Sun, temp: 33, rain: 0 },
];

export default function WeatherPanel() {
  return (
    <div className="space-y-4">
      <div className="weather-card rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs mb-1" style={{ color: "#6B8F6B" }}>
              Current conditions · Pune, MH
            </p>

            <div className="flex items-end gap-2">
              <span
                className="font-display text-5xl font-bold"
                style={{ color: "#F0EBE0" }}
              >
                31°
              </span>

              <span
                className="text-lg mb-2"
                style={{ color: "#6B8F6B" }}
              >
                C
              </span>
            </div>

            <p
              className="text-sm mt-1"
              style={{ color: "#8FAF8F" }}
            >
              Partly cloudy — feels like 34°C
            </p>
          </div>

          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(61,154,64,0.15)" }}
          >
            <Cloud size={32} style={{ color: "#52C455" }} />
          </div>
        </div>

        <div
          className="grid grid-cols-4 gap-2 pt-4"
          style={{ borderTop: "1px solid rgba(61,154,64,0.15)" }}
        >
          {[
            {
              icon: Droplets,
              label: "Humidity",
              value: "72%",
            },
            {
              icon: Wind,
              label: "Wind",
              value: "14 km/h",
            },
            {
              icon: Eye,
              label: "Visibility",
              value: "8 km",
            },
            {
              icon: Umbrella,
              label: "Rain",
              value: "20%",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <Icon
                size={16}
                className="mx-auto mb-1"
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
      </div>

      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(61,154,64,0.08)",
          border: "1px solid rgba(61,154,64,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full pulse-dot"
            style={{ background: "#52C455" }}
          />

          <p
            className="text-xs font-semibold"
            style={{ color: "#52C455" }}
          >
            AI Farm Advisory
          </p>
        </div>

        <p
          className="text-sm"
          style={{ color: "#8FAF8F", lineHeight: "1.6" }}
        >
          Rain expected Wednesday–Thursday. Ideal window to apply fertilizer is{" "}
          <span style={{ color: "#F0EBE0" }}>
            tomorrow morning
          </span>
          . Avoid irrigation for next 72 hours.
        </p>
      </div>

      <div>
        <p
          className="text-xs font-semibold mb-3"
          style={{ color: "#6B8F6B" }}
        >
          7-DAY FORECAST
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {weekDays.map(({ day, icon: Icon, temp, rain }, i) => (
            <div
              key={day}
              className={`flex-shrink-0 flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all ${
                i === 0 ? "tab-active" : ""
              }`}
              style={{
                border: `1px solid ${
                  i === 0
                    ? "rgba(61,154,64,0.4)"
                    : "rgba(61,154,64,0.1)"
                }`,
                minWidth: "60px",
                background:
                  i === 0
                    ? "rgba(61,154,64,0.12)"
                    : "transparent",
              }}
            >
              <p
                className="text-xs"
                style={{
                  color: i === 0 ? "#52C455" : "#6B8F6B",
                }}
              >
                {day}
              </p>

              <Icon
                size={18}
                style={{
                  color: rain > 50 ? "#6B9FD4" : "#52C455",
                }}
              />

              <p
                className="text-sm font-semibold"
                style={{ color: "#F0EBE0" }}
              >
                {temp}°
              </p>

              {rain > 0 && (
                <div className="flex items-center gap-0.5">
                  <Droplets
                    size={9}
                    style={{ color: "#6B9FD4" }}
                  />

                  <span
                    className="text-xs"
                    style={{ color: "#6B9FD4" }}
                  >
                    {rain}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-xs font-semibold"
            style={{ color: "#F0EBE0" }}
          >
            Growing Degree Days (GDD)
          </p>

          <Thermometer
            size={14}
            style={{ color: "#52C455" }}
          />
        </div>

        <div className="flex items-end gap-1 mb-2">
          <span
            className="text-2xl font-bold font-display"
            style={{ color: "#52C455" }}
          >
            847
          </span>

          <span
            className="text-xs mb-1"
            style={{ color: "#6B8F6B" }}
          >
            / 1200 target
          </span>
        </div>

        <div
          className="w-full rounded-full h-2 mb-2"
          style={{
            background: "rgba(61,154,64,0.1)",
          }}
        >
          <div
            className="progress-bar h-2"
            style={{ width: "70.6%" }}
          />
        </div>

        <p
          className="text-xs"
          style={{ color: "#6B8F6B" }}
        >
          Estimated harvest in{" "}
          <span style={{ color: "#E8A020" }}>
            ~18 days
          </span>{" "}
          at current pace
        </p>
      </div>
    </div>
  );
}