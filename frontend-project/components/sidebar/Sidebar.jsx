import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-green-900 text-white p-4">

      <h1 className="text-xl font-bold mb-6">
        🌾 AgriMind AI
      </h1>

      <ul className="space-y-3">

        <li>
          <Link href="/">💬 Chat</Link>
        </li>

        <li>
          <Link href="/upload">📄 Upload</Link>
        </li>

        <li>🌱 Soil Analysis</li>
        <li>🦠 Disease Detection</li>
        <li>🌦 Weather</li>
        <li>📈 Market</li>

      </ul>
    </div>
  );
}