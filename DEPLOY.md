# Deploying to Vercel

This project is configured for easy deployment on Vercel.

## Steps

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Import Project**: Go to [Vercel](https://vercel.com/), click "Add New...", and select "Project". Import your `ai-puzzle-generator` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect it, or you can leave it as "Other".
    *   **Root Directory**: Leave it as `./` (the root).
    *   **Build Command**: `pnpm build` (configured in `vercel.json`)
    *   **Install Command**: `pnpm install` (configured in `vercel.json`)
    *   **Output Directory**: `client/dist` (This is where Vite outputs the built files).
    *   **Note**: The project is configured to use pnpm. Vercel will automatically detect this from the `vercel.json` configuration.
4.  **Environment Variables**:
    *   Add `GOOGLE_API_KEY` with your Gemini API key.
5.  **Deploy**: Click "Deploy".

## How it Works

*   **Frontend**: The root `package.json` builds the React app in `client/` and outputs it to `client/dist`. Vercel serves these static files.
*   **Backend**: The `vercel.json` file routes requests to `/generate-puzzle` to `server/main.py`. Vercel automatically turns this Python file into a serverless function.
*   **Dependencies**: Vercel installs frontend dependencies from `client/package.json` and backend dependencies from `server/requirements.txt`.
