import { useEffect, useState } from "react";
import {
  Database,
  Languages,
  Folder,
  CalendarDays,
  Search,
  FileText,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface UserData {
  name: string;
  username: string;
  email: string;
  phone: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalLanguages, setTotalLanguages] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalEvents, setTotalEvents] = useState<string | number>("N/A");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/v1/auth/me");
        setUser(response.data);
        const recordsResponse = await api.get("/api/v1/records?limit=10");
        setTotalRecords(recordsResponse.data.length);
        const languagesResponse = await api.get("/api/v1/languages");
        setTotalLanguages(languagesResponse.data.length);
        const categoriesResponse = await api.get("/api/v1/categories");
        setTotalCategories(categoriesResponse.data.length);
        try{
        const eventsResponse = await api.get("/api/v1/events");
        setTotalEvents(eventsResponse.data.length);
      } 
      catch {
        console.log("Events API not accessible");
        setTotalEvents("N/A");
      }
    }
      catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const cards = [
  {
    title: "Records",
    value: totalRecords,
    icon: <Database size={28} />,
    color: "bg-blue-600",
  },
  {
    title: "Languages",
    value: totalLanguages,
    icon: <Languages size={28} />,
    color: "bg-green-600",
  },
  {
    title: "Categories",
    value: totalCategories,
    icon: <Folder size={28} />,
    color: "bg-orange-500",
  },
  {
    title: "Events",
    value: totalEvents,
    icon: <CalendarDays size={28} />,
    color: "bg-purple-600",
  },
];

  return (
    <div className="min-h-screen bg-gray-100 p-8">

    {/* Header */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800">
      Dashboard
    </h1>

    <p className="mt-2 text-gray-500">
      Manage and explore corpus resources efficiently.
    </p>
  </div>

      {/* User Card */}
      {user && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
    <User className="text-white" size={24} />
  </div>

  <div>
    <h2 className="text-2xl font-bold text-gray-800">
      Your Profile
    </h2>

    <p className="text-gray-500">
      Logged in as {user.name}
    </p>
  </div>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-semibold">{user.username}</p>
            </div>

            
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  {cards.map((card, index) => (
    <div
      key={index}
      className={`${card.color} text-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
    >
      <div className="flex justify-between items-start">

        <div>
          <p className="text-white/90 text-xl font-semibold">
              {card.title}
          </p>

          <h2 className="text-5xl font-extrabold mt-4 text-white">
              {card.value}
          </h2>
        </div>

        <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center">
          {card.icon}
        </div>

      </div>
    </div>
  ))}
</div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <button
            onClick={() => navigate("/search")}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 text-left hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300"
          >
            <Search className="text-blue-500 mb-3" size={34} />
            <h3 className="font-bold text-lg">Search Records</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Search records using keywords.
            </p>
          </button>

          <button
            onClick={() => navigate("/records")}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 text-left hover:shadow-xl hover:-translate-y-1 hover:border-green-500 transition-all duration-300"
          >
            <FileText className="text-green-500 mb-3" size={34} />
            <h3 className="font-bold text-lg">View Records</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Browse all corpus records.
            </p>
          </button>

          <button
            onClick={() => navigate("/languages")}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 text-left hover:shadow-xl hover:-translate-y-1 hover:border-orange-500 transition-all duration-300"
          >
            <Languages className="text-orange-500 mb-3" size={34} />
            <h3 className="font-bold text-lg">Languages</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Explore available languages.
            </p>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 text-left hover:shadow-xl hover:-translate-y-1 hover:border-purple-500 transition-all duration-300"
          >
            <User className="text-purple-500 mb-3" size={34} />
            <h3 className="font-bold text-lg">Profile</h3>
            <p className="text-gray-500 mt-2 text-sm">
              View your profile details.
            </p>
          </button>

        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-4">
          <li className="border-b pb-3">
            ✅ Logged in successfully
          </li>

          <li className="border-b pb-3">
            📄 Accessed Records
          </li>

          <li className="border-b pb-3">
            🔍 Opened Search Module
          </li>

          <li>
            👤 Viewed User Dashboard
          </li>
        </ul>
      </div>

    </div>
  );
}