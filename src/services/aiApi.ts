import axios from "axios";

const aiApi = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function generateSummary(text: string): Promise<string> {
  try {
    const response = await aiApi.post("/summarize", { text });
    return response.data.summary;
  } catch (error) {
    console.error("Error connecting to FastAPI backend:", error);
    return "Failed to connect to backend summarizer on http://127.0.0.1:8000. Ensure uvicorn is running.";
  }
}

export default aiApi;