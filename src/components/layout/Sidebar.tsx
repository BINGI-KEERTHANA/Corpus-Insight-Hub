import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  Languages,
  Folder,
  User,
  Upload,
  PlusCircle,
  BarChart3,
  Users,
  Sparkles,
  Activity,
  AudioLines,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        🧠 Corpus Insight Hub
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
            <Link
              to="/audio-quality"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
            >
              <AudioLines size={20} />
              Audio Quality
            </Link>
          </li>

          <li>
            <Link
              to="/upload"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
            >
              <Upload size={20} />
              Upload Documents
            </Link>
          </li>
          <li>
            <Link
              to="/add-record"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
            >
              <PlusCircle size={20} />
              Add Record
            </Link>
          </li> 

          <li>
            <Link
              to="/analytics"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
            >
              <BarChart3 size={20} />
              Analytics
            </Link>
          </li>


          <li>
              <Link
                to="/ai-summary"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
              >
                <Sparkles size={20} />
                AI Summary
              </Link>
          </li>

          <li>
            <Link
              to="/server-health"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
            >
              <Activity size={20} />
              Server Health
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
