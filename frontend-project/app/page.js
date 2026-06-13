
import {
  Sprout, Droplets, TrendingUp, FileText,
  Cloud, FlaskConical, Bug, Activity,
} from "lucide-react";
import { AgentStatusGrid } from "../components/agents/AgentStatusGrid"
import { ChatInterface } from "../components/chat/ChatInterface";

import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const STATS = [
  {
    label: "Soil Health Score",
    value: "78",
    unit: "/100",
    change: "+4 this week",
    up: true,
    icon: FlaskConical,
  },
  {
    label: "Rainfall (7 days)",
    value: "42",
    unit: "mm",
    change: "Above average",
    up: true,
    icon: Cloud,
  },
  {
    label: "Cotton Price",
    value: "₹67k",
    unit: "/q",
    change: "−2.3% today",
    up: false,
    icon: TrendingUp,
  },
  {
    label: "Documents Indexed",
    value: "14",
    unit: "",
    change: "3 PDFs + 11 guides",
    up: null,
    icon: FileText,
  },
];

const MARKET = [
  { crop: "Cotton", price: "₹67,200", unit: "per quintal", change: "▼ 2.3%", up: false },
  { crop: "Soybean", price: "₹44,800", unit: "per quintal", change: "▲ 1.1%", up: true },
  { crop: "Wheat", price: "₹22,150", unit: "per quintal", change: "▲ 0.4%", up: true },
  { crop: "Onion", price: "₹18,400", unit: "per quintal", change: "▼ 5.7%", up: false },
];

const WEATHER = [
  { day: "Today", icon: "🌧", temp: "31°C", hum: "82%" },
  { day: "Sun", icon: "☀️", temp: "34°C", hum: "68%" },
  { day: "Mon", icon: "🌦", temp: "29°C", hum: "88%" },
  { day: "Tue", icon: "☁️", temp: "30°C", hum: "74%" },
];

const SOIL = [
  { label: "Nitrogen", pct: 62, color: "#639922" },
  { label: "Phosphorus", pct: 45, color: "#EF9F27" },
  { label: "Potassium", pct: 78, color: "#639922" },
  { label: "pH", pct: 68, val: "6.8", color: "#1D9E75" },
];

export default function DashboardPage() {
  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "morning" : now.getHours() < 17 ? "afternoon" : "evening";

  return (

    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="bg-background border-b border-border px-5 h-13 flex items-center justify-between shrink-0 py-3">
        <div>
          <p className="text-sm font-medium">
            Good {greeting}, Rajesh 🌾
          </p>
          <p className="text-xs text-muted-foreground">
            {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · Kharif season
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
            <Activity className="w-3 h-3 mr-1" />
            5 Agents Active
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-3">
          {STATS.map(({ label, value, unit, change, up, icon: Icon }) => (
            <Card key={label} className="py-3">
              <CardContent className="px-4 pt-0 pb-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
                <p className="text-2xl font-medium leading-none">
                  {value}
                  <span className="text-sm text-muted-foreground font-normal">{unit}</span>
                </p>
                <p
                  className={`text-xs mt-1.5 ${up === true
                    ? "text-green-700 dark:text-green-400"
                    : up === false
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                    }`}
                >
                  {change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Chat */}
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#3B6D11]" />
                AI Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ChatInterface compact />
            </CardContent>
          </Card>

          {/* Agent Status */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#3B6D11]" />
                  Agent Status
                </CardTitle>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                  All Healthy
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 space-y-4">
              <AgentStatusGrid />
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  Disease Detection
                </p>
                <div className="border border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Bug className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">Drop leaf photo here</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">JPG, PNG · max 10MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Market */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#3B6D11]" />
                Market Prices
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="divide-y divide-border">
                {MARKET.map(({ crop, price, unit, change, up }) => (
                  <div key={crop} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{crop}</p>
                      <p className="text-[10px] text-muted-foreground">{unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{price}</p>
                      <p className={`text-xs ${up ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                        {change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather + Soil */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-[#3B6D11]" />
                  4-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-4 gap-2">
                  {WEATHER.map(({ day, icon, temp, hum }) => (
                    <div key={day} className="text-center">
                      <p className="text-[10px] text-muted-foreground mb-1">{day}</p>
                      <p className="text-lg mb-1">{icon}</p>
                      <p className="text-xs font-medium">{temp}</p>
                      <p className="text-[10px] text-muted-foreground">{hum}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#3B6D11]" />
                  Soil Nutrients
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2.5">
                {SOIL.map(({ label, pct, color, val }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                    <span className="text-xs text-foreground w-8 text-right shrink-0">
                      {val ?? `${pct}%`}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>

  );
}
