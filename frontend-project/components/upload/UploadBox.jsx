"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "@/services/upload.service";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } =
    useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const res = await uploadFile(file);

      setResult(
        JSON.stringify(res, null, 2)
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">
        Upload Documents
      </h2>

      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-10 text-center cursor-pointer bg-white"
      >
        <input {...getInputProps()} />

        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>
            Drag & Drop file or click here
          </p>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* RESULT */}
      {result && (
        <pre className="mt-4 bg-gray-100 p-3 text-sm">
          {result}
        </pre>
      )}
    </div>
  );
}