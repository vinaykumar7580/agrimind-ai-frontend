"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { analyzeSoil } from "@/services/soil.service";

export default function SoilUpload({
  onResult,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] =
    useState(false);

  const onDrop = (files) => {
    setFile(files[0]);
  };

  const { getRootProps, getInputProps } =
    useDropzone({ onDrop });

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const res = await analyzeSoil(file);

      onResult(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded bg-white">

      <div
        {...getRootProps()}
        className="border-dashed border-2 p-10 text-center cursor-pointer"
      >
        <input {...getInputProps()} />

        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>
            Upload Soil Excel File
          </p>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading
          ? "Analyzing..."
          : "Analyze Soil"}
      </button>

    </div>
  );
}