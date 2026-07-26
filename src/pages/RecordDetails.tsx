import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

interface RecordData {
  title: string;
  description: string;
  media_type: string;
  language: string;
  status: string;
  username: string;
  created_at: string;
}

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState<RecordData | null>(null);

useEffect(() => {
  const fetchRecord = async () => {
    try {
      const response = await api.get(`/api/v1/records/${id}`);
      console.log(response.data);
      setRecord(response.data);
    } catch (error) {
      console.error("Failed to fetch record:", error);
    }
  };

  fetchRecord();
}, [id]);

  return (
    <div className="p-8">
        <button
          onClick={() => navigate("/records")}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ← Back to Records
        </button>
      <h1 className="text-3xl font-bold">Record Details</h1>

      {record && (
  <div className="mt-6 bg-white shadow rounded-xl p-6 space-y-4">
    <p><strong>Title:</strong> {record.title}</p>
    <p><strong>Description:</strong> {record.description}</p>
    <p><strong>Media Type:</strong> {record.media_type}</p>
    <p><strong>Language:</strong> {record.language}</p>
    <p><strong>Status:</strong> {record.status}</p>
    <p><strong>Uploaded By:</strong> {record.username}</p>
    <p>
  <strong>Created At:</strong>{" "}
  {new Date(record.created_at).toLocaleString()}
</p>
  </div>
)}
    </div>
  );
}