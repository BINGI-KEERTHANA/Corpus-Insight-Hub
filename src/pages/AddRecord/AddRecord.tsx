// src/pages/AddRecord.tsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";

interface CategoryItem {
  id?: string | number;
  uid?: string | number;
  _id?: string | number;
  title?: string;
  name?: string;
}

export default function AddRecord() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/v1/categories/");
        if (isMounted) {
          const data = Array.isArray(response.data)
            ? response.data
            : response.data?.items || [];
          setCategories(data);
        }
      } catch (error: unknown) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !language.trim() || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/v1/records/", {
        title: title.trim(),
        description: description.trim(),
        language: language.trim(),
        media_type: "text",
        release_rights: "creator",
        category_ids: [category],
        location: {
          latitude: 17.385,
          longitude: 78.4867,
        },
        user_id: "27e49c9e-472c-417b-9830-0c53b69654e9",
      });

      alert("Record added successfully!");

      setTitle("");
      setDescription("");
      setLanguage("");
      setCategory("");
    } catch (error: unknown) {
      console.error("Failed to submit record:", error);
      alert("Failed to add record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Add Record</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 max-w-xl space-y-5"
      >
        <div>
          <label htmlFor="record-title" className="block font-medium mb-2">
            Title
          </label>
          <input
            id="record-title"
            type="text"
            className="w-full border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>

        <div>
          <label htmlFor="record-description" className="block font-medium mb-2">
            Description
          </label>
          <textarea
            id="record-description"
            rows={5}
            className="w-full border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>

        <div>
          <label htmlFor="record-language" className="block font-medium mb-2">
            Language
          </label>
          <input
            id="record-language"
            type="text"
            className="w-full border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g., Telugu, English"
            required
          />
        </div>

        <div>
          <label htmlFor="record-category" className="block font-medium mb-2">
            Category
          </label>
          <select
            id="record-category"
            className="w-full border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((item, idx) => {
              const val = String(item.id || item.uid || item._id || idx);
              const name = item.title || item.name || `Category ${idx + 1}`;
              return (
                <option key={val} value={val}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow"
        >
          {loading ? "Adding..." : "Add Record"}
        </button>
      </form>
    </div>
  );
}