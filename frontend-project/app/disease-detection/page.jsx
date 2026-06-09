"use client";

import { useState } from "react";

import DiseaseUpload from
"@/components/disease/DiseaseUpload";

import DiseaseResult from
"@/components/disease/DiseaseResult";

export default function DiseasePage() {
  const [result, setResult] =
    useState(null);

  return (
    <div className="min-h-screen p-6 bg-gray-50">

      <h1 className="text-2xl font-bold mb-6">
        🦠 Crop Disease Detection AI
      </h1>

      <DiseaseUpload
        onResult={setResult}
      />

      <DiseaseResult data={result} />

    </div>
  );
}