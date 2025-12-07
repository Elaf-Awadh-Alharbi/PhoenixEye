import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api";

const STATUS_LABELS = {
  available: "Available",
  busy: "On mission",
  maintenance: "Maintenance",
};

export default function DroneDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drone, setDrone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDrone() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/drones/${id}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load drone");
        }

        const data = await res.json();
        setDrone(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading drone");
      } finally {
        setLoading(false);
      }
    }

    loadDrone();
  }, [id]);

  const handleBack = () => {
    navigate("/drones");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "#00f2a6";
      case "busy":
        return "#facc15";
      case "maintenance":
        return "#f97316";
      default:
        return "#e5e7eb";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="card"
          style={{ maxWidth: 420, width: "100%", textAlign: "center" }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Loading drone details…
          </p>
        </div>
      </div>
    );
  }

  if (error || !drone) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="card"
          style={{ maxWidth: 420, width: "100%", textAlign: "center" }}
        >
          <p className="error-text">
            {error || "Drone not found or removed."}
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "0.75rem" }}
            onClick={handleBack}
          >
            Back to drones
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = STATUS_LABELS[drone.status] || drone.status || "Unknown";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card card-glow" style={{ maxWidth: 720, width: "100%" }}>
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
                Drone Details
              </div>
              <h1 style={{ fontSize: "1.15rem", margin: 0 }}>
                {drone.name || "Unnamed drone"}
              </h1>
            </div>
          </div>

          <button
            className="btn"
            style={{ paddingInline: "1.2rem", fontSize: "0.8rem" }}
            onClick={handleBack}
          >
            Back to drones
          </button>
        </div>

        { }
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              padding: "0.8rem 1rem",
              borderRadius: 12,
              background: "#181c30",
              border: "1px solid var(--border)",
              fontSize: "0.85rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginBottom: "0.2rem",
              }}
            >
              Drone ID
            </div>
            <div style={{ fontWeight: 600 }}>#{drone.id}</div>
          </div>

          <div
            style={{
              padding: "0.8rem 1rem",
              borderRadius: 12,
              background: "#181c30",
              border: "1px solid var(--border)",
              fontSize: "0.85rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginBottom: "0.2rem",
              }}
            >
              Status
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.15rem 0.7rem",
                borderRadius: 999,
                background: "#252b3f",
                color: "#e5e7eb",
                fontSize: "0.8rem",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "999px",
                  background: getStatusColor(drone.status),
                }}
              />
              {statusLabel}
            </div>
          </div>

          <div
            style={{
              padding: "0.8rem 1rem",
              borderRadius: 12,
              background: "#181c30",
              border: "1px solid var(--border)",
              fontSize: "0.85rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginBottom: "0.2rem",
              }}
            >
              Battery
            </div>
            <div style={{ fontWeight: 600 }}>{drone.battery}%</div>
            <div
              style={{
                marginTop: "0.35rem",
                height: 6,
                borderRadius: 999,
                background: "#111827",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(drone.battery, 100)}%`,
                  height: "100%",
                  borderRadius: 999,
                  background:
                    drone.battery > 60
                      ? "linear-gradient(90deg,#00f2a6,#1cb5e0)"
                      : drone.battery > 25
                      ? "#facc15"
                      : "#f97316",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          </div>
        </div>

        { }
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.5fr)",
            gap: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          { }
          <div
            style={{
              padding: "1rem",
              borderRadius: 12,
              background: "#181c30",
              border: "1px solid var(--border)",
              fontSize: "0.88rem",
            }}
          >
            <div style={{ marginBottom: "0.6rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                }}
              >
                Current mode
              </div>
              <div style={{ fontWeight: 500 }}>
                {drone.mode || "idle"}
              </div>
            </div>

            <div style={{ marginBottom: "0.6rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                }}
              >
                Location
              </div>
              <div style={{ color: "var(--text-secondary)" }}>
                {drone.location || "No location set"}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                }}
              >
                Last assigned report
              </div>
              {drone.lastReportId ? (
                <Link
                  to={`/reports/${drone.lastReportId}`}
                  style={{
                    color: "var(--text-accent)",
                    fontSize: "0.85rem",
                    textDecoration: "underline",
                  }}
                >
                  View report #{drone.lastReportId}
                </Link>
              ) : (
                <div style={{ color: "var(--text-secondary)" }}>
                  Not assigned to any report yet.
                </div>
              )}
            </div>
          </div>

          { }
          <div
            style={{
              padding: "1rem",
              borderRadius: 12,
              background: "#181c30",
              border: "1px solid var(--border)",
              fontSize: "0.85rem",
            }}
          >
            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                marginBottom: "0.75rem",
              }}
            >
              Quick actions
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                className="btn btn-primary"
                style={{ width: "100%", fontSize: "0.85rem" }}
                onClick={() => navigate("/drones")}
              >
                Back to fleet overview
              </button>

              <button
                className="btn"
                style={{ width: "100%", fontSize: "0.85rem" }}
                onClick={() => navigate("/reports")}
              >
                View incoming reports
              </button>

              {drone.lastReportId && (
                <button
                  className="btn"
                  style={{
                    width: "100%",
                    fontSize: "0.85rem",
                    marginTop: 4,
                  }}
                  onClick={() =>
                    navigate(`/assign-drone/${drone.lastReportId}`)
                  }
                >
                  Reassign to another drone
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

