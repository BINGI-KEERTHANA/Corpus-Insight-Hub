import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Record {
  uid?: string;
  record_id?: string;
  title?: string;
  media_type?: string;
  language?: string;
  status?: string;
  username?: string;
}

export default function Records() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsResponse = await api.get("/api/v1/records/?limit=10");
        setRecords(recordsResponse.data);
      } catch (error) {
        console.error("Failed to fetch records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Records</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Language</th>
              <th className="p-3 text-left">Media</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">User</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr
                key={record.uid ?? record.record_id}
                className="border-t hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate(`/records/${record.uid}`)}
              >
                <td className="p-3">{record.title}</td>
                <td className="p-3">{record.language}</td>
                <td className="p-3">{record.media_type}</td>
                <td className="p-3">{record.status}</td>
                <td className="p-3">{record.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
