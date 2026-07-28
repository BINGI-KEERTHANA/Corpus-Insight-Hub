import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")

if not api_key:
    print("WARNING: GEMINI_API_KEY not found in environment!")
    client = None
else:
    client = genai.Client(api_key=api_key)

def generate_summary(text: str) -> str:
    if not text.strip():
        return "No text provided to summarize."

    if not client:
        return "Error generating AI summary: GEMINI_API_KEY is missing in your .env file."

    prompt = (
        "You are an expert summarizer. Summarize the following text clearly and concisely, "
        "highlighting the key points:\n\n"
        f"{text}"
    )

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Error generating AI summary: {str(e)}"