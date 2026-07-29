import axios from "axios";
import { AUDIO_QUALITY_API_BASE_URL } from "../constants/api";

/** Exact response contract returned by audioquality's FastAPI POST /analyze. */
interface AudioQualityApiResponse {
  filename: string;
  duration_seconds: number;
  loudness_score: number;
  loudness_classification: "Too Quiet" | "Good" | "Too Loud";
  leading_silence_seconds: number;
  trailing_silence_seconds: number;
  total_silence_seconds: number;
  silence_score: number;
  silence_classification: "Excellent" | "Good" | "Fair" | "Poor";
  noise_score: number;
  noise_level_db: number;
  noise_classification: "Excellent" | "Good" | "Fair" | "Poor";
  clipping_percentage: number;
  clipping_score: number;
  clipping_classification: "Excellent" | "Good" | "Fair" | "Poor";
  overall_quality_score: number;
  recommendation: "Accept" | "Review" | "Re-record";
}

export interface AudioQualityAnalysis {
  filename: string;
  durationSeconds: number;
  overallScore: number;
  loudness: { score: number; classification: string };
  silence: {
    score: number;
    classification: string;
    leadingSeconds: number;
    trailingSeconds: number;
    totalSeconds: number;
  };
  clipping: { score: number; percentage: number; classification: string };
  backgroundNoise: { score: number; levelDb: number; classification: string };
  recommendation: string;
}

const audioQualityApi = axios.create({
  baseURL: AUDIO_QUALITY_API_BASE_URL,
});

function mapAnalysis(response: AudioQualityApiResponse): AudioQualityAnalysis {
  return {
    filename: response.filename,
    durationSeconds: response.duration_seconds,
    overallScore: response.overall_quality_score,
    loudness: {
      score: response.loudness_score,
      classification: response.loudness_classification,
    },
    silence: {
      score: response.silence_score,
      classification: response.silence_classification,
      leadingSeconds: response.leading_silence_seconds,
      trailingSeconds: response.trailing_silence_seconds,
      totalSeconds: response.total_silence_seconds,
    },
    clipping: {
      score: response.clipping_score,
      percentage: response.clipping_percentage,
      classification: response.clipping_classification,
    },
    backgroundNoise: {
      score: response.noise_score,
      levelDb: response.noise_level_db,
      classification: response.noise_classification,
    },
    recommendation: response.recommendation,
  };
}

/** Upload a WAV file to audioquality's FastAPI /analyze endpoint. */
export async function analyzeAudio(file: File): Promise<AudioQualityAnalysis> {
  const formData = new FormData();
  formData.append("file", file);

  // Do not set Content-Type manually: the browser supplies the multipart boundary.
  const response = await audioQualityApi.post<AudioQualityApiResponse>("/analyze", formData);
  return mapAnalysis(response.data);
}
