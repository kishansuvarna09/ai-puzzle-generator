import React, { useState, useEffect } from 'react';
import { RiddleDisplay } from './RiddleDisplay';

// We'll assume puter is available globally or imported if we had types.
// Since we installed it, we can try importing, but for now let's use window.puter or direct import if possible.
// The user installed @puter/js, so let's try to import it.
// If types are missing we might need a declaration or just use 'any'.
// import puter from 'puter'; // Using global script tag instead

interface RiddleData {
    word: string;
    svg: string;
}

export const GameManager: React.FC = () => {
    const [riddle, setRiddle] = useState<RiddleData | null>(null);
    const [loading, setLoading] = useState(false);
    const [guess, setGuess] = useState('');
    const [status, setStatus] = useState<'GUESSING' | 'CORRECT' | 'REVEALED'>('GUESSING');
    const [feedback, setFeedback] = useState('');

    const fetchRiddle = async () => {
        setLoading(true);
        setRiddle(null);
        setGuess('');
        setStatus('GUESSING');
        setFeedback('');

        try {
            const response = await fetch('http://localhost:8000/generate-puzzle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic: 'idioms' }),
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
                setRiddle(parsed);
            } else {
                console.error("Failed to parse JSON from API response:", content);
                setFeedback("Error generating riddle. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching riddle:", error);
            setFeedback("Failed to connect to Puzzle API. Make sure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiddle();
    }, []);

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (!riddle || status !== 'GUESSING') return;

        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedGuess = normalize(guess);
        const normalizedAnswer = normalize(riddle.word);

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
        if (!riddle) return;
        setStatus('REVEALED');
        setFeedback(`The answer was: ${riddle.word}`);
    };

    return (
        <div className="card">
            <h1>AI Visual Puzzle</h1>

            <RiddleDisplay svgContent={riddle?.svg || null} isLoading={loading} />

            <div className={`status-message ${status === 'CORRECT' ? 'correct' : 'incorrect'}`}>
                {feedback}
            </div>

            {status === 'GUESSING' && (
                <form onSubmit={handleGuess} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="What is the phrase?"
                        autoFocus
                    />
                    <div className="controls">
                        <button type="submit">Guess</button>
                        <button type="button" className="secondary" onClick={handleReveal}>I give up</button>
                    </div>
                </form>
            )}

            {(status === 'CORRECT' || status === 'REVEALED') && (
                <div className="controls">
                    <button onClick={fetchRiddle}>Next Riddle</button>
                </div>
            )}
        </div>
    );
};
