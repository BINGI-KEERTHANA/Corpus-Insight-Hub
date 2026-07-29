import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, UserCircle } from "lucide-react";
import api from "../../services/api";

interface User {
  username: string;
}

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const response = await api.get("/api/v1/user", {
          signal: controller.signal,
        });
        if (isMounted) {
          setUser(response.data);
        }
      } catch (error: unknown) {
        // 1. Ignore React cancellation aborts
        const isCanceled =
          axios.isCancel(error) ||
          (error as { name?: string })?.name === "CanceledError" ||
          (error as { code?: string })?.code === "ERR_CANCELED";

        if (isCanceled) return;

        // 2. Ignore 404 (Endpoint doesn't exist yet or user not logged in)
        if ((error as { response?: { status?: number } })?.response?.status === 404) {
          if (isMounted) setUser(null);
          return;
        }

        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Corpus Insight Hub
        </h1>
        <p className="text-sm text-gray-500">
          Manage, explore and analyze corpus resources from one place.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={22} />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle size={30} />
          <span className="font-medium">
            {user?.username || "User"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}