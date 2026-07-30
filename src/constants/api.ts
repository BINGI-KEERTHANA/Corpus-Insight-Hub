export const API_BASE_URL = "https://api.corpus.swecha.org";

// The audioquality FastAPI service is a separate application from the corpus API.
export const AUDIO_QUALITY_API_BASE_URL =
  import.meta.env.VITE_AUDIO_QUALITY_API_BASE_URL ??
  "https://audioquality-backend.onrender.com";