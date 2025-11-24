import React from 'react';

interface PuzzleDisplayProps {
    svgContent: string | null;
    isLoading: boolean;
}

export const PuzzleDisplay: React.FC<PuzzleDisplayProps> = ({ svgContent, isLoading }) => {
    if (isLoading) {
        return (
            <div className="svg-container">
                <div className="loading-spinner">Generating Puzzle...</div>
            </div>
        );
    }

    if (!svgContent) {
        return (
            <div className="svg-container">
                <p>No puzzle loaded.</p>
            </div>
        );
    }

    return (
        <div
            className="svg-container"
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};
