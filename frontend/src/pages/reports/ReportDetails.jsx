import { useEffect, useState } from "react";
import { useParams, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reports", label: "Reports" },
  { to: "/drones", label: "Drones" },
  { to: "/analytics", label: "Analytics" },
  { to: "/users", label: "User Management" },
];

const STATUS_COLORS = {
  pending: "bg-amber-500/15 text-amber-300 border border-amber-400/70",
  "in-progress": "bg-sky-500/15 text-sky-300 border border-sky-400/70",
  completed: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/70",
};

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [report, setReport] = useState(null);
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
    async function fetchReport() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`http://localhost:5000/api/reports/${id}`);
        if (!res.ok) throw new Error("Failed to load report");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err.message || "Error loading report");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  const statusClass =
    STATUS_COLORS[report?.status] || STATUS_COLORS["pending"];

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
        <div className="max-w-5xl mx-auto pt-6 space-y-6">
          {}
          <button
            onClick={() => navigate("/reports")}
            className="text-xs text-slate-300 hover:text-emerald-300 flex items-center gap-1"
          >
            ← Back to Reports
          </button>

          {}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.7rem] tracking-[0.23em] uppercase text-slate-400 mb-1">
                Report Details
              </p>
              <h1 className="text-2xl font-semibold text-slate-50">
                Incident #{id}
              </h1>
              {report && (
                <p className="text-sm text-slate-400 mt-1">
                  Submitted location:{" "}
                  <span className="text-slate-100">
                    {report.location || "Unknown location"}
                  </span>
                </p>
              )}
            </div>

            {report && (
              <span
                className={
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.75rem] font-medium " +
                  statusClass
                }
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {report.status?.toUpperCase() || "PENDING"}
              </span>
            )}
          </div>

          {}
          {loading && (
            <p className="text-sm text-slate-400">Loading report…</p>
          )}

          {error && !loading && (
            <p className="text-sm text-rose-400">Error: {error}</p>
          )}

          {report && !loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {}
              <section className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
                <h2 className="text-sm font-semibold text-slate-100 mb-3">
                  Incident summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[0.7rem] text-slate-400 uppercase tracking-[0.18em] mb-1">
                      Title
                    </p>
                    <p className="text-slate-50 font-medium">
                      {report.title || "Untitled report"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[0.7rem] text-slate-400 uppercase tracking-[0.18em] mb-1">
                      Description
                    </p>
                    <p className="text-slate-200 leading-relaxed">
                      {report.description || "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-[0.7rem] text-slate-400 uppercase tracking-[0.18em] mb-1">
                        Location (text)
                      </p>
                      <p className="text-slate-200">
                        {report.location || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[0.7rem] text-slate-400 uppercase tracking-[0.18em] mb-1">
                        Coordinates
                      </p>
                      <p className="text-slate-200">
                        {report.latitude && report.longitude
                          ? `${report.latitude.toFixed?.(5) ?? report.latitude}, ${
                              report.longitude.toFixed?.(5) ??
                              report.longitude
                            }`
                          : "No coordinates"}
                      </p>
                    </div>
                  </div>
                </div>

                {}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/assign-drone/${report.id}`}
                    className="btn btn-primary text-sm rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 text-slate-900 px-4 py-2 font-semibold shadow-[0_10px_35px_rgba(16,185,129,0.45)] hover:shadow-[0_14px_45px_rgba(16,185,129,0.7)] hover:translate-y-[-1px] active:translate-y-0 transition transform"
                  >
                    Assign Drone
                  </Link>

                  {}
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `http://localhost:5000/api/reports/${report.id}`,
                          {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "completed" }),
                          }
                        );

                        if (!res.ok) throw new Error("Failed to update report");

                        const updated = await res.json();
                        setReport(updated);
                      } catch (err) {
                        console.error(err);
                        alert("Error marking report as completed");
                      }
                    }}
                    disabled={report.status === "completed"}
                    className={
                      "px-4 py-2 rounded-xl text-sm font-semibold transition " +
                      (report.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 cursor-default"
                        : "bg-white/5 border border-white/15 text-slate-100 hover:bg-white/10")
                    }
                  >
                    {report.status === "completed"
                      ? "Completed ✓"
                      : "Mark as Completed"}
                  </button>
                </div>
              </section>

              {}
              <aside className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-[0_18px_45px_rgba(15,23,42,0.9)] flex flex-col justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100 mb-3">
                    Mission context
                  </h2>
                  <p className="text-xs text-slate-400 mb-3">
                    Use this report to deploy a nearby drone with enough
                    battery and safe weather conditions.
                  </p>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Report ID</span>
                      <span className="font-mono text-slate-100">
                        {report.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status</span>
                      <span className="font-medium">
                        {report.status || "pending"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Source</span>
                      <span className="font-medium">Citizen app</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[0.7rem] text-slate-400">
                  <p className="mb-1 uppercase tracking-[0.18em]">
                    Next steps
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Check incident severity in description.</li>
                    <li>Select an available drone from Drones page.</li>
                    <li>Assign the drone using “Assign Drone”.</li>
                  </ol>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
