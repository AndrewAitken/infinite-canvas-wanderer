
import React, { useMemo } from 'react';
import { useAppearAnimation } from '../hooks/useAppearAnimation';

interface OrganicCoverSquareProps {
  x: number;
  y: number;
  size: number;
  id: string;
  imageIndex: number;
  canvasSize: {
    width: number;
    height: number;
  };
  offset: {
    x: number;
    y: number;
  };
  onAlbumClick: (imageUrl: string) => void;
}

const OrganicCoverSquare: React.FC<OrganicCoverSquareProps> = ({
  x,
  y,
  size,
  id,
  imageIndex,
  canvasSize,
  offset,
  onAlbumClick,
}) => {
  // Array of album cover images
  const albumCovers = [
    '/lovable-uploads/c3f650ce-0d59-43cc-8e26-8c669e6de4c1.png',
    '/lovable-uploads/d431adb0-edeb-4ea4-8a10-31c1f0ce5a8b.png',
    '/lovable-uploads/821a0507-d6b1-4abd-8c07-3aa48ccdd9a6.png',
    '/lovable-uploads/84f51610-4978-491e-89b4-a2efeadce87d.png',
    '/lovable-uploads/c2b1beee-fe93-4213-b0af-b93836b1ac29.png',
    '/lovable-uploads/3d59861b-f261-4872-a059-a4d9ae7b0aa2.png',
    '/lovable-uploads/542236e4-a7da-409e-899c-cc3c887ec75f.png',
    '/lovable-uploads/769a9d55-373e-4e6d-9baa-45017b442651.png',
    '/lovable-uploads/65b38ebf-2e37-4b9e-a2e2-b8ffb4a8e91d.png',
    '/lovable-uploads/9149a8f7-07cd-4978-afc9-17a8239bdb77.png',
    '/lovable-uploads/b638bb5f-808f-409e-bf33-0aedf44bbe44.png',
    '/lovable-uploads/2c376bc2-dc4e-4864-b98c-f1c50992694c.png',
    '/lovable-uploads/3f9d29ce-e6cc-40a7-8636-b6092a7083f6.png',
    '/lovable-uploads/167bb702-7c23-48de-bf0c-e9bd91834de5.png',
    '/lovable-uploads/c27bd43f-caa7-44ad-85fb-71800b14235c.png',
    '/lovable-uploads/79bcdddb-c637-40a2-817b-7425acfac2e8.png',
    '/lovable-uploads/571c3acc-f0d4-42dd-8c6e-130482b05062.png',
    '/lovable-uploads/da72b035-70f8-4124-9f58-f3f3fa4db1f8.png',
    '/lovable-uploads/a20e6552-f93d-4cad-8efd-56649da8f2cf.png',
    '/lovable-uploads/6e5a3d1a-f4ef-417a-875a-57e4a2fb0a40.png',
  ];

  const albumCover = albumCovers[imageIndex % albumCovers.length];

  // Расчет масштаба для краев экрана
  const edgeScale = useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) return 1;

    const screenX = x + offset.x;
    const screenY = y + offset.y;

    const centerX = screenX + size / 2;
    const centerY = screenY + size / 2;

    const distanceToLeft = centerX;
    const distanceToRight = canvasSize.width - centerX;
    const distanceToTop = centerY;
    const distanceToBottom = canvasSize.height - centerY;

    const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

    const fadeZone = 350;
    const minScale = 0.15;
    const maxScale = 1.0;
    
    if (minDistance >= fadeZone) {
      return maxScale;
    }

    const normalizedDistance = Math.max(0, minDistance) / fadeZone;
    const t = normalizedDistance;
    const easedDistance = t * t * t * (t * (t * 6 - 15) + 10);

    return minScale + (maxScale - minScale) * easedDistance;
  }, [x, y, size, offset, canvasSize]);

  // Используем координаты для детерминированной анимации
  const gridX = Math.floor(x / 100);
  const gridY = Math.floor(y / 100);
  const appearAnimation = useAppearAnimation({ gridX, gridY });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAlbumClick(albumCover);
  };

  return (
    <div
      style={{
        left: x,
        top: y,
        ...appearAnimation,
      }}
      className="absolute animate-[scale-from-zero_var(--appear-duration,0.8s)_cubic-bezier(0.34,1.56,0.64,1)_var(--appear-delay,0s)_both] motion-reduce:animate-none"
    >
      <div
        style={{
          transform: `scale(${edgeScale})`,
          transformOrigin: 'center',
          width: size,
          height: size,
        }}
        onClick={handleClick}
        className="rounded-lg shadow-lg 
                   transition-all duration-500 ease-out
                   hover:scale-105 hover:shadow-xl cursor-pointer
                   border-2 border-white overflow-hidden"
      >
        <img 
          src={albumCover} 
          alt={`Album cover ${id}`} 
          className="w-full h-full object-cover" 
          draggable={false}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default OrganicCoverSquare;
