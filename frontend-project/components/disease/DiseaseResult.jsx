export default function DiseaseResult({
  data,
}) {
  if (!data) return null;

  return (
    <div className="mt-6 p-6 bg-white rounded shadow">

      <h2 className="text-xl font-bold mb-4">
        🦠 Disease Detection Result
      </h2>

      {/* IMAGE PREVIEW */}
      {data.image_url && (
        <img
          src={data.image_url}
          className="w-64 rounded mb-4"
        />
      )}

      <div className="space-y-2">

        <p>
          🦠 Disease:{" "}
          <b>{data.disease}</b>
        </p>

        <p>
          📊 Severity:{" "}
          <b>{data.severity}</b>
        </p>

        <p>
          🌱 Crop:{" "}
          <b>{data.crop || "Unknown"}</b>
        </p>

      </div>

      {/* TREATMENT */}
      <div className="mt-4 p-3 bg-red-50 rounded">

        <p className="font-semibold">
          💊 Treatment:
        </p>

        <p>{data.treatment}</p>

      </div>

      {/* AI EXPLANATION */}
      <div className="mt-4 p-3 bg-gray-50 rounded">

        <p className="font-semibold">
          🧠 AI Explanation:
        </p>

        <p>{data.explanation}</p>

      </div>

    </div>
  );
}