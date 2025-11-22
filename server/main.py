from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

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
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = f"""Generate a JSON object with two fields: 'word' (the answer to the puzzle, which should be a common phrase, idiom, or compound word related to {request.topic}) and 'svg' (an SVG code string representing a visual puzzle or rebus for that answer. The puzzle should use a combination of simple icons/drawings and text/letters to represent the answer visually. Use bright/white lines on a transparent background so it is visible on a dark theme). The SVG should be self-contained starting with <svg and ending with </svg>. Do not include markdown formatting or code blocks. Just the raw JSON string."""
        response = model.generate_content(prompt)
        return {"puzzle": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
