import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <div className="h-16 bg-slate-800 flex items-center justify-between px-6 border-b border-slate-700">
      <h2 className="text-lg font-semibold text-emerald-400">
        Control Center
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm">{user?.email}</span>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded-md text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}