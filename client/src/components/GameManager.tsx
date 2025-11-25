import React, { useState, useEffect, useRef } from 'react';
import { PuzzleDisplay } from './PuzzleDisplay';

interface PuzzleData {
    word: string;
    svg: string;
}

export const GameManager: React.FC = () => {
    const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
    const [loading, setLoading] = useState(false);
    const [guess, setGuess] = useState('');
    const [status, setStatus] = useState<'GUESSING' | 'CORRECT' | 'REVEALED'>('GUESSING');
    const [feedback, setFeedback] = useState('');

    const fetchPuzzle = async () => {
        setLoading(true);
        setPuzzle(null);
        setGuess('');
        setStatus('GUESSING');
        setFeedback('');

        const topics = [
            'animals',
            'nature',
            'food',
            'body parts',
            'colors',
            'weather',
            'emotions',
            'time',
            'music',
            'sports'
        ];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];

        try {
            const response = await fetch('http://localhost:8000/generate-puzzle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic: randomTopic }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const content = data.puzzle;

            // Attempt to parse JSON. Sometimes LLMs add extra text.
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                setPuzzle(parsed);
            } else {
                console.error("Failed to parse JSON from API response:", content);
                setFeedback("Error generating puzzle. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching puzzle:", error);
            setFeedback("Failed to connect to Puzzle API. Make sure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchPuzzle();
    }, []);

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (!puzzle || status !== 'GUESSING') return;

        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedGuess = normalize(guess);
        const normalizedAnswer = normalize(puzzle.word);

        if (normalizedGuess === normalizedAnswer) {
            setStatus('CORRECT');
            setFeedback('Correct! 🎉');
        } else {
            setFeedback('Not quite, try again!');
            // Clear feedback after a moment
            setTimeout(() => setFeedback(''), 2000);
        }
    };

    const handleReveal = () => {
        if (!puzzle) return;
        setStatus('REVEALED');
        setFeedback(`The answer was: ${puzzle.word}`);
    };

    return (
        <div className="game-container">
            <div className="puzzle-section">
                <div className="header-container">
                    <h1>Puzzles</h1>
                    <p className="subtitle">By ItchyGeek</p>
                </div>
                <PuzzleDisplay svgContent={puzzle?.svg || null} isLoading={loading} />
                <div className={`status-message ${status === 'CORRECT' ? 'correct' : 'incorrect'}`}>
                    {feedback}
                </div>
            </div>

            <div className="interaction-section">
                {status === 'GUESSING' && (
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
                            <button type="submit" form="guess-form" className="dock-btn primary">
                                Guess
                            </button>
                            <button type="button" className="dock-btn secondary" onClick={handleReveal}>
                                Next
                            </button>
                        </>
                    ) : (
                        <button className="dock-btn primary full-width" onClick={fetchPuzzle}>
                            Next Puzzle
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
