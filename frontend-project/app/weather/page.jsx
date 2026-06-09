"use client";

import { useState } from "react";
import { getWeather } from "@/services/weather.service";

import WeatherCard from "@/components/weather/WeatherCard";
import WeatherInsight from "@/components/weather/WeatherInsight";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    const res = await getWeather(city);
    setData(res);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">

      <h1 className="text-2xl font-bold mb-4">
        🌦 Weather Intelligence
      </h1>

      <input
        className="border p-2 rounded w-64"
        placeholder="Enter city"
        value={city}
        onChange={(e) =>
          setCity(e.target.value)
        }
      />

      <button
        onClick={handleFetch}
        className="ml-2 bg-green-600 text-white px-4 py-2 rounded"
      >
        Get Weather
      </button>

      <div className="mt-6">
        <WeatherCard data={data} />
        <WeatherInsight data={data} />
      </div>

    </div>
  );
}