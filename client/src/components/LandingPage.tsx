import React from 'react';
import landingImage from '../assets/landing-preview.png';

interface LandingPageProps {
    onPlay: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onPlay }) => {
    return (
        <div className="landing-container">
            <div className="header-container landing-header">
                <h1>Puzzles</h1>
                <p className="subtitle">By ItchyGeek</p>
            </div>

            <div className="preview-section">
                <div className="preview-card">
                    <div className="preview-puzzle">
                        <img src={landingImage} alt="Puzzle Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="preview-input">
                        <span>What is the phrase?</span>
                    </div>
                </div>
            </div>

            <div className="landing-actions">
                <button className="play-btn" onClick={onPlay}>
                    Play Now
                </button>
            </div>
        </div>
    );
};
