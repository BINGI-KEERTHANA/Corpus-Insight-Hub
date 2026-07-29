import { addActivity } from "../../utils/activity";
import { useState } from "react";
import api from "../../services/api";

interface Record {
  uid?: string;
  record_id: string;
  title?: string;
  language?: string;
  media_type?: string;
  status?: string;
  username?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRecords = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // Search records (returns only record IDs)
      const searchResponse = await api.get(
        `/api/v1/records/search?query=${encodeURIComponent(query)}&limit=10`
      );

      // Fetch complete record details
      const fullRecords = await Promise.all(
        searchResponse.data.map(async (item: { record_id: string }) => {
          const response = await api.get(
            `/api/v1/records/${item.record_id}`
          );
          return response.data;
        })
      );


      setRecords(fullRecords);
      addActivity(`Searched for "${query}"`);
    } catch (error) {
      console.error("Search failed:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Search Records</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search records..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
        />

        <button
          onClick={searchRecords}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
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
              {records.map((record, index) => (
               <tr
                 key={`${record.uid ?? record.record_id ?? "record"}-${index}`}
                 className="border-t hover:bg-slate-50"
              >
                  <td className="p-3">{record.title ?? "-"}</td>
                  <td className="p-3">{record.language ?? "-"}</td>
                  <td className="p-3">{record.media_type ?? "-"}</td>
                  <td className="p-3">{record.status ?? "-"}</td>
                  <td className="p-3">{record.username ?? "-"}</td>
                </tr>
              ))}

              {!loading && records.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 py-6"
                  >
                    Search for a record to see results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}