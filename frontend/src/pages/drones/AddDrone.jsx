import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function AddDronePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    status: "available",
    battery: 100,
    mode: "idle",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "battery") {
      const num = Number(value);
      setForm((prev) => ({
        ...prev,
        battery: Number.isNaN(num) ? 0 : Math.max(0, Math.min(100, num)),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Drone name is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/drones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to create drone");
        return;
      }

      await res.json();
      navigate("/drones/created");
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card card-glow" style={{ maxWidth: 520, width: "100%" }}>
        { }
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="avatar-circle">🛰</div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "var(--text-secondary)",
                }}
              >
                Drone Management
              </div>
              <h1 style={{ fontSize: "1.15rem", margin: 0 }}>Add new drone</h1>
            </div>
          </div>

          <Link
            to="/drones"
            className="btn"
            style={{ paddingInline: "1.2rem", fontSize: "0.8rem" }}
          >
            Back to list
          </Link>
        </div>

        {error && <div className="error-text">{error}</div>}

        <form onSubmit={handleSubmit}>
          { }
          <label className="label">Drone Name</label>
          <input
            type="text"
            name="name"
            className="input"
            placeholder="e.g. Drone A1"
            value={form.name}
            onChange={handleChange}
            required
          />

          { }
          <label className="label">Location</label>
          <input
            type="text"
            name="location"
            className="input"
            placeholder="e.g. Riyadh – Depot A"
            value={form.location}
            onChange={handleChange}
          />

          { }
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "0.25rem",
              marginBottom: "0.75rem",
            }}
          >
            <div style={{ flex: 1 }}>
              <label className="label">Status</label>
              <select
                name="status"
                className="input"
                value={form.status}
                onChange={handleChange}
                style={{ paddingRight: "2rem" }}
              >
                <option value="available">Available</option>
                <option value="busy">On mission</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label className="label">Battery (%)</label>
              <input
                type="number"
                name="battery"
                className="input"
                min={0}
                max={100}
                value={form.battery}
                onChange={handleChange}
              />
            </div>
          </div>

          { }
          <label className="label">Mode</label>
          <select
            name="mode"
            className="input"
            value={form.mode}
            onChange={handleChange}
            style={{ marginBottom: "1rem", paddingRight: "2rem" }}
          >
            <option value="idle">Idle</option>
            <option value="on-mission">On mission</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.25rem" }}
            disabled={loading}
          >
            {loading ? "Creating drone..." : "Create drone"}
          </button>
        </form>
      </div>
    </div>
  );
}
