import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  Languages,
  Folder,
  Calendar,
  User,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        🧠 LexiHub
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/search" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
              <Search size={20} />
              Search
            </Link>
          </li>

          <li>
            <Link to="/records" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
              <FileText size={20} />
              Records
            </Link>
          </li>

          <li>
            <Link to="/languages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
              <Languages size={20} />
              Languages
            </Link>
          </li>

          <li>
            <Link to="/categories" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
              <Folder size={20} />
              Categories
            </Link>
          </li>


          <li>
            <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
              <User size={20} />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}