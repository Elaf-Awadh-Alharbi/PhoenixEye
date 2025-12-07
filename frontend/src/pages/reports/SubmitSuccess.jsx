import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function SubmitSuccessPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials =
    user?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PE";

  return (
    <div className="min-h-screen bg-[#050816] text-slate-50">
      {}
      <header className="px-8 pt-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-[#050816]/90 border border-white/10 px-6 py-3 flex items-center justify-between shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 flex items-center justify-center text-xs font-bold text-slate-900 shadow-[0_0_25px_rgba(16,185,129,0.7)]">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold tracking-wide text-sm">
                  PhoenixEye Citizen Portal
                </span>
                <span className="text-[0.7rem] text-slate-400">
                  Thank you for helping keep roads safer
                </span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="text-slate-400">Logged in as</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-emerald-200 font-medium mt-0.5">
                {user?.fullName || "Citizen"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="px-8 pb-10">
        <div className="max-w-3xl mx-auto pt-10">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-[0_18px_45px_rgba(15,23,42,0.9)] text-center space-y-6">
            {}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.7)]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-9 h-9 text-slate-900"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M9.00039 16.2002L4.80039 12.0002L3.40039 13.4002L9.00039 19.0002L21.0004 7.0002L19.6004 5.6002L9.00039 16.2002Z"
                  />
                </svg>
              </div>
            </div>

            {}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-slate-50">
                Report submitted successfully
              </h1>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Our PhoenixEye operations team will review your report and
                dispatch a drone or clean‑up unit if needed.{" "}
                <span className="text-emerald-300">
                  Thank you for taking the time to protect other drivers.
                </span>
              </p>
            </div>

            {}
            <p className="text-xs text-slate-500">
              You can close this page, or submit another report if you noticed
              more than one incident.
            </p>

            {}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Link
                to="/submit-report"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_12px_40px_rgba(16,185,129,0.6)] hover:shadow-[0_16px_48px_rgba(16,185,129,0.8)] hover:translate-y-[-1px] active:translate-y-0 transition"
              >
                Submit another report
              </Link>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/10 transition"
              >
                Back to sign in
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
