import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [liveData, setLiveData] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard/summary");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  const fetchLiveDrones = async () => {
    try {
      const res = await api.get("/drones/live");
      setLiveData(res.data);
    } catch (err) {
      console.error("Live drones error:", err);
    }
  };

  useEffect(() => {
    // أول تحميل
    fetchDashboard();
    fetchLiveDrones();

    // Auto refresh كل 5 ثواني
    const interval = setInterval(() => {
      fetchDashboard();
      fetchLiveDrones();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data || !liveData) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">
        Control Center Overview
      </h1>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <Card title="Total Reports" value={data.totalReports} />
        <Card title="Total Drones" value={data.totalDrones} />
        <Card title="Online Drones" value={liveData.online} />
        <Card title="Offline Drones" value={liveData.offline} />
      </div>

      {/* Status Distribution */}
      <div className="bg-slate-800 p-5 rounded-xl mb-10">
        <h2 className="mb-4 text-lg">Reports by Status</h2>
        {data.statusCounts.map((s) => (
          <p key={s.status}>
            {s.status} : {s.count}
          </p>
        ))}
      </div>

      {/* Live Drones Table */}
      <div className="bg-slate-800 p-5 rounded-xl mb-10">
        <h2 className="mb-4 text-lg">Live Drones</h2>
        {liveData.drones.map((drone) => (
          <div
            key={drone.id}
            className="border-b border-slate-700 py-2 flex justify-between"
          >
            <span>{drone.name}</span>

            <span>
              {drone.is_online ? "🟢 Online" : "⚫ Offline"}
            </span>

            <span>
              Battery: {drone.battery ?? 0}%
              {drone.is_critical && (
                <span className="text-red-500 ml-2">
                  ⚠ Low
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-slate-800 p-5 rounded-xl">
        <h2 className="mb-4 text-lg">Recent Reports</h2>
        {data.recentReports.map((r) => {
          const dateStr = r.createdAt || r.created_at; // يدعم الاثنين
          const dateLabel = dateStr ? new Date(dateStr).toLocaleString() : "—";

          return (
          <div key={r.id} className="border-b border-slate-700 py-2">
          {r.status} — {dateLabel}
        </div>
        );
        })}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <p className="text-3xl font-bold text-emerald-400 mt-2">
        {value}
      </p>
    </div>
  );
}