import { useEffect, useState } from "react";
import api from "../../services/api";

interface User {
  username: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/v1/auth/me");
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-red-600">
        Failed to load profile.
      </div>
    );
  }

  return (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-6">My Profile</h1>

    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">

      <div className="flex items-center gap-6 mb-8">

        <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-gray-500 text-sm">Full Name</p>
          <p className="font-semibold">{user.full_name ?? "-"}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Role</p>
          <p className="font-semibold">{user.role}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Joined</p>
          <p className="font-semibold">{user.created_at}</p>
        </div>

      </div>

    </div>
  </div>
);
}