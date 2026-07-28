import { useState } from "react";
import api from "../../services/api";

export default function AddRecord() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/v1/records/", {
        title,
        content,
      });

      alert("Record added successfully!");

      setTitle("");
      setContent("");
    } catch (error) {
      console.error(error);
      alert("Failed to add record");
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
          <label>Title</label>
          <input
            className="w-full border rounded-lg p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Content</label>
          <textarea
            rows={6}
            className="w-full border rounded-lg p-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}