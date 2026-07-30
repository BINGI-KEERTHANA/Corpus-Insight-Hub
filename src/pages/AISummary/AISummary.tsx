import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

interface TextSegment {
  text?: string;
}

interface ExtractedTextObject {
  segments?: TextSegment[];
  text?: string;
  notes?: string;
  summary?: string;
}

interface RecordItem {
  uid: string;
  title: string;
  description?: string;
  media_type?: string;
  extracted_text?: string | ExtractedTextObject | unknown;
  language?: string;
  [key: string]: unknown;
}

// Master topic pool defined outside component to prevent ESLint hook dependency issues
const TOPIC_POOL = [
  // --- Programming Languages ---
  "Python Programming Language",
  "JavaScript Core Concepts",
  "TypeScript Type System",
  "C++ Memory Management & OOP",
  "Java Virtual Machine & Ecosystem",
  "Rust Memory Safety & Concurrency",
  "Go Programming Language",
  "SQL Database Query Optimization",
  "PHP Web Development",
  "Swift iOS Application Development",
  "Kotlin Android Architecture",

  // --- Linguistics & Corpus Research ---
  "Global English Accents & Phonetics",
  "Indian English Pronunciation Patterns",
  "Telugu Dialectal Variations in Rayalaseema",
  "Acoustic Phonetics & Vowel Formants",
  "Spoken Corpus Analysis Methods",
  "Speech Recognition Dataset Structure",
  "Natural Language Processing in Multilingual Contexts",
  "Regional Dialect Mapping in South India",
  "Phonetic Transcription Standards",
  "Voice Activity Detection in Audio Corpora",
  "Hyderabadi Spoken Telugu Corpus",
  "Bilingual Speech Synthesis Research",

  // --- Computer Science & Technology ---
  "Artificial Intelligence in Healthcare",
  "Quantum Computing Principles",
  "Machine Learning Algorithm Optimization",
  "Renewable Energy Systems",
  "Space Exploration and Mars Missions",
  "Global Climate Change Impact",
  "Cybersecurity and Data Encryption",
  "Telugu Literature and Cultural History",
  "Indian Economy & Digital Banking",
  "Neuroscience and Human Brain Mapping",
  "Robotics and Automation Technology",
  "Computer Vision & Pattern Recognition",
];

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
  const [selectedLang, setSelectedLang] = useState<"TE" | "EN">("TE");
  const [text, setText] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper to attach dynamic shuffled topics to database records
  const processRecordData = useCallback((rawData: RecordItem[]) => {
    const shuffledTopics = [...TOPIC_POOL].sort(() => Math.random() - 0.5);

    return rawData.map((record: RecordItem, index: number) => ({
      ...record,
      title: `${shuffledTopics[index % shuffledTopics.length]}`,
    }));
  }, []);

  // Handler for manual "Refresh List" button clicks
  const handleRefreshList = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/records");
      const rawData = Array.isArray(response.data)
        ? response.data
        : response.data.items || [];

      const cleanedData = processRecordData(rawData);
      setRecords(cleanedData);

      setSelectedRecordUid(""); // Reset selection on manual refresh
      setText("");
      setHasSubmitted(false);
    } catch (error: unknown) {
      console.error("Failed to refresh records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch effect on component mount
  useEffect(() => {
    const controller = new AbortController();

    const loadInitialRecords = async () => {
      try {
        const response = await api.get("/api/v1/records", {
          signal: controller.signal,
        });
        const rawData = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];

        const cleanedData = processRecordData(rawData);
        setRecords(cleanedData);
      } catch (error: unknown) {
        const isCanceled =
          axios.isCancel(error) ||
          (error as { name?: string })?.name === "CanceledError" ||
          (error as { code?: string })?.code === "ERR_CANCELED" ||
          (error as { message?: string })?.message === "canceled" ||
          (error as { message?: string })?.message === "Request aborted";

        // Suppress initial StrictMode cancellation warnings
        if (!isCanceled) {
          console.error("Failed to fetch initial records:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialRecords();

    return () => {
      controller.abort();
    };
  }, [processRecordData]);

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

  const formatRecordTitle = (title: string): string => {
    if (!title) return "Untitled Record";
    return title.trim();
  };

  // Calls FastAPI Backend Endpoint (/summarize)
  const fetchBackendSummary = async (targetLang: "TE" | "EN") => {
    if (!selectedRecordUid) return;

    const record = records.find((r) => r.uid === selectedRecordUid);
    if (!record) {
      setText("No record available.");
      setHasSubmitted(true);
      return;
    }

    let rawString = extractRawString(record);
    if (!rawString.trim() && record.description) {
      rawString = record.description;
    }

    const cleanedText = cleanTextContent(rawString);

    setSummarizing(true);
    setHasSubmitted(true);
    setText(
      targetLang === "TE"
        ? "🤖 సారాంశం తయారు చేయబడుతోంది..."
        : "🤖 Generating AI summary..."
    );

    try {
      const languageString = targetLang === "TE" ? "telugu" : "english";

      // Direct axios call to local backend (bypasses default API base URL / interceptors)
      const response = await axios.post(
        "http://127.0.0.1:8000/summarize",
        {
          text: cleanedText,
          language: languageString,
          title: record.title || "Corpus Record",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = response.data;
      let summaryResult = "";

      if (typeof resData?.summary === "string") {
        summaryResult = resData.summary;
      } else if (Array.isArray(resData?.summary) && resData.summary.length > 0) {
        summaryResult =
          resData.summary[0]?.summary_text || resData.summary[0] || "";
      } else if (
        typeof resData?.summary === "object" &&
        resData?.summary !== null
      ) {
        summaryResult =
          resData.summary.summary_text || JSON.stringify(resData.summary);
      } else if (typeof resData === "string") {
        summaryResult = resData;
      }

      if (summaryResult.trim()) {
        setText(summaryResult.trim());
      } else {
        setText("Unable to parse summary from backend.");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to connect to backend service.";
      setText(`Error generating summary: ${errorMessage}`);
    } finally {
      setSummarizing(false);
    }
  };

  const handleGetSummaryClick = () => {
    if (summarizing || !selectedRecordUid) return;
    fetchBackendSummary(selectedLang);
  };

  const handleSelectRecord = (uid: string) => {
    setSelectedRecordUid(uid);
    setHasSubmitted(false);
    setText("");
  };

  const handleLanguageToggle = (lang: "TE" | "EN") => {
    setSelectedLang(lang);
    if (selectedRecordUid) {
      fetchBackendSummary(lang);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Summary</h1>
      <p className="text-gray-500 mt-2">
        Generate AI summaries via Hugging Face backend.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <div className="flex justify-between items-center mb-2">
          <label className="block font-semibold">Select Record</label>
          <button
            type="button"
            onClick={handleRefreshList}
            disabled={loading || summarizing}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 transition"
          >
            {loading ? "Refreshing..." : "🔄 Refresh List"}
          </button>
        </div>

        {/* Record Dropdown */}
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
              {idx + 1}. {formatRecordTitle(record.title || `Record ${idx + 1}`)}
            </option>
          ))}
        </select>

        {/* Language Controls & Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-700">
              Language:
            </span>
            <button
              type="button"
              onClick={() => handleLanguageToggle("TE")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                selectedLang === "TE"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Telugu (తెలుగు)
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle("EN")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                selectedLang === "EN"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              English
            </button>
          </div>

          <button
            type="button"
            onClick={handleGetSummaryClick}
            disabled={!selectedRecordUid || summarizing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition shadow"
          >
            {summarizing ? "Generating..." : "Get Summary"}
          </button>
        </div>

        {/* Output Container */}
        {hasSubmitted && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-800">
                {summarizing
                  ? "Generating Summary via Backend..."
                  : "Generated Summary"}
              </label>

              <button
                onClick={handleCopy}
                disabled={!text || summarizing}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition disabled:opacity-50"
              >
                {copied ? "Copied!" : "Copy Summary"}
              </button>
            </div>

            <textarea
              rows={12}
              value={text}
              readOnly
              style={{
                fontFamily:
                  "'Noto Sans Telugu', 'Mandali', 'Gautami', 'Roboto', sans-serif",
                fontSize: "16px",
                lineHeight: "1.8",
              }}
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-900 bg-white focus:outline-none shadow-inner"
            />
          </div>
        )}
      </div>
    </div>
  );
}