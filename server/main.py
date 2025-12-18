import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("MODEL_API_KEY")
model_base_url = os.getenv("MODEL_BASE_URL", "https://api.model.com")

client = None
if api_key:
    client = OpenAI(api_key=api_key, base_url=model_base_url)
else:
    print("Warning: MODEL_API_KEY not found in environment variables.")


class PuzzleRequest(BaseModel):
    topic: str


@app.get("/")
def read_root():
    return {"message": "Puzzle API is running"}


@app.post("/generate-puzzle")
def generate_puzzle(request: PuzzleRequest):
    if not client:
        raise HTTPException(status_code=500, detail="API Key not configured")

    try:

        prompt = f"""
        Pick a common phrase with 2 to 4 words **related to the topic of: {request.topic}**.
        Convert it entirely into Emojis that represent the sounds or meanings of the words.
        Example: "Raining cats and dogs" -> 🌧️ 🐱 🐶

        Return a JSON object with exactly two fields:
        
        1. "word": the word or phrase.
        2. "svg": an SVG code string that provides a clever visual clue using Emojis.

        SVG STYLE RULES:
        - Use viewBox="0 0 300 300" (DO NOT set fixed width/height attributes on the <svg> tag)
        - Must include a full background rectangle: 
          <rect width="300" height="300" fill="black" />
        - All shapes/text must use:
          - fill="white"
          - stroke="white" (if applicable)
          - font-family="Arial"
          - font-weight="bold"
          - text-anchor="middle"
          - font-size between 30–40 if using text

        OUTPUT FORMAT:
        Return ONLY JSON with the keys 'word' and 'svg'.
        """
        model_name = os.getenv("MODEL_NAME", "john-doe-1.0")

        response = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            temperature=1.0,
            stream=False,
        )
        return {"puzzle": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))