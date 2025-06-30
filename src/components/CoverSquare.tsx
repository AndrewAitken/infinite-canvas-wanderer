
import React, { useMemo, useRef } from 'react';
import { useAppearAnimation } from '../hooks/useAppearAnimation';
import SimpleImage from './SimpleImage';

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
  isHidden?: boolean;
  isTransitioning?: boolean;
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
  isHidden = false,
  isTransitioning = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Array of RFD album cover images from covers folder
  const albumCovers = [
    '/covers/06.06.2025.jpg',
    '/covers/16.05.2025.jpg', 
    '/covers/2.jpg',
    '/covers/25.04.2025.jpg',
    '/covers/30.05.2025.jpg',
    '/covers/Frame 21.jpg',
    '/covers/Frame 22.jpg',
    '/covers/RFD 06.09.2024.jpg',
    '/covers/RFD01111024.jpg',
    '/covers/RFD03102024.jpg',
    '/covers/RFD04042025.jpg',
    '/covers/RFD08112024-1.jpg',
    '/covers/RFD08112024.jpg',
    '/covers/RFD13122024.jpg',
    '/covers/RFD14022025.jpg',
    '/covers/RFD14032025.jpg',
    '/covers/RFD17012025.jpg',
    '/covers/RFD181024.jpg',
    '/covers/RFD21032025.jpg',
    '/covers/RFD22112024.jpg',
    '/covers/RFD23082024.jpg',
    '/covers/RFD24012025.jpg',
    '/covers/RFD251024.jpg',
    '/covers/RFD27092024.jpg',
    '/covers/RFD28032025.jpg',
    '/covers/RFD29112024.jpg',
    '/covers/RFD30082024.jpg',
    '/covers/RFD31012025.jpg',
    '/covers/RFD_20.06.2025.jpg',
    '/covers/rfd_12.07.2024.jpg',
    '/covers/rfd_16.08.2024.jpg',
    '/covers/rfd_19.07.2024.jpg',
    '/covers/rfd_2.08.2024.jpg',
    '/covers/rfd_21.06.2024.jpg',
    '/covers/rfd_25.07.2024.jpg',
    '/covers/rfd_28.06.2024.jpg'
  ];

  // Improved album cover selection with point index
  const getAlbumCover = (gx: number, gy: number, pIndex: number) => {
    // Используем координаты сектора и индекс точки для выбора обложки
    const hash1 = Math.abs(gx * 97 + gy * 101 + pIndex * 89) % 1009;
    const hash2 = Math.abs(gx * 103 + gy * 107 + pIndex * 91) % 1013;
    const hash3 = Math.abs(gx * 109 + gy * 113 + pIndex * 93) % 1019;

    // Combine hashes for better distribution
    const combinedHash = (hash1 ^ hash2 ^ hash3) % albumCovers.length;
    return albumCovers[combinedHash];
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

  const albumCover = getAlbumCover(gridX, gridY, pointIndex);
  const appearAnimation = useAppearAnimation({
    gridX: gridX + pointIndex,
    gridY: gridY + pointIndex * 2
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAlbumClick(albumCover);
  };

  return (
    <div 
      ref={elementRef}
      style={{
        left: finalX,
        top: finalY,
        opacity: isHidden ? 0 : 1,
        transition: isTransitioning ? 'left 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94), top 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 300ms' : 'opacity 300ms',
        ...appearAnimation
      }} 
      className="absolute animate-[scale-from-zero_var(--appear-duration,0.8s)_cubic-bezier(0.34,1.56,0.64,1)_var(--appear-delay,0s)_both] motion-reduce:animate-none"
    >
      <div style={{
        transform: `scale(${edgeScale})`,
        transformOrigin: 'center',
        width: rectWidth,
        height: rectHeight
      }} onClick={handleClick} className="rounded-xl shadow-lg 
                   transition-all duration-300 ease-out
                   hover:scale-110 hover:shadow-xl cursor-pointer
                   overflow-hidden relative">
        
        <SimpleImage
          src={albumCover}
          alt={`Album cover ${gridX},${gridY}-${pointIndex}`}
          width={rectWidth}
          height={rectHeight}
          className="w-full h-full rounded-xl"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default CoverSquare;
