import { useEffect, useState } from "react";
import api from "../services/api";

interface Event {
  uid?: string;
  name?: string;
  title?: string;
  description?: string;
  active?: boolean;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/v1/events/");
        console.log(response.data);
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Active</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event, index) => (
              <tr
                key={event.uid ?? index}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3">{event.name ?? "-"}</td>
                <td className="p-3">{event.title ?? "-"}</td>
                <td className="p-3">
                  {event.active ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}