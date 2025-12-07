import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// ✅ استخدم نفس الـ API من env
const API = import.meta.env.VITE_API_URL;

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reports", label: "Reports" },
  { to: "/drones", label: "Drones" },
  { to: "/analytics", label: "Analytics" },
  { to: "/users", label: "User Management" },
];

export default function AdminProfileManagement() {
  const { user } = useAuth();

  const fullName = user?.fullName || "PhoenixEye Admin";
  const email = user?.email || "—";
  const role = user?.role || "admin";

  const initials =
    fullName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PE";

  return (
    <div className="min-h-screen bg-[#050816] text-slate-50">
      {/* Header */}
      <header className="px-8 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-[#050816]/90 border border-white/10 px-6 py-3 flex items-center justify-between shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            {/* Brand + Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 flex items-center justify-center text-xs font-bold text-slate-900 shadow-[0_0_25px_rgba(16,185,129,0.7)]">
                {initials}
              </div>
              <span className="font-semibold tracking-wide text-sm">
                PhoenixEye Console
              </span>
            </div>

            {/* Nav */}
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

            {/* User info */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-slate-400">
                Logged in as
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-emerald-200 font-medium">
                {fullName}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-8 pb-10">
        <div className="max-w-xl mx-auto pt-10">
          <section className="relative rounded-3xl bg-white/5 border border-emerald-400/40 px-8 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            {/* Glow border */}
            <div className="pointer-events-none absolute -inset-px rounded-[1.5rem] border border-emerald-400/40 opacity-60" />

            {/* Title */}
            <h1 className="relative text-xl font-semibold mb-4 text-slate-50">
              Admin profile &amp; settings
            </h1>

            {/* Info */}
            <div className="relative space-y-2 text-sm">
              <p>
                <span className="font-semibold text-slate-200">
                  Full name:
                </span>{" "}
                <span className="text-slate-100">{fullName}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-200">Email:</span>{" "}
                <span className="text-slate-100">{email}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-200">Role:</span>{" "}
                <span className="uppercase tracking-wide text-emerald-300">
                  {role}
                </span>
              </p>
            </div>

            <hr className="my-5 border-slate-700/70" />

            {/* Options */}
            <div className="relative space-y-3 text-sm">
              <p className="text-xs text-slate-400 mb-1">Profile options</p>

              {/* Edit name/email */}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-50 text-sm">
                    Edit name / email
                  </p>
                  <p className="text-xs text-slate-400">
                    Update how your name and contact email appear in the console.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs rounded-full bg-emerald-500/90 text-slate-900 font-semibold shadow-[0_8px_24px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition"
                >
                  Manage
                </button>
              </div>

              {/* Change password */}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-50 text-sm">
                    Change password
                  </p>
                  <p className="text-xs text-slate-400">
                    Keep your admin account secure with a strong, unique password.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs rounded-full bg-white/5 text-slate-100 border border-slate-500/70 hover:bg-white/10 transition"
                >
                  Manage
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-50 text-sm">
                    Notification preferences
                  </p>
                  <p className="text-xs text-slate-400">
                    Choose which alerts you receive for new reports and missions.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs rounded-full bg-white/5 text-slate-100 border border-slate-500/70 hover:bg-white/10 transition"
                >
                  Manage
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

