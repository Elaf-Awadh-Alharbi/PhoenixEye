import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg mb-2 ${
      location.pathname.startsWith(path)
        ? "bg-emerald-500 text-black"
        : "hover:bg-slate-700"
    }`;

  return (
    <div className="w-64 bg-slate-800 p-5">
      <div className="flex items-center gap-3 mb-8">
        <img src={logo} className="w-10 h-10" />
        <h1 className="text-lg font-bold text-emerald-400">
          Phoenix Eye
        </h1>
      </div>

      <Link to="/dashboard" className={linkClass("/dashboard")}>
        Dashboard
      </Link>

      <Link to="/reports" className={linkClass("/reports")}>
        Reports
      </Link>

      <Link to="/drones" className={linkClass("/drones")}>
        Drones
      </Link>

      <Link to="/analytics" className={linkClass("/analytics")}>
        Analytics
      </Link>
    </div>
  );
}