import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [heatmap, setHeatmap] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, timeRes, heatRes] = await Promise.all([
        api.get("/admin/reports/stats"),
        api.get("/admin/analytics/timeseries"),
        api.get("/admin/analytics/heatmap"),
      ]);

      setStats(statsRes.data);
      setTimeSeries(timeRes.data);
      setHeatmap(heatRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <p>Loading...</p>;

  const pieData = [
    { name: "Pending", value: stats.pending },
    { name: "Verified", value: stats.verified },
    { name: "Removed", value: stats.removed },
  ];

  const COLORS = ["#f59e0b", "#22c55e", "#ef4444"];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-phoenix-accent">
        Control Center
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <Card title="Total Reports" value={stats.total} />
        <Card title="Pending" value={stats.pending} />
        <Card title="Verified" value={stats.verified} />
        <Card title="Removed" value={stats.removed} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-phoenix-card p-6 rounded-xl glow">
          <h3 className="mb-4 text-lg font-semibold text-phoenix-accent">
            Reports Trend
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeries}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#38bdf8"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-phoenix-card p-6 rounded-xl glow">
          <h3 className="mb-4 text-lg font-semibold text-phoenix-accent">
            Status Distribution
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap Table Preview */}
      <div className="bg-phoenix-card p-6 rounded-xl mt-10 glow">
        <h3 className="mb-4 text-lg font-semibold text-phoenix-accent">
          Heatmap Data (Top Locations)
        </h3>

        <table className="w-full text-left">
          <thead className="bg-[#1a1f2b]">
            <tr>
              <th className="p-3">Latitude</th>
              <th className="p-3">Longitude</th>
              <th className="p-3">Reports</th>
            </tr>
          </thead>
          <tbody>
            {heatmap.slice(0, 5).map((point, index) => (
              <tr key={index} className="border-b border-phoenix-border">
                <td className="p-3">{point.latitude}</td>
                <td className="p-3">{point.longitude}</td>
                <td className="p-3">{point.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-phoenix-card p-6 rounded-xl text-center glow">
      <p className="text-gray-400 mb-2">{title}</p>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}