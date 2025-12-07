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

const STATUS_CONFIG = {
  available: {
    label: "Available",
    badge:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-400/60",
    chip:
      "bg-emerald-500/10 text-emerald-300 border border-emerald-400/40",
  },
  busy: {
    label: "On Mission",
    badge:
      "bg-amber-500/15 text-amber-300 border border-amber-400/60",
    chip:
      "bg-amber-500/10 text-amber-300 border border-amber-400/40",
  },
  maintenance: {
    label: "Maintenance",
    badge:
      "bg-sky-500/15 text-sky-300 border border-sky-400/60",
    chip:
      "bg-sky-500/10 text-sky-300 border border-sky-400/40",
  },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "available", label: "Available" },
  { id: "busy", label: "On Mission" },
  { id: "maintenance", label: "Maintenance" },
];

export default function DronesList() {
  const [drones, setDrones] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const initials =
    user?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PE";

  
  useEffect(() => {
    async function fetchDrones() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/api/drones");
        if (!res.ok) throw new Error("Failed to load drones");

        const data = await res.json();
        setDrones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDrones();
  }, []);

  
  const handleStatusChange = async (droneId, newStatus) => {
    const mode =
      newStatus === "available"
        ? "idle"
        : newStatus === "busy"
        ? "on-mission"
        : "maintenance";

    try {
      setUpdatingId(droneId);
      const res = await fetch(`http://localhost:5000/api/drones/${droneId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, mode }),
      });

      if (!res.ok) throw new Error("Failed to update drone");

      const updated = await res.json();
      setDrones((prev) =>
        prev.map((d) => (d.id === droneId ? updated : d))
      );
    } catch (err) {
      alert("Error updating drone: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredDrones =
    filter === "all"
      ? drones
      : drones.filter((d) => d.status === filter);

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
        <div className="max-w-6xl mx-auto space-y-6 pt-6">
          {}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.7rem] tracking-[0.23em] uppercase text-slate-400 mb-1">
                Drone Fleet
              </p>
              <h1 className="text-2xl font-semibold text-slate-50">
                Drones Overview
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Monitor drone availability, missions, and battery levels in
                PhoenixEye.
              </p>
            </div>

            {}
            <Link
              to="/drones/new"
              className="rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 text-slate-900 px-4 py-2 text-sm font-semibold shadow-[0_10px_35px_rgba(16,185,129,0.45)] hover:shadow-[0_14px_45px_rgba(16,185,129,0.7)] hover:translate-y-[-1px] active:translate-y-0 transition transform"
            >
              + Add Drone
            </Link>
          </div>

          {}
          <div className="flex flex-wrap gap-2 mb-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={
                    "px-4 py-1.5 rounded-full text-xs border backdrop-blur-md transition " +
                    (active
                      ? "bg-emerald-500/15 border-emerald-400/70 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.45)]"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-emerald-300/60")
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {loading && (
            <p className="text-sm text-slate-400">Loading drones…</p>
          )}
          {error && (
            <p className="text-sm text-rose-400 mb-4">
              Error: {error}
            </p>
          )}

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredDrones.map((drone) => {
              const cfg =
                STATUS_CONFIG[drone.status] || STATUS_CONFIG.available;

              return (
                <article
                  key={drone.id}
                  className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-5 flex flex-col justify-between hover:border-emerald-300/60 hover:shadow-[0_22px_55px_rgba(16,185,129,0.4)] transition"
                >
                  {}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[0.7rem] text-slate-400 mb-0.5 uppercase tracking-[0.18em]">
                        Drone ID #{drone.id}
                      </p>
                      <h2 className="text-base font-semibold text-slate-50">
                        {drone.name}
                      </h2>
                    </div>

                    <span
                      className={
                        "inline-flex items-center rounded-full px-3 py-0.5 text-[0.7rem] font-semibold gap-1.5 " +
                        cfg.badge
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                      {cfg.label}
                    </span>
                  </div>

                  {}
                  <div className="space-y-2 mb-3">
                    {}
                    <div>
                      <div className="flex justify-between text-[0.7rem] mb-1 text-slate-400">
                        <span>Battery</span>
                        <span className="font-semibold text-slate-100">
                          {drone.battery}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 transition-all"
                          style={{ width: `${Math.min(drone.battery, 100)}%` }}
                        />
                      </div>
                    </div>

                    {}
                    <p className="text-[0.75rem] text-slate-300">
                      <span className="font-semibold text-slate-400">
                        Mode:
                      </span>{" "}
                      {drone.mode}
                    </p>
                    <p className="text-[0.75rem] text-slate-300">
                      <span className="font-semibold text-slate-400">
                        Location:
                      </span>{" "}
                      {drone.location}
                    </p>
                  </div>

                  {}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-3 py-0.5 text-[0.7rem] font-medium " +
                          cfg.chip
                        }
                      >
                        {cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={drone.status}
                        onChange={(e) =>
                          handleStatusChange(drone.id, e.target.value)
                        }
                        disabled={updatingId === drone.id}
                        className="text-[0.7rem] rounded-full border border-white/15 bg-slate-900/60 px-3 py-1 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-400/70"
                      >
                        <option value="available">Available</option>
                        <option value="busy">On Mission</option>
                        <option value="maintenance">Maintenance</option>
                      </select>

                      {}
                      <Link
                        to={`/drones/${drone.id}`}
                        className="text-[0.7rem] font-medium text-emerald-300 hover:text-emerald-200 hover:underline"
                      >
                        View Tasks
                      </Link>
                    </div>
                  </div>

                  {updatingId === drone.id && (
                    <p className="mt-2 text-[0.7rem] text-slate-400">
                      Updating status...
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          {!loading && !error && filteredDrones.length === 0 && (
            <p className="text-sm text-slate-400 mt-4">
              No drones match this filter.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

