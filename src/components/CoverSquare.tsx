
import React, { useMemo } from 'react';

interface CoverSquareProps {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  canvasSize: { width: number; height: number };
  offset: { x: number; y: number };
}

const CoverSquare: React.FC<CoverSquareProps> = ({ 
  x, 
  y, 
  gridX, 
  gridY, 
  canvasSize, 
  offset 
}) => {
  // Generate a consistent color based on grid position
  const getColor = (gx: number, gy: number) => {
    const colors = [
      'bg-blue-400',
      'bg-green-400',
      'bg-purple-400',
      'bg-pink-400',
      'bg-yellow-400',
      'bg-red-400',
      'bg-indigo-400',
      'bg-teal-400',
    ];
    
    const index = Math.abs((gx * 7 + gy * 13) % colors.length);
    return colors[index];
  };

  // Calculate scale based on distance to edges
  const scale = useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) return 1;

    // Calculate actual position on screen
    const screenX = x + offset.x;
    const screenY = y + offset.y;
    const squareSize = 128; // Base square size

    // Calculate center of the square
    const centerX = screenX + squareSize / 2;
    const centerY = screenY + squareSize / 2;

    // Calculate distances to edges
    const distanceToLeft = centerX;
    const distanceToRight = canvasSize.width - centerX;
    const distanceToTop = centerY;
    const distanceToBottom = canvasSize.height - centerY;

    // Find minimum distance to any edge
    const minDistance = Math.min(
      distanceToLeft,
      distanceToRight,
      distanceToTop,
      distanceToBottom
    );

    // Define fade zone (area where scaling begins)
    const fadeZone = 200; // pixels from edge where scaling starts
    const minScale = 0.3;
    const maxScale = 1.0;

    if (minDistance >= fadeZone) {
      return maxScale;
    }

    // Calculate scale with smooth easing
    const normalizedDistance = Math.max(0, minDistance) / fadeZone;
    const easedDistance = 1 - Math.pow(1 - normalizedDistance, 2); // Ease-out quadratic
    
    return minScale + (maxScale - minScale) * easedDistance;
  }, [x, y, offset, canvasSize]);

  const colorClass = getColor(gridX, gridY);

  return (
    <div
      className={`absolute w-32 h-32 ${colorClass} rounded-lg shadow-lg 
                  transform transition-transform duration-200 
                  hover:scale-105 hover:shadow-xl
                  flex items-center justify-center
                  border-2 border-white`}
      style={{
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
    >
      <div className="text-white font-bold text-sm text-center">
        <div>{gridX}</div>
        <div>{gridY}</div>
      </div>
    </div>
  );
};

export default CoverSquare;
