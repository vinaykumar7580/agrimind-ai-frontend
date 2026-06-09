export default function DashboardCards({
  stats,
}) {

  return (
    <div className="grid grid-cols-4 gap-4">

      <div className="bg-white p-5 rounded shadow">
        <h3>Total Chats</h3>
        <p className="text-2xl font-bold">
          {stats.total_chats}
        </p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        <h3>Documents</h3>
        <p className="text-2xl font-bold">
          {stats.total_documents}
        </p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        <h3>Soil Reports</h3>
        <p className="text-2xl font-bold">
          {stats.total_soil_reports}
        </p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        <h3>Disease Scans</h3>
        <p className="text-2xl font-bold">
          {stats.total_disease_scans}
        </p>
      </div>

    </div>
  );
}