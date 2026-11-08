"use client";

import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  IndianRupee,
  BarChart3,
  RefreshCw,
} from "lucide-react";

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const trendColor = {
  up: "#52C455",
  down: "#E84040",
  flat: "#6B8F6B",
};

const formatRupee = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function SampleTag() {
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded-full"
      style={{
        background: "rgba(232,160,32,0.12)",
        color: "#E8A020",
      }}
    >
      Sample
    </span>
  );
}

function ForecastSection({ forecast, error }) {
  const rows = Array.isArray(forecast) ? forecast : [];

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={14} style={{ color: "#52C455" }} />
        <p className="text-sm font-semibold" style={{ color: "#F0EBE0" }}>
          AI Price Forecast — Next 30 Days
        </p>
      </div>

      {error ? (
        <p className="text-xs" style={{ color: "#6B8F6B" }}>
          The AI forecast is unavailable right now. Please try again later.
        </p>
      ) : !forecast ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer rounded-lg h-10" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="text-xs" style={{ color: "#6B8F6B" }}>
          No forecast available.
        </p>
      ) : (
        <div className="space-y-2">
          {rows.map(
            ({ crop, direction, forecast_low, forecast_high, confidence, reason }) => {
              const Icon = trendIcon[direction] || Minus;
              const color = trendColor[direction] || "#6B8F6B";

              return (
                <div
                  key={crop}
                  className="flex items-center justify-between py-2"
                  style={{
                    borderBottom: "1px solid rgba(61,154,64,0.08)",
                  }}
                >
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#F0EBE0" }}
                    >
                      {crop}
                    </span>

                    {reason && (
                      <p className="text-xs" style={{ color: "#6B8F6B" }}>
                        {reason}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Icon size={12} style={{ color }} />

                      <span className="text-xs font-medium" style={{ color }}>
                        {formatRupee(forecast_low)}–
                        {Number(forecast_high).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {typeof confidence === "number" && (
                      <p className="text-xs" style={{ color: "#6B8F6B" }}>
                        {confidence}% confidence
                      </p>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default function MarketPanel({ prices, error, forecast, forecastError }) {
  if (!prices && error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="font-semibold mb-2" style={{ color: "#6B8F6B" }}>
          Market prices unavailable
        </p>
        <p className="text-sm" style={{ color: "#3D5A3E" }}>
          We could not load mandi prices. Please try again later.
        </p>
      </div>
    );
  }

  if (!prices) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="shimmer rounded-xl h-14" />
        ))}
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <p className="text-sm text-center py-16" style={{ color: "#6B8F6B" }}>
        No market prices available.
      </p>
    );
  }

  // Change needs a previous price; on the first day of live data there is none.
  const withHistory = prices.filter((p) => p.prev != null);
  const best = withHistory.length
    ? withHistory.reduce((a, b) => (b.change > a.change ? b : a))
    : null;
  const average = Math.round(
    prices.reduce((sum, p) => sum + p.price, 0) / prices.length
  );
  const withMsp = prices.filter((p) => p.msp);
  const aboveMsp = withMsp.filter((p) => p.price >= p.msp);

  const mockCount = prices.filter((p) => p.is_mock).length;
  const liveDates = prices.filter((p) => p.date).map((p) => p.date).sort();
  const latestDate = liveDates[liveDates.length - 1];

  return (
    <div className="space-y-4">
      {mockCount > 0 && (
        <div
          className="rounded-xl p-3 flex items-center gap-2"
          style={{
            background: "rgba(232,160,32,0.08)",
            border: "1px solid rgba(232,160,32,0.25)",
          }}
        >
          <AlertTriangle size={14} style={{ color: "#E8A020" }} />
          <p className="text-xs" style={{ color: "#E8A020" }}>
            {mockCount === prices.length
              ? "Sample prices — live mandi data is still loading or unavailable. Reopen this tab in a minute."
              : `${mockCount} of ${prices.length} crops show sample prices (marked Sample). Do not use those for selling decisions.`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Best Performer",
            value: best ? best.name : "—",
            sub: best
              ? `${best.change > 0 ? "+" : ""}${best.change}%`
              : "needs price history",
            color: best ? trendColor[best.trend] || "#F0EBE0" : "#6B8F6B",
          },
          {
            label: "Market Avg",
            value: formatRupee(average),
            sub: "per quintal",
            color: "#F0EBE0",
          },
          {
            label: "Above MSP",
            value: `${aboveMsp.length} crops`,
            sub: `of ${withMsp.length} with MSP`,
            color: "#52C455",
          },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="card p-3 text-center">
            <p className="text-xs mb-1" style={{ color: "#6B8F6B" }}>
              {label}
            </p>

            <p className="text-sm font-bold" style={{ color }}>
              {value}
            </p>

            <p className="text-xs mt-0.5" style={{ color: "#6B8F6B" }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color: "#6B8F6B" }}>
          MANDI PRICES
        </p>

        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B8F6B" }}>
          <RefreshCw size={11} />
          {latestDate ? `Prices for ${formatDate(latestDate)}` : "Sample prices"}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div
          className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold"
          style={{
            color: "#6B8F6B",
            borderBottom: "1px solid rgba(61,154,64,0.1)",
          }}
        >
          <span className="col-span-4">Crop</span>
          <span className="col-span-3 text-right">Price/qtl</span>
          <span className="col-span-2 text-right">Change</span>
          <span className="col-span-3 text-right">vs MSP</span>
        </div>

        {prices.map((crop, i) => {
          const TrendIcon = trendIcon[crop.trend] || Minus;
          const color = trendColor[crop.trend] || "#6B8F6B";

          return (
            <div
              key={crop.name}
              className="grid grid-cols-12 gap-2 px-4 py-3 market-row"
              style={{
                borderBottom:
                  i < prices.length - 1
                    ? "1px solid rgba(61,154,64,0.07)"
                    : "none",
              }}
            >
              <div className="col-span-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-medium" style={{ color: "#F0EBE0" }}>
                    {crop.name}
                  </p>
                  {crop.is_mock && <SampleTag />}
                </div>

                <p className="text-xs" style={{ color: "#6B8F6B" }}>
                  {crop.variety}
                </p>
              </div>

              <div className="col-span-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <IndianRupee size={11} style={{ color: "#8FAF8F" }} />

                  <span className="text-sm font-semibold" style={{ color: "#F0EBE0" }}>
                    {crop.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-xs" style={{ color: "#6B8F6B" }}>
                  {crop.market}
                </p>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-1">
                <TrendIcon size={12} style={{ color }} />

                <span className="text-sm font-medium" style={{ color }}>
                  {crop.change === 0
                    ? "—"
                    : `${crop.change > 0 ? "+" : ""}${crop.change}%`}
                </span>
              </div>

              <div className="col-span-3 text-right">
                {crop.msp_diff != null ? (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        crop.msp_diff >= 0
                          ? "rgba(82,196,85,0.1)"
                          : "rgba(232,64,64,0.1)",
                      color: crop.msp_diff >= 0 ? "#52C455" : "#E84040",
                    }}
                  >
                    {crop.msp_diff >= 0 ? "+" : ""}
                    {crop.msp_diff}%
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: "#6B8F6B" }}>
                    No MSP
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ForecastSection forecast={forecast} error={forecastError} />
    </div>
  );
}
