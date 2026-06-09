import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SoilResult({
  data,
}) {
  if (!data) return null;

  const chartData = [
    {
      name: "pH",
      value: data.ph,
    },
    {
      name: "Nitrogen",
      value: data.nitrogen,
    },
    {
      name: "Phosphorus",
      value: data.phosphorus,
    },
    {
      name: "Potassium",
      value: data.potassium,
    },
  ];

  return (
    <div className="mt-6 p-6 bg-white rounded shadow">

      <h2 className="text-xl font-bold mb-4">
        🌱 Soil Analysis Result
      </h2>

      {/* CHART */}
      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={chartData}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="value" fill="#16a34a" />

        </BarChart>
      </ResponsiveContainer>

      {/* INSIGHTS */}
      <div className="mt-4 space-y-2">

        <p>
          🌱 pH Level: {data.ph}
        </p>

        <p>
          🧪 Nitrogen: {data.nitrogen}
        </p>

        <p>
          🌾 Phosphorus: {data.phosphorus}
        </p>

        <p>
          ⚡ Potassium: {data.potassium}
        </p>

      </div>

      {/* AI INSIGHT */}
      <div className="mt-4 p-3 bg-green-50 rounded">
        <p className="font-semibold">
          💡 Recommendation:
        </p>

        <p>
          {data.recommendation ||
            "Use organic compost and balanced NPK fertilizer."}
        </p>
      </div>

    </div>
  );
}