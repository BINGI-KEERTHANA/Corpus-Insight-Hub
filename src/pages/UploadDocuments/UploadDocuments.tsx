import { useState } from "react";
import api from "../../services/api";

export default function UploadDocuments() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      await api.post("/api/v1/records", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Document uploaded successfully.");
      setFile(null);
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
          "Failed to upload document."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl rounded-xl bg-white shadow-md p-6">

        <h1 className="text-3xl font-bold mb-2">
          Upload Documents
        </h1>

        <p className="text-gray-600 mb-6">
          Upload corpus documents from this page.
        </p>

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
          className="block w-full rounded-lg border border-gray-300 p-3"
        />

        {file && (
          <div className="mt-3 text-sm text-gray-700">
            Selected File:
            <strong> {file.name}</strong>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <div className="mt-5 rounded-lg bg-gray-100 p-3">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}