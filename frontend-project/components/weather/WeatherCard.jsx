export default function WeatherCard({
  data,
}) {
  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold mb-4">
        🌦 Weather Report
      </h2>

      <div className="space-y-2">

        <p>
          🌡 Temperature: {data.temp}°C
        </p>

        <p>
          💧 Humidity: {data.humidity}%
        </p>

        <p>
          🌧 Rain Chance: {data.rain}%
        </p>

        <p>
          🌬 Wind: {data.wind} km/h
        </p>

      </div>

    </div>
  );
}