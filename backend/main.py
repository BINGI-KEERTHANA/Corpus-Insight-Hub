from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.ai import generate_summary

app = FastAPI(title="LexiHub AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SummaryRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {"message": "LexiHub AI Backend Running"}


@app.post("/summarize")
def summarize(request: SummaryRequest):
    summary = generate_summary(request.text)

    return {
        "summary": summary
    }