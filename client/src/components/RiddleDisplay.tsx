import React from 'react';

interface RiddleDisplayProps {
    svgContent: string | null;
    isLoading: boolean;
}

export const RiddleDisplay: React.FC<RiddleDisplayProps> = ({ svgContent, isLoading }) => {
    if (isLoading) {
        return (
            <div className="svg-container">
                <div className="loading-spinner">Generating Riddle...</div>
            </div>
        );
    }

    if (!svgContent) {
        return (
            <div className="svg-container">
                <p>No riddle loaded.</p>
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
