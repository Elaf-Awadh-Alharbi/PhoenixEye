import { useNavigate } from "react-router-dom";

export default function DroneCreatedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050816] text-slate-50 flex items-center justify-center px-4">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">

        { }
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 
                          flex items-center justify-center text-xl font-bold text-slate-900 
                          shadow-[0_0_25px_rgba(16,185,129,0.7)]">
            ✓
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
              Drone created
            </p>
            <h1 className="text-xl font-semibold text-slate-50">
              New drone added to fleet
            </h1>
          </div>
        </div>

        { }
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          Your new drone has been successfully registered in the PhoenixEye fleet. 
          You can now assign it to roadkill reports or monitor its activity within 
          the Drones Overview panel.
        </p>

        { }
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 
                       text-slate-900 font-semibold shadow-[0_10px_35px_rgba(16,185,129,0.45)]
                       hover:shadow-[0_14px_45px_rgba(16,185,129,0.7)] hover:translate-y-[-1px]
                       transition transform"
            onClick={() => navigate("/drones")}
          >
            View all drones
          </button>

          <button
            className="flex-1 px-4 py-2 rounded-xl border border-white/15 bg-white/5 
                       text-slate-100 font-semibold hover:bg-white/10 transition"
            onClick={() => navigate("/drones/add")}
          >
            Add another drone
          </button>
        </div>

      </div>
    </div>
  );
}

