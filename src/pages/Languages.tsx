import { useEffect, useState } from "react";
import api from "../services/api";

interface Language {
  uid?: string;
  language_id?: string;
  name?: string;
  code?: string;
}

export default function Languages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await api.get("/api/v1/languages");
        setLanguages(response.data);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
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
      <h1 className="text-3xl font-bold mb-6">Languages</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Language</th>
              <th className="p-3 text-left">Code</th>
            </tr>
          </thead>

          <tbody>
            {languages.map((language, index) => (
              <tr
                key={language.uid ?? language.language_id ?? index}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3">{language.name ?? "-"}</td>
                <td className="p-3">{language.code ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}