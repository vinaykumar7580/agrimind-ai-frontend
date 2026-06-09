"use client";

import { useState } from "react";

import SoilUpload from
"@/components/soil/SoilUpload";

import SoilResult from
"@/components/soil/SoilResult";

export default function SoilPage() {
  const [result, setResult] =
    useState(null);

  return (
    <div className="min-h-screen p-6 bg-gray-50">

      <h1 className="text-2xl font-bold mb-6">
        🌱 Soil Analysis AI
      </h1>

      <SoilUpload onResult={setResult} />

      <SoilResult data={result} />

    </div>
  );
}