import { useEffect, useState } from "react";
import {
  getRecords,
  getLanguages,
  getCategories,
} from "../../services/api";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface AnalyticsData {
  records: number;
  languages: number;
  categories: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    records: 0,
    languages: 0,
    categories: 0,
  });

  const [languageChart, setLanguageChart] = useState<any[]>([]);
  const [mediaChart, setMediaChart] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [recordsRes, languagesRes, categoriesRes] =
          await Promise.all([
            getRecords(),
            getLanguages(),
            getCategories(),
          ]);


        const records = Array.isArray(recordsRes.data)
          ? recordsRes.data
          : recordsRes.data.items || [];

        const languages = Array.isArray(languagesRes.data)
          ? languagesRes.data
          : languagesRes.data.items || [];

        const categories = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : categoriesRes.data.items || [];

        setData({
          records: records.length,
          languages: languages.length,
          categories: categories.length,
        });

        // Records by Language
        const langCount: Record<string, number> = {};

        records.forEach((record: any) => {
          const lang =
            record.language ||
            record.language_name ||
            "Unknown";

          langCount[lang] = (langCount[lang] || 0) + 1;
        });

        const langChart = Object.entries(langCount).map(
          ([name, value]) => ({
            name,
            value,
          })
        );

        setLanguageChart(langChart);

        // Media Type Distribution
        const mediaCount: Record<string, number> = {};

        records.forEach((record: any) => {
          const media = record.media_type || "Unknown";

          mediaCount[media] = (mediaCount[media] || 0) + 1;
        });

        const mediaData = Object.entries(mediaCount).map(
          ([name, value]) => ({
            name,
            value,
          })
        );

        setMediaChart(mediaData);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Analytics Dashboard
      </h1>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 text-sm">
            Total Records
          </h2>
          <p className="text-4xl font-bold mt-2">
            {data.records}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 text-sm">
            Languages
          </h2>
          <p className="text-4xl font-bold mt-2">
            {data.languages}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 text-sm">
            Categories
          </h2>
          <p className="text-4xl font-bold mt-2">
            {data.categories}
          </p>
        </div>

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Bar Chart */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Records by Language
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={languageChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Pie Chart */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Media Type Distribution
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={mediaChart}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {mediaChart.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}