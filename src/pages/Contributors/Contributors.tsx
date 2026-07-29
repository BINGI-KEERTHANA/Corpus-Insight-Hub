import { useEffect, useState } from "react";
import { getUsers } from "../../services/api";

interface User {
  id?: number;
  username?: string;
  full_name?: string;
  email?: string;
}

export default function Contributors() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await getUsers();

        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (Array.isArray(res.data.items)) {
          setUsers(res.data.items);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Users API failed", err);
        setError("Unable to load contributors.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading contributors...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Contributors</h1>

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No contributors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user.id ?? index} className="border-t">
                  <td className="p-3">{user.id ?? "-"}</td>
                  <td className="p-3">{user.username ?? "-"}</td>
                  <td className="p-3">{user.full_name ?? "-"}</td>
                  <td className="p-3">{user.email ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}