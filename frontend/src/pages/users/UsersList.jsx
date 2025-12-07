import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reports", label: "Reports" },
  { to: "/drones", label: "Drones" },
  { to: "/analytics", label: "Analytics" },
  { to: "/users", label: "User Management" },
];

const ROLE_BADGE = {
  admin: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/60",
  citizen: "bg-sky-500/15 text-sky-300 border border-sky-400/60",
  default: "bg-slate-500/15 text-slate-200 border border-slate-400/60",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "admin", label: "Admins" },
  { id: "citizen", label: "Citizens" },
];

export default function UsersList() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const initials =
    currentUser?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PE";

  
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/api/users`);
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data.users || data);
      } catch (err) {
        setError(err.message || "Error loading users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" || (u.role || "").toLowerCase() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

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
                {currentUser?.fullName || "Admin"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="px-8 pb-10">
        <div className="max-w-6xl mx-auto pt-8 space-y-6">
          {}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[0.7rem] tracking-[0.23em] uppercase text-slate-400 mb-1">
                User Management
              </p>
              <h1 className="text-2xl font-semibold text-slate-50">
                Admin & citizen accounts
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Review who has access to PhoenixEye, see roles, and keep your
                console secure.
              </p>
            </div>
          </div>

          {}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = roleFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setRoleFilter(f.id)}
                    className={
                      "px-4 py-1.5 rounded-full text-xs font-medium border shadow-sm transition " +
                      (active
                        ? "bg-emerald-500/20 border-emerald-400/80 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10")
                    }
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
              />
            </div>
          </div>

          {}
          {loading && (
            <p className="text-sm text-slate-400 pt-4">
              Loading users from PhoenixEye directory…
            </p>
          )}
          {error && !loading && (
            <p className="text-sm text-rose-400 pt-2">Error: {error}</p>
          )}

          {}
          {!loading && !error && (
            <>
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-slate-400 pt-4">
                  No users found for this filter.
                </p>
              ) : (
                <section className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] overflow-hidden">
                  <div className="grid grid-cols-12 px-6 py-3 text-[0.7rem] font-semibold text-slate-400 border-b border-white/10">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-4">Email</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2 text-right">Joined</div>
                  </div>

                  <ul className="divide-y divide-white/5">
                    {filteredUsers.map((u) => {
                      const joined = u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—";
                      const roleKey = (u.role || "").toLowerCase();
                      const roleClass =
                        ROLE_BADGE[roleKey] || ROLE_BADGE.default;

                      const userInitials =
                        u.fullName
                          ?.split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "?";

                      return (
                        <li
                          key={u._id || u.id}
                          className="px-6 py-3 grid grid-cols-12 items-center hover:bg-white/5/50 transition-colors"
                        >
                          {}
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-emerald-400 flex items-center justify-center text-[0.7rem] font-semibold text-slate-900">
                              {userInitials}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-50">
                                {u.fullName || "Unnamed user"}
                              </span>
                              <span className="text-[0.7rem] text-slate-500">
                                ID: {u._id || u.id || "—"}
                              </span>
                            </div>
                          </div>

                          {}
                          <div className="col-span-4">
                            <p className="text-xs text-slate-200">
                              {u.email || "—"}
                            </p>
                          </div>

                          {}
                          <div className="col-span-2">
                            <span
                              className={
                                "inline-flex items-center px-3 py-1 rounded-full text-[0.7rem] font-medium " +
                                roleClass
                              }
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                              {u.role || "unknown"}
                            </span>
                          </div>

                          {}
                          <div className="col-span-2 text-right">
                            <span className="text-xs text-slate-300">
                              {joined}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

