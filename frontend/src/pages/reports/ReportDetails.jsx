import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet marker icons (Vite)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [assignableDrones, setAssignableDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    const res = await api.get(`/admin/reports/${id}`);
    return res.data;
  };

  const fetchAssignableDrones = async () => {
    const res = await api.get("/admin/drones");
    const list = (res.data || []).filter(
      (d) => d.is_online === true && d.status === "AVAILABLE"
    );
    return list;
  };

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const [r, drones] = await Promise.all([
        fetchReport(),
        fetchAssignableDrones(),
      ]);

      setReport(r);
      setAssignableDrones(drones);

      // لو عنده drone_id مسبقًا، نعرضه (وما نختاره تلقائيًا في select)
      setSelectedDrone("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (status) => {
    try {
      setActionLoading(true);
      await api.patch(`/admin/reports/${id}/status`, { status });
      await load();
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const assignToDrone = async () => {
    if (!selectedDrone) {
      alert("Choose a drone first");
      return;
    }

    try {
      setActionLoading(true);
      await api.patch(`/admin/reports/${id}/status`, {
        status: "ASSIGNED",
        drone_id: selectedDrone,
      });
      await load();
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to assign report");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!report) return null;

  const dateStr = report.createdAt || report.created_at;
  const dateLabel = dateStr ? new Date(dateStr).toLocaleString() : "—";

  const canVerifyOrRemove = report.status === "PENDING";
  const canAssign = report.status === "PENDING" || report.status === "VERIFIED";

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-6 text-[#4ade80]">
        ← Back to Reports
      </button>

      <div className="grid grid-cols-2 gap-8">
        {/* Left: Image */}
        <div className="bg-[#11141c] p-4 rounded-xl">
          {report.image_url ? (
            <img
              src={report.image_url}
              alt="Report"
              className="w-full rounded-xl"
            />
          ) : (
            <p>No Image Available</p>
          )}
        </div>

        {/* Right: Info */}
        <div className="bg-[#11141c] p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-bold text-[#4ade80]">Report Details</h2>

          <p>
            <strong>Status:</strong> <StatusBadge status={report.status} />
          </p>

          <p>
            <strong>Source:</strong> {report.source}
          </p>

          <p>
            <strong>Location:</strong> {report.latitude}, {report.longitude}
          </p>

          <p>
            <strong>Date:</strong> {dateLabel}
          </p>

          <p>
            <strong>Assigned Drone:</strong>{" "}
            {report.drone_id ? report.drone_id : "Not assigned"}
          </p>

          {/* Actions for PENDING */}
          {canVerifyOrRemove && (
            <div className="space-x-4 mt-4">
              <button
                onClick={() => updateStatus("VERIFIED")}
                className="bg-green-500 px-4 py-2 rounded text-black font-semibold"
                disabled={actionLoading}
              >
                Verify
              </button>

              <button
                onClick={() => updateStatus("REMOVED")}
                className="bg-red-500 px-4 py-2 rounded text-black font-semibold"
                disabled={actionLoading}
              >
                Remove
              </button>
            </div>
          )}

          {/* ✅ Assign section (PENDING أو VERIFIED) */}
          {canAssign && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-300">
                <strong>Assign to Drone:</strong>
              </p>

              <div className="flex gap-3 items-center">
                <select
                  className="bg-[#1a1f2b] p-2 rounded w-full"
                  value={selectedDrone}
                  onChange={(e) => setSelectedDrone(e.target.value)}
                  disabled={!assignableDrones.length || actionLoading}
                >
                  <option value="">
                    {assignableDrones.length
                      ? "Select available online drone"
                      : "No available online drones"}
                  </option>

                  {assignableDrones.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={assignToDrone}
                  className="bg-[#4ade80] px-4 py-2 rounded text-black font-semibold"
                  disabled={!assignableDrones.length || !selectedDrone || actionLoading}
                  title={
                    !assignableDrones.length
                      ? "No available online drones"
                      : !selectedDrone
                      ? "Choose a drone first"
                      : "Assign"
                  }
                >
                  Assign
                </button>
              </div>

              <p className="text-xs text-gray-400">
                * Only drones that are <b>ONLINE</b> and <b>AVAILABLE</b> appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-10 bg-[#11141c] p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-[#4ade80]">
          Location Map
        </h3>

        <MapContainer
          center={[report.latitude, report.longitude]}
          zoom={15}
          style={{ height: "400px", borderRadius: "12px" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[report.latitude, report.longitude]}>
            <Popup>Roadkill Report Location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    PENDING: "bg-yellow-500",
    VERIFIED: "bg-green-500",
    ASSIGNED: "bg-blue-500",
    REMOVED: "bg-red-500",
  };

  const cls = colors[status] || "bg-gray-500";

  return (
    <span className={`px-3 py-1 text-xs rounded-full text-black ${cls}`}>
      {status}
    </span>
  );
}

