import { addActivity } from "../../utils/activity";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AddRecord() {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [languages] = useState([
  "English",
  "Telugu",
  "Hindi",
  "Tamil",
  "Kannada",
  "Malayalam",
]);

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
    if (title.trim().length < 8) {
  setTitleError("Title must contain at least 8 characters.");
  return;
}
if (description.trim().length < 20) {
  setDescriptionError("Description must contain at least 20 characters.");
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

      setSuccessMessage("✅ Record added successfully!");
      setTimeout(() => {
  setSuccessMessage("");
}, 3000);

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
        {successMessage && (
  <div className="bg-green-100 text-green-700 border border-green-400 p-3 rounded-lg">
    {successMessage}
  </div>
)}
        <div>
          <label className="block font-medium mb-2">
            Title
          </label>

          <input
  type="text"
  required
  className="w-full border rounded-lg p-3"
  value={title}
  onChange={(e) => {
    const value = e.target.value;
    setTitle(value);

    if (value.length > 0 && value.length < 8) {
      setTitleError("Title must contain at least 8 characters.");
    } else {
      setTitleError("");
    }
  }}
  placeholder="Enter at least 8 characters"
/>

{titleError && (
  <p className="text-red-500 text-sm mt-1">
    {titleError}
  </p>
)}
        </div>

        <div>
          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
  rows={5}
  required
  className="w-full border rounded-lg p-3"
  value={description}
  onChange={(e) => {
    const value = e.target.value;
    setDescription(value);

    if (value.length > 0 && value.length < 20) {
      setDescriptionError("Description must contain at least 20 characters.");
    } else {
      setDescriptionError("");
    }
  }}
  placeholder="Enter description"
/>

{descriptionError && (
  <p className="text-red-500 text-sm mt-1">
    {descriptionError}
  </p>
)}
<p className="text-sm text-gray-500 text-right mt-1">
  {description.length}/500 characters
</p>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Language
          </label>

          <select
          required
  className="w-full border rounded-lg p-3"
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
>
  <option value="">Select Language</option>

  {languages.map((lang) => (
    <option key={lang} value={lang}>
      {lang}
    </option>
  ))}
</select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Category
          </label>

          <select
          required
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