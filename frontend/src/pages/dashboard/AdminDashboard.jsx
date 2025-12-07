import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reports", label: "Reports" },
  { to: "/drones", label: "Drones" },
  { to: "/analytics", label: "Analytics" },
  { to: "/users", label: "User Management" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const name = user?.fullName || "PhoenixEye Admin";
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PE";

  const handleAvatarClick = () => {
    if (isAdmin) {
      navigate("/admin/profile");
    }
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-50">
      <div className="min-h-screen bg-[rgba(2,6,23,0.9)]">
        { }
        <header className="px-8 pt-6">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl bg-[#050816]/90 border border-white/10 px-6 py-3 flex items-center justify-between shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
              { }
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 flex items-center justify-center text-xs font-bold text-slate-900 shadow-[0_0_25px_rgba(16,185,129,0.7)] focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
                  style={{ cursor: isAdmin ? "pointer" : "default" }}
                  title={isAdmin ? "Open admin management" : undefined}
                >
                  {initials}
                </button>
                <span className="font-semibold tracking-wide text-sm">
                  PhoenixEye Console
                </span>
              </div>

              { }
              <nav className="hidden md:flex items-center gap-2 text-xs">
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
              <div className="flex items-center gap-3 text-xs">
                <span className="hidden sm:inline text-slate-400">
                  Logged in as
                </span>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-emerald-200 font-medium"
                  style={{ cursor: isAdmin ? "pointer" : "default" }}
                  title={isAdmin ? "Open admin management" : undefined}
                >
                  {name}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-full border border-red-400/70 text-red-200 hover:bg-red-500/10 transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </header>

        { }
        <main className="mx-auto max-w-5xl px-4 pt-10 pb-16">
          { }
          <section className="relative mb-10">
            <div
              className="relative overflow-hidden rounded-3xl border px-8 py-8 md:px-10 md:py-10 backdrop-blur-2xl"
              style={{
                backgroundColor: "#020617",
                borderColor: "rgba(51,65,85,0.8)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  background: "linear-gradient(135deg,#0E7490,#16A34A)",
                }}
              />

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pt-3">
                { }
                <div className="max-w-xl">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-2">
                    Welcome, Commander
                  </p>
                  <h1 className="text-2xl md:text-3xl font-semibold mb-3 text-slate-50">
                    Hello {name.toLowerCase()} 👋
                  </h1>
                  <p className="text-sm text-slate-300 mb-6">
                    You’re in control of PhoenixEye&apos;s road-safety
                    operations. Review citizen reports, deploy drones, and
                    monitor system performance – all from one unified console.
                  </p>

                  { }
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/reports"
                      className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-xl text-slate-50 transition-transform duration-300 hover:-translate-y-[2px] hover:scale-[1.01]"
                      style={{
                        background:
                          "linear-gradient(135deg,#0E7490,#16A34A)",
                        boxShadow: "0 10px 24px rgba(15,118,110,0.55)",
                      }}
                    >
                      View Incoming Reports
                      <span className="ml-2 text-xs">→</span>
                    </Link>

                    <Link
                      to="/drones"
                      className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-xl border transition text-slate-200"
                      style={{
                        backgroundColor: "#020617",
                        borderColor: "rgba(75,85,99,0.8)",
                      }}
                    >
                      Manage Drone Fleet
                    </Link>

                    <Link
                      to="/analytics"
                      className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-medium rounded-xl border transition text-sky-200"
                      style={{
                        backgroundColor: "#020617",
                        borderColor: "rgba(56,189,248,0.5)",
                      }}
                    >
                      Open Analytics
                    </Link>
                  </div>
                </div>

                { }
                <div className="md:w-56 lg:w-64">
                  <div
                    className="relative rounded-2xl border p-4 overflow-hidden"
                    style={{
                      backgroundColor: "#020617",
                      borderColor: "rgba(51,65,85,0.9)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.35),transparent)]" />

                    <p className="text-xs text-slate-400 mb-2">
                      System Status
                    </p>
                    <p className="text-sm font-medium mb-3 text-slate-50">
                      Drones standing by for missions.
                    </p>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Detection Network</span>
                        <span className="text-emerald-400 font-semibold">
                          Online
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Average Battery</span>
                        <span>82%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Weather Risk</span>
                        <span className="text-amber-300 font-medium">
                          Moderate
                        </span>
                      </div>
                    </div>

                    { }

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span
                          className="h-6 w-6 rounded-full flex items-center justify-center text-base"
                          style={{
                            background:
                              "linear-gradient(135deg,#020617,#0EA5E9)",
                          }}
                        >
                          🛰
                        </span>
                        <span>Live drone telemetry</span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-[ping_1.3s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          { }
          <section className="grid gap-4 md:grid-cols-3 text-sm">
            {[
              {
                title: "1. Check new alerts",
                text: (
                  <>
                    Start in <span className="font-semibold">Reports</span> to
                    review pending roadkill incidents and prioritize urgent
                    ones.
                  </>
                ),
              },
              {
                title: "2. Assign drones",
                text: (
                  <>
                    Use the <span className="font-semibold">Drones</span> page
                    to deploy available units with healthy battery and low
                    weather risk.
                  </>
                ),
              },
              {
                title: "3. Track performance",
                text: (
                  <>
                    Head to{" "}
                    <span className="font-semibold">Analytics</span> to view
                    response times, hotspots, and detection accuracy over time.
                  </>
                ),
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border p-4 backdrop-blur-xl"
                style={{
                  backgroundColor: "#020617",
                  borderColor: "rgba(51,65,85,0.85)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
                }}
              >
                <h2 className="font-semibold mb-1 text-slate-50">
                  {card.title}
                </h2>
                <p className="text-xs text-slate-300">{card.text}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
