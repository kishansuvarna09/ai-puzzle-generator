import os
import random

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

# Configure Gemini (expecting GOOGLE_API_KEY in .env)
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")


class PuzzleRequest(BaseModel):
    topic: str


@app.get("/")
def read_root():
    return {"message": "Puzzle API is running"}


@app.post("/generate-puzzle")
def generate_puzzle(request: PuzzleRequest):
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key not configured")

    try:
        topics = [
            "food and cooking", "travel and adventure", "animals", "weather", 
            "sports", "emotions", "work and office", "fantasy", "nature"
        ]

        selected_topic = random.choice(topics)

        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        prompt = f"""
        Pick a common phrase with 2 to 4 words **related to the topic of: {selected_topic}**.
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

        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=1.0,
            ),
        )
        return {"puzzle": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))