import { useState } from "react";
import api from "../../services/api";

export default function AddRecord() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const userId = localStorage.getItem("user_id");
      const deviceId = localStorage.getItem("device_id");

      if (!userId) {
        alert("User not found. Please login again.");
        return;
      }

      if (!deviceId) {
        alert("Device not found. Please login again.");
        return;
      }

      const recordData = {
        title: title,
        description: content,
        language: "English",
        release_rights: "creator",
        location: {
          latitude: 17.385,
          longitude: 78.4867,
        },
        media_type: "text",
        file_url: "https://example.com/document.txt",
        file_name: `${title.replace(/\s+/g, "_")}.txt`,
        file_size: 2048,
        status: "pending",
        reviewed: false,
        reviewed_by: null,
        reviewed_at: null,
        source_label: "Corpus Insight Hub",
        source_url: "https://example.com/",
        user_id: userId,
        category_ids: [],
        tagged_usernames: [],
        hashtags: [],
        record_tags: [],
        device_id: deviceId,
      };

      await api.post(
        "/api/v1/records/?generate_file=false&file_size_kb=10",
        recordData
      );

      alert("Record added successfully!");

      setTitle("");
      setContent("");

    } catch (error: any) {
      console.error("Backend Error:", error.response?.data);

      alert(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to add record"
      );
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
        className="bg-white shadow rounded-xl p-6 max-w-2xl space-y-5"
      >
        <div>
          <label className="block mb-2 font-medium">
            Title
          </label>

          <input
            type="text"
            placeholder="Enter document title"
            className="w-full border rounded-lg p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Content
          </label>

          <textarea
            rows={8}
            placeholder="Enter document content"
            className="w-full border rounded-lg p-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Uploading..." : "Upload Record"}
        </button>
      </form>
    </div>
  );
}