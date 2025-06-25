
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
  // Array of album cover images
  const albumCovers = [
    '/lovable-uploads/c3f650ce-0d59-43cc-8e26-8c669e6de4c1.png', // DAMN
    '/lovable-uploads/d431adb0-edeb-4ea4-8a10-31c1f0ce5a8b.png', // Pink Floyd
    '/lovable-uploads/821a0507-d6b1-4abd-8c07-3aa48ccdd9a6.png', // Memories
    '/lovable-uploads/84f51610-4978-491e-89b4-a2efeadce87d.png', // New Day
    '/lovable-uploads/c2b1beee-fe93-4213-b0af-b93836b1ac29.png', // Grace Jones
    '/lovable-uploads/3d59861b-f261-4872-a059-a4d9ae7b0aa2.png', // Red Square
    '/lovable-uploads/542236e4-a7da-409e-899c-cc3c887ec75f.png', // Blond
    '/lovable-uploads/769a9d55-373e-4e6d-9baa-45017b442651.png', // Sgt Peppers
    '/lovable-uploads/65b38ebf-2e37-4b9e-a2e2-b8ffb4a8e91d.png', // CapriSongs
    '/lovable-uploads/9149a8f7-07cd-4978-afc9-17a8239bdb77.png', // Cyborg
  ];

  // Get album cover based on grid position
  const getAlbumCover = (gx: number, gy: number) => {
    const index = Math.abs((gx * 7 + gy * 13) % albumCovers.length);
    return albumCovers[index];
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

  const albumCover = getAlbumCover(gridX, gridY);

  return (
    <div
      className="absolute w-32 h-32 rounded-lg shadow-lg 
                  transform transition-transform duration-200 
                  hover:scale-105 hover:shadow-xl
                  border-2 border-white overflow-hidden"
      style={{
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
    >
      <img 
        src={albumCover} 
        alt={`Album cover ${gridX},${gridY}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
      <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
        {gridX},{gridY}
      </div>
    </div>
  );
};

export default CoverSquare;
