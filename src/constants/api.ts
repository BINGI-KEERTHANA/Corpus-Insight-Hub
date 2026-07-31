export const API_BASE_URL = "https://api.corpus.swecha.org";

// The audioquality FastAPI service is a separate application from the corpus API.
// Set VITE_AUDIO_QUALITY_API_BASE_URL in .env when it is hosted elsewhere.
export const AUDIO_QUALITY_API_BASE_URL =
  import.meta.env.VITE_AUDIO_QUALITY_API_BASE_URL ??
  "https://audioquality-backend.onrender.com";
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://ai-summary-backend-fs46.onrender.com";
