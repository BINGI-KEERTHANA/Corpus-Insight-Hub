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
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const recordsResponse = await api.get("/api/v1/records?limit=100");

      console.log("========== FULL RESPONSE ==========");
      console.log(recordsResponse);

      console.log("========== RESPONSE DATA ==========");
      console.log(recordsResponse.data);

      if (Array.isArray(recordsResponse.data)) {
        setRecords(recordsResponse.data);
      } else if (recordsResponse.data.records) {
        setRecords(recordsResponse.data.records);
      } else if (recordsResponse.data.items) {
        setRecords(recordsResponse.data.items);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Records</h1>

        <button
          onClick={fetchRecords}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Language</th>
              <th className="p-3 text-left">Media Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">User</th>
            </tr>
          </thead>

          <tbody>
            {records.length > 0 ? (
              records.map((record) => (
                <tr
                  key={record.uid || record.record_id}
                  className="border-t hover:bg-slate-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/records/${record.uid || record.record_id}`)
                  }
                >
                  <td className="p-3">{record.title || "-"}</td>
                  <td className="p-3">{record.language || "-"}</td>
                  <td className="p-3">{record.media_type || "-"}</td>
                  <td className="p-3">{record.status || "-"}</td>
                  <td className="p-3">{record.username || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-6 text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-gray-600">
        Total Records: <b>{records.length}</b>
      </p>
    </div>
  );
}