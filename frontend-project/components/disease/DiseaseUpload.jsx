"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { detectDisease } from "@/services/disease.service";

export default function DiseaseUpload({
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

  const handleDetect = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const res = await detectDisease(file);

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
            Upload Crop Leaf Image
          </p>
        )}
      </div>

      <button
        onClick={handleDetect}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        {loading
          ? "Analyzing..."
          : "Detect Disease"}
      </button>

    </div>
  );
}