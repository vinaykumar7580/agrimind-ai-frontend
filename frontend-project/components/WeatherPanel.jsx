"use client";

import {
  AlertTriangle,
  Cloud,
  CloudOff,
  Droplets,
  Wind,
  Sun,
  Thermometer,
  Eye,
  CloudRain,
  Umbrella,
} from "lucide-react";

const getConditionIcon = (condition = "") => {
  const text = condition.toLowerCase();

  if (/rain|drizzle|thunder/.test(text)) return CloudRain;
  if (/clear|sun/.test(text)) return Sun;
  return Cloud;
};

const getDayLabel = (day) =>
  /^\d{4}-\d{2}-\d{2}$/.test(day)
    ? new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "short",
      })
    : day;

// The backend returns 3-hourly slots, so one date can appear several times.
// Merge them into one entry per day, keeping the peak temp and rain chance.
const groupByDay = (forecast = []) => {
  const days = new Map();

  forecast.forEach((slot) => {
    const existing = days.get(slot.day);

    if (!existing) {
      days.set(slot.day, { ...slot, label: getDayLabel(slot.day) });
      return;
    }

    existing.temp = Math.max(existing.temp, slot.temp);

    if (slot.rain > existing.rain) {
      existing.rain = slot.rain;
      existing.condition = slot.condition;
    }
  });

  return [...days.values()];
};

export default function WeatherPanel({ data, error }) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: "rgba(61,154,64,0.08)",
            border: "1px solid rgba(61,154,64,0.15)",
          }}
        >
          <CloudOff size={28} style={{ color: "#3D5A3E" }} />
        </div>
        <p className="font-semibold mb-2" style={{ color: "#6B8F6B" }}>
          Weather unavailable
        </p>
        <p className="text-sm" style={{ color: "#3D5A3E" }}>
          We could not load the forecast. Please try again later.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="shimmer rounded-xl h-20" />
        ))}
      </div>
    );
  }

  const { current, forecast, advisory, gdd_today, is_mock, location } = data;
  const days = groupByDay(forecast);
  const CurrentIcon = getConditionIcon(current.condition);

  return (
    <div className="space-y-4">
      {is_mock && (
        <div
          className="rounded-xl p-3 flex items-center gap-2"
          style={{
            background: "rgba(232,160,32,0.08)",
            border: "1px solid rgba(232,160,32,0.25)",
          }}
        >
          <AlertTriangle size={14} style={{ color: "#E8A020" }} />
          <p className="text-xs" style={{ color: "#E8A020" }}>
            Sample data — live weather is unavailable. Do not use this for farm
            decisions.
          </p>
        </div>
      )}

      <div className="weather-card rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs mb-1" style={{ color: "#6B8F6B" }}>
              Current conditions{location ? ` · ${location}` : ""}
            </p>

            <div className="flex items-end gap-2">
              <span
                className="font-display text-5xl font-bold"
                style={{ color: "#F0EBE0" }}
              >
                {current.temp_c}°
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
              {current.condition} — feels like {current.feels_like}°C
            </p>
          </div>

          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(61,154,64,0.15)" }}
          >
            <CurrentIcon size={32} style={{ color: "#52C455" }} />
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
              value: `${current.humidity}%`,
            },
            {
              icon: Wind,
              label: "Wind",
              value: `${current.wind_kmh} km/h`,
            },
            {
              icon: Eye,
              label: "Visibility",
              value: `${current.visibility_km} km`,
            },
            {
              icon: Umbrella,
              label: "Rain",
              value:
                current.rain_chance != null
                  ? `${current.rain_chance}%`
                  : "—",
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

      {advisory && (
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
            {advisory}
          </p>
        </div>
      )}

      {days.length > 0 && (
        <div>
          <p
            className="text-xs font-semibold mb-3"
            style={{ color: "#6B8F6B" }}
          >
            {days.length}-DAY FORECAST
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map(({ day, label, condition, temp, rain }, i) => {
              const Icon = getConditionIcon(condition);

              return (
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
                    {label}
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
              );
            })}
          </div>
        </div>
      )}

      {gdd_today != null && (
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

          <div className="flex items-end gap-1">
            <span
              className="text-2xl font-bold font-display"
              style={{ color: "#52C455" }}
            >
              {gdd_today}
            </span>

            <span
              className="text-xs mb-1"
              style={{ color: "#6B8F6B" }}
            >
              today (base 10°C)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
