import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reports", label: "Reports" },
  { to: "/drones", label: "Drones" },
  { to: "/users", label: "Users" },
  { to: "/analytics", label: "Analytics" },
];

const COLORS = ["#22c55e", "#38bdf8", "#eab308", "#a855f7"];

export default function AnalyticsDashboard() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initials =
    user?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PE";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [repRes, drRes] = await Promise.all([
          fetch("http://localhost:5000/api/reports"),
          fetch("http://localhost:5000/api/drones"),
        ]);

        if (!repRes.ok) throw new Error("Failed to load reports");
        if (!drRes.ok) throw new Error("Failed to load drones");

        const repData = await repRes.json();
        const drData = await drRes.json();

        setReports(repData);
        setDrones(drData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  
  const totalReports = reports.length;
  const completedReports = reports.filter((r) => r.status === "completed")
    .length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const assignedReports = reports.filter((r) => r.status === "assigned")
    .length;

  const completionRate =
    totalReports === 0
      ? 0
      : Math.round((completedReports / totalReports) * 100);

  const totalDrones = drones.length;
  const availableDrones = drones.filter((d) => d.status === "available").length;
  const busyDrones = drones.filter((d) => d.status === "busy").length;
  const maintenanceDrones = drones.filter(
    (d) => d.status === "maintenance"
  ).length;

  
  const reportStatusData = [
    { name: "Pending", value: pendingReports },
    { name: "Assigned", value: assignedReports },
    { name: "Completed", value: completedReports },
  ].filter((d) => d.value > 0);

 
  const droneStatusData = [
    { name: "Available", value: availableDrones },
    { name: "On Mission", value: busyDrones },
    { name: "Maintenance", value: maintenanceDrones },
  ].filter((d) => d.value > 0);

  
  const reportsVsDronesData = [
    { name: "Reports", value: totalReports },
    { name: "Drones", value: totalDrones },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-slate-50">
      { }
      <header className="px-8 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-[#050816]/90 border border-white/10 px-6 py-3 flex items-center justify-between shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            { }
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 flex items-center justify-center text-xs font-bold text-slate-900 shadow-[0_0_25px_rgba(16,185,129,0.7)]">
                {initials}
              </div>
              <span className="font-semibold tracking-wide text-sm">
                PhoenixEye Console
              </span>
            </div>

            { }
            <nav className="flex items-center gap-2 text-xs">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "px-3 py-1.5 rounded-full border text-[0.75rem] transition-colors",
                      isActive
                        ? "bg-emerald-500/20 border-emerald-400/70 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.55)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-emerald-300/70",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            { }
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Logged in as</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-emerald-200 font-medium">
                {user?.fullName || "Commander"}
              </span>
            </div>
          </div>
        </div>
      </header>

      { }
      <main className="px-8 pb-10">
        <div className="max-w-6xl mx-auto pt-8">
          { }
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-[0.7rem] tracking-[0.23em] uppercase text-slate-400 mb-1">
                Analytics
              </p>
              <h1 className="text-2xl font-semibold text-slate-50">
                Operations & Performance
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Overview of reports, drone activity, and completion
                performance.
              </p>
            </div>
          </div>

          {loading && (
            <p className="text-sm text-slate-400 mb-4">
              Loading analytics...
            </p>
          )}
          {error && (
            <p className="text-sm text-rose-400 mb-4">Error: {error}</p>
          )}

          { }
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-4">
              <p className="text-[0.7rem] text-slate-400 mb-1">
                Total Reports
              </p>
              <p className="text-2xl font-bold text-emerald-300">
                {totalReports}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-4">
              <p className="text-[0.7rem] text-slate-400 mb-1">
                Completed Reports
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {completedReports}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-4">
              <p className="text-[0.7rem] text-slate-400 mb-1">
                Active Drones
              </p>
              <p className="text-2xl font-bold text-sky-300">
                {availableDrones + busyDrones}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-4">
              <p className="text-[0.7rem] text-slate-400 mb-1">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-amber-300">
                {completionRate}%
              </p>
            </div>
          </section>

          { }
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            { }
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-5">
              <p className="font-semibold text-slate-100 mb-2 text-sm">
                Reports by Status
              </p>
              <p className="text-[0.7rem] text-slate-400 mb-4">
                Distribution of all reports by status.
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportStatusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {reportStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderColor: "#334155",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            { }
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-5">
              <p className="font-semibold text-slate-100 mb-2 text-sm">
                Drones by Status
              </p>
              <p className="text-[0.7rem] text-slate-400 mb-4">
                Availability and mission load of all drones.
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={droneStatusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {droneStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderColor: "#334155",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          { }
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            { }
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-5">
              <p className="font-semibold text-slate-100 mb-2 text-sm">
                Reports vs Drones
              </p>
              <p className="text-[0.7rem] text-slate-400 mb-4">
                Quick comparison between total reports and available drones.
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportsVsDronesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="name"
                      stroke="#9ca3af"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke="#9ca3af"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderColor: "#334155",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#22c55e"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            { }
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-5 flex flex-col justify-between">
              <div>
                <p className="font-semibold text-slate-100 mb-2 text-sm">
                  Future Metric
                </p>
              </div>
              <div className="h-64 flex items-center justify-center text-xs text-slate-500 border border-dashed border-white/15 rounded-2xl">
                Coming soon…
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

