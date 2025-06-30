
import React, { useMemo, useRef, useState } from 'react';
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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Updated array of RFD album cover images - synchronized with actual files in public folder
  const albumCovers = [
    '/RFD 06.09.2024.jpg',
    '/RFD01111024.jpg', 
    '/RFD03102024.jpg',
    '/RFD04042025.jpg',
    '/RFD08112024-1.jpg',
    '/RFD08112024.jpg',
    '/RFD13122024.jpg',
    '/RFD14022025.jpg',
    '/RFD14032025.jpg',
    '/RFD17012025.jpg',
    '/RFD181024.jpg',
    '/RFD21032025.jpg',
    '/RFD22112024.jpg',
    '/RFD23082024.jpg',
    '/RFD24012025.jpg',
    '/RFD251024.jpg',
    '/RFD27092024.jpg',
    '/RFD28032025.jpg',
    '/RFD29112024.jpg',
    '/RFD30082024.jpg',
    '/RFD31012025.jpg',
    '/RFD_20.06.2025.jpg',
    '/16.05.2025.jpg',
    '/06.06.2025.jpg',
    '/25.04.2025.jpg',
    '/30.05.2025.jpg'
  ];

  // Fallback image for error cases
  const fallbackImage = '/placeholder.svg';

  // Improved album cover selection with point index
  const getAlbumCover = (gx: number, gy: number, pIndex: number) => {
    const hash1 = Math.abs(gx * 97 + gy * 101 + pIndex * 89) % 1009;
    const hash2 = Math.abs(gx * 103 + gy * 107 + pIndex * 91) % 1013;
    const hash3 = Math.abs(gx * 109 + gy * 113 + pIndex * 93) % 1019;

    const combinedHash = (hash1 ^ hash2 ^ hash3) % albumCovers.length;
    return albumCovers[combinedHash];
  };

  const rectWidth = isMobile ? 250 : 248;
  const rectHeight = isMobile ? 350 : 331;

  const finalX = x - rectWidth / 2;
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

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    console.log(`✅ Image loaded successfully: ${albumCover}`);
  };

  const handleImageError = () => {
    console.warn(`❌ Failed to load image: ${albumCover}`);
    setImageLoading(false);
    setImageError(true);
    
    // Retry mechanism - try up to 2 times
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageError(false);
        setImageLoading(true);
      }, 1000 * (retryCount + 1)); // Exponential backoff
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const clickPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      // Use the actual image source (fallback if error occurred)
      const imageToUse = imageError ? fallbackImage : albumCover;
      onAlbumClick(imageToUse, clickPosition);
    }
  };

  // Get the current image source
  const currentImageSrc = imageError ? fallbackImage : albumCover;

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
        
        {/* Loading indicator */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-xl">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Main image */}
        <img 
          key={`${currentImageSrc}-${retryCount}`} // Force re-render on retry
          src={currentImageSrc} 
          alt={`Album cover ${gridX},${gridY}-${pointIndex}`} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          draggable={false} 
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Error indicator */}
        {imageError && retryCount >= 2 && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverSquare;
