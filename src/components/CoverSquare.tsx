
import React, { useMemo, useRef, useState, useCallback } from 'react';
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
  onAlbumClick: (imageUrl: string, clickPosition: { x: number; y: number }) => void;
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
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
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
  const getAlbumCover = useCallback((gx: number, gy: number, pIndex: number) => {
    const hash1 = Math.abs(gx * 97 + gy * 101 + pIndex * 89) % 1009;
    const hash2 = Math.abs(gx * 103 + gy * 107 + pIndex * 91) % 1013;
    const hash3 = Math.abs(gx * 109 + gy * 113 + pIndex * 93) % 1019;
    const combinedHash = (hash1 ^ hash2 ^ hash3) % albumCovers.length;
    return albumCovers[combinedHash];
  }, [albumCovers]);

  // Mobile-optimized element sizes
  const rectWidth = isMobile ? 220 : isTablet ? 240 : 248; // Smaller on mobile
  const rectHeight = isMobile ? 300 : isTablet ? 320 : 331; // Smaller on mobile

  // Точное позиционирование
  const finalX = x - rectWidth / 2;
  const finalY = y - rectHeight / 2;

  // Mobile-optimized edge scale calculation
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

    // Mobile-optimized fade zones and scales
    const fadeZone = isMobile ? 200 : 350; // Smaller fade zone on mobile
    const minScale = isMobile ? 0.6 : 0.15; // Higher minimum scale on mobile
    const maxScale = 1.0;
    
    if (minDistance >= fadeZone) {
      return maxScale;
    }

    const normalizedDistance = Math.max(0, minDistance) / fadeZone;
    const t = normalizedDistance;
    // Simplified easing for mobile performance
    const easedDistance = isMobile ? t : t * t * t * (t * (t * 6 - 15) + 10);

    return minScale + (maxScale - minScale) * easedDistance;
  }, [finalX, finalY, offset, canvasSize, rectWidth, rectHeight, isMobile]);

  const albumCover = getAlbumCover(gridX, gridY, pointIndex);
  const appearAnimation = useAppearAnimation({
    gridX: gridX + pointIndex,
    gridY: gridY + pointIndex * 2
  });

  const handleImageLoad = useCallback(() => {
    console.log(`✅ Image loaded (mobile: ${isMobile}): ${albumCover}`);
    setIsLoading(false);
    setImageError(false);
  }, [albumCover, isMobile]);

  const handleImageError = useCallback((error: any) => {
    console.error(`❌ Failed to load image (mobile: ${isMobile}): ${albumCover}`, error);
    setIsLoading(false);
    
    if (retryCount < (isMobile ? 1 : 2)) { // Fewer retries on mobile
      console.log(`🔄 Retrying image load (attempt ${retryCount + 1}): ${albumCover}`);
      const retryDelay = isMobile ? 500 : 1000; // Faster retry on mobile
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageError(false);
        setIsLoading(true);
      }, retryDelay * (retryCount + 1));
    } else {
      console.warn(`⚠️ Image failed to load after retries (mobile: ${isMobile}): ${albumCover}`);
      setImageError(true);
    }
  }, [albumCover, retryCount, isMobile]);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent default touch behavior
    
    console.log(`🎯 Album click - Mobile: ${isMobile}, Album: ${albumCover}`);
    
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const clickPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      
      console.log(`📍 Click position (mobile: ${isMobile}):`, clickPosition);
      onAlbumClick(albumCover, clickPosition);
    }
  }, [isMobile, albumCover, onAlbumClick]);

  return (
    <div 
      ref={elementRef}
      style={{
        left: finalX,
        top: finalY,
        opacity: isHidden ? 0 : 1,
        transition: isTransitioning 
          ? `left ${isMobile ? '400ms' : '800ms'} cubic-bezier(0.25, 0.46, 0.45, 0.94), top ${isMobile ? '400ms' : '800ms'} cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 300ms` 
          : 'opacity 300ms',
        ...appearAnimation
      }} 
      className={`absolute ${isMobile ? '' : 'animate-[scale-from-zero_var(--appear-duration,0.8s)_cubic-bezier(0.34,1.56,0.64,1)_var(--appear-delay,0s)_both]'} motion-reduce:animate-none`}
    >
      <div 
        style={{
          transform: `scale(${edgeScale})`,
          transformOrigin: 'center',
          width: rectWidth,
          height: rectHeight
        }} 
        onClick={!isMobile ? handleClick : undefined}
        onTouchEnd={isMobile ? handleClick : undefined}
        className={`rounded-xl shadow-lg 
                   transition-all duration-300 ease-out
                   ${isMobile ? 'active:scale-95' : 'hover:scale-110 hover:shadow-xl'} 
                   cursor-pointer overflow-hidden relative
                   ${isMobile ? 'touch-manipulation' : ''}`}
      >
        
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} border-2 border-gray-400 border-t-transparent rounded-full animate-spin`}></div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className={`${isMobile ? 'text-xl mb-1' : 'text-2xl mb-2'}`}>🎵</div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>RFD</div>
            </div>
          </div>
        ) : (
          <img 
            src={`${albumCover}?retry=${retryCount}`}
            alt={`Album cover ${gridX},${gridY}-${pointIndex}`} 
            className="w-full h-full object-cover" 
            draggable={false} 
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              imageRendering: isMobile ? 'auto' : 'high-quality', // Optimize for mobile
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CoverSquare;
