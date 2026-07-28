import { addActivity } from "../../utils/activity";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AddRecord() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/v1/categories/");
      console.log(response.data); // Add this line
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchCategories();
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !language || !category) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/v1/records/", {
  title,
  description,
  language,
  media_type: "text",
  release_rights: "creator",
  category_ids: [category],
  location: {
    latitude: 17.385,
    longitude: 78.4867,
  },
  user_id: "27e49c9e-472c-417b-9830-0c53b69654e9",
});
      addActivity(`Added record "${title}"`);

      alert("Record added successfully!");

      setTitle("");
      setDescription("");
      setLanguage("");
      setCategory("");
    } catch (error) {
      console.error(error);
      alert("Failed to add record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Add Record
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 max-w-xl space-y-5"
      >
        <div>
          <label className="block font-medium mb-2">
            Title
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
            rows={5}
            className="w-full border rounded-lg p-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Language
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="English"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Category
          </label>

          <select
  className="w-full border rounded-lg p-3"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="">Select Category</option>

  {categories.map((item: any) => (
    <option key={item.id} value={item.id}>
      {item.title}
    </option>
  ))}
</select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Record"}
        </button>
      </form>
    </div>
  );
}