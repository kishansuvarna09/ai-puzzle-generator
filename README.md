# AI Visual Puzzle Generator (Puzzles - Itchyfoot)

A web application that generates visual rebus puzzles using AI (Google Gemini). Players guess the idiom or phrase depicted by the AI-generated SVG image.

## Features

-   **AI-Generated Puzzles**: Uses Google's Gemini model to create unique visual puzzles on the fly.
-   **Interactive UI**: Clean, mobile-friendly interface with a dark, terminal-inspired aesthetic.
-   **Rebus Puzzles**: Focuses on idioms and phrases represented visually (e.g., "Tip of the Iceberg").
-   **Responsive Design**: Works great on both desktop and mobile devices.

## Tech Stack

### Frontend (`client`)
-   **Framework**: React (Vite)
-   **Language**: TypeScript
-   **Styling**: CSS (Custom dark theme, glassmorphism effects)
-   **Font**: Geist Mono & Dancing Script

### Backend (`server`)
-   **Framework**: FastAPI
-   **Language**: Python
-   **AI Model**: Google Gemini (gemini-2.5-flash-lite)

## Setup Instructions

### Prerequisites
-   Node.js 22+ installed
-   Python 3.9+ installed
-   Google Gemini API Key

### Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    -   Windows: `venv\Scripts\activate`
    -   Mac/Linux: `source venv/bin/activate`
4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Create a `.env` file in the `server` directory and add your API key:
    ```env
    GOOGLE_API_KEY=your_api_key_here
    ```
6.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

### Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Run the development server:
    ```bash
    pnpm dev
    ```
    The app will be available at `http://localhost:5173`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
