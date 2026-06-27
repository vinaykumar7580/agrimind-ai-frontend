"use client";

import { useCallback, useState } from "react";
import {
  Upload,
  Camera,
  Image,
  Leaf,
  Layers,
  CheckCircle,
  Loader,
} from "lucide-react";
import { toast } from "sonner";

export default function UploadPanel({
  onImageUpload,
  isAnalyzing,
  uploadedImage,
}) {
  const [dragging, setDragging] = useState(false);
  const [scanType, setScanType] = useState("crop");

  const handleFile = useCallback(
    (file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be under 10MB");
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(file, e.target.result);

          toast.success(
            `${
              scanType === "crop" ? "Crop" : "Soil"
            } image uploaded — analyzing now`
          );
        }
      };

      reader.readAsDataURL(file);
    },
    [onImageUpload, scanType]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);

      const file = e.dataTransfer.files[0];

      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const scanOptions = [
    {
      type: "crop",
      Icon: Leaf,
      label: "Crop Scan",
    },
    {
      type: "soil",
      Icon: Layers,
      label: "Soil Scan",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Scan type */}
      <div
        className="flex gap-2 p-1 rounded-xl"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(61,154,64,0.12)",
        }}
      >
        {scanOptions.map(({ type, Icon, label }) => (
          <button
            key={type}
            onClick={() => setScanType(type)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              scanType === type ? "tab-active" : ""
            }`}
            style={{
              color: scanType === type ? "#52C455" : "#6B8F6B",
              border: "1px solid transparent",
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone rounded-2xl cursor-pointer relative overflow-hidden ${
          dragging ? "dragging" : ""
        }`}
        style={{ minHeight: "260px" }}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onClick={() =>
          !uploadedImage && document.getElementById("file-input")?.click()
        }
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && handleFile(e.target.files[0])
          }
        />

        {uploadedImage ? (
          <div
            className="relative w-full h-full"
            style={{ minHeight: "260px" }}
          >
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-2xl"
              style={{ minHeight: "260px" }}
            />

            {isAnalyzing && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(15,31,15,0.7)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div className="relative w-20 h-20 flex items-center justify-center mb-4">
                  <div
                    className="scan-ring absolute w-20 h-20 rounded-full"
                    style={{
                      border: "2px solid rgba(82,196,85,0.6)",
                    }}
                  />

                  <div
                    className="scan-ring absolute w-16 h-16 rounded-full"
                    style={{
                      border: "2px solid rgba(82,196,85,0.4)",
                      animationDelay: "0.5s",
                    }}
                  />

                  <Loader
                    size={24}
                    style={{ color: "#52C455" }}
                    className="animate-spin"
                  />
                </div>

                <p
                  className="text-sm font-medium"
                  style={{ color: "#52C455" }}
                >
                  Analyzing {scanType}...
                </p>

                <p className="text-xs mt-1" style={{ color: "#6B8F6B" }}>
                  Processing with AI vision
                </p>
              </div>
            )}

            {!isAnalyzing && (
              <div className="absolute top-3 right-3">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(15,31,15,0.85)",
                    border: "1px solid rgba(61,154,64,0.4)",
                    color: "#52C455",
                  }}
                >
                  <CheckCircle size={12} />
                  Analyzed
                </div>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("file-input")?.click();
              }}
              className="absolute bottom-3 left-3 right-3 py-2 rounded-xl text-xs font-medium"
              style={{
                background: "rgba(15,31,15,0.85)",
                border: "1px solid rgba(61,154,64,0.3)",
                color: "#8FAF8F",
              }}
            >
              Upload different image
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-12 px-6 text-center"
            style={{ minHeight: "260px" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative"
              style={{
                background: "rgba(61,154,64,0.1)",
                border: "1px solid rgba(61,154,64,0.25)",
              }}
            >
              <Upload size={24} style={{ color: "#52C455" }} />

              {dragging && (
                <>
                  <div
                    className="scan-ring absolute w-16 h-16 rounded-2xl"
                    style={{
                      border: "2px solid rgba(82,196,85,0.5)",
                    }}
                  />

                  <div
                    className="scan-ring absolute w-20 h-20 rounded-2xl"
                    style={{
                      border: "1px solid rgba(82,196,85,0.3)",
                      animationDelay: "0.4s",
                    }}
                  />
                </>
              )}
            </div>

            <p
              className="font-semibold mb-1"
              style={{ color: "#F0EBE0" }}
            >
              Drop your {scanType} image here
            </p>

            <p className="text-sm mb-4" style={{ color: "#6B8F6B" }}>
              or click to browse — JPG, PNG up to 10MB
            </p>

            <div className="flex gap-2">
              <span
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(61,154,64,0.1)",
                  color: "#52C455",
                  border: "1px solid rgba(61,154,64,0.2)",
                }}
              >
                <Camera size={11} />
                Camera
              </span>

              <span
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(61,154,64,0.1)",
                  color: "#52C455",
                  border: "1px solid rgba(61,154,64,0.2)",
                }}
              >
                <Image size={11} />
                Gallery
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(200,134,10,0.08)",
          border: "1px solid rgba(200,134,10,0.2)",
        }}
      >
        <p
          className="text-xs font-semibold mb-2"
          style={{ color: "#E8A020" }}
        >
          Tips for best results
        </p>

        <ul className="space-y-1.5">
          {(scanType === "crop"
            ? [
                "Capture leaves clearly in natural daylight",
                "Include visible disease spots or discoloration",
                "Avoid heavy shadows on the plant",
              ]
            : [
                "Take a close-up of the soil surface",
                "Include a small sample of soil texture",
                "Capture after light rain for best color accuracy",
              ]
          ).map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs"
              style={{ color: "#8FAF8F" }}
            >
              <span
                className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: "#C8860A" }}
              />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}