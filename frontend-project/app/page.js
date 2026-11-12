"use client";

import { useState, useEffect, useRef } from "react";
import {
  CloudSun,
  Layers,
  TrendingUp,
  MessageCircle,
  Microscope,
  Sprout,
} from "lucide-react";

import Navbar from "../components/Navbar";
import UploadPanel from "../components/UploadPanel";
import WeatherPanel from "../components/WeatherPanel";
import SoilPanel from "../components/SoilPanel";
import MarketPanel from "../components/MarketPanel";
import ChatPanel from "../components/ChatPanel";
import CropAnalysisPanel from "../components/CropAnalysisPanel";

const tabs = [
  { id: "analysis", label: "Crop Analysis", icon: Microscope },
  { id: "weather", label: "Weather", icon: CloudSun },
  { id: "soil", label: "Soil", icon: Layers },
  { id: "market", label: "Market", icon: TrendingUp },
  { id: "chat", label: "AI Chat", icon: MessageCircle },
];

const fetchBackendJson = async (path) => {
  const response = await fetch(
    `${path}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Request failed");
  }

  return data;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("analysis");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [soilAnalysis, setSoilAnalysis] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [marketPrices, setMarketPrices] = useState(null);
  const [marketError, setMarketError] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [forecastError, setForecastError] = useState(false);
  const [scanId, setScanId]=useState(null)
  const [chatOpened, setChatOpened] = useState(false);
  const weatherRequested = useRef(false);
  const pricesLoading = useRef(false);
  const forecastRequested = useRef(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/get-profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },

        });

        const data = await response.json();
        setProfile(data?.data)

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    }
    fetchProfile();

  }, [])

  // Each weather request runs a Gemini call on the backend, so the ref keeps it
  // to one: it blocks StrictMode's repeat effect and repeat tab opens, and is
  // reset on failure so reopening the tab retries.
  useEffect(() => {
    if (activeTab !== "weather" || weatherRequested.current) return;

    weatherRequested.current = true;
    setWeatherError(false);

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `/api/weather`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail || data?.message || "Weather fetch failed"
          );
        }

        setWeather(data);
      } catch (err) {
        console.error(err);
        weatherRequested.current = false;
        setWeatherError(true);
      }
    };

    fetchWeather();
  }, [activeTab])

  useEffect(() => {
    if (activeTab === "chat") setChatOpened(true);
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== "market") return;

    // Prices are cheap, and the backend swaps sample prices for live ones in
    // the background, so refetch on every visit. The ref only blocks
    // overlapping requests, such as StrictMode's repeat effect.
    if (!pricesLoading.current) {
      pricesLoading.current = true;

      fetchBackendJson("/api/market/prices")
        .then((data) => {
          setMarketPrices(data);
          setMarketError(false);
        })
        .catch((err) => {
          console.error(err);
          setMarketError(true);
        })
        .finally(() => {
          pricesLoading.current = false;
        });
    }

    // The forecast runs a Gemini call, so fetch it once; retry only after a
    // failure, when the tab is opened again.
    if (!forecastRequested.current) {
      forecastRequested.current = true;
      setForecastError(false);

      fetchBackendJson("/api/market/forecast")
        .then(setForecast)
        .catch((err) => {
          console.error(err);
          forecastRequested.current = false;
          setForecastError(true);
        });
    }
  }, [activeTab])


  const handleImageUpload = async ({
    file,
    preview,
    scanType,
    location,
  }) => {
    const isSoilScan = scanType === "soil";
    const setResult = isSoilScan ? setSoilAnalysis : setAnalysis;

    try {
      setUploadedImage(preview);
      setIsAnalyzing(true);
      setResult(null);
      setActiveTab(isSoilScan ? "soil" : "analysis");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("scan_type", scanType);

      if (location) {
        formData.append("location", location);
      }

      const response = await fetch(
        `/api/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      setScanId(data?.scan_id)
      setResult(data?.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      <section className="pt-28 pb-10 px-6 text-center relative">
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(ellipse, #3D9A40, transparent)",
          }}
        />

        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(61,154,64,0.1)",
              border: "1px solid rgba(61,154,64,0.25)",
              color: "#52C455",
            }}
          >
            <Sprout size={12} />
            AI-Powered Agriculture Intelligence
          </div>
        </div>

        <h1
          className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ color: "#F0EBE0" }}
        >
          Grow smarter with
          <br />
          <span style={{ color: "#52C455" }}>
            real-time crop intelligence
          </span>
        </h1>

        <p
          className="text-base max-w-lg mx-auto"
          style={{ color: "#8FAF8F" }}
        >
          Upload a photo of your crop or soil. AgriMind AI instantly diagnoses
          issues, checks weather, analyses nutrients, and shows the best market
          prices.
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Upload Panel */}
          <div className="lg:col-span-4">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-1 h-5 rounded-full"
                  style={{ background: "#52C455" }}
                />
                <h2
                  className="font-semibold text-sm"
                  style={{ color: "#F0EBE0" }}
                >
                  Scan Your Crop or Soil
                </h2>
              </div>

              <UploadPanel
                onImageUpload={handleImageUpload}
                isAnalyzing={isAnalyzing}
                uploadedImage={uploadedImage}
                profile={profile}
              />
            </div>
          </div>

          {/* Insights Panel */}
          <div className="lg:col-span-8">

            <div className="flex gap-1.5 mb-5 flex-wrap">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === id ? "tab-active" : ""
                    }`}
                  style={{
                    border: `1px solid ${activeTab === id
                      ? "rgba(61,154,64,0.4)"
                      : "rgba(61,154,64,0.12)"
                      }`,
                    color: activeTab === id ? "#52C455" : "#6B8F6B",
                    background:
                      activeTab === id
                        ? "rgba(61,154,64,0.12)"
                        : "transparent",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            <div className="card p-5">
              {activeTab === "analysis" && (
                <CropAnalysisPanel
                  isAnalyzing={isAnalyzing}
                  hasImage={!!uploadedImage}
                  analysis={analysis}
                />
              )}

              {activeTab === "weather" && (
                <WeatherPanel
                  data={weather}
                  error={weatherError}
                />
              )}

              {activeTab === "soil" && (
                <SoilPanel
                  isAnalyzing={isAnalyzing}
                  analysis={soilAnalysis}
                />
              )}

              {activeTab === "market" && (
                <MarketPanel
                  prices={marketPrices}
                  error={marketError}
                  forecast={forecast}
                  forecastError={forecastError}
                />
              )}

              {/* Once opened, chat stays mounted so a reply still on its way
                  is not lost when the user switches tabs. */}
              {(chatOpened || activeTab === "chat") && (
                <div hidden={activeTab !== "chat"}>
                  <ChatPanel scanId={scanId} active={activeTab === "chat"} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            {
              label: "Farmers served",
              value: "2.4L+",
              sub: "across 12 states",
            },
            {
              label: "Diagnoses made",
              value: "18M+",
              sub: "crop & soil scans",
            },
            {
              label: "Avg yield boost",
              value: "+23%",
              sub: "reported by users",
            },
            {
              label: "Accuracy rate",
              value: "94.2%",
              sub: "AI diagnosis precision",
            },
          ].map(({ label, value, sub }) => (
            <div key={label} className="card p-4 text-center card-hover">
              <p
                className="font-display text-2xl font-bold"
                style={{ color: "#52C455" }}
              >
                {value}
              </p>

              <p
                className="text-sm font-medium mt-1"
                style={{ color: "#F0EBE0" }}
              >
                {label}
              </p>

              <p
                className="text-xs mt-0.5"
                style={{ color: "#6B8F6B" }}
              >
                {sub}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}