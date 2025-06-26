
import React, { useMemo } from 'react';
import { useAppearAnimation } from '../hooks/useAppearAnimation';

interface CoverSquareProps {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  pointIndex?: number;
  canvasSize: {
    width: number;
    height: number;
  };
  offset: {
    x: number;
    y: number;
  };
  onAlbumClick: (imageUrl: string) => void;
  isMobile?: boolean;
  isTablet?: boolean;
  nearbyAlbums?: string[]; // Список соседних обложек для избежания повторений
}

const CoverSquare: React.FC<CoverSquareProps> = ({
  x,
  y,
  gridX,
  gridY,
  pointIndex = 0,
  canvasSize,
  offset,
  onAlbumClick,
  isMobile = false,
  isTablet = false,
  nearbyAlbums = []
}) => {
  // Array of RFD album cover images
  const albumCovers = ['/RFD 06.09.2024.jpg', '/RFD01111024.jpg', '/RFD03102024.jpg', '/RFD04042025.jpg', '/RFD08112024-1.jpg', '/RFD08112024.jpg', '/RFD13122024.jpg', '/RFD14022025.jpg', '/RFD14032025.jpg', '/RFD17012025.jpg', '/RFD181024.jpg', '/RFD21032025.jpg', '/RFD22112024.jpg', '/RFD23082024.jpg', '/RFD24012025.jpg', '/RFD251024.jpg', '/RFD27092024.jpg', '/RFD28032025.jpg', '/RFD29112024.jpg', '/RFD30082024.jpg', '/RFD31012025.jpg', '/RFD_20.06.2025.jpg'];

  // Improved album cover selection avoiding nearby duplicates
  const getAlbumCover = (gx: number, gy: number, pIndex: number, nearby: string[]) => {
    // Создаем несколько вариантов хэшей для выбора
    const hashes = [];
    for (let i = 0; i < 10; i++) {
      const hash1 = Math.abs(gx * (97 + i) + gy * (101 + i) + pIndex * (89 + i)) % 1009;
      const hash2 = Math.abs(gx * (103 + i) + gy * (107 + i) + pIndex * (91 + i)) % 1013;
      const hash3 = Math.abs(gx * (109 + i) + gy * (113 + i) + pIndex * (93 + i)) % 1019;
      const combinedHash = (hash1 ^ hash2 ^ hash3) % albumCovers.length;
      hashes.push(combinedHash);
    }
    
    // Выбираем первую обложку, которой нет среди соседей
    for (const hashIndex of hashes) {
      const candidate = albumCovers[hashIndex];
      if (!nearby.includes(candidate)) {
        return candidate;
      }
    }
    
    // Если все варианты заняты, возвращаем первый (крайний случай)
    return albumCovers[hashes[0]];
  };

  // Размеры элемента
  const rectWidth = isMobile ? 250 : 248;
  const rectHeight = isMobile ? 350 : 331;

  // Позиционирование теперь точное - убираем случайные смещения
  const finalX = x - rectWidth / 2; // Центрируем элемент по точке
  const finalY = y - rectHeight / 2;

  // Вычисление масштаба для краев экрана
  const edgeScale = useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) return 1;
    const screenX = finalX + offset.x;
    const screenY = finalY + offset.y;
    const centerX = screenX + rectWidth / 2;
    const centerY = screenY + rectHeight / 2;
    const distanceToLeft = centerX;
    const distanceToRight = canvasSize.width - centerX;
    const distanceToTop = centerY;
    const distanceToBottom = canvasSize.height - centerY;
    const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

    const fadeZone = 350;
    const minScale = isMobile ? 0.4 : 0.15;
    const maxScale = 1.0;
    
    if (minDistance >= fadeZone) {
      return maxScale;
    }

    const normalizedDistance = Math.max(0, minDistance) / fadeZone;
    const t = normalizedDistance;
    const easedDistance = t * t * t * (t * (t * 6 - 15) + 10);

    return minScale + (maxScale - minScale) * easedDistance;
  }, [finalX, finalY, offset, canvasSize, rectWidth, rectHeight, isMobile]);

  const albumCover = getAlbumCover(gridX, gridY, pointIndex, nearbyAlbums);
  const appearAnimation = useAppearAnimation({
    gridX: gridX + pointIndex,
    gridY: gridY + pointIndex * 2
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAlbumClick(albumCover);
  };

  return (
    <div style={{
      left: finalX,
      top: finalY,
      ...appearAnimation
    }} className="absolute animate-[scale-from-zero_var(--appear-duration,0.8s)_cubic-bezier(0.34,1.56,0.64,1)_var(--appear-delay,0s)_both] motion-reduce:animate-none">
      <div style={{
        transform: `scale(${edgeScale})`,
        transformOrigin: 'center',
        width: rectWidth,
        height: rectHeight
      }} onClick={handleClick} className="rounded-xl shadow-lg 
                   transition-all duration-300 ease-out
                   hover:scale-110 hover:shadow-xl cursor-pointer
                   overflow-hidden">
        <img src={albumCover} alt={`Album cover ${gridX},${gridY}-${pointIndex}`} className="w-full h-full object-cover" draggable={false} loading="lazy" />
      </div>
    </div>
  );
};

export default CoverSquare;
