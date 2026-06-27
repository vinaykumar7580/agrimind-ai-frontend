"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  IndianRupee,
  BarChart3,
  RefreshCw,
} from "lucide-react";

const crops = [
  {
    name: "Wheat",
    variety: "HD-2967",
    price: 2285,
    change: 2.4,
    trend: "up",
    msp: 2275,
    market: "Pune APMC",
  },
  {
    name: "Rice",
    variety: "Basmati 1121",
    price: 4850,
    change: -1.2,
    trend: "down",
    msp: 2300,
    market: "Delhi Mandi",
  },
  {
    name: "Soybean",
    variety: "JS 9560",
    price: 4620,
    change: 3.8,
    trend: "up",
    msp: 4600,
    market: "Indore APMC",
  },
  {
    name: "Cotton",
    variety: "Bt Cotton",
    price: 6780,
    change: 0,
    trend: "flat",
    msp: 7020,
    market: "Nagpur Mandi",
  },
  {
    name: "Sugarcane",
    variety: "Co-86032",
    price: 340,
    change: 1.1,
    trend: "up",
    msp: 315,
    market: "Kolhapur",
  },
  {
    name: "Onion",
    variety: "Nasik Red",
    price: 1820,
    change: -5.3,
    trend: "down",
    msp: null,
    market: "Lasalgaon",
  },
];

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

export default function MarketPanel() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Best Performer",
            value: "Soybean",
            sub: "+3.8%",
            color: "#52C455",
          },
          {
            label: "Market Avg",
            value: "₹3,449",
            sub: "per quintal",
            color: "#F0EBE0",
          },
          {
            label: "MSP Above",
            value: "4 crops",
            sub: "of 6 tracked",
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
          LIVE MANDI PRICES
        </p>

        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B8F6B" }}>
          <RefreshCw size={11} />
          Updated 12 min ago
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

        {crops.map((crop, i) => {
          const TrendIcon = trendIcon[crop.trend];
          const color = trendColor[crop.trend];

          const mspDiff = crop.msp
            ? (((crop.price - crop.msp) / crop.msp) * 100).toFixed(1)
            : null;

          return (
            <div
              key={crop.name}
              className="grid grid-cols-12 gap-2 px-4 py-3 market-row cursor-pointer"
              style={{
                borderBottom:
                  i < crops.length - 1
                    ? "1px solid rgba(61,154,64,0.07)"
                    : "none",
              }}
            >
              <div className="col-span-4">
                <p className="text-sm font-medium" style={{ color: "#F0EBE0" }}>
                  {crop.name}
                </p>

                <p className="text-xs" style={{ color: "#6B8F6B" }}>
                  {crop.variety}
                </p>
              </div>

              <div className="col-span-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <IndianRupee size={11} style={{ color: "#8FAF8F" }} />

                  <span className="text-sm font-semibold" style={{ color: "#F0EBE0" }}>
                    {crop.price.toLocaleString()}
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
                {mspDiff !== null ? (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        parseFloat(mspDiff) >= 0
                          ? "rgba(82,196,85,0.1)"
                          : "rgba(232,64,64,0.1)",
                      color:
                        parseFloat(mspDiff) >= 0
                          ? "#52C455"
                          : "#E84040",
                    }}
                  >
                    {parseFloat(mspDiff) >= 0 ? "+" : ""}
                    {mspDiff}%
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

      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={14} style={{ color: "#52C455" }} />
          <p className="text-sm font-semibold" style={{ color: "#F0EBE0" }}>
            AI Price Forecast — Next 30 Days
          </p>
        </div>

        <div className="space-y-2">
          {[
            {
              crop: "Wheat",
              direction: "up",
              forecast: "₹2,320–2,380",
              reason: "Export demand rising",
            },
            {
              crop: "Onion",
              direction: "up",
              forecast: "₹2,100–2,400",
              reason: "Seasonal scarcity expected",
            },
            {
              crop: "Rice",
              direction: "down",
              forecast: "₹4,600–4,750",
              reason: "New arrivals from Punjab",
            },
          ].map(({ crop, direction, forecast, reason }) => (
            <div
              key={crop}
              className="flex items-center justify-between py-2"
              style={{
                borderBottom: "1px solid rgba(61,154,64,0.08)",
              }}
            >
              <div>
                <span className="text-sm font-medium" style={{ color: "#F0EBE0" }}>
                  {crop}
                </span>

                <p className="text-xs" style={{ color: "#6B8F6B" }}>
                  {reason}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {direction === "up" ? (
                  <TrendingUp size={12} style={{ color: "#52C455" }} />
                ) : (
                  <TrendingDown size={12} style={{ color: "#E84040" }} />
                )}

                <span
                  className="text-xs font-medium"
                  style={{
                    color: direction === "up" ? "#52C455" : "#E84040",
                  }}
                >
                  {forecast}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}