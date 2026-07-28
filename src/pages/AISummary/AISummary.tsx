import { useEffect, useState } from "react";
import api from "../../services/api";

// 1. Defined Segment interface to avoid 'any'
interface TextSegment {
  text?: string;
}

// 2. Defined ExtractedText structure
interface ExtractedTextObject {
  segments?: TextSegment[];
  text?: string;
  notes?: string;
  summary?: string;
}

// 3. Clean RecordItem interface with no 'any'
interface RecordItem {
  uid: string;
  title: string;
  description?: string;
  media_type?: string;
  extracted_text?: string | ExtractedTextObject | unknown;
  language?: string;
  [key: string]: unknown;
}

// Automatically pulls from your .env file
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// 4. Clean extractRawString function with no 'any'
const extractRawString = (item: RecordItem): string => {
  const candidate =
    item?.extracted_text ??
    (item as Record<string, unknown>)?.extractedText ??
    (item as Record<string, unknown>)?.text ??
    (item as Record<string, unknown>)?.content;

  if (!candidate) return "";

  if (typeof candidate === "string") return candidate;

  if (typeof candidate === "object" && candidate !== null) {
    const obj = candidate as ExtractedTextObject;
    if (Array.isArray(obj.segments) && obj.segments.length > 0) {
      return obj.segments.map((s) => s?.text || "").join(" ");
    }
    return obj.text || obj.notes || obj.summary || "";
  }

  return "";
};

export default function AISummary() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedRecordUid, setSelectedRecordUid] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);

  // 1. Declare fetchRecords FIRST
useEffect(() => {
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/records");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.items || [];
      setRecords(data);
    } catch (error: unknown) {
      console.error("Failed to fetch records:", error);
    } finally {
      setLoading(false);
    }
  };

    fetchRecords();
  }, []);

  // 3. Clean catch block in decodeUnicode
  const decodeUnicode = (str: string) => {
    try {
      return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
    } catch {
      return str;
    }
  };

  const cleanTextContent = (rawString: string): string => {
    if (!rawString) return "";

    let processed = rawString;
    if (processed.startsWith("Sentence:")) {
      processed = processed.replace(/^Sentence:\s*/, "");
    } else if (processed.includes("Sentence:")) {
      processed = processed.replace("Sentence:", "").trim();
    }

    processed = processed.replace(/<\/?[^>]+(>|$)/g, "");
    // eslint-disable-next-line no-control-regex
    processed = processed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");
    return decodeUnicode(processed).trim();
  };

  // Real Google Gemini AI API Call
  const fetchGeminiSummary = async (
    recordTitle: string,
    rawContent: string,
    lang?: string
  ) => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === "") {
      setText(
        "⚠️ Missing API Key: Please check that VITE_GEMINI_API_KEY is set in your .env file."
      );
      return;
    }

    setSummarizing(true);
    setText("🤖 Generating real AI summary via Gemini...");

    try {
      const languageHint =
        lang && lang.toLowerCase() !== "und" ? lang : "Telugu / English";

      const prompt = `You are an expert AI summarizer. Please analyze the following corpus record titled "${recordTitle}" and write a clear, natural summary of its main points and meaning. Write the summary in ${languageHint}.\n\nRaw Text Content:\n"${rawContent}"`;

      // Active supported model endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY.trim()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errData = (await response.json()) as { error?: { message?: string } };
        throw new Error(
          errData?.error?.message || `API error (${response.status})`
        );
      }

      const result = await response.json();
      const aiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiResponse) {
        setText(aiResponse.trim());
      } else {
        setText("Unable to parse summary response from Gemini AI.");
      }
    } catch (error: unknown) { // 5. Fixed catch error type from 'any' to 'unknown'
      console.error("Gemini AI API Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Check network or key settings.";
      setText(`Failed to connect to Gemini AI: ${errorMessage}`);
    } finally {
      setSummarizing(false);
    }
  };

  const handleSelectRecord = (uid: string) => {
    setSelectedRecordUid(uid);

    if (!uid) {
      setText("");
      return;
    }

    const record = records.find((r) => r.uid === uid);

    if (!record) {
      setText("No record available.");
      return;
    }

    let rawString = extractRawString(record);

    if (!rawString.trim() && record.description) {
      rawString = record.description;
    }

    const cleanedText = cleanTextContent(rawString);

    if (cleanedText && cleanedText.length >= 5) {
      fetchGeminiSummary(record.title || "Record", cleanedText, record.language);
    } else {
      setText(
        "No valid text content available to generate a summary for this record."
      );
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageLabel = (record?: RecordItem) => {
    if (!record?.language || record.language.toLowerCase() === "und") {
      return "N/A";
    }
    return record.language.toUpperCase();
  };

  const selectedRecord = records.find((r) => r.uid === selectedRecordUid);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Summary</h1>
      <p className="text-gray-500 mt-2">
        Generate real AI summaries using Google Gemini API.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <label className="block font-semibold mb-2">Select Record</label>
        <select
          value={selectedRecordUid}
          onChange={(e) => handleSelectRecord(e.target.value)}
          disabled={loading || summarizing || records.length === 0}
          className="w-full border rounded-lg p-3 bg-white disabled:bg-gray-100"
        >
          <option value="">
            {loading ? "Loading records..." : "Select a Record"}
          </option>

          {records.map((record, idx) => (
            <option key={record.uid || idx} value={record.uid}>
              {idx + 1}. {record.title || `Record ${idx + 1}`}
            </option>
          ))}
        </select>

        <div className="flex justify-between items-center mt-6 mb-2">
          <label className="font-semibold text-gray-800">
            {summarizing ? "Gemini AI Generating Summary..." : "Generated Summary"}
          </label>

          {selectedRecordUid && (
            <div className="flex items-center gap-3">
              <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2.5 py-1 rounded">
                Language: {getLanguageLabel(selectedRecord)}
              </span>

              <button
                onClick={handleCopy}
                disabled={!text || summarizing}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition disabled:opacity-50"
              >
                {copied ? "Copied!" : "Copy Summary"}
              </button>
            </div>
          )}
        </div>

        <textarea
          rows={14}
          value={text}
          readOnly
          style={{
            fontFamily:
              "'Roboto', 'Noto Sans Telugu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-900 bg-white focus:outline-none shadow-inner"
        />
      </div>
    </div>
  );
}