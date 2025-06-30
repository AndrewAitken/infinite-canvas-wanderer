
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useDrag } from '../hooks/useDrag';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useVirtualization } from '../hooks/useVirtualization';
import CoverSquare from './CoverSquare';
import ImageZoom from './ImageZoom';
import GridToggle from './GridToggle';
import { useIsMobile } from '../hooks/use-mobile';
import { useIsTablet } from '../hooks/use-tablet';

// Размеры сетки с учетом планшета
const GRID_SIZE_DESKTOP = 400; // 248px элемент + ~152px отступы (минимум 100px)
const GRID_SIZE_TABLET = 312; // 248px элемент + ~64px отступы (минимум 56px)
const GRID_SIZE_MOBILE = 346; // 250px элемент + ~96px отступы (минимум 48px горизонтально)
const BUFFER_SIZE = 2; // Extra cells to render outside viewport

// Настройки автоскролла - медленное диагональное движение (слева снизу → направо вверх)
const AUTO_SCROLL_CONFIG = {
  speedX: 25, // пикселей в секунду вправо
  speedY: -20, // пикселей в секунду вверх (отрицательное значение)
  enabled: true,
};

const InfiniteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isGridAligned, setIsGridAligned] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // Определяем размер сетки в зависимости от устройства
  const gridSize = isMobile ? GRID_SIZE_MOBILE : isTablet ? GRID_SIZE_TABLET : GRID_SIZE_DESKTOP;
  
  // Автоскролл
  const {
    offset: autoScrollOffset,
    isAutoScrolling,
    pauseAutoScroll,
    resumeAutoScroll,
    setEnabled: setAutoScrollEnabled,
  } = useAutoScroll(AUTO_SCROLL_CONFIG);

  // Перетаскивание с интеграцией автоскролла
  const { offset, isDragging, isMomentum, handleMouseDown, handleTouchStart } = useDrag({
    externalOffset: autoScrollOffset,
    onDragStart: pauseAutoScroll,
    onDragEnd: resumeAutoScroll,
  });

  // Update canvas size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  const visibleItems = useVirtualization({
    offset,
    canvasSize,
    gridSize,
    bufferSize: BUFFER_SIZE,
    isGridAligned,
  });

  const handleGridToggle = useCallback(() => {
    setIsTransitioning(true);
    setIsGridAligned(prev => !prev);
    
    // Завершаем анимацию через 800ms
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  }, []);

  // Приостанавливаем автоскролл при открытом zoom
  useEffect(() => {
    if (isZoomed) {
      pauseAutoScroll();
    } else {
      resumeAutoScroll();
    }
  }, [isZoomed, pauseAutoScroll, resumeAutoScroll]);

  const handleAlbumClick = useCallback((imageUrl: string) => {
    setZoomedImageUrl(imageUrl);
    setIsZoomed(true);
  }, []);

  const handleZoomClose = useCallback(() => {
    setIsZoomed(false);
    setZoomedImageUrl(null);
  }, []);

  return (
    <>
      <div
        ref={canvasRef}
        className={`fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 ${
          isZoomed ? 'backdrop-blur-sm bg-background/80' : ''
        }`}
        onMouseDown={!isZoomed ? handleMouseDown : undefined}
        onTouchStart={!isZoomed ? handleTouchStart : undefined}
        style={{ cursor: isDragging ? 'grabbing' : isMomentum ? 'grabbing' : 'grab' }}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: isDragging || isMomentum ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {visibleItems.map((item) => {
            const itemKey = `${item.gridX}-${item.gridY}-${item.pointIndex}`;
            
            return (
              <CoverSquare
                key={itemKey}
                x={item.x}
                y={item.y}
                gridX={item.gridX}
                gridY={item.gridY}
                pointIndex={item.pointIndex}
                canvasSize={canvasSize}
                offset={offset}
                onAlbumClick={handleAlbumClick}
                isMobile={isMobile}
                isTablet={isTablet}
                isHidden={false}
                isTransitioning={isTransitioning}
              />
            );
          })}
        </div>

        {/* Grid Toggle Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <GridToggle 
            isGridAligned={isGridAligned}
            onToggle={handleGridToggle}
          />
        </div>
      </div>

      <ImageZoom
        isOpen={isZoomed}
        imageUrl={zoomedImageUrl}
        onClose={handleZoomClose}
      />
    </>
  );
};

export default InfiniteCanvas;
