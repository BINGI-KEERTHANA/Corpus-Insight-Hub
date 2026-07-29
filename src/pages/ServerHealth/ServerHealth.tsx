import { useEffect, useState } from "react";
import { getHealth } from "../../services/api";

export default function ServerHealth() {
  const [status, setStatus] = useState("Checking...");
  const [apiStatus, setApiStatus] = useState("Connecting...");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);

    const start = performance.now();

    try {
      const res = await getHealth();

      const end = performance.now();

      setStatus(res.data.status || "Healthy");
      setApiStatus("Connected");
      setResponseTime(Math.round(end - start));
      setLastChecked(new Date().toLocaleString());
    } catch (error) {
      console.error("Health API failed:", error);

      setStatus("Unavailable");
      setApiStatus("Disconnected");
      setResponseTime(null);
      setLastChecked(new Date().toLocaleString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Server Health</h1>

        <button
          onClick={fetchHealth}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Server Status */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Server Status</p>

          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                status.toLowerCase() === "healthy"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>

            <h2
              className={`text-2xl font-bold ${
                status.toLowerCase() === "healthy"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {status}
            </h2>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">API Status</p>

          <h2
            className={`text-2xl font-bold ${
              apiStatus === "Connected"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {apiStatus}
          </h2>
        </div>

        {/* Response Time */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Response Time</p>

          <h2 className="text-2xl font-bold text-blue-600">
            {responseTime !== null ? `${responseTime} ms` : "--"}
          </h2>
        </div>

        {/* Last Checked */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Last Checked</p>

          <h2 className="text-lg font-semibold">
            {lastChecked || "--"}
          </h2>
        </div>

        {/* Environment */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 mb-2">Environment</p>

          <h2 className="text-2xl font-bold text-indigo-600">
            Production
          </h2>
        </div>

      </div>
    </div>
  );
}