import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reports", label: "Reports" },
  { to: "/drones", label: "Drones" },
  { to: "/analytics", label: "Analytics" },
  { to: "/users", label: "User Management" },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

const STATUS_LABEL = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

const STATUS_COLORS = {
  pending: "bg-amber-500/10 text-amber-300 border border-amber-400/60",
  "in-progress": "bg-sky-500/10 text-sky-300 border border-sky-400/60",
  completed: "bg-emerald-500/10 text-emerald-300 border border-emerald-400/60",
};

export default function ReportsList() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const initials =
    user?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PE";

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://localhost:5000/api/reports");
        if (!res.ok) throw new Error("Failed to load reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        setError(err.message || "Error loading reports");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => (r.status || "pending") === filter);

  return (
    <div className="min-h-screen bg-[#050816] text-slate-50">
      {}
      <header className="px-8 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-[#050816]/90 border border-white/10 px-6 py-3 flex items-center justify-between shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            {}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 flex items-center justify-center text-xs font-bold text-slate-900 shadow-[0_0_25px_rgba(16,185,129,0.7)]">
                {initials}
              </div>
              <span className="font-semibold tracking-wide text-sm">
                PhoenixEye Console
              </span>
            </div>

            {}
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

            {}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Logged in as</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-emerald-200 font-medium">
                {user?.fullName || "Commander"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="px-8 pb-10">
        <div className="max-w-6xl mx-auto pt-8 space-y-6">
          {}
          <div>
            <p className="text-[0.7rem] tracking-[0.25em] uppercase text-slate-400 mb-1">
              Incoming Reports
            </p>
            <h1 className="text-2xl font-semibold text-slate-50">
              Roadkill & hazard incidents
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review citizen reports, prioritize urgent incidents, and deploy
              drones from PhoenixEye.
            </p>
          </div>

          {}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={
                    "px-4 py-1.5 rounded-full text-xs border transition shadow-sm " +
                    (active
                      ? "bg-emerald-500/20 border-emerald-400/80 text-emerald-100 shadow-[0_0_22px_rgba(16,185,129,0.6)]"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-emerald-300/60")
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {}
          {loading && (
            <p className="text-sm text-slate-400">Loading reports…</p>
          )}

          {error && !loading && (
            <p className="text-sm text-rose-400">Error: {error}</p>
          )}

          {!loading && !error && filteredReports.length === 0 && (
            <p className="text-sm text-slate-400">
              No reports found for this filter.
            </p>
          )}

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredReports.map((report) => {
              const status = report.status || "pending";
              const statusClass =
                STATUS_COLORS[status] || STATUS_COLORS.pending;

              return (
                <article
                  key={report.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-[0_18px_45px_rgba(15,23,42,0.9)] flex flex-col justify-between gap-4"
                >
                  {}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-400 mb-1">
                        Report ID #{report.id}
                      </p>
                      <h2 className="text-sm font-semibold text-slate-50 mb-1">
                        {report.title || "Untitled incident"}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {report.description ||
                          "No description was provided for this report."}
                      </p>
                    </div>

                    <span
                      className={
                        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[0.7rem] font-medium " +
                        statusClass
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {STATUS_LABEL[status] || "Pending"}
                    </span>
                  </div>

                  {}
                  <div className="flex items-end justify-between gap-3">
                    <div className="text-[0.7rem] text-slate-300 space-y-1">
                      <div>
                        <span className="text-slate-400">Location:</span>{" "}
                        <span className="text-slate-100">
                          {report.location || "Unknown"}
                        </span>
                      </div>
                      {report.latitude && report.longitude && (
                        <div>
                          <span className="text-slate-400">Coordinates:</span>{" "}
                          <span className="font-mono text-slate-100">
                            {report.latitude}, {report.longitude}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Link
                        to={`/reports/${report.id}`}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 text-[0.75rem] font-semibold text-slate-900 shadow-[0_10px_30px_rgba(16,185,129,0.45)] hover:shadow-[0_14px_40px_rgba(16,185,129,0.7)] hover:translate-y-[-1px] active:translate-y-0 transition transform"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
