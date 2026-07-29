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

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

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
  const [isCooldown, setIsCooldown] = useState(false);

  // Reusable fetchRecords function to allow manual or event-driven updates
  const fetchRecords = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/records", { signal });
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.items || [];

      setRecords(data);
    } catch (error: unknown) {
      // Safely check if request was aborted/cancelled
      const isCanceled =
        axios.isCancel(error) ||
        (error as { name?: string })?.name === "CanceledError" ||
        (error as { code?: string })?.code === "ERR_CANCELED";

      if (!isCanceled) {
        console.error("Failed to fetch records:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    // Initial load on component mount
    fetchRecords(controller.signal);

    // Auto refresh list when switching back to this tab/window
    const onFocus = () => fetchRecords();
    window.addEventListener("focus", onFocus);

    return () => {
      controller.abort();
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchRecords]);

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

  const fetchGeminiSummary = async (targetLang: "TE" | "EN") => {
    if (!selectedRecordUid) return;

    const apiKey = GEMINI_API_KEY.trim();
    if (!apiKey) {
      setText(
        "⚠️ Missing API Key: Please check that VITE_GEMINI_API_KEY is set in your .env file."
      );
      setHasSubmitted(true);
      return;
    }

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

    if (!cleanedText || cleanedText.length < 5) {
      setText("No valid text content available to generate a summary.");
      setHasSubmitted(true);
      return;
    }

    setSummarizing(true);
    setHasSubmitted(true);

    const maxRetries = 3;
    let attempt = 0;
    let success = false;
    const baseDelayMs = 5000; // Wait 5 seconds on first rate limit hit

    while (attempt <= maxRetries && !success) {
      try {
        if (attempt === 0) {
          setText("🤖 Generating AI summary via Gemini 3.6 Flash...");
        }

        const languageText = targetLang === "TE" ? "Telugu" : "English";

        const prompt = `You are an expert AI summarizer. Please analyze the following corpus record titled "${record.title || "Record"}" and write a clear, natural summary of its main points and meaning. Strictly write the summary in ${languageText}.\n\nRaw Text Content:\n"${cleanedText}"`;

        // Using exactly Gemini 3.6 Flash as requested
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
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
          const status = response.status;
          const errData = (await response.json().catch(() => ({}))) as {
            error?: { message?: string };
          };
          const errMessage = errData?.error?.message || `API error (${status})`;

          // Trigger automatic retry if we hit Free Tier Rate limit (429)
          if ((status === 429 || errMessage.toLowerCase().includes("quota")) && attempt < maxRetries) {
            attempt++;
            const waitTime = baseDelayMs * Math.pow(1.5, attempt - 1); // Exponential backoff (5s, 7.5s, 11s)
            setText(
              `⏳ Rate limit reached. Auto-retrying in ${Math.round(waitTime / 1000)}s... (Attempt ${attempt}/${maxRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue; // Loop back and try the fetch again
          }

          throw new Error(errMessage);
        }

        const result = await response.json();
        const aiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResponse) {
          setText(aiResponse.trim());
        } else {
          setText("Unable to parse summary response from Gemini AI.");
        }
        
        success = true; // Mark as successful to break out of the retry loop
        
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Check network or key settings.";

        // Fallback for network-level drops that register as rate-limiting text
        if (
          errorMessage.includes("Quota exceeded") ||
          errorMessage.includes("429") ||
          errorMessage.includes("limit")
        ) {
          if (attempt < maxRetries) {
            attempt++;
            const waitTime = baseDelayMs * Math.pow(1.5, attempt - 1);
            setText(`⏳ Rate limit reached. Auto-retrying in ${Math.round(waitTime / 1000)}s... (Attempt ${attempt}/${maxRetries})`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          } else {
            setText(
              "⏳ Free Tier Rate Limit Reached. Max auto-retries exceeded. Please wait 30–60 seconds and click 'Get Summary' again."
            );
          }
        } else {
          setText(`Failed to connect to Gemini AI: ${errorMessage}`);
        }
        break; // Unrecoverable error (like a bad API key or no internet), exit loop immediately
      }
    }

    setSummarizing(false);
  };

  const handleGetSummaryClick = () => {
    if (isCooldown || summarizing || !selectedRecordUid) return;

    fetchGeminiSummary(selectedLang);

    // Disable button for 10 seconds after click to protect rate limit quota
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 10000);
  };

  const handleSelectRecord = (uid: string) => {
    setSelectedRecordUid(uid);
    // Hide previous summary output when choosing a new record
    setHasSubmitted(false);
    setText("");
  };

  const handleLanguageToggle = (lang: "TE" | "EN") => {
    setSelectedLang(lang);
    // Re-generate in the new language if summary is currently visible
    if (hasSubmitted && selectedRecordUid && !isCooldown) {
      fetchGeminiSummary(lang);
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
        Generate real AI summaries using Google Gemini 3.6 Flash.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <div className="flex justify-between items-center mb-2">
          <label className="block font-semibold">Select Record</label>
          <button
            type="button"
            onClick={() => fetchRecords()}
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
            disabled={!selectedRecordUid || summarizing || isCooldown}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition shadow"
          >
            {summarizing
              ? "Generating..."
              : isCooldown
              ? "Wait a few seconds..."
              : "Get Summary"}
          </button>
        </div>

        {/* Summary Container: Completely hidden until user clicks 'Get Summary' */}
        {hasSubmitted && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-800">
                {summarizing
                  ? "Gemini AI Generating Summary..."
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
                  "'Roboto', 'Noto Sans Telugu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-900 bg-white focus:outline-none shadow-inner"
            />
          </div>
        )}
      </div>
    </div>
  );
}