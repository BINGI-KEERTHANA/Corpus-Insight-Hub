import { useEffect, useState } from "react";
import api from "../../services/api";

interface RecordItem {
  uid: string;
  title: string;
  extracted_text?: any;
  language?: string;
  [key: string]: any;
}

export default function AISummary() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedRecordUid, setSelectedRecordUid] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get("/api/v1/records");
      const data = Array.isArray(response.data) ? response.data : response.data.items || [];
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    }
  };

  // Helper function to decode literal \u00XX or \uXXXX Unicode escapes into readable text
  const decodeUnicode = (str: string) => {
    try {
      return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
    } catch (e) {
      return str;
    }
  };

  const handleSelectRecord = (uid: string) => {
    setSelectedRecordUid(uid);

    const record = records.find((r) => r.uid === uid);

    if (record && record.extracted_text) {
      const extracted = record.extracted_text;
      let rawString = "";

      // Extract raw string from record
      if (extracted.segments && Array.isArray(extracted.segments) && extracted.segments.length > 0) {
        rawString = extracted.segments[0].text || "";
      } else if (extracted.notes) {
        rawString = extracted.notes;
      } else if (typeof extracted === "string") {
        rawString = extracted;
      } else {
        rawString = JSON.stringify(extracted, null, 2);
      }

      // 1. Clean non-printable control codes
      let cleanedText = rawString.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");

      // 2. Decode raw Unicode sequences to actual Indic characters
      cleanedText = decodeUnicode(cleanedText);

      setText(cleanedText || "No extracted text available for this record.");
    } else {
      setText("No extracted text available for this record.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">AI Summary</h1>
      <p className="text-gray-500 mt-2">View extracted text from corpus records.</p>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        {/* Dropdown Selection */}
        <label className="block font-semibold mb-2">Select Record</label>
        <select
          value={selectedRecordUid}
          onChange={(e) => handleSelectRecord(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select a Record</option>

          {records.map((record) => (
            <option key={record.uid} value={record.uid}>
              {record.title}
            </option>
          ))}
        </select>

        {/* Extracted Text Header with Language Badge */}
        <div className="flex justify-between items-center mt-6 mb-2">
          <label className="font-semibold text-gray-800">Extracted Text</label>

          {selectedRecordUid && (
            <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2.5 py-1 rounded">
              Language: {records.find((r) => r.uid === selectedRecordUid)?.language?.toUpperCase() || "N/A"}
            </span>
          )}
        </div>

        <textarea
          rows={14}
          value={text}
          readOnly
          style={{
            fontFamily: "'Telugu Sangam MN', 'Noto Sans Telugu', 'Gisha', 'Mukta Telugu', 'Segoe UI Historic', system-ui, -apple-system, sans-serif",
            fontSize: "16px",
            lineHeight: "1.6"
          }}
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-900 bg-white focus:outline-none shadow-inner"
        />
      </div>
    </div>
  );
}