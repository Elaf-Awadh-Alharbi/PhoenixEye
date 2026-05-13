import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    source: "",
    dateFrom: "",
    dateTo: "",
  });

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/reports", {
        params: {
          ...filters,
          page,
          limit: 10,
        },
      });

      setReports(res.data.data);
      setPages(res.data.pages);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters, page]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/reports/${id}/status`, { status });
      fetchReports();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[#4ade80]">
        Reports Management
      </h1>

      {/* Filters */}
      <div className="bg-[#11141c] p-4 rounded-xl mb-6 grid grid-cols-4 gap-4">
        <select
          className="bg-[#1a1f2b] p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REMOVED">Removed</option>
        </select>

        <select
          className="bg-[#1a1f2b] p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, source: e.target.value })
          }
        >
          <option value="">All Sources</option>
          <option value="CITIZEN">Citizen</option>
          <option value="DRONE">Drone</option>
        </select>

        <input
          type="date"
          className="bg-[#1a1f2b] p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, dateFrom: e.target.value })
          }
        />

        <input
          type="date"
          className="bg-[#1a1f2b] p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, dateTo: e.target.value })
          }
        />
      </div>

      {/* Table */}
      <div className="bg-[#11141c] rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#1a1f2b]">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4">Location</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-800"
                >
                  <td className="p-4">
                    {report.image_url ? (
                      <img
                        src={report.image_url}
                        alt=""
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td className="p-4">
                    {report.source}
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

                  <td className="p-4 space-x-2">
                    <Link
                      to={`/reports/${report.id}`}
                      className="text-blue-400"
                    >
                      View
                    </Link>

                    {report.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(report.id, "VERIFIED")
                          }
                          className="text-green-400"
                        >
                          Verify
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(report.id, "REMOVED")
                          }
                          className="text-red-400"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-[#1a1f2b] rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span>
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-[#1a1f2b] rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    PENDING: "bg-yellow-500",
    VERIFIED: "bg-green-500",
    REMOVED: "bg-red-500",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full text-black ${colors[status]}`}
    >
      {status}
    </span>
  );
}