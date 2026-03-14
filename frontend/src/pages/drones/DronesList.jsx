import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function DronesList() {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [onlineFilter, setOnlineFilter] = useState("ALL"); // ALL | ONLINE | OFFLINE

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDroneName, setNewDroneName] = useState("");
  const [creating, setCreating] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDrones = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/drones");
      setDrones(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load drones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrones();

    // optional: auto refresh
    const t = setInterval(fetchDrones, 5000);
    return () => clearInterval(t);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/drones/${id}/status`, { status });
      fetchDrones();
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to update drone status");
    }
  };

  const launchDrone = async (id) => {
    try {
      await api.patch(`/admin/drones/${id}/launch`);
      fetchDrones();
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to launch drone");
    }
  };

  const createDrone = async () => {
    const name = newDroneName.trim();
    if (!name) return;

    try {
      setCreating(true);
      await api.post("/admin/drones", { name });
      setIsCreateOpen(false);
      setNewDroneName("");
      fetchDrones();
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to create drone");
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/admin/drones/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchDrones();
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to delete drone");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return (drones || []).filter((d) => {
      // search by name
      if (query && !(d.name || "").toLowerCase().includes(query)) return false;

      // status filter
      if (statusFilter !== "ALL" && d.status !== statusFilter) return false;

      // online filter
      if (onlineFilter === "ONLINE" && !d.is_online) return false;
      if (onlineFilter === "OFFLINE" && d.is_online) return false;

      return true;
    });
  }, [drones, q, statusFilter, onlineFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-phoenix-accent">
          Drone Management
        </h1>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-phoenix-accent text-black px-4 py-2 rounded-lg font-semibold"
        >
          + Add Drone
        </button>
      </div>

      {/* Filters */}
      <div className="bg-phoenix-card rounded-xl p-4 mb-4 glow">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name..."
            className="bg-[#1a1f2b] p-2 rounded w-full md:w-1/3"
          />

          <div className="flex gap-3">
            <select
              className="bg-[#1a1f2b] p-2 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="IN_MISSION">IN_MISSION</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>

            <select
              className="bg-[#1a1f2b] p-2 rounded"
              value={onlineFilter}
              onChange={(e) => setOnlineFilter(e.target.value)}
            >
              <option value="ALL">All Connectivity</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>

            <button
              onClick={fetchDrones}
              className="bg-[#1a1f2b] px-4 py-2 rounded border border-phoenix-border"
              title="Refresh"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-phoenix-card rounded-xl overflow-hidden glow">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#1a1f2b]">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Online</th>
                <th className="p-4">Battery</th>
                <th className="p-4">Location</th>
                <th className="p-4">Last Seen</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((drone) => {
                const lat = drone.last_latitude;
                const lon = drone.last_longitude;

                const battery = drone.battery ?? null;
                const isCritical = battery !== null && Number(battery) < 20;

                return (
                  <tr key={drone.id} className="border-b border-phoenix-border">
                    <td className="p-4 font-semibold">{drone.name}</td>

                    <td className="p-4">
                      <DroneStatusBadge status={drone.status} />
                    </td>

                    <td className="p-4">
                      <OnlineBadge isOnline={!!drone.is_online} />
                    </td>

                    <td className="p-4">
                      {battery == null ? (
                        "—"
                      ) : (
                        <span>
                          {battery}%
                          {isCritical && (
                            <span className="text-red-400 ml-2">⚠ Low</span>
                          )}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {lat != null && lon != null
                        ? `${Number(lat).toFixed(3)}, ${Number(lon).toFixed(3)}`
                        : "—"}
                    </td>

                    <td className="p-4">
                      {drone.last_seen_at
                        ? new Date(drone.last_seen_at).toLocaleString()
                        : "—"}
                    </td>

                    <td className="p-4 space-x-3">
                      <Link to={`/drones/${drone.id}`} className="text-blue-400">
                        View
                      </Link>

                      <select
                        className="bg-[#1a1f2b] p-1 rounded"
                        onChange={(e) => updateStatus(drone.id, e.target.value)}
                        value={drone.status}
                        title="Admin status control"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="IN_MISSION">IN_MISSION</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                        <option value="OFFLINE">OFFLINE</option>
                      </select>

                      <button
                        onClick={() => launchDrone(drone.id)}
                        className="text-phoenix-accent"
                        disabled={drone.status !== "AVAILABLE"}
                        title={
                          drone.status !== "AVAILABLE"
                            ? "Drone must be AVAILABLE to launch"
                            : "Launch drone"
                        }
                      >
                        Launch
                      </button>

                      <button
                        onClick={() => setDeleteTarget(drone)}
                        className="text-red-400"
                        title="Delete drone"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-gray-400" colSpan={7}>
                    No drones found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      {isCreateOpen && (
        <Modal title="Add Drone" onClose={() => !creating && setIsCreateOpen(false)}>
          <div className="space-y-3">
            <input
              value={newDroneName}
              onChange={(e) => setNewDroneName(e.target.value)}
              placeholder="Drone name (e.g., Drone Alpha 02)"
              className="w-full bg-[#1a1f2b] p-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="bg-[#1a1f2b] px-4 py-2 rounded"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={createDrone}
                className="bg-phoenix-accent text-black px-4 py-2 rounded font-semibold"
                disabled={creating || !newDroneName.trim()}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal title="Confirm Delete" onClose={() => !deleting && setDeleteTarget(null)}>
          <p className="text-sm text-gray-300">
            Are you sure you want to delete <span className="font-semibold">{deleteTarget.name}</span>?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setDeleteTarget(null)}
              className="bg-[#1a1f2b] px-4 py-2 rounded"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded font-semibold"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DroneStatusBadge({ status }) {
  const colors = {
    AVAILABLE: "bg-green-500 text-black",
    IN_MISSION: "bg-phoenix-accent text-black",
    MAINTENANCE: "bg-yellow-500 text-black",
    OFFLINE: "bg-gray-500 text-white",
    UNKNOWN: "bg-slate-600 text-white",
  };

  const cls = colors[status] || colors.UNKNOWN;
  return (
    <span className={`px-3 py-1 text-xs rounded-full ${cls}`}>
      {status || "UNKNOWN"}
    </span>
  );
}

function OnlineBadge({ isOnline }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          isOnline ? "bg-green-400" : "bg-gray-500"
        }`}
      />
      <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0f1420] border border-phoenix-border rounded-xl w-[92%] max-w-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}