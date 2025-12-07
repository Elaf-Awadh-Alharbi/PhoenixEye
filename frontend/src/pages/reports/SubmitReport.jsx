import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import MapSelector from "../../components/MapSelector";
import API from "../../api"; 

const API_BASE = API; 

export default function SubmitReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initials =
    user?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PE";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    
    if (name === "latitude" || name === "longitude") {
      setCoords((prev) => ({
        lat:
          name === "latitude"
            ? parseFloat(value) || prev?.lat || 0
            : prev?.lat ?? 0,
        lng:
          name === "longitude"
            ? parseFloat(value) || prev?.lng || 0
            : prev?.lng ?? 0,
      }));
    }
  };

  const handleMapSelect = (pos) => {
   
    setCoords(pos);
    setForm((prev) => ({
      ...prev,
      latitude: pos.lat.toString(),
      longitude: pos.lng.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.location) {
      setError("Please fill in title, description, and location.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/submitReport.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          location: form.location,
          latitude: form.latitude || null,
          longitude: form.longitude || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to submit report");
      }

      navigate("/submit-success");
    } catch (err) {
      console.error(err);
      setError(err.message || "Network error while submitting report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-50">
      {/* Header */}
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
                  Submit a roadkill or hazard report
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

      {/* Main */}
      <main className="px-8 pb-10">
        <div className="max-w-3xl mx-auto pt-8 space-y-6">
          {/* Intro */}
          <section className="space-y-2">
            <p className="text-[0.7rem] tracking-[0.25em] uppercase text-slate-400">
              Submit report
            </p>
            <h1 className="text-2xl font-semibold text-slate-50">
              Help keep roads safer with PhoenixEye
            </h1>
            <p className="text-sm text-slate-400">
              Share details about roadkill or hazards you notice. Our team uses
              this data to send drones and clean-up units to the right place.
            </p>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {/* Form */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Dead cat on main highway near exit 8"
                  className="w-full rounded-xl bg-[#050816]/60 border border-white/15 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the animal, exact spot, nearby landmarks, and any risk to drivers."
                  className="w-full rounded-xl bg-[#050816]/60 border border-white/15 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300 resize-y"
                  required
                />
              </div>

              {/* Location text */}
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1.5">
                  Location (text)
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Riyadh – Northern Ring Road, near exit 8 (right lane)"
                  className="w-full rounded-xl bg-[#050816]/60 border border-white/15 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300"
                  required
                />
                <p className="mt-1 text-[0.7rem] text-slate-500">
                  Use street names, exits, and landmarks so our team can locate
                  it quickly.
                </p>
              </div>

              {/* Map */}
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-medium text-slate-200">
                  Location on map (optional)
                </label>
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#050816]/60">
                  <MapSelector onLocationSelect={handleMapSelect} />
                </div>
                <p className="text-[0.7rem] text-slate-500">
                  Selected coords:{" "}
                  {coords
                    ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                    : "No location selected yet"}
                </p>
              </div>

              {/* Lat / Lng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1.5">
                    Latitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="24.7117"
                    className="w-full rounded-xl bg-[#050816]/60 border border-white/15 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1.5">
                    Longitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="46.6753"
                    className="w-full rounded-xl bg-[#050816]/60 border border-white/15 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_12px_40px_rgba(16,185,129,0.6)] hover:shadow-[0_16px_48px_rgba(16,185,129,0.8)] hover:translate-y-[-1px] active:translate-y-0 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting report…" : "Submit report"}
                </button>

                <p className="text-[0.7rem] text-slate-500">
                  By submitting, you help PhoenixEye teams keep highways safer
                  for everyone.
                </p>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}