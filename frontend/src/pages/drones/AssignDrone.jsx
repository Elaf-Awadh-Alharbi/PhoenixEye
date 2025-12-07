import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function AssignDronePage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [drones, setDrones] = useState([]);
  const [selectedDroneId, setSelectedDroneId] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const [reportRes, dronesRes] = await Promise.all([
          fetch(`${API_BASE}/api/reports/${reportId}`),
          fetch(`${API_BASE}/api/drones`),
        ]);

        if (!reportRes.ok) {
          throw new Error("Failed to load report");
        }
        if (!dronesRes.ok) {
          throw new Error("Failed to load drones");
        }

        const reportData = await reportRes.json();
        const dronesData = await dronesRes.json();

        setReport(reportData);
        setDrones(dronesData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [reportId]);

  const handleAssign = async () => {
    if (!selectedDroneId) {
      setError("Please select a drone to assign");
      return;
    }
    if (!report) return;

    const drone = drones.find((d) => String(d.id) === String(selectedDroneId));
    if (!drone) {
      setError("Selected drone not found");
      return;
    }

    setAssigning(true);
    setError("");

    try {
    
      const reportRes = await fetch(
        `${API_BASE}/api/reports/${report.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "assigned",
            assignedDroneId: drone.id,
            assignedDroneName: drone.name,
          }),
        }
      );

      if (!reportRes.ok) {
        const data = await reportRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update report");
      }

      const droneRes = await fetch(
        `${API_BASE}/api/drones/${drone.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "busy",
            mode: "on-mission",
            lastReportId: report.id,
          }),
        }
      );

      if (!droneRes.ok) {
        const data = await droneRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update drone");
      }
      navigate("/reports");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error assigning drone");
    } finally {
      setAssigning(false);
    }
  };

  const availableDrones = drones.filter(
    (d) => d.status === "available" || d.status === "idle"
  );

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
                Assign Drone
              </div>
              <h1 style={{ fontSize: "1.15rem", margin: 0 }}>
                Link a drone to this report
              </h1>
            </div>
          </div>

          <Link
            to="/reports"
            className="btn"
            style={{ paddingInline: "1.2rem", fontSize: "0.8rem" }}
          >
            Back to reports
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Loading report & drones…
          </p>
        ) : error ? (
          <div className="error-text">{error}</div>
        ) : !report ? (
          <p style={{ color: "var(--text-secondary)" }}>Report not found.</p>
        ) : (
          <>
            { }
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                borderRadius: 12,
                background: "#181c30",
                border: "1px solid var(--border)",
                fontSize: "0.88rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Report ID
                  </div>
                  <div style={{ fontWeight: 600 }}>#{report.id}</div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Status
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.1rem 0.7rem",
                      borderRadius: 999,
                      background: "#252b3f",
                      fontSize: "0.8rem",
                    }}
                  >
                    {report.status || "pending"}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "0.4rem" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Title
                </div>
                <div>{report.title}</div>
              </div>

              <div style={{ marginBottom: "0.4rem" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Description
                </div>
                <div style={{ color: "var(--text-secondary)" }}>
                  {report.description}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Location
                </div>
                <div style={{ color: "var(--text-secondary)" }}>
                  {report.location || "—"}
                </div>
              </div>
            </div>

            { }
            <div style={{ marginBottom: "1rem" }}>
              <label className="label">Select a drone to assign</label>
              {availableDrones.length === 0 ? (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  No available drones at the moment. Try again later or free one
                  from the Drones page.
                </p>
              ) : (
                <select
                  className="input"
                  value={selectedDroneId}
                  onChange={(e) => setSelectedDroneId(e.target.value)}
                >
                  <option value="">Choose a drone…</option>
                  {availableDrones.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.location || "Unknown location"} (Battery:{" "}
                      {d.battery}%)
                    </option>
                  ))}
                </select>
              )}
            </div>

            { }
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleAssign}
                disabled={assigning || !availableDrones.length}
              >
                {assigning ? "Assigning..." : "Assign drone"}
              </button>

              <button
                className="btn"
                style={{ flex: 1 }}
                onClick={() => navigate("/drones")}
              >
                View drone fleet
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



