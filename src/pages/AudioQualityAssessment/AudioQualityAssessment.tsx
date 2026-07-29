import { useRef, useState } from "react";
import { AxiosError } from "axios";
import {
  AudioLines,
  CheckCircle2,
  FileAudio,
  LoaderCircle,
  Upload,
} from "lucide-react";
import {
  analyzeAudio,
  type AudioQualityAnalysis,
} from "../../services/audioQuality";

function displayNumber(value: number) {
  return value.toFixed(2);
}

export default function AudioQualityAssessment() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AudioQualityAnalysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectFile = (selectedFile?: File) => {
    setError("");
    setAnalysis(null);

    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith(".wav")) {
      setFile(null);
      setError("Please choose a WAV (.wav) audio file.");
      return;
    }
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Choose a WAV file before running the assessment.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(await analyzeAudio(file));
    } catch (requestError) {
      const axiosError = requestError as AxiosError<{ detail?: string }>;
      setError(
        axiosError.response?.data?.detail ??
          "The audio analysis could not be completed. Check that the audioquality service is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <AudioLines size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Audio Quality Assessment</h1>
            <p className="mt-1 text-gray-500">Upload a WAV file to measure its recording quality.</p>
          </div>
        </div>
      </div>

      <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800">Upload audio</h2>
          <p className="mt-1 text-sm text-gray-500">Only WAV files are supported for this assessment.</p>

          <input
            ref={inputRef}
            type="file"
            accept="audio/wav,.wav"
            className="hidden"
            onChange={(event) => selectFile(event.target.files?.[0])}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-5 flex w-full flex-col items-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 px-5 py-10 text-center transition-colors hover:border-indigo-500 hover:bg-indigo-100"
          >
            <Upload className="mb-3 text-indigo-600" size={34} />
            <span className="font-semibold text-indigo-700">Choose a WAV file</span>
            <span className="mt-1 text-sm text-gray-500">Select a recording from your computer</span>
          </button>

          {file && (
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm">
              <FileAudio className="shrink-0 text-indigo-600" size={22} />
              <span className="min-w-0 truncate font-medium text-gray-700">{file.name}</span>
              <span className="ml-auto shrink-0 text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading && <LoaderCircle className="animate-spin" size={19} />}
            {loading ? "Analyzing audio..." : "Analyze audio"}
          </button>

          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800">Assessment results</h2>
          {!analysis ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center text-gray-500">
              <AudioLines className="mb-3 text-gray-300" size={42} />
              <p>Your audio metrics will appear here after analysis.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div className="rounded-xl bg-indigo-600 p-5 text-white">
                <p className="text-sm font-medium text-indigo-100">Overall score</p>
                <p className="mt-1 text-4xl font-extrabold">{displayNumber(analysis.overallScore)}</p>
                <p className="mt-1 text-sm text-indigo-100">
                  {analysis.filename} · {displayNumber(analysis.durationSeconds)} seconds
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Loudness</p>
                  <p className="mt-1 text-xl font-bold text-gray-800">{displayNumber(analysis.loudness.score)}</p>
                  <p className="mt-1 text-sm text-gray-500">{analysis.loudness.classification}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Silence</p>
                  <p className="mt-1 text-xl font-bold text-gray-800">{displayNumber(analysis.silence.score)}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {analysis.silence.classification} · {displayNumber(analysis.silence.totalSeconds)} sec total
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Clipping</p>
                  <p className="mt-1 text-xl font-bold text-gray-800">{displayNumber(analysis.clipping.score)}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {analysis.clipping.classification} · {displayNumber(analysis.clipping.percentage)}% clipped
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Background Noise</p>
                  <p className="mt-1 text-xl font-bold text-gray-800">{displayNumber(analysis.backgroundNoise.score)}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {analysis.backgroundNoise.classification} · {displayNumber(analysis.backgroundNoise.levelDb)} dB
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Silence: {displayNumber(analysis.silence.leadingSeconds)} sec leading, {displayNumber(analysis.silence.trailingSeconds)} sec trailing.
              </p>

              <div className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={21} />
                <div>
                  <p className="font-semibold text-green-800">Recommendation</p>
                  <p className="mt-1 text-sm text-green-700">{analysis.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
