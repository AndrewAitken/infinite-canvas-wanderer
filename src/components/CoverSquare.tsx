
import React, { useMemo } from 'react';
import { useAppearAnimation } from '../hooks/useAppearAnimation';
interface CoverSquareProps {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
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
}
const CoverSquare: React.FC<CoverSquareProps> = ({
  x,
  y,
  gridX,
  gridY,
  canvasSize,
  offset,
  onAlbumClick,
  isMobile = false,
  isTablet = false
}) => {
  // Array of RFD album cover images
  const albumCovers = ['/RFD 06.09.2024.jpg', '/RFD01111024.jpg', '/RFD03102024.jpg', '/RFD04042025.jpg', '/RFD08112024-1.jpg', '/RFD08112024.jpg', '/RFD13122024.jpg', '/RFD14022025.jpg', '/RFD14032025.jpg', '/RFD17012025.jpg', '/RFD181024.jpg', '/RFD21032025.jpg', '/RFD22112024.jpg', '/RFD23082024.jpg', '/RFD24012025.jpg', '/RFD251024.jpg', '/RFD27092024.jpg', '/RFD28032025.jpg', '/RFD29112024.jpg', '/RFD30082024.jpg', '/RFD31012025.jpg', '/RFD_20.06.2025.jpg'];

  // Improved album cover selection with better distribution
  const getAlbumCover = (gx: number, gy: number) => {
    // Use multiple large prime numbers for better hash distribution
    const hash1 = Math.abs(gx * 97 + gy * 101) % 1009;
    const hash2 = Math.abs(gx * 103 + gy * 107) % 1013;
    const hash3 = Math.abs(gx * 109 + gy * 113) % 1019;

    // Combine hashes for better distribution
    const combinedHash = (hash1 ^ hash2 ^ hash3) % albumCovers.length;

    // Add sector-based variation to avoid patterns
    const sectorX = Math.floor(gx / 3);
    const sectorY = Math.floor(gy / 3);
    const sectorOffset = Math.abs(sectorX * 127 + sectorY * 131) % albumCovers.length;
    const finalIndex = (combinedHash + sectorOffset) % albumCovers.length;
    return albumCovers[finalIndex];
  };

  // Get random offset for more organic positioning (учитываем планшет)
  const getRandomOffset = (gx: number, gy: number) => {
    // Use grid coordinates as seed for deterministic randomness
    const seed1 = Math.abs((gx * 17 + gy * 23) % 1000) / 1000;
    const seed2 = Math.abs((gx * 31 + gy * 41) % 1000) / 1000;

    // Разные диапазоны смещения для разных устройств
    let offsetRange;
    if (isMobile) {
      offsetRange = 30; // -15 to +15 pixels
    } else if (isTablet) {
      offsetRange = 24; // -12 to +12 pixels для планшета
    } else {
      offsetRange = 60; // -30 to +30 pixels для десктопа
    }
    
    const offsetX = (seed1 - 0.5) * offsetRange;
    const offsetY = (seed2 - 0.5) * offsetRange;
    return {
      x: offsetX,
      y: offsetY
    };
  };
  const randomOffset = getRandomOffset(gridX, gridY);
  const finalX = x + randomOffset.x;
  const finalY = y + randomOffset.y;

  // Размеры элемента остаются те же
  const rectWidth = isMobile ? 250 : 248;
  const rectHeight = isMobile ? 350 : 331;

  // Улучшенное вычисление scale с увеличенным минимальным масштабом для мобила
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

    // Увеличена зона fade для более градуального перехода
    const fadeZone = 350;
    // Увеличенный минимальный масштаб для мобила - с 0.15 до 0.4
    const minScale = isMobile ? 0.4 : 0.15;
    const maxScale = 1.0;
    if (minDistance >= fadeZone) {
      return maxScale;
    }

    // Более плавная cubic-bezier функция вместо квадратичной
    const normalizedDistance = Math.max(0, minDistance) / fadeZone;
    // Используем smooth cubic-bezier easing для очень плавного перехода
    const t = normalizedDistance;
    const easedDistance = t * t * t * (t * (t * 6 - 15) + 10); // Quintic smoothstep function

    return minScale + (maxScale - minScale) * easedDistance;
  }, [finalX, finalY, offset, canvasSize, rectWidth, rectHeight, isMobile]);
  const albumCover = getAlbumCover(gridX, gridY);
  const appearAnimation = useAppearAnimation({
    gridX,
    gridY
  });
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAlbumClick(albumCover);
  };
  return (
    // Outer container - handles appear animation only
    <div style={{
      left: finalX,
      top: finalY,
      ...appearAnimation
    }} className="absolute animate-[scale-from-zero_var(--appear-duration,0.8s)_cubic-bezier(0.34,1.56,0.64,1)_var(--appear-delay,0s)_both] motion-reduce:animate-none">
      {/* Inner container - handles edge scaling only */}
      <div style={{
        transform: `scale(${edgeScale})`,
        transformOrigin: 'center',
        width: rectWidth,
        height: rectHeight
      }} onClick={handleClick} className="rounded-lg shadow-lg 
                   transition-all duration-500 ease-out
                   hover:scale-105 hover:shadow-xl cursor-pointer
                   overflow-hidden">
        <img src={albumCover} alt={`Album cover ${gridX},${gridY}`} className="w-full h-full object-cover" draggable={false} loading="lazy" />
        
      </div>
    </div>
  );
};
export default CoverSquare;
