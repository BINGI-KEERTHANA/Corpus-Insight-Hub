import { useEffect, useState } from "react";
import { getHealth } from "../../services/api";

interface HealthData {
  status: string;
}

export default function ServerHealth() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await getHealth();
        setHealth(res.data);
      } catch (err) {
        console.error("Health API failed", err);
        setHealth(null);
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
  }, []);

  if (loading) {
    return <div className="p-6">Loading server health...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Server Health</h1>

      {health ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 mb-2">Status</h2>

          <p
            className={`text-2xl font-bold ${
              health.status === "healthy"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {health.status}
          </p>
        </div>
      ) : (
        <p className="text-red-600">Unable to load server health.</p>
      )}
    </div>
  );
}