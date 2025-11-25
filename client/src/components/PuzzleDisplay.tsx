import React from 'react'

interface PuzzleDisplayProps {
  svgContent: string | null
  isLoading: boolean
}

export const PuzzleDisplay: React.FC<PuzzleDisplayProps> = ({
  svgContent,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="svg-container">
        <div className="loading-spinner">Generating Puzzle...</div>
      </div>
    )
  }

  if (!svgContent) {
    return (
      <div className="svg-container">
        <p>No puzzle loaded.</p>
      </div>
    )
  }

  const processSvg = (svg: string) => {
    // Remove fixed width and height attributes
    let processed = svg
      .replace(/width="\d+"/, 'width="100%"')
      .replace(/height="\d+"/, 'height="100%"')

    // Ensure viewBox exists if it's missing (assuming 300x300 based on generation rules)
    if (!processed.includes('viewBox')) {
      processed = processed.replace('<svg', '<svg viewBox="0 0 300 300"')
    }

    return processed
  }

  return (
    <div
      className="svg-container"
      dangerouslySetInnerHTML={{ __html: processSvg(svgContent) }}
    />
  )
}
