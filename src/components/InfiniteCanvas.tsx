import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useDrag } from '../hooks/useDrag';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useVirtualization } from '../hooks/useVirtualization';
import { useFlyingAnimation } from '../hooks/useFlyingAnimation';
import CoverSquare from './CoverSquare';
import AlbumDetailPanel, { AlbumDetailPanelRef } from './AlbumDetailPanel';
import FlyingImageAnimation from './FlyingImageAnimation';
import GridToggle from './GridToggle';
import { getAlbumData, Album, getAlbumIndex, getAllAlbums, getNextAlbumIndex, getPreviousAlbumIndex, getAlbumByIndex } from '../data/albumData';
import { useIsMobile } from '../hooks/use-mobile';
import { useIsTablet } from '../hooks/use-tablet';

// Mobile-optimized grid sizes
const GRID_SIZE_DESKTOP = 400;
const GRID_SIZE_TABLET = 320; // Reduced for better performance
const GRID_SIZE_MOBILE = 280; // Further reduced for mobile
const BUFFER_SIZE_DESKTOP = 2;
const BUFFER_SIZE_MOBILE = 1; // Reduced buffer for mobile performance

// Auto-scroll completely disabled on mobile for better performance
const getAutoScrollConfig = (isMobile: boolean) => ({
  speedX: isMobile ? 0 : 25,
  speedY: isMobile ? 0 : -20,
  enabled: !isMobile,
});

const InfiniteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<AlbumDetailPanelRef>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [hiddenImageKey, setHiddenImageKey] = useState<string | null>(null);
  const [showStaticImage, setShowStaticImage] = useState(false);
  const [pendingAnimation, setPendingAnimation] = useState<{
    imageUrl: string;
    clickPosition: { x: number; y: number };
  } | null>(null);
  const [isGridAligned, setIsGridAligned] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  console.log(`📱 Canvas render - Mobile: ${isMobile}, Tablet: ${isTablet}`);
  
  const allAlbums = getAllAlbums();
  const { animationState, startFlyingAnimation, setAnimationPhase, stopFlyingAnimation } = useFlyingAnimation();
  
  // Mobile-optimized grid and buffer sizes
  const gridSize = isMobile ? GRID_SIZE_MOBILE : isTablet ? GRID_SIZE_TABLET : GRID_SIZE_DESKTOP;
  const bufferSize = isMobile ? BUFFER_SIZE_MOBILE : BUFFER_SIZE_DESKTOP;
  
  const autoScrollConfig = getAutoScrollConfig(isMobile);
  const {
    offset: autoScrollOffset,
    isAutoScrolling,
    pauseAutoScroll,
    resumeAutoScroll,
    setEnabled: setAutoScrollEnabled,
  } = useAutoScroll(autoScrollConfig);

  // Mobile-optimized drag configuration
  const { offset, isDragging, isMomentum, handleMouseDown, handleTouchStart } = useDrag({
    externalOffset: autoScrollOffset,
    onDragStart: pauseAutoScroll,
    onDragEnd: resumeAutoScroll,
  });

  // Debounced resize handler for better mobile performance
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const updateSize = () => {
      if (canvasRef.current) {
        const newSize = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        console.log(`📐 Canvas size updated (mobile: ${isMobile}):`, newSize);
        setCanvasSize(newSize);
      }
    };
    
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateSize, isMobile ? 150 : 100); // Longer debounce on mobile
    };
    
    updateSize();
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateSize, 200); // Wait for orientation change to complete
    });
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', updateSize);
      clearTimeout(resizeTimeout);
    };
  }, [isMobile]);
  
  const visibleItems = useVirtualization({
    offset,
    canvasSize,
    gridSize,
    bufferSize,
    isGridAligned,
  });

  console.log(`🎯 Rendering ${visibleItems.length} items (mobile: ${isMobile})`);

  const handleGridToggle = useCallback(() => {
    console.log(`🔄 Grid toggle - Aligned: ${!isGridAligned}`);
    setIsTransitioning(true);
    setIsGridAligned(prev => !prev);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, isMobile ? 400 : 800); // Faster transitions on mobile
  }, [isGridAligned, isMobile]);

  // Приостанавливаем автоскролл при открытии панели
  useEffect(() => {
    if (isPanelOpen) {
      pauseAutoScroll();
    } else if (!isMobile) { // Возобновляем только если не мобильное устройство
      resumeAutoScroll();
    }
  }, [isPanelOpen, pauseAutoScroll, resumeAutoScroll, isMobile]);

  const handlePanelReady = useCallback(() => {
    console.log('Panel is ready, starting animation');
    
    if (pendingAnimation) {
      const panelImagePos = panelRef.current?.getImagePosition();
      const panelImageSize = panelRef.current?.getImageSize();
      
      if (panelImagePos && panelImageSize) {
        console.log('Start position:', pendingAnimation.clickPosition);
        console.log('Target position:', panelImagePos);
        console.log('Target size:', panelImageSize);
        
        startFlyingAnimation(
          pendingAnimation.imageUrl, 
          pendingAnimation.clickPosition, 
          panelImagePos
        );
        setPendingAnimation(null);
      } else {
        console.warn('Could not get panel image position or size');
        setTimeout(() => {
          const fallbackPos = panelRef.current?.getImagePosition();
          const fallbackSize = panelRef.current?.getImageSize();
          if (fallbackPos && fallbackSize) {
            console.log('Fallback animation start');
            startFlyingAnimation(
              pendingAnimation.imageUrl, 
              pendingAnimation.clickPosition, 
              fallbackPos
            );
          }
          setPendingAnimation(null);
        }, isMobile ? 300 : 600); // Faster fallback on mobile
      }
    }
  }, [pendingAnimation, startFlyingAnimation, isMobile]);

  const handleAlbumClick = useCallback((imageUrl: string, clickPosition: { x: number; y: number }) => {
    console.log(`🎨 Album clicked (mobile: ${isMobile}): ${imageUrl}`);
    
    const albumData = getAlbumData(imageUrl);
    const albumIndex = getAlbumIndex(imageUrl);
    
    const imageKey = `${clickPosition.x}-${clickPosition.y}-${imageUrl}`;
    setHiddenImageKey(imageKey);
    
    setSelectedAlbum(albumData);
    setCurrentAlbumIndex(albumIndex >= 0 ? albumIndex : 0);
    setIsPanelOpen(true);
    setShowStaticImage(false);
    
    setPendingAnimation({ imageUrl, clickPosition });
  }, [isMobile]);

  const handleFlyingAnimationReachTarget = useCallback(() => {
    setShowStaticImage(true);
    setAnimationPhase('showing-in-panel');
  }, [setAnimationPhase]);

  const handleFlyingAnimationComplete = useCallback(() => {
    stopFlyingAnimation();
  }, [stopFlyingAnimation]);

  const handleNextAlbum = useCallback(() => {
    const nextIndex = getNextAlbumIndex(currentAlbumIndex);
    const nextAlbum = getAlbumByIndex(nextIndex);
    
    if (nextAlbum) {
      setSelectedAlbum(nextAlbum);
      setCurrentAlbumIndex(nextIndex);
      setShowStaticImage(true);
    }
  }, [currentAlbumIndex]);

  const handlePreviousAlbum = useCallback(() => {
    const prevIndex = getPreviousAlbumIndex(currentAlbumIndex);
    const prevAlbum = getAlbumByIndex(prevIndex);
    
    if (prevAlbum) {
      setSelectedAlbum(prevAlbum);
      setCurrentAlbumIndex(prevIndex);
      setShowStaticImage(true);
    }
  }, [currentAlbumIndex]);

  const handlePanelClose = useCallback(() => {
    console.log('🚪 Panel closing');
    setIsPanelOpen(false);
    setSelectedAlbum(null);
    setShowStaticImage(false);
    setHiddenImageKey(null);
    setPendingAnimation(null);
  }, []);

  return (
    <>
      <div
        ref={canvasRef}
        className={`fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 ${
          isPanelOpen ? 'backdrop-blur-sm bg-background/80' : ''
        } ${isMobile ? 'touch-pan-x touch-pan-y' : ''}`}
        onMouseDown={!isMobile ? handleMouseDown : undefined}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        style={{ 
          cursor: isDragging ? 'grabbing' : isMomentum ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
          touchAction: isMobile ? 'pan-x pan-y' : 'auto'
        }}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: isDragging || isMomentum ? 'none' : `transform ${isMobile ? '0.2s' : '0.3s'} ease-out`,
            willChange: isDragging || isMomentum ? 'transform' : 'auto', // Optimize for mobile
          }}
        >
          {visibleItems.map((item) => {
            const itemKey = `${item.gridX}-${item.gridY}-${item.pointIndex}`;
            const isHidden = hiddenImageKey?.includes(itemKey) || false;
            
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
                isHidden={isHidden}
                isTransitioning={isTransitioning}
              />
            );
          })}
        </div>

        <div className="fixed bottom-4 right-4 z-50">
          <GridToggle 
            isGridAligned={isGridAligned}
            onToggle={handleGridToggle}
          />
        </div>
      </div>

      <FlyingImageAnimation
        imageUrl={animationState.imageUrl}
        startPosition={animationState.startPosition}
        endPosition={animationState.endPosition}
        isVisible={animationState.isActive}
        onComplete={handleFlyingAnimationComplete}
        onReachTarget={handleFlyingAnimationReachTarget}
        targetImageSize={panelRef.current?.getImageSize() || { width: 300, height: 400 }}
      />

      <AlbumDetailPanel
        ref={panelRef}
        album={selectedAlbum}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        onNext={handleNextAlbum}
        onPrevious={handlePreviousAlbum}
        currentIndex={currentAlbumIndex}
        totalCount={allAlbums.length}
        showStaticImage={showStaticImage}
        onPanelReady={handlePanelReady}
      />
    </>
  );
};

export default InfiniteCanvas;
