export default function WeatherInsight({
  data,
}) {
  if (!data) return null;

  return (
    <div className="mt-4 p-4 bg-green-50 rounded">

      <h3 className="font-bold">
        🌾 Farming Insight
      </h3>

      <p className="mt-2">
        {data.insight ||
          "Good weather for irrigation and wheat farming."}
      </p>

    </div>
  );
}