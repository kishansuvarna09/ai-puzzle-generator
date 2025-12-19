import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PuzzleDisplay } from './PuzzleDisplay'

interface PuzzleData {
  word: string
  svg: string
}

// 1. Define the fetcher function outside the component
// This keeps the component clean and the logic testable
const fetchPuzzleData = async (): Promise<PuzzleData> => {
  const topics = [
    "Famous Movie Quotes", "Rock Band Names", "Kitchen Disasters",
    "Sci-Fi Technology", "Ancient Myths", "Things You Find in a Pocket",
    "Circus Acts", "Under the Ocean", "Time Travel", "Detective Noire",
    "Superstitions", "Breakfast Foods", "Medieval Weaponry",
    "Office Buzzwords", "Haunted House Items", "Retro Video Games",
    "Space Exploration", "Extreme Weather", "Fairy Tale Villains",
    "Wild West Slang", "Astronaut Food", "Secret Agent Gadgets",
    "Shakespearean Insults", "Coffee Shop Orders", "Pirate Lingo"
  ]
  
  const randomTopic = topics[Math.floor(Math.random() * topics.length)]
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'api'

  const response = await fetch(`${API_BASE}/generate-puzzle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: randomTopic }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json()
  const content = data.puzzle

  // Parse logic to handle potential LLM extra text
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  } else {
    throw new Error('Failed to parse puzzle JSON')
  }
}

export const GameManager: React.FC = () => {
  // 2. UI State (Local interaction state)
  const [guess, setGuess] = useState('')
  const [status, setStatus] = useState<'GUESSING' | 'CORRECT' | 'REVEALED'>('GUESSING')
  const [feedback, setFeedback] = useState('')

  // 3. Server State (TanStack Query)
  const { 
    data: puzzle, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isRefetching 
  } = useQuery({
    queryKey: ['puzzle'],
    queryFn: fetchPuzzleData,
    // Prevent auto-refetching on window focus so the game doesn't reset unexpectedly
    refetchOnWindowFocus: false,
    // We treat the data as stale immediately so we can always fetch a new one,
    // but we rely on the manual refetch button.
    staleTime: Infinity, 
  })

  // 4. Reset game state when new data arrives
  useEffect(() => {
    if (puzzle) {
      setGuess('')
      setStatus('GUESSING')
      setFeedback('')
    }
  }, [puzzle])

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault()
    if (!puzzle || status !== 'GUESSING') return

    const normalize = (str: string) =>
      str.toLowerCase().replace(/[^a-z0-9]/g, '')
    const normalizedGuess = normalize(guess)
    const normalizedAnswer = normalize(puzzle.word)

    if (normalizedGuess === normalizedAnswer) {
      setStatus('CORRECT')
      setFeedback('Correct! 🎉')
    } else {
      setFeedback('Not quite, try again!')
      setTimeout(() => setFeedback(''), 2000)
    }
  }

  const handleReveal = () => {
    if (!puzzle) return
    setStatus('REVEALED')
    setFeedback(`The answer was: ${puzzle.word}`)
  }

  // Handle Loading and Error states for display
  const showLoading = isLoading || isRefetching
  const errorMessage = isError ? (error as Error).message : null

  return (
    <div className="game-container">
      <div className="puzzle-section">
        <div className="header-container">
          <h1>Puzzles</h1>
          <p className="subtitle">By ItchyGeek</p>
        </div>
        
        <PuzzleDisplay 
          svgContent={puzzle?.svg || null} 
          isLoading={showLoading} 
        />
        
        {!showLoading && (
          <div className={`status-message ${status === 'CORRECT' ? 'correct' : 'incorrect'}`}>
            {errorMessage || feedback}
          </div>
        )}
      </div>

      <div className="interaction-section">
        {status === 'GUESSING' && !showLoading && !isError && (
          <form onSubmit={handleGuess} className="guess-form" id="guess-form">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="What is the phrase?"
              autoFocus
              autoComplete="off"
            />
          </form>
        )}

        <div className="dock">
          {status === 'GUESSING' ? (
            <>
              <button
                type="submit"
                form="guess-form"
                className="dock-btn primary"
                disabled={showLoading || isError}
              >
                Guess
              </button>
              {/* This "Next" button in the original code revealed the answer */}
              <button
                type="button"
                className="dock-btn secondary"
                onClick={handleReveal}
                disabled={showLoading || isError}
              >
                Reveal / Skip
              </button>
            </>
          ) : (
            <button
              className="dock-btn primary full-width"
              onClick={() => refetch()}
              disabled={showLoading}
            >
              {showLoading ? 'Loading...' : 'Next Puzzle'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}