"use client";

import { useState } from "react";
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

export default function Home() {
  const [activeTab, setActiveTab] = useState("analysis");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (_file, preview) => {
    setUploadedImage(preview);
    setIsAnalyzing(true);

    await new Promise((resolve) => setTimeout(resolve, 3200));

    setIsAnalyzing(false);
    setActiveTab("analysis");
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
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === id ? "tab-active" : ""
                  }`}
                  style={{
                    border: `1px solid ${
                      activeTab === id
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
                />
              )}

              {activeTab === "weather" && <WeatherPanel />}

              {activeTab === "soil" && <SoilPanel />}

              {activeTab === "market" && <MarketPanel />}

              {activeTab === "chat" && <ChatPanel />}
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