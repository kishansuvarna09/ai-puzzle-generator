import os

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
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        prompt = f"""You are a REBUS puzzle generator.

Return a JSON object with exactly two fields:

1. "word": the idiom or common phrase related to the topic: {request.topic}
2. "svg": an SVG code string that provides a clever visual clue WITHOUT revealing the answer directly.

GLOBAL RULES:
- Background MUST ALWAYS be solid black.
- All shapes and text MUST ALWAYS be white.
- Use only: <svg>, <rect>, <circle>, <polygon>, <line>, <path>, <text>.
- You may NOT write the idiom or phrase itself in the SVG. You may use:
  - A single keyword from the idiom (e.g., “TIP” for “Tip of the Iceberg”), OR
  - Shapes/icons constructed from polygons/lines (preferred)

ALLOWED CLUE STYLES (USE ANY THAT FIT THE IDIOM):
1. **Positional clues**
   - Top = high
   - Bottom = low
   - Center = average
   - Between, rising, falling, etc.

2. **Merged or interleaved text clues**
   - e.g., “HAHANDND” for “Hand in Hand”.

3. **Arrow-based clues**
   - e.g., >>>>, ↑, ↓, or arrow-shaped polygons.

4. **Size-based clues**
   - small vs big shapes to indicate scale.

5. **Shape icons (important)**
   Use polygons/lines to create icons such as:
   - Iceberg
   - Mountain
   - Heart
   - Drop
   - Arrow
   - Wave
   - Box
   - Triangle clusters
   - Any abstract shape representing meaning

6. **Fragmented/broken shapes**
   - Split polygons
   - Separated rectangles
   - Broken lines
   - Ideal for “break”, “split”, “tear”, “crack”

SVG STYLE RULES:
- width="300" height="300"
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
