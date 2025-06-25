
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
    '/lovable-uploads/b638bb5f-808f-409e-bf33-0aedf44bbe44.png', // Green Day - Dookie
    '/lovable-uploads/2c376bc2-dc4e-4864-b98c-f1c50992694c.png', // Janelle Monae
    '/lovable-uploads/3f9d29ce-e6cc-40a7-8636-b6092a7083f6.png', // Album with red hair
    '/lovable-uploads/167bb702-7c23-48de-bf0c-e9bd91834de5.png', // Nirvana - Nevermind
    '/lovable-uploads/c27bd43f-caa7-44ad-85fb-71800b14235c.png', // David Bowie - Aladdin Sane
    '/lovable-uploads/79bcdddb-c637-40a2-817b-7425acfac2e8.png', // Madness - One Step Beyond
    '/lovable-uploads/571c3acc-f0d4-42dd-8c6e-130482b05062.png', // Queen - News of the World
    '/lovable-uploads/da72b035-70f8-4124-9f58-f3f3fa4db1f8.png', // ANTI - Rihanna
    '/lovable-uploads/a20e6552-f93d-4cad-8efd-56649da8f2cf.png', // Childish Gambino - Awaken
    '/lovable-uploads/6e5a3d1a-f4ef-417a-875a-57e4a2fb0a40.png', // Thundercat - Drunk
  ];

  // Get album cover based on grid position
  const getAlbumCover = (gx: number, gy: number) => {
    const index = Math.abs((gx * 7 + gy * 13) % albumCovers.length);
    return albumCovers[index];
  };

  // Get random offset for more organic positioning
  const getRandomOffset = (gx: number, gy: number) => {
    // Use grid coordinates as seed for deterministic randomness
    const seed1 = Math.abs((gx * 17 + gy * 23) % 1000) / 1000;
    const seed2 = Math.abs((gx * 31 + gy * 41) % 1000) / 1000;
    
    // Random offset range: -30 to +30 pixels
    const offsetX = (seed1 - 0.5) * 60;
    const offsetY = (seed2 - 0.5) * 60;
    
    return { x: offsetX, y: offsetY };
  };

  const randomOffset = getRandomOffset(gridX, gridY);
  const finalX = x + randomOffset.x;
  const finalY = y + randomOffset.y;

  // Calculate scale based on distance to edges
  const scale = useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) return 1;

    // Calculate actual position on screen
    const screenX = finalX + offset.x;
    const screenY = finalY + offset.y;
    const squareSize = 260; // Updated square size

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
  }, [finalX, finalY, offset, canvasSize]);

  const albumCover = getAlbumCover(gridX, gridY);

  return (
    <div
      className="absolute w-[260px] h-[260px] rounded-lg shadow-lg 
                  transform transition-transform duration-200 
                  hover:scale-105 hover:shadow-xl
                  border-2 border-white overflow-hidden"
      style={{
        left: finalX,
        top: finalY,
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
