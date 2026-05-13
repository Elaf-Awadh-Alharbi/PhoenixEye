import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function DroneDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drone, setDrone] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [droneRes, reportsRes, statsRes] = await Promise.all([
        api.get(`/admin/drones/${id}`),
        api.get(`/admin/drones/${id}/reports`),
        api.get(`/admin/drones/${id}/stats`)
      ]);

      setDrone(droneRes.data);
      setReports(reportsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!drone) return <p>Drone not found</p>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-phoenix-accent"
      >
        ← Back to Drones
      </button>

      {/* Header Info */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card title="Drone Name" value={drone.name} />
        <Card title="Status" value={<DroneStatusBadge status={drone.status} />} />
        <Card
          title="Total Missions"
          value={stats?.totalReports || 0}
        />
      </div>

      {/* Map */}
      {drone.last_latitude && drone.last_longitude && (
        <div className="bg-phoenix-card p-4 rounded-xl mb-10">
          <h3 className="text-lg font-semibold mb-4 text-phoenix-accent">
            Current Location
          </h3>

          <MapContainer
            center={[drone.last_latitude, drone.last_longitude]}
            zoom={15}
            style={{ height: "400px", borderRadius: "12px" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[drone.last_latitude, drone.last_longitude]}>
              <Popup>{drone.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-phoenix-card rounded-xl overflow-hidden glow">
        <h3 className="p-4 text-lg font-semibold text-phoenix-accent">
          Assigned Reports
        </h3>

        <table className="w-full text-left">
          <thead className="bg-[#1a1f2b]">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Status</th>
              <th className="p-4">Location</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  No reports assigned
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-phoenix-border"
                >
                  <td className="p-4">
                    {report.image_url ? (
                      <img
                        src={report.image_url}
                        alt=""
                        className="w-14 h-14 object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-4">
                    <StatusBadge status={report.status} />
                  </td>

                  <td className="p-4">
                    {report.latitude.toFixed(3)},{" "}
                    {report.longitude.toFixed(3)}
                  </td>

                  <td className="p-4">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Card({ title, value }) {
  return (
    <div className="bg-phoenix-card p-6 rounded-xl text-center glow">
      <p className="text-gray-400 mb-2">{title}</p>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function DroneStatusBadge({ status }) {
  const colors = {
    AVAILABLE: "bg-green-500 text-black",
    ACTIVE: "bg-phoenix-accent text-black",
    IN_MAINTENANCE: "bg-yellow-500 text-black",
    DISABLED: "bg-red-500 text-white",
    OFFLINE: "bg-gray-500 text-white",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}

function StatusBadge({ status }) {
  const colors = {
    PENDING: "bg-yellow-500 text-black",
    VERIFIED: "bg-green-500 text-black",
    REMOVED: "bg-red-500 text-white",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}